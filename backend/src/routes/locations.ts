import { Router } from "express";
import mongoose from "mongoose";
import { connectDB } from "../lib/db";
import { requireAdmin } from "../lib/auth";
import { Location, Product } from "../models";

export const locationsAdminRouter = Router();

const EXHIBITION_STATUSES = ["available", "reserved", "sold"] as const;

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

/** GET /admin/locations — list all locations with item counts */
locationsAdminRouter.get("/locations", requireAdmin, async (_req, res) => {
  try {
    await connectDB();
    const locations = await Location.find().sort({ startDate: -1 }).lean();
    const counts = await Product.aggregate<{ _id: mongoose.Types.ObjectId; count: number }>([
      { $match: { locationId: { $ne: null } } },
      { $group: { _id: "$locationId", count: { $sum: 1 } } },
    ]);
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

/** POST /admin/locations — create a location */
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

/** PATCH /admin/locations/:id — update a location */
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

/** DELETE /admin/locations/:id — delete only if no products assigned */
locationsAdminRouter.delete("/locations/:id", requireAdmin, async (req, res) => {
  try {
    await connectDB();
    if (!isValidObjectId(req.params.id)) {
      res.status(400).json({ ok: false, error: "Invalid location id" });
      return;
    }
    const assigned = await Product.countDocuments({ locationId: req.params.id });
    if (assigned > 0) {
      res.status(409).json({
        ok: false,
        error: `Cannot delete location: ${assigned} product(s) are still assigned. Reassign or clear them first.`,
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

/** GET /admin/locations/:id/products — products at this location */
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
    const products = await Product.find({ locationId: req.params.id })
      .sort({ order: 1, createdAt: -1 })
      .lean();
    res.json({ ok: true, location, products });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});

/** GET /admin/locations/:id/summary — sold totals + commission */
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

    const sold = await Product.find({
      locationId: req.params.id,
      exhibitionStatus: "sold",
    })
      .select("price")
      .lean();

    const soldCount = sold.length;
    const soldTotal = sold.reduce((sum, p) => sum + (typeof p.price === "number" ? p.price : 0), 0);
    const commissionOwed = soldTotal * (location.commissionPercent / 100);
    const netForPrzemek = soldTotal - commissionOwed;

    res.json({
      ok: true,
      soldCount,
      soldTotal,
      commissionOwed,
      netForPrzemek,
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});

const EXHIBITION_FIELDS = [
  "locationId",
  "exhibitionStatus",
  "revolutPaymentLink",
  "pickupAuthorized",
] as const;

/**
 * PATCH /admin/products/:id/exhibition
 * Updates exhibition fields. soldAt is set server-side when status becomes "sold".
 */
locationsAdminRouter.patch("/products/:id/exhibition", requireAdmin, async (req, res) => {
  try {
    await connectDB();
    if (!isValidObjectId(req.params.id)) {
      res.status(400).json({ ok: false, error: "Invalid product id" });
      return;
    }

    const body = req.body as Record<string, unknown>;
    const updates: Record<string, unknown> = {};

    for (const key of EXHIBITION_FIELDS) {
      if (!(key in body)) continue;

      if (key === "locationId") {
        if (body.locationId === null || body.locationId === "") {
          updates.locationId = null;
        } else if (isValidObjectId(body.locationId)) {
          const loc = await Location.findById(body.locationId).lean();
          if (!loc) {
            res.status(400).json({ ok: false, error: "locationId does not match a location" });
            return;
          }
          updates.locationId = body.locationId;
        } else {
          res.status(400).json({ ok: false, error: "locationId must be a valid id or null" });
          return;
        }
      } else if (key === "exhibitionStatus") {
        if (body.exhibitionStatus === null) {
          updates.exhibitionStatus = null;
        } else if (
          typeof body.exhibitionStatus === "string" &&
          (EXHIBITION_STATUSES as readonly string[]).includes(body.exhibitionStatus)
        ) {
          updates.exhibitionStatus = body.exhibitionStatus;
        } else {
          res.status(400).json({
            ok: false,
            error: "exhibitionStatus must be available, reserved, sold, or null",
          });
          return;
        }
      } else if (key === "revolutPaymentLink") {
        if (body.revolutPaymentLink === null) {
          updates.revolutPaymentLink = null;
        } else if (typeof body.revolutPaymentLink === "string") {
          updates.revolutPaymentLink = body.revolutPaymentLink.trim() || null;
        } else {
          res.status(400).json({ ok: false, error: "revolutPaymentLink must be a string or null" });
          return;
        }
      } else if (key === "pickupAuthorized") {
        updates.pickupAuthorized = Boolean(body.pickupAuthorized);
      }
    }

    if (Object.keys(updates).length === 0) {
      res.status(400).json({ ok: false, error: "No valid exhibition fields to update" });
      return;
    }

    const existing = await Product.findById(req.params.id).lean();
    if (!existing) {
      res.status(404).json({ ok: false, error: "Not found" });
      return;
    }

    // soldAt: set server-side when becoming sold; clear when leaving sold
    if ("exhibitionStatus" in updates) {
      if (updates.exhibitionStatus === "sold" && existing.exhibitionStatus !== "sold") {
        updates.soldAt = new Date();
      } else if (updates.exhibitionStatus !== "sold") {
        updates.soldAt = null;
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
    res.json({ ok: true, product });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});
