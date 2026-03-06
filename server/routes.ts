import type { Express } from "express";
import { createServer, type Server } from "http";
import sanitizeHtml from "sanitize-html";
import { storage } from "./storage";
import { insertLeadSchema } from "@shared/schema";
import { requireAuth, verifyPassword } from "./auth";
import { leadLimiter, loginLimiter } from "./index";

const sanitizeOptions: sanitizeHtml.IOptions = {
  allowedTags: [],
  allowedAttributes: {},
};

function sanitizeText(value: unknown): string | undefined | null {
  if (value === null || value === undefined) return value;
  if (typeof value !== "string") return value as any;
  return sanitizeHtml(value.trim(), sanitizeOptions);
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/auth/login", loginLimiter, async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: "Usuario y contraseña requeridos" });
      }

      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }

      const valid = await verifyPassword(password, user.password);
      if (!valid) {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }

      req.session.userId = user.id;
      req.session.username = user.username;

      return res.json({ success: true, username: user.username });
    } catch (error) {
      console.error("Error en login:", error);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Error al cerrar sesión" });
      }
      res.clearCookie("connect.sid");
      return res.json({ success: true });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    if (req.session && req.session.userId) {
      return res.json({ authenticated: true, username: req.session.username });
    }
    return res.json({ authenticated: false });
  });

  app.post("/api/leads", leadLimiter, async (req, res) => {
    try {
      const sanitizedBody = {
        ...req.body,
        fullName: sanitizeText(req.body.fullName),
        email: sanitizeText(req.body.email),
        phone: sanitizeText(req.body.phone),
        city: sanitizeText(req.body.city),
        budget: sanitizeText(req.body.budget),
        bedrooms: sanitizeText(req.body.bedrooms),
        profileType: sanitizeText(req.body.profileType),
        propertyAddress: sanitizeText(req.body.propertyAddress),
        message: sanitizeText(req.body.message),
        source: sanitizeText(req.body.source),
      };

      const validated = insertLeadSchema.parse(sanitizedBody);
      const lead = await storage.insertLead(validated);
      res.json({ success: true, lead });
    } catch (error) {
      console.error("Error creating lead:", error);
      return res.status(400).json({ message: "Datos inválidos" });
    }
  });

  app.get("/api/leads", requireAuth, async (_req, res) => {
    try {
      const leads = await storage.getLeads();
      return res.json(leads);
    } catch (error) {
      console.error("Error fetching leads:", error);
      return res.status(500).json({ message: "Error al obtener los datos" });
    }
  });

  return httpServer;
}
