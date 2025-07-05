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

// We can reuse the user schema for these as the shape is identical
export {
  passwordChangeSchema,
  passwordResetRequestSchema,
  passwordResetSchema,
} from "./user";
