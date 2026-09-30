import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import { withCreatorName } from "@/lib/brand";
import { CATEGORY_LABELS } from "@/lib/categories";
import { getLocale } from "@/lib/i18n/get-locale";
import { t, type MessageKey } from "@/lib/i18n/messages";
import { localeText } from "@/lib/i18n/present";
import { aboutHref } from "@/lib/links";
import type { ProductCategory } from "@/types/product";

const PHOTO_REPRODUCTION_SENTENCE =
  "This poster reproduces a photograph of an original ceramic piece, hand-shaped by Przemysław Gołębiewski - not an illustration.";

const LONG_LABEL: Record<ProductCategory, MessageKey> = {
  ceramics: "cat.ceramicsLong",
  vessels: "cat.vessels",
  "wall-objects": "cat.wallLong",
  prints: "cat.prints",
};

function displayDescription(product: Product, sentence: string): string | null {
  const base = withCreatorName((product.description ?? "").trim());
  if (product.category !== "prints" || !product.isPhotoReproduction) {
    return base || null;
  }

  const marker = sentence.slice(0, 24).toLowerCase();
  if (base.toLowerCase().includes("this poster reproduces a photograph") || base.toLowerCase().includes(marker)) {
    return base;
  }
  return base ? `${base} ${sentence}` : sentence;
}

function productAlt(product: Product): string {
  return withCreatorName(product.imageAlt || product.metaDescription || product.title);
}

export async function ProductDetail({ product }: { product: Product }) {
  const locale = await getLocale();
  const sentence = localeText(locale, PHOTO_REPRODUCTION_SENTENCE);
  const [hero, ...rest] = product.images;
  const description = displayDescription(product, sentence);
  const categoryLabel =
    locale === "pl" ? t(locale, LONG_LABEL[product.category]) : CATEGORY_LABELS[product.category] ?? product.category;
  const gallery =
    !product.soldOut &&
    product.currentGallery &&
    product.currentGallery.name?.trim() &&
    product.currentGallery.url?.trim()
      ? product.currentGallery
      : null;
  const inquireHref = gallery?.url ?? "/contact";
  const inquireExternal = Boolean(gallery?.url);

  return (
    <article>
      <div className="page-shell">
        <Link href={aboutHref("originals")} className="back-link">
          ← {t(locale, "works.allLink")}
        </Link>
      </div>

      <div className="product-detail">
        <div className="product-detail-imgs">
          {hero ? (
            <div className="product-detail-hero">
              <Image
                src={hero}
                alt={productAlt(product)}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          ) : null}
          {rest.length > 0 ? (
            <div className="product-detail-thumbs">
              {rest.map((src) => (
                <div key={src} className="product-detail-thumb">
                  <Image
                    src={src}
                    alt={productAlt(product)}
                    fill
                    className="object-cover"
                    sizes="25vw"
                  />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="product-detail-text">
          {gallery ? (
            <a
              href={gallery.url}
              target="_blank"
              rel="noopener noreferrer"
              className="sec-eyebrow product-on-view"
            >
              {t(locale, "product.onView")} {gallery.name}
            </a>
          ) : (
            <div className="sec-eyebrow">{categoryLabel}</div>
          )}
          <h1>{product.title}</h1>
          {product.material ? (
            <p className="story-sig" style={{ opacity: 1, marginTop: 8 }}>
              {product.material}
            </p>
          ) : null}
          {description ? <p className="story-body">{description}</p> : null}
          {product.process ? (
            <>
              <div className="story-rule" />
              <div className="sec-eyebrow">{t(locale, "product.process")}</div>
              <p className="story-body">{product.process}</p>
            </>
          ) : null}
          <div style={{ marginTop: 32 }}>
            {product.soldOut ? (
              <div className="product-sold-state">
                <div className="product-sold-btn">{t(locale, "product.sold")}</div>
                <Link href="/contact" className="product-sold-link">
                  {t(locale, "product.similar")}
                </Link>
              </div>
            ) : product.isOriginal ? (
              inquireExternal ? (
                <a
                  href={inquireHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-brutal filled"
                >
                  {t(locale, "product.inquireArrow")}
                </a>
              ) : (
                <Link href={inquireHref} className="btn-brutal filled">
                  {t(locale, "product.inquireArrow")}
                </Link>
              )
            ) : product.etsyUrl ? (
              <Link
                href={product.etsyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-brutal filled"
              >
                {t(locale, "product.buy")}
              </Link>
            ) : (
              <Link href="/contact" className="btn-brutal filled">
                {t(locale, "product.inquirePiece")}
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
