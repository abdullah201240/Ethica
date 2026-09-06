import { z } from "zod"
import {
  ethicaNotificationSchema,
  createNotificationInputSchema,
  type EthicaNotification,
  type CreateNotificationInput,
  type NotificationRole,
} from "@/lib/schemas"

export type { EthicaNotification, NotificationRole, CreateNotificationInput }

export const initialNotifications: EthicaNotification[] = [
  // ── INVESTIGATOR (USER) NOTIFICATIONS ─────────────────────────────────────
  {
    id: "NOTIF-USR-001",
    role: "user",
    targetEmail: "elena.rostova@diu.edu.bd",
    title: "Clearance Granted: ETH-2026-074",
    message:
      "Institutional Ethics Clearance Granted for 'Cognitive Load and Decision Fatigue in Telemedicine Triage Nurses'. Your official SHA-256 sealed digital certificate is now available.",
    timestamp: "10m ago",
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    read: false,
    category: "protocol",
    priority: "high",
    actionUrl: "/applications/ETH-2026-074",
    actionLabel: "View Certificate",
    metadata: {
      protocolId: "ETH-2026-074",
      status: "Clearance Granted",
    },
  },
  {
    id: "NOTIF-USR-002",
    role: "user",
    targetEmail: "elena.rostova@diu.edu.bd",
    title: "Deliberation In Progress: ETH-2026-089",
    message:
      "Your clinical protocol 'Longitudinal AI-Assisted Clinical Biomarker Analysis' has entered Committee Deliberation stage with Biomedical Review Panel B.",
    timestamp: "2h ago",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
    category: "deliberation",
    priority: "normal",
    actionUrl: "/applications/ETH-2026-089",
    actionLabel: "Track Progress",
    metadata: {
      protocolId: "ETH-2026-089",
      status: "Under Committee Review",
    },
  },
  {
    id: "NOTIF-USR-003",
    role: "user",
    targetEmail: "elena.rostova@diu.edu.bd",
    title: "Amendments Requested: ETH-2026-061",
    message:
      "IRB Deliberation Board requested minor revisions on Section 3 (Participant De-identification & Informed Consent Schedule). Please review reviewer notes and submit updated PDFs.",
    timestamp: "1d ago",
    createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    read: true,
    category: "protocol",
    priority: "urgent",
    actionUrl: "/applications/ETH-2026-061",
    actionLabel: "Review Remarks",
    metadata: {
      protocolId: "ETH-2026-061",
      status: "Revision Requested",
    },
  },
  {
    id: "NOTIF-USR-004",
    role: "user",
    targetEmail: "elena.rostova@diu.edu.bd",
    title: "Annual Compliance Renewal Reminder",
    message:
      "Periodic ethics audit report for protocol ETH-2025-032 is due within 30 days pursuant to DIU Research Governance Code Section 7.2.",
    timestamp: "3d ago",
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    read: true,
    category: "system",
    priority: "normal",
    actionUrl: "/applications",
    actionLabel: "Open Applications",
  },

  // ── GOVERNANCE ADMIN (SECRETARIAT) NOTIFICATIONS ──────────────────────────
  {
    id: "NOTIF-ADM-001",
    role: "admin",
    title: "New Protocol Submission: ETH-2026-092",
    message:
      "Principal Investigator Dr. Elena Rostova submitted protocol 'Socio-Ecological Modeling of Vector-Borne Outbreaks'. Formal triage and reviewer assignment required.",
    timestamp: "15m ago",
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    read: false,
    category: "protocol",
    priority: "high",
    actionUrl: "/admin/protocols/ETH-2026-089",
    actionLabel: "Triage Protocol",
    metadata: {
      protocolId: "ETH-2026-089",
      piName: "Dr. Elena Rostova",
    },
  },
  {
    id: "NOTIF-ADM-002",
    role: "admin",
    title: "Review Assignment Accepted: ETH-2026-089",
    message:
      "Prof. Charles Montgomery accepted primary reviewer invitation for protocol ETH-2026-089. Deliberation dossier activated with 14-day completion target.",
    timestamp: "1h ago",
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    read: false,
    category: "deliberation",
    priority: "normal",
    actionUrl: "/admin/protocols/ETH-2026-089",
    actionLabel: "View Assignment",
    metadata: {
      protocolId: "ETH-2026-089",
      reviewerName: "Prof. Charles Montgomery",
    },
  },
  {
    id: "NOTIF-ADM-003",
    role: "admin",
    title: "Deliberation Evaluation Filed: ETH-2026-077",
    message:
      "Dr. Farzana Choudhury completed ethics deliberation for protocol ETH-2026-077 with recommendation: Clearance Approved (Ratings: Scientific 5/5, Consent 5/5, Safeguards 4/5).",
    timestamp: "4h ago",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    read: false,
    category: "deliberation",
    priority: "high",
    actionUrl: "/admin/protocols",
    actionLabel: "Inspect Evaluation",
    metadata: {
      protocolId: "ETH-2026-077",
      recommendation: "Clearance Approved",
    },
  },
  {
    id: "NOTIF-ADM-004",
    role: "admin",
    title: "Reviewer Intake Dossier: Dr. Kazi Tanvir Ahmed",
    message:
      "Associate Professor Dr. Kazi Tanvir Ahmed (BSMMU) submitted accreditation credentials for Biomedical & Clinical IRB. Secretariat verification pending.",
    timestamp: "1d ago",
    createdAt: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
    read: true,
    category: "accreditation",
    priority: "normal",
    actionUrl: "/admin/applications/REV-2026-081",
    actionLabel: "Verify Dossier",
    metadata: {
      applicationId: "REV-2026-081",
      applicantName: "Dr. Kazi Tanvir Ahmed",
    },
  },
  {
    id: "NOTIF-ADM-005",
    role: "admin",
    title: "Cryptographic Ledger Audit Complete",
    message:
      "FIPS 140-3 SHA-256 institutional ledger integrity sweep verified 42 active clearance certificates with 0 discrepancies detected.",
    timestamp: "2d ago",
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    read: true,
    category: "security",
    priority: "low",
    actionUrl: "/admin/dashboard",
    actionLabel: "View Ledger",
  },

  // ── COMMITTEE REVIEWER NOTIFICATIONS ──────────────────────────────────────
  {
    id: "NOTIF-REV-001",
    role: "reviewer",
    targetEmail: "charles.montgomery@diu.edu.bd",
    title: "New Deliberation Request: ETH-2026-089",
    message:
      "You have been assigned as Primary Peer Reviewer for Protocol ETH-2026-089 ('Longitudinal AI-Assisted Clinical Biomarker Analysis'). Acceptance response requested within 48h.",
    timestamp: "20m ago",
    createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    read: false,
    category: "deliberation",
    priority: "urgent",
    actionUrl: "/reviewer/requests",
    actionLabel: "Accept / Decline",
    metadata: {
      protocolId: "ETH-2026-089",
    },
  },
  {
    id: "NOTIF-REV-002",
    role: "reviewer",
    targetEmail: "charles.montgomery@diu.edu.bd",
    title: "Evaluation Due in 3 Days: ETH-2026-071",
    message:
      "Deliberation evaluation for protocol ETH-2026-071 ('Pediatric Antibiotic Stewardship in Tertiary ICU') has 3 days remaining before the committee deliberation deadline.",
    timestamp: "3h ago",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    read: false,
    category: "deliberation",
    priority: "high",
    actionUrl: "/reviewer/deliberations",
    actionLabel: "Complete Evaluation",
    metadata: {
      protocolId: "ETH-2026-071",
    },
  },
  {
    id: "NOTIF-REV-003",
    role: "reviewer",
    targetEmail: "charles.montgomery@diu.edu.bd",
    title: "Amended Proposal Submitted: ETH-2026-065",
    message:
      "Investigator Dr. Elena Rostova submitted updated patient consent scripts and revised risk disclosures for protocol ETH-2026-065. Reviewer re-evaluation unlocked.",
    timestamp: "1d ago",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    category: "protocol",
    priority: "normal",
    actionUrl: "/reviewer/deliberations",
    actionLabel: "Inspect Revisions",
    metadata: {
      protocolId: "ETH-2026-065",
    },
  },
  {
    id: "NOTIF-REV-004",
    role: "reviewer",
    targetEmail: "charles.montgomery@diu.edu.bd",
    title: "Accreditation Reaffirmed: Senior Voting Reviewer",
    message:
      "Your institutional accreditation appointment to the Biomedical & Clinical IRB has been reaffirmed through Dec 2027 by the DIU Research Governance Council.",
    timestamp: "4d ago",
    createdAt: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(),
    read: true,
    category: "accreditation",
    priority: "low",
    actionUrl: "/reviewer/profile",
    actionLabel: "View Accreditation",
  },
]

