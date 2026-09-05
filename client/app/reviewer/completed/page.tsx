"use client"

import * as React from "react"
import {
  Award,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Calendar,
  Building2,
  FileText,
  Zap,
  Lock,
  Copy,
  Check,
  Eye,
  User,
} from "lucide-react"
import {
  DataTable,
  type ColumnDef,
  type DataTableFilter,
} from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { KpiCard, KpiGrid } from "@/components/ui/kpi-card"
import { toast } from "@/components/ui/sonner"
import { DashboardContainer } from "@/components/dashboard/dashboard-container"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  getStoredProtocols,
  subscribeProtocols,
  syncProtocolsFromServer,
  type Protocol,
} from "@/lib/protocols-store"
import {
  getStoredReviewers,
  getActiveReviewerEmail,
  setActiveReviewerEmail as setGlobalActiveReviewerEmail,
  type AccreditedReviewer,
} from "@/lib/reviewer-roster"

export default function ReviewerCompletedPage() {
  const [protocols, setProtocols] = React.useState<Protocol[]>(getStoredProtocols)
  const [reviewers] = React.useState<AccreditedReviewer[]>(getStoredReviewers)
  const [activeReviewerEmail, setActiveReviewerEmailState] = React.useState<string>(getActiveReviewerEmail)
  const [copiedHash, setCopiedHash] = React.useState<string | null>(null)
  const [inspectingProtocol, setInspectingProtocol] = React.useState<Protocol | null>(null)

  const handlePersonaChange = (email: string) => {
    setActiveReviewerEmailState(email)
    setGlobalActiveReviewerEmail(email)
  }

  React.useEffect(() => {
    syncProtocolsFromServer().then((data) => {
      if (data && Array.isArray(data)) setProtocols(data)
    })

    const handleSync = () => {
      setProtocols(getStoredProtocols())
    }

    const handleActiveChanged = () => {
      setActiveReviewerEmailState(getActiveReviewerEmail())
    }

    window.addEventListener("ethica:active-reviewer-changed", handleActiveChanged)
    const unsubscribe = subscribeProtocols(handleSync)

    return () => {
      window.removeEventListener("ethica:active-reviewer-changed", handleActiveChanged)
      unsubscribe()
    }
  }, [])

  const currentReviewer = reviewers.find((r) => r.email === activeReviewerEmail) || {
    id: "REV-DIU-001",
    name: "Prof. Charles Montgomery",
    email: "charles.montgomery@diu.edu.bd",
    institution: "Daffodil International University",
    department: "Biomedical Research Ethics Board",
  }

  // Filter completed evaluations
  const completedProtocols = React.useMemo(() => {
    return protocols.filter(
      (p) =>
        p.assignmentStatus === "Review Completed" ||
        p.status === "Clearance Granted" ||
        p.reviewerEvaluation !== undefined
    )
  }, [protocols])

  const approvedCount = completedProtocols.filter(
    (p) => p.status === "Clearance Granted" || p.reviewerEvaluation?.recommendation === "Clearance Approved"
  ).length

  const revisionsCount = completedProtocols.filter(
    (p) => p.status === "Revision Requested" || p.reviewerEvaluation?.recommendation === "Revisions Required"
  ).length

  const rejectedCount = completedProtocols.filter(
    (p) => p.status === "Rejected" || p.reviewerEvaluation?.recommendation === "Ethics Rejection"
  ).length

  const handleCopySeal = (hash: string, e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(hash)
    setCopiedHash(hash)
    toast.info("Seal Hash Copied", {
      description: "Cryptographic SHA-256 clearance seal copied to clipboard.",
    })
    setTimeout(() => setCopiedHash(null), 2000)
  }

  // ── DataTable Columns Definition ──────────────────────────────────────────
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
            <span className="font-mono text-base font-bold text-primary dark:text-sky-300 block">
              {row.id}
            </span>
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
                <span>Expedited</span>
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
        id: "determination",
        header: "Final Determination",
        sortable: true,
        headerClassName: "w-44",
        cell: ({ row }) => {
          const evalRec = row.reviewerEvaluation?.recommendation
          const isCleared = row.status === "Clearance Granted" || evalRec === "Clearance Approved"
          const isRevision = row.status === "Revision Requested" || evalRec === "Revisions Required"

          if (isCleared) {
            return (
              <Badge className="bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30 text-xs font-bold gap-1">
                <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />
                <span>Clearance Granted</span>
              </Badge>
            )
          }

          if (isRevision) {
            return (
              <Badge className="bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30 text-xs font-bold gap-1">
                <AlertCircle className="size-3 text-amber-600 dark:text-amber-400" />
                <span>Revisions Required</span>
              </Badge>
            )
          }

          return (
            <Badge className="bg-rose-500/15 text-rose-800 dark:text-rose-300 border-rose-500/30 text-xs font-bold gap-1">
              <AlertTriangle className="size-3 text-rose-600 dark:text-rose-400" />
              <span>Ethics Rejection</span>
            </Badge>
          )
        },
      },
      {
        id: "scores",
        header: "Ethical Ratings",
        headerClassName: "w-40",
        cell: ({ row }) => {
          const ev = row.reviewerEvaluation
          if (!ev) {
            return (
              <span className="text-micro text-muted-foreground italic">
                En banc resolution
              </span>
            )
          }

          return (
            <div className="space-y-0.5 text-micro select-text">
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground">Merit:</span>
                <span className="font-bold text-foreground">{ev.scientificMeritRating || 5}/5</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground">Safeguards:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{ev.safeguardsRating || 5}/5</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground">Consent:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">{ev.consentRating || 5}/5</span>
              </div>
            </div>
          )
        },
      },
      {
        id: "seal",
        header: "Digital Seal / Hash",
        headerClassName: "w-44",
        cell: ({ row }) => {
          const seal = row.certificateSealHash
          if (!seal) {
            return (
              <span className="text-micro text-muted-foreground font-mono">
                No Certificate Issued
              </span>
            )
          }

          const isCopied = copiedHash === seal

          return (
            <div className="space-y-1 select-text">
              <div className="flex items-center gap-1 font-mono text-micro text-emerald-800 dark:text-emerald-300">
                <Lock className="size-3 text-emerald-600 shrink-0" />
                <span className="truncate max-w-28">{seal.slice(0, 16)}...</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleCopySeal(seal, e)}
                  className="size-6 p-0 hover:bg-emerald-100 dark:hover:bg-emerald-950 cursor-pointer"
                  title="Copy SHA-256 Seal"
                >
                  {isCopied ? (
                    <Check className="size-3 text-emerald-600" />
                  ) : (
                    <Copy className="size-3 text-slate-400" />
                  )}
                </Button>
              </div>
              <span className="text-[0.65rem] text-muted-foreground block">
                Issued {row.certificateIssueDate || "Aug 2026"}
              </span>
            </div>
          )
        },
      },
      {
        id: "actions",
        header: "Inspection",
        align: "right",
        headerClassName: "w-28",
        cell: ({ row }) => (
          <div className="flex items-center justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setInspectingProtocol(row)}
              className="h-8 px-2.5 font-bold text-micro gap-1 cursor-pointer"
            >
              <Eye className="size-3.5" />
              <span>Dossier</span>
            </Button>
          </div>
        ),
      },
    ],
    [copiedHash]
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
        title: "Determination",
        accessorKey: "status",
        options: [
          { label: "Clearance Granted", value: "Clearance Granted" },
          { label: "Revision Requested", value: "Revision Requested" },
          { label: "Rejected", value: "Rejected" },
        ],
      },
    ],
    []
  )

  return (
    <DashboardContainer className="space-y-6 select-text pb-12">
      {/* Reviewer Header & Persona Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base text-foreground">
              {currentReviewer.name}
            </span>
            <Badge className="bg-primary/10 text-primary dark:text-sky-300 text-micro font-bold border border-primary/20">
              IRB Committee Reviewer
            </Badge>
          </div>
          <p className="text-micro text-muted-foreground">
            {currentReviewer.department} • {currentReviewer.institution}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-micro text-muted-foreground font-medium hidden md:inline">
            Reviewer Persona:
          </span>
          <Select
            value={activeReviewerEmail}
            onValueChange={(val) => {
              if (val) handlePersonaChange(val)
            }}
          >
            <SelectTrigger className="h-9 px-3 rounded-lg border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-bold text-foreground min-w-[280px]">
              <SelectValue placeholder="Select Reviewer Persona" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="charles.montgomery@diu.edu.bd">
                Prof. Charles Montgomery (Chair, Biomedical)
              </SelectItem>
              <SelectItem value="sarah.jenkins@diu.edu.bd">
                Dr. Sarah Jenkins (Vice Chair, Pediatrics)
              </SelectItem>
              <SelectItem value="farzana.choudhury@icddrb.org">
                Dr. Farzana Choudhury (icddr,b, Epidemiology)
              </SelectItem>
              <SelectItem value="m.hasan@nimh.gov.bd">
                Dr. Mahmudul Hasan (NIMH, Social & Behavioral)
              </SelectItem>
              <SelectItem value="tariqul.islam@buet.ac.bd">
                Prof. Tariqul Islam (BUET, AI & Tech)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Completed Review Metrics */}
      <KpiGrid columns={4}>
        <KpiCard
          label="Total Deliberations Archived"
          value={completedProtocols.length}
          description="Binding committee determinations"
          icon={Award}
          color="navy"
        />
        <KpiCard
          label="Clearance Approvals"
          value={approvedCount}
          description="Full ethical clearances granted"
          icon={CheckCircle2}
          color="green"
        />
        <KpiCard
          label="Revisions Dispatched"
          value={revisionsCount}
          description="Amendments sent to investigators"
          icon={AlertCircle}
          color="amber"
        />
        <KpiCard
          label="Ethics Rejections"
          value={rejectedCount}
          description="Declined on bioethical grounds"
          icon={AlertTriangle}
          color={rejectedCount > 0 ? "rose" : "navy"}
        />
      </KpiGrid>

      {/* Centralized DataTable of Completed Protocols */}
      <DataTable
        data={completedProtocols}
        columns={columns}
        filters={filters}
        searchPlaceholder="Search archived deliberations by protocol ID, title, investigator, or department..."
        searchKeys={["id", "title", "department", "piName", "board"]}
        title="Institutional Review Archive & Sealed Determinations"
        description="Permanent institutional ledger of completed ethics deliberations, ratings, remarks, and cryptographic seals."
      />

      {/* Dossier Modal Inspection */}
      <Dialog
        open={!!inspectingProtocol}
        onOpenChange={(open) => {
          if (!open) setInspectingProtocol(null)
        }}
      >
        <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="size-5 text-primary dark:text-sky-400" />
              <span>Deliberation Dossier Record</span>
            </DialogTitle>
            <DialogDescription>
              Archived institutional determination and scoring.
            </DialogDescription>
          </DialogHeader>

          {inspectingProtocol && (
            <div className="space-y-4 py-2 text-table-cell">
              <div className="p-3 rounded-lg bg-muted border border-border space-y-1">
                <span className="font-mono font-bold text-foreground">{inspectingProtocol.id}</span>
                <h4 className="font-bold text-foreground">{inspectingProtocol.title}</h4>
                <p className="text-micro text-muted-foreground">
                  PI: {inspectingProtocol.piName || "Dr. Elena Rostova"} • {inspectingProtocol.department}
                </p>
              </div>

              {inspectingProtocol.reviewerEvaluation && (
                <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-2">
                  <span className="text-micro font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block">
                    Recorded Deliberation Remarks
                  </span>
                  <p className="text-body-sm text-foreground italic">
                    &ldquo;{inspectingProtocol.reviewerEvaluation.deliberationRemarks}&rdquo;
                  </p>
                  <div className="text-micro text-muted-foreground pt-1">
                    Evaluated by {inspectingProtocol.reviewerEvaluation.reviewerName} on {inspectingProtocol.reviewerEvaluation.evaluatedAt}
                  </div>
                </div>
              )}

              {inspectingProtocol.certificateSealHash && (
                <div className="p-3.5 rounded-lg border border-border bg-muted/40 space-y-1 font-mono text-micro">
                  <span className="font-sans font-bold text-foreground block">SHA-256 Cryptographic Seal:</span>
                  <p className="break-all text-emerald-800 dark:text-emerald-300">
                    {inspectingProtocol.certificateSealHash}
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setInspectingProtocol(null)}
            >
              Close Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardContainer>
  )
}
