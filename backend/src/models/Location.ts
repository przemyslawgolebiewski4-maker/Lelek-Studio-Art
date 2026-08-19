import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";

const LocationSchema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    contactPerson: { type: String, default: "" },
    commissionPercent: { type: Number, required: true, min: 0, max: 100 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    active: { type: Boolean, default: true },
  },
  { collection: "locations", timestamps: true },
);

export type ILocation = InferSchemaType<typeof LocationSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Location: Model<ILocation> =
  mongoose.models.Location ?? mongoose.model<ILocation>("Location", LocationSchema);
