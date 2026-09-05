import { z } from "zod"

export const adminContactSchema = z.object({
  phone: z
    .string()
    .min(5, "Official direct phone must be at least 5 characters")
    .max(50, "Phone number is too long")
    .trim(),
  mobile: z
    .string()
    .min(6, "Emergency quorum mobile must be at least 6 characters")
    .max(50, "Mobile number is too long")
    .trim(),
  office: z
    .string()
    .min(5, "Office complex location is required")
    .max(150, "Office location is too long")
    .trim(),
  emergencyBackupEmail: z
    .string()
    .min(1, "Emergency backup email is required")
    .email("Please enter a valid emergency backup email address")
    .trim(),
  officeHours: z
    .string()
    .min(3, "Office consultation hours are required")
    .max(100, "Office hours text is too long")
    .trim(),
})

export type AdminContactInput = z.infer<typeof adminContactSchema>

// ── Profile Picture Upload Schemas (Dual Options) ──────────────────────────
export const userAvatarFileSchema = z.object({
  mode: z.literal("file"),
  fileData: z
    .string()
    .min(1, "Please select an image file to upload")
    .refine(
      (data) => data.startsWith("data:image/"),
      "Selected file must be a valid image format (PNG, JPG, WEBP, or GIF)"
    ),
  fileName: z.string().optional(),
  fileSize: z
    .number()
    .max(5 * 1024 * 1024, "Image file size cannot exceed 5MB")
    .optional(),
})

export const userAvatarUrlSchema = z.object({
  mode: z.literal("url"),
  imageUrl: z
    .string()
    .min(1, "Image URL is required")
    .url("Please enter a valid image web URL")
    .refine(
      (url) => url.startsWith("https://") || url.startsWith("data:image/"),
      "For security, image URLs must use secure HTTPS protocol"
    ),
})

export const userAvatarUploadSchema = z.discriminatedUnion("mode", [
  userAvatarFileSchema,
  userAvatarUrlSchema,
])

export type UserAvatarUploadInput = z.infer<typeof userAvatarUploadSchema>

// ── Investigator / User Profile Edit Schema ───────────────────────────────
export const investigatorProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name is too long")
    .trim(),
  title: z
    .string()
    .min(2, "Academic title / rank is required")
    .max(100, "Academic title is too long")
    .trim(),
  email: z
    .string()
    .min(1, "Official institutional email is required")
    .email("Please enter a valid institutional email address")
    .trim(),
  phone: z
    .string()
    .min(5, "Official office phone must be at least 5 characters")
    .max(50, "Phone number is too long")
    .trim(),
  mobile: z
    .string()
    .min(6, "Mobile number must be at least 6 characters")
    .max(50, "Mobile number is too long")
    .trim(),
  office: z
    .string()
    .min(3, "Campus office room location is required")
    .max(150, "Office location is too long")
    .trim(),
  department: z
    .string()
    .min(2, "Department name is required")
    .max(100, "Department name is too long")
    .trim(),
  institution: z
    .string()
    .min(2, "Institution name is required")
    .max(150, "Institution name is too long")
    .trim(),
  orcidId: z
    .string()
    .trim()
    .refine(
      (val) => !val || /^(\d{4}-\d{4}-\d{4}-\d{3}[\dX])$/.test(val),
      "Invalid ORCID format (e.g. 0000-0002-8419-7241)"
    )
    .optional(),
  googleScholarUrl: z
    .string()
    .trim()
    .refine(
      (val) => !val || /^https?:\/\//.test(val),
      "Scholar link must start with https://"
    )
    .optional(),
  researchInterests: z
    .string()
    .min(3, "Please list at least one research specialization")
    .max(300, "Research interests text is too long")
    .trim(),
  bio: z
    .string()
    .min(10, "Academic bio must be at least 10 characters")
    .max(1000, "Academic bio cannot exceed 1000 characters")
    .trim(),
  consultationHours: z
    .string()
    .min(3, "Office consultation hours are required")
    .max(120, "Consultation hours text is too long")
    .trim(),
  avatarUrl: z.string().optional(),
})

export type InvestigatorProfileInput = z.infer<typeof investigatorProfileSchema>

// ── Change Password Schema ────────────────────────────────────────────────
export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Current password is required")
      .min(6, "Current password must be at least 6 characters"),
    newPassword: z
      .string()
      .min(1, "New password is required")
      .min(8, "New password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z
      .string()
      .min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"],
  })

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
