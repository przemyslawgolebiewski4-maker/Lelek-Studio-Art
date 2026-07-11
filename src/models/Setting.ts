import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";

const SettingSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: String, default: "" },
  },
  { collection: "settings" },
);

export type ISetting = InferSchemaType<typeof SettingSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Setting: Model<ISetting> =
  mongoose.models.Setting ?? mongoose.model<ISetting>("Setting", SettingSchema);
