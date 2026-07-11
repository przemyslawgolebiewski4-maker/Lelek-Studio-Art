export const ADMIN_COOKIE = "ls_admin_token";
export const TOKEN_EXPIRY = "7d";
export const MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

export type AdminSession = {
  userId: string;
  email: string;
  name: string;
  adminRole: string;
};

export const adminCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: MAX_AGE_SECONDS,
  path: "/",
};
