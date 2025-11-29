import { Schema, model, Document } from "mongoose";

export type UserRole = "admin" | "client" | "employee";

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  companyName: string;
  role: UserRole;
  password?: string;
  loginCode?: string; // Hashed login code (deprecated - only for old clients)
  rawLoginCode?: string; // Raw login code for display (deprecated)
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true, unique: true },
    companyName: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "client", "employee"],
      default: "client",
    },
    password: { type: String },
    loginCode: { type: String }, // Hashed login code (deprecated)
    rawLoginCode: { type: String }, // Raw login code for display (deprecated)
  },
  { timestamps: true }
);

export const User = model<IUser>("User", userSchema);
