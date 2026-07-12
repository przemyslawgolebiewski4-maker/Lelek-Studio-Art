import { cookies } from "next/headers";
import { ADMIN_COOKIE } from "@/lib/auth-constants";
import { API_BASE, API_FETCH_TIMEOUT_MS } from "@/lib/config";

export type AdminSession = {
  name: string;
  email: string;
};

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { Cookie: `${ADMIN_COOKIE}=${token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(API_FETCH_TIMEOUT_MS),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
