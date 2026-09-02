import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import type { FeaturedSection } from "@/types/content";
import { normalizeSlug } from "@/lib/slug";

export function FeaturedWorks({
  section,
  homeProducts,
}: {
  section?: FeaturedSection;
  homeProducts?: Product[];
}) {
  const s = section ?? {};
  const products = (homeProducts ?? []).slice(0, 3);
  const hasVideo = Boolean(s.video);
  const hasProducts = products.length > 0;

  if (!hasVideo && !hasProducts) return null;

  return (
    <section id="works" className="works">

      {/* Section heading - unchanged from current design */}
      <div className="works-head">
        <h2 className="works-h2">
          {s.heading ?? "Form, surface"}{" "}
          <em>{s.headingEm ?? "and presence"}</em>
        </h2>
        <Link href="/collections" className="works-cta">
          View all works
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
                aria-label={s.videoAlt ?? "Lelek Studio Berlin"}
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
                aria-label={s.videoAlt ?? "Lelek Studio Berlin"}
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
              aria-label={s.videoAlt ?? "Lelek Studio Berlin"}
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
                  alt={product.imageAlt || product.metaDescription || product.title}
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
