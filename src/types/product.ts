export type ProductCategory = "ceramics" | "vessels" | "wall-objects" | "prints";

export interface Product {
  _id: string;
  slug: string;
  catalog: string;
  title: string;
  category: ProductCategory;
  material: string;
  description: string;
  process: string;
  etsyUrl: string;
  images: string[];
  /** Alt text for the primary gallery image (Originals cards + product detail). */
  imageAlt?: string;
  metaTitle: string;
  metaDescription: string;
  published: boolean;
  order: number;
  homeVisible?: boolean;
  price?: number | null;
  nativeCheckout?: boolean;
  soldOut?: boolean;
  /** Photo reproduction of a ceramic piece (LELEK Sentences). Prints only. */
  isPhotoReproduction?: boolean;
  /** One-of-a-kind piece shown in About / Originals (inquiry only). */
  isOriginal?: boolean;
  /** Gallery currently showing this Original (id only). */
  currentGalleryId?: string | null;
  /** Populated gallery snapshot for public Originals cards. */
  currentGallery?: { _id: string; name: string; url: string } | null;
  thumbnailPosition?: string;
  createdAt?: string;
  updatedAt?: string;
}
