import { z } from "zod"

export const IRB_BOARDS = [
  "Biomedical IRB",
  "Social & Behavioral Board",
  "AI & Data Ethics Board",
] as const

export const STUDY_TYPES = [
  "Clinical Trial (Interventional)",
  "Epidemiological / Observational",
  "Social & Behavioral Survey",
  "AI & Healthcare Data Analytics",
  "Genomic & Precision Medicine",
] as const

export const RISK_TIERS = [
  "Exempt - Fast Track",
  "Minimal Risk",
  "Greater Than Minimal",
] as const

export const CONSENT_TYPES = [
  "Written Informed Consent (Bangla & English)",
  "Verbal / Audio Recorded Consent",
  "Assent Form (Pediatric / Minors)",
  "Exempt / De-identified Waiver",
] as const

export const CONSENT_PROCEDURES = [
  {
    type: "Written Informed Consent (Bangla & English)",
    badge: "Standard Adult",
    description:
      "Bilateral signed consent document in Bangla and English. Required for interventional, clinical, and high-engagement studies.",
  },
  {
    type: "Verbal / Audio Recorded Consent",
    badge: "Witness Required",
    description:
      "Witnessed audio or verbal attestation for non-literate participants, crisis situations, or telephonic survey protocols.",
  },
  {
    type: "Assent Form (Pediatric / Minors)",
    badge: "Minors (Ages 7–17)",
    description:
      "Simplified pediatric assent protocol alongside mandatory signed legal parent or guardian co-consent documentation.",
  },
  {
    type: "Exempt / De-identified Waiver",
    badge: "Archival / Secondary",
    description:
      "Formal ethics waiver for secondary research using anonymized patient records, archival datasets, or banked biospecimens.",
  },
] as const

export const PAYMENT_METHODS = [
  "bkash",
  "nagad",
  "rocket",
  "bank_transfer",
  "card",
] as const

export const FEE_TIERS = {
  student: {
    label: "Student / Graduate Thesis Research",
    amountBdt: 3500,
  },
  faculty: {
    label: "Faculty / Institutional Research",
    amountBdt: 7500,
  },
  clinical: {
    label: "Funded Clinical Trial / Full Committee",
    amountBdt: 20000,
  },
  sponsored: {
    label: "Sponsored / Multi-Center Trial",
    amountBdt: 45000,
  },
} as const

export const EXPEDITED_SURCHARGE_BDT = 5000

// ── Step 1: General Protocol Information Schema ───────────────────────────
export const step1ProtocolGeneralSchema = z.object({
  title: z
    .string()
    .min(5, "Protocol title must be at least 5 characters")
    .max(300, "Title cannot exceed 300 characters")
    .trim(),
  department: z
    .string()
    .min(2, "Academic department is required")
    .max(100, "Department name is too long")
    .trim(),
  board: z.enum(IRB_BOARDS, {
    message: "Please select an IRB review board",
  }),
  studyType: z.enum(STUDY_TYPES, {
    message: "Please select a study classification",
  }),
  durationMonths: z.coerce
    .number()
    .int("Duration must be a whole number")
    .min(1, "Duration must be at least 1 month")
    .max(60, "Duration cannot exceed 60 months"),
  studyLocation: z
    .string()
    .min(3, "Study location / field site is required")
    .max(200, "Location is too long")
    .trim(),
  coInvestigators: z
    .string()
    .max(400, "Co-investigators list is too long")
    .optional(),
})

export type Step1ProtocolGeneralInput = z.infer<typeof step1ProtocolGeneralSchema>

// ── Step 2: Scientific Methodology & Ethics Risk Schema ───────────────────
export const step2ProtocolMethodologySchema = z.object({
  abstract: z
    .string()
    .min(30, "Study abstract must be at least 30 characters explaining objectives")
    .max(2000, "Abstract cannot exceed 2000 characters")
    .trim(),
  targetSampleSize: z.coerce
    .number()
    .int("Sample size must be an integer")
    .min(1, "Target sample size must be at least 1 participant")
    .max(1000000, "Sample size exceeds maximum permissible cohort"),
  vulnerablePopulations: z
    .array(z.string())
    .default([]),
  riskTier: z.enum(RISK_TIERS, {
    message: "Please assess the human subject risk tier",
  }),
  consentType: z
    .string()
    .min(2, "Please select an informed consent procedure")
    .max(250, "Informed consent description is too long")
    .trim(),
  dataConfidentiality: z
    .string()
    .min(15, "Confidentiality and data protection statement is required")
    .max(1000, "Statement cannot exceed 1000 characters")
    .trim(),
})

export type Step2ProtocolMethodologyInput = z.infer<typeof step2ProtocolMethodologySchema>

// ── Step 3: Supporting Documents Dossier Schema ───────────────────────────
export const step3ProtocolDocumentsSchema = z.object({
  protocolProposalName: z
    .string()
    .min(1, "Full research protocol proposal PDF must be attached"),
  consentFormName: z
    .string()
    .min(1, "Informed Consent Form (ICF) PDF must be attached"),
  dataToolsName: z.string().optional(),
  investigatorCvName: z.string().optional(),
})

export type Step3ProtocolDocumentsInput = z.infer<typeof step3ProtocolDocumentsSchema>

// ── Step 4: Institutional Fee Payment in BDT (৳) Schema ───────────────────
export const step4ProtocolPaymentSchema = z.object({
  feeTier: z.enum(["student", "faculty", "clinical", "sponsored"]),
  isExpeditedTriage: z.boolean().default(false),
  feeAmountBdt: z.coerce
    .number()
    .min(1000, "Fee amount in BDT must be calculated"),
  paymentMethod: z.enum(PAYMENT_METHODS, {
    message: "Please select a payment method",
  }),
  senderNumber: z
    .string()
    .min(4, "Sender mobile/account number is required")
    .max(30, "Sender number is too long")
    .trim(),
  transactionId: z
    .string()
    .min(6, "Transaction ID (TrxID) or Bank Challan No must be at least 6 characters")
    .max(40, "Transaction ID is too long")
    .trim(),
  paymentVerified: z.boolean().refine((val) => val === true, {
    message: "You must verify your BDT transaction before submitting the protocol",
  }),
})

export type Step4ProtocolPaymentInput = z.infer<typeof step4ProtocolPaymentSchema>

// ── Step 5 / Full Protocol Application Schema ──────────────────────────────
export const fullProtocolApplicationSchema = z.object({
  ...step1ProtocolGeneralSchema.shape,
  ...step2ProtocolMethodologySchema.shape,
  ...step3ProtocolDocumentsSchema.shape,
  ...step4ProtocolPaymentSchema.shape,
  agreeHelsinkiTerms: z.boolean().refine((val) => val === true, {
    message: "You must certify compliance with the WMA Declaration of Helsinki",
  }),
})

export type FullProtocolApplicationInput = z.infer<typeof fullProtocolApplicationSchema>
