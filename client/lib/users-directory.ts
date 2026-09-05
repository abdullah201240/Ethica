import { z } from "zod"
import {
  platformUserSchema,
  createPlatformUserSchema,
  type CreatePlatformUserInput,
} from "@/lib/schemas"
import { usersDirectoryApi } from "@/lib/api/users-directory.api"

export type UserPillar = "Investigator" | "Reviewer" | "Administrator"

export type UserAccountStatus = "Active" | "Inactive" | "Suspended" | "Pending Verification"
export type UserStatus = UserAccountStatus

export type UserVerificationStatus =
  | "Verified Institutional ID"
  | "SSO Authenticated"
  | "Pending Document Review"

export interface PlatformUser {
  id: string
  name: string
  email: string
  phone?: string
  pillar: UserPillar
  role: string
  department: string
  institution: string
  status: UserAccountStatus
  verificationStatus: UserVerificationStatus
  protocolsCount: number
  joinedAt: string
  lastLogin: string
  bio?: string
  avatar?: string
}

export const initialPlatformUsers: PlatformUser[] = [
  {
    id: "USR-ADM-001",
    name: "Dr. Marcus Vance",
    email: "admin.secretariat@diu.edu.bd",
    phone: "+880 1713-000001",
    pillar: "Administrator",
    role: "Director of Research Governance & Compliance",
    department: "Research Compliance Secretariat",
    institution: "Daffodil International University",
    status: "Active",
    verificationStatus: "Verified Institutional ID",
    protocolsCount: 42,
    joinedAt: "Jan 12, 2026",
    lastLogin: "Active now",
    bio: "Chief research ethics compliance lead supervising IRB board charters and FIPS 140-3 cryptographic clearance tokens.",
  },
  {
    id: "USR-INV-002",
    name: "Dr. Elena Rostova",
    email: "elena.rostova@diu.edu.bd",
    phone: "+880 1711-223344",
    pillar: "Investigator",
    role: "Principal Investigator & Associate Professor",
    department: "Public Health & Clinical Epidemiology",
    institution: "Daffodil International University",
    status: "Active",
    verificationStatus: "Verified Institutional ID",
    protocolsCount: 6,
    joinedAt: "Jan 18, 2026",
    lastLogin: "Today 10:15 AM",
    bio: "Lead researcher on South Asian pediatric maternal interventions and community clinical epidemiology field trials.",
  },
  {
    id: "USR-REV-003",
    name: "Dr. Farzana Choudhury",
    email: "farzana.choudhury@icddrb.org",
    phone: "+880 1712-456789",
    pillar: "Reviewer",
    role: "Senior Voting Reviewer (Biomedical IRB)",
    department: "Infectious Diseases & Maternal Health",
    institution: "icddr,b (International Centre for Diarrhoeal Disease Research)",
    status: "Active",
    verificationStatus: "Verified Institutional ID",
    protocolsCount: 4,
    joinedAt: "Sep 01, 2026",
    lastLogin: "Yesterday 03:40 PM",
    bio: "Accredited peer reviewer specializing in pediatric clinical trials, vulnerable cohort consent, and infectious epidemiology.",
  },
  {
    id: "USR-REV-004",
    name: "Prof. Charles Montgomery",
    email: "charles.montgomery@diu.edu.bd",
    phone: "+880 2 9138234 (Ext: 101)",
    pillar: "Reviewer",
    role: "IRB Committee Chair & Professor of Bioethics",
    department: "Biomedical Research Ethics Board",
    institution: "Daffodil International University",
    status: "Active",
    verificationStatus: "Verified Institutional ID",
    protocolsCount: 18,
    joinedAt: "Feb 18, 2026",
    lastLogin: "Active now",
    bio: "Chair of the Biomedical Ethics Review Board. Oversees quorum voting thresholds and clinical trial protocol evaluations.",
  },
  {
    id: "USR-ADM-005",
    name: "Engr. Kazi Zahidul Hassan",
    email: "zahidul.it@diu.edu.bd",
    phone: "+880 1713-000002",
    pillar: "Administrator",
    role: "Principal Infrastructure & System Administrator",
    department: "Directorate of IT & Cloud Systems",
    institution: "Daffodil International University",
    status: "Active",
    verificationStatus: "SSO Authenticated",
    protocolsCount: 156,
    joinedAt: "Jan 15, 2026",
    lastLogin: "18 mins ago",
    bio: "Technical lead managing Ethica secure HSM key vaults, database clustering, and high-security institutional authentication.",
  },
  {
    id: "USR-REV-006",
    name: "Dr. Sabrina Akhter",
    email: "sabrina.akhter@dmc.gov.bd",
    phone: "+880 1611-678901",
    pillar: "Reviewer",
    role: "Assistant Professor & Voting Reviewer",
    department: "Pediatrics & Neonatology",
    institution: "Dhaka Medical College & Hospital",
    status: "Active",
    verificationStatus: "Verified Institutional ID",
    protocolsCount: 2,
    joinedAt: "Aug 28, 2026",
    lastLogin: "2 days ago",
    bio: "Hospital ethics board liaison with clinical focus on neonatal intensive care and assent protocols for pediatric minors.",
  },
  {
    id: "USR-INV-007",
    name: "Dr. Ayesha Rahman",
    email: "ayesha.rahman@diu.edu.bd",
    phone: "+880 1714-556677",
    pillar: "Investigator",
    role: "Co-Investigator & Assistant Professor",
    department: "Pediatrics & Behavioral Health",
    institution: "Daffodil International University",
    status: "Active",
    verificationStatus: "Verified Institutional ID",
    protocolsCount: 3,
    joinedAt: "Feb 02, 2026",
    lastLogin: "3 hours ago",
    bio: "Behavioral health specialist conducting observational studies on adolescent neurodevelopment and digital screen time.",
  },
  {
    id: "USR-ADM-008",
    name: "Nusrat Jahan, M.Sc.",
    email: "nusrat.jahan@diu.edu.bd",
    phone: "+880 1713-000003",
    pillar: "Administrator",
    role: "Secretariat Protocol Triage Administrator",
    department: "Research Compliance Secretariat",
    institution: "Daffodil International University",
    status: "Active",
    verificationStatus: "Verified Institutional ID",
    protocolsCount: 38,
    joinedAt: "Feb 01, 2026",
    lastLogin: "1 hour ago",
    bio: "Initial triage administrator screening protocols for exemption qualifications, minimal risk triage, and board assignment.",
  },
  {
    id: "USR-INV-009",
    name: "Kabir Hossain, M.Phil",
    email: "kabir.hossain@diu.edu.bd",
    phone: "+880 1819-334455",
    pillar: "Investigator",
    role: "Doctoral Research Scholar",
    department: "Computer Science & Artificial Intelligence",
    institution: "Daffodil International University",
    status: "Active",
    verificationStatus: "SSO Authenticated",
    protocolsCount: 2,
    joinedAt: "Feb 10, 2026",
    lastLogin: "Yesterday 07:20 PM",
    bio: "Doctoral candidate researching algorithmic bias and patient privacy in machine-learning-assisted radiological diagnostics.",
  },
  {
    id: "USR-REV-010",
    name: "Dr. Mahmudul Hasan",
    email: "m.hasan@nimh.gov.bd",
    phone: "+880 1718-901234",
    pillar: "Reviewer",
    role: "Associate Professor of Psychiatry & Voting Member",
    department: "Psychiatry & Behavioral Health",
    institution: "National Institute of Mental Health",
    status: "Active",
    verificationStatus: "Verified Institutional ID",
    protocolsCount: 3,
    joinedAt: "Aug 18, 2026",
    lastLogin: "4 days ago",
    bio: "Specialist evaluator in psychological assessment, consent competence, and high-risk mental health clinical trials.",
  },
  {
    id: "USR-ADM-011",
    name: "Farhana Yasmin, CISSP",
    email: "farhana.security@diu.edu.bd",
    phone: "+880 1713-000004",
    pillar: "Administrator",
    role: "Cryptographic Auditing & Security Lead",
    department: "Cybersecurity Operations Center",
    institution: "Daffodil International University",
    status: "Active",
    verificationStatus: "SSO Authenticated",
    protocolsCount: 89,
    joinedAt: "Feb 10, 2026",
    lastLogin: "3 hours ago",
    bio: "Information security lead overseeing SHA-256 tamper-proof ledger trails and institutional cryptographic key ceremonies.",
  },
  {
    id: "USR-INV-012",
    name: "Sadia Afrin, B.Sc.",
    email: "sadia.afrin@diu.edu.bd",
    phone: "+880 1912-778899",
    pillar: "Investigator",
    role: "Graduate Research Assistant",
    department: "Nutrition & Food Engineering",
    institution: "Daffodil International University",
    status: "Pending Verification",
    verificationStatus: "Pending Document Review",
    protocolsCount: 1,
    joinedAt: "Aug 30, 2026",
    lastLogin: "Aug 30, 2026",
    bio: "Student investigator awaiting supervisor endorsement for community nutritional assessment survey protocol.",
  },
  {
    id: "USR-ADM-013",
    name: "Syed Mahmudur Rahman",
    email: "mahmudur.sys@diu.edu.bd",
    phone: "+880 1713-000007",
    pillar: "Administrator",
    role: "Auxiliary System & Backup Administrator",
    department: "Data & Systems Recovery Unit",
    institution: "Daffodil International University",
    status: "Inactive",
    verificationStatus: "SSO Authenticated",
    protocolsCount: 0,
    joinedAt: "Mar 15, 2026",
    lastLogin: "2 weeks ago",
    bio: "Backup systems administrator on temporary departmental leave.",
  },
  {
    id: "USR-INV-014",
    name: "Prof. Rafiqul Islam, Ph.D.",
    email: "rafiqul.env@diu.edu.bd",
    phone: "+880 1711-889900",
    pillar: "Investigator",
    role: "Senior Research Fellow",
    department: "Environmental Sciences & Disaster Management",
    institution: "Daffodil International University",
    status: "Suspended",
    verificationStatus: "Verified Institutional ID",
    protocolsCount: 4,
    joinedAt: "Jan 22, 2026",
    lastLogin: "Jul 15, 2026",
    bio: "Senior investigator with active protocols temporarily suspended pending annual institutional renewal documentation.",
  },
]

