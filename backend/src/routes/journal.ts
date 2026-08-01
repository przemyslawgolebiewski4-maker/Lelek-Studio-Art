import { Router } from "express";
import { connectDB } from "../lib/db";
import { requireAdmin } from "../lib/auth";
import { normalizeSlug } from "../lib/slug";
import { JournalPost } from "../models";

const POST_FIELDS = [
  "slug",
  "title",
  "excerpt",
  "body",
  "coverImage",
  "metaTitle",
  "metaDescription",
  "published",
  "order",
] as const;

function pickPostFields(body: Record<string, unknown>) {
  const data: Record<string, unknown> = {};
  for (const key of POST_FIELDS) {
    if (key in body) data[key] = body[key];
  }
  if (typeof data.slug === "string") data.slug = normalizeSlug(data.slug);
  if (typeof data.title === "string") data.title = data.title.trim();
  return data;
}

export const journalPublicRouter = Router();

journalPublicRouter.get("/journal/public", async (_req, res) => {
  try {
    await connectDB();
    const posts = await JournalPost.find({ published: true })
      .sort({ order: 1, createdAt: -1 })
      .select("-body")
      .lean();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

journalPublicRouter.get("/journal/public/:slug", async (req, res) => {
  try {
    await connectDB();
    const post = await JournalPost.findOne({ slug: req.params.slug, published: true }).lean();
    if (!post) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

export const journalAdminRouter = Router();

journalAdminRouter.get("/journal", requireAdmin, async (_req, res) => {
  try {
    await connectDB();
    const posts = await JournalPost.find().sort({ order: 1, createdAt: -1 }).lean();
    res.json({ ok: true, posts });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});

journalAdminRouter.post("/journal", requireAdmin, async (req, res) => {
  try {
    const data = pickPostFields(req.body);
    if (!data.slug || !data.title) {
      res.status(400).json({ ok: false, error: "Slug and title required" });
      return;
    }
    await connectDB();
    const existing = await JournalPost.findOne({ slug: data.slug });
    if (existing) {
      res.status(409).json({ ok: false, error: "Slug already exists" });
      return;
    }
    const post = await JournalPost.create(data);
    res.status(201).json({ ok: true, post });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});

journalAdminRouter.patch("/journal/:id", requireAdmin, async (req, res) => {
  try {
    const data = pickPostFields(req.body);
    await connectDB();
    const post = await JournalPost.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    }).lean();
    if (!post) {
      res.status(404).json({ ok: false, error: "Not found" });
      return;
    }
    res.json({ ok: true, post });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});

journalAdminRouter.delete("/journal/:id", requireAdmin, async (req, res) => {
  try {
    await connectDB();
    const post = await JournalPost.findByIdAndDelete(req.params.id).lean();
    if (!post) {
      res.status(404).json({ ok: false, error: "Not found" });
      return;
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});
