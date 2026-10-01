import type { Metadata } from "next";
import { PortfolioProse } from "@/components/portfolio/PortfolioWorks";
import { getLocale } from "@/lib/i18n/get-locale";
import { getPortfolio, portfolioMetadata } from "@/lib/portfolio";
import { getSiteSettings } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPortfolio(await getLocale());
  return portfolioMetadata(content, "/contact");
}

export default async function PortfolioContactPage() {
  const [content, settings] = await Promise.all([
    getPortfolio(await getLocale()),
    getSiteSettings(),
  ]);
  const email = content.contactEmail || settings.email || "lelekstudio@lelekstudio.com";

  return (
    <article className="portfolio-page">
      <header className="portfolio-page-head">
        <h1>{content.contactHeading}</h1>
        <PortfolioProse text={content.contactBody} />
      </header>
      <p className="portfolio-email">
        <a href={`mailto:${email}`}>{email}</a>
      </p>
    </article>
  );
}
