import type { Metadata } from "next";
import { PortfolioProse, PortfolioWorks } from "@/components/portfolio/PortfolioWorks";
import { getLocale } from "@/lib/i18n/get-locale";
import { getPortfolio, portfolioMetadata } from "@/lib/portfolio";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPortfolio(await getLocale());
  return portfolioMetadata(content, "/galleries");
}

export default async function PortfolioGalleriesPage() {
  const content = await getPortfolio(await getLocale());

  return (
    <article className="portfolio-page">
      <header className="portfolio-page-head">
        <h1>{content.galleriesHeading}</h1>
        <PortfolioProse text={content.galleriesIntro} />
      </header>
      <PortfolioWorks works={content.works} />
    </article>
  );
}
