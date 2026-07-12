function resolveCookieDomain(apiHostname?: string): string | undefined {
  if (!apiHostname?.endsWith("lelekstudio.com")) return undefined;

  const frontendUrl = process.env.FRONTEND_URL;
  if (!frontendUrl) return undefined;

  try {
    const hostname = new URL(frontendUrl).hostname;
    if (hostname === "lelekstudio.com" || hostname.endsWith(".lelekstudio.com")) {
      return ".lelekstudio.com";
    }
  } catch {
    return undefined;
  }

  return undefined;
}

export function adminCookieOptions(apiHostname?: string) {
  const isProduction = process.env.NODE_ENV === "production";
  const domain = resolveCookieDomain(apiHostname);

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: (domain ? "lax" : isProduction ? "none" : "lax") as "none" | "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
    ...(domain ? { domain } : {}),
  };
}
