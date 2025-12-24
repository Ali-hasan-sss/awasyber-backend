import Section, { ISection, PageType, IFeature } from "@/models/Section";
import { Types } from "mongoose";

export interface CreateSectionPayload {
  title: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  page: PageType;
  serviceId?: string; // معرف الخدمة المرتبطة
  selectedPortfolioId?: string; // معرف العمل المحدد للعرض (اختياري)
  images?: string[];
  features?: IFeature[];
  order?: number;
  isActive?: boolean;
}

export interface UpdateSectionPayload {
  title?: {
    en?: string;
    ar?: string;
  };
  description?: {
    en?: string;
    ar?: string;
  };
  page?: PageType;
  serviceId?: string; // معرف الخدمة المرتبطة
  selectedPortfolioId?: string; // معرف العمل المحدد للعرض (اختياري)
  images?: string[];
  features?: IFeature[];
  order?: number;
  isActive?: boolean;
}

export const createSection = async (payload: CreateSectionPayload) => {
  const sectionData: any = {
    ...payload,
    images: payload.images || [],
    features: payload.features || [],
    order: payload.order || 0,
    isActive: payload.isActive !== undefined ? payload.isActive : true,
  };

  // Handle selectedPortfolioId conversion to ObjectId if provided
  if (payload.selectedPortfolioId) {
    sectionData.selectedPortfolioId = new Types.ObjectId(
      payload.selectedPortfolioId
    );
  }

  const section = new Section(sectionData);
  const savedSection = await section.save();

  // Ensure selectedPortfolioId is included as string if present
  return {
    ...savedSection.toObject(),
    selectedPortfolioId: savedSection.selectedPortfolioId
      ? savedSection.selectedPortfolioId.toString()
      : undefined,
  };
};

export const listSections = async (
  filters: {
    page?: PageType;
    serviceId?: string;
    isActive?: boolean;
  } = {}
) => {
  const query: any = {};

  if (filters.page) {
    query.page = filters.page;
  }

  if (filters.serviceId) {
    query.serviceId = new Types.ObjectId(filters.serviceId);
  }

  if (filters.isActive !== undefined) {
    query.isActive = filters.isActive;
  }

  const sections = await Section.find(query)
    .sort({ page: 1, order: 1, createdAt: -1 })
    .lean();

  // Ensure selectedPortfolioId is included as string if present
  return sections.map((section) => ({
    ...section,
    selectedPortfolioId: section.selectedPortfolioId
      ? section.selectedPortfolioId.toString()
      : undefined,
  }));
};

export const getSectionById = async (id: string) => {
  const section = await Section.findById(id).lean();

  if (!section) {
    throw new Error("Section not found");
  }

  // Ensure selectedPortfolioId is included as string if present
  return {
    ...section,
    selectedPortfolioId: section.selectedPortfolioId
      ? section.selectedPortfolioId.toString()
      : undefined,
  };
};

export const updateSection = async (
  id: string,
  payload: UpdateSectionPayload
) => {
  const updateData: any = { ...payload };

  // Handle nested updates for title and description
  if (payload.title) {
    const existingSection = await Section.findById(id).lean();
    if (existingSection) {
      updateData.title = {
        en: payload.title.en ?? existingSection.title.en,
        ar: payload.title.ar ?? existingSection.title.ar,
      };
    }
  }

  if (payload.description) {
    const existingSection = await Section.findById(id).lean();
    if (existingSection) {
      updateData.description = {
        en: payload.description.en ?? existingSection.description.en,
        ar: payload.description.ar ?? existingSection.description.ar,
      };
    }
  }

  // Handle selectedPortfolioId conversion to ObjectId if provided
  if (payload.selectedPortfolioId !== undefined) {
    if (
      payload.selectedPortfolioId &&
      payload.selectedPortfolioId.trim() !== ""
    ) {
      updateData.selectedPortfolioId = new Types.ObjectId(
        payload.selectedPortfolioId
      );
      // Remove $unset if it exists
      if (updateData.$unset) {
        delete updateData.$unset.selectedPortfolioId;
        if (Object.keys(updateData.$unset).length === 0) {
          delete updateData.$unset;
        }
      }
    } else {
      // If empty string or null, remove the field
      if (!updateData.$unset) {
        updateData.$unset = {};
      }
      updateData.$unset.selectedPortfolioId = "";
      delete updateData.selectedPortfolioId;
    }
  }

  const section = await Section.findByIdAndUpdate(id, updateData, {
    new: true,
  }).lean();

  if (!section) {
    throw new Error("Section not found");
  }

  // Ensure selectedPortfolioId is included as string if present
  return {
    ...section,
    selectedPortfolioId: section.selectedPortfolioId
      ? section.selectedPortfolioId.toString()
      : undefined,
  };
};

export const deleteSection = async (id: string) => {
  const section = await Section.findById(id);

  if (!section) {
    throw new Error("Section not found");
  }

  await Section.findByIdAndDelete(id);
  return section;
};

export const getSectionsByPage = async (
  page: PageType,
  locale: "en" | "ar" = "en"
) => {
  const sections = await Section.find({
    page,
    isActive: true,
    $or: [
      { serviceId: { $exists: false } }, // الأقسام التي لا تحتوي على serviceId
      { serviceId: null }, // الأقسام التي تحتوي على serviceId = null
    ],
  })
    .sort({ order: 1, createdAt: -1 })
    .lean();

  // Format sections based on locale
  return sections.map((section) => ({
    _id: section._id,
    title: section.title[locale],
    description: section.description[locale],
    page: section.page,
    images: section.images || [],
    features: section.features
      .map((feature) => ({
        name: feature.name[locale],
        description: feature.description[locale],
        icon: feature.icon,
        order: feature.order,
      }))
      .sort((a, b) => a.order - b.order),
    order: section.order,
    selectedPortfolioId: section.selectedPortfolioId
      ? section.selectedPortfolioId.toString()
      : undefined,
    createdAt: section.createdAt,
    updatedAt: section.updatedAt,
  }));
};

export const getSectionsByServiceId = async (
  serviceId: string,
  locale: "en" | "ar" = "en"
) => {
  const sections = await Section.find({
    serviceId: new Types.ObjectId(serviceId),
    isActive: true,
  })
    .sort({ order: 1, createdAt: -1 })
    .lean();

  // Format sections based on locale
  return sections.map((section) => ({
    _id: section._id,
    title: section.title[locale],
    description: section.description[locale],
    page: section.page,
    images: section.images || [],
    features: section.features
      .map((feature) => ({
        name: feature.name[locale],
        description: feature.description[locale],
        icon: feature.icon,
        order: feature.order,
      }))
      .sort((a, b) => a.order - b.order),
    order: section.order,
    createdAt: section.createdAt,
    updatedAt: section.updatedAt,
  }));
};
