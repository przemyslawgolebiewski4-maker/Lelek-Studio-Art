import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User, isLelekAdmin, type IUser } from "@/models";
import {
  ADMIN_COOKIE,
  TOKEN_EXPIRY,
  adminCookieOptions,
  type AdminSession,
} from "@/lib/auth-constants";

export { ADMIN_COOKIE, adminCookieOptions, type AdminSession } from "@/lib/auth-constants";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }
  return secret;
}

export function signAdminToken(payload: AdminSession): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: TOKEN_EXPIRY });
}

export function verifyAdminToken(token: string): AdminSession | null {
  try {
    return jwt.verify(token, getJwtSecret()) as AdminSession;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export function setAdminCookie(response: NextResponse, token: string): NextResponse {
  response.cookies.set(ADMIN_COOKIE, token, adminCookieOptions);
  return response;
}

export function clearAdminCookie(response: NextResponse): NextResponse {
  response.cookies.set(ADMIN_COOKIE, "", { ...adminCookieOptions, maxAge: 0 });
  return response;
}

export async function requireAdmin():
  Promise<
    | { session: AdminSession; user: IUser }
    | NextResponse<{ ok: false; error: string }>
  > {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const user = await User.findById(session.userId).lean<IUser>();
  if (!user || !isLelekAdmin(user)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  return { session, user };
}

export function isUnauthorized(
  result: Awaited<ReturnType<typeof requireAdmin>>,
): result is NextResponse<{ ok: false; error: string }> {
  return result instanceof NextResponse;
}
