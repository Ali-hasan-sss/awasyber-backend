import { Router } from "express";
import { validate } from "@/middleware/validate";
import { authenticate } from "@/middleware/authMiddleware";
import {
  createArticleHandler,
  listArticlesAdminHandler,
  listArticlesPublicHandler,
  updateArticleHandler,
  deleteArticleHandler,
  getArticleHandler,
} from "@/controllers/articleController";
import {
  createArticleSchema,
  updateArticleSchema,
  articleIdParamSchema,
  listArticlesQuerySchema,
} from "@/schemas/articleSchemas";

const router = Router();

router.get(
  "/public",
  validate(listArticlesQuerySchema),
  listArticlesPublicHandler
);
router.get("/public/:id", validate(articleIdParamSchema), getArticleHandler);

router.use(authenticate(true));

router.post("/", validate(createArticleSchema), createArticleHandler);
router.get("/", validate(listArticlesQuerySchema), listArticlesAdminHandler);
router.get("/:id", validate(articleIdParamSchema), getArticleHandler);
router.patch("/:id", validate(updateArticleSchema), updateArticleHandler);
router.delete("/:id", validate(articleIdParamSchema), deleteArticleHandler);

export default router;
