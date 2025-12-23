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
  // Allow both admin and employee roles to login
  const user = await User.findOne({
    email,
    role: { $in: ["admin", "employee"] },
  });
  if (!user || !user.password) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = generateToken(user);

  return { token, admin: user };
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

// Login with code only (no email required)
export const loginWithCodeOnly = async (code: string) => {
  // Find user by rawLoginCode first (faster lookup)
  const user = await User.findOne({ rawLoginCode: code });
  if (!user || !user.loginCode) {
    throw new ApiError(401, "Invalid login code");
  }

  // Verify the code matches the hashed version
  const isValid = await bcrypt.compare(code, user.loginCode);
  if (!isValid) {
    throw new ApiError(401, "Invalid login code");
  }

  const token = generateToken(user);
  return { token, user };
};

export const updateProfile = async (
  userId: string,
  payload: { name?: string; email?: string; phone?: string }
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Check if email is being changed and if it's already in use
  if (payload.email && payload.email !== user.email) {
    const emailExists = await User.findOne({ email: payload.email });
    if (emailExists) {
      throw new ApiError(400, "Email already in use");
    }
  }

  // Check if phone is being changed and if it's already in use
  if (payload.phone && payload.phone !== user.phone) {
    const phoneExists = await User.findOne({ phone: payload.phone });
    if (phoneExists) {
      throw new ApiError(400, "Phone already in use");
    }
  }

  // Update fields
  if (payload.name) user.name = payload.name;
  if (payload.email) user.email = payload.email;
  if (payload.phone) user.phone = payload.phone;

  await user.save();

  // Return user without sensitive data
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };
};

export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
) => {
  const user = await User.findById(userId);
  if (!user || !user.password) {
    throw new ApiError(404, "User not found");
  }

  // Verify current password
  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) {
    throw new ApiError(400, "Current password is incorrect");
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  user.password = hashedPassword;
  await user.save();

  return { message: "Password updated successfully" };
};
