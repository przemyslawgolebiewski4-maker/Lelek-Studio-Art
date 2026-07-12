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
    <form onSubmit={handleSubmit} className="grid max-w-2xl gap-5">
      {error ? <p className="text-sm text-rust-light">{error}</p> : null}

      <div className="grid gap-5 sm:grid-cols-2">
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

      <div className="grid gap-5 sm:grid-cols-2">
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

      <AdminTextarea
        label="Images (one URL per line)"
        rows={4}
        value={form.images}
        onChange={(e) => update("images", e.target.value)}
      />

      <div className="grid gap-5 sm:grid-cols-2">
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

      <label className="flex items-center gap-2 text-sm text-cream">
        <input
          type="checkbox"
          checked={form.published}
          onChange={(e) => update("published", e.target.checked)}
          className="accent-rust"
        />
        Published on site
      </label>

      <div className="flex gap-3 pt-2">
        <AdminButton type="submit" disabled={loading}>
          {loading ? "Saving..." : productId ? "Update product" : "Create product"}
        </AdminButton>
      </div>
    </form>
  );
}
