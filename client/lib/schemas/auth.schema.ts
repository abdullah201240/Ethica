import { z } from "zod"

/**
 * Investigator / User Login Schema
 */
export const userLoginSchema = z.object({
  email: z
    .string()
    .min(1, "Institutional email is required")
    .email("Please enter a valid institutional email address (e.g. user@diu.edu.bd)")
    .trim(),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().default(true),
})

export type UserLoginInput = z.infer<typeof userLoginSchema>

/**
 * Governance Administrator Login Schema
 */
export const adminLoginSchema = z.object({
  adminId: z
    .string()
    .min(1, "Administrator Email or ID is required")
    .email("Please enter a valid administrator email address")
    .trim(),
  passphrase: z
    .string()
    .min(1, "Administrative passphrase is required")
    .min(8, "Administrative passphrase must be at least 8 characters"),
})

export type AdminLoginInput = z.infer<typeof adminLoginSchema>

/**
 * IRB Committee Reviewer Login Schema
 */
export const reviewerLoginSchema = z.object({
  memberId: z
    .string()
    .min(1, "Committee Member Email or ID is required")
    .email("Please enter a valid committee member email address")
    .trim(),
  passphrase: z
    .string()
    .min(1, "Institutional passphrase is required")
    .min(8, "Institutional passphrase must be at least 8 characters"),
})

export type ReviewerLoginInput = z.infer<typeof reviewerLoginSchema>