const NOTIFICATIONS_STORAGE_KEY = "ethica_notifications_v1"

let cachedNotifications: EthicaNotification[] = [...initialNotifications]
let isNotificationsInitialized = false
const notificationListeners = new Set<() => void>()

function notifyListeners(): void {
  notificationListeners.forEach((fn) => {
    try {
      fn()
    } catch {
      // Ignore listener error
    }
  })
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("ethica:notifications-updated"))
  }
}

export function subscribeNotifications(callback: () => void): () => void {
  notificationListeners.add(callback)

  if (typeof window !== "undefined" && !isNotificationsInitialized) {
    isNotificationsInitialized = true
    getStoredNotifications()
  }

  const handleCustomEvent = () => {
    callback()
  }

  if (typeof window !== "undefined") {
    window.addEventListener("ethica:notifications-updated", handleCustomEvent)
  }

  return () => {
    notificationListeners.delete(callback)
    if (typeof window !== "undefined") {
      window.removeEventListener("ethica:notifications-updated", handleCustomEvent)
    }
  }
}

export function getStoredNotifications(): EthicaNotification[] {
  if (typeof window === "undefined") {
    return cachedNotifications
  }

  try {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(initialNotifications))
      cachedNotifications = [...initialNotifications]
      return cachedNotifications
    }

    const parsed = JSON.parse(raw)
    const result = z.array(ethicaNotificationSchema).safeParse(parsed)
    if (result.success && result.data.length > 0) {
      cachedNotifications = result.data
      return cachedNotifications
    } else {
      // Fallback to initial seeds if corrupt
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(initialNotifications))
      cachedNotifications = [...initialNotifications]
      return cachedNotifications
    }
  } catch {
    return cachedNotifications
  }
}

