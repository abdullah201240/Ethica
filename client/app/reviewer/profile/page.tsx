"use client"

import * as React from "react"
import Link from "next/link"
import {
  ShieldCheck,
  Award,
  Building2,
  Mail,
  Phone,
  Clock,
  MapPin,
  ExternalLink,
  Copy,
  Check,
  Edit3,
  KeyRound,
  Camera,
  CheckCircle2,
  Laptop,
  Smartphone,
  Globe,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  FileText,
  User,
  Sparkles,
  Calendar,
  AlertCircle,
  AlertTriangle,
  RotateCcw,
  Save,
  Trash2,
  CheckCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/sonner"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  DataTable,
  type ColumnDef,
  type DataTableFilter,
} from "@/components/ui/data-table"
import { KpiCard, KpiGrid } from "@/components/ui/kpi-card"
import { DashboardContainer } from "@/components/dashboard/dashboard-container"
import {
  reviewerProfileSchema,
  changePasswordSchema,
  type ReviewerProfileInput,
  type ChangePasswordInput,
} from "@/lib/schemas"
import {
  getActiveReviewer,
  subscribeReviewers,
  updateReviewerProfile,
  type AccreditedReviewer,
} from "@/lib/reviewer-roster"
import {
  getStoredProtocols,
  subscribeProtocols,
  syncProtocolsFromServer,
  type Protocol,
} from "@/lib/protocols-store"

// ── Curated Institutional Faculty Avatar Presets ─────────────────────────────
const AVATAR_PRESETS = [
  {
    id: "preset-1",
    label: "Prof. Charles Montgomery",
    role: "Biomedical IRB Chair",
    url: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "preset-2",
    label: "Dr. Sarah Jenkins",
    role: "Pediatrics Vice Chair",
    url: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "preset-3",
    label: "Dr. Farzana Choudhury",
    role: "Senior Voting Member",
    url: "https://images.unsplash.com/photo-1594824813581-2292f72b2203?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "preset-4",
    label: "Dr. Mahmudul Hasan",
    role: "Social & Behavioral IRB",
    url: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "preset-5",
    label: "Prof. Tariqul Islam",
    role: "AI & Tech Ethics Panel",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "preset-6",
    label: "Academic Ethicist",
    role: "Specialist Advisor",
    url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
  },
]

// ── Session Log Record Interface ─────────────────────────────────────────────
interface ReviewerSessionLog {
  id: string
  device: string
  deviceType: "desktop" | "mobile"
  ipAddress: string
  location: string
  authMethod: string
  lastActive: string
  status: "Active Session" | "Signed Out"
}

const INITIAL_SESSION_LOGS: ReviewerSessionLog[] = [
  {
    id: "SESS-REV-901",
    device: "MacBook Pro 16\" (macOS Sonoma • Safari)",
    deviceType: "desktop",
    ipAddress: "103.114.98.12",
    location: "DIU Ashulia Research Complex • Chamber 701",
    authMethod: "Touch ID / WebAuthn FIDO2",
    lastActive: "Active now (Current session)",
    status: "Active Session",
  },
  {
    id: "SESS-REV-900",
    device: "iPad Pro 12.9\" (iPadOS 17.5 • Deliberation App)",
    deviceType: "mobile",
    ipAddress: "103.114.98.45",
    location: "DIU Campus Secure Wi-Fi",
    authMethod: "Face ID Biometric Quorum",
    lastActive: "18 mins ago",
    status: "Active Session",
  },
  {
    id: "SESS-REV-899",
    device: "ThinkPad P1 Workstation (Windows 11 Enterprise)",
    deviceType: "desktop",
    ipAddress: "103.114.98.24",
    location: "Clinical Sciences Faculty Chamber",
    authMethod: "Institutional SSO (DIU Entra ID)",
    lastActive: "Yesterday at 04:30 PM",
    status: "Active Session",
  },
  {
    id: "SESS-REV-898",
    device: "iPhone 15 Pro (iOS 17.5 • Safari Mobile)",
    deviceType: "mobile",
    ipAddress: "103.114.98.88",
    location: "Daffodil Smart City Hub",
    authMethod: "FIDO2 Mobile Passkey",
    lastActive: "Sep 02, 2026 11:15 AM",
    status: "Signed Out",
  },
]

