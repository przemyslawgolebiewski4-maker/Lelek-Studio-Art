import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";

const GallerySchema = new Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    city: { type: String, default: "" },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { collection: "galleries", timestamps: true },
);

export type IGallery = InferSchemaType<typeof GallerySchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Gallery: Model<IGallery> =
  mongoose.models.Gallery ?? mongoose.model<IGallery>("Gallery", GallerySchema);
