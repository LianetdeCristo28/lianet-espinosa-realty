import type { Express } from "express";
import { createServer, type Server } from "http";
import { promises as dns } from "dns";
import sanitizeHtml from "sanitize-html";
import { storage, pool } from "./storage";
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

const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "tempmail.com",
  "throwaway.email",
  "guerrillamail.com",
  "guerrillamail.net",
  "sharklasers.com",
  "grr.la",
  "guerrillamailblock.com",
  "yopmail.com",
  "trashmail.com",
  "trashmail.net",
  "dispostable.com",
  "maildrop.cc",
  "fakeinbox.com",
  "tempail.com",
  "temp-mail.org",
  "10minutemail.com",
  "mohmal.com",
  "getnada.com",
  "emailondeck.com",
  "mintemail.com",
]);

async function validateEmailDomain(email: string): Promise<{ valid: boolean; reason?: string }> {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) {
    return { valid: false, reason: "Formato de email inválido" };
  }

  if (DISPOSABLE_DOMAINS.has(domain)) {
    return { valid: false, reason: "No se permiten correos temporales. Usa tu email personal o profesional." };
  }

  try {
    const records = await dns.resolveMx(domain);
    if (!records || records.length === 0) {
      return { valid: false, reason: "El dominio del email no acepta correos. Verifica tu dirección." };
    }
    return { valid: true };
  } catch {
    return { valid: false, reason: "El dominio del email no es válido. Verifica tu dirección." };
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/api/health", async (_req, res) => {
    try {
      await pool.query("SELECT 1");
      return res.json({ status: "ok", db: "connected" });
    } catch {
      return res.status(503).json({ status: "degraded", db: "disconnected" });
    }
  });

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
        consentedAt: req.body.consentedAt,
      };

      if (!sanitizedBody.consentedAt) {
        return res.status(400).json({ message: "Debes aceptar la política de privacidad para continuar." });
      }

      const validated = insertLeadSchema.parse(sanitizedBody);

      const emailCheck = await validateEmailDomain(validated.email);
      if (!emailCheck.valid) {
        return res.status(400).json({ message: emailCheck.reason });
      }

      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const recentLead = await storage.getLeadByEmailSince(validated.email, twentyFourHoursAgo);
      if (recentLead) {
        return res.json({ success: true, lead: recentLead, duplicate: true });
      }

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

  app.get("/api/admin/export-leads", requireAuth, async (_req, res) => {
    try {
      const leads = await storage.getLeads();

      const csvHeaders = [
        "ID",
        "Nombre",
        "Email",
        "Teléfono",
        "Ciudad",
        "Presupuesto",
        "Habitaciones",
        "Piscina",
        "Tipo de Perfil",
        "Dirección Propiedad",
        "Mensaje",
        "Fuente",
        "Consentimiento",
        "Fecha de Creación",
      ];

      const escapeField = (val: string | null | undefined): string => {
        if (val === null || val === undefined) return "";
        const str = String(val);
        if (str.includes(",") || str.includes('"') || str.includes("\n")) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      };

      const rows = leads.map((lead) =>
        [
          lead.id,
          lead.fullName,
          lead.email,
          lead.phone,
          lead.city,
          lead.budget,
          lead.bedrooms,
          lead.pool,
          lead.profileType,
          lead.propertyAddress,
          lead.message,
          lead.source,
          lead.consentedAt,
          lead.createdAt,
        ]
          .map(escapeField)
          .join(","),
      );

      const csv = [csvHeaders.join(","), ...rows].join("\n");
      const timestamp = new Date().toISOString().split("T")[0];

      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="leads_${timestamp}.csv"`,
      );
      return res.send("\uFEFF" + csv);
    } catch (error) {
      console.error("Error exporting leads:", error);
      return res.status(500).json({ message: "Error al exportar los datos" });
    }
  });

  return httpServer;
}
