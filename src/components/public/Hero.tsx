import Link from "next/link";
import type { ElementItem } from "@/types/content";
import { MediaBlock } from "@/components/public/MediaBlock";

export type HeroContent = {
  eyebrow?: string;
  headline?: string;
  headlineEm?: string;
  quote?: string;
  subheadline?: string;
  image?: string;
  imageMobile?: string;
  video?: string;
  videoMobile?: string;
  imageAlt?: string;
  imageCaption?: string;
  cta1Text?: string;
  cta1Url?: string;
  cta2Text?: string;
  cta2Url?: string;
  kozodoj?: string;
};

type HeroProps = {
  content: HeroContent;
  elements?: ElementItem[];
};

export function Hero({ content, elements = [] }: HeroProps) {
  const image = content.image ?? "/images/hero/hero-main.jpg";
  const imageMobile = content.imageMobile ?? "/images/hero/hero-main-mobile.jpg";
  const alt = content.imageAlt ?? "Lelek Studio Berlin — handmade ceramics";

  return (
    <section className="hero">
      <div className="hero-img">
        <MediaBlock
          image={image}
          imageMobile={imageMobile}
          video={content.video}
          videoMobile={content.videoMobile}
          alt={alt}
          variant="hero"
        />
        {content.imageCaption ? (
          <div className="hero-img-label">{content.imageCaption}</div>
        ) : null}
      </div>

      <div className="hero-text surface-wabi">
        <div className="hero-top">
          {content.eyebrow ? <div className="hero-eyebrow">{content.eyebrow}</div> : null}
          <h1 className="hero-h1">
            {content.headline}
            {content.headlineEm ? (
              <>
                {" "}
                <em>{content.headlineEm}</em>
              </>
            ) : null}
          </h1>
          <div className="hero-rule" />
          {content.quote ? (
            <p className="hero-quote">&ldquo;{content.quote}&rdquo;</p>
          ) : content.subheadline ? (
            <p className="hero-quote">{content.subheadline}</p>
          ) : null}
          <div className="hero-btns">
            {content.cta1Text ? (
              <Link href={content.cta1Url ?? "/collections"} className="hero-btn filled">
                {content.cta1Text}
              </Link>
            ) : null}
            {content.cta2Text ? (
              <Link href={content.cta2Url ?? "/about"} className="hero-btn">
                {content.cta2Text}
              </Link>
            ) : null}
          </div>
        </div>

        {elements.length > 0 ? (
          <div className="hero-bottom">
            <div className="hero-elements">
              {elements.map((item) => (
                <div key={item.number} className="el">
                  <div className="el-n">{item.number}</div>
                  <div className="el-name">{item.name}</div>
                </div>
              ))}
            </div>
            <div className="hero-kozodoj">
              {content.kozodoj ?? "Lelek — kozodoj — the nightjar — Slavic spirit"}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
