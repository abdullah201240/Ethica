import { syncApprovedReviewerToRoster, updateReviewerStatus } from "@/lib/reviewer-roster"
import { z } from "zod"
import {
  reviewerApplicationSchema,
  createReviewerApplicationInputSchema,
  type CreateReviewerApplicationInput,
} from "@/lib/schemas"
import { reviewerApplicationsApi } from "@/lib/api/reviewer-applications.api"

export interface ReviewerApplication {
  id: string
  fullName: string
  email: string
  phone: string
  institution: string
  department: string
  position: string
  degree: string
  yearsExperience: number
  orcid: string
  expertise: string[]
  statement: string
  cvFileName: string
  status: "Pending Verification" | "Approved" | "Rejected"
  submittedAt: string
  decisionNotes?: string
  decisionDate?: string
}

export const initialReviewerApplications: ReviewerApplication[] = [
  {
    id: "REV-2026-081",
    fullName: "Dr. Kazi Tanvir Ahmed",
    email: "kazi.tanvir@bsmmu.edu.bd",
    phone: "+880 1711-234567",
    institution: "Bangabandhu Sheikh Mujib Medical University",
    department: "Clinical Pharmacology & Therapeutics",
    position: "Associate Professor",
    degree: "MBBS, MD (Pharmacology), PhD",
    yearsExperience: 12,
    orcid: "0000-0002-1825-0097",
    expertise: ["Biomedical & Clinical Research", "Public Health & Epidemiology"],
    statement:
      "Having led over 20 phase II/III randomized clinical drug trials, I wish to contribute my regulatory pharmacovigilance expertise to the institutional ethics board to accelerate ethical clinical research compliance.",
    cvFileName: "Kazi_Tanvir_CV_2026.pdf",
    status: "Pending Verification",
    submittedAt: "Sep 04, 2026",
  },
  {
    id: "REV-2026-080",
    fullName: "Prof. Sumaiya Farhana",
    email: "s.farhana@du.ac.bd",
    phone: "+880 1819-345678",
    institution: "University of Dhaka",
    department: "Computer Science & Engineering",
    position: "Professor & Chair of AI Systems Lab",
    degree: "B.Sc., M.Sc. (DU), PhD (NUS)",
    yearsExperience: 15,
    orcid: "0000-0003-4921-7712",
    expertise: ["AI / Data Science & Technology Ethics", "Social & Behavioral Sciences"],
    statement:
      "With the explosion of automated healthcare diagnostic models and LLM-assisted clinical tools, rigorous computational ethics, algorithmic fairness, and patient privacy audits are indispensable.",
    cvFileName: "Prof_Sumaiya_Bioethics_CV.pdf",
    status: "Pending Verification",
    submittedAt: "Sep 03, 2026",
  },
  {
    id: "REV-2026-079",
    fullName: "Dr. Farzana Choudhury",
    email: "farzana.choudhury@icddrb.org",
    phone: "+880 1712-456789",
    institution: "icddr,b (International Centre for Diarrhoeal Disease Research)",
    department: "Infectious Diseases & Maternal Health",
    position: "Senior Research Scientist",
    degree: "MBBS, MPH (Harvard), PhD (Johns Hopkins)",
    yearsExperience: 18,
    orcid: "0000-0001-9032-6124",
    expertise: ["Public Health & Epidemiology", "Pediatric Research", "Community & Participatory Research"],
    statement:
      "Dedicated to upholding the Declaration of Helsinki and CIOMS guidelines in vulnerable population field trials across South Asia. Excited to support the DIU Institutional Ethics Committee.",
    cvFileName: "Farzana_Choudhury_Dossier.pdf",
    status: "Approved",
    submittedAt: "Aug 29, 2026",
    decisionNotes: "Exemplary global health credentials; appointed to Biomedical & Maternal Sub-Committee.",
    decisionDate: "Sep 01, 2026",
  },
  {
    id: "REV-2026-078",
    fullName: "Dr. Rezwanul Huq",
    email: "rezwan.huq@bids.org.bd",
    phone: "+880 1914-567890",
    institution: "Bangladesh Institute of Development Studies",
    department: "Behavioral Economics & Health Policy",
    position: "Research Fellow",
    degree: "B.S.S., M.S.S. (Economics), PhD (LSE)",
    yearsExperience: 9,
    orcid: "0000-0002-7718-4433",
    expertise: ["Social & Behavioral Sciences", "Community & Participatory Research"],
    statement:
      "Specialized in behavioral survey methodologies, deception ethics, and randomized community interventions with human subjects.",
    cvFileName: "Rezwanul_Huq_CV.pdf",
    status: "Pending Verification",
    submittedAt: "Sep 02, 2026",
  },
  {
    id: "REV-2026-077",
    fullName: "Dr. Sabrina Akhter",
    email: "sabrina.akhter@dmc.gov.bd",
    phone: "+880 1611-678901",
    institution: "Dhaka Medical College & Hospital",
    department: "Pediatrics & Neonatology",
    position: "Assistant Professor",
    degree: "MBBS, FCPS (Pediatrics), MD",
    yearsExperience: 8,
    orcid: "0000-0003-1109-8834",
    expertise: ["Pediatric Research", "Biomedical & Clinical Research"],
    statement:
      "My clinical focus is on neonatal intensive care and pediatric clinical trials. I bring deep experience in pediatric assent protocols and parental consent safeguards.",
    cvFileName: "Dr_Sabrina_Pediatric_CV.pdf",
    status: "Approved",
    submittedAt: "Aug 25, 2026",
    decisionNotes: "Board quorum approved; designated pediatric risk specialist.",
    decisionDate: "Aug 28, 2026",
  },
  {
    id: "REV-2026-076",
    fullName: "Arifur Rahman, M.Sc.",
    email: "arif.rahman.independent@gmail.com",
    phone: "+880 1715-789012",
    institution: "Independent Consultant",
    department: "Commercial Marketing Surveys",
    position: "Senior Market Research Analyst",
    degree: "BBA, MBA",
    yearsExperience: 3,
    orcid: "0000-0001-0000-0000",
    expertise: ["Social & Behavioral Sciences"],
    statement:
      "I conduct corporate consumer satisfaction surveys and wish to gain ethics committee credentials.",
    cvFileName: "Arif_Resume.pdf",
    status: "Rejected",
    submittedAt: "Aug 19, 2026",
    decisionNotes: "Applicant does not meet minimum academic research or institutional faculty requirements.",
    decisionDate: "Aug 22, 2026",
  },
  {
    id: "REV-2026-075",
    fullName: "Dr. Nadia Islam",
    email: "nadia.islam@nib.gov.bd",
    phone: "+880 1817-890123",
    institution: "National Institute of Biotechnology",
    department: "Genomics & Molecular Medicine",
    position: "Principal Scientific Officer",
    degree: "B.Sc. (Biotech), M.Sc., PhD (Heidelberg)",
    yearsExperience: 14,
    orcid: "0000-0002-8834-5519",
    expertise: ["Genomics & Precision Medicine", "Biomedical & Clinical Research"],
    statement:
      "Specialist in human genomic data sovereignty, biological material transfer agreements (MTAs), and incidental genetic finding disclosure policies.",
    cvFileName: "Nadia_Islam_Genomics_CV.pdf",
    status: "Pending Verification",
    submittedAt: "Sep 01, 2026",
  },
  {
    id: "REV-2026-074",
    fullName: "Dr. Mahmudul Hasan",
    email: "m.hasan@nimh.gov.bd",
    phone: "+880 1718-901234",
    institution: "National Institute of Mental Health",
    department: "Psychiatry & Behavioral Health",
    position: "Associate Professor of Psychiatry",
    degree: "MBBS, FCPS (Psychiatry), M.Phil",
    yearsExperience: 11,
    orcid: "0000-0001-6543-9876",
    expertise: ["Mental Health & Psychiatry", "Social & Behavioral Sciences"],
    statement:
      "Expertise in psychiatric capacity assessment, consent competence in severe mood disorders, and ethical triage in suicide prevention studies.",
    cvFileName: "Mahmudul_Hasan_Psychiatry.pdf",
    status: "Approved",
    submittedAt: "Aug 15, 2026",
    decisionNotes: "Appointed to Social, Behavioral & Mental Health IRB Panel.",
    decisionDate: "Aug 18, 2026",
  },
]

