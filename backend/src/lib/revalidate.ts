/**
 * On-demand ISR: POST to the Next.js /api/revalidate webhook after admin writes.
 * Requires Railway REVALIDATE_SECRET to match Vercel REVALIDATE_SECRET, and FRONTEND_URL.
 * Failures are logged only - admin saves must not fail if revalidation is down.
 */
export async function triggerRevalidate(paths: string[] = ["/"]): Promise<void> {
  const secret = process.env.REVALIDATE_SECRET?.trim();
  const frontend =
    (process.env.FRONTEND_URL || "https://www.lelekstudio.com").trim().replace(/\/+$/, "");

  if (!secret) {
    // Env not configured - site still refreshes via page revalidate = 60
    return;
  }

  const url = `${frontend}/api/revalidate?secret=${encodeURIComponent(secret)}`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paths: paths.length ? paths : ["/"] }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.warn(`revalidate failed (${res.status}): ${text.slice(0, 200)}`);
    }
  } catch (err) {
    console.warn("revalidate request error:", err);
  }
}
