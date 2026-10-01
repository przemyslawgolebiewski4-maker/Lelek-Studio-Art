import type { Metadata } from "next";
import { PortfolioBanner } from "@/components/portfolio/PortfolioBanner";
import { PortfolioProse, PortfolioWorks } from "@/components/portfolio/PortfolioWorks";
import { resolveInstagramUrl, resolveShopUrl } from "@/lib/config";
import { getLocale } from "@/lib/i18n/get-locale";
import { getPortfolio, getPortfolioProducts, portfolioMetadata, portfolioStructuredData } from "@/lib/portfolio";
import { getSiteSettings } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const [content, photos] = await Promise.all([getPortfolio(locale), getPortfolioProducts(locale)]);
  return portfolioMetadata({ ...content, works: photos }, "");
}

export default async function PortfolioHomePage() {
  const locale = await getLocale();
  const [content, photos, settings] = await Promise.all([
    getPortfolio(locale),
    getPortfolioProducts(locale),
    getSiteSettings(),
  ]);
  const jsonLd = portfolioStructuredData(content, [
    resolveInstagramUrl(settings.instagram),
    resolveShopUrl(settings),
  ]);

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
      <PortfolioWorks works={photos} />
    </>
  );
}
