import { Router } from "express";
import {
  createUserHandler,
  deleteUserHandler,
  generateLoginCodeHandler,
  getUserHandler,
  listUsersHandler,
  updateUserHandler,
} from "@/controllers/userController";
import {
  createUserSchema,
  updateUserSchema,
  userIdParamSchema,
} from "@/schemas/userSchemas";
import { validate } from "@/middleware/validate";
import { authenticate } from "@/middleware/authMiddleware";

const router = Router();

router.use(authenticate(true));

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 */
router.post("/", validate(createUserSchema), createUserHandler);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: List all users
 *     tags: [Users]
 */
router.get("/", listUsersHandler);

router.get("/:id", validate(userIdParamSchema), getUserHandler);

router.patch("/:id", validate(updateUserSchema), updateUserHandler);

router.delete("/:id", validate(userIdParamSchema), deleteUserHandler);

router.post(
  "/:id/login-code",
  validate(userIdParamSchema),
  generateLoginCodeHandler
);

export default router;
