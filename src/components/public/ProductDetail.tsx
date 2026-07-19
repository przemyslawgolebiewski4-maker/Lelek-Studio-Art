import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import { CATEGORY_LABELS } from "@/components/public/ProductGrid";

export function ProductDetail({ product }: { product: Product }) {
  const [hero, ...rest] = product.images;

  return (
    <article>
      <div className="page-shell">
        <Link href="/collections" className="back-link">
          ← All works
        </Link>
      </div>

      <div className="product-detail">
        <div className="product-detail-imgs">
          {hero ? (
            <div className="product-detail-hero">
              <Image
                src={hero}
                alt={product.metaDescription || product.title}
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
                  <Image src={src} alt={product.title} fill className="object-cover" sizes="25vw" />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="product-detail-text">
          <div className="sec-eyebrow">{CATEGORY_LABELS[product.category]}</div>
          <h1>{product.title}</h1>
          {product.material ? (
            <p className="story-sig" style={{ opacity: 1, marginTop: 8 }}>
              {product.material}
            </p>
          ) : null}
          {product.description ? <p className="story-body">{product.description}</p> : null}
          {product.process ? (
            <>
              <div className="story-rule" />
              <div className="sec-eyebrow">Process</div>
              <p className="story-body">{product.process}</p>
            </>
          ) : null}
          <div style={{ marginTop: 32 }}>
            {product.soldOut ? (
              <div className="product-sold-state">
                <div className="product-sold-btn">Sold</div>
                <Link href="/contact" className="product-sold-link">
                  Get in touch for similar pieces
                </Link>
              </div>
            ) : product.etsyUrl ? (
              <Link
                href={product.etsyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-brutal filled"
              >
                Buy now ↗
              </Link>
            ) : (
              <Link href="/contact" className="btn-brutal filled">
                Inquire about this piece
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
