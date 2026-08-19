import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";

const ProductSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    catalog: { type: String, default: "" },
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ["ceramics", "vessels", "wall-objects", "prints"],
      required: true,
    },
    material: { type: String, required: true },
    description: { type: String, default: "" },
    process: { type: String, default: "" },
    etsyUrl: { type: String, default: "" },
    images: { type: [String], default: [] },
    /** Alt text for the primary (first) gallery image - used on Originals cards and product pages. */
    imageAlt: { type: String, default: "" },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    published: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    homeVisible: { type: Boolean, default: false },
    price: { type: Number, default: null },
    nativeCheckout: { type: Boolean, default: false },
    soldOut: { type: Boolean, default: false },
    /** Photo reproduction of a ceramic piece (LELEK Sentences series). Prints only. */
    isPhotoReproduction: { type: Boolean, default: false },
    /** One-of-a-kind Original shown on About (inquiry only - no price on this site). */
    isOriginal: { type: Boolean, default: false },
    thumbnailPosition: { type: String, default: "center" },
    /** Pop-up / consignment exhibition fields (optional — most products are not in a pop-up). */
    locationId: { type: Schema.Types.ObjectId, ref: "Location", default: null },
    exhibitionStatus: {
      type: String,
      enum: ["available", "reserved", "sold", null],
      default: null,
    },
    revolutPaymentLink: { type: String, default: null },
    soldAt: { type: Date, default: null },
    pickupAuthorized: { type: Boolean, default: false },
  },
  { collection: "products", timestamps: true },
);

export type IProduct = InferSchemaType<typeof ProductSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Product: Model<IProduct> =
  mongoose.models.Product ?? mongoose.model<IProduct>("Product", ProductSchema);
