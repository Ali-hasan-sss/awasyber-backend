import { Router } from "express";
import {
  createQuotationRequestHandler,
  listQuotationRequestsHandler,
  getQuotationRequestHandler,
  updateQuotationStatusHandler,
} from "@/controllers/quotationController";
import { validate } from "@/middleware/validate";
import { authenticate } from "@/middleware/authMiddleware";
import {
  createQuotationRequestSchema,
  listQuotationRequestSchema,
  quotationIdParamSchema,
  updateQuotationStatusSchema,
} from "@/schemas/quotationSchemas";

const router = Router();

router.post(
  "/",
  validate(createQuotationRequestSchema),
  createQuotationRequestHandler
);

router.use(authenticate(true));

router.get(
  "/",
  validate(listQuotationRequestSchema),
  listQuotationRequestsHandler
);
router.get(
  "/:id",
  validate(quotationIdParamSchema),
  getQuotationRequestHandler
);

router.patch(
  "/:id/status",
  validate(updateQuotationStatusSchema),
  updateQuotationStatusHandler
);

export default router;
