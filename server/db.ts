// === BASE DE DATOS ===
// Configurado vía Drizzle ORM + PostgreSQL (Neon)
// Variables de entorno: DATABASE_URL (configurado en Replit secrets)
// Schema definido en shared/schema.ts
// Migraciones: npx drizzle-kit push

import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });
