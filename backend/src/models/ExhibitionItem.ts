import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";

/**
 * One physical piece placed in a pop-up / consignment location.
 * Product = design (shared catalog CE-001); ExhibitionItem = unit CE-001-01.
 */
const ExhibitionItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    locationId: { type: Schema.Types.ObjectId, ref: "Location", required: true, index: true },
    /** Denormalized Product.catalog (uppercase), used for per-design sequencing */
    catalogCode: { type: String, required: true, index: true },
    /** Unique URL token, e.g. CE-001-01 — server-generated only */
    instanceCode: { type: String, required: true, unique: true },
    sequence: { type: Number, required: true, min: 1, max: 99 },
    /** Admin-only label, e.g. "CE-001 · Soft Drip Cup #01" */
    displayLabel: { type: String, required: true },
    exhibitionStatus: {
      type: String,
      enum: ["available", "reserved", "sold"],
      required: true,
      default: "available",
    },
    revolutPaymentLink: { type: String, default: null },
    soldAt: { type: Date, default: null },
    pickupAuthorized: { type: Boolean, default: false },
  },
  { collection: "exhibition_items", timestamps: true },
);

ExhibitionItemSchema.index({ locationId: 1, createdAt: -1 });
ExhibitionItemSchema.index({ catalogCode: 1, sequence: -1 });

export type IExhibitionItem = InferSchemaType<typeof ExhibitionItemSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const ExhibitionItem: Model<IExhibitionItem> =
  mongoose.models.ExhibitionItem ??
  mongoose.model<IExhibitionItem>("ExhibitionItem", ExhibitionItemSchema);
