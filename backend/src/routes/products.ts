import { Router } from "express";
import { connectDB } from "../lib/db";
import { requireAdmin } from "../lib/auth";
import { normalizeSlug } from "../lib/slug";
import { triggerRevalidate } from "../lib/revalidate";
import { Product } from "../models";
import mongoose from "mongoose";

export const productsPublicRouter = Router();

type GalleryLean = { _id: mongoose.Types.ObjectId; name: string; url: string; active?: boolean };

function withCurrentGallery<T extends { currentGalleryId?: unknown }>(product: T) {
  const raw = product.currentGalleryId;
  if (raw && typeof raw === "object" && "_id" in (raw as object) && "name" in (raw as object)) {
    const g = raw as GalleryLean;
    return {
      ...product,
      currentGalleryId: String(g._id),
      currentGallery: { _id: String(g._id), name: g.name, url: g.url },
    };
  }
  return {
    ...product,
    currentGalleryId: raw ? String(raw) : null,
    currentGallery: null,
  };
}

productsPublicRouter.get("/products/public", async (req, res) => {
  try {
    await connectDB();
    const limit = Math.min(Number(req.query.limit) || 6, 50);
    const query: Record<string, unknown> = { published: true };
    if (typeof req.query.category === "string" && req.query.category) {
      query.category = req.query.category;
    }
    const products = await Product.find(query)
      .populate({ path: "currentGalleryId", select: "name url active" })
      .sort({ order: 1 })
      .limit(limit)
      .lean();
    res.json(products.map((p) => withCurrentGallery(p)));
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

productsPublicRouter.get("/products/home", async (req, res) => {
  try {
    await connectDB();
    const products = await Product.find({ published: true, homeVisible: true })
      .populate({ path: "currentGalleryId", select: "name url active" })
      .sort({ order: 1 })
      .limit(3)
      .lean();
    res.json(products.map((p) => withCurrentGallery(p)));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch home products" });
  }
});

productsPublicRouter.get("/products/public/:slug", async (req, res) => {
  try {
    await connectDB();
    const raw = typeof req.params.slug === "string" ? req.params.slug : "";
    const normalized = normalizeSlug(raw);
    const product =
      (await Product.findOne({ slug: raw, published: true })
        .populate({ path: "currentGalleryId", select: "name url active" })
        .lean()) ??
      (normalized && normalized !== raw
        ? await Product.findOne({ slug: normalized, published: true })
            .populate({ path: "currentGalleryId", select: "name url active" })
            .lean()
        : null);
    if (!product) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(withCurrentGallery(product));
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

const PRODUCT_CATEGORIES = ["ceramics", "vessels", "wall-objects", "prints"] as const;

const PRODUCT_FIELDS = [
  "slug",
  "catalog",
  "title",
  "category",
  "material",
  "description",
  "process",
  "etsyUrl",
  "images",
  "imageAlt",
  "metaTitle",
  "metaDescription",
  "published",
  "order",
  "homeVisible",
  "price",
  "nativeCheckout",
  "soldOut",
  "isPhotoReproduction",
  "isOriginal",
  "currentGalleryId",
  "thumbnailPosition",
] as const;

function pickProductFields(body: Record<string, unknown>) {
  const data: Record<string, unknown> = {};
  for (const key of PRODUCT_FIELDS) {
    if (key in body) data[key] = body[key];
  }
  if (typeof data.slug === "string") data.slug = normalizeSlug(data.slug);
  if (typeof data.title === "string") data.title = data.title.trim();
  if (Array.isArray(data.images)) {
    data.images = data.images.filter((item) => typeof item === "string");
  }
  if (typeof data.category === "string") {
    if (!(PRODUCT_CATEGORIES as readonly string[]).includes(data.category)) {
      delete data.category;
    }
  }
  if (typeof data.isPhotoReproduction === "boolean") {
    if (data.category !== "prints" && data.category !== undefined) {
      data.isPhotoReproduction = false;
    }
  } else if ("isPhotoReproduction" in data) {
    data.isPhotoReproduction = Boolean(data.isPhotoReproduction);
    if (data.category !== "prints" && data.category !== undefined) {
      data.isPhotoReproduction = false;
    }
  }
  if ("isOriginal" in data) {
    data.isOriginal = Boolean(data.isOriginal);
  }
  if ("currentGalleryId" in data) {
    if (data.currentGalleryId === null || data.currentGalleryId === "") {
      data.currentGalleryId = null;
    } else if (
      typeof data.currentGalleryId === "string" &&
      mongoose.Types.ObjectId.isValid(data.currentGalleryId)
    ) {
      data.currentGalleryId = data.currentGalleryId;
    } else {
      delete data.currentGalleryId;
    }
  }
  if ("price" in data) {
    if (data.price === null || data.price === "" || data.price === undefined) {
      data.price = null;
    } else {
      const n = Number(data.price);
      data.price = Number.isFinite(n) ? n : null;
    }
  }
  return data;
}

export const productsAdminRouter = Router();

productsAdminRouter.get("/products", requireAdmin, async (_req, res) => {
  try {
    await connectDB();
    const products = await Product.find().sort({ order: 1, createdAt: -1 }).lean();
    res.json({ ok: true, products });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});

productsAdminRouter.post("/products", requireAdmin, async (req, res) => {
  try {
    await connectDB();
    const data = pickProductFields(req.body as Record<string, unknown>);
    const slug = typeof data.slug === "string" ? data.slug : "";
    const title = typeof data.title === "string" ? data.title : "";

    if (!slug || !title) {
      res.status(400).json({ ok: false, error: "Slug and title required" });
      return;
    }

    const existing = await Product.findOne({ slug });
    if (existing) {
      res.status(409).json({ ok: false, error: "Slug already exists" });
      return;
    }

    const category = (
      typeof data.category === "string" &&
      (PRODUCT_CATEGORIES as readonly string[]).includes(data.category)
        ? data.category
        : "ceramics"
    ) as (typeof PRODUCT_CATEGORIES)[number];

    const product = await Product.create({
      catalog: "",
      material: "",
      description: "",
      process: "",
      etsyUrl: "",
      images: [],
      metaTitle: "",
      metaDescription: "",
      published: false,
      order: 0,
      ...data,
      category,
      // Photo reproduction flag applies only to prints
      isPhotoReproduction:
        category === "prints" ? Boolean(data.isPhotoReproduction) : false,
    });
    void triggerRevalidate(["/", "/about", `/objects/${product.slug}`]);
    res.status(201).json({ ok: true, product });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});

productsAdminRouter.get("/products/:id", requireAdmin, async (req, res) => {
  try {
    await connectDB();
    const product = await Product.findById(req.params.id).lean();
    if (!product) {
      res.status(404).json({ ok: false, error: "Not found" });
      return;
    }
    res.json({ ok: true, product });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});

productsAdminRouter.patch("/products/:id", requireAdmin, async (req, res) => {
  try {
    await connectDB();
    const updates = pickProductFields(req.body as Record<string, unknown>);
    if ("isPhotoReproduction" in updates || updates.category) {
      const existing = await Product.findById(req.params.id).lean();
      const nextCategory =
        typeof updates.category === "string" ? updates.category : existing?.category;
      if (nextCategory !== "prints") {
        updates.isPhotoReproduction = false;
      }
    }
    const product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).lean();
    if (!product) {
      res.status(404).json({ ok: false, error: "Not found" });
      return;
    }
    void triggerRevalidate(["/", "/about", `/objects/${product.slug}`]);
    res.json({ ok: true, product });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});

productsAdminRouter.delete("/products/:id", requireAdmin, async (req, res) => {
  try {
    await connectDB();
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      res.status(404).json({ ok: false, error: "Not found" });
      return;
    }
    void triggerRevalidate(["/", "/about"]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});
