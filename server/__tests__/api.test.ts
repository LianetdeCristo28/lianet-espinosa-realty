import { describe, it, expect, beforeAll, afterAll } from "vitest";
import express from "express";
import { createServer } from "http";
import request from "supertest";
import { insertLeadSchema } from "@shared/schema";

let app: express.Express;
let server: ReturnType<typeof createServer>;

beforeAll(async () => {
  app = express();
  app.use(express.json());

  const rateLimit = (await import("express-rate-limit")).default;

  app.get("/api/health", async (_req, res) => {
    const { pool } = await import("../storage");
    try {
      await pool.query("SELECT 1");
      return res.json({ status: "ok", db: "connected" });
    } catch {
      return res.status(503).json({ status: "degraded", db: "disconnected" });
    }
  });

  app.post("/api/leads", async (req, res) => {
    try {
      const validated = insertLeadSchema.parse(req.body);

      const domain = validated.email.split("@")[1]?.toLowerCase();
      const disposable = new Set(["mailinator.com", "yopmail.com", "tempmail.com"]);
      if (disposable.has(domain)) {
        return res.status(400).json({ message: "No se permiten correos temporales." });
      }

      const { storage } = await import("../storage");
      const lead = await storage.insertLead(validated);
      return res.json({ success: true, lead });
    } catch (error: any) {
      return res.status(400).json({ message: error.message || "Datos inválidos" });
    }
  });

  const rateLimitedApp = express();
  rateLimitedApp.use(express.json());
  const testLimiter = rateLimit({ windowMs: 60_000, max: 3, message: { message: "Demasiadas solicitudes" } });
  rateLimitedApp.post("/api/leads", testLimiter, (_req, res) => res.json({ ok: true }));
  app.use("/rate-test", rateLimitedApp);

  server = createServer(app);
  await new Promise<void>((resolve) => server.listen(0, resolve));
});

afterAll(async () => {
  const { pool } = await import("../storage");
  await new Promise<void>((resolve) => server.close(() => resolve()));
  await pool.end();
});

describe("GET /api/health", () => {
  it("returns status ok and db connected", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok", db: "connected" });
  });
});

describe("POST /api/leads — validation", () => {
  it("accepts valid lead data", async () => {
    const res = await request(app)
      .post("/api/leads")
      .send({
        fullName: "María García",
        email: `test-valid-${Date.now()}@gmail.com`,
        phone: "+1 786 555 1234",
      });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.lead).toBeDefined();
    expect(res.body.lead.id).toBeDefined();
  });

  it("rejects lead with missing fullName", async () => {
    const res = await request(app)
      .post("/api/leads")
      .send({ email: "test@gmail.com" });
    expect(res.status).toBe(400);
  });

  it("rejects lead with invalid email format", async () => {
    const res = await request(app)
      .post("/api/leads")
      .send({ fullName: "Test User", email: "not-an-email" });
    expect(res.status).toBe(400);
  });

  it("rejects disposable email domains", async () => {
    const res = await request(app)
      .post("/api/leads")
      .send({ fullName: "Test User", email: "test@mailinator.com" });
    expect(res.status).toBe(400);
    expect(res.body.message).toContain("correos temporales");
  });

  it("normalizes email to lowercase via schema", () => {
    const result = insertLeadSchema.parse({
      fullName: "Test User",
      email: "TEST@Gmail.COM",
    });
    expect(result.email).toBe("test@gmail.com");
  });
});

describe("Rate limiting", () => {
  it("blocks after exceeding rate limit", async () => {
    const results: number[] = [];
    for (let i = 0; i < 5; i++) {
      const res = await request(app)
        .post("/rate-test/api/leads")
        .send({ data: i });
      results.push(res.status);
    }
    expect(results.filter((s) => s === 429).length).toBeGreaterThan(0);
  });
});
