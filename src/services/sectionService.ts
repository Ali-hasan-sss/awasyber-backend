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
  images?: string[];
  features?: IFeature[];
  order?: number;
  isActive?: boolean;
}

export const createSection = async (payload: CreateSectionPayload) => {
  const section = new Section({
    ...payload,
    images: payload.images || [],
    features: payload.features || [],
    order: payload.order || 0,
    isActive: payload.isActive !== undefined ? payload.isActive : true,
  });

  return await section.save();
};

export const listSections = async (
  filters: {
    page?: PageType;
    isActive?: boolean;
  } = {}
) => {
  const query: any = {};

  if (filters.page) {
    query.page = filters.page;
  }

  if (filters.isActive !== undefined) {
    query.isActive = filters.isActive;
  }

  const sections = await Section.find(query)
    .sort({ page: 1, order: 1, createdAt: -1 })
    .lean();

  return sections;
};

export const getSectionById = async (id: string) => {
  const section = await Section.findById(id).lean();

  if (!section) {
    throw new Error("Section not found");
  }

  return section;
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

  const section = await Section.findByIdAndUpdate(id, updateData, {
    new: true,
  }).lean();

  if (!section) {
    throw new Error("Section not found");
  }

  return section;
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
