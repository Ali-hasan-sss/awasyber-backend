import { Router } from "express";
import { upload, handleMulterError } from "@/middleware/upload";
import {
  uploadFile,
  uploadMultipleFiles,
} from "@/controllers/uploadController";
import {
  authenticate,
  optionalAuthenticate,
} from "@/middleware/authMiddleware";

const router = Router();

// Single file upload for clients (optional authentication - allows portal code access)
router.post(
  "/",
  optionalAuthenticate,
  upload.single("file"),
  handleMulterError,
  uploadFile
);

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
