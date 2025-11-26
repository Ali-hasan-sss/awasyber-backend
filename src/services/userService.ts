import bcrypt from "bcryptjs";
import { ApiError } from "@/utils/ApiError";
import { User, IUser, UserRole } from "@/models/User";
import { generateLoginCode } from "@/utils/generateLoginCode";

interface CreateUserDTO {
  name: string;
  email: string;
  phone: string;
  companyName: string;
  role?: UserRole;
}

export const createUser = async (payload: CreateUserDTO) => {
  const exists = await User.findOne({
    $or: [{ email: payload.email }, { phone: payload.phone }],
  });
  if (exists) {
    throw new ApiError(400, "Email or phone already exists");
  }

  // Generate unique login code for new user (format: awa + 6 digits)
  let rawCode: string | undefined = undefined;
  let codeExists = true;
  let attempts = 0;
  const maxAttempts = 100;

  // Ensure the code is unique
  while (codeExists && attempts < maxAttempts) {
    rawCode = generateLoginCode();
    const existingUser = await User.findOne({ rawLoginCode: rawCode });
    if (!existingUser) {
      codeExists = false;
    }
    attempts++;
  }

  if (codeExists || !rawCode) {
    throw new ApiError(500, "Failed to generate unique login code");
  }

  // At this point, TypeScript knows rawCode is defined
  const hashedCode = await bcrypt.hash(rawCode, 10);

  const user = await User.create({
    ...payload,
    role: payload.role || "client",
    loginCode: hashedCode,
    rawLoginCode: rawCode, // Store raw code for display
  });

  // Return user with the raw login code
  const userObj = user.toObject();
  return {
    ...userObj,
    loginCode: rawCode, // Return the raw code for display
    hasLoginCode: true, // Always true for newly created users
  };
};

export const listUsers = async (options?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: "admin" | "client";
}) => {
  const page = options?.page || 1;
  const limit = options?.limit || 10;
  const skip = (page - 1) * limit;

  // Build query
  const query: any = {};

  // Search by name or email
  if (options?.search) {
    query.$or = [
      { name: { $regex: options.search, $options: "i" } },
      { email: { $regex: options.search, $options: "i" } },
    ];
  }

  // Filter by role
  if (options?.role) {
    query.role = options.role;
  }

  // Get total count
  const total = await User.countDocuments(query);

  // Get users with pagination
  const users = await User.find(query)
    .select("-password -loginCode")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .lean();

  return {
    users: users.map((user: any) => {
      // Check if loginCode exists
      const hasLoginCode = !!(
        user.loginCode &&
        typeof user.loginCode === "string" &&
        user.loginCode.length > 0
      );
      return {
        ...user,
        hasLoginCode,
        loginCode: user.rawLoginCode || undefined, // Return raw code for display
      };
    }),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getUserById = async (id: string) => {
  const user = await User.findById(id).select("-password -loginCode");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return {
    ...user.toObject(),
    hasLoginCode: !!user.loginCode,
    loginCode: user.rawLoginCode || undefined, // Return raw code for display
  };
};

export const updateUser = async (
  id: string,
  payload: Partial<CreateUserDTO>
) => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (payload.email && payload.email !== user.email) {
    const emailExists = await User.findOne({ email: payload.email });
    if (emailExists) {
      throw new ApiError(400, "Email already in use");
    }
  }

  if (payload.phone && payload.phone !== user.phone) {
    const phoneExists = await User.findOne({ phone: payload.phone });
    if (phoneExists) {
      throw new ApiError(400, "Phone already in use");
    }
  }

  Object.assign(user, payload);
  await user.save();

  return {
    ...user.toObject(),
    hasLoginCode: !!user.loginCode,
    loginCode: user.rawLoginCode || undefined, // Return raw code for display
  };
};

export const deleteUser = async (id: string) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user;
};

export const generateUserLoginCode = async (id: string) => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Generate unique login code (format: awa + 6 digits)
  let rawCode: string | undefined = undefined;
  let codeExists = true;
  let attempts = 0;
  const maxAttempts = 100;

  // Ensure the code is unique
  while (codeExists && attempts < maxAttempts) {
    rawCode = generateLoginCode();
    const existingUser = await User.findOne({ rawLoginCode: rawCode });
    if (!existingUser) {
      codeExists = false;
    }
    attempts++;
  }

  if (codeExists || !rawCode) {
    throw new ApiError(500, "Failed to generate unique login code");
  }

  // At this point, TypeScript knows rawCode is defined
  const hashedCode = await bcrypt.hash(rawCode, 10);

  user.loginCode = hashedCode;
  user.rawLoginCode = rawCode; // Store raw code for display

  await user.save();

  return {
    code: rawCode,
  };
};
