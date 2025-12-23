import { Router } from "express";
import {
  loginAdminHandler,
  loginWithCodeHandler,
  loginWithCodeOnlyHandler,
  registerAdminHandler,
  updateProfileHandler,
  changePasswordHandler,
} from "@/controllers/authController";
import {
  loginAdminSchema,
  loginWithCodeSchema,
  loginWithCodeOnlySchema,
  registerAdminSchema,
  updateProfileSchema,
  changePasswordSchema,
} from "@/schemas/authSchemas";
import { validate } from "@/middleware/validate";
import { authenticate } from "@/middleware/authMiddleware";

const router = Router();

/**
 * @swagger
 * /api/auth/register-admin:
 *   post:
 *     summary: Register a new admin (protected by setup key)
 *     tags: [Auth]
 */
router.post(
  "/register-admin",
  validate(registerAdminSchema),
  registerAdminHandler
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Admin login
 *     tags: [Auth]
 */
router.post("/login", validate(loginAdminSchema), loginAdminHandler);

/**
 * @swagger
 * /api/auth/login-code:
 *   post:
 *     summary: Login using a one-time code (clients)
 *     tags: [Auth]
 */
router.post("/login-code", validate(loginWithCodeSchema), loginWithCodeHandler);

/**
 * @swagger
 * /api/auth/login-code-only:
 *   post:
 *     summary: Login using only a code (no email required)
 *     tags: [Auth]
 */
router.post(
  "/login-code-only",
  validate(loginWithCodeOnlySchema),
  loginWithCodeOnlyHandler
);

/**
 * @swagger
 * /api/auth/profile:
 *   patch:
 *     summary: Update admin profile
 *     tags: [Auth]
 */
router.patch(
  "/profile",
  authenticate(true),
  validate(updateProfileSchema),
  updateProfileHandler
);

/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     summary: Change admin password
 *     tags: [Auth]
 */
router.post(
  "/change-password",
  authenticate(true),
  validate(changePasswordSchema),
  changePasswordHandler
);

export default router;
