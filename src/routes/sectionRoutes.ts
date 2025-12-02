import { Router } from "express";
import {
  authenticate,
  optionalAuthenticate,
} from "@/middleware/authMiddleware";
import { validate } from "@/middleware/validate";
import {
  createSectionSchema,
  updateSectionSchema,
  getSectionSchema,
  deleteSectionSchema,
  getSectionsByPageSchema,
} from "@/schemas/sectionSchemas";
import {
  createSectionHandler,
  listSectionsHandler,
  getSectionByIdHandler,
  updateSectionHandler,
  deleteSectionHandler,
  getSectionsByPageHandler,
} from "@/controllers/sectionController";

const router = Router();

// Public route - Get sections by page (for frontend)
router.get(
  "/page",
  optionalAuthenticate,
  validate(getSectionsByPageSchema),
  getSectionsByPageHandler
);

// Admin routes - require authentication
router.post(
  "/",
  authenticate(true),
  validate(createSectionSchema),
  createSectionHandler
);

router.get("/", authenticate(true), listSectionsHandler);

router.get(
  "/:id",
  authenticate(true),
  validate(getSectionSchema),
  getSectionByIdHandler
);

router.put(
  "/:id",
  authenticate(true),
  validate(updateSectionSchema),
  updateSectionHandler
);

router.delete(
  "/:id",
  authenticate(true),
  validate(deleteSectionSchema),
  deleteSectionHandler
);

export default router;
