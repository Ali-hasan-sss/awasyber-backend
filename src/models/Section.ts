import mongoose, { Schema, Document } from "mongoose";

export type PageType = "home" | "about" | "services" | "contact" | "portfolio";

export interface IFeature {
  name: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  icon: string; // اسم الأيقونة أو رابط الصورة
  order: number; // ترتيب الميزة ضمن القسم
}

export interface ISection extends Document {
  title: {
    en: string;
    ar: string;
  };
  description: {
    en: string; // HTML content
    ar: string; // HTML content
  };
  page: PageType; // الصفحة التي يظهر فيها القسم
  images: string[]; // مصفوفة الصور
  features: IFeature[]; // مصفوفة الميزات
  order: number; // ترتيب القسم ضمن الصفحة
  isActive: boolean; // هل القسم نشط أم لا
  createdAt: Date;
  updatedAt: Date;
}

const FeatureSchema = new Schema<IFeature>(
  {
    name: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    description: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    icon: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const SectionSchema = new Schema<ISection>(
  {
    title: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    description: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    page: {
      type: String,
      enum: ["home", "about", "services", "contact", "portfolio"],
      required: true,
    },
    images: [{ type: String }],
    features: [FeatureSchema],
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

SectionSchema.index({ page: 1, order: 1 });
SectionSchema.index({ isActive: 1 });

export default mongoose.model<ISection>("Section", SectionSchema);
