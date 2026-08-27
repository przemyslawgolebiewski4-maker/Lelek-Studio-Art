import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import { normalizeSlug } from "@/lib/slug";

type OriginalsGridProps = {
  products: Product[];
  inquireHref?: string;
};

export function OriginalsGrid({
  products,
  inquireHref = "/contact",
}: OriginalsGridProps) {
  if (products.length === 0) {
    return (
      <div className="originals-empty">
        No Originals listed yet.{" "}
        <Link href={inquireHref} className="link-brutal" style={{ marginTop: 0 }}>
          Inquire
        </Link>
      </div>
    );
  }

  return (
    <div className="originals-grid">
      {products.map((product) => {
        const slug = normalizeSlug(product.slug) || product.slug;
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
              <Link href={`/objects/${slug}`} className="originals-item-media">
                {sold ? (
                  <span className="originals-item-sold">In a private collection</span>
                ) : null}
                {product.images[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.imageAlt || product.metaDescription || product.title}
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
                  On view at {gallery.name}
                </a>
              ) : null}
            </div>
            <div className="originals-item-meta">
              <span className="originals-catalog">{product.catalog || "-"}</span>
              <Link href={`/objects/${slug}`} className="originals-title">
                {product.title}
              </Link>
              {sold ? (
                <span className="originals-sold-label">In a private collection</span>
              ) : (
                <Link href={inquireHref} className="originals-inquire">
                  Inquire →
                </Link>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
