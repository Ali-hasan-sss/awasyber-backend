import { Router } from "express";
import { upload, handleMulterError } from "@/middleware/upload";
import {
  uploadFile,
  uploadMultipleFiles,
} from "@/controllers/uploadController";
import { authenticate } from "@/middleware/authMiddleware";

const router = Router();

// Single file upload (authenticated - admin only)
router.post(
  "/single",
  authenticate(true),
  upload.single("file"),
  handleMulterError,
  uploadFile
);

// Multiple files upload (authenticated - admin only)
router.post(
  "/multiple",
  authenticate(true),
  upload.array("files", 10),
  handleMulterError,
  uploadMultipleFiles
);

export default router;
