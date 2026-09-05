export interface AdminMember {
  id: string
  name: string
  role: string
  department: string
  status: "Active" | "Inactive"
  protocols: number
  email: string
  addedAt: string
}

export const initialAdminMembers: AdminMember[] = [
  {
    id: "ADM-2026-001",
    name: "Dr. Marcus Vance",
    role: "Director of Governance & Compliance",
    department: "Research Compliance Secretariat",
    status: "Active",
    protocols: 42,
    email: "admin.secretariat@diu.edu.bd",
    addedAt: "Jan 12, 2026",
  },
  {
    id: "ADM-2026-002",
    name: "Dr. Elena Rostova",
    role: "Principal Investigator",
    department: "Public Health & Clinical Epidemiology",
    status: "Active",
    protocols: 4,
    email: "elena.rostova@diu.edu.bd",
    addedAt: "Feb 05, 2026",
  },
  {
    id: "ADM-2026-003",
    name: "Prof. Charles Montgomery",
    role: "IRB Committee Chair",
    department: "Biomedical Research Ethics Board",
    status: "Active",
    protocols: 18,
    email: "charles.montgomery@diu.edu.bd",
    addedAt: "Feb 18, 2026",
  },
  {
    id: "ADM-2026-004",
    name: "Dr. Ayesha Rahman",
    role: "Co-Investigator & Lay Member",
    department: "Pediatrics & Behavioral Health",
    status: "Active",
    protocols: 2,
    email: "ayesha.rahman@diu.edu.bd",
    addedAt: "Mar 02, 2026",
  },
  {
    id: "ADM-2026-005",
    name: "Nusrat Jahan, M.Sc.",
    role: "Screening Triage Officer",
    department: "Research Compliance Secretariat",
    status: "Active",
    protocols: 31,
    email: "nusrat.jahan@diu.edu.bd",
    addedAt: "Mar 20, 2026",
  },
  {
    id: "ADM-2026-006",
    name: "Barrister Tariqul Islam",
    role: "Institutional Legal & Ethics Counsel",
    department: "Legal & Regulatory Affairs",
    status: "Inactive",
    protocols: 0,
    email: "tariqul.islam@diu.edu.bd",
    addedAt: "Apr 14, 2026",
  },
]

const STORAGE_KEY = "ethica_admin_members_roster"
let cachedMembers: AdminMember[] | null = null
let lastRawString: string | null = null

export function getStoredAdminMembers(): AdminMember[] {
  if (typeof window === "undefined") return initialAdminMembers
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      if (!cachedMembers) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialAdminMembers))
        cachedMembers = initialAdminMembers
        lastRawString = JSON.stringify(initialAdminMembers)
      }
      return cachedMembers
    }
    if (raw === lastRawString && cachedMembers !== null) {
      return cachedMembers
    }
    lastRawString = raw
    const parsed = JSON.parse(raw) as AdminMember[]
    cachedMembers = Array.isArray(parsed) && parsed.length > 0 ? parsed : initialAdminMembers
    return cachedMembers
  } catch {
    return initialAdminMembers
  }
}

const listeners = new Set<() => void>()

export function subscribeAdminMembers(callback: () => void): () => void {
  listeners.add(callback)
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      lastRawString = null
      callback()
    }
  }
  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStorage)
  }
  return () => {
    listeners.delete(callback)
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage)
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
  if (typeof window === "undefined") return
  try {
    const serialized = JSON.stringify(members)
    lastRawString = serialized
    cachedMembers = members
    localStorage.setItem(STORAGE_KEY, serialized)
    notifyListeners()
  } catch {
    // Ignore storage quota errors
  }
}

export function addAdminMember(data: {
  name: string
  email: string
  role: string
  department: string
  status?: "Active" | "Inactive"
  protocols?: number
}): AdminMember {
  const current = getStoredAdminMembers()
  const randomSuffix = Math.floor(100 + Math.random() * 900)
  const newMember: AdminMember = {
    id: `ADM-2026-${randomSuffix}`,
    name: data.name.trim(),
    email: data.email.trim(),
    role: data.role.trim() || "Administrator",
    department: data.department.trim() || "Institutional Governance",
    status: data.status || "Active",
    protocols: data.protocols ?? 0,
    addedAt: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }),
  }
  saveStoredAdminMembers([newMember, ...current])
  return newMember
}

export function updateAdminMemberStatus(
  id: string,
  status: "Active" | "Inactive"
): AdminMember | undefined {
  const current = getStoredAdminMembers()
  let updatedMember: AdminMember | undefined
  const updatedList = current.map((member) => {
    if (member.id === id) {
      updatedMember = { ...member, status }
      return updatedMember
    }
    return member
  })
  if (updatedMember) {
    saveStoredAdminMembers(updatedList)
  }
  return updatedMember
}

export function toggleAdminMemberStatus(id: string): AdminMember | undefined {
  const current = getStoredAdminMembers()
  const target = current.find((m) => m.id === id)
  if (!target) return undefined
  const nextStatus = target.status === "Active" ? "Inactive" : "Active"
  return updateAdminMemberStatus(id, nextStatus)
}

