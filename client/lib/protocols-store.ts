export interface Protocol {
  id: string
  title: string
  department: string
  board: string
  status: "Under Committee Review" | "Clearance Granted" | "Revision Requested" | "Expedited Triage"
  statusColor: "amber" | "emerald" | "rose" | "blue"
  risk: "Minimal Risk" | "Exempt - Fast Track" | "Greater Than Minimal"
  riskColor: "blue" | "emerald" | "purple"
  submissionDate: string
  daysInReview: number
  hasCertificate: boolean
  feeAmountBdt?: number
  paymentMethod?: string
  transactionId?: string
  abstract?: string
}

export const initialProtocols: Protocol[] = [
  {
    id: "ETH-2026-089",
    title: "Longitudinal AI-Assisted Clinical Biomarker Analysis in Type 2 Diabetes",
    department: "Public Health & Clinical Epidemiology",
    board: "Biomedical IRB",
    status: "Under Committee Review",
    statusColor: "amber",
    risk: "Minimal Risk",
    riskColor: "blue",
    submissionDate: "Aug 28, 2026",
    daysInReview: 6,
    hasCertificate: false,
    feeAmountBdt: 7500,
    paymentMethod: "bkash",
    transactionId: "9K2M4L7P01",
  },
  {
    id: "ETH-2026-074",
    title: "Cognitive Load and Decision Fatigue in Telemedicine Triage Nurses",
    department: "Behavioral Sciences & Nursing",
    board: "Social & Behavioral Board",
    status: "Clearance Granted",
    statusColor: "emerald",
    risk: "Exempt - Fast Track",
    riskColor: "emerald",
    submissionDate: "Aug 14, 2026",
    daysInReview: 3,
    hasCertificate: true,
    feeAmountBdt: 3500,
    paymentMethod: "nagad",
    transactionId: "NG88219432",
  },
  {
    id: "ETH-2026-061",
    title: "Anonymized Genomic Sequence Sharing Protocol for Regional Oncology Consortium",
    department: "Genomics & Precision Medicine",
    board: "Biomedical IRB",
    status: "Clearance Granted",
    statusColor: "emerald",
    risk: "Greater Than Minimal",
    riskColor: "purple",
    submissionDate: "Jul 19, 2026",
    daysInReview: 11,
    hasCertificate: true,
    feeAmountBdt: 20000,
    paymentMethod: "bank_transfer",
    transactionId: "CHALLAN-DIU-9921",
  },
  {
    id: "ETH-2026-042",
    title: "Digital Privacy and Consent Architecture in IoT Wearable Health Monitors",
    department: "Computer Science & Ethics",
    board: "AI & Data Ethics Board",
    status: "Revision Requested",
    statusColor: "rose",
    risk: "Minimal Risk",
    riskColor: "blue",
    submissionDate: "Jul 05, 2026",
    daysInReview: 14,
    hasCertificate: false,
    feeAmountBdt: 7500,
    paymentMethod: "bkash",
    transactionId: "BK77341902",
  },
  {
    id: "ETH-2026-092",
    title: "Randomized Controlled Trial of Pediatric Cognitive Behavioral Teletherapy",
    department: "Pediatrics & Behavioral Health",
    board: "Biomedical IRB",
    status: "Under Committee Review",
    statusColor: "amber",
    risk: "Greater Than Minimal",
    riskColor: "purple",
    submissionDate: "Sep 01, 2026",
    daysInReview: 4,
    hasCertificate: false,
    feeAmountBdt: 20000,
    paymentMethod: "rocket",
    transactionId: "RC10948291",
  },
  {
    id: "ETH-2026-085",
    title: "Occupational Ergonomics and Musculoskeletal Disorders Among Remote Tech Workers",
    department: "Occupational Health & Ergonomics",
    board: "Social & Behavioral Board",
    status: "Expedited Triage",
    statusColor: "blue",
    risk: "Minimal Risk",
    riskColor: "blue",
    submissionDate: "Aug 22, 2026",
    daysInReview: 5,
    hasCertificate: false,
    feeAmountBdt: 7500,
    paymentMethod: "bkash",
    transactionId: "BK99281726",
  },
  {
    id: "ETH-2026-055",
    title: "Cross-Sectional Investigation into Maternal Nutritional Biomarkers in Rural Cohorts",
    department: "Nutrition & Food Engineering",
    board: "Biomedical IRB",
    status: "Clearance Granted",
    statusColor: "emerald",
    risk: "Minimal Risk",
    riskColor: "blue",
    submissionDate: "Jun 30, 2026",
    daysInReview: 7,
    hasCertificate: true,
    feeAmountBdt: 7500,
    paymentMethod: "bank_transfer",
    transactionId: "CHALLAN-2026-55",
  },
  {
    id: "ETH-2026-038",
    title: "Generative AI Code Assistance and Academic Integrity Perceptions Among Students",
    department: "Software Engineering & Pedagogy",
    board: "AI & Data Ethics Board",
    status: "Clearance Granted",
    statusColor: "emerald",
    risk: "Exempt - Fast Track",
    riskColor: "emerald",
    submissionDate: "May 18, 2026",
    daysInReview: 2,
    hasCertificate: true,
    feeAmountBdt: 3500,
    paymentMethod: "nagad",
    transactionId: "NG48192038",
  },
  {
    id: "ETH-2026-029",
    title: "Microbiome Alterations in Patients Undergoing Early-Stage Chemotherapy",
    department: "Biomedical Engineering & Oncology",
    board: "Biomedical IRB",
    status: "Clearance Granted",
    statusColor: "emerald",
    risk: "Greater Than Minimal",
    riskColor: "purple",
    submissionDate: "Apr 25, 2026",
    daysInReview: 16,
    hasCertificate: true,
    feeAmountBdt: 20000,
    paymentMethod: "card",
    transactionId: "CARD-DIU-029",
  },
  {
    id: "ETH-2026-021",
    title: "Perceived Fairness of Automated Healthcare Resource Allocation Algorithms",
    department: "Public Health Informatics",
    board: "AI & Data Ethics Board",
    status: "Clearance Granted",
    statusColor: "emerald",
    risk: "Minimal Risk",
    riskColor: "blue",
    submissionDate: "Apr 04, 2026",
    daysInReview: 6,
    hasCertificate: true,
    feeAmountBdt: 7500,
    paymentMethod: "bkash",
    transactionId: "BK29183021",
  },
  {
    id: "ETH-2026-015",
    title: "Bioimpedance Sensor Calibration for Non-Invasive Cardiovascular Screening",
    department: "Electrical Engineering & Health Devices",
    board: "Biomedical IRB",
    status: "Clearance Granted",
    statusColor: "emerald",
    risk: "Minimal Risk",
    riskColor: "blue",
    submissionDate: "Mar 12, 2026",
    daysInReview: 8,
    hasCertificate: true,
    feeAmountBdt: 7500,
    paymentMethod: "rocket",
    transactionId: "RC88192015",
  },
  {
    id: "ETH-2026-008",
    title: "Ethical Implications of Autonomous Vehicle Collision Triage Models",
    department: "Robotics & Moral Philosophy",
    board: "AI & Data Ethics Board",
    status: "Clearance Granted",
    statusColor: "emerald",
    risk: "Exempt - Fast Track",
    riskColor: "emerald",
    submissionDate: "Feb 19, 2026",
    daysInReview: 3,
    hasCertificate: true,
    feeAmountBdt: 3500,
    paymentMethod: "bkash",
    transactionId: "BK18293008",
  },
]

let cachedProtocols: Protocol[] = [...initialProtocols]

export function getStoredProtocols(): Protocol[] {
  return cachedProtocols
}

export function saveStoredProtocols(protocols: Protocol[]): void {
  cachedProtocols = protocols
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("ethica:protocols-updated"))
  }
}

export function addProtocol(newProtocol: Omit<Protocol, "id" | "submissionDate" | "daysInReview" | "hasCertificate"> & { id?: string }): Protocol {
  const current = getStoredProtocols()
  const randomSuffix = Math.floor(100 + Math.random() * 900)
  const id = newProtocol.id || `ETH-2026-${randomSuffix}`
  const now = new Date()
  const submissionDate = now.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })

  const protocol: Protocol = {
    ...newProtocol,
    id,
    submissionDate,
    daysInReview: 0,
    hasCertificate: false,
  }

  const updated = [protocol, ...current]
  saveStoredProtocols(updated)
  return protocol
}
