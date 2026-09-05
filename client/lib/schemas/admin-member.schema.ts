import { z } from "zod"

export const ADMIN_ACCESS_LEVELS = [
  "Super Admin",
  "System Admin",
  "Governance Admin",
  "Security & Audit",
  "Operations Admin",
] as const

export const createAdminMemberSchema = z.object({
  name: z
    .string()
    .min(2, "Administrator full name must be at least 2 characters")
    .max(100, "Name is too long")
    .trim(),
  email: z
    .string()
    .min(1, "Official administrative email is required")
    .email("Please enter a valid administrative email address")
    .trim(),
  role: z
    .string()
    .min(2, "Administrative title/role is required")
    .max(100, "Role title is too long")
    .trim(),
  accessLevel: z.enum(ADMIN_ACCESS_LEVELS).default("System Admin"),
  department: z
    .string()
    .min(2, "Institutional department is required")
    .max(100, "Department name is too long")
    .trim(),
  phone: z
    .string()
    .trim()
    .refine((val) => !val || /^[\d\s+\-().]{6,25}$/.test(val), {
      message: "Please enter a valid phone number",
    })
    .optional(),
  protocols: z.coerce.number().int().min(0, "Protocols count must be 0 or greater").default(0),
  status: z.enum(["Active", "Inactive"]).default("Active"),
  permissions: z.array(z.string()).optional(),
})

export type CreateAdminMemberInput = z.input<typeof createAdminMemberSchema>

export const updateAdminMemberSchema = createAdminMemberSchema.partial()

export type UpdateAdminMemberInput = z.input<typeof updateAdminMemberSchema>

export const adminMemberSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  accessLevel: z.enum(ADMIN_ACCESS_LEVELS),
  department: z.string(),
  status: z.enum(["Active", "Inactive"]),
  protocols: z.number().int().nonnegative(),
  email: z.string().email(),
  phone: z.string().optional(),
  lastActive: z.string(),
  addedAt: z.string(),
  permissions: z.array(z.string()),
})

export type StoredAdminMember = z.infer<typeof adminMemberSchema>
