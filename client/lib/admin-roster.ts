import { z } from "zod"
import { adminMemberSchema, createAdminMemberSchema, type CreateAdminMemberInput } from "@/lib/schemas"
import { adminMembersApi } from "@/lib/api/admin-members.api"

export type AdminAccessLevel =
  | "Super Admin"
  | "System Admin"
  | "Governance Admin"
  | "Security & Audit"
  | "Operations Admin"

export interface AdminMember {
  id: string
  name: string
  role: string
  accessLevel: AdminAccessLevel
  department: string
  status: "Active" | "Inactive"
  protocols: number
  email: string
  phone?: string
  lastActive: string
  addedAt: string
  permissions: string[]
}

export const initialAdminMembers: AdminMember[] = [
  {
    id: "ADM-2026-001",
    name: "Dr. Marcus Vance",
    role: "Director of Research Governance & Compliance",
    accessLevel: "Super Admin",
    department: "Research Compliance Secretariat",
    status: "Active",
    protocols: 42,
    email: "admin.secretariat@diu.edu.bd",
    phone: "+880 1713-000001",
    lastActive: "Active now",
    addedAt: "Jan 12, 2026",
    permissions: [
      "Root Governance Authority",
      "Committee Accreditation Signoff",
      "Policy Rule Overrides",
      "Audit Log Decryption",
    ],
  },
  {
    id: "ADM-2026-002",
    name: "Engr. Kazi Zahidul Hassan",
    role: "Principal Infrastructure & System Administrator",
    accessLevel: "System Admin",
    department: "Directorate of IT & Cloud Systems",
    status: "Active",
    protocols: 156,
    email: "zahidul.it@diu.edu.bd",
    phone: "+880 1713-000002",
    lastActive: "18 mins ago",
    addedAt: "Jan 15, 2026",
    permissions: [
      "Full Server & DB Access",
      "HSM Key Vault Deployment",
      "RBAC & Session Management",
      "Disaster Recovery Controls",
    ],
  },
  {
    id: "ADM-2026-003",
    name: "Nusrat Jahan, M.Sc.",
    role: "Secretariat Protocol Triage Administrator",
    accessLevel: "Governance Admin",
    department: "Research Compliance Secretariat",
    status: "Active",
    protocols: 38,
    email: "nusrat.jahan@diu.edu.bd",
    phone: "+880 1713-000003",
    lastActive: "1 hour ago",
    addedAt: "Feb 01, 2026",
    permissions: [
      "Protocol Intake & Triage",
      "Reviewer Assignment Dispatch",
      "Deliberation Docket Scheduling",
      "Clearance Certificate Generation",
    ],
  },
  {
    id: "ADM-2026-004",
    name: "Farhana Yasmin, CISSP",
    role: "Cryptographic Auditing & Security Lead",
    accessLevel: "Security & Audit",
    department: "Cybersecurity Operations Center",
    status: "Active",
    protocols: 89,
    email: "farhana.security@diu.edu.bd",
    phone: "+880 1713-000004",
    lastActive: "3 hours ago",
    addedAt: "Feb 10, 2026",
    permissions: [
      "SHA-256 Ledger Verification",
      "Cryptographic Key Lifecycle",
      "Hardware Security Module (HSM) Operations",
      "Security Incident Response",
    ],
  },
  {
    id: "ADM-2026-005",
    name: "Barrister Tariqul Islam",
    role: "Institutional Legal & Regulatory Counsel",
    accessLevel: "Operations Admin",
    department: "Legal & Regulatory Affairs",
    status: "Active",
    protocols: 14,
    email: "tariqul.islam@diu.edu.bd",
    phone: "+880 1713-000005",
    lastActive: "Yesterday 04:15 PM",
    addedAt: "Feb 18, 2026",
    permissions: [
      "Regulatory Compliance Verification",
      "Institutional Liability Review",
      "Ethics Board Charter Enforcement",
    ],
  },
  {
    id: "ADM-2026-006",
    name: "Prof. Shamsul Alam",
    role: "IRB Board Operations Administrator",
    accessLevel: "Governance Admin",
    department: "Institutional Review Board Secretariat",
    status: "Active",
    protocols: 27,
    email: "shamsul.governance@diu.edu.bd",
    phone: "+880 1713-000006",
    lastActive: "2 days ago",
    addedAt: "Mar 01, 2026",
    permissions: [
      "Quorum Verification",
      "Deliberation Voting Oversight",
      "Expedited Review Authorizations",
    ],
  },
  {
    id: "ADM-2026-007",
    name: "Syed Mahmudur Rahman",
    role: "Auxiliary System & Backup Administrator",
    accessLevel: "Operations Admin",
    department: "Data & Systems Recovery Unit",
    status: "Inactive",
    protocols: 0,
    email: "mahmudur.sys@diu.edu.bd",
    phone: "+880 1713-000007",
    lastActive: "2 weeks ago",
    addedAt: "Mar 15, 2026",
    permissions: [
      "Cold Storage Snapshots",
      "Database Replication Monitoring",
    ],
  },
]

