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

const ROSTER_STORAGE_KEY = "ethica_accredited_reviewers"

let cachedReviewers: AccreditedReviewer[] | null = null
let lastRawRosterString: string | null = null

export function getStoredReviewers(): AccreditedReviewer[] {
  if (typeof window === "undefined") return initialAccreditedReviewers
  try {
    const raw = localStorage.getItem(ROSTER_STORAGE_KEY)
    if (!raw) {
      if (!cachedReviewers) {
        localStorage.setItem(ROSTER_STORAGE_KEY, JSON.stringify(initialAccreditedReviewers))
        cachedReviewers = initialAccreditedReviewers
        lastRawRosterString = JSON.stringify(initialAccreditedReviewers)
      }
      return cachedReviewers
    }
    if (raw === lastRawRosterString && cachedReviewers !== null) {
      return cachedReviewers
    }
    lastRawRosterString = raw
    const parsed = JSON.parse(raw) as AccreditedReviewer[]
    cachedReviewers = Array.isArray(parsed) && parsed.length > 0 ? parsed : initialAccreditedReviewers
    return cachedReviewers
  } catch {
    return initialAccreditedReviewers
  }
}

const rosterListeners = new Set<() => void>()

export function subscribeReviewers(callback: () => void): () => void {
  rosterListeners.add(callback)
  const onStorage = (e: StorageEvent) => {
    if (e.key === ROSTER_STORAGE_KEY) {
      lastRawRosterString = null
      callback()
    }
  }
  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStorage)
  }
  return () => {
    rosterListeners.delete(callback)
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage)
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
  if (typeof window === "undefined") return
  try {
    const serialized = JSON.stringify(reviewers)
    lastRawRosterString = serialized
    cachedReviewers = reviewers
    localStorage.setItem(ROSTER_STORAGE_KEY, serialized)
    notifyRosterListeners()
  } catch {
    // Ignore quota errors
  }
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

export function syncApprovedReviewerToRoster(app: {
  id: string
  fullName: string
  email: string
  phone: string
  institution: string
  department: string
  position: string
  degree: string
  orcid?: string
  expertise: string[]
  statement?: string
  decisionDate?: string
}): AccreditedReviewer {
  const current = getStoredReviewers()
  const existingIndex = current.findIndex((r) => r.applicationId === app.id || r.email.toLowerCase() === app.email.toLowerCase())

  const todayStr =
    app.decisionDate ||
    new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    })

  // Generate deterministic digital seal hash based on applicant details
  const rawHash = Array.from(`${app.id}-${app.email}-${todayStr}`)
    .reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) >>> 0, 0x12345678)
    .toString(16)
    .padStart(8, "0")
  const sealHash = `${rawHash}b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852${rawHash}`

  const reviewerEntry: AccreditedReviewer = {
    id: app.id,
    applicationId: app.id,
    name: app.fullName,
    degree: app.degree,
    position: app.position,
    department: app.department,
    institution: app.institution,
    email: app.email,
    phone: app.phone,
    orcid: app.orcid,
    board: determineBoard(app.expertise),
    role: "Voting Member",
    clearanceLevel: "Full Voting Quorum",
    status: "Active",
    specializations: app.expertise,
    assignedProtocols: existingIndex >= 0 ? current[existingIndex].assignedProtocols : 0,
    accreditationDate: todayStr,
    digitalSealHash: sealHash,
    bioStatement: app.statement,
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
  return reviewerEntry
}

export function updateReviewerStatus(
  id: string,
  status: "Active" | "Inactive",
  reason?: string
): AccreditedReviewer[] {
  const current = getStoredReviewers()
  const updated = current.map((r) => {
    if (r.id === id) {
      return {
        ...r,
        status,
        statusReason: reason ?? (status === "Inactive" ? "Account suspended by Secretariat" : undefined),
      }
    }
    return r
  })
  saveStoredReviewers(updated)
  return updated
}
