import crypto from "crypto";

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `[Config] Variable de entorno requerida "${name}" no está configurada. Agrégala en los Secrets de Replit.`
    );
  }
  return value;
}

function optional(name: string, fallback?: string): string | undefined {
  return process.env[name] || fallback;
}

const databaseUrl =
  process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "[Config] No se encontró SUPABASE_DATABASE_URL ni DATABASE_URL. Configura al menos una en los Secrets de Replit."
  );
}

const isSupabase = !!process.env.SUPABASE_DATABASE_URL;

const isProduction = process.env.NODE_ENV === "production";

if (isProduction && !process.env.SESSION_SECRET) {
  throw new Error(
    "[Config] SESSION_SECRET es requerido en producción. Configúralo en las variables de entorno de Railway."
  );
}

const sessionSecret =
  process.env.SESSION_SECRET ||
  (() => {
    const generated = crypto.randomBytes(48).toString("hex");
    console.warn(
      "[Config] SESSION_SECRET no configurado. Se generó uno temporal — las sesiones no persistirán entre reinicios."
    );
    return generated;
  })();

export const config = {
  nodeEnv: optional("NODE_ENV", "development")!,
  isProduction: optional("NODE_ENV", "development") === "production",
  isDev: optional("NODE_ENV", "development") !== "production",
  port: parseInt(optional("PORT", "5000")!, 10),

  databaseUrl,
  isSupabase,

  sessionSecret,

  adminUsername: optional("ADMIN_USERNAME", "admin")!,
  adminPassword: isProduction ? required("ADMIN_PASSWORD") : optional("ADMIN_PASSWORD"),

  n8nWebhookUrl: optional("N8N_WEBHOOK_URL"),

  ga4MeasurementId: optional("GA4_MEASUREMENT_ID"),
  fbPixelId: optional("FB_PIXEL_ID"),
} as const;

export type Config = typeof config;
