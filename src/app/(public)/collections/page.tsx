import type { Metadata } from "next";
import { WorksGrid } from "@/components/public/ProductGrid";
import { getPublishedProducts, getSiteSettings } from "@/lib/site";

export const metadata: Metadata = {
  title: "Works",
  description: "Handmade ceramics, vessels and wall objects by ceramist Przemyslaw Golebiewski, Berlin.",
  alternates: { canonical: "https://www.lelekstudio.com/collections" },
};

export const revalidate = 60;

export default async function CollectionsPage() {
  const [products, settings] = await Promise.all([
    getPublishedProducts(100),
    getSiteSettings(),
  ]);

  return <WorksGrid products={products} etsyUrl={settings.etsy_url} />;
}
