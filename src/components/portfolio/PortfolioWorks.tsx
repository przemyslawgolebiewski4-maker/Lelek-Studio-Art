import { getLocale } from "@/lib/i18n/get-locale";
import { t } from "@/lib/i18n/messages";
import type { PortfolioWork } from "@/lib/portfolio";

export async function PortfolioWorks({ works }: { works: PortfolioWork[] }) {
  if (works.length === 0) return null;
  const locale = await getLocale();
  const privateLabel = t(locale, "originals.private");
  const onViewLabel = t(locale, "product.onView");

  return (
    <div className="portfolio-works">
      {works.map((work, index) => {
        const image = (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={work.image} alt={work.alt || work.title || ""} />
        );
        return (
          <figure key={`${work.image}-${index}`} className={work.soldOut ? "portfolio-work is-sold" : "portfolio-work"}>
            <div className="portfolio-work-media">
              {work.galleryUrl ? (
                <a href={work.galleryUrl} target="_blank" rel="noopener noreferrer" className="portfolio-work-link">
                  {image}
                </a>
              ) : (
                image
              )}
              {work.soldOut ? <span className="originals-item-sold">{privateLabel}</span> : null}
              {work.galleryUrl ? (
                <a
                  href={work.galleryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="originals-on-view"
                >
                  {onViewLabel} {work.galleryName}
                </a>
              ) : null}
            </div>
            <figcaption className="originals-item-meta portfolio-work-meta">
              <span className="originals-catalog">{work.caption || "-"}</span>
              {work.title ? <span className="originals-title">{work.title}</span> : null}
              {work.soldOut ? <span className="originals-sold-label">{privateLabel}</span> : null}
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}

export function PortfolioProse({ text }: { text: string }) {
  if (!text.trim()) return null;
  return <div className="portfolio-prose">{text}</div>;
}
