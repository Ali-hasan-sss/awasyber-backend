import { Router } from "express";
import { authenticate } from "@/middleware/authMiddleware";
import { validate } from "@/middleware/validate";
import {
  createExpenseSchema,
  updateExpenseSchema,
  getExpenseSchema,
  deleteExpenseSchema,
  listExpensesSchema,
} from "@/schemas/expenseSchemas";
import {
  createExpenseHandler,
  listExpensesHandler,
  getExpenseByIdHandler,
  updateExpenseHandler,
  deleteExpenseHandler,
} from "@/controllers/expenseController";

const router = Router();

// Expense routes (authenticated - admin only)
router.post(
  "/",
  authenticate(true),
  validate(createExpenseSchema),
  createExpenseHandler
);
router.get(
  "/",
  authenticate(true),
  validate(listExpensesSchema),
  listExpensesHandler
);
router.get(
  "/:id",
  authenticate(true),
  validate(getExpenseSchema),
  getExpenseByIdHandler
);
router.patch(
  "/:id",
  authenticate(true),
  validate(getExpenseSchema),
  validate(updateExpenseSchema),
  updateExpenseHandler
);
router.delete(
  "/:id",
  authenticate(true),
  validate(deleteExpenseSchema),
  deleteExpenseHandler
);

export default router;