let cachedUsers: PlatformUser[] = [...initialPlatformUsers]
let isUsersInitialized = false

async function fetchUsersFromApi(): Promise<void> {
  try {
    const data = await usersDirectoryApi.getAll()
    const validation = z.array(platformUserSchema).safeParse(data)
    if (validation.success && validation.data.length > 0) {
      cachedUsers = validation.data as PlatformUser[]
      notifyListeners()
    }
  } catch {
    // Retain in-memory cache on network error
  }
}

export function getStoredUsers(): PlatformUser[] {
  if (typeof window !== "undefined" && !isUsersInitialized) {
    isUsersInitialized = true
    void fetchUsersFromApi()
  }
  return cachedUsers
}

const listeners = new Set<() => void>()

export function subscribeUsers(callback: () => void): () => void {
  listeners.add(callback)
  if (typeof window !== "undefined" && !isUsersInitialized) {
    isUsersInitialized = true
    void fetchUsersFromApi()
  }

  const handleCustomSync = () => {
    callback()
  }

  if (typeof window !== "undefined") {
    window.addEventListener("ethica:users-directory-updated", handleCustomSync)
  }

  return () => {
    listeners.delete(callback)
    if (typeof window !== "undefined") {
      window.removeEventListener("ethica:users-directory-updated", handleCustomSync)
    }
  }
}

