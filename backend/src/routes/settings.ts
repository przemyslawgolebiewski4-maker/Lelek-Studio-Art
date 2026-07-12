import { Router } from "express";
import { connectDB } from "../lib/db";
import { requireAdmin } from "../lib/auth";
import { Setting, HomeSection } from "../models";

export const settingsPublicRouter = Router();

const PUBLIC_KEYS = [
  "site_name",
  "tagline",
  "description",
  "etsy_url",
  "instagram",
  "instagram_handle",
  "email",
  "artist_url",
];

settingsPublicRouter.get("/settings/public", async (_req, res) => {
  try {
    await connectDB();
    const rows = await Setting.find({ key: { $in: PUBLIC_KEYS } }).lean();
    const settings = Object.fromEntries(rows.map((row) => [row.key, row.value]));
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

settingsPublicRouter.get("/sections/hero", async (_req, res) => {
  try {
    await connectDB();
    const doc = await HomeSection.findOne({ sectionKey: "hero", visible: true }).lean();
    res.json(doc?.content ?? {});
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

export const settingsAdminRouter = Router();

settingsAdminRouter.get("/settings", requireAdmin, async (_req, res) => {
  try {
    await connectDB();
    const rows = await Setting.find().lean();
    res.json(Object.fromEntries(rows.map((row) => [row.key, row.value])));
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

settingsAdminRouter.patch("/settings", requireAdmin, async (req, res) => {
  try {
    const key = typeof req.body.key === "string" ? req.body.key : "";
    const value = typeof req.body.value === "string" ? req.body.value : "";
    if (!key) {
      res.status(400).json({ error: "Key required" });
      return;
    }
    await connectDB();
    const setting = await Setting.findOneAndUpdate(
      { key },
      { key, value },
      { upsert: true, new: true },
    ).lean();
    res.json({ ok: true, setting });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});
