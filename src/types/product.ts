export type ProductCategory = "ceramics" | "vessels" | "wall-objects";

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
  metaTitle: string;
  metaDescription: string;
  published: boolean;
  order: number;
  homeVisible?: boolean;
  price?: number | null;
  nativeCheckout?: boolean;
  soldOut?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