function notifyListeners(): void {
  listeners.forEach((listener) => listener())
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("ethica:users-directory-updated"))
  }
}

export function saveStoredUsers(users: PlatformUser[]): void {
  cachedUsers = users
  notifyListeners()
}

export function addUser(data: CreatePlatformUserInput): PlatformUser {
  const validated = createPlatformUserSchema.safeParse(data)
  const safeData = validated.success ? validated.data : data
  const current = getStoredUsers()
  const pillarPrefix =
    safeData.pillar === "Investigator" ? "INV" : safeData.pillar === "Reviewer" ? "REV" : "ADM"
  const randomSuffix = Math.floor(100 + Math.random() * 900)
  const newUser: PlatformUser = {
    id: `USR-${pillarPrefix}-${randomSuffix}`,
    name: safeData.name.trim(),
    email: safeData.email.trim(),
    phone: safeData.phone?.trim() || "+880 1713-000000",
    pillar: safeData.pillar as UserPillar,
    role: safeData.role.trim() || `${safeData.pillar} Member`,
    department: safeData.department.trim() || "Institutional Research Directorate",
    institution: safeData.institution?.trim() || "Daffodil International University",
    status: safeData.status || "Active",
    verificationStatus: safeData.verificationStatus || "Verified Institutional ID",
    protocolsCount: typeof safeData.protocolsCount === "number" ? safeData.protocolsCount : Number(safeData.protocolsCount) || 0,
    joinedAt: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }),
    lastLogin: "Invited today",
    bio: safeData.bio?.trim() || `Registered ${safeData.pillar} account within the Ethica governance platform.`,
  }

  cachedUsers = [newUser, ...current]
  notifyListeners()

  // Asynchronously persist to server REST API
  usersDirectoryApi.create(safeData).catch(() => {
    // Retain optimistic cache
  })

  return newUser
}

export function updateUser(
  id: string,
  updates: Partial<Omit<PlatformUser, "id">>
): PlatformUser | undefined {
  const current = getStoredUsers()
  let updatedUser: PlatformUser | undefined
  const updatedList = current.map((user) => {
    if (user.id === id) {
      updatedUser = { ...user, ...updates }
      return updatedUser
    }
    return user
  })

  if (updatedUser) {
    cachedUsers = updatedList
    notifyListeners()

    // Asynchronously persist to server REST API
    usersDirectoryApi.update(id, updates).catch(() => {
      // Retain optimistic cache
    })
  }

  return updatedUser
}

export function deleteUser(id: string): boolean {
  const current = getStoredUsers()
  cachedUsers = current.filter((u) => u.id !== id)
  notifyListeners()
  usersDirectoryApi.delete(id).catch(() => {
    // Retain optimistic cache
  })
  return true
}

export function updateUserStatus(
  id: string,
  status: UserAccountStatus
): PlatformUser | undefined {
  return updateUser(id, {
    status,
    lastLogin: status === "Active" ? "Restored just now" : `Status changed to ${status}`,
  })
}

export function getUserById(id: string): PlatformUser | undefined {
  const current = getStoredUsers()
  return current.find((u) => u.id === id)
}
