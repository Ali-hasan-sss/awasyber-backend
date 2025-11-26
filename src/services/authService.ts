import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import env from "@/config/env";
import { ApiError } from "@/utils/ApiError";
import { User, IUser } from "@/models/User";

const TOKEN_EXPIRY = "12h";

const generateToken = (user: IUser) => {
  return jwt.sign(
    { userId: user._id.toString(), role: user.role },
    env.jwtSecret,
    { expiresIn: TOKEN_EXPIRY }
  );
};

export const registerAdmin = async (params: {
  name: string;
  email: string;
  phone: string;
  companyName: string;
  password: string;
  setupKey: string;
}) => {
  if (params.setupKey !== env.adminSetupKey) {
    throw new ApiError(403, "Invalid setup key");
  }

  const existing = await User.findOne({ email: params.email });
  if (existing) {
    throw new ApiError(400, "Email already exists");
  }

  const hashedPassword = await bcrypt.hash(params.password, 12);

  const admin = await User.create({
    name: params.name,
    email: params.email,
    phone: params.phone,
    companyName: params.companyName,
    role: "admin",
    password: hashedPassword,
  });

  return admin;
};

export const loginAdmin = async (email: string, password: string) => {
  const admin = await User.findOne({ email, role: "admin" });
  if (!admin || !admin.password) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isValid = await bcrypt.compare(password, admin.password);
  if (!isValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = generateToken(admin);

  return { token, admin };
};

export const loginWithCode = async (email: string, code: string) => {
  const user = await User.findOne({ email });
  if (!user || !user.loginCode) {
    throw new ApiError(401, "Invalid login code");
  }

  const isValid = await bcrypt.compare(code, user.loginCode);
  if (!isValid) {
    throw new ApiError(401, "Invalid login code");
  }

  const token = generateToken(user);
  return { token, user };
};
