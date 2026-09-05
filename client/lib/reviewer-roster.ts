import { z } from "zod"
import {
  reviewerRosterSchema,
  syncApprovedReviewerSchema,
  type SyncApprovedReviewerInput,
} from "@/lib/schemas"
import { reviewerRosterApi } from "@/lib/api/reviewer-roster.api"

export interface AccreditedReviewer {
  id: string
  applicationId?: string
  name: string
  degree: string
  position: string
  department: string
  institution: string
  email: string
  phone: string
  orcid?: string
  board: "Biomedical & Clinical IRB" | "Social & Behavioral IRB" | "AI & Technology Ethics Panel"
  role: "Chairperson" | "Vice Chair" | "Senior Voting Reviewer" | "Voting Member" | "Specialist Advisor"
  clearanceLevel: "Full Voting Quorum" | "Expedited Triage" | "Specialist Advisor"
  status: "Active" | "Inactive"
  specializations: string[]
  assignedProtocols: number
  accreditationDate: string
  digitalSealHash: string
  bioStatement?: string
  statusReason?: string
  mobile?: string
  officeLocation?: string
  consultationHours?: string
  avatarUrl?: string
}

export const initialAccreditedReviewers: AccreditedReviewer[] = [
  {
    id: "REV-2026-079",
    applicationId: "REV-2026-079",
    name: "Dr. Farzana Choudhury",
    degree: "MBBS, MPH (Harvard), PhD (Johns Hopkins)",
    position: "Senior Research Scientist",
    department: "Infectious Diseases & Maternal Health",
    institution: "icddr,b (International Centre for Diarrhoeal Disease Research)",
    email: "farzana.choudhury@icddrb.org",
    phone: "+880 1712-456789",
    orcid: "0000-0001-9032-6124",
    board: "Biomedical & Clinical IRB",
    role: "Senior Voting Reviewer",
    clearanceLevel: "Full Voting Quorum",
    status: "Active",
    specializations: ["Public Health & Epidemiology", "Pediatric Research", "Community & Participatory Research"],
    assignedProtocols: 4,
    accreditationDate: "Sep 01, 2026",
    digitalSealHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    bioStatement:
      "Dedicated to upholding the Declaration of Helsinki and CIOMS guidelines in vulnerable population field trials across South Asia. Appointed to Biomedical & Maternal Sub-Committee.",
  },
  {
    id: "REV-2026-077",
    applicationId: "REV-2026-077",
    name: "Dr. Sabrina Akhter",
    degree: "MBBS, FCPS (Pediatrics), MD",
    position: "Assistant Professor",
    department: "Pediatrics & Neonatology",
    institution: "Dhaka Medical College & Hospital",
    email: "sabrina.akhter@dmc.gov.bd",
    phone: "+880 1611-678901",
    orcid: "0000-0003-1109-8834",
    board: "Biomedical & Clinical IRB",
    role: "Voting Member",
    clearanceLevel: "Full Voting Quorum",
    status: "Active",
    specializations: ["Pediatric Research", "Biomedical & Clinical Research"],
    assignedProtocols: 2,
    accreditationDate: "Aug 28, 2026",
    digitalSealHash: "7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
    bioStatement:
      "Clinical focus in neonatal intensive care and pediatric clinical trials. Deep experience in pediatric assent protocols and parental consent safeguards.",
  },
  {
    id: "REV-2026-074",
    applicationId: "REV-2026-074",
    name: "Dr. Mahmudul Hasan",
    degree: "MBBS, FCPS (Psychiatry), M.Phil",
    position: "Associate Professor of Psychiatry",
    department: "Psychiatry & Behavioral Health",
    institution: "National Institute of Mental Health",
    email: "m.hasan@nimh.gov.bd",
    phone: "+880 1718-901234",
    orcid: "0000-0001-6543-9876",
    board: "Social & Behavioral IRB",
    role: "Voting Member",
    clearanceLevel: "Full Voting Quorum",
    status: "Active",
    specializations: ["Mental Health & Psychiatry", "Social & Behavioral Sciences"],
    assignedProtocols: 3,
    accreditationDate: "Aug 18, 2026",
    digitalSealHash: "a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e",
    bioStatement:
      "Expertise in psychiatric capacity assessment, consent competence in severe mood disorders, and ethical triage in suicide prevention studies.",
  },
  {
    id: "REV-DIU-001",
    name: "Prof. Charles Montgomery",
    degree: "MD, PhD in Bioethics",
    position: "Professor & Committee Chair",
    department: "Biomedical Research Ethics Board",
    institution: "Daffodil International University",
    email: "charles.montgomery@diu.edu.bd",
    phone: "+880 2 9138234 (Ext: 101)",
    mobile: "+880 1711-234567",
    officeLocation: "Ethics Secretariat Chamber, Level 7, Academic Building 4",
    consultationHours: "Mon & Wed 10:00 AM - 1:00 PM (By Appointment)",
    orcid: "0000-0002-3841-8910",
    board: "Biomedical & Clinical IRB",
    role: "Chairperson",
    clearanceLevel: "Full Voting Quorum",
    status: "Active",
    specializations: ["Biomedical & Clinical Research", "Clinical Trial Governance", "Human Genetic Ethics"],
    assignedProtocols: 8,
    accreditationDate: "Jan 10, 2025",
    digitalSealHash: "6c14109403986a4e3a9c7b9e84b80614e59174e9efb783f98c8c6f1a8e1b302c",
    bioStatement:
      "Founding Chair of the Institutional Review Board. Senior ethics consultant on multinational multi-center pharmaceutical trials.",
    avatarUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "REV-DIU-002",
    name: "Dr. Sarah Jenkins",
    degree: "MD, MPH, FAAP",
    position: "Associate Professor & Vice Chair",
    department: "Pediatrics & Vulnerable Populations",
    institution: "Daffodil International University",
    email: "sarah.jenkins@diu.edu.bd",
    phone: "+880 2 9138234 (Ext: 102)",
    mobile: "+880 1819-345678",
    officeLocation: "Faculty Room 512, Clinical Sciences Wing",
    consultationHours: "Tue & Thu 2:00 PM - 4:30 PM",
    orcid: "0000-0003-8821-4409",
    board: "Biomedical & Clinical IRB",
    role: "Vice Chair",
    clearanceLevel: "Full Voting Quorum",
    status: "Active",
    specializations: ["Pediatric Research", "Vulnerable Populations", "Community & Participatory Research"],
    assignedProtocols: 6,
    accreditationDate: "Feb 15, 2025",
    digitalSealHash: "3f2504e0a7b5c871239c8a149afbf4c8996fb92427ae41e4649b934ca495991b",
    bioStatement:
      "Specialized in pediatric drug trials assent guidelines, vulnerable human subjects protection, and refugee community field health research.",
    avatarUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "REV-DIU-003",
    name: "Prof. Tariqul Islam",
    degree: "PhD in Computational Bioethics",
    position: "Affiliate Professor of Computer Science",
    department: "Computer Science & Artificial Intelligence",
    institution: "Bangladesh University of Engineering & Technology",
    email: "tariqul.islam@buet.ac.bd",
    phone: "+880 1819-987654",
    orcid: "0000-0001-7734-9021",
    board: "AI & Technology Ethics Panel",
    role: "Specialist Advisor",
    clearanceLevel: "Specialist Advisor",
    status: "Inactive",
    statusReason: "On academic sabbatical until November 2026",
    specializations: ["AI / Data Science & Technology Ethics", "Genomics & Precision Medicine"],
    assignedProtocols: 0,
    accreditationDate: "May 20, 2025",
    digitalSealHash: "1b4f0e985197199f8a5204e14f9c948b0d14f752943e305760ee6f1b992f6047",
    bioStatement:
      "Expert evaluator for autonomous diagnostic algorithms, patient data re-identification risks, and algorithmic fairness audits.",
  },
]

