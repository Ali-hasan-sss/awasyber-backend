import { Service, IService } from "@/models/Service";
import { ApiError } from "@/utils/ApiError";

export const createService = async (payload: Partial<IService>) => {
  const service = await Service.create(payload);
  return service.toObject();
};

export const listServices = async () => {
  return Service.find().sort({ createdAt: -1 }).lean();
};

export const getServiceById = async (id: string) => {
  const service = await Service.findById(id).lean();
  if (!service) {
    throw new ApiError(404, "Service not found");
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
  raw: service,
});
