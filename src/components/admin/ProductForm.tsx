"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiGet, apiPost, apiPatch, readApiResult } from "@/lib/api";
import type { Product, ProductCategory } from "@/types/product";
import type { Gallery } from "@/types/gallery";
import { CATEGORY_CATALOG_PREFIX, isProductCategory } from "@/lib/categories";
import { normalizeSlug, slugFromTitle } from "@/lib/slug";
import {
  AdminButton,
  AdminInput,
  AdminSelect,
} from "@/components/admin/AdminShell";
import { ImageListField } from "@/components/admin/MediaUploadField";
import { LangPair } from "@/components/admin/BilingualField";
import { suggestPl } from "@/lib/i18n/dictionary";

type ProductPlFields = {
  title: string;
  material: string;
  description: string;
  process: string;
  imageAlt: string;
  metaTitle: string;
  metaDescription: string;
};

const EMPTY_PL: ProductPlFields = {
  title: "",
  material: "",
  description: "",
  process: "",
  imageAlt: "",
  metaTitle: "",
  metaDescription: "",
};

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
  imageAlt: string;
  metaTitle: string;
  metaDescription: string;
  published: boolean;
  order: number;
  homeVisible: boolean;
  soldOut: boolean;
  isPhotoReproduction: boolean;
  isOriginal: boolean;
  isPortfolio: boolean;
  currentGalleryId: string;
  thumbnailPosition: string;
  /** EUR — required for pop-up /reserve pricing; null = not set */
  price: string;
  pl: ProductPlFields;
};

function polishField(
  product: Partial<Product> | undefined,
  key: keyof ProductPlFields,
  english: string,
): string {
  const stored = product?.i18n?.pl?.[key];
  if (typeof stored === "string" && stored.trim()) return stored;
  return suggestPl(english);
}

export function productToForm(product?: Partial<Product>): ProductFormData {
  const title = product?.title ?? "";
  const material = product?.material ?? "";
  const description = product?.description ?? "";
  const process = product?.process ?? "";
  const imageAlt = product?.imageAlt ?? "";
  const metaTitle = product?.metaTitle ?? "";
  const metaDescription = product?.metaDescription ?? "";
  return {
    slug: product?.slug ?? "",
    catalog: product?.catalog ?? "",
    title,
    category: product?.category ?? "ceramics",
    material,
    description,
    process,
    etsyUrl: product?.etsyUrl ?? "",
    images: (product?.images ?? []).join("\n"),
    imageAlt,
    metaTitle,
    metaDescription,
    published: product?.published ?? false,
    order: product?.order ?? 0,
    homeVisible: product?.homeVisible ?? false,
    soldOut: product?.soldOut ?? false,
    isPhotoReproduction: product?.isPhotoReproduction ?? false,
    isOriginal: product?.isOriginal ?? false,
    isPortfolio: product?.isPortfolio ?? false,
    currentGalleryId: product?.currentGalleryId ?? "",
    thumbnailPosition: product?.thumbnailPosition ?? "center",
    price:
      product?.price != null && Number.isFinite(Number(product.price))
        ? String(product.price)
        : "",
    pl: {
      title: polishField(product, "title", title),
      material: polishField(product, "material", material),
      description: polishField(product, "description", description),
      process: polishField(product, "process", process),
      imageAlt: polishField(product, "imageAlt", imageAlt),
      metaTitle: polishField(product, "metaTitle", metaTitle),
      metaDescription: polishField(product, "metaDescription", metaDescription),
    },
  };
}

