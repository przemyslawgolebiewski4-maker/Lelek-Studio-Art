import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import type { FeaturedSection } from "@/types/content";

const GRID_CLASSES = ["tall", "", "", "wide", "", ""] as const;
const PH_CLASSES = ["", "lt", "lt", "", "lt", "lt"] as const;

export function FeaturedWorks({
  products,
  section,
}: {
  products: Product[];
  section?: FeaturedSection;
}) {
  const items = products.slice(0, 6);

  return (
    <section id="works" className="works">
      <div className="works-head">
        <h2 className="works-h2">
          {section?.heading ?? "Form, surface"}
          <em>{section?.headingEm ?? "and presence"}</em>
        </h2>
        <Link href="/collections" className="works-cta">
          View all works
        </Link>
      </div>

      <div className="works-grid">
        {items.map((product, i) => (
          <Link
            key={String(product._id)}
            href={`/objects/${product.slug}`}
            className={`wg ${GRID_CLASSES[i] ?? ""}`}
          >
            <div className={`wg-ph ${PH_CLASSES[i] ?? ""}`}>
              {product.images[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.metaDescription || product.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              ) : null}
              <span className="wg-label">{product.title}</span>
            </div>
            <div className="wg-ov">
              <div className="wg-t">{product.title}</div>
              <div className="wg-m">{product.material}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
