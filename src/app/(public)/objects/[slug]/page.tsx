import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/public/ProductDetail";
import { getProductBySlug } from "@/lib/site";
import { JsonLd } from "@/lib/json-ld";
import { SITE_URL } from "@/lib/config";
import { withPageDescription } from "@/lib/seo";
import { buildProductJsonLd } from "@/lib/product-json-ld";
import { normalizeSlug } from "@/lib/slug";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Object not found" };

  const title = product.metaTitle || product.title;
  const description = product.metaDescription || product.description || "";
  const cleanSlug = normalizeSlug(slug) || slug;

  return withPageDescription(description, {
    title,
    openGraph: {
      title,
      images: product.images[0] ? [{ url: product.images[0] }] : undefined,
    },
    alternates: { canonical: `${SITE_URL}/objects/${cleanSlug}` },
  });
}

export const revalidate = 60;

export default async function ObjectPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const cleanSlug = normalizeSlug(product.slug) || product.slug;
  const productLd = buildProductJsonLd(product, cleanSlug);

  return (
    <>
      <JsonLd data={productLd} />
      <ProductDetail product={product} />
    </>
  );
}
