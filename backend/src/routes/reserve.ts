import { Router } from "express";
import rateLimit from "express-rate-limit";
import { connectDB } from "../lib/db";
import { ExhibitionItem, Location, Product } from "../models";
import { INSTANCE_CODE_RE } from "../lib/instance-code";
import { buildReservePublicPayload } from "../lib/reserve-payload";
import { clientIp, logSecurityEvent } from "../lib/security-log";

export const reservePublicRouter = Router();

const reserveRateLimit = rateLimit({
  windowMs: 60_000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests — try again shortly." },
  handler: (req, res, _next, options) => {
    logSecurityEvent("reserve_rate_limited", { ip: clientIp(req), path: req.path });
    res.status(options.statusCode).json(options.message);
  },
});

const PICKUP_PREFERENCES = new Set(["immediate", "later"]);

/**
 * GET /public/reserve/:instanceCode
 * Buyer-facing reservation payload. Matches ExhibitionItem.instanceCode exactly
 * (plain string equality — never a raw operator object).
 * Omits revolutPaymentLink unless exhibitionStatus === "available".
 */
reservePublicRouter.get(
  "/public/reserve/:instanceCode",
  reserveRateLimit,
  async (req, res) => {
    try {
      const raw =
        typeof req.params.instanceCode === "string" ? req.params.instanceCode.trim() : "";
      const instanceCode = raw.toUpperCase();

      // Reject before any DB work — blocks enumeration noise & NoSQL operator injection
      if (!INSTANCE_CODE_RE.test(instanceCode)) {
        logSecurityEvent("reserve_invalid_code", { ip: clientIp(req), code: raw.slice(0, 64) });
        res.status(404).json({ error: "Not found" });
        return;
      }

      await connectDB();

      // Plain equality on a validated string — never spread client input into the query
      const item = await ExhibitionItem.findOne({ instanceCode }).lean();
      if (!item) {
        logSecurityEvent("reserve_miss", { ip: clientIp(req), instanceCode });
        res.status(404).json({ error: "Not found" });
        return;
      }

      const product = await Product.findById(item.productId).lean();
      const location = await Location.findById(item.locationId).lean();
      if (!product || !location) {
        res.status(404).json({ error: "Not found" });
        return;
      }

      const status = item.exhibitionStatus;
      if (status !== "available" && status !== "reserved" && status !== "sold") {
        res.status(404).json({ error: "Not found" });
        return;
      }

      const payload = buildReservePublicPayload({
        title: product.title,
        catalogCode: item.catalogCode,
        instanceCode: item.instanceCode,
        category: product.category ?? "",
        material: product.material ?? "",
        price: typeof product.price === "number" ? product.price : null,
        imageUrl: Array.isArray(product.images) && product.images[0] ? product.images[0] : "",
        description: product.description ?? "",
        exhibitionStatus: status,
        revolutPaymentLink: item.revolutPaymentLink,
        locationName: location.name,
        exhibitionEndDate: location.endDate,
      });

      res.json(payload);
    } catch (err) {
      res.status(500).json({ error: String(err) });
    }
  },
);

/**
 * POST /public/reserve/:instanceCode/pickup-preference
 * Records buyer pickup intent before Revolut redirect.
 * Does NOT touch pickupAuthorized, exhibitionStatus, soldAt, or payment fields.
 */
reservePublicRouter.post(
  "/public/reserve/:instanceCode/pickup-preference",
  reserveRateLimit,
  async (req, res) => {
    try {
      const raw =
        typeof req.params.instanceCode === "string" ? req.params.instanceCode.trim() : "";
      const instanceCode = raw.toUpperCase();

      if (!INSTANCE_CODE_RE.test(instanceCode)) {
        logSecurityEvent("pickup_pref_invalid_code", {
          ip: clientIp(req),
          code: raw.slice(0, 64),
        });
        res.status(404).json({ error: "Not found" });
        return;
      }

      const preference =
        typeof req.body?.preference === "string" ? req.body.preference.trim() : "";
      if (!PICKUP_PREFERENCES.has(preference)) {
        res.status(400).json({
          error: "preference must be 'immediate' or 'later'",
        });
        return;
      }

      await connectDB();

      // Only these two fields — never pickupAuthorized / exhibitionStatus
      const item = await ExhibitionItem.findOneAndUpdate(
        { instanceCode },
        {
          $set: {
            pickupPreference: preference,
            pickupPreferenceSetAt: new Date(),
          },
        },
        { new: true, projection: { instanceCode: 1, pickupPreference: 1, pickupPreferenceSetAt: 1 } },
      ).lean();

      if (!item) {
        logSecurityEvent("pickup_pref_miss", { ip: clientIp(req), instanceCode });
        res.status(404).json({ error: "Not found" });
        return;
      }

      res.json({
        ok: true,
        instanceCode: item.instanceCode,
        pickupPreference: item.pickupPreference,
        pickupPreferenceSetAt: item.pickupPreferenceSetAt,
      });
    } catch (err) {
      res.status(500).json({ error: String(err) });
    }
  },
);
