"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import type { Product, ProductCategory } from "@/types/product";

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  ceramics: "Functional ceramic",
  vessels: "Vessels",
  "wall-objects": "Wall objects and Objects",
};

const CATEGORY_ORDER: ProductCategory[] = ["ceramics", "vessels", "wall-objects"];

const CATEGORY_TAB_LABELS: Record<ProductCategory, string> = {
  ceramics: "Ceramics",
  vessels: "Vessels",
  "wall-objects": "Wall objects",
};

const CATEGORY_INDEX: Record<ProductCategory, string> = {
  ceramics: "01",
  vessels: "02",
  "wall-objects": "03",
};

type FilterCat = "all" | ProductCategory;

function formatCatalog(catalog?: string) {
  if (!catalog) return "-";
  return catalog;
}

export function WorksGrid({
  products,
}: {
  products: Product[];
  /** Kept for call-site compatibility; not shown on the Works grid. */
  etsyUrl?: string;
}) {
  const [filter, setFilter] = useState<FilterCat>("all");

  const counts = {
    ceramics: products.filter((p) => p.category === "ceramics").length,
    vessels: products.filter((p) => p.category === "vessels").length,
    "wall-objects": products.filter((p) => p.category === "wall-objects").length,
  };

  const groups = CATEGORY_ORDER.map((category) => ({
    category,
    items: products.filter((p) => p.category === category),
  })).filter((g) => g.items.length > 0);

  const showSeparators = filter === "all";

  return (
    <div className="works-page">
      <section className="works-header">
        <h1 className="works-title">Works</h1>
        <div className="works-total">{products.length} objects</div>
      </section>

      {products.length === 0 ? (
        <div className="works-empty">
          No works published yet.{" "}
          <Link href="/contact" className="link-brutal" style={{ marginTop: 0 }}>
            Get in touch
          </Link>
        </div>
      ) : (
        <>
          <div className="works-cats" role="tablist" aria-label="Filter works by category">
            <button
              type="button"
              role="tab"
              aria-selected={filter === "all"}
              className={`works-cat-btn${filter === "all" ? " active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All
              <span className="works-cat-count">{products.length}</span>
            </button>
            {CATEGORY_ORDER.map((category) => (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={filter === category}
                className={`works-cat-btn${filter === category ? " active" : ""}`}
                onClick={() => setFilter(category)}
              >
                {CATEGORY_TAB_LABELS[category]}
                <span className="works-cat-count">{counts[category]}</span>
              </button>
            ))}
          </div>

          <div className="works-grid">
            {groups.flatMap((group) => {
              if (filter !== "all" && filter !== group.category) return [];

              const nodes: ReactNode[] = [];

              if (showSeparators) {
                nodes.push(
                  <div key={`cat-${group.category}`} className="works-cat-row" data-cat={group.category}>
                    <span className="works-cat-label">Category {CATEGORY_INDEX[group.category]}</span>
                    <span className="works-cat-name">{CATEGORY_LABELS[group.category]}</span>
                  </div>
                );
              }

              for (const product of group.items) {
                nodes.push(
                  <Link
                    key={String(product._id)}
                    href={`/objects/${product.slug}`}
                    className="works-item"
                    data-cat={product.category}
                  >
                    <span className="works-item-num">{formatCatalog(product.catalog)}</span>
                    {product.soldOut ? (
                      <span className="works-item-sold">Sold</span>
                    ) : null}
                    <div className="works-item-img">
                      {product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.metaDescription || product.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      ) : (
                        product.title
                      )}
                    </div>
                    <div className="works-item-overlay">
                      <div className="works-item-title">{product.title}</div>
                      <div className="works-item-meta">{product.material}</div>
                    </div>
                  </Link>
                );
              }

              return nodes;
            })}
          </div>
        </>
      )}
    </div>
  );
}

/** @deprecated Use WorksGrid - kept for any residual imports */
export function ProductGrid(props: { products: Product[]; etsyUrl?: string }) {
  return <WorksGrid {...props} />;
}
