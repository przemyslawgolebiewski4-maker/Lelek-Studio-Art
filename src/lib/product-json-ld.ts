import type { Product } from "@/types/product";
import { SITE_URL } from "@/lib/config";

const PERSON_ID = `${SITE_URL}/about#person`;

const LOCATION_CREATED = {
  "@type": "Place",
  name: "Berlin, Germany",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Berlin",
    addressCountry: "DE",
  },
} as const;

function productUrl(slug: string): string {
  return `${SITE_URL}/objects/${slug}`;
}

function productImages(product: Product): string[] {
  return (product.images ?? []).filter(Boolean);
}

function productDescription(product: Product): string | undefined {
  return product.metaDescription?.trim() || product.description?.trim() || undefined;
}

/**
 * Originals (isOriginal) → VisualArtwork without offers (inquiry / private collection).
 * Shop items → Product, with Offer only when a numeric price exists.
 */
export function buildProductJsonLd(
  product: Product,
  cleanSlug: string,
): Record<string, unknown> {
  const url = productUrl(cleanSlug);
  const images = productImages(product);
  const description = productDescription(product);
  const material = product.material?.trim() || undefined;
  const catalog = product.catalog?.trim() || undefined;

  const breadcrumb = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "About", item: `${SITE_URL}/about` },
      { "@type": "ListItem", position: 3, name: product.title, item: url },
    ],
  };

  if (product.isOriginal) {
    const artwork: Record<string, unknown> = {
      "@type": "VisualArtwork",
      "@id": `${url}#artwork`,
      name: product.title,
      url,
      image: images.length ? images : undefined,
      artform: "Ceramics",
      artMedium: material,
      description,
      creator: { "@id": PERSON_ID },
      locationCreated: LOCATION_CREATED,
    };
    if (catalog) artwork.identifier = catalog;

    return {
      "@context": "https://schema.org",
      "@graph": [artwork, breadcrumb],
    };
  }

  const shopProduct: Record<string, unknown> = {
    "@type": "Product",
    "@id": `${url}#product`,
    name: product.title,
    url,
    image: images.length ? images : undefined,
    description,
    sku: catalog || undefined,
    category: product.category || undefined,
    material,
    brand: {
      "@type": "Brand",
      name: "LELEK",
    },
    countryOfOrigin: {
      "@type": "Country",
      name: "Germany",
    },
  };

  const price =
    typeof product.price === "number" && Number.isFinite(product.price)
      ? product.price
      : null;

  // Offers only for shop pieces that have a real price (not inquiry-only originals).
  if (price !== null) {
    shopProduct.offers = {
      "@type": "Offer",
      url: product.etsyUrl?.trim() || url,
      priceCurrency: "EUR",
      price: price.toFixed(2),
      availability: product.soldOut
        ? "https://schema.org/SoldOut"
        : "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    };
  }

  return {
    "@context": "https://schema.org",
    "@graph": [shopProduct, breadcrumb],
  };
}
