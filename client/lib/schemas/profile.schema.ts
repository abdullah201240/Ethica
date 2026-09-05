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
