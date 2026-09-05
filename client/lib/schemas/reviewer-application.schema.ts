import { z } from "zod"

export const DEGREE_OPTIONS = [
  "PhD / Doctorate",
  "MD / MBBS",
  "Masters (Research)",
  "Professional Certification",
  "Other",
] as const

export const POSITION_OPTIONS = [
  "Professor",
  "Associate Professor",
  "Assistant Professor",
  "Lecturer / Instructor",
  "Research Scientist",
  "Independent Expert",
  "Other",
] as const

export const YEARS_EXPERIENCE_OPTIONS = [
  "1–3 years",
  "4–7 years",
  "8–12 years",
  "13–20 years",
  "20+ years",
] as const

/**
 * Step 1: Personal Details Schema
 */
export const step1PersonalDetailsSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name cannot exceed 100 characters")
    .trim(),
  email: z
    .string()
    .min(1, "Institutional email is required")
    .email("Please enter a valid institutional email address")
    .trim(),
  phone: z
    .string()
    .trim()
    .refine((val) => !val || /^[\d\s+\-().]{6,25}$/.test(val), {
      message: "Please enter a valid phone number (e.g. +880 1700-000000)",
    })
    .optional()
    .default(""),
  institution: z
    .string()
    .min(2, "Current institution must be at least 2 characters")
    .max(150, "Institution name is too long")
    .trim(),
})

export type Step1PersonalDetails = z.infer<typeof step1PersonalDetailsSchema>

/**
 * Step 2: Academic Profile Schema
 */
export const step2AcademicProfileSchema = z.object({
  degree: z.enum(DEGREE_OPTIONS, {
    message: "Please select your highest academic degree",
  }),
  department: z
    .string()
    .min(2, "Department or Faculty must be at least 2 characters")
    .max(120, "Department name is too long")
    .trim(),
  position: z.enum(POSITION_OPTIONS, {
    message: "Please select your academic position",
  }),
  yearsExperience: z.enum(YEARS_EXPERIENCE_OPTIONS, {
    message: "Please select your years of research experience",
  }),
  orcid: z
    .string()
    .trim()
    .refine((val) => !val || /^\d{4}-\d{4}-\d{4}-[\dX]{4}$/.test(val), {
      message: "ORCID iD must follow the format 0000-0000-0000-0000",
    })
    .optional()
    .default(""),
})

export type Step2AcademicProfile = z.infer<typeof step2AcademicProfileSchema>

/**
 * Step 3: Expertise & Experience Schema
 */
export const step3ExpertiseSchema = z.object({
  expertise: z
    .array(z.string())
    .min(1, "Please select at least one area of expertise"),
  statement: z
    .string()
    .min(20, "Statement of interest must be at least 20 characters")
    .max(3000, "Statement cannot exceed 3000 characters")
    .trim(),
  cvFileName: z.string().optional().default(""),
})

export type Step3Expertise = z.infer<typeof step3ExpertiseSchema>

/**
 * Step 4: Declaration & Terms Schema
 */
export const step4ReviewSubmitSchema = z.object({
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the ethical declaration and DIU IRB Reviewer Code of Conduct",
  }),
})

export type Step4ReviewSubmit = z.infer<typeof step4ReviewSubmitSchema>

/**
 * Full Composite Application Schema
 */
export const fullApplicationSchema = step1PersonalDetailsSchema
  .merge(step2AcademicProfileSchema)
  .merge(step3ExpertiseSchema)
  .merge(step4ReviewSubmitSchema)

export type FullApplicationInput = z.infer<typeof fullApplicationSchema>

/**
 * Reviewer Application Storage Schema (for lib/reviewer-applications.ts)
 */
export const reviewerApplicationSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  institution: z.string(),
  department: z.string(),
  position: z.string(),
  degree: z.string(),
  yearsExperience: z.number().int().nonnegative(),
  orcid: z.string(),
  expertise: z.array(z.string()),
  statement: z.string(),
  cvFileName: z.string(),
  status: z.enum(["Pending Verification", "Approved", "Rejected"]),
  submittedAt: z.string(),
  decisionNotes: z.string().optional(),
  decisionDate: z.string().optional(),
})

export type StoredReviewerApplication = z.infer<typeof reviewerApplicationSchema>

/**
 * Schema for addReviewerApplication input
 */
export const createReviewerApplicationInputSchema = z.object({
  fullName: z.string().trim().min(2, "Full Name must be at least 2 characters"),
  email: z.string().trim().email("Please enter a valid institutional email address"),
  phone: z.string().trim().default("+880 1700-000000"),
  institution: z.string().trim().min(2, "Institution is required"),
  department: z.string().trim().min(2, "Department is required"),
  position: z.string().trim().default("Research Faculty"),
  degree: z.string().trim().default("PhD / Doctorate"),
  yearsExperience: z.coerce.number().int().min(0).default(5),
  orcid: z.string().trim().default("0000-0000-0000-0000"),
  expertise: z.array(z.string()).min(1, "At least one area of expertise is required"),
  statement: z.string().trim().min(10, "Statement of interest is required"),
  cvFileName: z.string().trim().default("Curriculum_Vitae.pdf"),
})

export type CreateReviewerApplicationInput = z.input<typeof createReviewerApplicationInputSchema>
