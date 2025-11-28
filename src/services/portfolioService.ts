import Portfolio, { IPortfolio } from "@/models/Portfolio";
import { Types } from "mongoose";

export interface CreatePortfolioPayload {
  title: { en: string; ar: string };
  description?: { en?: string; ar?: string };
  serviceId: string;
  features?: Array<{
    icon: string;
    name: { en: string; ar: string };
    description?: { en?: string; ar?: string };
  }>;
  images: string[];
  completionDate: string;
}

export interface UpdatePortfolioPayload {
  title?: { en: string; ar: string };
  description?: { en?: string; ar?: string };
  serviceId?: string;
  features?: Array<{
    icon: string;
    name: { en: string; ar: string };
    description?: { en?: string; ar?: string };
  }>;
  images?: string[];
  completionDate?: string;
}

export const createPortfolio = async (payload: CreatePortfolioPayload) => {
  const portfolio = new Portfolio({
    ...payload,
    serviceId: new Types.ObjectId(payload.serviceId),
    completionDate: new Date(payload.completionDate),
  });
  return await portfolio.save();
};

export const listPortfolios = async (
  lang: string | undefined,
  filters: { serviceId?: string; page?: number; limit?: number } = {}
) => {
  const { serviceId, page = 1, limit = 10 } = filters;
  const skip = (page - 1) * limit;

  const query: any = {};
  if (serviceId) {
    query.serviceId = new Types.ObjectId(serviceId);
  }

  const portfolios = await Portfolio.find(query)
    .populate("serviceId", "title")
    .sort({ completionDate: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  // Localize based on lang header
  if (lang && lang !== "NOT") {
    const locale = lang === "ar" ? "ar" : "en";
    return portfolios.map((portfolio: any) => ({
      ...portfolio,
      title: portfolio.title[locale],
      description: portfolio.description
        ? portfolio.description[locale] || undefined
        : undefined,
      features:
        portfolio.features && Array.isArray(portfolio.features)
          ? portfolio.features.map((feature: any) => ({
              icon: feature.icon,
              name: feature.name[locale],
              description: feature.description
                ? feature.description[locale] || undefined
                : undefined,
            }))
          : [],
      service:
        portfolio.serviceId &&
        typeof portfolio.serviceId === "object" &&
        "title" in portfolio.serviceId
          ? {
              _id: portfolio.serviceId._id || portfolio.serviceId,
              title: portfolio.serviceId.title[locale],
            }
          : undefined,
    }));
  }

  // Return bilingual for admin (lang: NOT)
  return portfolios.map((portfolio: any) => ({
    ...portfolio,
    features: portfolio.features || [],
    service:
      portfolio.serviceId &&
      typeof portfolio.serviceId === "object" &&
      "title" in portfolio.serviceId
        ? {
            _id: portfolio.serviceId._id || portfolio.serviceId,
            title: portfolio.serviceId.title,
          }
        : undefined,
  }));
};

export const getPortfolioById = async (
  id: string,
  lang: string | undefined
) => {
  const portfolio = await Portfolio.findById(id)
    .populate("serviceId", "title")
    .lean();

  if (!portfolio) {
    throw new Error("Portfolio not found");
  }

  // Localize based on lang header
  if (lang && lang !== "NOT") {
    const locale = lang === "ar" ? "ar" : "en";
    const serviceData =
      portfolio.serviceId &&
      typeof portfolio.serviceId === "object" &&
      "title" in portfolio.serviceId
        ? (portfolio.serviceId as any)
        : null;
    return {
      ...portfolio,
      title: portfolio.title[locale],
      description: portfolio.description
        ? portfolio.description[locale] || undefined
        : undefined,
      features:
        portfolio.features && Array.isArray(portfolio.features)
          ? portfolio.features.map((feature: any) => ({
              icon: feature.icon,
              name: feature.name[locale],
              description: feature.description
                ? feature.description[locale] || undefined
                : undefined,
            }))
          : [],
      service: serviceData
        ? {
            _id: serviceData._id || portfolio.serviceId,
            title: serviceData.title[locale],
          }
        : undefined,
    };
  }

  // Return bilingual for admin
  const serviceData =
    portfolio.serviceId &&
    typeof portfolio.serviceId === "object" &&
    "title" in portfolio.serviceId
      ? (portfolio.serviceId as any)
      : null;
  return {
    ...portfolio,
    features:
      portfolio.features && Array.isArray(portfolio.features)
        ? portfolio.features.map((feature: any) => ({
            icon: feature.icon,
            name: feature.name,
            description: feature.description || undefined,
          }))
        : [],
    service: serviceData
      ? {
          _id: serviceData._id || portfolio.serviceId,
          title: serviceData.title,
        }
      : undefined,
  };
};

export const updatePortfolio = async (
  id: string,
  payload: UpdatePortfolioPayload
) => {
  const updateData: any = { ...payload };
  if (payload.serviceId) {
    updateData.serviceId = new Types.ObjectId(payload.serviceId);
  }
  if (payload.completionDate) {
    updateData.completionDate = new Date(payload.completionDate);
  }

  const portfolio = await Portfolio.findByIdAndUpdate(id, updateData, {
    new: true,
  })
    .populate("serviceId", "title")
    .lean();

  if (!portfolio) {
    throw new Error("Portfolio not found");
  }

  return portfolio;
};

export const deletePortfolio = async (id: string) => {
  const portfolio = await Portfolio.findByIdAndDelete(id);
  if (!portfolio) {
    throw new Error("Portfolio not found");
  }
  return portfolio;
};
