import { Schema, model, Document } from "mongoose";

export interface LocalizedField {
  en: string;
  ar: string;
}

export interface ServiceFeature {
  icon: string;
  name: LocalizedField;
  description?: LocalizedField;
}

export interface IService extends Document {
  title: LocalizedField;
  description?: LocalizedField;
  images: string[];
  features?: ServiceFeature[];
  createdAt: Date;
  updatedAt: Date;
}

const LocalizedSchema = new Schema<LocalizedField>(
  {
    en: { type: String, required: true },
    ar: { type: String, required: true },
  },
  { _id: false }
);

const FeatureSchema = new Schema<ServiceFeature>(
  {
    icon: { type: String, required: true },
    name: { type: LocalizedSchema, required: true },
    description: { type: LocalizedSchema, required: false },
  },
  { _id: false }
);

const ServiceSchema = new Schema<IService>(
  {
    title: { type: LocalizedSchema, required: true },
    description: { type: LocalizedSchema, required: false },
    images: {
      type: [String],
      required: true,
      validate: {
        validator: (value: string[]) =>
          Array.isArray(value) && value.length > 0,
        message: "At least one image is required",
      },
    },
    features: { type: [FeatureSchema], required: false },
  },
  { timestamps: true }
);

export const Service = model<IService>("Service", ServiceSchema);
