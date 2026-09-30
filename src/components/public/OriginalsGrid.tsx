import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import { withCreatorName } from "@/lib/brand";
import { getLocale } from "@/lib/i18n/get-locale";
import { t } from "@/lib/i18n/messages";
import { studioHref } from "@/lib/links";
import { normalizeSlug } from "@/lib/slug";

type OriginalsGridProps = {
  products: Product[];
  inquireHref?: string;
};

export async function OriginalsGrid({
  products,
  inquireHref = "/contact",
}: OriginalsGridProps) {
  const locale = await getLocale();
  if (products.length === 0) {
    return (
      <div className="originals-empty">
        {t(locale, "originals.empty")}{" "}
        <Link href={inquireHref} className="link-brutal" style={{ marginTop: 0 }}>
          {t(locale, "originals.inquire")}
        </Link>
      </div>
    );
  }

  return (
    <div className="originals-grid">
      {products.map((product) => {
        const slug = normalizeSlug(product.slug) || product.slug;
        const objectHref = studioHref(`/objects/${slug}`);
        const sold = Boolean(product.soldOut);
        const gallery =
          !sold &&
          product.currentGallery &&
          product.currentGallery.name?.trim() &&
          product.currentGallery.url?.trim()
            ? product.currentGallery
            : null;

        return (
          <article
            key={String(product._id)}
            className={`originals-item${sold ? " is-sold" : ""}`}
          >
            <div className="originals-item-media-wrap">
              <Link href={objectHref} className="originals-item-media">
                {sold ? (
                  <span className="originals-item-sold">{t(locale, "originals.private")}</span>
                ) : null}
                {product.images[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={withCreatorName(product.imageAlt || product.metaDescription || product.title)}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 33vw"
                    style={{ objectPosition: product.thumbnailPosition ?? "center" }}
                  />
                ) : null}
              </Link>
              {gallery ? (
                <a
                  href={gallery.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="originals-on-view"
                >
                  {t(locale, "product.onView")} {gallery.name}
                </a>
              ) : null}
            </div>
            <div className="originals-item-meta">
              <span className="originals-catalog">{product.catalog || "-"}</span>
              <Link href={objectHref} className="originals-title">
                {product.title}
              </Link>
              {sold ? (
                <span className="originals-sold-label">{t(locale, "originals.private")}</span>
              ) : (
                <Link href={inquireHref} className="originals-inquire">
                  {t(locale, "product.inquireArrow")}
                </Link>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
