import type { Metadata } from "next";
import { PortfolioBanner } from "@/components/portfolio/PortfolioBanner";
import { PortfolioProse, PortfolioWorks } from "@/components/portfolio/PortfolioWorks";
import { ABOUT_URL } from "@/lib/links";
import { getLocale } from "@/lib/i18n/get-locale";
import { getPortfolio, portfolioMetadata } from "@/lib/portfolio";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPortfolio(await getLocale());
  return portfolioMetadata(content, "");
}

export default async function PortfolioHomePage() {
  const content = await getPortfolio(await getLocale());
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: content.name,
    jobTitle: content.role,
    url: `${ABOUT_URL}/`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PortfolioBanner
        name={content.name}
        role={content.role}
        image={content.bannerImage}
        video={content.bannerVideo}
        alt={content.bannerAlt}
      />
      {content.intro.trim() ? (
        <div className="portfolio-home-intro">
          <PortfolioProse text={content.intro} />
        </div>
      ) : null}
      <PortfolioWorks works={content.works} />
    </>
  );
}
