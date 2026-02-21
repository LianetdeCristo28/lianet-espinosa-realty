import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema } from "@shared/schema";

// === INTEGRACIÓN n8n ===
// Webhook URL: process.env.N8N_WEBHOOK_URL
// Se dispara al capturar un lead
// Payload: { lead, source, timestamp }

// === ANALYTICS ===
// Google Analytics 4: process.env.GA4_MEASUREMENT_ID
// Facebook Pixel: process.env.FB_PIXEL_ID

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/leads", async (req, res) => {
    try {
      const validated = insertLeadSchema.parse(req.body);
      const lead = await storage.insertLead(validated);

      // === INTEGRACIÓN n8n ===
      // Descomentar cuando N8N_WEBHOOK_URL esté configurado en secrets
      // if (process.env.N8N_WEBHOOK_URL) {
      //   await fetch(process.env.N8N_WEBHOOK_URL, {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({ lead, source: lead.source, timestamp: new Date().toISOString() })
      //   });
      // }

      res.json({ success: true, lead });
    } catch (error) {
      console.error("Error creating lead:", error);
      return res.status(400).json({ message: "Datos inválidos" });
    }
  });

  app.get("/api/leads", async (_req, res) => {
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
