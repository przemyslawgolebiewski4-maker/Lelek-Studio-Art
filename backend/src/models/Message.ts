import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";

const MessageSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, default: "" },
    message: { type: String, required: true },
    type: { type: String, enum: ["general", "architect", "custom-order"], default: "general" },
    company: { type: String, default: "" },
    projectType: { type: String, default: "" },
    read: { type: Boolean, default: false },
  },
  { collection: "messages", timestamps: true },
);

export type IMessage = InferSchemaType<typeof MessageSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Message: Model<IMessage> =
  mongoose.models.Message ?? mongoose.model<IMessage>("Message", MessageSchema);
