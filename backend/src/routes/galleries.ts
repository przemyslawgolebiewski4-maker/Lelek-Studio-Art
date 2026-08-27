import { Router } from "express";
import mongoose from "mongoose";
import { connectDB } from "../lib/db";
import { requireAdmin } from "../lib/auth";
import { Gallery, Product } from "../models";

export const galleriesPublicRouter = Router();
export const galleriesAdminRouter = Router();

function isValidObjectId(id: unknown): id is string {
  return typeof id === "string" && mongoose.Types.ObjectId.isValid(id);
}

function pickGalleryFields(body: Record<string, unknown>, partial: boolean) {
  const data: Record<string, unknown> = {};

  if ("name" in body || !partial) {
    if (typeof body.name === "string" && body.name.trim()) {
      data.name = body.name.trim();
    } else if (!partial) {
      return { error: "name is required" as const };
    }
  }

  if ("url" in body || !partial) {
    if (typeof body.url === "string" && body.url.trim()) {
      data.url = body.url.trim();
    } else if (!partial) {
      return { error: "url is required" as const };
    }
  }

  if ("city" in body) {
    data.city = typeof body.city === "string" ? body.city.trim() : "";
  } else if (!partial) {
    data.city = "";
  }

  if ("active" in body) {
    data.active = Boolean(body.active);
  } else if (!partial) {
    data.active = true;
  }

  if ("order" in body) {
    const n = Number(body.order);
    data.order = Number.isFinite(n) ? n : 0;
  } else if (!partial) {
    data.order = 0;
  }

  return { data };
}

/** GET /public/galleries — active galleries only (public list + ProductForm options). */
galleriesPublicRouter.get("/public/galleries", async (_req, res) => {
  try {
    await connectDB();
    const galleries = await Gallery.find({ active: true })
      .sort({ order: 1, name: 1 })
      .lean();
    res.json(galleries);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

/** GET /admin/galleries — all galleries */
galleriesAdminRouter.get("/galleries", requireAdmin, async (_req, res) => {
  try {
    await connectDB();
    const galleries = await Gallery.find().sort({ order: 1, name: 1 }).lean();
    res.json({ ok: true, galleries });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});

galleriesAdminRouter.post("/galleries", requireAdmin, async (req, res) => {
  try {
    await connectDB();
    const picked = pickGalleryFields(req.body as Record<string, unknown>, false);
    if ("error" in picked) {
      res.status(400).json({ ok: false, error: picked.error });
      return;
    }
    const gallery = await Gallery.create(picked.data);
    res.status(201).json({ ok: true, gallery });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});

galleriesAdminRouter.patch("/galleries/:id", requireAdmin, async (req, res) => {
  try {
    await connectDB();
    if (!isValidObjectId(req.params.id)) {
      res.status(400).json({ ok: false, error: "Invalid gallery id" });
      return;
    }
    const picked = pickGalleryFields(req.body as Record<string, unknown>, true);
    if ("error" in picked) {
      res.status(400).json({ ok: false, error: picked.error });
      return;
    }
    if (Object.keys(picked.data).length === 0) {
      res.status(400).json({ ok: false, error: "No valid fields to update" });
      return;
    }
    const gallery = await Gallery.findByIdAndUpdate(req.params.id, picked.data, {
      new: true,
      runValidators: true,
    }).lean();
    if (!gallery) {
      res.status(404).json({ ok: false, error: "Not found" });
      return;
    }
    res.json({ ok: true, gallery });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});

galleriesAdminRouter.delete("/galleries/:id", requireAdmin, async (req, res) => {
  try {
    await connectDB();
    if (!isValidObjectId(req.params.id)) {
      res.status(400).json({ ok: false, error: "Invalid gallery id" });
      return;
    }
    const referenced = await Product.countDocuments({ currentGalleryId: req.params.id });
    if (referenced > 0) {
      res.status(409).json({
        ok: false,
        error: `Cannot delete gallery: ${referenced} product(s) still reference it via currentGalleryId. Clear those assignments first.`,
      });
      return;
    }
    const gallery = await Gallery.findByIdAndDelete(req.params.id);
    if (!gallery) {
      res.status(404).json({ ok: false, error: "Not found" });
      return;
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});
