import { Router } from "express";
import { connectDB } from "../lib/db";
import { requireAdmin } from "../lib/auth";
import { Product } from "../models";

export const productsPublicRouter = Router();

productsPublicRouter.get("/products/public", async (req, res) => {
  try {
    await connectDB();
    const limit = Math.min(Number(req.query.limit) || 6, 50);
    const query: Record<string, unknown> = { published: true };
    if (typeof req.query.category === "string" && req.query.category) {
      query.category = req.query.category;
    }
    const products = await Product.find(query).sort({ order: 1 }).limit(limit).lean();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

productsPublicRouter.get("/products/home", async (req, res) => {
  try {
    await connectDB();
    const products = await Product.find({ published: true, homeVisible: true })
      .sort({ order: 1 })
      .limit(3)
      .lean();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch home products" });
  }
});

productsPublicRouter.get("/products/public/:slug", async (req, res) => {
  try {
    await connectDB();
    const product = await Product.findOne({ slug: req.params.slug, published: true }).lean();
    if (!product) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

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
  "metaTitle",
  "metaDescription",
  "published",
  "order",
  "homeVisible",
  "price",
  "nativeCheckout",
  "soldOut",
  "thumbnailPosition",
] as const;

function normalizeSlug(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}

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

    const product = await Product.create({
      catalog: "",
      category: "ceramics",
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
    });
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
    const product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).lean();
    if (!product) {
      res.status(404).json({ ok: false, error: "Not found" });
      return;
    }
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
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});
