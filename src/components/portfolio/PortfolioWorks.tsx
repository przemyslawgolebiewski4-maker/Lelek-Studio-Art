import type { PortfolioWork } from "@/lib/portfolio";

export function PortfolioWorks({ works }: { works: PortfolioWork[] }) {
  if (works.length === 0) return null;

  return (
    <div className="portfolio-works">
      {works.map((work, index) => (
        <figure key={`${work.image}-${index}`} className="portfolio-work">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={work.image} alt={work.alt || work.title || ""} />
          {work.title || work.caption ? (
            <figcaption>
              {work.title ? <span className="portfolio-work-title">{work.title}</span> : null}
              {work.caption ? <span className="portfolio-work-caption">{work.caption}</span> : null}
            </figcaption>
          ) : null}
        </figure>
      ))}
    </div>
  );
}

export function PortfolioProse({ text }: { text: string }) {
  if (!text.trim()) return null;
  return <div className="portfolio-prose">{text}</div>;
}
