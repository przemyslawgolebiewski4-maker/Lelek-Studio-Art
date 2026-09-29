"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import type { Product } from "@/types/product";
import {
  CATEGORY_ANCHOR,
  CATEGORY_INDEX,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  CATEGORY_TAB_LABELS,
  parseCategoryAnchor,
} from "@/lib/categories";
import { useLocale, useT } from "@/components/i18n/LocaleProvider";
import type { MessageKey } from "@/lib/i18n/messages";
import type { ProductCategory } from "@/types/product";
import { normalizeSlug } from "@/lib/slug";

export { CATEGORY_LABELS };

type FilterCat = "all" | ProductCategory;

function formatCatalog(catalog?: string) {
  if (!catalog) return "-";
  return catalog;
}

function readHashFilter(): FilterCat {
  if (typeof window === "undefined") return "all";
  return parseCategoryAnchor(window.location.hash) ?? "all";
}

export function WorksGrid({
  products,
}: {
  products: Product[];
  /** Kept for call-site compatibility; not shown on the Works grid. */
  etsyUrl?: string;
}) {
  const [filter, setFilter] = useState<FilterCat>("all");
  const tr = useT();
  const locale = useLocale();
  const tabKey: Record<ProductCategory, MessageKey> = {
    ceramics: "cat.ceramics",
    vessels: "cat.vessels",
    "wall-objects": "cat.wall",
    prints: "cat.prints",
  };
  const longKey: Record<ProductCategory, MessageKey> = {
    ceramics: "cat.ceramicsLong",
    vessels: "cat.vessels",
    "wall-objects": "cat.wallLong",
    prints: "cat.prints",
  };

  useEffect(() => {
    const applyHash = () => {
      const next = readHashFilter();
      setFilter(next);
      if (next !== "all") {
        const id = CATEGORY_ANCHOR[next];
        requestAnimationFrame(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    };

    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  const counts = Object.fromEntries(
    CATEGORY_ORDER.map((category) => [
      category,
      products.filter((p) => p.category === category).length,
    ]),
  ) as Record<ProductCategory, number>;

  const groups = CATEGORY_ORDER.map((category) => ({
    category,
    items: products.filter((p) => p.category === category),
  })).filter((g) => g.items.length > 0);

  function selectFilter(next: FilterCat) {
    setFilter(next);
    if (next === "all") {
      const { pathname, search } = window.location;
      window.history.replaceState(null, "", `${pathname}${search}`);
      return;
    }
    window.location.hash = CATEGORY_ANCHOR[next];
  }

  return (
    <div className="works-page">
      <section className="works-header">
        <h1 className="works-title">{tr("works.title")}</h1>
        <div className="works-total">
          {products.length} {tr("works.objects")}
        </div>
      </section>

      {products.length === 0 ? (
        <div className="works-empty">
          {tr("works.empty")}{" "}
          <Link href="/contact" className="link-brutal" style={{ marginTop: 0 }}>
            {tr("find.touch")}
          </Link>
        </div>
      ) : (
        <>
          <div className="works-cats" role="tablist" aria-label={tr("works.filter")}>
            <button
              type="button"
              role="tab"
              aria-selected={filter === "all"}
              className={`works-cat-btn${filter === "all" ? " active" : ""}`}
              onClick={() => selectFilter("all")}
            >
              {tr("works.allFilter")}
              <span className="works-cat-count">{products.length}</span>
            </button>
            {CATEGORY_ORDER.map((category) => (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={filter === category}
                className={`works-cat-btn${filter === category ? " active" : ""}`}
                onClick={() => selectFilter(category)}
              >
                {locale === "pl" ? tr(tabKey[category]) : CATEGORY_TAB_LABELS[category]}
                <span className="works-cat-count">{counts[category]}</span>
              </button>
            ))}
          </div>

          <div className="works-grid">
            {groups.flatMap((group) => {
              if (filter !== "all" && filter !== group.category) return [];

              const nodes: ReactNode[] = [];
              const anchor = CATEGORY_ANCHOR[group.category];

              nodes.push(
                <div
                  key={`cat-${group.category}`}
                  id={anchor}
                  className="works-cat-row"
                  data-cat={group.category}
                >
                  <span className="works-cat-label">
                    {tr("works.category")} {CATEGORY_INDEX[group.category]}
                  </span>
                  <span className="works-cat-name">
                    {locale === "pl" ? tr(longKey[group.category]) : CATEGORY_LABELS[group.category]}
                  </span>
                </div>
              );

              for (const product of group.items) {
                const slug = normalizeSlug(product.slug) || product.slug;
                nodes.push(
                  <Link
                    key={String(product._id)}
                    href={`/objects/${slug}`}
                    className="works-item"
                    data-cat={product.category}
                  >
                    <span className="works-item-num">{formatCatalog(product.catalog)}</span>
                    {product.soldOut ? (
                      <span className="works-item-sold">{tr("works.sold")}</span>
                    ) : null}
                    <div className="works-item-img">
                      {product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.imageAlt || product.metaDescription || product.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, 25vw"
                          style={{ objectPosition: product.thumbnailPosition ?? "center" }}
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
