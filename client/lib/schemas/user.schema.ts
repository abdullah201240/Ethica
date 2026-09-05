import { z } from "zod"

export const USER_PILLARS = ["Investigator", "Reviewer", "Administrator"] as const

export const USER_ACCOUNT_STATUSES = [
  "Active",
  "Inactive",
  "Suspended",
  "Pending Verification",
] as const

export const USER_VERIFICATION_STATUSES = [
  "Verified Institutional ID",
  "SSO Authenticated",
  "Pending Document Review",
] as const

export const createPlatformUserSchema = z.object({
  name: z
    .string()
    .min(2, "User full name must be at least 2 characters")
    .max(100, "Name is too long")
    .trim(),
  email: z
    .string()
    .min(1, "Institutional email is required")
    .email("Please enter a valid institutional email address")
    .trim(),
  pillar: z.enum(USER_PILLARS).default("Investigator"),
  role: z
    .string()
    .min(2, "Institutional role/title is required")
    .max(100, "Role title is too long")
    .trim(),
  department: z
    .string()
    .min(2, "Department is required")
    .max(100, "Department name is too long")
    .trim(),
  institution: z
    .string()
    .min(2, "Institution is required")
    .max(150, "Institution name is too long")
    .default("Daffodil International University"),
  phone: z
    .string()
    .trim()
    .refine((val) => !val || /^[\d\s+\-().]{6,25}$/.test(val), {
      message: "Please enter a valid phone number",
    })
    .optional(),
  status: z.enum(USER_ACCOUNT_STATUSES).default("Active"),
  verificationStatus: z.enum(USER_VERIFICATION_STATUSES).default("Verified Institutional ID"),
  protocolsCount: z.coerce.number().int().min(0).default(0),
  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
})

export type CreatePlatformUserInput = z.input<typeof createPlatformUserSchema>

export const updatePlatformUserSchema = createPlatformUserSchema.partial()

export type UpdatePlatformUserInput = z.input<typeof updatePlatformUserSchema>

export const platformUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  pillar: z.enum(USER_PILLARS),
  role: z.string(),
  department: z.string(),
  institution: z.string(),
  status: z.enum(USER_ACCOUNT_STATUSES),
  verificationStatus: z.enum(USER_VERIFICATION_STATUSES),
  protocolsCount: z.number().int().nonnegative(),
  joinedAt: z.string(),
  lastLogin: z.string(),
  bio: z.string().optional(),
})

export type StoredPlatformUser = z.infer<typeof platformUserSchema>