let cachedMembers: AdminMember[] = [...initialAdminMembers]
let isInitialized = false

async function fetchFromApi(): Promise<void> {
  try {
    const data = await adminMembersApi.getAll()
    const validation = z.array(adminMemberSchema).safeParse(data)
    if (validation.success && validation.data.length > 0) {
      cachedMembers = validation.data as AdminMember[]
      notifyListeners()
    }
  } catch {
    // Retain in-memory cached state on offline / connection issue
  }
}

export function getStoredAdminMembers(): AdminMember[] {
  if (typeof window !== "undefined" && !isInitialized) {
    isInitialized = true
    void fetchFromApi()
  }
  return cachedMembers
}

const listeners = new Set<() => void>()

export function subscribeAdminMembers(callback: () => void): () => void {
  listeners.add(callback)
  if (typeof window !== "undefined" && !isInitialized) {
    isInitialized = true
    void fetchFromApi()
  }

  const handleCustomSync = () => {
    callback()
  }

  if (typeof window !== "undefined") {
    window.addEventListener("ethica:admin-roster-updated", handleCustomSync)
  }

  return () => {
    listeners.delete(callback)
    if (typeof window !== "undefined") {
      window.removeEventListener("ethica:admin-roster-updated", handleCustomSync)
    }
  }
}

function notifyListeners(): void {
  listeners.forEach((listener) => listener())
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("ethica:admin-roster-updated"))
  }
}

export function saveStoredAdminMembers(members: AdminMember[]): void {
  cachedMembers = members
  notifyListeners()
}

export function addAdminMember(data: CreateAdminMemberInput): AdminMember {
  const validated = createAdminMemberSchema.safeParse(data)
  const safeData = validated.success ? validated.data : data
  const current = getStoredAdminMembers()
  const randomSuffix = Math.floor(100 + Math.random() * 900)
  const newMember: AdminMember = {
    id: `ADM-2026-${randomSuffix}`,
    name: safeData.name.trim(),
    email: safeData.email.trim(),
    role: safeData.role.trim() || "System Administrator",
    accessLevel: safeData.accessLevel || "System Admin",
    department: safeData.department.trim() || "Research Governance Secretariat",
    status: safeData.status || "Active",
    protocols: typeof safeData.protocols === "number" ? safeData.protocols : Number(safeData.protocols) || 0,
    phone: safeData.phone?.trim() || "+880 1713-000000",
    lastActive: "Just now",
    addedAt: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }),
    permissions:
      safeData.permissions && safeData.permissions.length > 0
        ? safeData.permissions
        : ["System Administration", "Institutional RBAC Access"],
  }

  cachedMembers = [newMember, ...current]
  notifyListeners()

  // Asynchronously persist to server REST API
  adminMembersApi.create(safeData).catch(() => {
    // Keep local optimistic cache
  })

  return newMember
}

export function updateAdminMember(
  id: string,
  updates: Partial<Omit<AdminMember, "id">>
): AdminMember | undefined {
  const current = getStoredAdminMembers()
  let updatedMember: AdminMember | undefined
  const updatedList = current.map((member) => {
    if (member.id === id) {
      updatedMember = { ...member, ...updates }
      return updatedMember
    }
    return member
  })

  if (updatedMember) {
    cachedMembers = updatedList
    notifyListeners()

    // Asynchronously persist to server REST API
    adminMembersApi.update(id, updates).catch(() => {
      // Retain optimistic state
    })
  }

  return updatedMember
}

export function updateAdminMemberStatus(
  id: string,
  status: "Active" | "Inactive"
): AdminMember | undefined {
  return updateAdminMember(id, {
    status,
    lastActive: status === "Active" ? "Restored just now" : "Suspended",
  })
}

export function toggleAdminMemberStatus(id: string): AdminMember | undefined {
  const current = getStoredAdminMembers()
  const target = current.find((m) => m.id === id)
  if (!target) return undefined
  const nextStatus = target.status === "Active" ? "Inactive" : "Active"
  return updateAdminMemberStatus(id, nextStatus)
}

export function deleteAdminMember(id: string): boolean {
  const current = getStoredAdminMembers()
  cachedMembers = current.filter((m) => m.id !== id)
  notifyListeners()
  adminMembersApi.delete(id).catch(() => {
    // Retain optimistic state
  })
  return true
}

export function getAdminMemberById(id: string): AdminMember | undefined {
  const current = getStoredAdminMembers()
  return current.find((m) => m.id === id)
}

