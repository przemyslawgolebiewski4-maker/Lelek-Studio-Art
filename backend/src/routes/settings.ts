import { Router } from "express";
import { connectDB } from "../lib/db";
import { requireAdmin } from "../lib/auth";
import {
  getSectionRevalidatePaths,
  resolveAllPublicPaths,
  sectionAffectsLayout,
} from "../lib/public-paths";
import { triggerLayoutRevalidate, triggerRevalidate } from "../lib/revalidate";
import { Setting, HomeSection } from "../models";

export const settingsPublicRouter = Router();

const PUBLIC_KEYS = [
  "site_name",
  "tagline",
  "description",
  "shop_url",
  "instagram",
  "email",
  "location",
  "organization_logo",
  "same_as_urls",
  "contact_heading_1",
  "contact_heading_2",
  "contact_heading_3",
  "contact_sub",
  "contact_success",
  "contact_form_note",
  "datenschutz_body",
];

/** Seeded default when shop_url is missing in Mongo (matches frontend env fallback). */
const DEFAULT_SHOP_URL =
  (process.env.NEXT_PUBLIC_SHOP_URL || process.env.SHOP_URL || "https://shop.lelekstudio.com")
    .trim()
    .replace(/\/+$/, "") || "https://shop.lelekstudio.com";

async function ensureShopUrlSetting(): Promise<string> {
  const existing = await Setting.findOne({ key: "shop_url" }).lean();
  if (existing && typeof existing.value === "string" && existing.value.trim()) {
    return existing.value.trim();
  }
  await Setting.findOneAndUpdate(
    { key: "shop_url" },
    { key: "shop_url", value: DEFAULT_SHOP_URL },
    { upsert: true },
  );
  return DEFAULT_SHOP_URL;
}

const PUBLIC_SECTION_KEYS = [
  "hero",
  "story",
  "signpost",
  "elements",
  "featured",
  "architects",
  "journal",
  "find",
] as const;

type PublicSectionKey = (typeof PUBLIC_SECTION_KEYS)[number];

function isPublicSectionKey(key: string): key is PublicSectionKey {
  return (PUBLIC_SECTION_KEYS as readonly string[]).includes(key);
}

settingsPublicRouter.get("/settings/public", async (_req, res) => {
  try {
    await connectDB();
    const shopUrl = await ensureShopUrlSetting();
    const rows = await Setting.find({ key: { $in: PUBLIC_KEYS } }).lean();
    const settings = Object.fromEntries(rows.map((row) => [row.key, row.value]));
    if (!settings.shop_url) settings.shop_url = shopUrl;
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

settingsPublicRouter.get("/sections/:key", async (req, res) => {
  try {
    const key = typeof req.params.key === "string" ? req.params.key : "";
    if (!isPublicSectionKey(key)) {
      res.status(404).json({ error: "Section not found" });
      return;
    }
    await connectDB();
    const doc = await HomeSection.findOne({ sectionKey: key, visible: true }).lean();
    if (!doc) {
      res.status(404).json({ error: "Section not found" });
      return;
    }
    res.json(doc.content ?? {});
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

export const settingsAdminRouter = Router();

settingsAdminRouter.get("/settings", requireAdmin, async (_req, res) => {
  try {
    await connectDB();
    await ensureShopUrlSetting();
    const rows = await Setting.find().lean();
    res.json(Object.fromEntries(rows.map((row) => [row.key, row.value])));
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

settingsAdminRouter.patch("/settings", requireAdmin, async (req, res) => {
  try {
    await connectDB();

    if (req.body.settings && typeof req.body.settings === "object") {
      const entries = Object.entries(req.body.settings as Record<string, unknown>);
      for (const [key, value] of entries) {
        if (typeof key !== "string" || typeof value !== "string") continue;
        await Setting.findOneAndUpdate({ key }, { key, value }, { upsert: true });
      }
      const rows = await Setting.find().lean();
      void triggerLayoutRevalidate();
      res.json({ ok: true, settings: Object.fromEntries(rows.map((row) => [row.key, row.value])) });
      return;
    }

    const key = typeof req.body.key === "string" ? req.body.key : "";
    const value = typeof req.body.value === "string" ? req.body.value : "";
    if (!key) {
      res.status(400).json({ error: "Key required" });
      return;
    }
    const setting = await Setting.findOneAndUpdate(
      { key },
      { key, value },
      { upsert: true, new: true },
    ).lean();
    void triggerLayoutRevalidate();
    res.json({ ok: true, setting });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

settingsAdminRouter.get("/sections", requireAdmin, async (_req, res) => {
  try {
    await connectDB();
    const sections = await HomeSection.find().sort({ order: 1 }).lean();
    res.json({ ok: true, sections });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});

settingsAdminRouter.patch("/sections/:key", requireAdmin, async (req, res) => {
  try {
    const sectionKey = typeof req.params.key === "string" ? req.params.key : "";
    if (!isPublicSectionKey(sectionKey)) {
      res.status(404).json({ ok: false, error: "Section not found" });
      return;
    }
    const update: Record<string, unknown> = {};
    if (typeof req.body.content === "object" && req.body.content !== null) {
      update.content = req.body.content;
    }
    if (typeof req.body.visible === "boolean") {
      update.visible = req.body.visible;
    }
    if (typeof req.body.order === "number") {
      update.order = req.body.order;
    }
    if (Object.keys(update).length === 0) {
      res.status(400).json({ ok: false, error: "Nothing to update" });
      return;
    }
    await connectDB();
    const section = await HomeSection.findOneAndUpdate(
      { sectionKey },
      { $set: update },
      { new: true, upsert: true, runValidators: true },
    ).lean();
    const paths = sectionAffectsLayout(sectionKey)
      ? await resolveAllPublicPaths()
      : getSectionRevalidatePaths(sectionKey);
    void triggerRevalidate(paths);
    res.json({ ok: true, section });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});
