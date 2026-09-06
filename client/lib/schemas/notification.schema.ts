import { z } from "zod"

export const NOTIFICATION_ROLES = ["user", "admin", "reviewer", "all"] as const
export type NotificationRole = (typeof NOTIFICATION_ROLES)[number]

export const NOTIFICATION_CATEGORIES = [
  "protocol",
  "deliberation",
  "accreditation",
  "system",
  "security",
] as const
export type NotificationCategory = (typeof NOTIFICATION_CATEGORIES)[number]

export const NOTIFICATION_PRIORITIES = ["urgent", "high", "normal", "low"] as const
export type NotificationPriority = (typeof NOTIFICATION_PRIORITIES)[number]

export const ethicaNotificationSchema = z.object({
  id: z.string().min(1, "Notification ID is required"),
  role: z.enum(NOTIFICATION_ROLES),
  targetEmail: z.string().email().optional(),
  targetId: z.string().optional(),
  title: z.string().min(1, "Notification title is required").max(160),
  message: z.string().min(1, "Notification message is required").max(600),
  timestamp: z.string().min(1, "Display timestamp is required"),
  createdAt: z.string().min(1, "Creation timestamp is required"),
  read: z.boolean().default(false),
  category: z.enum(NOTIFICATION_CATEGORIES).default("protocol"),
  priority: z.enum(NOTIFICATION_PRIORITIES).default("normal"),
  actionUrl: z.string().optional(),
  actionLabel: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

export type EthicaNotification = z.infer<typeof ethicaNotificationSchema>

export const createNotificationInputSchema = z.object({
  id: z.string().optional(),
  role: z.enum(NOTIFICATION_ROLES),
  targetEmail: z.string().email().optional(),
  targetId: z.string().optional(),
  title: z.string().min(1, "Notification title is required").max(160),
  message: z.string().min(1, "Notification message is required").max(600),
  category: z.enum(NOTIFICATION_CATEGORIES).default("protocol"),
  priority: z.enum(NOTIFICATION_PRIORITIES).default("normal"),
  actionUrl: z.string().optional(),
  actionLabel: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  read: z.boolean().optional().default(false),
  timestamp: z.string().optional(),
  createdAt: z.string().optional(),
})

export type CreateNotificationInput = z.input<typeof createNotificationInputSchema>

export const updateNotificationInputSchema = z.object({
  read: z.boolean().optional(),
  title: z.string().optional(),
  message: z.string().optional(),
  priority: z.enum(NOTIFICATION_PRIORITIES).optional(),
})

export type UpdateNotificationInput = z.infer<typeof updateNotificationInputSchema>
