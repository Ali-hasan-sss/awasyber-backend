import { Schema, model, Document } from "mongoose";

export type UserRole = "admin" | "client";

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  companyName: string;
  role: UserRole;
  password?: string;
  loginCode?: string; // Hashed login code
  rawLoginCode?: string; // Raw login code for display (e.g., awa123456)
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true, unique: true },
    companyName: { type: String, required: true },
    role: { type: String, enum: ["admin", "client"], default: "client" },
    password: { type: String },
    loginCode: { type: String }, // Hashed login code
    rawLoginCode: { type: String }, // Raw login code for display
  },
  { timestamps: true }
);

export const User = model<IUser>("User", userSchema);
