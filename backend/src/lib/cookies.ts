function resolveCookieDomain(): string | undefined {
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

export function adminCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";
  const domain = resolveCookieDomain();

  return {
    httpOnly: true,
    secure: isProduction,
    // Shared parent domain (www + api): lax is enough. Railway *.app without domain: none.
    sameSite: (domain ? "lax" : isProduction ? "none" : "lax") as "none" | "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
    ...(domain ? { domain } : {}),
  };
}