let cachedReviewers: AccreditedReviewer[] = [...initialAccreditedReviewers]
let isRosterInitialized = false

async function fetchRosterFromApi(): Promise<void> {
  try {
    const data = await reviewerRosterApi.getAll()
    const validation = z.array(reviewerRosterSchema).safeParse(data)
    if (validation.success && validation.data.length > 0) {
      cachedReviewers = validation.data as AccreditedReviewer[]
      notifyRosterListeners()
    }
  } catch {
    // Retain in-memory cache on network error
  }
}

export function getStoredReviewers(): AccreditedReviewer[] {
  if (typeof window !== "undefined" && !isRosterInitialized) {
    isRosterInitialized = true
    void fetchRosterFromApi()
  }
  return cachedReviewers
}

const rosterListeners = new Set<() => void>()

export function subscribeReviewers(callback: () => void): () => void {
  rosterListeners.add(callback)
  if (typeof window !== "undefined" && !isRosterInitialized) {
    isRosterInitialized = true
    void fetchRosterFromApi()
  }

  const handleCustomSync = () => {
    callback()
  }

  if (typeof window !== "undefined") {
    window.addEventListener("ethica:reviewer-roster-updated", handleCustomSync)
  }

  return () => {
    rosterListeners.delete(callback)
    if (typeof window !== "undefined") {
      window.removeEventListener("ethica:reviewer-roster-updated", handleCustomSync)
    }
  }
}

function notifyRosterListeners(): void {
  rosterListeners.forEach((listener) => listener())
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("ethica:reviewer-roster-updated"))
  }
}

export function saveStoredReviewers(reviewers: AccreditedReviewer[]): void {
  cachedReviewers = reviewers
  notifyRosterListeners()
}

