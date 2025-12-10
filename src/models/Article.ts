import { Schema, model, Document, Types } from "mongoose";

export interface LocalizedField {
  en: string;
  ar: string;
}

export interface IArticle extends Document {
  title: LocalizedField;
  description: LocalizedField;
  body: LocalizedField; // HTML content from Quill editor
  serviceId: Types.ObjectId;
  mainImage: string;
  publishedAt?: Date;
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

const ArticleSchema = new Schema<IArticle>(
  {
    title: { type: LocalizedSchema, required: true },
    description: { type: LocalizedSchema, required: true },
    body: { type: LocalizedSchema, required: true },
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    mainImage: { type: String, required: true },
    publishedAt: { type: Date, required: false },
  },
  { timestamps: true }
);

// Index for filtering by service
ArticleSchema.index({ serviceId: 1 });
ArticleSchema.index({ publishedAt: -1 });

export const Article = model<IArticle>("Article", ArticleSchema);
