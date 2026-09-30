import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import type { FeaturedSection } from "@/types/content";
import { withCreatorName } from "@/lib/brand";
import { getLocale } from "@/lib/i18n/get-locale";
import { t } from "@/lib/i18n/messages";
import { localeText } from "@/lib/i18n/present";
import { aboutHref } from "@/lib/links";
import { normalizeSlug } from "@/lib/slug";

export async function FeaturedWorks({
  section,
  homeProducts,
}: {
  section?: FeaturedSection;
  homeProducts?: Product[];
}) {
  const locale = await getLocale();
  const s = section ?? {};
  const products = (homeProducts ?? []).slice(0, 6);
  const hasVideo = Boolean(s.video);
  const hasProducts = products.length > 0;

  if (!hasVideo && !hasProducts) return null;

  const headingEm = s.headingEm?.trim();

  return (
    <section id="works" className="works">

      {/* Section heading - unchanged from current design */}
      <div className="works-head">
        <h2 className="works-h2">
          {s.heading?.trim() || localeText(locale, "Shaped by hand")}
          {headingEm ? (
            <>
              {" "}
              <em>{headingEm}</em>
            </>
          ) : null}
        </h2>
        <Link href={aboutHref("originals")} className="works-cta">
          {t(locale, "works.all")}
        </Link>
      </div>

      {/* Video block - full width, 1920×840 (16:7) on all devices */}
      {hasVideo && (
        <div className="featured-video-block">
          {s.videoMobile ? (
            <>
              <video
                key={s.video}
                autoPlay
                muted
                loop
                playsInline
                aria-label={localeText(locale, s.videoAlt || "Ceramics by Przemysław Gołębiewski")}
                className="featured-video-el featured-video-el--desktop"
              >
                <source src={s.video} />
              </video>
              <video
                key={s.videoMobile}
                autoPlay
                muted
                loop
                playsInline
                aria-label={localeText(locale, s.videoAlt || "Ceramics by Przemysław Gołębiewski")}
                className="featured-video-el featured-video-el--mobile"
              >
                <source src={s.videoMobile} />
              </video>
            </>
          ) : (
            <video
              key={s.video}
              autoPlay
              muted
              loop
              playsInline
              aria-label={localeText(locale, s.videoAlt || "Ceramics by Przemysław Gołębiewski")}
              className="featured-video-el"
            >
              <source src={s.video} />
            </video>
          )}
          {/* Scan-line texture - matches rest of site */}
          <div className="featured-video-scan" aria-hidden="true" />
        </div>
      )}

      {/* 3 product thumbnails from homeVisible products */}
      {hasProducts && (
        <div className="featured-thumbs">
          {products.map((product, i) => (
            <Link
              key={String(product._id)}
              href={`/objects/${normalizeSlug(product.slug) || product.slug}`}
              className="featured-thumb"
            >
              <span className="featured-thumb-num">0{i + 1}</span>
              {product.images[0] ? (
                <Image
                  src={product.images[0]}
                  alt={withCreatorName(product.imageAlt || product.metaDescription || product.title)}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              ) : (
                <div className="featured-thumb-ph">{product.title}</div>
              )}
              <div className="featured-thumb-ov">
                <div className="featured-thumb-title">{product.title}</div>
                <div className="featured-thumb-meta">{product.material}</div>
              </div>
            </Link>
          ))}
        </div>
      )}

    </section>
  );
}
