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
  createModificationSchema,
  updateModificationSchema,
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
} from "@/controllers/projectController";

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
  validate(updatePaymentSchema),
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
  validate(updateModificationSchema),
  deleteModificationHandler
);

export default router;
