import { z } from "zod";

export const createProjectFileSchema = z.object({
  body: z.object({
    projectId: z.string().min(1, "Project ID is required"),
    userId: z.string().min(1, "User ID is required"),
    fileUrl: z.string().url("Invalid file URL"),
    fileName: z.string().min(1, "File name is required"),
    fileType: z.string().min(1, "File type is required"),
    fileSize: z.number().min(0).optional(),
    uploadedBy: z.enum(["client", "company"]),
  }),
});

export const updateProjectFileSchema = z.object({
  params: z.object({
    id: z.string().min(1, "File ID is required"),
  }),
  body: z.object({
    fileName: z.string().min(1).optional(),
  }),
});

export const deleteProjectFileSchema = z.object({
  params: z.object({
    id: z.string().min(1, "File ID is required"),
  }),
});

export const getProjectFilesSchema = z.object({
  params: z.object({
    projectId: z.string().min(1, "Project ID is required"),
  }),
  query: z.object({
    uploadedBy: z.enum(["client", "company"]).optional(),
  }),
});
