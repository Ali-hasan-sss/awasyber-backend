import { Router } from "express";
import { authenticate } from "@/middleware/authMiddleware";
import { validate } from "@/middleware/validate";
import {
  createProjectSchema,
  updateProjectSchema,
  getProjectSchema,
  deleteProjectSchema,
  createPaymentSchema,
  updatePaymentSchema,
  deletePaymentSchema,
  createModificationSchema,
  updateModificationSchema,
  deleteModificationSchema,
  generatePortalCodeSchema,
  getProjectByPortalCodeSchema,
} from "@/schemas/projectSchemas";
import {
  createProjectHandler,
  listProjectsHandler,
  getProjectByIdHandler,
  updateProjectHandler,
  deleteProjectHandler,
  createPaymentHandler,
  updatePaymentHandler,
  deletePaymentHandler,
  createModificationHandler,
  updateModificationHandler,
  deleteModificationHandler,
  generatePortalCodeHandler,
  getProjectByPortalCodeHandler,
} from "@/controllers/projectController";
import {
  createProjectFileHandler,
  getProjectFilesHandler,
  updateProjectFileHandler,
  deleteProjectFileHandler,
} from "@/controllers/projectFileController";
import {
  createProjectFileSchema,
  updateProjectFileSchema,
  deleteProjectFileSchema,
  getProjectFilesSchema,
} from "@/schemas/projectFileSchemas";

const router = Router();

// Project routes (authenticated - admin only)
router.post(
  "/",
  authenticate(true),
  validate(createProjectSchema),
  createProjectHandler
);
router.get("/", authenticate(true), listProjectsHandler);
router.get(
  "/:id",
  authenticate(true),
  validate(getProjectSchema),
  getProjectByIdHandler
);
router.patch(
  "/:id",
  authenticate(true),
  validate(getProjectSchema),
  validate(updateProjectSchema),
  updateProjectHandler
);
router.delete(
  "/:id",
  authenticate(true),
  validate(deleteProjectSchema),
  deleteProjectHandler
);

// Payment routes
router.post(
  "/payments",
  authenticate(true),
  validate(createPaymentSchema),
  createPaymentHandler
);
router.patch(
  "/payments/:id",
  authenticate(true),
  validate(updatePaymentSchema),
  updatePaymentHandler
);
router.delete(
  "/payments/:id",
  authenticate(true),
  validate(deletePaymentSchema),
  deletePaymentHandler
);

// Modification routes
router.post(
  "/modifications",
  authenticate(true),
  validate(createModificationSchema),
  createModificationHandler
);
router.patch(
  "/modifications/:id",
  authenticate(true),
  validate(updateModificationSchema),
  updateModificationHandler
);
router.delete(
  "/modifications/:id",
  authenticate(true),
  validate(deleteModificationSchema),
  deleteModificationHandler
);

// Project File routes
router.post(
  "/files",
  authenticate(true),
  validate(createProjectFileSchema),
  createProjectFileHandler
);
router.get(
  "/files/:projectId",
  authenticate(true),
  validate(getProjectFilesSchema),
  getProjectFilesHandler
);
router.patch(
  "/files/:id",
  authenticate(true),
  validate(updateProjectFileSchema),
  updateProjectFileHandler
);
router.delete(
  "/files/:id",
  authenticate(true),
  validate(deleteProjectFileSchema),
  deleteProjectFileHandler
);

// Portal code routes
router.post(
  "/:id/generate-portal-code",
  authenticate(true),
  validate(generatePortalCodeSchema),
  generatePortalCodeHandler
);

// Public route for client portal (no authentication required)
router.get(
  "/portal/:code",
  validate(getProjectByPortalCodeSchema),
  getProjectByPortalCodeHandler
);

export default router;
