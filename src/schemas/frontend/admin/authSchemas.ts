import * as z from "zod";

export const adminLoginSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(1, "Password is required."),
});

export const adminRegisterSchema = z
  .object({
    firstname: z.string().min(2, "First name must be at least 2 characters."),
    lastname: z.string().min(2, "Last name must be at least 2 characters."),
    email: z.string().email("Invalid email address."),
    password: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string(),
    contact: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const editAdminProfileSchema = z.object({
  firstname: z.string().min(2, "First name must be at least 2 characters."),
  lastname: z.string().min(2, "Last name must be at least 2 characters."),
  contact: z.string().optional(),
});

export const adminUpdatesUserSchema = z.object({
  firstname: z.string().min(2, "First name is required."),
  lastname: z.string().min(2, "Last name is required."),
  contact: z.string().optional(),
  newPassword: z.string().optional(),
  profileImage: z.instanceof(File).optional(),
});

export const adminchangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters."),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords do not match.",
    path: ["confirmNewPassword"],
  });
export const adminEditsUserFrontendSchema = z.object({
  firstname: z.string().min(2, "First name must be at least 2 characters."),
  lastname: z.string().min(2, "Last name must be at least 2 characters."),
  contact: z.string().optional(),
  // Password is optional, but if present, must be at least 6 characters
  newPassword: z
    .string()
    .min(6, "New password must be at least 6 characters.")
    .optional()
    .or(z.literal("")),
  // The profile picture can be a File object (for new uploads) or a string (existing URL)
  profilepic: z.any().optional(),
});
