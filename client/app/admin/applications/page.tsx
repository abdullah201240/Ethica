"use client"

import * as React from "react"
import Link from "next/link"
import {
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Building2,
  Calendar,
  ExternalLink,
  ScrollText,
  ClipboardCheck,
  Wallet,
  Copy,
  Check,
  Zap,
  User,
  ShieldCheck,
  UserCheck,
  UserX,
  AlertTriangle,
  ChevronRight,
} from "lucide-react"
import {
  DataTable,
  type ColumnDef,
  type DataTableFilter,
} from "@/components/ui/data-table"
import { KpiCard, KpiGrid } from "@/components/ui/kpi-card"
import { DashboardContainer } from "@/components/dashboard/dashboard-container"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/sonner"
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
import {
  type ReviewerApplication,
  initialReviewerApplications,
  getStoredApplications,
  subscribeApplications,
  updateReviewerApplicationStatus,
} from "@/lib/reviewer-applications"
import {
  getStoredProtocols,
  subscribeProtocols,
  syncProtocolsFromServer,
  updateProtocol,
  type Protocol,
} from "@/lib/protocols-store"

export default function AdminApplicationsManagementPage() {
  const [activeTab, setActiveTab] = React.useState<"protocols" | "reviewers">("protocols")

  // ── Protocol State ───────────────────────────────────────────────────────
  const [protocols, setProtocols] = React.useState<Protocol[]>(getStoredProtocols)
  const [copiedTrxId, setCopiedTrxId] = React.useState<string | null>(null)
  const [activeProtocol, setActiveProtocol] = React.useState<Protocol | null>(null)

  React.useEffect(() => {
    syncProtocolsFromServer().then((data) => {
      if (data && Array.isArray(data)) setProtocols(data)
    })
    const handleSync = () => setProtocols(getStoredProtocols())
    const unsubscribe = subscribeProtocols(handleSync)
    return () => unsubscribe()
  }, [])

  // ── Reviewer State ───────────────────────────────────────────────────────
  const isClient = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )

  const reviewerApplications = React.useSyncExternalStore(
    subscribeApplications,
    getStoredApplications,
    () => initialReviewerApplications
  )

  const handleApproveReviewer = (appId: string, fullName: string) => {
    updateReviewerApplicationStatus(
      appId,
      "Approved",
      "Accreditation approved by Institutional Ethics Secretariat."
    )
    toast.success("Reviewer Accreditation Granted", {
      description: `${fullName} (${appId}) is now accredited into the Institutional Reviewer Roster.`,
    })
  }

  const handleRejectReviewer = (appId: string, fullName: string) => {
    updateReviewerApplicationStatus(
      appId,
      "Rejected",
      "Application declined by Secretariat due to eligibility thresholds."
    )
    toast.error("Application Declined", {
      description: `Application declined for ${fullName} (${appId}). Formal determination logged in institutional ledger.`,
    })
  }

  const handleQuickGrantProtocol = (protocol: Protocol) => {
    const sealHash = Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("")
    const now = new Date()
    const issueDate = now.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    })
    const nextYear = new Date(now)
    nextYear.setFullYear(nextYear.getFullYear() + 1)
    const expiryDate = nextYear.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    })

    updateProtocol(protocol.id, {
      status: "Clearance Granted",
      statusColor: "emerald",
      hasCertificate: true,
      reviewStep: 5,
      certificateSealHash: sealHash,
      certificateIssueDate: issueDate,
      certificateExpiryDate: expiryDate,
      committeeRemarks: "Institutional ethical clearance officially granted by Secretariat.",
    })

    toast.success("Ethical Clearance Granted", {
      description: `Protocol ${protocol.id} approved. Digital certificate and SHA-256 seal issued.`,
    })
    setActiveProtocol(null)
  }

  const handleCopyTrx = (trxId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(trxId)
    setCopiedTrxId(trxId)
    toast.info("Transaction ID Copied", {
      description: `TrxID ${trxId} copied to clipboard.`,
    })
    setTimeout(() => setCopiedTrxId(null), 2000)
  }

  // ── Protocol Metrics ─────────────────────────────────────────────────────
  const totalProtocols = protocols.length
  const activeProtocolsCount = protocols.filter(
    (p) => p.status === "Under Committee Review" || p.status === "Expedited Triage"
  ).length
  const clearedProtocolsCount = protocols.filter((p) => p.status === "Clearance Granted").length
  const totalBdtRevenue = protocols.reduce((acc, p) => acc + (p.feeAmountBdt || 0), 0)

  // ── Reviewer Metrics ─────────────────────────────────────────────────────
  const totalReviewerApps = reviewerApplications.length
  const pendingReviewersCount = reviewerApplications.filter(
    (a) => a.status === "Pending Verification"
  ).length
  const approvedReviewersCount = reviewerApplications.filter(
    (a) => a.status === "Approved"
  ).length
  const rejectedReviewersCount = reviewerApplications.filter(
    (a) => a.status === "Rejected"
  ).length

  // ── Protocol Columns ─────────────────────────────────────────────────────
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
            <Link
              href={`/admin/protocols/${row.id}`}
              className="font-mono text-base font-bold text-primary dark:text-sky-300 hover:underline block"
            >
              {row.id}
            </Link>
            <div className="flex items-center gap-1 text-micro text-slate-400 dark:text-slate-500 whitespace-nowrap">
              <Calendar className="size-3 shrink-0" />
              <span>{row.submissionDate}</span>
            </div>
            {row.isExpedited && (
              <Badge
                variant="outline"
                className="bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20 text-[0.68rem] px-1.5 py-0 font-bold inline-flex items-center gap-0.5"
              >
                <Zap className="size-2.5 text-sky-600 dark:text-sky-400" />
                <span>Fast-Track</span>
              </Badge>
            )}
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
            <Link
              href={`/admin/protocols/${row.id}`}
              className="font-bold text-foreground text-table-cell leading-snug hover:text-primary dark:hover:text-sky-300 line-clamp-2 block"
            >
              {row.title}
            </Link>
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
          <div className="space-y-0.5 select-text">
            <Badge
              variant="secondary"
              className="font-medium text-micro bg-primary/8 dark:bg-primary/20 text-primary dark:text-sky-300 border-none"
            >
              {row.board}
            </Badge>
            <div className="text-micro text-muted-foreground truncate max-w-40">
              {row.studyType || "Observational Study"}
            </div>
          </div>
        ),
      },
      {
        id: "risk",
        accessorKey: "risk",
        header: "Risk Tier",
        sortable: true,
        headerClassName: "w-32",
        cell: ({ row }) => {
          const isExempt = row.risk === "Exempt - Fast Track"
          const isMinimal = row.risk === "Minimal Risk"
          return (
            <div className="inline-flex items-center gap-1.5 select-text">
              <span
                className={`size-2 rounded-full shrink-0 ${
                  isExempt
                    ? "bg-emerald-500"
                    : isMinimal
                    ? "bg-sky-500"
                    : "bg-purple-500"
                }`}
              />
              <span className="text-base font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">
                {row.risk}
              </span>
            </div>
          )
        },
      },
      {
        id: "feeAmountBdt",
        accessorKey: "feeAmountBdt",
        header: "Fee (BDT)",
        sortable: true,
        headerClassName: "w-40",
        cell: ({ row }) => {
          const fee = row.feeAmountBdt ?? 0
          const method = row.paymentMethod || "bKash"
          const trx = row.transactionId || "N/A"
          const isCopied = copiedTrxId === trx

          return (
            <div className="space-y-1 select-text">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base text-foreground tabular-nums">
                  ৳ {fee.toLocaleString()}
                </span>
                <span className="text-micro uppercase font-mono px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                  {method}
                </span>
              </div>
              {trx !== "N/A" && (
                <div className="flex items-center gap-1 text-micro text-muted-foreground font-mono">
                  <span className="truncate max-w-24">{trx}</span>
                  <button
                    type="button"
                    onClick={(e) => handleCopyTrx(trx, e)}
                    className="text-slate-400 hover:text-primary dark:hover:text-sky-400 p-0.5 rounded cursor-pointer transition-colors"
                    title="Copy Transaction ID"
                  >
                    {isCopied ? (
                      <Check className="size-3 text-emerald-600" />
                    ) : (
                      <Copy className="size-3" />
                    )}
                  </button>
                </div>
              )}
            </div>
          )
        },
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Status",
        sortable: true,
        headerClassName: "w-40",
        cell: ({ row }) => {
          const isCleared = row.status === "Clearance Granted"
          const isUnderReview = row.status === "Under Committee Review"
          const isExpedited = row.status === "Expedited Triage"

          return (
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-base font-bold border select-text ${
                isCleared
                  ? "bg-[#198754]/10 text-secondary dark:text-emerald-400 border-[#198754]/30"
                  : isExpedited
                  ? "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/30"
                  : isUnderReview
                  ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30"
                  : "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30"
              }`}
            >
              <span
                className={`size-1.5 rounded-full ${
                  isCleared
                    ? "bg-[#198754]"
                    : isExpedited
                    ? "bg-sky-500 animate-pulse"
                    : isUnderReview
                    ? "bg-amber-500 animate-pulse"
                    : "bg-rose-500"
                }`}
              />
              <span className="whitespace-nowrap">{row.status}</span>
            </span>
          )
        },
      },
      {
        id: "assignedReviewer",
        header: "Assigned Reviewer",
        sortable: true,
        headerClassName: "w-48",
        cell: ({ row }) => {
          const status = row.assignmentStatus || "Unassigned"
          const reviewerName = row.assignedReviewerName

          if (status === "Accepted") {
            return (
              <div className="space-y-1 select-text">
                <div className="flex items-center gap-1.5 font-bold text-sm text-foreground truncate max-w-44">
                  <UserCheck className="size-3.5 text-secondary shrink-0" />
                  <span className="truncate">{reviewerName}</span>
                </div>
                <Badge
                  variant="outline"
                  className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[0.68rem] px-1.5 py-0 font-semibold inline-flex items-center gap-1"
                >
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  <span>Reviewing</span>
                </Badge>
              </div>
            )
          }

          if (status === "Pending Acceptance") {
            return (
              <div className="space-y-1 select-text">
                <div className="flex items-center gap-1.5 font-bold text-sm text-foreground truncate max-w-44">
                  <Clock className="size-3.5 text-amber-500 shrink-0" />
                  <span className="truncate">{reviewerName}</span>
                </div>
                <Badge
                  variant="outline"
                  className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 text-[0.68rem] px-1.5 py-0 font-semibold inline-flex items-center gap-1"
                >
                  <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <span>Pending Acceptance</span>
                </Badge>
              </div>
            )
          }

          if (status === "Declined") {
            return (
              <div className="space-y-1 select-text">
                <div className="flex items-center gap-1.5 font-bold text-sm text-rose-700 dark:text-rose-400 truncate max-w-44">
                  <AlertTriangle className="size-3.5 text-rose-500 shrink-0" />
                  <span className="truncate">{reviewerName}</span>
                </div>
                <Link
                  href={`/admin/protocols/${row.id}`}
                  className="inline-flex items-center gap-1 text-[0.68rem] font-bold text-rose-600 dark:text-rose-400 hover:underline"
                >
                  <span>Declined • Reassign</span>
                  <ChevronRight className="size-2.5" />
                </Link>
              </div>
            )
          }

          if (status === "Review Completed") {
            return (
              <div className="space-y-1 select-text">
                <div className="flex items-center gap-1.5 font-bold text-sm text-foreground truncate max-w-44">
                  <CheckCircle2 className="size-3.5 text-secondary shrink-0" />
                  <span className="truncate">{reviewerName}</span>
                </div>
                <Badge
                  variant="outline"
                  className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30 text-[0.68rem] px-1.5 py-0 font-semibold inline-flex items-center gap-1"
                >
                  <span>Evaluation Done</span>
                </Badge>
              </div>
            )
          }

          return (
            <div className="space-y-1 select-text">
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                <UserX className="size-3.5 text-slate-400 shrink-0" />
                <span>Unassigned</span>
              </span>
              <div>
                <Link
                  href={`/admin/protocols/${row.id}`}
                  className="inline-flex items-center gap-0.5 text-[0.68rem] font-bold text-primary dark:text-sky-400 hover:underline"
                >
                  <span>Assign Reviewer</span>
                  <ChevronRight className="size-2.5" />
                </Link>
              </div>
            </div>
          )
        },
      },
      {
        id: "actions",
        header: "Actions",
        align: "right",
        headerClassName: "w-44",
        cell: ({ row }) => (
          <div className="inline-flex items-center gap-1.5 justify-end">
            <Link href={`/admin/protocols/${row.id}`}>
              <Button
                type="button"
                variant="default"
                className="h-8 px-2.5 text-base font-bold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs gap-1 cursor-pointer"
                title="Inspect Protocol Dossier"
              >
                <Eye className="size-3.5" />
                <span>Inspect</span>
              </Button>
            </Link>

            {row.status !== "Clearance Granted" && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveProtocol(row)}
                className="h-8 px-2 text-base font-bold rounded-lg border border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 shadow-xs gap-1 cursor-pointer"
                title="Grant Clearance"
              >
                <CheckCircle2 className="size-3.5" />
                <span>Grant</span>
              </Button>
            )}
          </div>
        ),
      },
    ],
    [copiedTrxId]
  )

  // ── Reviewer Columns ─────────────────────────────────────────────────────
  const reviewerColumns: ColumnDef<ReviewerApplication>[] = React.useMemo(
    () => [
      {
        id: "id",
        accessorKey: "id",
        header: "Application ID",
        sortable: true,
        headerClassName: "w-36",
        cell: ({ row }) => (
          <div className="space-y-1 select-text">
            <span className="font-mono text-base font-bold text-primary dark:text-sky-300 block">
              {row.id}
            </span>
            <div className="flex items-center gap-1 text-base text-slate-400 dark:text-slate-500">
              <Calendar className="size-3" />
              <span>{row.submittedAt}</span>
            </div>
          </div>
        ),
      },
      {
        id: "fullName",
        accessorKey: "fullName",
        header: "Applicant & Institution",
        sortable: true,
        cell: ({ row }) => (
          <div className="space-y-1 max-w-sm select-text">
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-foreground">
                {row.fullName}
              </span>
              <span className="text-base font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {row.degree}
              </span>
            </div>
            <div className="text-base text-muted-foreground flex items-center gap-1.5 truncate">
              <Building2 className="size-3 shrink-0 text-slate-400" />
              <span className="truncate">{row.position} • {row.institution}</span>
            </div>
          </div>
        ),
      },
      {
        id: "department",
        accessorKey: "department",
        header: "Department",
        sortable: true,
        cell: ({ row }) => (
          <span className="text-base text-slate-600 dark:text-slate-300 select-text">
            {row.department}
          </span>
        ),
      },
      {
        id: "expertise",
        header: "Domain Expertise",
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1 max-w-56 select-text">
            {row.expertise.slice(0, 2).map((exp) => (
              <Badge
                key={exp}
                variant="secondary"
                className="text-base font-medium px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-none truncate"
              >
                {exp}
              </Badge>
            ))}
            {row.expertise.length > 2 && (
              <Badge
                variant="outline"
                className="text-base font-mono px-1.5 py-0.5 text-muted-foreground border-slate-300 dark:border-slate-700"
              >
                +{row.expertise.length - 2}
              </Badge>
            )}
          </div>
        ),
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Status",
        sortable: true,
        headerClassName: "w-44",
        cell: ({ row }) => {
          const isPending = row.status === "Pending Verification"
          const isApproved = row.status === "Approved"

          return (
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-base font-bold border select-text ${
                isApproved
                  ? "bg-[#198754]/10 text-secondary dark:text-emerald-400 border-[#198754]/30"
                  : isPending
                  ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30"
                  : "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30"
              }`}
            >
              <span
                className={`size-1.5 rounded-full ${
                  isApproved
                    ? "bg-[#198754]"
                    : isPending
                    ? "bg-amber-500 animate-pulse"
                    : "bg-rose-500"
                }`}
              />
              <span>{row.status}</span>
            </span>
          )
        },
      },
      {
        id: "actions",
        header: "Actions",
        align: "right",
        headerClassName: "w-44",
        cell: ({ row }) => (
          <div className="inline-flex items-center gap-1.5 justify-end">
            <Link href={`/admin/applications/${row.id}`}>
              <Button
                type="button"
                variant="default"
                className="h-8 px-2.5 text-base font-bold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs gap-1 cursor-pointer"
                title="Inspect Applicant Dossier"
              >
                <Eye className="size-3.5" />
                <span>Inspect</span>
              </Button>
            </Link>

            {row.status === "Approved" && (
              <Link href={`/admin/roster?search=${encodeURIComponent(row.fullName)}`}>
                <Button
                  type="button"
                  variant="outline"
                  className="h-8 px-2.5 text-base font-bold rounded-lg border border-emerald-400/80 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 shadow-xs gap-1 cursor-pointer"
                  title="View in Reviewer Roster"
                >
                  <Users className="size-3.5" />
                  <span className="hidden xl:inline">Roster</span>
                </Button>
              </Link>
            )}
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
        id: "status",
        title: "Clearance Status",
        accessorKey: "status",
        options: [
          { label: "Under Committee Review", value: "Under Committee Review" },
          { label: "Expedited Triage", value: "Expedited Triage" },
          { label: "Clearance Granted", value: "Clearance Granted" },
          { label: "Revision Requested", value: "Revision Requested" },
        ],
      },
      {
        id: "assignmentStatus",
        title: "Reviewer Status",
        accessorKey: "assignmentStatus",
        options: [
          { label: "Unassigned", value: "Unassigned" },
          { label: "Pending Acceptance", value: "Pending Acceptance" },
          { label: "Accepted (Reviewing)", value: "Accepted" },
          { label: "Declined", value: "Declined" },
          { label: "Review Completed", value: "Review Completed" },
        ],
      },
      {
        id: "risk",
        title: "Exposure Risk",
        accessorKey: "risk",
        options: [
          { label: "Exempt - Fast Track", value: "Exempt - Fast Track" },
          { label: "Minimal Risk", value: "Minimal Risk" },
          { label: "Greater Than Minimal", value: "Greater Than Minimal" },
        ],
      },
    ],
    []
  )

  const reviewerFilters: DataTableFilter<ReviewerApplication>[] = React.useMemo(
    () => [
      {
        id: "status",
        title: "Status",
        accessorKey: "status",
        options: [
          { label: "Pending Verification", value: "Pending Verification" },
          { label: "Approved", value: "Approved" },
          { label: "Rejected", value: "Rejected" },
        ],
      },
      {
        id: "department",
        title: "Department",
        accessorKey: "department",
        options: [
          { label: "Clinical Medicine", value: "Clinical Medicine" },
          { label: "Public Health", value: "Public Health" },
          { label: "Computer Science & Engineering", value: "Computer Science & Engineering" },
          { label: "Social & Behavioral Sciences", value: "Social & Behavioral Sciences" },
        ],
      },
    ],
    []
  )

  return (
    <DashboardContainer className="space-y-6 select-text">
      {/* Institutional Tab Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 self-start">
          <button
            type="button"
            onClick={() => setActiveTab("protocols")}
            className={`px-4 py-2 text-base font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "protocols"
                ? "bg-white dark:bg-[#0C1E34] text-primary dark:text-sky-300 shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ScrollText className="size-4" />
            <span>Research Protocol Clearance ({totalProtocols})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("reviewers")}
            className={`px-4 py-2 text-base font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "reviewers"
                ? "bg-white dark:bg-[#0C1E34] text-primary dark:text-sky-300 shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ClipboardCheck className="size-4" />
            <span>Reviewer Accreditation ({totalReviewerApps})</span>
          </button>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {activeTab === "protocols" ? (
            <Link
              href="/apply"
              target="_blank"
              className="inline-flex items-center h-9 px-3.5 bg-primary text-primary-foreground font-bold text-base rounded-lg transition-colors shadow-xs"
            >
              <ExternalLink className="size-3.5 mr-1.5" />
              <span>Open Researcher /apply Wizard</span>
            </Link>
          ) : (
            <Link
              href="/reviewer/apply"
              target="_blank"
              className="inline-flex items-center h-9 px-3.5 bg-primary text-primary-foreground font-bold text-base rounded-lg transition-colors shadow-xs"
            >
              <ExternalLink className="size-3.5 mr-1.5" />
              <span>Open Reviewer /apply Form</span>
            </Link>
          )}
        </div>
      </div>

      {activeTab === "protocols" ? (
        <>
          {/* Protocol KPI Cards */}
          <KpiGrid columns={4}>
            <KpiCard
              label="Protocol Applications"
              value={totalProtocols}
              icon={ScrollText}
              color="navy"
            />
            <KpiCard
              label="Active Deliberation"
              value={activeProtocolsCount}
              icon={Clock}
              color="amber"
            />
            <KpiCard
              label="Clearance Granted"
              value={clearedProtocolsCount}
              icon={CheckCircle2}
              color="green"
            />
            <KpiCard
              label="Processing Fees Collected"
              value={`৳ ${totalBdtRevenue.toLocaleString()} BDT`}
              icon={Wallet}
              color="gold"
            />
          </KpiGrid>

          {/* Protocols DataTable */}
          <DataTable
            title="Institutional Research Protocol Clearance Docket"
            description="Complete oversight register of all research permissions, ethical clearances, and BDT payment vouchers submitted via /apply."
            data={protocols}
            columns={protocolColumns}
            filters={protocolFilters}
            searchPlaceholder="Search by protocol ID, title, PI, department, TrxID..."
            searchKeys={["id", "title", "department", "board", "piName", "transactionId"]}
            initialPageSize={10}
          />
        </>
      ) : (
        <>
          {/* Reviewer KPI Cards */}
          <KpiGrid columns={4}>
            <KpiCard
              label="Total Applications"
              value={totalReviewerApps}
              icon={Users}
              color="navy"
            />
            <KpiCard
              label="Pending Verification"
              value={pendingReviewersCount}
              icon={Clock}
              color="amber"
            />
            <KpiCard
              label="Accredited Reviewers"
              value={approvedReviewersCount}
              icon={CheckCircle2}
              color="green"
            />
            <KpiCard
              label="Declined Applications"
              value={rejectedReviewersCount}
              icon={XCircle}
              color="rose"
            />
          </KpiGrid>

          {/* Reviewer DataTable */}
          <DataTable<ReviewerApplication>
            title="Institutional Reviewer Accreditation Intake Docket"
            description="Evaluations, academic credentials, and accreditation determinations for faculty and clinicians applying for IRB committee membership."
            data={reviewerApplications}
            columns={reviewerColumns}
            filters={reviewerFilters}
            searchPlaceholder="Search by applicant name, email, department, institution..."
            searchKeys={["fullName", "email", "institution", "department", "degree"]}
            initialPageSize={10}
          />
        </>
      )}

      {/* Protocol Quick Clearance AlertDialog */}
      <AlertDialog
        open={!!activeProtocol}
        onOpenChange={(open) => {
          if (!open) setActiveProtocol(null)
        }}
      >
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-secondary" />
              <span>Grant Ethical Clearance</span>
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2 text-body-sm text-muted-foreground pt-2">
              <p>Are you sure you want to approve institutional ethical clearance for:</p>
              <div className="p-3 rounded-lg bg-muted border border-border font-mono text-table-cell">
                <span className="font-bold text-foreground">{activeProtocol?.id}</span>: {activeProtocol?.title}
              </div>
              <p>This action will issue a Digital Clearance Certificate with a SHA-256 seal.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => activeProtocol && handleQuickGrantProtocol(activeProtocol)}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold"
            >
              Confirm Clearance
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardContainer>
  )
}
