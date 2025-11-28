import { Router } from "express";
import { authenticate } from "@/middleware/authMiddleware";
import { validate } from "@/middleware/validate";
import {
  createPortfolioSchema,
  updatePortfolioSchema,
  portfolioIdParamSchema,
  listPortfoliosSchema,
} from "@/schemas/portfolioSchemas";
import {
  createPortfolioHandler,
  listPortfoliosHandler,
  getPortfolioByIdHandler,
  updatePortfolioHandler,
  deletePortfolioHandler,
} from "@/controllers/portfolioController";

const router = Router();

// Public routes
router.get("/public", validate(listPortfoliosSchema), listPortfoliosHandler);
router.get(
  "/public/:id",
  validate(portfolioIdParamSchema),
  getPortfolioByIdHandler
);

// Admin routes (authenticated)
router.post(
  "/",
  authenticate(true),
  validate(createPortfolioSchema),
  createPortfolioHandler
);
router.get(
  "/",
  authenticate(true),
  validate(listPortfoliosSchema),
  listPortfoliosHandler
);
router.get(
  "/:id",
  authenticate(true),
  validate(portfolioIdParamSchema),
  getPortfolioByIdHandler
);
router.patch(
  "/:id",
  authenticate(true),
  validate(portfolioIdParamSchema),
  validate(updatePortfolioSchema),
  updatePortfolioHandler
);
router.delete(
  "/:id",
  authenticate(true),
  validate(portfolioIdParamSchema),
  deletePortfolioHandler
);

export default router;
