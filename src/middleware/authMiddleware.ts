import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import env from "../config/env";
import { ApiError } from "@/utils/ApiError";

interface JwtPayload {
  userId: string;
  role: "admin" | "client";
}

export const authenticate =
  (requireAdmin = false) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return next(new ApiError(401, "Authentication required"));
    }

    try {
      const token = authHeader.split(" ")[1];
      const payload = jwt.verify(token, env.jwtSecret) as JwtPayload;
      req.user = payload;

      if (requireAdmin && payload.role !== "admin") {
        return next(new ApiError(403, "Admin access required"));
      }

      next();
    } catch (error) {
      next(new ApiError(401, "Invalid or expired token"));
    }
  };
