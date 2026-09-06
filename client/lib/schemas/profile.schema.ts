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

export const adminProfileSchema = z.object({
  username: z
    .string()
    .min(2, "Username must be at least 2 characters")
    .max(50, "Username is too long")
    .trim()
    .default("marcus.vance"),
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name is too long")
    .trim()
    .default("Marcus"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name is too long")
    .trim()
    .default("Vance"),
  nickname: z.string().max(50, "Nickname is too long").trim().optional().default("Marcus.V"),
  role: z
    .string()
    .min(1, "Role is required")
    .max(80, "Role is too long")
    .trim()
    .default("Governance Administrator"),
  displayName: z
    .string()
    .min(1, "Display name is required")
    .max(100, "Display name is too long")
    .trim()
    .default("Dr. Marcus Vance"),
  email: z
    .string()
    .min(1, "Official email is required")
    .email("Please enter a valid email address")
    .trim()
    .default("marcus.vance@diu.edu.bd"),
  whatsapp: z.string().max(50, "WhatsApp is too long").trim().optional().default("+880 1713-000001"),
  website: z.string().max(150, "Website is too long").trim().optional().default("https://ethics.diu.edu.bd"),
  telegram: z.string().max(50, "Telegram is too long").trim().optional().default("@marcus_vance"),
  bio: z
    .string()
    .max(2000, "Bio cannot exceed 2000 characters")
    .trim()
    .default(
      "Director of Research Governance & Compliance at Daffodil International University. Overseeing institutional review boards, ethical clearance certifications, FIPS compliance, and GCP E6(R2) research integrity frameworks."
    ),
  avatarUrl: z.string().optional().default("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600"),
  phone: z.string().max(50).trim().optional().default("+880 2 9138234-5 (Ext: 104)"),
  mobile: z.string().max(50).trim().optional().default("+880 1713-000001"),
  office: z.string().max(150).trim().optional().default("Suite 602, Research & Innovation Complex, Daffodil Smart City"),
})

export type AdminProfileInput = z.infer<typeof adminProfileSchema>

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
  // Mockup Core Profile Information Fields
  username: z
    .string()
    .min(2, "Username must be at least 2 characters")
    .max(50, "Username is too long")
    .trim()
    .default("elena.rostova"),
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name is too long")
    .trim()
    .default("Elena"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name is too long")
    .trim()
    .default("Rostova"),
  nickname: z.string().max(50, "Nickname is too long").trim().optional().default(""),
  role: z
    .string()
    .min(1, "Role is required")
    .max(80, "Role is too long")
    .trim()
    .default("Principal Investigator"),
  displayName: z
    .string()
    .min(1, "Display name is required")
    .max(100, "Display name is too long")
    .trim()
    .default("Dr. Elena Rostova"),

  // Mockup Contact Information Fields
  email: z
    .string()
    .min(1, "Official email is required")
    .email("Please enter a valid email address")
    .trim(),
  whatsapp: z.string().max(50, "WhatsApp handle/number is too long").trim().optional().default(""),
  website: z.string().max(150, "Website URL is too long").trim().optional().default(""),
  telegram: z.string().max(50, "Telegram handle is too long").trim().optional().default(""),

  // Mockup About the User
  bio: z
    .string()
    .max(2000, "Biographical info cannot exceed 2000 characters")
    .trim()
    .default(""),

  // Avatar & Identity
  avatarUrl: z.string().optional().default(""),

  // Backward Compatible Institutional Fields
  name: z.string().max(100).trim().optional().default("Dr. Elena Rostova"),
  title: z.string().max(100).trim().optional().default("Associate Professor, Public Health"),
  phone: z.string().max(50).trim().optional().default("+880 2 9138234-5"),
  mobile: z.string().max(50).trim().optional().default("+880 1711-223344"),
  office: z.string().max(150).trim().optional().default("Suite 408, Faculty of Allied Health Sciences"),
  department: z.string().max(100).trim().optional().default("Public Health & Clinical Epidemiology"),
  institution: z.string().max(150).trim().optional().default("Daffodil International University"),
  orcidId: z.string().trim().optional().default("0000-0002-8419-7241"),
  googleScholarUrl: z.string().trim().optional().default(""),
  researchInterests: z.string().trim().optional().default(""),
  consultationHours: z.string().trim().optional().default(""),
})

export type InvestigatorProfileInput = z.infer<typeof investigatorProfileSchema>

// ── Reviewer Profile Edit Schema ───────────────────────────────────────────
export const reviewerProfileSchema = z.object({
  // Mockup Core Profile Information Fields
  username: z
    .string()
    .min(2, "Username must be at least 2 characters")
    .max(50, "Username is too long")
    .trim()
    .default("farzana.choudhury"),
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name is too long")
    .trim()
    .default("Farzana"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name is too long")
    .trim()
    .default("Choudhury"),
  nickname: z.string().max(50, "Nickname is too long").trim().optional().default("Farzana.C"),
  role: z
    .string()
    .min(1, "Role is required")
    .max(80, "Role is too long")
    .trim()
    .default("Senior Voting Reviewer"),
  displayName: z
    .string()
    .min(1, "Display name is required")
    .max(100, "Display name is too long")
    .trim()
    .default("Dr. Farzana Choudhury"),

  // Mockup Contact Information Fields
  email: z
    .string()
    .min(1, "Official institutional email is required")
    .email("Please enter a valid institutional email address")
    .trim()
    .default("farzana.choudhury@icddrb.org"),
  whatsapp: z.string().max(50, "WhatsApp is too long").trim().optional().default("+880 1712-456789"),
  website: z.string().max(150, "Website is too long").trim().optional().default("https://icddrb.org/faculty/farzana-choudhury"),
  telegram: z.string().max(50, "Telegram is too long").trim().optional().default("@farzana_ethics"),

  // Mockup About the User
  bio: z
    .string()
    .max(2000, "Bio statement cannot exceed 2000 characters")
    .trim()
    .default(
      "Dedicated to upholding the Declaration of Helsinki and CIOMS guidelines in vulnerable population field trials across South Asia. Appointed to Biomedical & Maternal Sub-Committee."
    ),

  // Avatar & Identity
  avatarUrl: z.string().optional().default(""),

  // Backward Compatible Institutional Fields
  name: z.string().max(100).trim().optional().default("Dr. Farzana Choudhury"),
  degree: z.string().max(100).trim().optional().default("MBBS, MPH (Harvard), PhD"),
  position: z.string().max(100).trim().optional().default("Senior Research Scientist"),
  department: z.string().max(100).trim().optional().default("Infectious Diseases & Maternal Health"),
  institution: z.string().max(150).trim().optional().default("icddr,b"),
  phone: z.string().max(50).trim().optional().default("+880 1712-456789"),
  mobile: z.string().max(50).trim().optional().default("+880 1712-456789"),
  officeLocation: z.string().max(150).trim().optional().default("Chamber 701, Clinical Sciences Faculty"),
  consultationHours: z.string().max(120).trim().optional().default("Tue & Thu, 02:00 PM – 05:00 PM BST"),
  orcid: z.string().trim().optional().default("0000-0001-9032-6124"),
  bioStatement: z.string().max(1000).trim().optional().default("Dedicated to upholding the Declaration of Helsinki and CIOMS guidelines."),
  specializations: z.union([z.string(), z.array(z.string())]).optional().default("Public Health, Pediatric Research"),
})

export type ReviewerProfileInput = z.infer<typeof reviewerProfileSchema>

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
