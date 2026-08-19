/** Lightweight structured logs for abuse / probing signals (stdout). */

export function logSecurityEvent(
  kind: string,
  detail: Record<string, unknown>,
): void {
  const line = {
    ts: new Date().toISOString(),
    kind,
    ...detail,
  };
  console.warn(`[security] ${JSON.stringify(line)}`);
}

export function clientIp(req: { ip?: string; headers: Record<string, unknown> | { get?(n: string): string | undefined } }): string {
  const headers = req.headers as { "x-forwarded-for"?: string; get?: (n: string) => string | undefined };
  const xf =
    typeof headers.get === "function"
      ? headers.get("x-forwarded-for")
      : headers["x-forwarded-for"];
  if (typeof xf === "string" && xf.trim()) {
    return xf.split(",")[0]!.trim();
  }
  return req.ip || "unknown";
}