let cachedApplications: ReviewerApplication[] = [...initialReviewerApplications]
let isAppsInitialized = false

async function fetchApplicationsFromApi(): Promise<void> {
  try {
    const data = await reviewerApplicationsApi.getAll()
    const validation = z.array(reviewerApplicationSchema).safeParse(data)
    if (validation.success && validation.data.length > 0) {
      cachedApplications = validation.data as ReviewerApplication[]
      notifyListeners()
    }
  } catch {
    // Retain local in-memory cache
  }
}

export function getStoredApplications(): ReviewerApplication[] {
  if (typeof window !== "undefined" && !isAppsInitialized) {
    isAppsInitialized = true
    void fetchApplicationsFromApi()
  }
  return cachedApplications
}

const listeners = new Set<() => void>()

export function subscribeApplications(callback: () => void): () => void {
  listeners.add(callback)
  if (typeof window !== "undefined" && !isAppsInitialized) {
    isAppsInitialized = true
    void fetchApplicationsFromApi()
  }

  const handleCustomSync = () => {
    callback()
  }

  if (typeof window !== "undefined") {
    window.addEventListener("ethica:reviewer-applications-updated", handleCustomSync)
  }

  return () => {
    listeners.delete(callback)
    if (typeof window !== "undefined") {
      window.removeEventListener("ethica:reviewer-applications-updated", handleCustomSync)
    }
  }
}

