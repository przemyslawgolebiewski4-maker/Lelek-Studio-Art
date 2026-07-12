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
    <section className="section-pad border-b border-sand">
      <div className="container-wide">
        {section?.eyebrow ? <p className="eyebrow mb-3">{section.eyebrow}</p> : (
          <p className="eyebrow mb-3">Works</p>
        )}
        <h2 className="text-[var(--text-3xl)]">
          {section?.heading ?? "Form, surface"}{" "}
          <span className="italic-serif text-rust">{section?.headingEm ?? "and presence"}</span>
        </h2>

        <div className="mt-12 space-y-24 md:space-y-32">
          {products.map((product, index) => {
            const align = index % 2 === 0 ? "md:mr-auto md:ml-[-2vw]" : "md:ml-auto md:mr-[-2vw]";
            return (
              <article key={String(product._id)} className="relative">
                <p className="cat-num mb-4">{product.catalog || String(index + 1).padStart(3, "0")}</p>
                <div className={`grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-end ${align}`}>
                  <Link
                    href={`/objects/${product.slug}`}
                    className="group relative aspect-[4/5] w-full overflow-hidden border-[3px] border-ink md:aspect-[5/4] md:w-[72vw] md:max-w-[880px]"
                  >
                    {product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.metaDescription || product.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        sizes="(max-width: 768px) 100vw, 72vw"
                      />
                    ) : null}
                  </Link>
                  <div className="md:pb-6">
                    <h3 className="text-[var(--text-2xl)] uppercase tracking-[-0.02em]">
                      {product.title}
                    </h3>
                    <p className="cat-num mt-3">{product.material}</p>
                    <p className="italic-serif mt-4 max-w-sm text-metal">{product.description}</p>
                    <div className="mt-6 flex flex-wrap gap-4">
                      <Link href={`/objects/${product.slug}`} className="btn-text">
                        View object
                      </Link>
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
                          Inquire ↗
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-16">
          <Link href="/collections" className="btn-text">
            View all works ↗
          </Link>
        </div>
      </div>
    </section>
  );
}
