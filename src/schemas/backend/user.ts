import * as z from "zod";

export const userRegisterSchema = z.object({
  firstname: z.string().min(2),
  lastname: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  contact: z.string().optional(),
});

export const userProfileUpdateSchema = z.object({
  firstname: z.string().min(2),
  lastname: z.string().min(2),
  contact: z.string().optional(),
});

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
});

export const passwordResetRequestSchema = z.object({
  email: z.string().email(),
});

export const passwordResetSchema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(6),
});
export const pictureUpdateSchema = z.object({
  newImageUrl: z.string().url(),
  newImageFileId: z.string().min(1),
});

export const bulkActionSchema = z.object({
  userIds: z
    .array(z.string().min(1))
    .min(1, "At least one user ID is required."),
});
