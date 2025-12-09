import { Request, Response, NextFunction } from "express";
import {
  createService,
  listServices,
  updateService,
  deleteService,
  getServiceById,
  mapServiceToLocale,
  SupportedLang,
} from "@/services/serviceService";

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

export const createServiceHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const service = await createService(req.body);
    res.status(201).json(service);
  } catch (error) {
    next(error);
  }
};

export const listServicesAdminHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const langHeader = getLangFromHeader(req);
    const rawServices = await listServices();
    if (langHeader?.toUpperCase() === "NOT") {
      return res.json(rawServices);
    }
    const lang = normalizeLang(langHeader);
    return res.json(
      rawServices.map((service) => mapServiceToLocale(service, lang))
    );
  } catch (error) {
    next(error);
  }
};

export const listServicesPublicHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const lang = normalizeLang(getLangFromHeader(req));
    const services = await listServices();
    res.json(
      services.map((service) => {
        const localized = mapServiceToLocale(service, lang);
        return {
          _id: localized._id,
          title: localized.title,
          description: localized.description,
          images: localized.images,
          features: localized.features,
        };
      })
    );
  } catch (error) {
    next(error);
  }
};

export const updateServiceHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const service = await updateService(req.params.id, req.body);
    res.json(service);
  } catch (error) {
    next(error);
  }
};

export const deleteServiceHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await deleteService(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const getServiceHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // جلب الخدمة مع الأقسام المرتبطة بها
    const service = await getServiceById(req.params.id, true);
    const langHeader = getLangFromHeader(req);
    if (langHeader?.toUpperCase() === "NOT") {
      return res.json(service);
    }
    const lang = normalizeLang(langHeader);
    res.json(mapServiceToLocale(service, lang));
  } catch (error) {
    next(error);
  }
};
