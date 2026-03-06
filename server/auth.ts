import { type Request, type Response, type NextFunction } from "express";
import bcrypt from "bcrypt";
import { storage } from "./storage";

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (req.session && req.session.userId) {
    return next();
  }
  return res.status(401).json({ message: "No autorizado" });
}

export async function ensureAdminUser() {
  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD;

  const existing = await storage.getUserByUsername(adminUsername);
  if (!existing) {
    if (!adminPassword) {
      console.warn("[Auth] ADMIN_PASSWORD no configurado. Configura ADMIN_PASSWORD en las variables de entorno para crear el usuario admin.");
      return;
    }
    const hashed = await hashPassword(adminPassword);
    await storage.createUser({ username: adminUsername, password: hashed });
    console.log("[Auth] Usuario admin creado exitosamente");
  }
}
