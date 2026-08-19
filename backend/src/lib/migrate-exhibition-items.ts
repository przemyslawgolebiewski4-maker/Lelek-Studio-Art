import mongoose from "mongoose";
import { ExhibitionItem } from "../models/ExhibitionItem";
import { Product } from "../models/Product";
import { allocateInstanceCodes, normalizeCatalogCode } from "./instance-code";

/**
 * One-time / idempotent: copy legacy Product.locationId exhibition rows
 * into ExhibitionItem documents, then clear Product exhibition fields.
 */
export async function migrateProductExhibitionsToItems(): Promise<number> {
  const products = await Product.find({
    locationId: { $ne: null },
    exhibitionStatus: { $in: ["available", "reserved", "sold"] },
  }).lean();

  let created = 0;

  for (const product of products) {
    if (!product.locationId) continue;

    const already = await ExhibitionItem.findOne({
      productId: product._id,
      locationId: product.locationId,
    }).lean();
    if (already) {
      await clearProductExhibition(product._id);
      continue;
    }

    const catalog = normalizeCatalogCode(product.catalog || "");
    if (!catalog) {
      console.warn(
        `[migrate] skip product ${product._id}: catalog "${product.catalog}" is not CE-001 shaped`,
      );
      continue;
    }

    try {
      const status = product.exhibitionStatus;
      if (status !== "available" && status !== "reserved" && status !== "sold") {
        continue;
      }
      const allocated = await allocateInstanceCodes(catalog, product.title);
      await ExhibitionItem.create({
        productId: product._id,
        locationId: product.locationId,
        catalogCode: allocated.catalogCode,
        instanceCode: allocated.instanceCode,
        sequence: allocated.sequence,
        displayLabel: allocated.displayLabel,
        exhibitionStatus: status,
        revolutPaymentLink: product.revolutPaymentLink ?? null,
        soldAt: product.soldAt ?? null,
        pickupAuthorized: Boolean(product.pickupAuthorized),
      });
      created += 1;
      await clearProductExhibition(product._id);
    } catch (err) {
      console.error(`[migrate] failed for product ${product._id}:`, err);
    }
  }

  return created;
}

async function clearProductExhibition(productId: mongoose.Types.ObjectId) {
  await Product.updateOne(
    { _id: productId },
    {
      $set: {
        locationId: null,
        exhibitionStatus: null,
        revolutPaymentLink: null,
        soldAt: null,
        pickupAuthorized: false,
      },
    },
  );
}
