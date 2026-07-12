import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/public/ProductDetail";
import { getProductBySlug } from "@/lib/site";
import { SITE_URL } from "@/lib/config";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Object not found" };

  const title = product.metaTitle || product.title;
  const description = product.metaDescription || product.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: product.images[0] ? [{ url: product.images[0] }] : undefined,
    },
    alternates: { canonical: `${SITE_URL}/objects/${slug}` },
  };
}

export const revalidate = 60;

export default async function ObjectPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return <ProductDetail product={product} />;
}
