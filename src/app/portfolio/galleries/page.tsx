import type { Metadata } from "next";
import { PortfolioProse } from "@/components/portfolio/PortfolioWorks";
import { getLocale } from "@/lib/i18n/get-locale";
import { getPartnerGalleries, getPortfolio, portfolioMetadata } from "@/lib/portfolio";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const content = await getPortfolio(locale);
  return portfolioMetadata({ ...content, works: [] }, "/galleries");
}

export default async function PortfolioGalleriesPage() {
  const locale = await getLocale();
  const [content, galleries] = await Promise.all([getPortfolio(locale), getPartnerGalleries(locale)]);

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
    </article>
  );
}
