import type { Metadata } from "next";
import { marked } from "marked";
import { SITE_URL } from "@/lib/config";
import { getSiteSettings } from "@/lib/site";
import { DEFAULT_DATENSCHUTZ } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  alternates: { canonical: `${SITE_URL}/datenschutz` },
};

export const revalidate = 60;

export default async function DatenschutzPage() {
  const settings = await getSiteSettings();
  const markdown = settings.datenschutz_body?.trim() || DEFAULT_DATENSCHUTZ;
  const html = marked.parse(markdown, { async: false }) as string;

  return (
    <article>
      <section className="page-shell">
        <h1 className="page-h1">Datenschutzerklärung</h1>
      </section>

      <div className="page-content">
        <div className="prose-brutal" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </article>
  );
}
