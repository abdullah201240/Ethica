import { z } from "zod"

export const REVIEWER_BOARDS = [
  "Biomedical & Clinical IRB",
  "Social & Behavioral IRB",
  "AI & Technology Ethics Panel",
] as const

export const REVIEWER_ROLES = [
  "Chairperson",
  "Vice Chair",
  "Senior Voting Reviewer",
  "Voting Member",
  "Specialist Advisor",
] as const

export const REVIEWER_CLEARANCE_LEVELS = [
  "Full Voting Quorum",
  "Expedited Triage",
  "Specialist Advisor",
] as const

/**
 * Schema for stored accredited reviewer records in localStorage
 */
export const reviewerRosterSchema = z.object({
  id: z.string(),
  applicationId: z.string().optional(),
  name: z.string(),
  degree: z.string(),
  position: z.string(),
  department: z.string(),
  institution: z.string(),
  email: z.string().email(),
  phone: z.string(),
  orcid: z.string().optional(),
  board: z.enum(REVIEWER_BOARDS),
  role: z.enum(REVIEWER_ROLES),
  clearanceLevel: z.enum(REVIEWER_CLEARANCE_LEVELS),
  status: z.enum(["Active", "Inactive"]),
  specializations: z.array(z.string()),
  assignedProtocols: z.number().int().nonnegative(),
  accreditationDate: z.string(),
  digitalSealHash: z.string(),
  bioStatement: z.string().optional(),
  statusReason: z.string().optional(),
})

export type StoredAccreditedReviewer = z.infer<typeof reviewerRosterSchema>

/**
 * Schema for synchronizing approved reviewer application into roster
 */
export const syncApprovedReviewerSchema = z.object({
  id: z.string().min(1, "Application ID is required"),
  fullName: z.string().min(2, "Full Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(1, "Phone is required"),
  institution: z.string().min(1, "Institution is required"),
  department: z.string().min(1, "Department is required"),
  position: z.string().min(1, "Position is required"),
  degree: z.string().min(1, "Degree is required"),
  orcid: z.string().optional(),
  expertise: z.array(z.string()).min(1, "At least one expertise area is required"),
  statement: z.string().optional(),
  decisionDate: z.string().optional(),
})

export type SyncApprovedReviewerInput = z.infer<typeof syncApprovedReviewerSchema>
