import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";

const HomeSectionSchema = new Schema(
  {
    sectionKey: {
      type: String,
      required: true,
      unique: true,
      enum: ["hero", "story", "signpost", "elements", "featured", "architects", "journal", "find"],
    },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
    content: { type: Schema.Types.Mixed, default: {} },
  },
  { collection: "home_sections", timestamps: true },
);

export type IHomeSection = InferSchemaType<typeof HomeSectionSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const HomeSection: Model<IHomeSection> =
  mongoose.models.HomeSection ??
  mongoose.model<IHomeSection>("HomeSection", HomeSectionSchema);
