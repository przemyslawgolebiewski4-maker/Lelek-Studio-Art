import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import { CATEGORY_LABELS } from "@/components/public/ProductGrid";

export function ProductDetail({ product }: { product: Product }) {
  const [hero, ...rest] = product.images;

  return (
    <article className="section-pad page-top">
      <div className="container">
        <Link href="/collections" className="btn-line-dark mb-10 inline-flex">
          ← All works
        </Link>

        <div className="process-grid">
          <div className="space-y-4">
            {hero ? (
              <div className="process-img">
                <Image
                  src={hero}
                  alt={product.metaDescription || product.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 900px) 100vw, 55vw"
                  priority
                />
              </div>
            ) : null}
            {rest.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {rest.map((src) => (
                  <div key={src} className="process-img !aspect-square">
                    <Image src={src} alt={product.title} fill className="object-cover" sizes="25vw" />
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="process-text">
            <div className="sec-tag">{CATEGORY_LABELS[product.category]}</div>
            <h1>{product.title}</h1>
            {product.material ? <p className="story-sig !mt-4 !opacity-100">{product.material}</p> : null}
            {product.description ? <p>{product.description}</p> : null}
            {product.process ? (
              <>
                <div className="divider" />
                <p className="sec-tag">Process</p>
                <p>{product.process}</p>
              </>
            ) : null}
            <div className="mt-8">
              {product.etsyUrl ? (
                <Link
                  href={product.etsyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-line-terra inline-flex"
                >
                  Available on Etsy →
                </Link>
              ) : (
                <Link href="/contact" className="btn-line-terra inline-flex">
                  Inquire about this piece →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
