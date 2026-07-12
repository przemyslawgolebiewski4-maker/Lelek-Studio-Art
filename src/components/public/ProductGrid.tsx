import Image from "next/image";
import Link from "next/link";
import type { Product, ProductCategory } from "@/types/product";

const CATEGORY_LABELS: Record<Product["category"], string> = {
  ceramics: "Ceramics",
  vessels: "Vessels",
  "wall-objects": "Wall objects",
};

const CATEGORY_INTRO: Record<Product["category"], string> = {
  ceramics: "Cups and bowls for daily use. Wheel-thrown stoneware with glaze applied by hand.",
  vessels: "Stoneware vessels shaped on the wheel — pieces that hold flowers, objects, or space.",
  "wall-objects":
    "Handmade ceramic objects for walls and shelves — built through intuitive handbuilding.",
};

export function ProductCard({
  product,
  portrait = false,
}: {
  product: Product;
  portrait?: boolean;
}) {
  return (
    <Link href={`/objects/${product.slug}`} className="card">
      <div
        className={`card-thumb relative ${portrait ? "card-thumb-ratio-portrait" : "card-thumb-ratio-1"}`}
      >
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.metaDescription || product.title}
            fill
            className="object-cover"
            sizes="(max-width: 600px) 50vw, 220px"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-stone text-muted">{product.title}</div>
        )}
      </div>
      <div className="card-body">
        <div className="card-title">{product.title}</div>
        <div className="card-meta">{product.material}</div>
      </div>
    </Link>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <p className="sec-intro">
        No works published yet. Check back soon or{" "}
        <Link href="/contact" className="text-terra underline-offset-2 hover:underline">
          get in touch
        </Link>
        .
      </p>
    );
  }

  const groups: { category: ProductCategory; items: Product[] }[] = (
    [
      { category: "ceramics" as const, items: products.filter((p) => p.category === "ceramics") },
      { category: "vessels" as const, items: products.filter((p) => p.category === "vessels") },
      {
        category: "wall-objects" as const,
        items: products.filter((p) => p.category === "wall-objects"),
      },
    ] as const
  ).filter((g) => g.items.length > 0);

  return (
    <div>
      {groups.map(({ category, items }, index) => (
        <section
          key={category}
          className={`py-12 ${index % 2 === 0 ? "collection-sec" : "collection-sec-alt"}`}
        >
          <div className="container">
            <div className="sec-head">
              <div>
                <div className="sec-tag">{CATEGORY_LABELS[category]}</div>
                <h2>
                  {category === "ceramics" && (
                    <>
                      Made for <em>everyday ritual</em>
                    </>
                  )}
                  {category === "vessels" && (
                    <>
                      Between use <em>and form</em>
                    </>
                  )}
                  {category === "wall-objects" && (
                    <>
                      Shaped by hand, <em>placed in space</em>
                    </>
                  )}
                </h2>
              </div>
              <p className="sec-intro">{CATEGORY_INTRO[category]}</p>
            </div>
            <div className={category === "ceramics" ? "grid-square" : "grid-portrait"}>
              {items.map((product) => (
                <ProductCard
                  key={String(product._id)}
                  product={product}
                  portrait={category !== "ceramics"}
                />
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

export { CATEGORY_LABELS };
