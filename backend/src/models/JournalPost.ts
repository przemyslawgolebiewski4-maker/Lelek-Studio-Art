import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";

const JournalPostSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    excerpt: { type: String, default: "" },
    body: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    published: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { collection: "journal_posts", timestamps: true },
);

export type IJournalPost = InferSchemaType<typeof JournalPostSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const JournalPost: Model<IJournalPost> =
  mongoose.models.JournalPost ?? mongoose.model<IJournalPost>("JournalPost", JournalPostSchema);
