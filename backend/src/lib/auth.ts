import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import type { Request, Response, NextFunction } from "express";
import { connectDB } from "./db";
import { User, isLelekAdmin, type IUser } from "../models";

const SECRET = process.env.JWT_SECRET!;
export const COOKIE_NAME = "ls_admin_token";

export function signToken(userId: string): string {
  return jwt.sign({ sub: userId }, SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): { sub: string } | null {
  try {
    return jwt.verify(token, SECRET) as { sub: string };
  } catch {
    return null;
  }
}

export async function hashPassword(p: string) {
  return bcrypt.hash(p, 12);
}

export async function comparePassword(p: string, hash: string) {
  return bcrypt.compare(p, hash);
}

export type AdminRequest = Request & { admin: IUser };

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const token =
      req.cookies?.[COOKIE_NAME] ?? req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const payload = verifyToken(token);
    if (!payload) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    await connectDB();
    const user = await User.findById(payload.sub);
    if (!user || !isLelekAdmin(user)) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    (req as AdminRequest).admin = user;
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
}
