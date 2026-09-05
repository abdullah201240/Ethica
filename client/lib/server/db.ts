import {
  initialAdminMembers,
  type AdminMember,
} from "@/lib/admin-roster"
import {
  initialAccreditedReviewers,
  type AccreditedReviewer,
} from "@/lib/reviewer-roster"
import {
  initialReviewerApplications,
  type ReviewerApplication,
} from "@/lib/reviewer-applications"
import {
  initialPlatformUsers,
  type PlatformUser,
} from "@/lib/users-directory"
import {
  type CreateAdminMemberInput,
  type CreatePlatformUserInput,
  type CreateReviewerApplicationInput,
  type SyncApprovedReviewerInput,
} from "@/lib/schemas"

export interface InvestigatorProfile {
  id: string
  name: string
  title: string
  email: string
  phone: string
  department: string
  institution: string
  degree: string
  orcid: string
  bio: string
  avatarUrl?: string
  lastActive: string
}

export const initialInvestigatorProfile: InvestigatorProfile = {
  id: "INV-2026-001",
  name: "Dr. Elena Rostova",
  title: "Principal Investigator & Associate Professor",
  email: "elena.rostova@diu.edu.bd",
  phone: "+880 1711-987654",
  department: "Department of Clinical Pharmacology",
  institution: "Daffodil International University",
  degree: "MD, PhD in Bioethics & Pharmacology",
  orcid: "0000-0002-4512-8971",
  bio: "Specializing in randomized controlled clinical trials, pediatric bioethics, and digital informed consent protocols under Helsinki declaration standards.",
  avatarUrl: undefined,
  lastActive: "Active Session",
}

interface EthicaServerStore {
  adminMembers: AdminMember[]
  reviewers: AccreditedReviewer[]
  applications: ReviewerApplication[]
  users: PlatformUser[]
  investigatorProfile: InvestigatorProfile
}

// Persist store on globalThis to survive Next.js HMR in development
declare global {
  // eslint-disable-next-line no-var
  var __ethicaServerDb: EthicaServerStore | undefined
}

function getStore(): EthicaServerStore {
  if (!globalThis.__ethicaServerDb) {
    globalThis.__ethicaServerDb = {
      adminMembers: [...initialAdminMembers],
      reviewers: [...initialAccreditedReviewers],
      applications: [...initialReviewerApplications],
      users: [...initialPlatformUsers],
      investigatorProfile: { ...initialInvestigatorProfile },
    }
  }
  return globalThis.__ethicaServerDb
}

/**
 * Server-Side Database Repository (Zero LocalStorage)
 */
