import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { parse as parseConnectionString } from "pg-connection-string";
import { eq, desc, and, gte } from "drizzle-orm";
import { type User, type InsertUser, type Lead, type InsertLead, users, leads } from "@shared/schema";
import { config } from "./config";

let pool: pg.Pool;

if (config.isSupabase) {
  const parsed = parseConnectionString(config.databaseUrl);
  console.log(`[DB] Conectando a Supabase: ${parsed.host}:${parsed.port}`);
  pool = new pg.Pool({
    host: parsed.host ?? undefined,
    port: parsed.port ? parseInt(String(parsed.port), 10) : undefined,
    user: parsed.user ?? undefined,
    password: parsed.password ?? undefined,
    database: parsed.database ?? undefined,
    ssl: { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });
} else {
  pool = new pg.Pool({
    connectionString: config.databaseUrl,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });
}

pool.on("error", (err) => {
  console.error("[DB] Error inesperado en el pool de conexiones:", err.message);
});

pool.query("SELECT 1")
  .then(() => console.log("[DB] Conexión exitosa"))
  .catch((err) => console.error("[DB] Error de conexión:", err.message));

export { pool };

const db = drizzle(pool);

export { db };

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPassword(id: string, hashedPassword: string): Promise<void>;
  insertLead(lead: InsertLead): Promise<Lead>;
  getLeads(): Promise<Lead[]>;
  getLeadByEmailSince(email: string, since: Date): Promise<Lead | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [created] = await db.insert(users).values(user).returning();
    return created;
  }

  async updateUserPassword(id: string, hashedPassword: string): Promise<void> {
    await db.update(users).set({ password: hashedPassword }).where(eq(users.id, id));
  }

  async insertLead(lead: InsertLead): Promise<Lead> {
    const [created] = await db.insert(leads).values(lead).returning();
    return created;
  }

  async getLeads(): Promise<Lead[]> {
    return db.select().from(leads).orderBy(desc(leads.createdAt));
  }

  async getLeadByEmailSince(email: string, since: Date): Promise<Lead | undefined> {
    const [lead] = await db
      .select()
      .from(leads)
      .where(and(eq(leads.email, email), gte(leads.createdAt, since.toISOString())))
      .limit(1);
    return lead;
  }
}

export const storage = new DatabaseStorage();