function notifyListeners(): void {
  listeners.forEach((listener) => listener())
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("ethica:reviewer-applications-updated"))
  }
}

export function getReviewerApplicationById(id: string): ReviewerApplication | undefined {
  const all = getStoredApplications()
  return all.find((a) => a.id === id)
}

export function saveStoredApplications(apps: ReviewerApplication[]): void {
  cachedApplications = apps
  notifyListeners()
}

export function addReviewerApplication(
  newApp: CreateReviewerApplicationInput
): ReviewerApplication {
  const validated = createReviewerApplicationInputSchema.parse(newApp)
  const current = getStoredApplications()
  const dateStr = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })
  const nextNum = current.length + 82
  const created: ReviewerApplication = {
    ...validated,
    id: `REV-2026-${String(nextNum).padStart(3, "0")}`,
    status: "Pending Verification",
    submittedAt: dateStr,
  }

  cachedApplications = [created, ...current]
  notifyListeners()

  // Asynchronously persist to server REST API
  reviewerApplicationsApi.create(newApp).catch(() => {
    // Retain optimistic cache
  })

  return created
}

export function updateReviewerApplicationStatus(
  id: string,
  status: "Approved" | "Rejected",
  notes?: string
): ReviewerApplication[] {
  const current = getStoredApplications()
  const dateStr = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })

  let targetApp: ReviewerApplication | undefined

  const updated = current.map((app) => {
    if (app.id === id) {
      targetApp = {
        ...app,
        status,
        decisionNotes: notes ?? (status === "Approved" ? "Credentials approved by Institutional Ethics Secretariat." : "Application declined by Secretariat."),
        decisionDate: dateStr,
      }
      return targetApp
    }
    return app
  })

  saveStoredApplications(updated)

  // Asynchronously persist to server REST API
  reviewerApplicationsApi.updateStatus(id, status, notes).catch(() => {
    // Retain optimistic cache
  })

  // Automatically synchronize accredited reviewer roster
  if (status === "Approved" && targetApp) {
    syncApprovedReviewerToRoster({
      id: targetApp.id,
      fullName: targetApp.fullName,
      email: targetApp.email,
      phone: targetApp.phone,
      institution: targetApp.institution,
      department: targetApp.department,
      position: targetApp.position,
      degree: targetApp.degree,
      orcid: targetApp.orcid,
      expertise: targetApp.expertise,
      statement: targetApp.statement,
      decisionDate: dateStr,
    })
  } else if (status === "Rejected") {
    updateReviewerStatus(id, "Inactive", "Accreditation rejected or revoked by Secretariat")
  }

  return updated
}
