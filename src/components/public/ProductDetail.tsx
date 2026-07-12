import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import { CATEGORY_LABELS } from "@/components/public/ProductGrid";

export function ProductDetail({ product }: { product: Product }) {
  const [hero, ...rest] = product.images;

  return (
    <article className="section-pad pt-28">
      <div className="container-wide">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="cat-num mb-3">{product.catalog}</p>
            <p className="eyebrow mb-2">{CATEGORY_LABELS[product.category]}</p>
            <h1 className="text-[var(--text-3xl)] uppercase tracking-[-0.02em]">{product.title}</h1>
            <p className="cat-num mt-3">{product.material}</p>
          </div>
          <Link href="/collections" className="btn-text">
            ← All works
          </Link>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="space-y-4">
            {hero ? (
              <div className="relative aspect-[4/5] overflow-hidden border-[3px] border-ink">
                <Image
                  src={hero}
                  alt={product.metaDescription || product.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority
                />
              </div>
            ) : null}
            {rest.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {rest.map((src) => (
                  <div key={src} className="relative aspect-square overflow-hidden border border-ink/20">
                    <Image src={src} alt={product.title} fill className="object-cover" sizes="30vw" />
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="lg:sticky lg:top-28">
            {product.description ? (
              <p className="italic-serif text-lg text-metal">{product.description}</p>
            ) : null}
            {product.process ? (
              <div className="mt-8 border-t border-sand pt-6">
                <p className="eyebrow mb-2">Process</p>
                <p className="text-sm leading-relaxed text-metal">{product.process}</p>
              </div>
            ) : null}
            <div className="mt-10 flex flex-wrap gap-4">
              {product.etsyUrl ? (
                <Link
                  href={product.etsyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Available on Etsy ↗
                </Link>
              ) : (
                <Link href="/contact" className="btn-primary">
                  Inquire about this piece ↗
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
