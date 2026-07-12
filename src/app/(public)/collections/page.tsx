import type { Metadata } from "next";
import { ProductGrid } from "@/components/public/ProductGrid";
import { getPublishedProducts } from "@/lib/site";

export const metadata: Metadata = {
  title: "Collections",
  description: "Handmade ceramics, vessels and wall objects by Lelek Studio Berlin.",
};

export const revalidate = 60;

export default async function CollectionsPage() {
  const products = await getPublishedProducts(50);

  return (
    <>
      <section className="section-pad page-top collection-sec">
        <div className="container">
          <div className="sec-tag">Collections</div>
          <h1>
            Objects shaped by hand <em>and time</em>
          </h1>
          <p className="sec-intro mt-6">
            Functional ceramics, vessels and wall objects from a Berlin studio — each piece shaped
            slowly by material, process and use.
          </p>
        </div>
      </section>
      <ProductGrid products={products} />
    </>
  );
}