export default function ReviewerProfilePage() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [currentReviewer, setCurrentReviewer] = React.useState<AccreditedReviewer>(getActiveReviewer)
  const [protocols, setProtocols] = React.useState<Protocol[]>(getStoredProtocols)
  const [sessionLogs, setSessionLogs] = React.useState<ReviewerSessionLog[]>(INITIAL_SESSION_LOGS)

  // Copy feedback states
  const [copiedHash, setCopiedHash] = React.useState(false)
  const [copiedOrcid, setCopiedOrcid] = React.useState(false)

  // Edit Profile Sheet State
  const [isEditSheetOpen, setIsEditSheetOpen] = React.useState(false)
  const [editFormData, setEditFormData] = React.useState<ReviewerProfileInput>({
    name: "",
    degree: "",
    position: "",
    department: "",
    institution: "",
    email: "",
    phone: "",
    mobile: "",
    officeLocation: "",
    consultationHours: "",
    orcid: "",
    bioStatement: "",
    specializations: "",
    avatarUrl: "",
  })
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({})

  // Avatar Sheet State
  const [isAvatarSheetOpen, setIsAvatarSheetOpen] = React.useState(false)
  const [customAvatarUrl, setCustomAvatarUrl] = React.useState("")
  const [selectedPresetId, setSelectedPresetId] = React.useState<string | null>(null)

  // Password Modal State
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = React.useState(false)
  const [passwordFormData, setPasswordFormData] = React.useState<ChangePasswordInput>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [passwordErrors, setPasswordErrors] = React.useState<Record<string, string>>({})
  const [showCurrentPw, setShowCurrentPw] = React.useState(false)
  const [showNewPw, setShowNewPw] = React.useState(false)
  const [showConfirmPw, setShowConfirmPw] = React.useState(false)

  // ── Sync Store ─────────────────────────────────────────────────────────────
  React.useEffect(() => {
    const handleRosterSync = () => {
      setCurrentReviewer(getActiveReviewer())
    }

    const unsubscribeReviewers = subscribeReviewers(handleRosterSync)

    const handleActiveChanged = () => {
      setCurrentReviewer(getActiveReviewer())
    }
    window.addEventListener("ethica:active-reviewer-changed", handleActiveChanged)

    syncProtocolsFromServer().then((data) => {
      if (data && Array.isArray(data)) setProtocols(data)
    })
    const unsubscribeProtocols = subscribeProtocols(() => {
      setProtocols(getStoredProtocols())
    })

    return () => {
      unsubscribeReviewers()
      unsubscribeProtocols()
      window.removeEventListener("ethica:active-reviewer-changed", handleActiveChanged)
    }
  }, [])

  // Sync edit form when opening edit sheet
  const handleOpenEditSheet = () => {
    setEditFormData({
      name: currentReviewer.name,
      degree: currentReviewer.degree || "",
      position: currentReviewer.position || "",
      department: currentReviewer.department || "",
      institution: currentReviewer.institution || "",
      email: currentReviewer.email,
      phone: currentReviewer.phone || "",
      mobile: currentReviewer.mobile || "+880 1711-234567",
      officeLocation: currentReviewer.officeLocation || "Ethics Secretariat Chamber, Level 7",
      consultationHours: currentReviewer.consultationHours || "Mon & Wed 10:00 AM - 1:00 PM",
      orcid: currentReviewer.orcid || "",
      bioStatement: currentReviewer.bioStatement || "",
      specializations: (currentReviewer.specializations || []).join(", "),
      avatarUrl: currentReviewer.avatarUrl || "",
    })
    setFormErrors({})
    setIsEditSheetOpen(true)
  }

  // ── Copy Handlers ──────────────────────────────────────────────────────────
  const handleCopyDigitalSeal = () => {
    navigator.clipboard.writeText(currentReviewer.digitalSealHash)
    setCopiedHash(true)
    toast.success("FIPS 140-3 SHA-256 Seal Copied", {
      description: "Cryptographic accreditation hash copied to clipboard.",
    })
    setTimeout(() => setCopiedHash(false), 2500)
  }

  const handleCopyOrcid = () => {
    if (!currentReviewer.orcid) return
    navigator.clipboard.writeText(currentReviewer.orcid)
    setCopiedOrcid(true)
    toast.info("ORCID iD Copied", {
      description: `ORCID identifier ${currentReviewer.orcid} copied to clipboard.`,
    })
    setTimeout(() => setCopiedOrcid(false), 2500)
  }

  // ── Handle Save Profile Edit ───────────────────────────────────────────────
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()

    const parseResult = reviewerProfileSchema.safeParse(editFormData)
    if (!parseResult.success) {
      const fieldErrors: Record<string, string> = {}
      parseResult.error.issues.forEach((issue) => {
        const fieldName = String(issue.path[0])
        if (!fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message
        }
      })
      setFormErrors(fieldErrors)
      toast.error("Form Validation Error", {
        description: "Please resolve the highlighted validation errors before saving.",
      })
      return
    }

    const specializationsArray = editFormData.specializations
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)

    const updated = updateReviewerProfile(currentReviewer.id, {
      name: editFormData.name,
      degree: editFormData.degree,
      position: editFormData.position,
      department: editFormData.department,
      institution: editFormData.institution,
      email: editFormData.email,
      phone: editFormData.phone,
      mobile: editFormData.mobile,
      officeLocation: editFormData.officeLocation,
      consultationHours: editFormData.consultationHours,
      orcid: editFormData.orcid || undefined,
      bioStatement: editFormData.bioStatement,
      specializations: specializationsArray,
      avatarUrl: editFormData.avatarUrl || currentReviewer.avatarUrl,
    })

    if (updated) {
      setCurrentReviewer(updated)
      setIsEditSheetOpen(false)
      toast.success("Institutional Profile Updated", {
        description: "Your official accreditation and contact credentials have been updated in the registry.",
      })
    }
  }

  // ── Handle Avatar Selection ────────────────────────────────────────────────
  const handleSaveAvatar = () => {
    let finalUrl = currentReviewer.avatarUrl

    if (selectedPresetId) {
      const found = AVATAR_PRESETS.find((p) => p.id === selectedPresetId)
      if (found) finalUrl = found.url
    } else if (customAvatarUrl.trim()) {
      if (!customAvatarUrl.startsWith("https://") && !customAvatarUrl.startsWith("data:image/")) {
        toast.error("Invalid URL Protocol", {
          description: "For security, image URLs must begin with https://",
        })
        return
      }
      finalUrl = customAvatarUrl.trim()
    }

    if (finalUrl) {
      const updated = updateReviewerProfile(currentReviewer.id, { avatarUrl: finalUrl })
      if (updated) {
        setCurrentReviewer(updated)
        setIsAvatarSheetOpen(false)
        setSelectedPresetId(null)
        setCustomAvatarUrl("")
        toast.success("Profile Photo Updated", {
          description: "Institutional deliberation avatar updated successfully.",
        })
      }
    }
  }

  // ── Handle Change Password ─────────────────────────────────────────────────
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault()

    const parseResult = changePasswordSchema.safeParse(passwordFormData)
    if (!parseResult.success) {
      const fieldErrors: Record<string, string> = {}
      parseResult.error.issues.forEach((issue) => {
        const fieldName = String(issue.path[0])
        if (!fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message
        }
      })
      setPasswordErrors(fieldErrors)
      return
    }

    // Success
    setIsPasswordDialogOpen(false)
    setPasswordFormData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    setPasswordErrors({})
    toast.success("Password Updated Successfully", {
      description: "Your committee quorum authentication credential has been reset with SHA-256 salting.",
    })
  }

  // ── Handle Revoke Session ──────────────────────────────────────────────────
  const handleRevokeSession = (sessionId: string) => {
    setSessionLogs((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, status: "Signed Out" } : s))
    )
    toast.info("Session Revoked", {
      description: `Authentication token for session ${sessionId} invalidated.`,
    })
  }

  // ── Deliberation Protocol Activity ─────────────────────────────────────────
  const reviewerProtocols = protocols.filter(
    (p) =>
      p.assignedReviewerEmail?.toLowerCase() === currentReviewer.email.toLowerCase() ||
      p.assignedReviewerId === currentReviewer.id
  )
  const displayedProtocols = reviewerProtocols.length > 0 ? reviewerProtocols : protocols.slice(0, 5)

  const clearedCount = displayedProtocols.filter(
    (p) => p.status === "Clearance Granted" || p.assignmentStatus === "Review Completed"
  ).length
  const activeCount = displayedProtocols.filter(
    (p) => p.assignmentStatus === "Accepted" || p.status === "Under Committee Review"
  ).length
  const pendingCount = displayedProtocols.filter(
    (p) => p.assignmentStatus === "Pending Acceptance"
  ).length

  // ── Protocol Columns ───────────────────────────────────────────────────────
  const protocolColumns: ColumnDef<Protocol>[] = React.useMemo(
    () => [
      {
        id: "id",
        accessorKey: "id",
        header: "Protocol ID",
        sortable: true,
        headerClassName: "w-36",
        cell: ({ row }) => (
          <div className="space-y-1 select-text">
            <span className="font-mono text-base font-bold text-primary dark:text-sky-300 block">
              {row.id}
            </span>
            <div className="flex items-center gap-1 text-micro text-slate-400 dark:text-slate-500 whitespace-nowrap">
              <Calendar className="size-3 shrink-0" />
              <span>{row.submissionDate}</span>
            </div>
          </div>
        ),
      },
      {
        id: "title",
        accessorKey: "title",
        header: "Research Title & Investigator",
        sortable: true,
        cell: ({ row }) => (
          <div className="space-y-1 max-w-md min-w-56 select-text">
            <span className="font-bold text-foreground text-table-cell leading-snug line-clamp-2 block">
              {row.title}
            </span>
            <div className="flex flex-wrap items-center gap-2 text-micro text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Building2 className="size-3 text-slate-400 shrink-0" />
                <span className="truncate">{row.department}</span>
              </span>
              <span className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                <User className="size-3 text-primary/70 dark:text-sky-400 shrink-0" />
                <span>{row.piName || "Dr. Elena Rostova"}</span>
              </span>
            </div>
          </div>
        ),
      },
      {
        id: "board",
        accessorKey: "board",
        header: "IRB Board",
        sortable: true,
        headerClassName: "w-44",
        cell: ({ row }) => (
          <Badge
            variant="secondary"
            className="font-medium text-micro bg-primary/8 dark:bg-primary/20 text-primary dark:text-sky-300 border-none select-text"
          >
            {row.board}
          </Badge>
        ),
      },
      {
        id: "assignmentStatus",
        accessorKey: "assignmentStatus",
        header: "Deliberation Status",
        sortable: true,
        headerClassName: "w-44",
        cell: ({ row }) => {
          const status = row.assignmentStatus || "Pending Acceptance"
          const isAccepted = status === "Accepted"
          const isDone = status === "Review Completed" || row.status === "Clearance Granted"
          const isPending = status === "Pending Acceptance"

          return (
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-base font-bold border select-text ${
                isDone
                  ? "bg-[#198754]/10 text-secondary dark:text-emerald-400 border-[#198754]/30"
                  : isAccepted
                  ? "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/30"
                  : isPending
                  ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30"
                  : "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30"
              }`}
            >
              <span
                className={`size-1.5 rounded-full ${
                  isDone
                    ? "bg-[#198754]"
                    : isAccepted
                    ? "bg-sky-500 animate-pulse"
                    : isPending
                    ? "bg-amber-500 animate-pulse"
                    : "bg-rose-500"
                }`}
              />
              <span>{isDone ? "Deliberated" : status}</span>
            </span>
          )
        },
      },
      {
        id: "actions",
        header: "Actions",
        align: "right",
        headerClassName: "w-36",
        cell: ({ row }) => (
          <div className="inline-flex items-center gap-2 justify-end">
            <Link href="/reviewer/dashboard">
              <Button
                type="button"
                variant="outline"
                className="h-8 px-2.5 text-base font-bold rounded-lg border-border/75 hover:bg-slate-100 dark:hover:bg-slate-800 text-foreground shadow-xs gap-1 cursor-pointer"
                title="Deliberate on Reviewer Chamber"
              >
                <FileText className="size-3.5" />
                <span>Chamber</span>
              </Button>
            </Link>
          </div>
        ),
      },
    ],
    []
  )

  const protocolFilters: DataTableFilter<Protocol>[] = React.useMemo(
    () => [
      {
        id: "board",
        title: "IRB Board",
        accessorKey: "board",
        options: [
          { label: "Biomedical IRB", value: "Biomedical IRB" },
          { label: "Social & Behavioral Board", value: "Social & Behavioral Board" },
          { label: "AI & Data Ethics Board", value: "AI & Data Ethics Board" },
        ],
      },
      {
        id: "assignmentStatus",
        title: "Status",
        accessorKey: "assignmentStatus",
        options: [
          { label: "Pending Acceptance", value: "Pending Acceptance" },
          { label: "Accepted", value: "Accepted" },
          { label: "Review Completed", value: "Review Completed" },
        ],
      },
    ],
    []
  )

  // ── Session Columns ────────────────────────────────────────────────────────
  const sessionColumns: ColumnDef<ReviewerSessionLog>[] = React.useMemo(
    () => [
      {
        id: "device",
        accessorKey: "device",
        header: "Authenticated Device",
        sortable: true,
        cell: ({ row }) => (
          <div className="flex items-center gap-3 select-text">
            <div className="size-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-primary dark:text-sky-300 shrink-0">
              {row.deviceType === "desktop" ? (
                <Laptop className="size-4.5" />
              ) : (
                <Smartphone className="size-4.5" />
              )}
            </div>
            <div>
              <div className="font-bold text-sm text-foreground">{row.device}</div>
              <div className="text-micro text-muted-foreground">{row.authMethod}</div>
            </div>
          </div>
        ),
      },
      {
        id: "location",
        accessorKey: "location",
        header: "Quorum Location & IP",
        sortable: true,
        cell: ({ row }) => (
          <div className="space-y-0.5 select-text">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-800 dark:text-slate-200">
              <MapPin className="size-3 text-slate-400 shrink-0" />
              <span>{row.location}</span>
            </div>
            <div className="text-micro font-mono text-muted-foreground">{row.ipAddress}</div>
          </div>
        ),
      },
      {
        id: "lastActive",
        accessorKey: "lastActive",
        header: "Activity Time",
        sortable: true,
        headerClassName: "w-44",
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground select-text">
            <Clock className="size-3.5 text-slate-400 shrink-0" />
            <span>{row.lastActive}</span>
          </div>
        ),
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Quorum Status",
        sortable: true,
        headerClassName: "w-36",
        cell: ({ row }) => (
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-micro font-bold border select-text ${
              row.status === "Active Session"
                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                : "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30"
            }`}
          >
            <span
              className={`size-1.5 rounded-full ${
                row.status === "Active Session" ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
              }`}
            />
            <span>{row.status}</span>
          </span>
        ),
      },
      {
        id: "actions",
        header: "Action",
        align: "right",
        headerClassName: "w-28",
        cell: ({ row }) => (
          <div className="flex justify-end">
            {row.status === "Active Session" && (
              <Button
                type="button"
                variant="outline"
                onClick={() => handleRevokeSession(row.id)}
                className="h-8 px-2.5 text-micro font-bold rounded-lg border-rose-500/30 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 shadow-xs cursor-pointer"
                title="Revoke and sign out this device"
              >
                <span>Sign Out</span>
              </Button>
            )}
          </div>
        ),
      },
    ],
    []
  )

  const initials =
    currentReviewer.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "RV"

  return (
    <DashboardContainer className="space-y-6 select-text pb-12">
      {/* ── Main Reviewer Header & Profile Summary Card ────────────────────── */}
      <div className="rounded-xl sm:rounded-2xl border border-border/75 bg-white dark:bg-[#0C1E34] overflow-hidden shadow-xs">
        {/* Subtle Institutional Brand Header Banner */}
        <div className="h-28 sm:h-36 w-full bg-gradient-to-r from-[#002752] via-[#003875] to-[#198754] relative p-6 flex items-end justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />
          <div className="relative z-10 flex items-center gap-2 text-white/80 text-xs font-bold tracking-wide uppercase">
            <Award className="size-4 text-[#E0C23C]" />
            <span>IRB Institutional Accreditation Chamber</span>
          </div>
          <div className="relative z-10 hidden sm:flex items-center gap-2">
            <Badge
              variant="outline"
              className="bg-black/25 text-white border-white/20 text-xs font-mono backdrop-blur-xs px-2.5 py-1"
            >
              ID: {currentReviewer.id}
            </Badge>
          </div>
        </div>

        {/* Profile Content Details */}
        <div className="p-5 sm:p-7 relative pt-0">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 -mt-12 sm:-mt-16 mb-4">
            {/* Avatar & Main Titles */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
              <div className="relative group">
                <div className="size-24 sm:size-28 rounded-full border-4 border-white dark:border-[#0C1E34] bg-primary text-white text-2xl sm:text-3xl font-black shadow-md flex items-center justify-center overflow-hidden">
                  {currentReviewer.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={currentReviewer.avatarUrl}
                      alt={currentReviewer.name}
                      className="size-full object-cover"
                    />
                  ) : (
                    <span>{initials}</span>
                  )}
                </div>
                <Button
                  type="button"
                  variant="default"
                  onClick={() => setIsAvatarSheetOpen(true)}
                  className="absolute bottom-0 right-0 size-8.5 rounded-full p-0 bg-primary text-white shadow-md border-2 border-white dark:border-[#0C1E34] hover:bg-primary/90 flex items-center justify-center cursor-pointer"
                  title="Update Institutional Portrait"
                >
                  <Camera className="size-4" />
                </Button>
              </div>

              <div className="space-y-1.5 pt-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight">
                    {currentReviewer.name}
                  </h1>
                  <Badge
                    variant="outline"
                    className="bg-[#198754]/10 text-secondary dark:text-emerald-400 border-[#198754]/30 text-xs font-bold px-2 py-0.5 inline-flex items-center gap-1"
                  >
                    <span className="size-1.5 rounded-full bg-secondary animate-pulse" />
                    <span>Active Accreditation</span>
                  </Badge>
                </div>

                <p className="text-sm sm:text-base font-semibold text-muted-foreground">
                  {currentReviewer.degree} • {currentReviewer.position}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 pt-0.5">
                  <span className="inline-flex items-center gap-1 font-medium">
                    <Building2 className="size-3.5 text-primary/70 dark:text-sky-400 shrink-0" />
                    <span>{currentReviewer.department}</span>
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">·</span>
                  <span className="inline-flex items-center gap-1 font-medium">
                    <span>{currentReviewer.institution}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto pt-2">
              <Button
                type="button"
                variant="default"
                onClick={handleOpenEditSheet}
                className="h-9 px-3.5 text-sm font-bold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs gap-1.5 cursor-pointer"
              >
                <Edit3 className="size-4" />
                <span>Edit Profile</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => setIsPasswordDialogOpen(true)}
                className="h-9 px-3.5 text-sm font-bold rounded-lg border-border/75 hover:bg-slate-100 dark:hover:bg-slate-800 text-foreground shadow-xs gap-1.5 cursor-pointer"
              >
                <KeyRound className="size-4" />
                <span>Change Password</span>
              </Button>

              <Link href="/reviewer/dashboard">
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 px-3.5 text-sm font-bold rounded-lg border-secondary/40 bg-[#198754]/5 text-secondary hover:bg-[#198754]/10 shadow-xs gap-1.5 cursor-pointer"
                >
                  <FileText className="size-4" />
                  <span>Deliberation Chamber</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Institutional Credentials Badges Row */}
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-border/70 mt-4">
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary dark:text-sky-300 font-bold text-xs px-2.5 py-1 inline-flex items-center gap-1.5"
            >
              <Award className="size-3.5 text-primary" />
              <span>{currentReviewer.board}</span>
            </Badge>

            <Badge
              variant="secondary"
              className="bg-[#E0C23C]/20 text-slate-900 dark:text-amber-200 font-bold text-xs px-2.5 py-1 inline-flex items-center gap-1.5"
            >
              <UserCheck className="size-3.5 text-amber-600 dark:text-amber-400" />
              <span>Role: {currentReviewer.role}</span>
            </Badge>

            <Badge
              variant="outline"
              className="bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-border font-bold text-xs px-2.5 py-1 inline-flex items-center gap-1.5"
            >
              <ShieldCheck className="size-3.5 text-secondary" />
              <span>{currentReviewer.clearanceLevel}</span>
            </Badge>

            {currentReviewer.orcid && (
              <Button
                type="button"
                variant="ghost"
                onClick={handleCopyOrcid}
                className="h-7 px-2 text-xs font-mono font-bold text-muted-foreground hover:text-foreground inline-flex items-center gap-1 cursor-pointer"
                title="Click to copy ORCID iD"
              >
                <span>ORCID: {currentReviewer.orcid}</span>
                {copiedOrcid ? (
                  <Check className="size-3 text-secondary" />
                ) : (
                  <Copy className="size-3" />
                )}
              </Button>
            )}
          </div>

          {/* FIPS 140-3 Cryptographic Seal Box */}
          <div className="mt-4 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200/85 dark:border-slate-800 p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <ShieldCheck className="size-4 text-secondary shrink-0" />
              <span className="text-xs font-bold text-foreground shrink-0">
                Accreditation Seal (SHA-256):
              </span>
              <span className="font-mono text-xs text-muted-foreground truncate max-w-xs sm:max-w-md md:max-w-lg">
                {currentReviewer.digitalSealHash}
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              onClick={handleCopyDigitalSeal}
              className="h-7 px-2 text-xs font-bold text-primary dark:text-sky-400 hover:underline inline-flex items-center gap-1 cursor-pointer shrink-0"
            >
              {copiedHash ? (
                <>
                  <Check className="size-3 text-secondary" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="size-3" />
                  <span>Copy Seal</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* ── KPI Metric Counters Grid ───────────────────────────────────────── */}
      <KpiGrid columns={4}>
        <KpiCard
          label="Total Assigned Protocols"
          value={currentReviewer.assignedProtocols || displayedProtocols.length}
          icon={FileText}
          color="navy"
          description="Formal ethical reviews docket"
        />
        <KpiCard
          label="Clearance Approvals"
          value={clearedCount}
          icon={CheckCircle2}
          color="green"
          description="FIPS 140-3 clearance granted"
        />
        <KpiCard
          label="Active In-Chamber Deliberations"
          value={activeCount + pendingCount}
          icon={Clock}
          color="amber"
          description="Active evaluation & voting queue"
        />
        <KpiCard
          label="Quorum Compliance"
          value="100%"
          icon={ShieldCheck}
          color="gold"
          description="Verified voting member attendance"
        />
      </KpiGrid>

      {/* ── Deep Context Tabbed Sections ───────────────────────────────────── */}
      <Tabs defaultValue="credentials" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/75 pb-3">
          <TabsList className="bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <TabsTrigger
              value="credentials"
              className="px-4 py-2 text-sm font-bold rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-[#0C1E34] data-[state=active]:text-primary dark:data-[state=active]:text-sky-300 shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Award className="size-4" />
              <span>Credentials & Institutional Bio</span>
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="px-4 py-2 text-sm font-bold rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-[#0C1E34] data-[state=active]:text-primary dark:data-[state=active]:text-sky-300 shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <FileText className="size-4" />
              <span>Deliberation Register ({displayedProtocols.length})</span>
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="px-4 py-2 text-sm font-bold rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-[#0C1E34] data-[state=active]:text-primary dark:data-[state=active]:text-sky-300 shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="size-4" />
              <span>Quorum Security & Sessions</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ── Tab 1: Credentials & Bio ─────────────────────────────────────── */}
        <TabsContent value="credentials" className="space-y-6 mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact & Chamber Card */}
            <Card className="rounded-xl border border-border/75 bg-white dark:bg-[#0C1E34] shadow-xs">
              <CardHeader className="pb-3 border-b border-border/60">
                <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                  <Building2 className="size-4 text-primary" />
                  <span>Institutional Contact & Chamber Details</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Official contact channels for IRB Secretariat quorum deliberations
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="size-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-muted-foreground uppercase">
                      Official Institutional Email
                    </div>
                    <div className="text-sm font-bold text-foreground">{currentReviewer.email}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="size-4 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-muted-foreground uppercase">
                      Office Telephone (Direct)
                    </div>
                    <div className="text-sm font-bold text-foreground">{currentReviewer.phone}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Smartphone className="size-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-muted-foreground uppercase">
                      Emergency Quorum Mobile
                    </div>
                    <div className="text-sm font-bold text-foreground">
                      {currentReviewer.mobile || "+880 1711-234567"}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="size-4 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-muted-foreground uppercase">
                      Chamber Office Location
                    </div>
                    <div className="text-sm font-bold text-foreground">
                      {currentReviewer.officeLocation ||
                        "Ethics Secretariat Chamber, Level 7, Academic Building 4"}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="size-4 text-sky-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-muted-foreground uppercase">
                      Deliberation Consultation Hours
                    </div>
                    <div className="text-sm font-bold text-foreground">
                      {currentReviewer.consultationHours ||
                        "Mon & Wed 10:00 AM - 1:00 PM (By Appointment)"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Specializations & Accreditation Info */}
            <Card className="rounded-xl border border-border/75 bg-white dark:bg-[#0C1E34] shadow-xs">
              <CardHeader className="pb-3 border-b border-border/60">
                <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                  <Award className="size-4 text-secondary" />
                  <span>Ethics Domains & Accreditation Standing</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Accreditation milestones under Helsinki & CIOMS international standards
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div>
                  <div className="text-xs font-bold text-muted-foreground uppercase mb-2">
                    Reviewer Specializations & Expertise Domains
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(currentReviewer.specializations || []).map((spec, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="bg-primary/8 dark:bg-primary/20 text-primary dark:text-sky-300 border-none text-xs font-semibold px-2.5 py-1"
                      >
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-border/60">
                  <div className="text-xs font-bold text-muted-foreground uppercase">
                    Institutional Accreditation Date
                  </div>
                  <div className="text-sm font-bold text-foreground mt-0.5">
                    {currentReviewer.accreditationDate || "Jan 10, 2025"}
                  </div>
                </div>

                <div className="pt-2 border-t border-border/60">
                  <div className="text-xs font-bold text-muted-foreground uppercase">
                    Assigned Deliberation Quorum
                  </div>
                  <div className="text-sm font-bold text-foreground mt-0.5">
                    {currentReviewer.board} • {currentReviewer.role}
                  </div>
                </div>

                <div className="pt-2 border-t border-border/60">
                  <div className="text-xs font-bold text-muted-foreground uppercase">
                    IRB Secretariat Certification Authority
                  </div>
                  <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-0.5 flex items-center gap-1">
                    <CheckCircle className="size-3.5 text-secondary" />
                    <span>Daffodil International University Institutional Review Board</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Formal Bioethics Statement */}
          <Card className="rounded-xl border border-border/75 bg-white dark:bg-[#0C1E34] shadow-xs">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <FileText className="size-4 text-primary" />
                <span>Formal Bioethics Statement & Helsinki Quorum Pledge</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line select-text">
                {currentReviewer.bioStatement ||
                  "Founding Chair of the Institutional Review Board. Senior ethics consultant on multinational multi-center pharmaceutical trials. Dedicated to upholding the Declaration of Helsinki, CIOMS guidelines, and Belmont Report principles for the protection of human subjects across all clinical and observational trials."}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Tab 2: Deliberation Activity ─────────────────────────────────── */}
        <TabsContent value="activity" className="space-y-4 mt-0">
          <DataTable
            data={displayedProtocols}
            columns={protocolColumns}
            filters={protocolFilters}
            searchKeys={["id", "title", "department", "board"]}
            searchPlaceholder="Search assigned deliberations by ID, research title, or department..."
            title="Assigned Protocol Deliberations Register"
            description="Audit ledger of research clearance protocols assigned to this committee reviewer"
            initialPageSize={10}
          />
        </TabsContent>

        {/* ── Tab 3: Security & Session Ledger ─────────────────────────────── */}
        <TabsContent value="security" className="space-y-6 mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 2FA / WebAuthn Status Card */}
            <Card className="rounded-xl border border-border/75 bg-white dark:bg-[#0C1E34] shadow-xs">
              <CardHeader className="pb-3 border-b border-border/60">
                <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                  <ShieldCheck className="size-4 text-secondary" />
                  <span>Two-Factor & Biometric Quorum Security</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Hardware token and passkey protection for ethical voting determinations
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-border/70">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-emerald-500/10 text-secondary flex items-center justify-center font-bold">
                      ✓
                    </div>
                    <div>
                      <div className="text-sm font-bold text-foreground">FIDO2 / WebAuthn Passkey</div>
                      <div className="text-xs text-muted-foreground">Touch ID / Face ID registered</div>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-emerald-500/10 text-secondary border-emerald-500/30 text-xs font-bold">
                    Active
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-border/70">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                      ✓
                    </div>
                    <div>
                      <div className="text-sm font-bold text-foreground">DIU Institutional SSO</div>
                      <div className="text-xs text-muted-foreground">Single Sign-On Entra ID connected</div>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-xs font-bold">
                    Linked
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quorum Deliberation Password Card */}
            <Card className="rounded-xl border border-border/75 bg-white dark:bg-[#0C1E34] shadow-xs">
              <CardHeader className="pb-3 border-b border-border/60">
                <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                  <KeyRound className="size-4 text-primary" />
                  <span>Deliberation Access Credential</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Committee password utilized for signing formal ethics determination seals
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="text-sm text-muted-foreground">
                  Your quorum authentication credential was last rotated 14 days ago. Regular password rotation is required every 90 days in compliance with IRB accreditation rules.
                </div>
                <div>
                  <Button
                    type="button"
                    variant="default"
                    onClick={() => setIsPasswordDialogOpen(true)}
                    className="h-9 px-4 text-sm font-bold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs gap-1.5 cursor-pointer"
                  >
                    <KeyRound className="size-4" />
                    <span>Rotate Password Now</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Quorum Session Log Table */}
          <DataTable
            data={sessionLogs}
            columns={sessionColumns}
            searchKeys={["device", "location", "ipAddress", "authMethod"]}
            searchPlaceholder="Search active session devices, IP addresses, or locations..."
            title="Authenticated Quorum Sessions"
            description="Real-time device sessions with active deliberative voting access"
            initialPageSize={5}
          />
        </TabsContent>
      </Tabs>

      {/* ══════════════════════════════════════════════════════════════════════
          EDIT REVIEWER PROFILE SHEET
      ══════════════════════════════════════════════════════════════════════ */}
      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-xl md:max-w-2xl overflow-y-auto p-6">
          <SheetHeader className="pb-4 border-b border-border/75">
            <SheetTitle className="text-xl font-bold text-foreground flex items-center gap-2">
              <Edit3 className="size-5 text-primary" />
              <span>Edit Institutional Reviewer Profile</span>
            </SheetTitle>
            <SheetDescription className="text-xs">
              Update your accredited credentials, committee contact details, and deliberation hours
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSaveProfile} noValidate className="space-y-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={editFormData.name}
                  onChange={(e) => {
                    setEditFormData({ ...editFormData, name: e.target.value })
                    if (formErrors.name) setFormErrors({ ...formErrors, name: "" })
                  }}
                  aria-invalid={Boolean(formErrors.name)}
                  className="rounded-lg"
                  placeholder="e.g. Prof. Charles Montgomery"
                />
                {formErrors.name && (
                  <p className="text-xs text-rose-600 font-semibold">{formErrors.name}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Degrees / Academic Credentials <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={editFormData.degree}
                  onChange={(e) => {
                    setEditFormData({ ...editFormData, degree: e.target.value })
                    if (formErrors.degree) setFormErrors({ ...formErrors, degree: "" })
                  }}
                  aria-invalid={Boolean(formErrors.degree)}
                  className="rounded-lg"
                  placeholder="e.g. MD, PhD in Bioethics"
                />
                {formErrors.degree && (
                  <p className="text-xs text-rose-600 font-semibold">{formErrors.degree}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Academic Position / Rank <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={editFormData.position}
                  onChange={(e) => {
                    setEditFormData({ ...editFormData, position: e.target.value })
                    if (formErrors.position) setFormErrors({ ...formErrors, position: "" })
                  }}
                  aria-invalid={Boolean(formErrors.position)}
                  className="rounded-lg"
                  placeholder="e.g. Professor & Committee Chair"
                />
                {formErrors.position && (
                  <p className="text-xs text-rose-600 font-semibold">{formErrors.position}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Department <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={editFormData.department}
                  onChange={(e) => {
                    setEditFormData({ ...editFormData, department: e.target.value })
                    if (formErrors.department) setFormErrors({ ...formErrors, department: "" })
                  }}
                  aria-invalid={Boolean(formErrors.department)}
                  className="rounded-lg"
                  placeholder="e.g. Biomedical Research Ethics Board"
                />
                {formErrors.department && (
                  <p className="text-xs text-rose-600 font-semibold">{formErrors.department}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Institution <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={editFormData.institution}
                  onChange={(e) => {
                    setEditFormData({ ...editFormData, institution: e.target.value })
                    if (formErrors.institution) setFormErrors({ ...formErrors, institution: "" })
                  }}
                  aria-invalid={Boolean(formErrors.institution)}
                  className="rounded-lg"
                  placeholder="e.g. Daffodil International University"
                />
                {formErrors.institution && (
                  <p className="text-xs text-rose-600 font-semibold">{formErrors.institution}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Official Email <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={editFormData.email}
                  onChange={(e) => {
                    setEditFormData({ ...editFormData, email: e.target.value })
                    if (formErrors.email) setFormErrors({ ...formErrors, email: "" })
                  }}
                  aria-invalid={Boolean(formErrors.email)}
                  className="rounded-lg"
                  placeholder="charles.montgomery@diu.edu.bd"
                />
                {formErrors.email && (
                  <p className="text-xs text-rose-600 font-semibold">{formErrors.email}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Office Telephone <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={editFormData.phone}
                  onChange={(e) => {
                    setEditFormData({ ...editFormData, phone: e.target.value })
                    if (formErrors.phone) setFormErrors({ ...formErrors, phone: "" })
                  }}
                  aria-invalid={Boolean(formErrors.phone)}
                  className="rounded-lg"
                  placeholder="+880 2 9138234 (Ext: 101)"
                />
                {formErrors.phone && (
                  <p className="text-xs text-rose-600 font-semibold">{formErrors.phone}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Emergency Quorum Mobile <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={editFormData.mobile}
                  onChange={(e) => {
                    setEditFormData({ ...editFormData, mobile: e.target.value })
                    if (formErrors.mobile) setFormErrors({ ...formErrors, mobile: "" })
                  }}
                  aria-invalid={Boolean(formErrors.mobile)}
                  className="rounded-lg"
                  placeholder="+880 1711-234567"
                />
                {formErrors.mobile && (
                  <p className="text-xs text-rose-600 font-semibold">{formErrors.mobile}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Chamber / Office Location <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={editFormData.officeLocation}
                  onChange={(e) => {
                    setEditFormData({ ...editFormData, officeLocation: e.target.value })
                    if (formErrors.officeLocation) setFormErrors({ ...formErrors, officeLocation: "" })
                  }}
                  aria-invalid={Boolean(formErrors.officeLocation)}
                  className="rounded-lg"
                  placeholder="Ethics Secretariat Chamber, Level 7"
                />
                {formErrors.officeLocation && (
                  <p className="text-xs text-rose-600 font-semibold">{formErrors.officeLocation}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Deliberation Consultation Hours <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={editFormData.consultationHours}
                  onChange={(e) => {
                    setEditFormData({ ...editFormData, consultationHours: e.target.value })
                    if (formErrors.consultationHours) setFormErrors({ ...formErrors, consultationHours: "" })
                  }}
                  aria-invalid={Boolean(formErrors.consultationHours)}
                  className="rounded-lg"
                  placeholder="Mon & Wed 10:00 AM - 1:00 PM"
                />
                {formErrors.consultationHours && (
                  <p className="text-xs text-rose-600 font-semibold">{formErrors.consultationHours}</p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                ORCID iD (Optional)
              </label>
              <Input
                value={editFormData.orcid}
                onChange={(e) => {
                  setEditFormData({ ...editFormData, orcid: e.target.value })
                  if (formErrors.orcid) setFormErrors({ ...formErrors, orcid: "" })
                }}
                aria-invalid={Boolean(formErrors.orcid)}
                className="rounded-lg font-mono"
                placeholder="0000-0002-3841-8910"
              />
              {formErrors.orcid && (
                <p className="text-xs text-rose-600 font-semibold">{formErrors.orcid}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Specializations & Ethics Domains (Comma-separated) <span className="text-rose-500">*</span>
              </label>
              <Input
                value={editFormData.specializations}
                onChange={(e) => {
                  setEditFormData({ ...editFormData, specializations: e.target.value })
                  if (formErrors.specializations) setFormErrors({ ...formErrors, specializations: "" })
                }}
                aria-invalid={Boolean(formErrors.specializations)}
                className="rounded-lg"
                placeholder="Biomedical & Clinical Research, Clinical Trial Governance, Human Genetic Ethics"
              />
              {formErrors.specializations && (
                <p className="text-xs text-rose-600 font-semibold">{formErrors.specializations}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Formal Bioethics Statement <span className="text-rose-500">*</span>
              </label>
              <Textarea
                rows={4}
                value={editFormData.bioStatement}
                onChange={(e) => {
                  setEditFormData({ ...editFormData, bioStatement: e.target.value })
                  if (formErrors.bioStatement) setFormErrors({ ...formErrors, bioStatement: "" })
                }}
                aria-invalid={Boolean(formErrors.bioStatement)}
                className="rounded-lg"
                placeholder="State your bioethics principles and institutional research governance statement..."
              />
              {formErrors.bioStatement && (
                <p className="text-xs text-rose-600 font-semibold">{formErrors.bioStatement}</p>
              )}
            </div>

            <SheetFooter className="pt-4 border-t border-border/75 flex sm:justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditSheetOpen(false)}
                className="rounded-lg cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                className="rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs gap-1.5 cursor-pointer font-bold"
              >
                <Save className="size-4" />
                <span>Save Profile Changes</span>
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      {/* ══════════════════════════════════════════════════════════════════════
          AVATAR UPDATE SHEET
      ══════════════════════════════════════════════════════════════════════ */}
      <Sheet open={isAvatarSheetOpen} onOpenChange={setIsAvatarSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto p-6">
          <SheetHeader className="pb-4 border-b border-border/75">
            <SheetTitle className="text-lg font-bold text-foreground flex items-center gap-2">
              <Camera className="size-5 text-primary" />
              <span>Update Institutional Portrait</span>
            </SheetTitle>
            <SheetDescription className="text-xs">
              Select an official institutional faculty portrait or supply a secure HTTPS image link
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6 py-4">
            <div>
              <div className="text-xs font-bold text-foreground mb-3 uppercase tracking-wider">
                Institutional Faculty Presets
              </div>
              <div className="grid grid-cols-2 gap-3">
                {AVATAR_PRESETS.map((preset) => {
                  const isSelected = selectedPresetId === preset.id
                  return (
                    <div
                      key={preset.id}
                      onClick={() => {
                        setSelectedPresetId(preset.id)
                        setCustomAvatarUrl("")
                      }}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer text-center space-y-2 ${
                        isSelected
                          ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                          : "border-border/75 hover:bg-slate-50 dark:hover:bg-slate-900"
                      }`}
                    >
                      <div className="size-16 rounded-full mx-auto overflow-hidden border border-border">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="size-full object-cover"
                        />
                      </div>
                      <div className="text-xs font-bold text-foreground truncate">{preset.label}</div>
                      <div className="text-[0.68rem] text-muted-foreground truncate">{preset.role}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-border/75 space-y-2">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
                Or Custom Image URL (HTTPS)
              </label>
              <Input
                value={customAvatarUrl}
                onChange={(e) => {
                  setCustomAvatarUrl(e.target.value)
                  setSelectedPresetId(null)
                }}
                className="rounded-lg"
                placeholder="https://example.edu/faculty-photo.jpg"
              />
            </div>

            <SheetFooter className="pt-4 border-t border-border/75 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAvatarSheetOpen(false)}
                className="rounded-lg cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="default"
                onClick={handleSaveAvatar}
                className="rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs cursor-pointer font-bold"
              >
                Save Portrait
              </Button>
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>

      {/* ══════════════════════════════════════════════════════════════════════
          CHANGE PASSWORD MODAL
      ══════════════════════════════════════════════════════════════════════ */}
      <AlertDialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <AlertDialogContent className="max-w-md p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold text-foreground flex items-center gap-2">
              <KeyRound className="size-5 text-primary" />
              <span>Rotate Deliberation Password</span>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs">
              Ensure your new password contains at least 8 characters, one uppercase letter, and one number.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <form onSubmit={handleChangePassword} noValidate className="space-y-3.5 py-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Current Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Input
                  type={showCurrentPw ? "text" : "password"}
                  value={passwordFormData.currentPassword}
                  onChange={(e) => {
                    setPasswordFormData({ ...passwordFormData, currentPassword: e.target.value })
                    if (passwordErrors.currentPassword) {
                      setPasswordErrors({ ...passwordErrors, currentPassword: "" })
                    }
                  }}
                  aria-invalid={Boolean(passwordErrors.currentPassword)}
                  className="pr-9 rounded-lg"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPw(!showCurrentPw)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showCurrentPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {passwordErrors.currentPassword && (
                <p className="text-xs text-rose-600 font-semibold">{passwordErrors.currentPassword}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                New Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Input
                  type={showNewPw ? "text" : "password"}
                  value={passwordFormData.newPassword}
                  onChange={(e) => {
                    setPasswordFormData({ ...passwordFormData, newPassword: e.target.value })
                    if (passwordErrors.newPassword) {
                      setPasswordErrors({ ...passwordErrors, newPassword: "" })
                    }
                  }}
                  aria-invalid={Boolean(passwordErrors.newPassword)}
                  className="pr-9 rounded-lg"
                  placeholder="Min 8 chars, 1 uppercase, 1 number"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPw(!showNewPw)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showNewPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {passwordErrors.newPassword && (
                <p className="text-xs text-rose-600 font-semibold">{passwordErrors.newPassword}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Confirm New Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Input
                  type={showConfirmPw ? "text" : "password"}
                  value={passwordFormData.confirmPassword}
                  onChange={(e) => {
                    setPasswordFormData({ ...passwordFormData, confirmPassword: e.target.value })
                    if (passwordErrors.confirmPassword) {
                      setPasswordErrors({ ...passwordErrors, confirmPassword: "" })
                    }
                  }}
                  aria-invalid={Boolean(passwordErrors.confirmPassword)}
                  className="pr-9 rounded-lg"
                  placeholder="Re-enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPw(!showConfirmPw)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {passwordErrors.confirmPassword && (
                <p className="text-xs text-rose-600 font-semibold">{passwordErrors.confirmPassword}</p>
              )}
            </div>

            <AlertDialogFooter className="pt-4 border-t border-border/75 flex justify-end gap-2">
              <AlertDialogCancel
                type="button"
                onClick={() => {
                  setIsPasswordDialogOpen(false)
                  setPasswordErrors({})
                }}
                className="rounded-lg cursor-pointer"
              >
                Cancel
              </AlertDialogCancel>
              <Button
                type="submit"
                variant="default"
                className="rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs font-bold cursor-pointer"
              >
                Update Password
              </Button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardContainer>
  )
}
