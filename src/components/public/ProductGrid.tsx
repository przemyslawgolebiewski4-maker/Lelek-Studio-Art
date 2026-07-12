import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";

const CATEGORY_LABELS: Record<Product["category"], string> = {
  ceramics: "Ceramics",
  vessels: "Vessels",
  "wall-objects": "Wall objects",
};

export function ProductCard({ product, index }: { product: Product; index: number }) {
  return (
    <article className="group">
      <p className="cat-num mb-3">{product.catalog || String(index + 1).padStart(3, "0")}</p>
      <Link
        href={`/objects/${product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden border-[3px] border-ink"
      >
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.metaDescription || product.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-sand/40 text-metal">
            {product.title}
          </div>
        )}
      </Link>
      <div className="mt-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-metal">
          {CATEGORY_LABELS[product.category]}
        </p>
        <h2 className="mt-1 text-xl uppercase tracking-[-0.02em]">
          <Link href={`/objects/${product.slug}`} className="hover:text-rust">
            {product.title}
          </Link>
        </h2>
        <p className="cat-num mt-2">{product.material}</p>
      </div>
    </article>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <p className="text-metal">
        No works published yet. Check back soon or{" "}
        <Link href="/contact" className="underline hover:text-rust">
          get in touch
        </Link>
        .
      </p>
    );
  }

  return (
    <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product, index) => (
        <ProductCard key={String(product._id)} product={product} index={index} />
      ))}
    </div>
  );
}

export { CATEGORY_LABELS };