export const serverDb = {
  // ── Admin Members ──────────────────────────────────────────────────────────
  adminMembers: {
    getAll: (): AdminMember[] => {
      return [...getStore().adminMembers]
    },
    getById: (id: string): AdminMember | undefined => {
      return getStore().adminMembers.find((m) => m.id === id)
    },
    create: (data: CreateAdminMemberInput): AdminMember => {
      const store = getStore()
      const randomSuffix = Math.floor(100 + Math.random() * 900)
      const newMember: AdminMember = {
        id: `ADM-2026-${randomSuffix}`,
        name: data.name.trim(),
        email: data.email.trim(),
        role: data.role.trim() || "System Administrator",
        accessLevel: data.accessLevel || "System Admin",
        department: data.department.trim() || "Research Governance Secretariat",
        status: data.status || "Active",
        protocols: typeof data.protocols === "number" ? data.protocols : Number(data.protocols) || 0,
        phone: data.phone?.trim() || "+880 1713-000000",
        lastActive: "Just now",
        addedAt: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
        permissions:
          data.permissions && data.permissions.length > 0
            ? data.permissions
            : ["System Administration", "Institutional RBAC Access"],
      }
      store.adminMembers = [newMember, ...store.adminMembers]
      return newMember
    },
    update: (id: string, updates: Partial<Omit<AdminMember, "id">>): AdminMember | undefined => {
      const store = getStore()
      let updated: AdminMember | undefined
      store.adminMembers = store.adminMembers.map((member) => {
        if (member.id === id) {
          updated = { ...member, ...updates }
          return updated
        }
        return member
      })
      return updated
    },
    delete: (id: string): boolean => {
      const store = getStore()
      const initialLength = store.adminMembers.length
      store.adminMembers = store.adminMembers.filter((m) => m.id !== id)
      return store.adminMembers.length < initialLength
    },
  },

  // ── Accredited Reviewers Roster ────────────────────────────────────────────
  reviewerRoster: {
    getAll: (): AccreditedReviewer[] => {
      return [...getStore().reviewers]
    },
    getById: (id: string): AccreditedReviewer | undefined => {
      return getStore().reviewers.find((r) => r.id === id || r.applicationId === id)
    },
    updateStatus: (
      id: string,
      status: "Active" | "Inactive",
      statusReason?: string
    ): AccreditedReviewer | undefined => {
      const store = getStore()
      let updated: AccreditedReviewer | undefined
      store.reviewers = store.reviewers.map((r) => {
        if (r.id === id) {
          updated = {
            ...r,
            status,
            statusReason: statusReason ?? (status === "Inactive" ? "Suspended by Secretariat" : undefined),
          }
          return updated
        }
        return r
      })
      return updated
    },
    syncApprovedReviewer: (app: SyncApprovedReviewerInput): AccreditedReviewer => {
      const store = getStore()
      const existing = store.reviewers.find(
        (r) => r.email.toLowerCase() === app.email.toLowerCase()
      )
      if (existing) {
        existing.status = "Active"
        existing.statusReason = undefined
        if (!existing.applicationId) existing.applicationId = app.id
        return existing
      }

      const board = app.expertise.some((e) => e.includes("AI") || e.includes("Technology") || e.includes("Data Science"))
        ? "AI & Technology Ethics Panel"
        : app.expertise.some((e) => e.includes("Social") || e.includes("Behavioral") || e.includes("Psychiatry") || e.includes("Mental"))
          ? "Social & Behavioral IRB"
          : "Biomedical & Clinical IRB"

      const newReviewer: AccreditedReviewer = {
        id: app.id,
        applicationId: app.id,
        name: app.fullName,
        email: app.email,
        phone: app.phone || "+880 1700-000000",
        institution: app.institution,
        department: app.department,
        position: app.position,
        degree: app.degree,
        board,
        role: "Voting Member",
        clearanceLevel: "Full Voting Quorum",
        status: "Active",
        specializations: app.expertise,
        assignedProtocols: 0,
        accreditationDate: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
        digitalSealHash: Array.from({ length: 64 }, () =>
          Math.floor(Math.random() * 16).toString(16)
        ).join(""),
        bioStatement: app.statement,
      }

      store.reviewers = [newReviewer, ...store.reviewers]
      return newReviewer
    },
  },

  // ── Reviewer Intake Applications ───────────────────────────────────────────
  reviewerApplications: {
    getAll: (): ReviewerApplication[] => {
      return [...getStore().applications]
    },
    getById: (id: string): ReviewerApplication | undefined => {
      return getStore().applications.find((a) => a.id === id)
    },
    create: (data: CreateReviewerApplicationInput): ReviewerApplication => {
      const store = getStore()
      const dateStr = new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
      const nextNum = store.applications.length + 82
      const created: ReviewerApplication = {
        id: `REV-2026-${String(nextNum).padStart(3, "0")}`,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone || "",
        institution: data.institution,
        department: data.department,
        position: data.position || "Faculty Member",
        degree: data.degree || "PhD",
        yearsExperience: Number(data.yearsExperience) || 5,
        orcid: data.orcid || "",
        expertise: data.expertise || [],
        statement: data.statement || "",
        cvFileName: data.cvFileName || "curriculum_vitae.pdf",
        status: "Pending Verification",
        submittedAt: dateStr,
      }
      store.applications = [created, ...store.applications]
      return created
    },
    updateStatus: (
      id: string,
      status: "Approved" | "Rejected",
      notes?: string
    ): ReviewerApplication | undefined => {
      const store = getStore()
      let updated: ReviewerApplication | undefined
      const dateStr = new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })

      store.applications = store.applications.map((app) => {
        if (app.id === id) {
          updated = {
            ...app,
            status,
            decisionNotes: notes,
            decisionDate: dateStr,
          }
          return updated
        }
        return app
      })

      // If approved, automatically sync into the accredited reviewer roster
      if (status === "Approved" && updated) {
        serverDb.reviewerRoster.syncApprovedReviewer(updated)
      }

      return updated
    },
  },

  // ── Platform Users Directory ───────────────────────────────────────────────
  users: {
    getAll: (): PlatformUser[] => {
      return [...getStore().users]
    },
    getById: (id: string): PlatformUser | undefined => {
      return getStore().users.find((u) => u.id === id)
    },
    create: (data: CreatePlatformUserInput): PlatformUser => {
      const store = getStore()
      const pillarPrefix =
        data.pillar === "Investigator"
          ? "USR-PI"
          : data.pillar === "Reviewer"
            ? "USR-REV"
            : "USR-ADM"
      const randomSuffix = Math.floor(100 + Math.random() * 900)
      const newUser: PlatformUser = {
        id: `${pillarPrefix}-${randomSuffix}`,
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone?.trim() || "+880 1700-000000",
        pillar: data.pillar || "Investigator",
        role: data.role.trim() || "Investigator",
        department: data.department.trim() || "Faculty of Health Sciences",
        institution: data.institution?.trim() || "Daffodil International University",
        status: data.status || "Active",
        verificationStatus: data.verificationStatus || "Verified Institutional ID",
        protocolsCount: typeof data.protocolsCount === "number" ? data.protocolsCount : Number(data.protocolsCount) || 0,
        joinedAt: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
        lastLogin: "Just now",
        bio: data.bio?.trim() || "",
        avatar: data.avatar,
      }
      store.users = [newUser, ...store.users]
      return newUser
    },
    update: (id: string, updates: Partial<Omit<PlatformUser, "id">>): PlatformUser | undefined => {
      const store = getStore()
      let updated: PlatformUser | undefined
      store.users = store.users.map((user) => {
        if (user.id === id) {
          updated = { ...user, ...updates }
          return updated
        }
        return user
      })
      return updated
    },
    delete: (id: string): boolean => {
      const store = getStore()
      const initialLength = store.users.length
      store.users = store.users.filter((u) => u.id !== id)
      return store.users.length < initialLength
    },
  },

  // ── Investigator Profile ───────────────────────────────────────────────────
  investigatorProfile: {
    get: (): InvestigatorProfile => {
      return { ...getStore().investigatorProfile }
    },
    update: (data: Partial<InvestigatorProfile>): InvestigatorProfile => {
      const store = getStore()
      store.investigatorProfile = {
        ...store.investigatorProfile,
        ...data,
      }
      return { ...store.investigatorProfile }
    },
  },
}
