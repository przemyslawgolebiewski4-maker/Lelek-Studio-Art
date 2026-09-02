import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/public/ProductDetail";
import { getProductBySlug } from "@/lib/site";
import { JsonLd } from "@/lib/json-ld";
import { SITE_URL } from "@/lib/config";
import { withPageDescription } from "@/lib/seo";
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
  const artworkLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "VisualArtwork",
        name: product.title,
        url: `${SITE_URL}/objects/${cleanSlug}`,
        image: product.images[0] || undefined,
        artform: "Ceramics",
        description: product.metaDescription || product.description || undefined,
        creator: {
          "@type": "Person",
          name: "Przemyslaw Golebiewski",
          url: `${SITE_URL}/about`,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${SITE_URL}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "About",
            item: `${SITE_URL}/about`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: product.title,
            item: `${SITE_URL}/objects/${cleanSlug}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <JsonLd data={artworkLd} />
      <ProductDetail product={product} />
    </>
  );
}