export function saveStoredNotifications(notifs: EthicaNotification[]): void {
  cachedNotifications = notifs
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifs))
    } catch {
      // Continue with in-memory state
    }
  }
  notifyListeners()
}

export function getNotificationsForRole(
  role?: NotificationRole,
  targetEmail?: string
): EthicaNotification[] {
  const all = getStoredNotifications()
  if (!role || role === "all") return all

  return all.filter((n) => {
    if (n.role === "all") return true
    if (n.role !== role) return false

    // Optional email filter: if notification specifies a targetEmail, only match if same or if no email specified
    if (targetEmail && n.targetEmail) {
      return n.targetEmail.toLowerCase() === targetEmail.toLowerCase()
    }
    return true
  })
}

export function getUnreadCountForRole(
  role?: NotificationRole,
  targetEmail?: string
): number {
  const notifs = getNotificationsForRole(role, targetEmail)
  return notifs.filter((n) => !n.read).length
}

export function markNotificationAsRead(id: string): EthicaNotification | undefined {
  const current = getStoredNotifications()
  let updatedItem: EthicaNotification | undefined

  const updated = current.map((item) => {
    if (item.id === id) {
      updatedItem = { ...item, read: true }
      return updatedItem
    }
    return item
  })

  if (updatedItem) {
    saveStoredNotifications(updated)
  }
  return updatedItem
}

