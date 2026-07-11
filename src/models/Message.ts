import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";

const MessageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, default: "", trim: true },
    message: { type: String, required: true, trim: true },
    type: { type: String, enum: ["general", "architect"], default: "general" },
    read: { type: Boolean, default: false },
  },
  { collection: "messages", timestamps: true },
);

export type IMessage = InferSchemaType<typeof MessageSchema> & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const Message: Model<IMessage> =
  mongoose.models.Message ?? mongoose.model<IMessage>("Message", MessageSchema);
