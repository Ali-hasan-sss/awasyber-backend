import mongoose, { Schema, Document } from "mongoose";

export interface IPortfolio extends Document {
  title: {
    en: string;
    ar: string;
  };
  description?: {
    en?: string;
    ar?: string;
  };
  serviceId: mongoose.Types.ObjectId;
  features?: Array<{
    icon: string;
    name: {
      en: string;
      ar: string;
    };
    description?: {
      en?: string;
      ar?: string;
    };
  }>;
  images: string[];
  completionDate: Date;
  url?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PortfolioSchema = new Schema<IPortfolio>(
  {
    title: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    description: {
      en: { type: String },
      ar: { type: String },
    },
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    features: [
      {
        icon: { type: String, required: true },
        name: {
          en: { type: String, required: true },
          ar: { type: String, required: true },
        },
        description: {
          en: { type: String },
          ar: { type: String },
        },
      },
    ],
    images: [{ type: String, required: true }],
    completionDate: { type: Date, required: true },
    url: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IPortfolio>("Portfolio", PortfolioSchema);
