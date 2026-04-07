import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  city: text("city"),
  budget: text("budget"),
  bedrooms: text("bedrooms"),
  pool: text("pool").default("no"),
  profileType: text("profile_type"),
  propertyAddress: text("property_address"),
  message: text("message"),
  source: text("source"),
  consentedAt: text("consented_at"),
  createdAt: text("created_at").default(sql`now()`),
});

export const insertLeadSchema = createInsertSchema(leads)
  .omit({
    id: true,
    createdAt: true,
  })
  .extend({
    fullName: z.string().min(1).max(100).regex(/^[\p{L}\p{M}\s'.,-]+$/u, "Nombre contiene caracteres no válidos"),
    email: z.string().email("Formato de email inválido").max(254).toLowerCase().trim(),
    phone: z.string().max(20).regex(/^[0-9+\-()\s]*$/, "Teléfono contiene caracteres no válidos").nullish(),
    city: z.string().max(100).nullish(),
    budget: z.string().max(50).nullish(),
    bedrooms: z.string().max(10).nullish(),
    pool: z.string().max(10).nullish(),
    profileType: z.string().max(50).nullish(),
    propertyAddress: z.string().max(200).nullish(),
    message: z.string().max(500).nullish(),
    source: z.string().max(100).nullish(),
    consentedAt: z.string().datetime({ offset: true, message: "Fecha de consentimiento inválida" }).nullish(),
  });

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;
