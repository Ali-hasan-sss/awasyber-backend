import { Router } from "express";
import { validate } from "@/middleware/validate";
import { authenticate } from "@/middleware/authMiddleware";
import {
  createServiceHandler,
  listServicesAdminHandler,
  listServicesPublicHandler,
  updateServiceHandler,
  deleteServiceHandler,
  getServiceHandler,
} from "@/controllers/serviceController";
import {
  createServiceSchema,
  updateServiceSchema,
  serviceIdParamSchema,
} from "@/schemas/serviceSchemas";

const router = Router();

router.get("/public", listServicesPublicHandler);
router.get("/public/:id", validate(serviceIdParamSchema), getServiceHandler);

router.use(authenticate(true));

router.post("/", validate(createServiceSchema), createServiceHandler);
router.get("/", listServicesAdminHandler);
router.get("/:id", validate(serviceIdParamSchema), getServiceHandler);
router.patch("/:id", validate(updateServiceSchema), updateServiceHandler);
router.delete("/:id", validate(serviceIdParamSchema), deleteServiceHandler);

export default router;
