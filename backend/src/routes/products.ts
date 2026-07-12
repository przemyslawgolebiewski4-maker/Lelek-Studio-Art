import { Router } from "express";
import { connectDB } from "../lib/db";
import { requireAdmin } from "../lib/auth";
import { Product } from "../models";

export const productsPublicRouter = Router();

productsPublicRouter.get("/products/public", async (req, res) => {
  try {
    await connectDB();
    const limit = Math.min(Number(req.query.limit) || 6, 50);
    const products = await Product.find({ published: true })
      .sort({ order: 1 })
      .limit(limit)
      .lean();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

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
    const product = await Product.create(req.body);
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
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
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
