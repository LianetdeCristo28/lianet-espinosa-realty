import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { doubleCsrf } from "csrf-csrf";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";

declare module "express-session" {
  interface SessionData {
    userId: string;
    username: string;
  }
}

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

const app = express();
const httpServer = createServer(app);

app.set("trust proxy", 1);

const isDev = process.env.NODE_ENV !== "production";

const cspDirectives: Record<string, string[]> = {
  "default-src": ["'self'"],
  "script-src": isDev
    ? ["'self'", "'unsafe-inline'", "'unsafe-eval'"]
    : ["'self'", "'unsafe-inline'"],
  "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
  "font-src": ["'self'", "https://fonts.gstatic.com"],
  "img-src": ["'self'", "data:", "https:"],
  "connect-src": isDev
    ? ["'self'", "https://lianetespinosaojeda.expportal.com", "ws:", "wss:"]
    : ["'self'", "https://lianetespinosaojeda.expportal.com"],
  "frame-ancestors": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
  "object-src": ["'none'"],
};

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: cspDirectives,
    },
    strictTransportSecurity: {
      maxAge: 31536000,
      includeSubDomains: true,
    },
    xContentTypeOptions: true,
    xFrameOptions: { action: "deny" },
    xXssProtection: false,
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  }),
);

app.use((_req, res, next) => {
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("X-XSS-Protection", "0");
  next();
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Demasiadas solicitudes. Por favor espera unos minutos." },
});

const leadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Demasiadas solicitudes. Por favor espera unos minutos." },
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Demasiadas solicitudes. Por favor espera unos minutos." },
});

app.use("/api/", apiLimiter);

export { leadLimiter, loginLimiter };

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallback-dev-secret-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 2 * 60 * 60 * 1000,
    },
  }),
);

const { doubleCsrfProtection, generateCsrfToken } = doubleCsrf({
  getSecret: () => process.env.SESSION_SECRET || "fallback-dev-secret-change-me",
  getSessionIdentifier: (req) => req.ip || "anonymous",
  cookieName: "__csrf",
  cookieOptions: {
    httpOnly: true,
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  },
  getCsrfTokenFromRequest: (req) => req.headers["x-csrf-token"] as string,
});

app.get("/api/csrf-token", (req, res) => {
  const token = generateCsrfToken(req, res);
  return res.json({ token });
});

app.use((req, res, next) => {
  if (req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS") {
    return next();
  }
  if (req.path.startsWith("/api/")) {
    return doubleCsrfProtection(req, res, next);
  }
  return next();
});

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  const isProduction = process.env.NODE_ENV === "production";

  res.on("finish", () => {
    if (!path.startsWith("/api")) return;

    const duration = Date.now() - start;
    const status = res.statusCode;

    if (isProduction) {
      if (status >= 400) {
        log(`${req.method} ${path} ${status} in ${duration}ms`);
      }
      return;
    }

    let logLine = `${req.method} ${path} ${status} in ${duration}ms`;

    if (path === "/api/leads" && req.method === "POST") {
      logLine += status < 400 ? " :: Lead created successfully" : " :: Lead creation failed";
    }

    log(logLine);
  });

  next();
});

(async () => {
  const { ensureAdminUser } = await import("./auth");
  await ensureAdminUser();

  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;

    console.error(`[Error ${status}]:`, err.message, err.stack);

    if (res.headersSent) {
      return next(err);
    }

    if (process.env.NODE_ENV === "production") {
      return res.status(status).json({
        message: status === 400 ? "Datos inválidos" : "Error interno del servidor",
      });
    }

    return res.status(status).json({ message: err.message });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    },
  );
})();
