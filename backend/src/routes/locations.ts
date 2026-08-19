import { Router } from "express";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import { connectDB } from "../lib/db";
import { requireAdmin, COOKIE_NAME } from "../lib/auth";
import { ExhibitionItem, Location, Product } from "../models";
import { allocateInstanceCodes, normalizeCatalogCode } from "../lib/instance-code";
import { clientIp, logSecurityEvent } from "../lib/security-log";

export const locationsAdminRouter = Router();

const EXHIBITION_STATUSES = ["available", "reserved", "sold"] as const;

const qrRateLimit = rateLimit({
  windowMs: 60_000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: "Too many QR requests — try again shortly." },
  handler: (req, res, _next, options) => {
    logSecurityEvent("qr_rate_limited", { ip: clientIp(req), path: req.path });
    res.status(options.statusCode).json(options.message);
  },
});

function isValidObjectId(id: unknown): id is string {
  return typeof id === "string" && mongoose.Types.ObjectId.isValid(id);
}

function parseDate(value: unknown): Date | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value === "string" || typeof value === "number") {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return null;
}

function pickLocationFields(body: Record<string, unknown>, partial: boolean) {
  const data: Record<string, unknown> = {};

  if ("name" in body || !partial) {
    if (typeof body.name === "string" && body.name.trim()) {
      data.name = body.name.trim();
    } else if (!partial) {
      return { error: "name is required" as const };
    }
  }

  if ("address" in body || !partial) {
    if (typeof body.address === "string" && body.address.trim()) {
      data.address = body.address.trim();
    } else if (!partial) {
      return { error: "address is required" as const };
    }
  }

  if ("contactPerson" in body) {
    data.contactPerson =
      typeof body.contactPerson === "string" ? body.contactPerson.trim() : "";
  } else if (!partial) {
    data.contactPerson = "";
  }

  if ("commissionPercent" in body || !partial) {
    const n = Number(body.commissionPercent);
    if (!Number.isFinite(n) || n < 0 || n > 100) {
      return { error: "commissionPercent must be a number between 0 and 100" as const };
    }
    data.commissionPercent = n;
  }

  if ("startDate" in body || !partial) {
    const startDate = parseDate(body.startDate);
    if (!startDate) {
      return { error: "startDate is required and must be a valid date" as const };
    }
    data.startDate = startDate;
  }

  if ("endDate" in body || !partial) {
    const endDate = parseDate(body.endDate);
    if (!endDate) {
      return { error: "endDate is required and must be a valid date" as const };
    }
    data.endDate = endDate;
  }

  if ("active" in body) {
    data.active = Boolean(body.active);
  } else if (!partial) {
    data.active = true;
  }

  return { data };
}

type LeanProduct = {
  _id: mongoose.Types.ObjectId;
  title: string;
  catalog: string;
  price: number | null;
  images: string[];
  published: boolean;
};

function enrichItem(
  item: {
    _id: mongoose.Types.ObjectId;
    productId: mongoose.Types.ObjectId;
    locationId: mongoose.Types.ObjectId;
    catalogCode: string;
    instanceCode: string;
    sequence: number;
    displayLabel: string;
    exhibitionStatus: string;
    revolutPaymentLink?: string | null;
    soldAt?: Date | null;
    pickupAuthorized?: boolean;
    pickupPreference?: string | null;
    pickupPreferenceSetAt?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
  },
  product: LeanProduct | undefined,
) {
  return {
    _id: item._id,
    productId: item.productId,
    locationId: item.locationId,
    catalogCode: item.catalogCode,
    instanceCode: item.instanceCode,
    sequence: item.sequence,
    displayLabel: item.displayLabel,
    exhibitionStatus: item.exhibitionStatus,
    revolutPaymentLink: item.revolutPaymentLink ?? null,
    soldAt: item.soldAt ?? null,
    pickupAuthorized: Boolean(item.pickupAuthorized),
    pickupPreference:
      item.pickupPreference === "immediate" || item.pickupPreference === "later"
        ? item.pickupPreference
        : null,
    pickupPreferenceSetAt: item.pickupPreferenceSetAt ?? null,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    // Product snapshot for admin table / labels
    title: product?.title ?? item.displayLabel,
    catalog: product?.catalog ?? item.catalogCode,
    price: product?.price ?? null,
    images: product?.images ?? [],
    published: product?.published ?? false,
  };
}

