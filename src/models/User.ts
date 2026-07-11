import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";

const AdminPermissionsSchema = new Schema(
  {
    home: { type: Boolean, default: false },
    shop: { type: Boolean, default: false },
    journal: { type: Boolean, default: false },
    messages: { type: Boolean, default: false },
    seo: { type: Boolean, default: false },
    users: { type: Boolean, default: false },
  },
  { _id: false },
);

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    emailVerified: { type: Boolean, default: false },
    adminRole: { type: String, default: null },
    adminPermissions: { type: AdminPermissionsSchema, default: {} },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "users" },
);

export type IUser = InferSchemaType<typeof UserSchema> & { _id: mongoose.Types.ObjectId };

export function isLelekAdmin(user: Pick<IUser, "adminRole"> | null | undefined): boolean {
  return user?.adminRole === "lelek_admin";
}

export const User: Model<IUser> =
  mongoose.models.User ?? mongoose.model<IUser>("User", UserSchema);
