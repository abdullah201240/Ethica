import { z } from "zod"
import { IRB_BOARDS, RISK_TIERS } from "./protocol-application.schema"

export const CATEGORY_STATUSES = ["Active", "Inactive"] as const
export type CategoryStatus = (typeof CATEGORY_STATUSES)[number]

export const researchCategorySchema = z.object({
  id: z.string().min(1, "Category ID is required"),
  name: z
    .string()
    .min(3, "Category name must be at least 3 characters")
    .max(120, "Category name cannot exceed 120 characters")
    .trim(),
  code: z
    .string()
    .min(2, "Code must be at least 2 characters")
    .max(30, "Code cannot exceed 30 characters")
    .regex(/^[A-Z0-9_-]+$/, "Code must contain only uppercase letters, numbers, hyphens, and underscores")
    .trim(),
  board: z.enum(IRB_BOARDS, {
    message: "Please select a governing IRB ethics board",
  }),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(600, "Description cannot exceed 600 characters")
    .trim(),
  priceBdt: z.coerce
    .number()
    .min(0, "Standard processing fee in BDT cannot be negative")
    .max(500000, "Fee exceeds institutional ceiling of ৳ 500,000 BDT"),
  expeditedAllowed: z.boolean().default(true),
  expeditedFeeBdt: z.coerce
    .number()
    .min(0, "Expedited surcharge cannot be negative")
    .max(100000, "Expedited surcharge exceeds ceiling of ৳ 100,000 BDT")
    .default(0),
  turnaroundDays: z.coerce
    .number()
    .min(1, "Minimum turnaround is 1 day")
    .max(90, "Maximum turnaround is 90 days")
    .default(14),
  riskDefault: z.enum(RISK_TIERS, {
    message: "Please select a default ethics risk tier",
  }),
  status: z.enum(CATEGORY_STATUSES, {
    message: "Status must be either Active or Inactive",
  }).default("Active"),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const createResearchCategorySchema = z.object({
  name: z
    .string()
    .min(3, "Category name must be at least 3 characters")
    .max(120, "Category name cannot exceed 120 characters")
    .trim(),
  code: z
    .string()
    .min(2, "Code must be at least 2 characters")
    .max(30, "Code cannot exceed 30 characters")
    .regex(/^[A-Z0-9_-]+$/, "Code must contain only uppercase letters, numbers, hyphens, and underscores")
    .trim(),
  board: z.enum(IRB_BOARDS, {
    message: "Please select a governing IRB ethics board",
  }),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(600, "Description cannot exceed 600 characters")
    .trim(),
  priceBdt: z.coerce
    .number()
    .min(0, "Standard fee in BDT cannot be negative")
    .max(500000, "Fee exceeds institutional ceiling of ৳ 500,000 BDT"),
  expeditedAllowed: z.boolean().default(true),
  expeditedFeeBdt: z.coerce
    .number()
    .min(0, "Expedited surcharge cannot be negative")
    .max(100000, "Expedited surcharge exceeds ceiling of ৳ 100,000 BDT")
    .default(0),
  turnaroundDays: z.coerce
    .number()
    .min(1, "Minimum turnaround is 1 day")
    .max(90, "Maximum turnaround is 90 days")
    .default(14),
  riskDefault: z.enum(RISK_TIERS, {
    message: "Please select a default ethics risk tier",
  }),
  status: z.enum(CATEGORY_STATUSES).default("Active"),
})

export const updateResearchCategorySchema = createResearchCategorySchema.partial()

export type ResearchCategory = z.infer<typeof researchCategorySchema>
export type CreateResearchCategoryInput = z.infer<typeof createResearchCategorySchema>
export type UpdateResearchCategoryInput = z.infer<typeof updateResearchCategorySchema>
