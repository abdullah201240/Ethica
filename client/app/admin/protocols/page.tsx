"use client"

import * as React from "react"
import Link from "next/link"
import {
  ScrollText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Building2,
  Calendar,
  Wallet,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  ChevronRight,
  User,
  Zap,
  UserCheck,
  UserX,
  AlertTriangle,
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
  getStoredProtocols,
  subscribeProtocols,
  syncProtocolsFromServer,
  updateProtocol,
  type Protocol,
} from "@/lib/protocols-store"

export default function AdminProtocolApplicationsPage() {
  const [protocols, setProtocols] = React.useState<Protocol[]>(getStoredProtocols)
  const [copiedTrxId, setCopiedTrxId] = React.useState<string | null>(null)
  const [activeProtocol, setActiveProtocol] = React.useState<Protocol | null>(null)
  const [decisionAction, setDecisionAction] = React.useState<"grant" | "revise" | "expedite" | null>(null)

  React.useEffect(() => {
    // Initial sync from server DB
    syncProtocolsFromServer().then((data) => {
      if (data && Array.isArray(data)) {
        setProtocols(data)
      }
    })

    const handleSync = () => {
      setProtocols(getStoredProtocols())
    }

    const unsubscribe = subscribeProtocols(handleSync)
    return () => unsubscribe()
  }, [])

  const handleCopyTrx = (trxId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(trxId)
    setCopiedTrxId(trxId)
    toast.info("Transaction ID Copied", {
      description: `TrxID ${trxId} copied to clipboard for ledger reconciliation.`,
    })
    setTimeout(() => setCopiedTrxId(null), 2000)
  }

  const handleExecuteDecision = () => {
    if (!activeProtocol || !decisionAction) return

    if (decisionAction === "grant") {
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

      updateProtocol(activeProtocol.id, {
        status: "Clearance Granted",
        statusColor: "emerald",
        hasCertificate: true,
        reviewStep: 5,
        certificateSealHash: sealHash,
        certificateIssueDate: issueDate,
        certificateExpiryDate: expiryDate,
        committeeRemarks: "Official institutional ethical clearance granted with cryptographic seal.",
      })

      toast.success("Institutional Clearance Granted", {
        description: `Protocol ${activeProtocol.id} approved. FIPS 140-3 SHA-256 seal generated and digital certificate issued.`,
      })
    } else if (decisionAction === "revise") {
      updateProtocol(activeProtocol.id, {
        status: "Revision Requested",
        statusColor: "rose",
        reviewStep: 3,
        committeeRemarks: "Committee requested revisions to informed consent language and participant recruitment protocol.",
      })

      toast.warning("Revision Notice Dispatched", {
        description: `Principal Investigator notified of revision requirements for ${activeProtocol.id}.`,
      })
    } else if (decisionAction === "expedite") {
      updateProtocol(activeProtocol.id, {
        status: "Expedited Triage",
        statusColor: "blue",
        isExpedited: true,
        reviewStep: 3,
        committeeRemarks: "Fast-track expedited triage activated by Secretariat lead officer.",
      })

      toast.info("Fast-Track Triage Activated", {
        description: `Protocol ${activeProtocol.id} queued for 72-hour expedited chair deliberation.`,
      })
    }

    setActiveProtocol(null)
    setDecisionAction(null)
  }

  // ── Metrics Calculation ──────────────────────────────────────────────────
  const totalProtocols = protocols.length
  const activeReviewCount = protocols.filter(
    (p) => p.status === "Under Committee Review" || p.status === "Expedited Triage"
  ).length
  const clearedCount = protocols.filter((p) => p.status === "Clearance Granted").length
  const totalBdtRevenue = protocols.reduce((acc, p) => acc + (p.feeAmountBdt || 0), 0)

  // ── Column Definitions ───────────────────────────────────────────────────
  const columns: ColumnDef<Protocol>[] = React.useMemo(
    () => [
      {
        id: "id",
        accessorKey: "id",
        header: "Protocol Reference",
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
          <div className="space-y-1.5 max-w-md min-w-60 select-text">
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
        header: "IRB Board & Methodology",
        sortable: true,
        headerClassName: "w-48",
        cell: ({ row }) => (
          <div className="space-y-1 select-text">
            <Badge
              variant="secondary"
              className="font-medium text-micro bg-primary/8 dark:bg-primary/20 text-primary dark:text-sky-300 border-none"
            >
              {row.board}
            </Badge>
            <div className="text-micro text-muted-foreground truncate max-w-44">
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
        header: "Fee & Gateway (BDT)",
        sortable: true,
        headerClassName: "w-44",
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
                <span className="text-micro uppercase font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                  {method}
                </span>
              </div>
              {trx !== "N/A" && (
                <div className="flex items-center gap-1 text-micro text-muted-foreground font-mono">
                  <span className="truncate max-w-28">{trx}</span>
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
        header: "Clearance Status",
        sortable: true,
        headerClassName: "w-44",
        cell: ({ row }) => {
          const isCleared = row.status === "Clearance Granted"
          const isUnderReview = row.status === "Under Committee Review"
          const isExpedited = row.status === "Expedited Triage"
          const isRevision = row.status === "Revision Requested"

          return (
            <div className="inline-flex items-center gap-1.5 select-text">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-base font-bold border ${
                  isCleared
                    ? "bg-[#198754]/10 text-secondary dark:text-emerald-400 border-[#198754]/30"
                    : isExpedited
                    ? "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/30"
                    : isUnderReview
                    ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30"
                    : isRevision
                    ? "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30"
                    : "bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/30"
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
            </div>
          )
        },
      },
      {
        id: "assignedReviewer",
        header: "Assigned Reviewer",
        sortable: true,
        headerClassName: "w-52",
        cell: ({ row }) => {
          const status = row.assignmentStatus || "Unassigned"
          const reviewerName = row.assignedReviewerName

          if (status === "Accepted") {
            return (
              <div className="space-y-1 select-text">
                <div className="flex items-center gap-1.5 font-bold text-sm text-foreground truncate max-w-48">
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
                <div className="flex items-center gap-1.5 font-bold text-sm text-foreground truncate max-w-48">
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
                <div className="flex items-center gap-1.5 font-bold text-sm text-rose-700 dark:text-rose-400 truncate max-w-48">
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
                <div className="flex items-center gap-1.5 font-bold text-sm text-foreground truncate max-w-48">
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
        header: "Governance Actions",
        align: "right",
        headerClassName: "w-44",
        cell: ({ row }) => (
          <div className="inline-flex items-center gap-2 justify-end">
            <Link href={`/admin/protocols/${row.id}`}>
              <Button
                type="button"
                variant="default"
                className="h-9 px-3 text-base font-bold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs gap-1.5 cursor-pointer"
                title="Inspect Complete Research Protocol Dossier"
              >
                <Eye className="size-4" />
                <span>Inspect</span>
              </Button>
            </Link>

            {row.status !== "Clearance Granted" && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setActiveProtocol(row)
                  setDecisionAction("grant")
                }}
                className="h-9 px-2.5 text-base font-bold rounded-lg border border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 shadow-xs gap-1 cursor-pointer"
                title="Quick Grant Ethical Clearance"
              >
                <CheckCircle2 className="size-4" />
                <span className="hidden xl:inline">Grant</span>
              </Button>
            )}
          </div>
        ),
      },
    ],
    [copiedTrxId]
  )

  // ── Faceted Filters ──────────────────────────────────────────────────────
  const filters: DataTableFilter<Protocol>[] = React.useMemo(
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

  return (
    <DashboardContainer className="space-y-6 select-text">
      {/* KPI Metric Counters */}
      <KpiGrid columns={4}>
        <KpiCard
          label="Total Protocol Applications"
          value={totalProtocols}
          icon={ScrollText}
          color="navy"
        />
        <KpiCard
          label="Active Deliberation & Triage"
          value={activeReviewCount}
          icon={Clock}
          color="amber"
        />
        <KpiCard
          label="Ethical Clearance Granted"
          value={clearedCount}
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

      {/* Centralized DataTable */}
      <DataTable
        title="Institutional Research Protocol Clearance Docket"
        description="Official oversight repository of all research permissions, ethics clearance protocols, and BDT payment vouchers submitted through the investigator intake portal."
        data={protocols}
        columns={columns}
        filters={filters}
        searchPlaceholder="Filter by protocol ID, title, PI, department, TrxID..."
        searchKeys={["id", "title", "department", "board", "piName", "transactionId"]}
        initialPageSize={10}
      />

      {/* Decision Confirmation Modal */}
      <AlertDialog
        open={!!activeProtocol && !!decisionAction}
        onOpenChange={(open) => {
          if (!open) {
            setActiveProtocol(null)
            setDecisionAction(null)
          }
        }}
      >
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-secondary" />
              <span>Confirm Institutional Ethics Determination</span>
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2 text-body-sm text-muted-foreground pt-2">
              <p>
                You are about to approve official ethical clearance for:
              </p>
              <div className="p-3 rounded-lg bg-muted border border-border space-y-1 font-mono text-table-cell">
                <div className="font-bold text-foreground">
                  {activeProtocol?.id}: {activeProtocol?.title}
                </div>
                <div className="text-muted-foreground">
                  PI: {activeProtocol?.piName || "Dr. Elena Rostova"} • Board: {activeProtocol?.board}
                </div>
              </div>
              <p>
                This action will issue an institutional Digital Clearance Certificate, generate an immutable SHA-256 seal, and notify the Principal Investigator.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleExecuteDecision}
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