export function markAllNotificationsAsRead(
  role?: NotificationRole,
  targetEmail?: string
): void {
  const current = getStoredNotifications()
  const updated = current.map((item) => {
    if (!role || role === "all" || item.role === "all" || item.role === role) {
      if (!targetEmail || !item.targetEmail || item.targetEmail.toLowerCase() === targetEmail.toLowerCase()) {
        return { ...item, read: true }
      }
    }
    return item
  })
  saveStoredNotifications(updated)
}

export function deleteNotification(id: string): boolean {
  const current = getStoredNotifications()
  const filtered = current.filter((item) => item.id !== id)
  if (filtered.length !== current.length) {
    saveStoredNotifications(filtered)
    return true
  }
  return false
}

export function clearReadNotifications(
  role?: NotificationRole,
  targetEmail?: string
): void {
  const current = getStoredNotifications()
  const filtered = current.filter((item) => {
    if (!item.read) return true
    if (!role || role === "all" || item.role === "all" || item.role === role) {
      if (!targetEmail || !item.targetEmail || item.targetEmail.toLowerCase() === targetEmail.toLowerCase()) {
        return false // Remove this read item
      }
    }
    return true
  })
  saveStoredNotifications(filtered)
}

export function dispatchNotification(
  input: CreateNotificationInput
): EthicaNotification {
  const validation = createNotificationInputSchema.safeParse(input)
  const safeData = validation.success ? validation.data : input

  const id = safeData.id || `NOTIF-${safeData.role.toUpperCase()}-${Date.now().toString().slice(-6)}`
  const now = new Date()
  const createdAt = safeData.createdAt || now.toISOString()
  const timestamp = safeData.timestamp || "Just now"

  const newNotif: EthicaNotification = {
    id,
    role: safeData.role,
    targetEmail: safeData.targetEmail,
    targetId: safeData.targetId,
    title: safeData.title,
    message: safeData.message,
    timestamp,
    createdAt,
    read: safeData.read ?? false,
    category: safeData.category ?? "protocol",
    priority: safeData.priority ?? "normal",
    actionUrl: safeData.actionUrl,
    actionLabel: safeData.actionLabel,
    metadata: safeData.metadata,
  }

  const current = getStoredNotifications()
  const updated = [newNotif, ...current]
  saveStoredNotifications(updated)

  return newNotif
}

export function resetNotificationsToDefault(): void {
  saveStoredNotifications(initialNotifications)
}

/**
 * Simulate an incoming notification for demonstration & testing purposes
 */
export function simulateIncomingAlert(role: NotificationRole): EthicaNotification {
  const nowStr = "Just now"
  const randomSuffix = Math.floor(100 + Math.random() * 900)

  if (role === "user") {
    return dispatchNotification({
      role: "user",
      targetEmail: "elena.rostova@diu.edu.bd",
      title: `IRB Committee Action: ETH-2026-${randomSuffix}`,
      message: `Your protocol ETH-2026-${randomSuffix} has been assigned a Primary Deliberation Reviewer. Expedited compliance verification in progress.`,
      category: "protocol",
      priority: "high",
      actionUrl: "/applications",
      actionLabel: "View Application",
      timestamp: nowStr,
      read: false,
    })
  } else if (role === "admin") {
    return dispatchNotification({
      role: "admin",
      title: `New Protocol Submission: ETH-2026-${randomSuffix}`,
      message: `New protocol ETH-2026-${randomSuffix} was submitted by Dr. Elena Rostova and has passed automated schema integrity. Triage assignment ready.`,
      category: "protocol",
      priority: "high",
      actionUrl: "/admin/protocols",
      actionLabel: "Review Submission",
      timestamp: nowStr,
      read: false,
    })
  } else {
    return dispatchNotification({
      role: "reviewer",
      targetEmail: "charles.montgomery@diu.edu.bd",
      title: `Peer Review Assignment: ETH-2026-${randomSuffix}`,
      message: `Compliance Secretariat appointed you as Voting Reviewer for protocol ETH-2026-${randomSuffix}. Please confirm deliberation capacity.`,
      category: "deliberation",
      priority: "urgent",
      actionUrl: "/reviewer/requests",
      actionLabel: "Accept Review",
      timestamp: nowStr,
      read: false,
    })
  }
}
