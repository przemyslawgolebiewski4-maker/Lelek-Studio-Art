import type { Metadata } from "next";
import PlaceholderPage from "@/components/public/PlaceholderPage";

export const metadata: Metadata = { title: "Object" };

export default async function ObjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <PlaceholderPage
      title={slug.replace(/-/g, " ")}
      description="Product detail page with gallery and Etsy CTA - Sprint 6."
    />
  );
}
