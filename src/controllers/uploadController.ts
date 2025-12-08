import { Request, Response } from "express";
import env from "@/config/env";

const getFileUrl = (req: Request, filename: string): string => {
  // Always use the actual request to get the real server URL
  // This ensures it works correctly on production server with proxy
  const protocol = req.protocol || req.get("x-forwarded-proto") || "http";
  const host = req.get("host") || req.get("x-forwarded-host");

  // Only use API_BASE_URL if it's explicitly set and not localhost
  if (env.apiBaseUrl && !env.apiBaseUrl.includes("localhost")) {
    return `${env.apiBaseUrl}/api/uploads/${filename}`;
  }

  // Use the actual request URL with /api/uploads path (works with proxy)
  return `${protocol}://${host}/api/uploads/${filename}`;
};

export const uploadFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Generate full file URL
    const fileUrl = getFileUrl(req, req.file.filename);

    return res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: fileUrl,
      },
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to upload file",
    });
  }
};

export const uploadMultipleFiles = async (req: Request, res: Response) => {
  try {
    if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }

    // req.files is File[] when using upload.array()
    const files = req.files as Express.Multer.File[];
    const uploadedFiles = files.map((file) => ({
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url: getFileUrl(req, file.filename),
    }));

    return res.status(200).json({
      success: true,
      message: "Files uploaded successfully",
      data: uploadedFiles,
    });
  } catch (error: any) {
    console.error("Multiple upload error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to upload files",
    });
  }
};
