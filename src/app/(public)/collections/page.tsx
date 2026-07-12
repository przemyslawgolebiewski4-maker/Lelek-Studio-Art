import type { Metadata } from "next";
import { ProductGrid } from "@/components/public/ProductGrid";
import { getPublishedProducts } from "@/lib/site";
import { DEFAULT_DESCRIPTION } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Collections",
  description: "Handmade ceramics, vessels and wall objects by Lelek Studio Berlin.",
};

export const revalidate = 60;

export default async function CollectionsPage() {
  const products = await getPublishedProducts(50);

  return (
    <section className="section-pad pt-28">
      <div className="container-wide">
        <p className="eyebrow mb-3">Collections</p>
        <h1 className="max-w-2xl text-[var(--text-3xl)]">
          Objects shaped by hand <span className="italic-serif text-rust">and time</span>
        </h1>
        <p className="mt-4 max-w-xl text-metal">{DEFAULT_DESCRIPTION}</p>
        <div className="mt-14">
          <ProductGrid products={products} />
        </div>
      </div>
    </section>
  );
}
