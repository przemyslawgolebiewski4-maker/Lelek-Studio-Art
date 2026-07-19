"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiPost, apiPatch } from "@/lib/api";
import type { Product } from "@/types/product";
import {
  AdminButton,
  AdminInput,
  AdminSelect,
  AdminTextarea,
} from "@/components/admin/AdminShell";
import { ImageListField } from "@/components/admin/MediaUploadField";
import { MEDIA_HINTS } from "@/lib/media-hints";

export type ProductFormData = {
  slug: string;
  catalog: string;
  title: string;
  category: string;
  material: string;
  description: string;
  process: string;
  etsyUrl: string;
  images: string;
  metaTitle: string;
  metaDescription: string;
  published: boolean;
  order: number;
  homeVisible: boolean;
};

export function productToForm(product?: Partial<Product>): ProductFormData {
  return {
    slug: product?.slug ?? "",
    catalog: product?.catalog ?? "",
    title: product?.title ?? "",
    category: product?.category ?? "ceramics",
    material: product?.material ?? "",
    description: product?.description ?? "",
    process: product?.process ?? "",
    etsyUrl: product?.etsyUrl ?? "",
    images: (product?.images ?? []).join("\n"),
    metaTitle: product?.metaTitle ?? "",
    metaDescription: product?.metaDescription ?? "",
    published: product?.published ?? false,
    order: product?.order ?? 0,
    homeVisible: product?.homeVisible ?? false,
  };
}

export function formToPayload(form: ProductFormData) {
  return {
    slug: form.slug,
    catalog: form.catalog,
    title: form.title,
    category: form.category,
    material: form.material,
    description: form.description,
    process: form.process,
    etsyUrl: form.etsyUrl,
    images: form.images
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    metaTitle: form.metaTitle,
    metaDescription: form.metaDescription,
    published: form.published,
    order: form.order,
    homeVisible: form.homeVisible,
  };
}

export function ProductForm({
  initial,
  productId,
}: {
  initial: ProductFormData;
  productId?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update<K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const url = productId ? `/admin/products/${productId}` : "/admin/products";
    const res = productId
      ? await apiPatch(url, formToPayload(form))
      : await apiPost(url, formToPayload(form));
    const data = await res.json();

    if (!res.ok || !data.ok) {
      setError(data.error ?? "Save failed");
      setLoading(false);
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="admin-form-stack-lg" style={{ maxWidth: 640 }}>
      {error ? <p className="admin-error">{error}</p> : null}

      <div className="admin-form-row-2">
        <AdminInput
          label="Title"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          required
        />
        <AdminInput
          label="Slug"
          value={form.slug}
          onChange={(e) => update("slug", e.target.value)}
          required
        />
      </div>

      <div className="admin-form-row-2">
        <AdminInput
          label="Catalog number"
          value={form.catalog}
          onChange={(e) => update("catalog", e.target.value)}
        />
        <AdminSelect
          label="Category"
          value={form.category}
          onChange={(e) => update("category", e.target.value)}
        >
          <option value="ceramics">Ceramics</option>
          <option value="vessels">Vessels</option>
          <option value="wall-objects">Wall objects</option>
        </AdminSelect>
      </div>

      <AdminInput
        label="Material"
        value={form.material}
        onChange={(e) => update("material", e.target.value)}
      />

      <AdminTextarea
        label="Description"
        rows={4}
        value={form.description}
        onChange={(e) => update("description", e.target.value)}
      />

      <AdminTextarea
        label="Process"
        rows={3}
        value={form.process}
        onChange={(e) => update("process", e.target.value)}
      />

      <AdminInput
        label="Etsy URL"
        value={form.etsyUrl}
        onChange={(e) => update("etsyUrl", e.target.value)}
      />

      <ImageListField
        label="Product gallery"
        value={form.images}
        onChange={(v) => update("images", v)}
        folder="products"
        hint={MEDIA_HINTS.productGallery}
      />

      <div className="admin-form-row-2">
        <AdminInput
          label="Meta title"
          value={form.metaTitle}
          onChange={(e) => update("metaTitle", e.target.value)}
        />
        <AdminInput
          label="Sort order"
          type="number"
          value={form.order}
          onChange={(e) => update("order", Number(e.target.value))}
        />
      </div>

      <AdminTextarea
        label="Meta description"
        rows={2}
        value={form.metaDescription}
        onChange={(e) => update("metaDescription", e.target.value)}
      />

      <label className="admin-checkbox">
        <input
          type="checkbox"
          checked={form.published}
          onChange={(e) => update("published", e.target.checked)}
        />
        Published on site
      </label>
      <label className="admin-checkbox">
        <input
          type="checkbox"
          checked={form.homeVisible}
          onChange={(e) => update("homeVisible", e.target.checked)}
        />
        Visible on Home
      </label>
      <p className="admin-muted" style={{ marginTop: "-8px", marginBottom: "8px" }}>
        Shows product image in the Featured section on the homepage (max 3 products).
      </p>

      <div style={{ display: "flex", gap: 12 }}>
        <AdminButton type="submit" disabled={loading} className="filled">
          {loading ? "Saving..." : productId ? "Update product" : "Create product"}
        </AdminButton>
      </div>
    </form>
  );
}
