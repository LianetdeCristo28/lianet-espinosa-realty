import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { parse as parseConnectionString } from "pg-connection-string";
import { eq, desc } from "drizzle-orm";
import { type User, type InsertUser, type Lead, type InsertLead, users, leads } from "@shared/schema";

const supabaseUrl = process.env.SUPABASE_DATABASE_URL;
const fallbackUrl = process.env.DATABASE_URL;

if (!supabaseUrl && !fallbackUrl) {
  throw new Error("No se encontró una URL de conexión a la base de datos. Configura SUPABASE_DATABASE_URL en las variables de entorno.");
}

let pool: pg.Pool;

if (supabaseUrl) {
  const config = parseConnectionString(supabaseUrl);
  console.log(`[DB] Conectando a Supabase: ${config.host}:${config.port}`);
  pool = new pg.Pool({
    host: config.host ?? undefined,
    port: config.port ? parseInt(String(config.port), 10) : undefined,
    user: config.user ?? undefined,
    password: config.password ?? undefined,
    database: config.database ?? undefined,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });
} else {
  pool = new pg.Pool({
    connectionString: fallbackUrl,
    connectionTimeoutMillis: 10000,
  });
}

pool.on('error', (err) => {
  console.error('[DB] Error en pool:', err.message);
});

pool.query('SELECT 1')
  .then(() => console.log('[DB] Conexión exitosa'))
  .catch((err) => console.error('[DB] Error de conexión:', err.message));

const db = drizzle(pool);

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPassword(id: string, hashedPassword: string): Promise<void>;
  insertLead(lead: InsertLead): Promise<Lead>;
  getLeads(): Promise<Lead[]>;
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
}

export const storage = new DatabaseStorage();
