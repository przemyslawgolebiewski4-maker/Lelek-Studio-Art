import type { Metadata } from "next";
import { marked } from "marked";
import { SITE_URL } from "@/lib/config";
import { getLocale } from "@/lib/i18n/get-locale";
import { DATENSCHUTZ_PL } from "@/lib/i18n/legal-pl";
import { t } from "@/lib/i18n/messages";
import { getSiteSettings } from "@/lib/site";
import { DEFAULT_DATENSCHUTZ } from "@/lib/legal";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: t(locale, "legal.privacy"),
    alternates: { canonical: `${SITE_URL}/datenschutz` },
  };
}

export const revalidate = 60;

export default async function DatenschutzPage() {
  const [settings, locale] = await Promise.all([getSiteSettings(), getLocale()]);
  const markdown =
    locale === "pl"
      ? settings.datenschutz_body_pl?.trim() || DATENSCHUTZ_PL
      : settings.datenschutz_body?.trim() || DEFAULT_DATENSCHUTZ;
  const html = marked.parse(markdown, { async: false }) as string;

  return (
    <article>
      <section className="page-shell">
        <h1 className="page-h1">{locale === "pl" ? "Polityka prywatności" : "Datenschutzerklärung"}</h1>
      </section>

      <div className="page-content">
        <div className="prose-brutal" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </article>
  );
}
