import { Request, Response, NextFunction } from "express";
import {
  loginAdmin,
  loginWithCode,
  registerAdmin,
} from "@/services/authService";

export const registerAdminHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const admin = await registerAdmin(req.body);
    res.status(201).json({
      message: "Admin created successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginAdminHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token, admin } = await loginAdmin(
      req.body.email,
      req.body.password
    );
    res.json({
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginWithCodeHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token, user } = await loginWithCode(req.body.email, req.body.code);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};
