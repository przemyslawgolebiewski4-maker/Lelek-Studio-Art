"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiPost, apiPatch } from "@/lib/api";
import type { Product, ProductCategory } from "@/types/product";
import { CATEGORY_CATALOG_PREFIX, isProductCategory } from "@/lib/categories";
import { normalizeSlug, slugFromTitle } from "@/lib/slug";
import {
  AdminButton,
  AdminInput,
  AdminSelect,
  AdminTextarea,
} from "@/components/admin/AdminShell";
import { ImageListField } from "@/components/admin/MediaUploadField";

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
  soldOut: boolean;
  isPhotoReproduction: boolean;
  thumbnailPosition: string;
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
    soldOut: product?.soldOut ?? false,
    isPhotoReproduction: product?.isPhotoReproduction ?? false,
    thumbnailPosition: product?.thumbnailPosition ?? "center",
  };
}

export function formToPayload(form: ProductFormData) {
  const isPrints = form.category === "prints";
  return {
    slug: normalizeSlug(form.slug) || slugFromTitle(form.title),
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
    soldOut: form.soldOut,
    isPhotoReproduction: isPrints ? form.isPhotoReproduction : false,
    thumbnailPosition: form.thumbnailPosition,
  };
}

function catalogPrefixHint(category: string): string {
  if (!isProductCategory(category)) return "e.g. CE-001";
  return `e.g. ${CATEGORY_CATALOG_PREFIX[category]}-001`;
}

export function ProductForm({
  initial,
  productId,
}: {
  initial: ProductFormData;
  productId?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState(() => ({
    ...initial,
    slug: normalizeSlug(initial.slug),
  }));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.slug));

  function update<K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateTitle(title: string) {
    setForm((prev) => ({
      ...prev,
      title,
      slug: slugTouched ? prev.slug : slugFromTitle(title),
    }));
  }

  function updateCategory(next: string) {
    setForm((prev) => {
      const nextForm = { ...prev, category: next };
      if (next !== "prints") {
        nextForm.isPhotoReproduction = false;
      }
      // Suggest catalog prefix when empty or only a previous category prefix
      if (isProductCategory(next)) {
        const prefix = CATEGORY_CATALOG_PREFIX[next as ProductCategory];
        const catalog = prev.catalog.trim();
        const prefixOnly = /^(CE|VE|WO|OB|PR)-?\d*$/i.test(catalog) || catalog === "";
        if (prefixOnly) {
          const digits = catalog.replace(/^(CE|VE|WO|OB|PR)-?/i, "") || "";
          nextForm.catalog = digits ? `${prefix}-${digits.padStart(3, "0")}` : `${prefix}-`;
        }
      }
      return nextForm;
    });
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
          onChange={(e) => updateTitle(e.target.value)}
          required
        />
        <AdminInput
          label="Slug"
          value={form.slug}
          onChange={(e) => {
            setSlugTouched(true);
            update("slug", e.target.value);
          }}
          onBlur={(e) => {
            setSlugTouched(true);
            update("slug", normalizeSlug(e.target.value));
          }}
          required
        />
      </div>
      <p className="admin-muted" style={{ marginTop: "-8px", marginBottom: "8px" }}>
        URL slug: a-z, 0-9 and hyphens only (e.g. split-face-print).
      </p>

      <div className="admin-form-row-2">
        <AdminInput
          label="Catalog number"
          value={form.catalog}
          onChange={(e) => update("catalog", e.target.value)}
          placeholder={catalogPrefixHint(form.category)}
        />
        <AdminSelect
          label="Category"
          value={form.category}
          onChange={(e) => updateCategory(e.target.value)}
        >
          <option value="ceramics">Ceramics</option>
          <option value="vessels">Vessels</option>
          <option value="wall-objects">Wall objects</option>
          <option value="prints">Prints</option>
        </AdminSelect>
      </div>
      <p className="admin-muted" style={{ marginTop: "-8px", marginBottom: "8px" }}>
        Catalog prefix: CE- / VE- / WO- / OB- / PR- (Courier uppercase).
      </p>

      {form.category === "prints" ? (
        <>
          <label className="admin-checkbox">
            <input
              type="checkbox"
              checked={form.isPhotoReproduction}
              onChange={(e) => update("isPhotoReproduction", e.target.checked)}
            />
            Photo reproduction (LELEK Sentences)
          </label>
          <p className="admin-muted" style={{ marginTop: "-8px", marginBottom: "8px" }}>
            When checked, the public description must include: &quot;This poster reproduces a
            photograph of an original ceramic piece, hand-shaped by Przemek - not an
            illustration.&quot; Close Prints descriptions with: &quot;Printed to order. Shipped from
            Europe.&quot;
          </p>
        </>
      ) : null}

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
        placeholder={
          form.category === "prints"
            ? form.isPhotoReproduction
              ? "This poster reproduces a photograph of an original ceramic piece, hand-shaped by Przemek - not an illustration. … Printed to order. Shipped from Europe."
              : "… Printed to order. Shipped from Europe."
            : undefined
        }
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
        thumbnailPosition={form.thumbnailPosition}
        onThumbnailPositionChange={(v) => update("thumbnailPosition", v)}
        hint="First image = catalog thumbnail. Drag to reorder."
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

      <div className="admin-field-divider" />

      <label className="admin-checkbox">
        <input
          type="checkbox"
          checked={form.soldOut}
          onChange={(e) => update("soldOut", e.target.checked)}
        />
        Sold out
      </label>
      <p className="admin-muted" style={{ marginTop: "-8px", marginBottom: "8px" }}>
        Hides the buy/inquire button and shows &quot;Sold&quot; state on the product page.
        The product remains visible in the catalog.
      </p>

      <div style={{ display: "flex", gap: 12 }}>
        <AdminButton type="submit" disabled={loading} className="filled">
          {loading ? "Saving..." : productId ? "Update product" : "Create product"}
        </AdminButton>
      </div>
    </form>
  );
}
