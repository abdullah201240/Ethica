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
import {
  initialProtocols,
  type Protocol,
} from "@/lib/protocols-store"
import {
  initialCategories,
} from "@/lib/categories-store"
import {
  type ResearchCategory,
  type CreateResearchCategoryInput,
  type UpdateResearchCategoryInput,
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
  protocols: Protocol[]
  categories: ResearchCategory[]
}

// Persist store on globalThis to survive Next.js HMR in development
declare global {
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
      protocols: [...initialProtocols],
      categories: [...initialCategories],
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

  // ── Protocols & Clearance Submissions ──────────────────────────────────────
  protocols: {
    getAll: (): Protocol[] => {
      return [...getStore().protocols]
    },
    getById: (id: string): Protocol | undefined => {
      return getStore().protocols.find((p) => p.id === id)
    },
    create: (data: Partial<Protocol>): Protocol => {
      const store = getStore()
      const randomSuffix = Math.floor(100 + Math.random() * 900)
      const id = data.id || `ETH-2026-${randomSuffix}`
      const now = new Date()
      const submissionDate =
        data.submissionDate ||
        now.toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })

      const newProtocol: Protocol = {
        id,
        title: data.title?.trim() || "Untitled Research Protocol",
        department: data.department?.trim() || "Department of Public Health",
        board: data.board?.trim() || "Biomedical IRB",
        status: data.status || "Under Committee Review",
        statusColor: data.statusColor || "amber",
        risk: data.risk || "Minimal Risk",
        riskColor: data.riskColor || "blue",
        submissionDate,
        piName: data.piName || "Dr. Elena Rostova",
        piEmail: data.piEmail || "elena.rostova@diu.edu.bd",
        piInstitution: data.piInstitution || "Daffodil International University",
        daysInReview: data.daysInReview ?? 0,
        hasCertificate: data.hasCertificate ?? false,
        feeAmountBdt: data.feeAmountBdt,
        feeTier: data.feeTier,
        isExpedited: data.isExpedited,
        paymentMethod: data.paymentMethod,
        senderNumber: data.senderNumber,
        transactionId: data.transactionId,
        abstract: data.abstract,
        studyType: data.studyType,
        durationMonths: data.durationMonths,
        studyLocation: data.studyLocation,
        coInvestigators: data.coInvestigators,
        targetSampleSize: data.targetSampleSize,
        vulnerablePopulations: data.vulnerablePopulations,
        consentType: data.consentType,
        dataConfidentiality: data.dataConfidentiality,
        proposalDocumentName: data.proposalDocumentName,
        consentDocumentName: data.consentDocumentName,
        dataToolsDocumentName: data.dataToolsDocumentName,
        investigatorCvName: data.investigatorCvName,
        committeeRemarks: data.committeeRemarks,
        certificateSealHash: data.certificateSealHash,
        certificateIssueDate: data.certificateIssueDate,
        certificateExpiryDate: data.certificateExpiryDate,
        assignedReviewerId: data.assignedReviewerId,
        assignedReviewerName: data.assignedReviewerName,
        assignedReviewerEmail: data.assignedReviewerEmail,
        assignmentStatus: data.assignmentStatus || "Unassigned",
        assignmentDate: data.assignmentDate,
        reviewerDeclineReason: data.reviewerDeclineReason,
        reviewerEvaluation: data.reviewerEvaluation,
        reviewStep: data.reviewStep ?? (data.status === "Clearance Granted" ? 5 : 4),
      }

      store.protocols = [newProtocol, ...store.protocols]
      return newProtocol
    },
    update: (id: string, updates: Partial<Omit<Protocol, "id">>): Protocol | undefined => {
      const store = getStore()
      let updated: Protocol | undefined
      store.protocols = store.protocols.map((p) => {
        if (p.id === id) {
          updated = { ...p, ...updates }
          return updated
        }
        return p
      })
      return updated
    },
    delete: (id: string): boolean => {
      const store = getStore()
      const initialLength = store.protocols.length
      store.protocols = store.protocols.filter((p) => p.id !== id)
      return store.protocols.length < initialLength
    },
  },

  // ── Research Categories & BDT Pricing ──────────────────────────────────────
  categories: {
    getAll: (filters?: { board?: string; status?: string; risk?: string }): ResearchCategory[] => {
      let list = [...getStore().categories]
      if (filters?.board && filters.board !== "all") {
        list = list.filter((c) => c.board === filters.board)
      }
      if (filters?.status && filters.status !== "all") {
        list = list.filter((c) => c.status === filters.status)
      }
      if (filters?.risk && filters.risk !== "all") {
        list = list.filter((c) => c.riskDefault === filters.risk)
      }
      return list
    },
    getById: (id: string): ResearchCategory | undefined => {
      return getStore().categories.find((c) => c.id === id)
    },
    create: (data: CreateResearchCategoryInput): ResearchCategory => {
      const store = getStore()
      const boardPrefix =
        data.board === "Biomedical IRB"
          ? "BIO"
          : data.board === "Social & Behavioral Board"
          ? "SOC"
          : "AI"
      const randomSuffix = Math.floor(100 + Math.random() * 900)
      const today = new Date().toISOString().split("T")[0]

      const newCategory: ResearchCategory = {
        ...data,
        id: `CAT-${boardPrefix}-${randomSuffix}`,
        code: data.code.toUpperCase().trim(),
        createdAt: today,
        updatedAt: today,
      }

      store.categories = [newCategory, ...store.categories]
      return newCategory
    },
    update: (
      id: string,
      updates: UpdateResearchCategoryInput
    ): ResearchCategory | undefined => {
      const store = getStore()
      let updated: ResearchCategory | undefined
      const today = new Date().toISOString().split("T")[0]

      store.categories = store.categories.map((c) => {
        if (c.id === id) {
          updated = {
            ...c,
            ...updates,
            code: updates.code ? updates.code.toUpperCase().trim() : c.code,
            updatedAt: today,
          }
          return updated
        }
        return c
      })
      return updated
    },
    delete: (id: string): boolean => {
      const store = getStore()
      const initialLength = store.categories.length
      store.categories = store.categories.filter((c) => c.id !== id)
      return store.categories.length < initialLength
    },
    toggleStatus: (id: string): ResearchCategory | undefined => {
      const store = getStore()
      const target = store.categories.find((c) => c.id === id)
      if (!target) return undefined
      const nextStatus = target.status === "Active" ? "Inactive" : "Active"
      return serverDb.categories.update(id, { status: nextStatus })
    },
  },
}
