import { Request, Response, NextFunction } from "express";
import {
  createArticle,
  listArticles,
  updateArticle,
  deleteArticle,
  getArticleById,
  mapArticleToLocale,
  SupportedLang,
} from "@/services/articleService";

const getLangFromHeader = (req: Request): string | undefined => {
  const header =
    (req.headers["x-lang"] as string | undefined) ||
    (req.headers["lang"] as string | undefined);
  return header?.toString();
};

const normalizeLang = (lang?: string): SupportedLang => {
  if (!lang) return "en";
  const lowered = lang.toLowerCase();
  return lowered === "ar" ? "ar" : "en";
};

export const createArticleHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const article = await createArticle(req.body);
    res.status(201).json(article);
  } catch (error) {
    next(error);
  }
};

export const listArticlesAdminHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const langHeader = getLangFromHeader(req);
    const serviceId = (req.query.serviceId as string) || undefined;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 10)
      : 10;
    const rawArticles = await listArticles({ serviceId, page, limit });
    if (langHeader?.toUpperCase() === "NOT") {
      return res.json(rawArticles);
    }
    const lang = normalizeLang(langHeader);
    return res.json(
      rawArticles.map((article) => mapArticleToLocale(article, lang))
    );
  } catch (error) {
    next(error);
  }
};

export const listArticlesPublicHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const lang = normalizeLang(getLangFromHeader(req));
    const serviceId = (req.query.serviceId as string) || undefined;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 10)
      : 10;
    const articles = await listArticles({ serviceId, page, limit });
    res.json(articles.map((article) => mapArticleToLocale(article, lang)));
  } catch (error) {
    next(error);
  }
};

export const updateArticleHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const article = await updateArticle(req.params.id, req.body);
    res.json(article);
  } catch (error) {
    next(error);
  }
};

export const deleteArticleHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await deleteArticle(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getArticleHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const lang = normalizeLang(getLangFromHeader(req));
    const article = await getArticleById(req.params.id);
    const localized = mapArticleToLocale(article, lang);
    res.json(localized);
  } catch (error) {
    next(error);
  }
};
