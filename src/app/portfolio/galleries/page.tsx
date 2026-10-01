import type { Metadata } from "next";
import { PortfolioProse, PortfolioWorks } from "@/components/portfolio/PortfolioWorks";
import { getLocale } from "@/lib/i18n/get-locale";
import { getPartnerGalleries, getPortfolio, getPortfolioProducts, portfolioMetadata } from "@/lib/portfolio";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const [content, photos] = await Promise.all([getPortfolio(locale), getPortfolioProducts(locale)]);
  return portfolioMetadata({ ...content, works: photos }, "/galleries");
}

export default async function PortfolioGalleriesPage() {
  const locale = await getLocale();
  const [content, galleries, photos] = await Promise.all([
    getPortfolio(locale),
    getPartnerGalleries(locale),
    getPortfolioProducts(locale),
  ]);

  return (
    <article className="portfolio-page">
      <header className="portfolio-page-head">
        <h1>{content.galleriesHeading}</h1>
        <PortfolioProse text={content.galleriesIntro} />
      </header>
      {galleries.length > 0 ? (
        <ul className="portfolio-partners">
          {galleries.map((gallery) => (
            <li key={gallery._id}>
              <a href={gallery.url} target="_blank" rel="noopener noreferrer">
                {gallery.name}
              </a>
              {gallery.city?.trim() ? <span className="portfolio-partner-city">{gallery.city.trim()}</span> : null}
            </li>
          ))}
        </ul>
      ) : null}
      <PortfolioWorks works={photos} />
    </article>
  );
}