function determineBoard(expertise: string[] = []): "Biomedical & Clinical IRB" | "Social & Behavioral IRB" | "AI & Technology Ethics Panel" {
  if (expertise.some((e) => e.includes("AI") || e.includes("Technology") || e.includes("Data Science"))) {
    return "AI & Technology Ethics Panel"
  }
  if (expertise.some((e) => e.includes("Social") || e.includes("Behavioral") || e.includes("Psychiatry") || e.includes("Mental"))) {
    return "Social & Behavioral IRB"
  }
  return "Biomedical & Clinical IRB"
}

export function syncApprovedReviewerToRoster(
  app: SyncApprovedReviewerInput
): AccreditedReviewer {
  const validation = syncApprovedReviewerSchema.safeParse(app)
  const safeApp = validation.success ? validation.data : app
  const current = getStoredReviewers()
  const existingIndex = current.findIndex((r) => r.applicationId === safeApp.id || r.email.toLowerCase() === safeApp.email.toLowerCase())

  const todayStr =
    safeApp.decisionDate ||
    new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    })

  // Generate deterministic digital seal hash based on applicant details
  const rawHash = Array.from(`${safeApp.id}-${safeApp.email}-${todayStr}`)
    .reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) >>> 0, 0x12345678)
    .toString(16)
    .padStart(8, "0")
  const sealHash = `${rawHash}b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852${rawHash}`

  const reviewerEntry: AccreditedReviewer = {
    id: safeApp.id,
    applicationId: safeApp.id,
    name: safeApp.fullName,
    degree: safeApp.degree,
    position: safeApp.position,
    department: safeApp.department,
    institution: safeApp.institution,
    email: safeApp.email,
    phone: safeApp.phone,
    orcid: safeApp.orcid,
    board: determineBoard(safeApp.expertise),
    role: "Voting Member",
    clearanceLevel: "Full Voting Quorum",
    status: "Active",
    specializations: safeApp.expertise,
    assignedProtocols: existingIndex >= 0 ? current[existingIndex].assignedProtocols : 0,
    accreditationDate: todayStr,
    digitalSealHash: sealHash,
    bioStatement: safeApp.statement,
  }

  let updated: AccreditedReviewer[]
  if (existingIndex >= 0) {
    updated = [...current]
    updated[existingIndex] = {
      ...updated[existingIndex],
      ...reviewerEntry,
      status: "Active", // Re-activating or updating
    }
  } else {
    // Add to the top of the roster
    updated = [reviewerEntry, ...current]
  }

  saveStoredReviewers(updated)

  // Asynchronously sync to server REST API
  reviewerRosterApi.syncApprovedReviewer(safeApp).catch(() => {
    // Keep local cache
  })

  return reviewerEntry
}

export function updateReviewerStatus(
  id: string,
  status: "Active" | "Inactive",
  reason?: string
): AccreditedReviewer[] {
  const statusValidation = z.enum(["Active", "Inactive"]).safeParse(status)
  const safeStatus = statusValidation.success ? statusValidation.data : "Active"
  const current = getStoredReviewers()
  const updated = current.map((r) => {
    if (r.id === id) {
      return {
        ...r,
        status: safeStatus,
        statusReason: reason ?? (safeStatus === "Inactive" ? "Account suspended by Secretariat" : undefined),
      }
    }
    return r
  })
  saveStoredReviewers(updated)

  // Asynchronously sync to server REST API
  reviewerRosterApi.updateStatus(id, safeStatus, reason).catch(() => {
    // Keep local cache
  })

  return updated
}

export function getReviewerById(id: string): AccreditedReviewer | undefined {
  const current = getStoredReviewers()
  return current.find((r) => r.id === id || r.applicationId === id)
}

const ACTIVE_REVIEWER_STORAGE_KEY = "ethica_active_reviewer_email"

export function getActiveReviewerEmail(): string {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(ACTIVE_REVIEWER_STORAGE_KEY)
    if (stored) return stored
  }
  return "charles.montgomery@diu.edu.bd"
}

export function setActiveReviewerEmail(email: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(ACTIVE_REVIEWER_STORAGE_KEY, email)
    window.dispatchEvent(new CustomEvent("ethica:active-reviewer-changed", { detail: { email } }))
  }
}

export function getActiveReviewer(): AccreditedReviewer {
  const email = getActiveReviewerEmail()
  const reviewers = getStoredReviewers()
  return (
    reviewers.find((r) => r.email.toLowerCase() === email.toLowerCase()) ||
    reviewers.find((r) => r.id === "REV-DIU-001") ||
    reviewers[0]
  )
}

export function updateReviewerProfile(
  id: string,
  updates: Partial<AccreditedReviewer>
): AccreditedReviewer | null {
  const current = getStoredReviewers()
  const index = current.findIndex((r) => r.id === id || r.applicationId === id)
  if (index === -1) return null

  const updatedReviewer: AccreditedReviewer = {
    ...current[index],
    ...updates,
  }
  current[index] = updatedReviewer
  saveStoredReviewers(current)
  return updatedReviewer
}


