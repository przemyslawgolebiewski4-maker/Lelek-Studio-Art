import { Router } from "express";
import { connectDB } from "../lib/db";
import { Location, Product } from "../models";

export const reservePublicRouter = Router();

/**
 * GET /public/reserve/:catalogCode
 * Buyer-facing reservation payload. Matches Product.catalog.
 * Omits revolutPaymentLink unless exhibitionStatus === "available".
 */
reservePublicRouter.get("/public/reserve/:catalogCode", async (req, res) => {
  try {
    await connectDB();
    const catalogCode =
      typeof req.params.catalogCode === "string" ? req.params.catalogCode.trim() : "";
    if (!catalogCode) {
      res.status(404).json({ error: "Not found" });
      return;
    }

    const product = await Product.findOne({
      catalog: catalogCode,
      locationId: { $ne: null },
    }).lean();

    if (!product || !product.locationId) {
      res.status(404).json({ error: "Not found" });
      return;
    }

    const status = product.exhibitionStatus;
    if (status !== "available" && status !== "reserved" && status !== "sold") {
      // null / unknown → treat as not part of an active pop-up listing
      res.status(404).json({ error: "Not found" });
      return;
    }

    const location = await Location.findById(product.locationId).lean();
    if (!location) {
      res.status(404).json({ error: "Not found" });
      return;
    }

    const responseData: Record<string, unknown> = {
      title: product.title,
      catalogCode: product.catalog,
      price: product.price,
      imageUrl: Array.isArray(product.images) && product.images[0] ? product.images[0] : "",
      description: product.description ?? "",
      exhibitionStatus: status,
      locationName: location.name,
      exhibitionEndDate: location.endDate,
    };

    // Only expose payment link while available — omit key entirely otherwise
    if (status === "available") {
      responseData.revolutPaymentLink = product.revolutPaymentLink ?? null;
    }

    res.json(responseData);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});
