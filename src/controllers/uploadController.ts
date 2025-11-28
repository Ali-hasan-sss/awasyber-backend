import { Request, Response } from "express";
import env from "@/config/env";

const getFileUrl = (req: Request, filename: string): string => {
  // Use API_BASE_URL from env if available, otherwise construct from request
  if (env.apiBaseUrl) {
    return `${env.apiBaseUrl}/uploads/${filename}`;
  }
  // Fallback: construct from request
  const protocol = req.protocol || "http";
  const host = req.get("host") || `localhost:${env.port}`;
  return `${protocol}://${host}/uploads/${filename}`;
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
