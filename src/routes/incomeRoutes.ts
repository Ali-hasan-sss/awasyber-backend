import { Router } from "express";
import { authenticate } from "@/middleware/authMiddleware";
import { validate } from "@/middleware/validate";
import {
  createIncomeSchema,
  updateIncomeSchema,
  getIncomeSchema,
  deleteIncomeSchema,
  listIncomesSchema,
} from "@/schemas/incomeSchemas";
import {
  createIncomeHandler,
  listIncomesHandler,
  getIncomeByIdHandler,
  updateIncomeHandler,
  deleteIncomeHandler,
} from "@/controllers/incomeController";

const router = Router();

// Income routes (authenticated - admin only)
router.post(
  "/",
  authenticate(true),
  validate(createIncomeSchema),
  createIncomeHandler
);
router.get(
  "/",
  authenticate(true),
  validate(listIncomesSchema),
  listIncomesHandler
);
router.get(
  "/:id",
  authenticate(true),
  validate(getIncomeSchema),
  getIncomeByIdHandler
);
router.patch(
  "/:id",
  authenticate(true),
  validate(getIncomeSchema),
  validate(updateIncomeSchema),
  updateIncomeHandler
);
router.delete(
  "/:id",
  authenticate(true),
  validate(deleteIncomeSchema),
  deleteIncomeHandler
);

export default router;
