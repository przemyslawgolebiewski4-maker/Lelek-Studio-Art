import type { Metadata } from "next";
import { SITE_URL } from "@/lib/config";
import { getSiteSettings } from "@/lib/site";
import { DEFAULT_IMPRESSUM } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Impressum",
  alternates: { canonical: `${SITE_URL}/impressum` },
};

export const revalidate = 60;

export default async function ImpressumPage() {
  const settings = await getSiteSettings();
  const body = settings.impressum_body?.trim() || DEFAULT_IMPRESSUM;

  return (
    <article>
      <section className="page-shell">
        <h1 className="page-h1">Impressum</h1>
      </section>

      <div className="page-content">
        <div className="prose-brutal">
          {body.split(/\n\n+/).map((block, i) => (
            <p key={i} style={{ whiteSpace: "pre-line" }}>
              {block}
            </p>
          ))}
        </div>
      </div>
    </article>
  );
}
