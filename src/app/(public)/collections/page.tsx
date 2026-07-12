import type { Metadata } from "next";
import { ProductGrid } from "@/components/public/ProductGrid";
import { getPublishedProducts, getSiteSettings } from "@/lib/site";

export const metadata: Metadata = {
  title: "Collections",
  description: "Handmade ceramics, vessels and wall objects by Lelek Studio Berlin.",
};

export const revalidate = 60;

export default async function CollectionsPage() {
  const [products, settings] = await Promise.all([
    getPublishedProducts(50),
    getSiteSettings(),
  ]);

  return (
    <>
      <section className="page-shell">
        <div className="sec-eyebrow">Collections</div>
        <h1 className="page-h1">
          Form, surface <em>and presence</em>
        </h1>
        <p className="page-intro">
          Functional ceramics, vessels and wall objects from a Berlin studio — each piece shaped
          slowly by material, process and use.
        </p>
      </section>
      <ProductGrid products={products} etsyUrl={settings.etsy_url} />
    </>
  );
}