export function formToPayload(form: ProductFormData) {
  const isPrints = form.category === "prints";
  const priceRaw = form.price.trim().replace(",", ".");
  const priceNum = priceRaw === "" ? null : Number(priceRaw);
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
    imageAlt: form.imageAlt,
    metaTitle: form.metaTitle,
    metaDescription: form.metaDescription,
    published: form.published,
    order: form.order,
    homeVisible: form.homeVisible,
    soldOut: form.soldOut,
    isPhotoReproduction: isPrints ? form.isPhotoReproduction : false,
    isOriginal: form.isOriginal,
    isPortfolio: form.isPortfolio,
    currentGalleryId: form.isOriginal && form.currentGalleryId ? form.currentGalleryId : null,
    thumbnailPosition: form.thumbnailPosition,
    price: priceNum != null && Number.isFinite(priceNum) ? priceNum : null,
    i18n: { pl: form.pl ?? EMPTY_PL },
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
  const [galleries, setGalleries] = useState<Gallery[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function loadGalleries() {
      try {
        const res = await apiGet("/admin/galleries");
        const data = await readApiResult<{ galleries: Gallery[] }>(res);
        if (!cancelled && data.ok) {
          setGalleries(data.galleries ?? []);
        }
      } catch {
        /* dropdown stays empty if galleries API is unavailable */
      }
    }
    void loadGalleries();
    return () => {
      cancelled = true;
    };
  }, []);

  function update<K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updatePl<K extends keyof ProductPlFields>(key: K, value: string) {
    setForm((prev) => ({ ...prev, pl: { ...prev.pl, [key]: value } }));
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
    const data = await readApiResult(res);

    if (!data.ok) {
      setError(data.error);
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
        <LangPair
          label="Title"
          en={form.title}
          pl={form.pl.title}
          onEn={updateTitle}
          onPl={(value) => updatePl("title", value)}
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

      <AdminInput
        label="Price (EUR)"
        type="number"
        min={0}
        step="0.01"
        value={form.price}
        onChange={(e) => update("price", e.target.value)}
        placeholder="e.g. 31"
        disabled={form.isOriginal}
      />
      <p className="admin-muted" style={{ marginTop: "-8px", marginBottom: "8px" }}>
        Used on pop-up /reserve pages and settlement totals. Leave empty if not for sale here.
        Originals stay inquiry-only (price cleared when Original is checked).
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
            photograph of an original ceramic piece, hand-shaped by Przemysław Gołębiewski - not an
            illustration.&quot; Close Prints descriptions with: &quot;Printed to order. Shipped from
            Europe.&quot;
          </p>
        </>
      ) : null}

      <LangPair
        label="Material"
        en={form.material}
        pl={form.pl.material}
        onEn={(value) => update("material", value)}
        onPl={(value) => updatePl("material", value)}
      />

      <LangPair
        label="Description"
        en={form.description}
        pl={form.pl.description}
        multiline
        rows={4}
        onEn={(value) => update("description", value)}
        onPl={(value) => updatePl("description", value)}
        placeholder={
          form.category === "prints"
            ? form.isPhotoReproduction
              ? "This poster reproduces a photograph of an original ceramic piece, hand-shaped by Przemysław Gołębiewski - not an illustration. … Printed to order. Shipped from Europe."
              : "… Printed to order. Shipped from Europe."
            : undefined
        }
      />

      <LangPair
        label="Process"
        en={form.process}
        pl={form.pl.process}
        multiline
        rows={3}
        onEn={(value) => update("process", value)}
        onPl={(value) => updatePl("process", value)}
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
        hint="First image = catalog thumbnail / Originals card. Drag to reorder."
      />
      <LangPair
        label="Primary image alt text"
        en={form.imageAlt}
        pl={form.pl.imageAlt}
        placeholder={form.title || "Describe the primary product image"}
        onEn={(value) => update("imageAlt", value)}
        onPl={(value) => updatePl("imageAlt", value)}
      />
      <p className="admin-muted" style={{ marginTop: "-8px", marginBottom: "8px" }}>
        Used on the Originals card and product detail hero. Falls back to meta description, then title.
      </p>

      <LangPair
        label="Meta title"
        en={form.metaTitle}
        pl={form.pl.metaTitle}
        onEn={(value) => update("metaTitle", value)}
        onPl={(value) => updatePl("metaTitle", value)}
      />
      <LangPair
        label="Meta description"
        en={form.metaDescription}
        pl={form.pl.metaDescription}
        multiline
        rows={2}
        onEn={(value) => update("metaDescription", value)}
        onPl={(value) => updatePl("metaDescription", value)}
      />
      <AdminInput
        label="Sort order"
        type="number"
        value={form.order}
        onChange={(e) => update("order", Number(e.target.value))}
      />

      <label className="admin-checkbox">
        <input
          type="checkbox"
          checked={form.published}
          onChange={(e) => update("published", e.target.checked)}
        />
        {form.published
          ? "Live on the public site (published)"
          : "Draft - not visible on the public site"}
      </label>
      <label className="admin-checkbox">
        <input
          type="checkbox"
          checked={form.homeVisible}
          onChange={(e) => update("homeVisible", e.target.checked)}
        />
        Visible on Home (Featured)
      </label>
      <p className="admin-muted" style={{ marginTop: "-8px", marginBottom: "8px" }}>
        Shows this object in the Featured works section on the homepage (up to 6 products,
        preferred over catalog padding). Toggle on the pieces you want linked from Home.
      </p>

      <label className="admin-checkbox">
        <input
          type="checkbox"
          checked={form.isOriginal}
          onChange={(e) => {
            const checked = e.target.checked;
            setForm((prev) => ({
              ...prev,
              isOriginal: checked,
              price: checked ? "" : prev.price,
              currentGalleryId: checked ? prev.currentGalleryId : "",
            }));
          }}
        />
        Original (About / Originals)
      </label>
      <p className="admin-muted" style={{ marginTop: "-8px", marginBottom: "8px" }}>
        Shows this piece in the Originals section on the About page, without a price, with an
        Inquire link. Card uses title, catalog number, first gallery image, and the primary image
        alt above. Must also be Published to appear publicly.
      </p>

      {form.isOriginal ? (
        <>
          <AdminSelect
            label="Currently showing at"
            value={form.currentGalleryId}
            onChange={(e) => update("currentGalleryId", e.target.value)}
          >
            <option value="">None</option>
            {galleries.map((gallery) => (
              <option key={gallery._id} value={gallery._id}>
                {gallery.name}
                {gallery.city ? ` (${gallery.city})` : ""}
                {!gallery.active ? " - inactive" : ""}
              </option>
            ))}
          </AdminSelect>
          <p className="admin-muted" style={{ marginTop: "-8px", marginBottom: "8px" }}>
            Optional. When set and the piece is not sold, About shows &quot;On view at
            [gallery]&quot; linking to the gallery website. Manage partners under Admin →
            Galleries.
          </p>
        </>
      ) : null}

      <label className="admin-checkbox">
        <input
          type="checkbox"
          checked={form.isPortfolio}
          onChange={(e) => update("isPortfolio", e.target.checked)}
        />
        Portfolio
      </label>
      <p className="admin-muted" style={{ marginTop: "-8px", marginBottom: "8px" }}>
        Shows the first photograph of this piece on the portfolio gallery. Sold out shows as a
        private collection. A gallery assignment links that photo to the gallery. The piece must
        also be Published.
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