/** GET /admin/locations — list all locations with item counts */
locationsAdminRouter.get("/locations", requireAdmin, async (_req, res) => {
  try {
    await connectDB();
    const locations = await Location.find().sort({ startDate: -1 }).lean();
    const counts = await ExhibitionItem.aggregate<{
      _id: mongoose.Types.ObjectId;
      count: number;
    }>([{ $group: { _id: "$locationId", count: { $sum: 1 } } }]);
    const countById = new Map(counts.map((row) => [String(row._id), row.count]));
    res.json({
      ok: true,
      locations: locations.map((loc) => ({
        ...loc,
        itemCount: countById.get(String(loc._id)) ?? 0,
      })),
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});

locationsAdminRouter.post("/locations", requireAdmin, async (req, res) => {
  try {
    await connectDB();
    const picked = pickLocationFields(req.body as Record<string, unknown>, false);
    if ("error" in picked) {
      res.status(400).json({ ok: false, error: picked.error });
      return;
    }
    const location = await Location.create(picked.data);
    res.status(201).json({ ok: true, location });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});

locationsAdminRouter.patch("/locations/:id", requireAdmin, async (req, res) => {
  try {
    await connectDB();
    if (!isValidObjectId(req.params.id)) {
      res.status(400).json({ ok: false, error: "Invalid location id" });
      return;
    }
    const picked = pickLocationFields(req.body as Record<string, unknown>, true);
    if ("error" in picked) {
      res.status(400).json({ ok: false, error: picked.error });
      return;
    }
    if (Object.keys(picked.data).length === 0) {
      res.status(400).json({ ok: false, error: "No valid fields to update" });
      return;
    }
    const location = await Location.findByIdAndUpdate(req.params.id, picked.data, {
      new: true,
      runValidators: true,
    }).lean();
    if (!location) {
      res.status(404).json({ ok: false, error: "Not found" });
      return;
    }
    res.json({ ok: true, location });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});

locationsAdminRouter.delete("/locations/:id", requireAdmin, async (req, res) => {
  try {
    await connectDB();
    if (!isValidObjectId(req.params.id)) {
      res.status(400).json({ ok: false, error: "Invalid location id" });
      return;
    }
    const assigned = await ExhibitionItem.countDocuments({ locationId: req.params.id });
    if (assigned > 0) {
      res.status(409).json({
        ok: false,
        error: `Cannot delete location: ${assigned} exhibition item(s) are still assigned. Remove them first.`,
      });
      return;
    }
    const location = await Location.findByIdAndDelete(req.params.id);
    if (!location) {
      res.status(404).json({ ok: false, error: "Not found" });
      return;
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});

/** GET /admin/locations/:id/products — exhibition items at location (enriched) */
locationsAdminRouter.get("/locations/:id/products", requireAdmin, async (req, res) => {
  try {
    await connectDB();
    if (!isValidObjectId(req.params.id)) {
      res.status(400).json({ ok: false, error: "Invalid location id" });
      return;
    }
    const location = await Location.findById(req.params.id).lean();
    if (!location) {
      res.status(404).json({ ok: false, error: "Not found" });
      return;
    }
    const items = await ExhibitionItem.find({ locationId: req.params.id })
      .sort({ createdAt: -1 })
      .lean();
    const productIds = items.map((i) => i.productId);
    const products = await Product.find({ _id: { $in: productIds } }).lean();
    const byId = new Map(products.map((p) => [String(p._id), p as LeanProduct]));
    const enriched = items.map((item) => enrichItem(item, byId.get(String(item.productId))));
    res.json({ ok: true, location, products: enriched, items: enriched });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});

/**
 * POST /admin/locations/:id/items
 * Create a new physical instance of a product at this location.
 * Body: { productId, revolutPaymentLink? } — instanceCode is server-generated.
 */
locationsAdminRouter.post("/locations/:id/items", requireAdmin, async (req, res) => {
  try {
    await connectDB();
    if (!isValidObjectId(req.params.id)) {
      res.status(400).json({ ok: false, error: "Invalid location id" });
      return;
    }
    const location = await Location.findById(req.params.id).lean();
    if (!location) {
      res.status(404).json({ ok: false, error: "Location not found" });
      return;
    }

    const body = req.body as Record<string, unknown>;
    if ("instanceCode" in body || "sequence" in body || "displayLabel" in body) {
      res.status(400).json({
        ok: false,
        error: "instanceCode / sequence / displayLabel are server-generated and cannot be set by the client.",
      });
      return;
    }

    if (!isValidObjectId(body.productId)) {
      res.status(400).json({ ok: false, error: "productId is required" });
      return;
    }

    const product = await Product.findById(body.productId).lean();
    if (!product) {
      res.status(404).json({ ok: false, error: "Product not found" });
      return;
    }
    if (!normalizeCatalogCode(product.catalog || "")) {
      res.status(400).json({
        ok: false,
        error: "Product catalog must match CE-001 format before creating an instance.",
      });
      return;
    }
    if (typeof product.price !== "number" || !Number.isFinite(product.price)) {
      res.status(400).json({
        ok: false,
        error: "Product has no price. Set Price (EUR) on the product before adding it to a pop-up.",
      });
      return;
    }

    const allocated = await allocateInstanceCodes(product.catalog, product.title);
    const revolut =
      typeof body.revolutPaymentLink === "string" ? body.revolutPaymentLink.trim() || null : null;

    const item = await ExhibitionItem.create({
      productId: product._id,
      locationId: location._id,
      catalogCode: allocated.catalogCode,
      instanceCode: allocated.instanceCode,
      sequence: allocated.sequence,
      displayLabel: allocated.displayLabel,
      exhibitionStatus: "available",
      revolutPaymentLink: revolut,
      soldAt: null,
      pickupAuthorized: false,
    });

    res.status(201).json({
      ok: true,
      item: enrichItem(item.toObject(), product as LeanProduct),
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});

/**
 * GET /admin/locations/:locationId/items/:itemId/qr
 * PNG QR → FRONTEND_URL/reserve/{instanceCode}
 */
locationsAdminRouter.get(
  "/locations/:locationId/items/:itemId/qr",
  (req, res, next) => {
    const token =
      req.cookies?.[COOKIE_NAME] ?? req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      logSecurityEvent("qr_unauthenticated", { ip: clientIp(req), path: req.path });
    }
    next();
  },
  qrRateLimit,
  requireAdmin,
  async (req, res) => {
    try {
      await connectDB();
      const { locationId, itemId } = req.params;
      if (!isValidObjectId(locationId) || !isValidObjectId(itemId)) {
        res.status(400).json({ ok: false, error: "Invalid location or item id" });
        return;
      }

      const item = await ExhibitionItem.findById(itemId).lean();
      if (!item) {
        res.status(404).json({ ok: false, error: "Exhibition item not found" });
        return;
      }
      if (String(item.locationId) !== String(locationId)) {
        res.status(400).json({ ok: false, error: "Item is not assigned to this location." });
        return;
      }

      const siteUrl = (
        process.env.FRONTEND_URL ||
        process.env.SITE_URL ||
        "https://www.lelekstudio.com"
      )
        .trim()
        .replace(/\/+$/, "");
      const targetUrl = `${siteUrl}/reserve/${encodeURIComponent(item.instanceCode)}`;

      const QRCode = (await import("qrcode")).default;
      const png = await QRCode.toBuffer(targetUrl, {
        type: "png",
        errorCorrectionLevel: "H",
        margin: 1,
        width: 512,
        color: { dark: "#0B0A08", light: "#FFFFFF" },
      });

      const safeName = item.instanceCode.replace(/[^a-zA-Z0-9_-]+/g, "-");
      res.setHeader("Content-Type", "image/png");
      res.setHeader("Content-Disposition", `attachment; filename="${safeName}-qr.png"`);
      res.setHeader("Cache-Control", "private, no-store");
      res.send(png);
    } catch (err) {
      res.status(500).json({ ok: false, error: String(err) });
    }
  },
);

locationsAdminRouter.get("/locations/:id/summary", requireAdmin, async (req, res) => {
  try {
    await connectDB();
    if (!isValidObjectId(req.params.id)) {
      res.status(400).json({ ok: false, error: "Invalid location id" });
      return;
    }
    const location = await Location.findById(req.params.id).lean();
    if (!location) {
      res.status(404).json({ ok: false, error: "Not found" });
      return;
    }

    const soldItems = await ExhibitionItem.find({
      locationId: req.params.id,
      exhibitionStatus: "sold",
    })
      .select("productId")
      .lean();

    const productIds = soldItems.map((i) => i.productId);
    const products = await Product.find({ _id: { $in: productIds } })
      .select("price")
      .lean();
    const priceById = new Map(
      products.map((p) => [String(p._id), typeof p.price === "number" ? p.price : 0]),
    );

    const soldCount = soldItems.length;
    const soldTotal = soldItems.reduce(
      (sum, i) => sum + (priceById.get(String(i.productId)) ?? 0),
      0,
    );
    const commissionOwed = soldTotal * (location.commissionPercent / 100);
    const netForPrzemek = soldTotal - commissionOwed;

    res.json({ ok: true, soldCount, soldTotal, commissionOwed, netForPrzemek });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});

/**
 * PATCH /admin/exhibition-items/:id
 * Update status / payment link / pickup. Rejects client instanceCode overrides.
 */
locationsAdminRouter.patch("/exhibition-items/:id", requireAdmin, async (req, res) => {
  try {
    await connectDB();
    if (!isValidObjectId(req.params.id)) {
      res.status(400).json({ ok: false, error: "Invalid item id" });
      return;
    }

    const body = req.body as Record<string, unknown>;
    if ("instanceCode" in body || "sequence" in body || "displayLabel" in body || "catalogCode" in body) {
      res.status(400).json({
        ok: false,
        error: "instanceCode / sequence / displayLabel / catalogCode cannot be changed by the client.",
      });
      return;
    }

    const updates: Record<string, unknown> = {};

    if ("exhibitionStatus" in body) {
      if (
        typeof body.exhibitionStatus === "string" &&
        (EXHIBITION_STATUSES as readonly string[]).includes(body.exhibitionStatus)
      ) {
        updates.exhibitionStatus = body.exhibitionStatus;
      } else {
        res.status(400).json({
          ok: false,
          error: "exhibitionStatus must be available, reserved, or sold",
        });
        return;
      }
    }

    if ("revolutPaymentLink" in body) {
      if (body.revolutPaymentLink === null) {
        updates.revolutPaymentLink = null;
      } else if (typeof body.revolutPaymentLink === "string") {
        updates.revolutPaymentLink = body.revolutPaymentLink.trim() || null;
      } else {
        res.status(400).json({ ok: false, error: "revolutPaymentLink must be a string or null" });
        return;
      }
    }

    if ("pickupAuthorized" in body) {
      updates.pickupAuthorized = Boolean(body.pickupAuthorized);
    }

    // pickupPreference is buyer-intent only — admin must not set it via this route,
    // and it must never be wired to pickupAuthorized / exhibitionStatus here.
    if ("pickupPreference" in body || "pickupPreferenceSetAt" in body) {
      res.status(400).json({
        ok: false,
        error:
          "pickupPreference is buyer intent only and cannot be set from admin. It never unlocks pickupAuthorized.",
      });
      return;
    }

    if (Object.keys(updates).length === 0) {
      res.status(400).json({ ok: false, error: "No valid fields to update" });
      return;
    }

    const existing = await ExhibitionItem.findById(req.params.id).lean();
    if (!existing) {
      res.status(404).json({ ok: false, error: "Not found" });
      return;
    }

    if ("exhibitionStatus" in updates) {
      if (updates.exhibitionStatus === "sold" && existing.exhibitionStatus !== "sold") {
        updates.soldAt = new Date();
      } else if (updates.exhibitionStatus !== "sold") {
        updates.soldAt = null;
      }
    }

    const item = await ExhibitionItem.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).lean();
    if (!item) {
      res.status(404).json({ ok: false, error: "Not found" });
      return;
    }

    const product = await Product.findById(item.productId).lean();
    res.json({ ok: true, item: enrichItem(item, product as LeanProduct | undefined) });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});

/** DELETE /admin/exhibition-items/:id — remove piece from location */
locationsAdminRouter.delete("/exhibition-items/:id", requireAdmin, async (req, res) => {
  try {
    await connectDB();
    if (!isValidObjectId(req.params.id)) {
      res.status(400).json({ ok: false, error: "Invalid item id" });
      return;
    }
    const item = await ExhibitionItem.findByIdAndDelete(req.params.id);
    if (!item) {
      res.status(404).json({ ok: false, error: "Not found" });
      return;
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});
