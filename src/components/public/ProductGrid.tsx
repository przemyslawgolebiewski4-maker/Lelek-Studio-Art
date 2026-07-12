import Image from "next/image";
import Link from "next/link";
import type { Product, ProductCategory } from "@/types/product";

const CATEGORY_LABELS: Record<Product["category"], string> = {
  ceramics: "Functional ceramic",
  vessels: "Vessels",
  "wall-objects": "Wall objects and Objects",
};

const CATEGORY_HEADINGS: Record<Product["category"], { line: string; em: string }> = {
  ceramics: { line: "Made for", em: "everyday ritual" },
  vessels: { line: "Between use", em: "and form" },
  "wall-objects": { line: "Shaped by hand,", em: "placed in space" },
};

const CATEGORY_INTRO: Record<Product["category"], string> = {
  ceramics:
    "Cups and bowls for daily use. Wheel-thrown stoneware with glaze applied by hand — each piece slightly different from the next.",
  vessels: "Stoneware vessels shaped on the wheel — pieces that hold flowers, objects, or space.",
  "wall-objects":
    "Handmade ceramic objects for walls and shelves. Built through intuitive handbuilding — form emerging from the material.",
};

export function ProductCard({
  product,
  portrait = false,
  dark = false,
}: {
  product: Product;
  portrait?: boolean;
  dark?: boolean;
}) {
  return (
    <Link href={`/objects/${product.slug}`} className="product-card">
      <div className={`product-card-img ${portrait ? "portrait" : ""}`}>
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.metaDescription || product.title}
            fill
            className="object-cover"
            sizes="(max-width: 600px) 50vw, 220px"
          />
        ) : (
          product.title
        )}
      </div>
      <div className="product-card-body" style={dark ? { background: "var(--B)", color: "var(--W)" } : undefined}>
        <div className="product-card-title" style={dark ? { color: "var(--W)" } : undefined}>
          {product.title}
        </div>
        <div className="product-card-meta" style={dark ? { color: "var(--W)" } : undefined}>
          {product.material}
        </div>
      </div>
    </Link>
  );
}

function CategorySection({
  category,
  items,
  dark = false,
  etsyUrl,
}: {
  category: ProductCategory;
  items: Product[];
  dark?: boolean;
  etsyUrl?: string;
}) {
  const heading = CATEGORY_HEADINGS[category];

  return (
    <section id={category} className="category-sec">
      <div className={`category-head ${dark ? "dark" : ""}`}>
        <div className="category-intro">
          <div className="sec-eyebrow">{CATEGORY_LABELS[category]}</div>
          <h2 className="category-h2">
            {heading.line}
            <em>{heading.em}</em>
          </h2>
          <p className="category-body">{CATEGORY_INTRO[category]}</p>
          {category === "ceramics" && etsyUrl ? (
            <Link href={etsyUrl} target="_blank" rel="noopener noreferrer" className="link-brutal" style={{ marginTop: 0 }}>
              Available in my Etsy shop ↗
            </Link>
          ) : null}
          {category === "vessels" && etsyUrl ? (
            <Link href={etsyUrl} target="_blank" rel="noopener noreferrer" className="link-brutal" style={{ marginTop: 0 }}>
              Available in my Etsy shop ↗
            </Link>
          ) : null}
          {category === "wall-objects" ? (
            <Link href="/contact" className="link-brutal" style={{ marginTop: 0 }}>
              Get in touch
            </Link>
          ) : null}
        </div>
        <div className="category-grid-wrap">
          <div className="product-grid">
            {items.map((product) => (
              <ProductCard
                key={String(product._id)}
                product={product}
                portrait={category !== "ceramics"}
                dark={dark}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProductGrid({
  products,
  etsyUrl = "https://www.etsy.com/shop/LelekStudio",
}: {
  products: Product[];
  etsyUrl?: string;
}) {
  if (products.length === 0) {
    return (
      <div className="page-content">
        <p className="page-intro">
          No works published yet. Check back soon or{" "}
          <Link href="/contact" className="link-brutal" style={{ marginTop: 0 }}>
            get in touch
          </Link>
          .
        </p>
      </div>
    );
  }

  const groups = (
    [
      { category: "ceramics" as const, items: products.filter((p) => p.category === "ceramics") },
      {
        category: "vessels" as const,
        items: products.filter((p) => p.category === "vessels"),
        dark: true,
      },
      {
        category: "wall-objects" as const,
        items: products.filter((p) => p.category === "wall-objects"),
      },
    ] as const
  ).filter((g) => g.items.length > 0);

  return (
    <>
      {groups.map((group) => (
        <CategorySection
          key={group.category}
          category={group.category}
          items={group.items}
          dark={"dark" in group ? group.dark : false}
          etsyUrl={etsyUrl}
        />
      ))}
    </>
  );
}

export { CATEGORY_LABELS };
