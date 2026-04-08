import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { doubleCsrf } from "csrf-csrf";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { config } from "./config";

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

const isDev = config.isDev;

const productionOrigins = [
  "https://caminoatupropiedad.com",
  "https://www.caminoatupropiedad.com",
  "https://liamyhomes.com",
  "https://www.liamyhomes.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (isDev) return callback(null, true);
      if (
        productionOrigins.includes(origin) ||
        origin.endsWith(".replit.app") ||
        origin.endsWith(".replit.dev") ||
        origin.endsWith(".repl.co") ||
        origin.endsWith(".railway.app")
      ) {
        return callback(null, true);
      }
      callback(new Error("No permitido por CORS"));
    },
    credentials: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "x-csrf-token"],
  }),
);

const cspDirectives: Record<string, string[]> = {
  "default-src": ["'self'"],
  "script-src": isDev
    ? ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://www.googletagmanager.com", "https://www.google-analytics.com", "https://connect.facebook.net"]
    : ["'self'", "'unsafe-inline'", "https://www.googletagmanager.com", "https://www.google-analytics.com", "https://connect.facebook.net"],
  "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
  "font-src": ["'self'", "https://fonts.gstatic.com"],
  "img-src": ["'self'", "data:", "https:", "https://www.facebook.com", "https://www.google-analytics.com"],
  "connect-src": isDev
    ? ["'self'", "https://lianetespinosaojeda.expportal.com", "https://www.google-analytics.com", "https://analytics.google.com", "https://www.facebook.com", "ws:", "wss:"]
    : ["'self'", "https://lianetespinosaojeda.expportal.com", "https://www.google-analytics.com", "https://analytics.google.com", "https://www.facebook.com"],
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
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: config.isProduction,
      sameSite: "strict",
      maxAge: 2 * 60 * 60 * 1000,
    },
  }),
);

const { doubleCsrfProtection, generateCsrfToken } = doubleCsrf({
  getSecret: () => config.sessionSecret,
  getSessionIdentifier: (req) => req.ip || "anonymous",
  cookieName: "__csrf",
  cookieOptions: {
    httpOnly: true,
    sameSite: "strict" as const,
    secure: config.isProduction,
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
  const isProduction = config.isProduction;

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

    if (config.isProduction) {
      return res.status(status).json({
        message: status === 400 ? "Datos inválidos" : "Error interno del servidor",
      });
    }

    return res.status(status).json({ message: err.message });
  });

  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  const port = config.port;
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
