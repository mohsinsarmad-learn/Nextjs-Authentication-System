import * as z from "zod";

export const adminRegisterSchema = z.object({
  firstname: z.string().min(2),
  lastname: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  contact: z.string().optional(),
});

export const adminProfileUpdateSchema = z.object({
  firstname: z.string().min(2),
  lastname: z.string().min(2),
  contact: z.string().optional(),
});

// Schema for a single user update initiated by an admin
export const adminUpdatesUserSchema = z.object({
  firstname: z.string().min(2, "First name is required."),
  lastname: z.string().min(2, "Last name is required."),
  contact: z.string().optional(),
  newPassword: z.string().min(6).optional().or(z.literal("")),
  // THE FIX: Add the optional image fields
  newImageUrl: z.string().url().optional(),
  newImageFileId: z.string().min(1).optional(),
});

export const detailedBulkUpdateSchema = z.array(
  adminUpdatesUserSchema.extend({
    userId: z.string().min(1),
  })
);
// We can reuse the user schema for these as the shape is identical
export {
  passwordChangeSchema,
  passwordResetRequestSchema,
  passwordResetSchema,
  pictureUpdateSchema,
} from "./user";
