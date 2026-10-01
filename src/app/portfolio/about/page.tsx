import type { Metadata } from "next";
import { PortfolioProse } from "@/components/portfolio/PortfolioWorks";
import { getLocale } from "@/lib/i18n/get-locale";
import { getPortfolio, portfolioMetadata } from "@/lib/portfolio";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPortfolio(await getLocale());
  return portfolioMetadata(content, "/about");
}

export default async function PortfolioAboutPage() {
  const content = await getPortfolio(await getLocale());

  return (
    <article className="portfolio-page">
      <header className="portfolio-page-head">
        <h1>{content.aboutHeading}</h1>
      </header>
      {content.aboutImage ? (
        <figure className="portfolio-portrait">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={content.aboutImage} alt={content.aboutImageAlt || content.name} />
        </figure>
      ) : null}
      <PortfolioProse text={content.aboutBody} />
    </article>
  );
}
