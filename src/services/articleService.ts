import { Article, IArticle } from "@/models/Article";
import { ApiError } from "@/utils/ApiError";
import { Types } from "mongoose";

export type SupportedLang = "en" | "ar";

export const createArticle = async (payload: Partial<IArticle>) => {
  // Convert publishedAt string to Date if provided
  if (payload.publishedAt && typeof payload.publishedAt === "string") {
    payload.publishedAt = new Date(payload.publishedAt);
  }

  const article = await Article.create(payload);
  return article.toObject();
};

export const listArticles = async (filter?: {
  serviceId?: string;
  page?: number;
  limit?: number;
}) => {
  const query: any = {};
  if (filter?.serviceId) {
    query.serviceId = new Types.ObjectId(filter.serviceId);
  }

  const page = filter?.page || 1;
  const limit = filter?.limit || 10;
  const skip = (page - 1) * limit;

  return Article.find(query)
    .populate("serviceId", "title")
    .sort({ publishedAt: -1, createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};

export const getArticleById = async (id: string) => {
  const article = await Article.findById(id)
    .populate("serviceId", "title")
    .lean();
  if (!article) {
    throw new ApiError(404, "Article not found");
  }
  return article;
};

export const updateArticle = async (id: string, payload: Partial<IArticle>) => {
  // Convert publishedAt string to Date if provided
  if (payload.publishedAt && typeof payload.publishedAt === "string") {
    payload.publishedAt = new Date(payload.publishedAt);
  }

  const article = await Article.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })
    .populate("serviceId", "title")
    .lean();
  if (!article) {
    throw new ApiError(404, "Article not found");
  }
  return article;
};

export const deleteArticle = async (id: string) => {
  const article = await Article.findByIdAndDelete(id).lean();
  if (!article) {
    throw new ApiError(404, "Article not found");
  }
  return article;
};

export const mapArticleToLocale = (article: any, lang: SupportedLang) => {
  const serviceTitle = article.serviceId?.title || {};
  return {
    _id: article._id,
    title: article.title?.[lang] || article.title?.en || "",
    description: article.description?.[lang] || article.description?.en || "",
    body: article.body?.[lang] || article.body?.en || "",
    serviceId: article.serviceId?._id || article.serviceId,
    serviceTitle:
      typeof serviceTitle === "object"
        ? serviceTitle[lang] || serviceTitle.en || ""
        : serviceTitle || "",
    mainImage: article.mainImage || "",
    publishedAt: article.publishedAt || article.createdAt,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
  };
};
