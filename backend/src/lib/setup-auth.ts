import type { Request } from "express";

export function isSetupAuthorized(req: Request): boolean {
  const secret = process.env.SETUP_SECRET;
  if (!secret) return false;
  const provided = req.query.secret ?? req.headers["x-setup-secret"];
  return typeof provided === "string" && provided === secret;
}

export function setupUnauthorized() {
  return { ok: false as const, error: "Unauthorized" };
}
