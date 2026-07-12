import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import type { FeaturedSection } from "@/types/content";

export function FeaturedWorks({
  products,
  section,
}: {
  products: Product[];
  section?: FeaturedSection;
}) {
  return (
    <section id="featured" className="section-pad featured-sec">
      <div className="container" id="works">
        {section?.eyebrow ? <div className="sec-tag">{section.eyebrow}</div> : null}
        <h2>
          {section?.heading ?? "Currently"}{" "}
          {section?.headingEm ? (
            <em className="text-terra not-italic">{section.headingEm}</em>
          ) : (
            <em className="text-terra not-italic">available</em>
          )}
        </h2>

        <div className="mt-14 grid-square">
          {products.map((product) => (
            <Link key={String(product._id)} href={`/objects/${product.slug}`} className="card">
              <div className="card-thumb card-thumb-ratio-1 relative">
                {product.images[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.metaDescription || product.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 600px) 50vw, 200px"
                  />
                ) : null}
              </div>
              <div className="card-body">
                <div className="card-title">{product.title}</div>
                <div className="card-meta">{product.material}</div>
              </div>
            </Link>
          ))}
        </div>

        <div className="divider" />
        <Link href="/collections" className="btn-line-terra inline-flex">
          View all works →
        </Link>
      </div>
    </section>
  );
}
