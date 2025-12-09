import { Service, IService } from "@/models/Service";
import { ApiError } from "@/utils/ApiError";
import { listSections } from "./sectionService";
import { Types } from "mongoose";

export const createService = async (payload: Partial<IService>) => {
  const service = await Service.create(payload);
  return service.toObject();
};

export const listServices = async () => {
  return Service.find().sort({ createdAt: -1 }).lean();
};

export const getServiceById = async (
  id: string,
  includeSections: boolean = false
) => {
  const service = await Service.findById(id).lean();
  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  // جلب الأقسام المرتبطة بالخدمة إذا طُلب ذلك
  if (includeSections) {
    const sections = await listSections({
      serviceId: id,
      isActive: true,
    });
    return {
      ...service,
      sections: sections.map((section) => ({
        _id: section._id,
        title: section.title,
        description: section.description,
        images: section.images || [],
        features: section.features || [],
        order: section.order,
      })),
    };
  }

  return service;
};

export const updateService = async (id: string, payload: Partial<IService>) => {
  const service = await Service.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).lean();
  if (!service) {
    throw new ApiError(404, "Service not found");
  }
  return service;
};

export const deleteService = async (id: string) => {
  const service = await Service.findByIdAndDelete(id).lean();
  if (!service) {
    throw new ApiError(404, "Service not found");
  }
  return service;
};

export type SupportedLang = "en" | "ar";

export const mapServiceToLocale = (service: any, lang: SupportedLang) => ({
  _id: service._id,
  title: service.title?.[lang] || "",
  description: service.description?.[lang] || "",
  images: service.images || [],
  features: Array.isArray(service.features)
    ? service.features.map((feature: any) => ({
        icon: feature.icon,
        name: feature.name?.[lang] || "",
        description: feature.description?.[lang] || "",
      }))
    : [],
  sections: Array.isArray(service.sections)
    ? service.sections.map((section: any) => ({
        _id: section._id,
        title:
          typeof section.title === "object"
            ? section.title[lang]
            : section.title,
        description:
          typeof section.description === "object"
            ? section.description[lang]
            : section.description,
        images: section.images || [],
        features: Array.isArray(section.features)
          ? section.features.map((feature: any) => ({
              name:
                typeof feature.name === "object"
                  ? feature.name[lang]
                  : feature.name,
              description:
                typeof feature.description === "object"
                  ? feature.description[lang]
                  : feature.description,
              icon: feature.icon,
              order: feature.order,
            }))
          : [],
        order: section.order,
      }))
    : [],
  raw: service,
});
