"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Building2,
  Calendar,
  Clock,
  AlertCircle,
  Download,
  FileText,
  ShieldCheck,
  Award,
  Wallet,
  Check,
  Users,
  Copy,
  Printer,
  FileCheck2,
  Sparkles,
  Zap,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Lock,
  User,
  Hash,
  UserPlus,
  UserCheck,
  UserX,
  RotateCcw,
  Search,
  CheckCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { DashboardContainer } from "@/components/dashboard/dashboard-container"
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  getProtocolById,
  updateProtocol,
  subscribeProtocols,
  syncProtocolsFromServer,
  assignReviewerToProtocol,
  type Protocol,
} from "@/lib/protocols-store"
import {
  getStoredReviewers,
  subscribeReviewers,
  type AccreditedReviewer,
} from "@/lib/reviewer-roster"

interface PageProps {
  params: Promise<{ id: string }>
}

export default function AdminProtocolInspectionPage({ params }: PageProps) {
  const resolvedParams = React.use(params)
  const protocolId = resolvedParams.id

  const [protocol, setProtocol] = React.useState<Protocol | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [copiedTrx, setCopiedTrx] = React.useState(false)
  const [copiedHash, setCopiedHash] = React.useState(false)
  const [decisionAction, setDecisionAction] = React.useState<"grant" | "revise" | "expedite" | null>(null)

  // ── Reviewer Assignment State ────────────────────────────────────────────
  const [isAssignModalOpen, setIsAssignModalOpen] = React.useState(false)
  const [reviewers, setReviewers] = React.useState<AccreditedReviewer[]>(getStoredReviewers)
  const [reviewerSearch, setReviewerSearch] = React.useState("")
  const [selectedReviewerId, setSelectedReviewerId] = React.useState<string | null>(null)

  React.useEffect(() => {
    syncProtocolsFromServer().then(() => {
      const found = getProtocolById(protocolId)
      if (found) {
        setProtocol(found)
        if (found.assignedReviewerId) {
          setSelectedReviewerId(found.assignedReviewerId)
        }
      }
      setLoading(false)
    })

    const handleSync = () => {
      const found = getProtocolById(protocolId)
      if (found) {
        setProtocol(found)
        if (found.assignedReviewerId) {
          setSelectedReviewerId(found.assignedReviewerId)
        }
      }
    }

    const unsubscribeProtocols = subscribeProtocols(handleSync)
    const unsubscribeReviewers = subscribeReviewers(() => {
      setReviewers(getStoredReviewers())
    })

    return () => {
      unsubscribeProtocols()
      unsubscribeReviewers()
    }
  }, [protocolId])

  const handleCopyTrx = () => {
    if (!protocol?.transactionId) return
    navigator.clipboard.writeText(protocol.transactionId)
    setCopiedTrx(true)
    toast.info("Transaction ID Copied", {
      description: `TrxID ${protocol.transactionId} copied to clipboard.`,
    })
    setTimeout(() => setCopiedTrx(false), 2000)
  }

  const handleCopySeal = () => {
    if (!protocol?.certificateSealHash) return
    navigator.clipboard.writeText(protocol.certificateSealHash)
    setCopiedHash(true)
    toast.info("Cryptographic Hash Copied", {
      description: "FIPS 140-3 SHA-256 seal hash copied to clipboard.",
    })
    setTimeout(() => setCopiedHash(false), 2000)
  }

  const handleDispatchAssignment = () => {
    if (!protocol || !selectedReviewerId) return
    const candidate = reviewers.find((r) => r.id === selectedReviewerId)
    if (!candidate) return

    if (isDeclined && candidate.id === protocol.assignedReviewerId) {
      toast.error("Alternative Reviewer Required", {
        description: `${candidate.name} previously declined this protocol. Please select an alternative accredited reviewer.`,
      })
      return
    }

    const updated = assignReviewerToProtocol(protocol.id, {
      id: candidate.id,
      name: candidate.name,
      email: candidate.email,
    })

    if (updated) {
      setProtocol(updated)
    }

    setIsAssignModalOpen(false)
    toast.success(isDeclined ? "Protocol Reassigned Successfully" : "Review Request Dispatched", {
      description: `Review request for ${protocol.id} dispatched to ${candidate.name} (${candidate.institution}). Awaiting reviewer acceptance.`,
    })
  }

  const handleExecuteDecision = () => {
    if (!protocol || !decisionAction) return

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

      const updated = updateProtocol(protocol.id, {
        status: "Clearance Granted",
        statusColor: "emerald",
        hasCertificate: true,
        reviewStep: 5,
        certificateSealHash: sealHash,
        certificateIssueDate: issueDate,
        certificateExpiryDate: expiryDate,
        committeeRemarks: "Institutional clearance unconditionally granted by IRB Secretariat.",
      })

      if (updated) setProtocol(updated)
      toast.success("Institutional Clearance Granted", {
        description: `Protocol ${protocol.id} marked as cleared. Digital certificate and SHA-256 seal issued.`,
      })
    } else if (decisionAction === "revise") {
      const updated = updateProtocol(protocol.id, {
        status: "Revision Requested",
        statusColor: "rose",
        reviewStep: 3,
        committeeRemarks: "Clarification required on participant anonymization and survey sample distribution.",
      })

      if (updated) setProtocol(updated)
      toast.warning("Protocol Revisions Requested", {
        description: `Formal revision request dispatched to ${protocol.piName || "Principal Investigator"}.`,
      })
    } else if (decisionAction === "expedite") {
      const updated = updateProtocol(protocol.id, {
        status: "Expedited Triage",
        statusColor: "blue",
        isExpedited: true,
        reviewStep: 3,
        committeeRemarks: "Fast-track 72-hour review priority activated.",
      })

      if (updated) setProtocol(updated)
      toast.info("Fast-Track Triage Queued", {
        description: `Protocol ${protocol.id} elevated to expedited priority docket.`,
      })
    }

    setDecisionAction(null)
  }

  if (loading) {
    return (
      <DashboardContainer className="py-8">
        <div className="rounded-xl border border-border/80 bg-card p-8 text-center space-y-3">
          <p className="text-body-sm text-muted-foreground">Loading protocol dossier from institutional ledger...</p>
        </div>
      </DashboardContainer>
    )
  }

  if (!protocol) {
    return (
      <DashboardContainer className="py-8 space-y-6">
        <Link
          href="/admin/protocols"
          className="inline-flex items-center gap-2 text-table-cell font-bold text-primary dark:text-sky-300 hover:underline"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Protocol Applications Docket</span>
        </Link>
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-8 text-center space-y-4">
          <AlertCircle className="size-10 text-rose-500 mx-auto" />
          <h2 className="text-section-heading text-foreground">Protocol Record Not Found</h2>
          <p className="text-body-sm text-muted-foreground max-w-md mx-auto">
            The requested research protocol identifier <code className="font-mono font-bold text-foreground">{protocolId}</code> does not exist in the institutional registry.
          </p>
          <Link href="/admin/protocols">
            <Button variant="default" className="mt-2">
              Return to Protocol Applications
            </Button>
          </Link>
        </div>
      </DashboardContainer>
    )
  }

  const isCleared = protocol.status === "Clearance Granted"
  const isExpedited = protocol.status === "Expedited Triage" || protocol.isExpedited
  const isUnderReview = protocol.status === "Under Committee Review"
  const isRevision = protocol.status === "Revision Requested"

  const stepNumber = protocol.reviewStep || (isCleared ? 5 : 4)

  const isDeclined = protocol.assignmentStatus === "Declined"
  const isPendingAcceptance = protocol.assignmentStatus === "Pending Acceptance"
  const isAccepted = protocol.assignmentStatus === "Accepted"
  const isReviewCompleted = protocol.assignmentStatus === "Review Completed"

  // ── Smart Reviewer Matching Algorithm ────────────────────────────────────
  const scoredReviewers = React.useMemo(() => {
    if (!protocol) return []

    const pBoard = protocol.board.toLowerCase()
    const searchCorpus = `${protocol.department} ${protocol.studyType || ""} ${protocol.title} ${protocol.abstract || ""}`.toLowerCase()

    return reviewers.map((rev) => {
      const isPrevDeclined = isDeclined && protocol.assignedReviewerId === rev.id
      const rBoard = rev.board.toLowerCase()

      const isBoardMatch =
        (pBoard.includes("biomedical") && rBoard.includes("biomedical")) ||
        (pBoard.includes("social") && rBoard.includes("social")) ||
        (pBoard.includes("ai") && (rBoard.includes("ai") || rBoard.includes("tech")))

      const matchedSpecs = rev.specializations.filter((spec) => {
        const s = spec.toLowerCase()
        return searchCorpus.includes(s) || s.split(" ").some((w) => w.length > 3 && searchCorpus.includes(w))
      })
      const isDeptMatch = searchCorpus.includes(rev.department.toLowerCase())
      const hasDomainMatch = matchedSpecs.length > 0 || isDeptMatch

      let score = 0
      const matchBadges: string[] = []

      if (isBoardMatch) {
        score += 50
        matchBadges.push("IRB Board Match")
      }
      if (hasDomainMatch) {
        score += 30
        matchBadges.push(matchedSpecs[0] || "Domain Match")
      }
      if (rev.assignedProtocols <= 2) {
        score += 20
        matchBadges.push("Optimal Capacity")
      } else if (rev.assignedProtocols <= 4) {
        score += 10
        matchBadges.push("Moderate Workload")
      }

      if (isPrevDeclined) {
        score = 0
      }

      return {
        ...rev,
        matchScore: score,
        isBoardMatch,
        hasDomainMatch,
        matchBadges,
        isPrevDeclined,
      }
    })
  }, [protocol, reviewers, isDeclined])

  // Filter & sort: highest match scores first, previously declined at bottom
  const filteredReviewers = React.useMemo(() => {
    const list = scoredReviewers.filter((r) => {
      if (!reviewerSearch.trim()) return true
      const q = reviewerSearch.toLowerCase()
      return (
        r.name.toLowerCase().includes(q) ||
        r.institution.toLowerCase().includes(q) ||
        r.department.toLowerCase().includes(q) ||
        r.specializations.some((s) => s.toLowerCase().includes(q))
      )
    })

    return list.sort((a, b) => {
      if (a.isPrevDeclined) return 1
      if (b.isPrevDeclined) return -1
      return b.matchScore - a.matchScore
    })
  }, [scoredReviewers, reviewerSearch])

  return (
    <DashboardContainer className="space-y-6 select-text pb-12">
      {/* Top Back-Navigation Bar */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/admin/protocols"
          className="inline-flex items-center gap-2 text-table-cell font-bold text-primary dark:text-sky-300 hover:underline"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Protocol Applications Docket</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="font-mono text-micro text-slate-400 dark:text-slate-500">
            FIPS 140-3 Ledger Verified
          </span>
          <span className="size-2 rounded-full bg-emerald-500" />
        </div>
      </div>

      {/* Primary Dossier Header Card */}
      <div className="rounded-xl sm:rounded-2xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] p-5 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-base font-black px-2.5 py-0.5 rounded bg-primary/10 dark:bg-sky-950/60 text-primary dark:text-sky-300 border border-primary/20">
                {protocol.id}
              </span>
              <Badge
                variant="outline"
                className="text-base font-semibold border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                {protocol.board}
              </Badge>
              {isExpedited && (
                <Badge
                  variant="outline"
                  className="bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20 text-base font-bold inline-flex items-center gap-1"
                >
                  <Zap className="size-3 text-sky-600 dark:text-sky-400" />
                  <span>Fast-Track Expedited</span>
                </Badge>
              )}
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-base font-bold border ${
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
                  className={`size-2 rounded-full ${
                    isCleared
                      ? "bg-[#198754]"
                      : isExpedited
                      ? "bg-sky-500 animate-pulse"
                      : isUnderReview
                      ? "bg-amber-500 animate-pulse"
                      : "bg-rose-500"
                  }`}
                />
                <span>{protocol.status}</span>
              </span>

              {/* Assignment Status Pill */}
              {protocol.assignedReviewerName && (
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-micro font-bold border ${
                    isDeclined
                      ? "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30"
                      : isPendingAcceptance
                      ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30"
                      : isReviewCompleted
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                      : "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/30"
                  }`}
                >
                  <User className="size-3" />
                  <span>
                    {isDeclined
                      ? `Declined: ${protocol.assignedReviewerName}`
                      : isPendingAcceptance
                      ? `Pending: ${protocol.assignedReviewerName}`
                      : isReviewCompleted
                      ? `Reviewed: ${protocol.assignedReviewerName}`
                      : `Assigned: ${protocol.assignedReviewerName}`}
                  </span>
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight leading-snug">
              {protocol.title}
            </h1>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-base text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                <User className="size-4 text-primary dark:text-sky-400" />
                <span>{protocol.piName || "Dr. Elena Rostova"} (Principal Investigator)</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Building2 className="size-4 text-slate-400" />
                <span>{protocol.department}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="size-4 text-slate-400" />
                <span>Submitted {protocol.submissionDate}</span>
              </span>
            </div>
          </div>

          {/* Governance & Reviewer Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 self-start shrink-0">
            {/* Primary Reviewer Assignment Trigger */}
            {isDeclined ? (
              <Button
                type="button"
                variant="default"
                onClick={() => setIsAssignModalOpen(true)}
                className="h-10 px-4 text-base font-bold rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-xs gap-1.5 cursor-pointer animate-pulse"
              >
                <RotateCcw className="size-4" />
                <span>Reassign Reviewer</span>
              </Button>
            ) : isPendingAcceptance ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAssignModalOpen(true)}
                className="h-10 px-3.5 text-base font-bold rounded-lg border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 shadow-xs gap-1.5 cursor-pointer"
              >
                <UserCheck className="size-4" />
                <span>Change Reviewer</span>
              </Button>
            ) : isAccepted ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAssignModalOpen(true)}
                className="h-10 px-3.5 text-base font-bold rounded-lg border-sky-400 bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 hover:bg-sky-100 shadow-xs gap-1.5 cursor-pointer"
              >
                <UserCheck className="size-4" />
                <span>Reassign</span>
              </Button>
            ) : !isReviewCompleted && !isCleared ? (
              <Button
                type="button"
                variant="default"
                onClick={() => setIsAssignModalOpen(true)}
                className="h-10 px-4 text-base font-bold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs gap-1.5 cursor-pointer"
              >
                <UserPlus className="size-4" />
                <span>Assign Reviewer</span>
              </Button>
            ) : null}

            {/* Clearance Determination Triggers */}
            {!isCleared && (
              <Button
                type="button"
                variant="default"
                onClick={() => setDecisionAction("grant")}
                className="h-10 px-4 text-base font-bold rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-xs gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="size-4" />
                <span>Grant Clearance</span>
              </Button>
            )}

            {!isRevision && !isCleared && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setDecisionAction("revise")}
                className="h-10 px-4 text-base font-bold rounded-lg border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 shadow-xs gap-1.5 cursor-pointer"
              >
                <AlertCircle className="size-4" />
                <span>Request Revisions</span>
              </Button>
            )}
          </div>
        </div>

        {/* 5-Step Deliberation Pipeline Tracker */}
        <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800">
          <div className="text-micro font-bold uppercase tracking-wider text-muted-foreground mb-3">
            Clearance Governance Pipeline Progress
          </div>
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {[
              { step: 1, label: "Submission Registered" },
              { step: 2, label: "BDT Fee Confirmed" },
              { step: 3, label: "Reviewer Assigned" },
              { step: 4, label: "Committee Deliberation" },
              { step: 5, label: "Clearance Sealed" },
            ].map((s) => {
              const isPassed = stepNumber >= s.step
              const isCurrent = stepNumber === s.step
              return (
                <div
                  key={s.step}
                  className={`p-2.5 rounded-lg border transition-all text-center space-y-1 ${
                    isPassed
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300"
                      : "bg-slate-50 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800 text-slate-400"
                  } ${isCurrent ? "ring-2 ring-primary/20" : ""}`}
                >
                  <div className="font-mono text-micro font-black">
                    Step 0{s.step}
                  </div>
                  <div className="text-micro font-bold truncate leading-tight">
                    {s.label}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Deep Context Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Scope, Abstract, Ethics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Protocol Scope & Classification */}
          <div className="rounded-xl sm:rounded-2xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] p-5 sm:p-6 shadow-xs space-y-4">
            <h2 className="text-section-heading text-primary dark:text-white uppercase tracking-tight flex items-center gap-2">
              <Building2 className="size-5 text-secondary" />
              Protocol Scope & Academic Classification
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <span className="text-micro text-muted-foreground block font-medium">Study Methodology</span>
                <span className="font-bold text-foreground text-table-cell block">
                  {protocol.studyType || "Epidemiological / Observational"}
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <span className="text-micro text-muted-foreground block font-medium">Estimated Study Duration</span>
                <span className="font-bold text-foreground text-table-cell block">
                  {protocol.durationMonths || 12} Months
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 space-y-1 sm:col-span-2">
                <span className="text-micro text-muted-foreground block font-medium">Clinical & Field Study Locations</span>
                <span className="font-semibold text-foreground text-table-cell block">
                  {protocol.studyLocation || "Daffodil International University Research Park & Allied Clinical Centers"}
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 space-y-1 sm:col-span-2">
                <span className="text-micro text-muted-foreground block font-medium">Co-Investigators & Affiliated Faculty</span>
                <span className="font-semibold text-foreground text-table-cell block">
                  {protocol.coInvestigators || "None declared on initial registration."}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Scientific Abstract & Methodology */}
          <div className="rounded-xl sm:rounded-2xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] p-5 sm:p-6 shadow-xs space-y-4">
            <h2 className="text-section-heading text-primary dark:text-white uppercase tracking-tight flex items-center gap-2">
              <FileText className="size-5 text-secondary" />
              Scientific Abstract & Research Objectives
            </h2>

            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 text-body-sm text-foreground/90 leading-relaxed">
              {protocol.abstract || "Comprehensive ethical abstract supplied on primary PDF proposal."}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0C1E34] space-y-1">
                <span className="text-micro text-muted-foreground font-medium">Target Participant Sample Size</span>
                <span className="font-black text-xl text-primary dark:text-sky-300 block tabular-nums">
                  {protocol.targetSampleSize?.toLocaleString() || "500"} Participants
                </span>
              </div>

              <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0C1E34] space-y-1">
                <span className="text-micro text-muted-foreground font-medium">Exposure Risk Assessment</span>
                <span className="font-bold text-foreground text-table-cell flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-sky-500" />
                  <span>{protocol.risk}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Ethics Safeguards & Informed Consent */}
          <div className="rounded-xl sm:rounded-2xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] p-5 sm:p-6 shadow-xs space-y-4">
            <h2 className="text-section-heading text-primary dark:text-white uppercase tracking-tight flex items-center gap-2">
              <ShieldCheck className="size-5 text-secondary" />
              Human Protections & Informed Consent Procedure
            </h2>

            <div className="space-y-3">
              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <span className="text-micro text-muted-foreground font-medium block">Consent Administration Protocol</span>
                <span className="font-bold text-foreground text-table-cell block">
                  {protocol.consentType || "Written Informed Consent (Bangla & English)"}
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 space-y-2">
                <span className="text-micro text-muted-foreground font-medium block">Vulnerable Populations Included</span>
                <div className="flex flex-wrap gap-1.5">
                  {protocol.vulnerablePopulations && protocol.vulnerablePopulations.length > 0 ? (
                    protocol.vulnerablePopulations.map((v) => (
                      <Badge
                        key={v}
                        variant="secondary"
                        className="text-base font-semibold px-2.5 py-0.5 bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/20"
                      >
                        {v}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-base text-muted-foreground font-medium">
                      No vulnerable populations declared. Standard adult cohort safeguards apply.
                    </span>
                  )}
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <span className="text-micro text-muted-foreground font-medium block">Data Confidentiality & Cryptographic Protection</span>
                <p className="text-table-cell text-muted-foreground leading-relaxed">
                  {protocol.dataConfidentiality ||
                    "All patient identifiers will be cryptographically hashed using SHA-256 with zero third-party disclosure."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Reviewer Assignment, Processing Fee, Documents, Certificate Seal */}
        <div className="space-y-6">
          {/* Card: Reviewer Assignment & Deliberation Docket */}
          <div className="rounded-xl sm:rounded-2xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-section-heading text-primary dark:text-white uppercase tracking-tight flex items-center gap-2">
                <UserCheck className="size-5 text-secondary" />
                IRB Reviewer Assignment
              </h2>
              {isDeclined && (
                <span className="inline-flex items-center gap-1 text-micro font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20 animate-pulse">
                  <RotateCcw className="size-3" />
                  <span>Reassign Needed</span>
                </span>
              )}
            </div>

            {/* Declined Alert */}
            {isDeclined && (
              <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 space-y-2">
                <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold text-base">
                  <UserX className="size-4 shrink-0 text-rose-600" />
                  <span>Reviewer Declined Assignment</span>
                </div>
                <p className="text-body-sm text-rose-700 dark:text-rose-300">
                  <strong>{protocol.assignedReviewerName}</strong> declined this assignment on {protocol.assignmentDate}.
                </p>
                {protocol.reviewerDeclineReason && (
                  <div className="p-2.5 rounded-lg bg-white/70 dark:bg-black/30 border border-rose-500/20 text-micro text-foreground font-mono">
                    <span className="text-muted-foreground font-sans">Reason: </span>
                    {protocol.reviewerDeclineReason}
                  </div>
                )}
                <Button
                  type="button"
                  onClick={() => setIsAssignModalOpen(true)}
                  className="w-full mt-2 bg-rose-600 hover:bg-rose-700 text-white font-bold h-9 text-base"
                >
                  <RotateCcw className="size-4 mr-1.5" />
                  <span>Select Replacement Reviewer</span>
                </Button>
              </div>
            )}

            {/* Pending Acceptance Alert */}
            {isPendingAcceptance && (
              <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 space-y-2">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-base">
                  <Clock className="size-4 shrink-0 text-amber-600 animate-pulse" />
                  <span>Awaiting Reviewer Acceptance</span>
                </div>
                <p className="text-body-sm text-amber-700 dark:text-amber-300">
                  Review request dispatched to <strong>{protocol.assignedReviewerName}</strong> ({protocol.assignedReviewerEmail}) on {protocol.assignmentDate}.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAssignModalOpen(true)}
                  className="w-full mt-1 border-amber-400 bg-white/80 dark:bg-slate-900 text-amber-800 dark:text-amber-300 font-bold h-8 text-micro"
                >
                  Change Assigned Reviewer
                </Button>
              </div>
            )}

            {/* Accepted & Deliberating Alert */}
            {isAccepted && (
              <div className="p-4 rounded-xl border border-sky-500/30 bg-sky-500/10 space-y-2">
                <div className="flex items-center gap-2 text-sky-800 dark:text-sky-300 font-bold text-base">
                  <UserCheck className="size-4 shrink-0 text-sky-600" />
                  <span>Review Accepted & Evaluating</span>
                </div>
                <p className="text-body-sm text-sky-700 dark:text-sky-300">
                  <strong>{protocol.assignedReviewerName}</strong> has accepted this protocol and is actively formulating ethical determination remarks.
                </p>
              </div>
            )}

            {/* Completed Review Evaluation Summary */}
            {isReviewCompleted && protocol.reviewerEvaluation && (
              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-bold text-base">
                    <CheckCircle2 className="size-4 text-emerald-600" />
                    <span>Review Completed</span>
                  </span>
                  <Badge className="bg-emerald-600 text-white font-bold text-micro">
                    {protocol.reviewerEvaluation.recommendation}
                  </Badge>
                </div>
                <div className="p-3 rounded-lg bg-white/80 dark:bg-slate-900 border border-emerald-500/20 text-body-sm text-foreground space-y-1">
                  <span className="text-micro text-muted-foreground block font-medium">Deliberation Remarks</span>
                  <p className="italic font-medium">&ldquo;{protocol.reviewerEvaluation.deliberationRemarks}&rdquo;</p>
                  <div className="text-micro text-muted-foreground pt-1">
                    Evaluated by {protocol.reviewerEvaluation.reviewerName} on {protocol.reviewerEvaluation.evaluatedAt}
                  </div>
                </div>
              </div>
            )}

            {/* Unassigned State */}
            {!protocol.assignedReviewerName && (
              <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-center space-y-3">
                <UserPlus className="size-8 text-slate-400 mx-auto" />
                <div className="space-y-1">
                  <h3 className="font-bold text-base text-foreground">No Reviewer Assigned</h3>
                  <p className="text-body-sm text-muted-foreground">
                    Assign this protocol to an accredited IRB member for peer deliberation.
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={() => setIsAssignModalOpen(true)}
                  className="w-full bg-primary text-primary-foreground font-bold h-9 text-base"
                >
                  <UserPlus className="size-4 mr-1.5" />
                  <span>Assign Accredited Reviewer</span>
                </Button>
              </div>
            )}
          </div>

          {/* Card: Institutional BDT Processing Fee Receipt */}
          <div className="rounded-xl sm:rounded-2xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] p-5 sm:p-6 shadow-xs space-y-4">
            <h2 className="text-section-heading text-primary dark:text-white uppercase tracking-tight flex items-center gap-2">
              <Wallet className="size-5 text-[#E0C23C]" />
              Institutional Processing Fee (৳ BDT)
            </h2>

            <div className="p-4 rounded-xl bg-[#002752]/5 dark:bg-[#002752]/25 border border-primary/20 space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-micro uppercase font-bold text-muted-foreground tracking-wider">Total Fee Paid</span>
                <span className="font-mono text-2xl sm:text-3xl font-black text-primary dark:text-sky-300">
                  ৳ {protocol.feeAmountBdt?.toLocaleString() || "7,500"} BDT
                </span>
              </div>

              <div className="space-y-2 pt-2 border-t border-primary/10 text-table-cell">
                <div className="flex justify-between text-muted-foreground">
                  <span>Fee Category Tier:</span>
                  <span className="font-bold text-foreground capitalize">
                    {protocol.feeTier || "Faculty Research"}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Payment Gateway:</span>
                  <span className="font-bold uppercase text-foreground">
                    {protocol.paymentMethod || "bKash"}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Sender Mobile/Account:</span>
                  <span className="font-mono font-bold text-foreground">
                    {protocol.senderNumber || "01711998877"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground pt-1">
                  <span>Transaction ID:</span>
                  <div className="flex items-center gap-1 font-mono font-black text-foreground">
                    <span>{protocol.transactionId || "BKS99281726"}</span>
                    <button
                      type="button"
                      onClick={handleCopyTrx}
                      className="p-1 text-slate-400 hover:text-primary dark:hover:text-sky-300 cursor-pointer"
                      title="Copy Transaction ID"
                    >
                      {copiedTrx ? (
                        <Check className="size-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="size-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 text-micro font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 w-full justify-center">
                  <CheckCircle2 className="size-3.5" />
                  <span>Institutional Payment Verified & Reconciled</span>
                </span>
              </div>
            </div>
          </div>

          {/* Card: Dossier Attachments */}
          <div className="rounded-xl sm:rounded-2xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] p-5 sm:p-6 shadow-xs space-y-4">
            <h2 className="text-section-heading text-primary dark:text-white uppercase tracking-tight flex items-center gap-2">
              <FileCheck2 className="size-5 text-secondary" />
              Dossier PDF Attachments
            </h2>

            <div className="space-y-2.5">
              {[
                {
                  label: "Research Protocol Proposal",
                  name: protocol.proposalDocumentName || "Biomedical_Proposal_v2.pdf",
                  required: true,
                },
                {
                  label: "Informed Consent Form (ICF)",
                  name: protocol.consentDocumentName || "Bilingual_Consent_Form.pdf",
                  required: true,
                },
                {
                  label: "Data Instruments & Questionnaire",
                  name: protocol.dataToolsDocumentName || "Clinical_Intake_Tools.pdf",
                  required: false,
                },
                {
                  label: "Principal Investigator Biosketch CV",
                  name: protocol.investigatorCvName || "Investigator_Curriculum_Vitae.pdf",
                  required: false,
                },
              ].map((doc, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <span className="text-micro font-bold text-muted-foreground block truncate">
                      {doc.label}
                    </span>
                    <span className="font-mono text-table-cell font-bold text-foreground block truncate">
                      {doc.name}
                    </span>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      toast.success("Document Download Initialized", {
                        description: `Downloading authenticated PDF: ${doc.name}`,
                      })
                    }}
                    className="h-8 px-2.5 text-micro font-bold gap-1 rounded-md shrink-0 cursor-pointer"
                    title={`Download ${doc.name}`}
                  >
                    <Download className="size-3.5" />
                    <span className="hidden sm:inline">PDF</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Card: Committee Remarks & Cryptographic Seal */}
          <div className="rounded-xl sm:rounded-2xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] p-5 sm:p-6 shadow-xs space-y-4">
            <h2 className="text-section-heading text-primary dark:text-white uppercase tracking-tight flex items-center gap-2">
              <Lock className="size-5 text-secondary" />
              Cryptographic Audit Seal
            </h2>

            <div className="space-y-3">
              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <span className="text-micro text-muted-foreground font-medium block">IRB Secretariat Remarks</span>
                <p className="text-table-cell text-foreground font-semibold">
                  {protocol.committeeRemarks || "Application actively queued for IRB committee quorum evaluation."}
                </p>
              </div>

              {protocol.hasCertificate && protocol.certificateSealHash && (
                <div className="p-3.5 rounded-lg bg-emerald-500/5 border border-emerald-500/25 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-micro font-bold text-emerald-800 dark:text-emerald-300">
                      SHA-256 Digital Certificate Seal
                    </span>
                    <button
                      type="button"
                      onClick={handleCopySeal}
                      className="p-1 text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 cursor-pointer"
                      title="Copy Certificate Hash"
                    >
                      {copiedHash ? (
                        <Check className="size-3.5" />
                      ) : (
                        <Copy className="size-3.5" />
                      )}
                    </button>
                  </div>
                  <div className="font-mono text-micro text-emerald-900 dark:text-emerald-200 break-all p-2 rounded bg-emerald-500/10 border border-emerald-500/20">
                    {protocol.certificateSealHash}
                  </div>
                  <div className="flex justify-between text-micro text-muted-foreground pt-1">
                    <span>Issued: {protocol.certificateIssueDate || "Aug 2026"}</span>
                    <span>Valid Through: {protocol.certificateExpiryDate || "Aug 2027"}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reviewer Assignment Dialog Modal */}
      <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
        <DialogContent className="sm:max-w-xl max-h-[85vh] flex flex-col p-6">
          <DialogHeader className="space-y-1">
            <DialogTitle className="flex items-center gap-2 text-xl font-black text-primary dark:text-white">
              <UserPlus className="size-5 text-secondary" />
              <span>
                {isDeclined ? "Reassign Reviewer for Protocol" : "Assign Reviewer to Protocol"}
              </span>
            </DialogTitle>
            <DialogDescription className="text-body-sm text-muted-foreground">
              Select an accredited committee reviewer to evaluate{" "}
              <strong className="text-foreground">{protocol.id}</strong> (&ldquo;{protocol.title}&rdquo;).
            </DialogDescription>
          </DialogHeader>

          {/* Search Reviewers Bar */}
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={reviewerSearch}
              onChange={(e) => setReviewerSearch(e.target.value)}
              placeholder="Search reviewers by name, institution, or specialization..."
              className="pl-9 h-10 text-base"
            />
          </div>

          {/* Candidate Reviewers List */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 my-2 max-h-[45vh]">
            {filteredReviewers.map((rev) => {
              const isSelected = selectedReviewerId === rev.id

              return (
                <div
                  key={rev.id}
                  onClick={() => {
                    if (rev.isPrevDeclined) {
                      toast.warning("Previously Declined Reviewer", {
                        description: `${rev.name} previously declined this case. An alternative committee member is strongly recommended.`,
                      })
                    }
                    setSelectedReviewerId(rev.id)
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2.5 ${
                    isSelected
                      ? "border-primary bg-primary/5 dark:bg-sky-950/40 ring-2 ring-primary/20"
                      : rev.isPrevDeclined
                      ? "border-rose-300 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 opacity-80"
                      : "border-slate-200/85 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-base text-foreground">
                          {rev.name}
                        </span>
                        <span className="text-micro font-mono px-1.5 py-0.2 rounded bg-muted text-slate-700 dark:text-slate-300">
                          {rev.degree}
                        </span>
                        {rev.isPrevDeclined ? (
                          <Badge className="bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/25 text-[0.68rem] px-1.5 py-0 font-bold">
                            Declined This Protocol
                          </Badge>
                        ) : rev.matchScore >= 80 ? (
                          <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25 text-[0.68rem] px-1.5 py-0 font-bold inline-flex items-center gap-1">
                            <Sparkles className="size-2.5 text-emerald-600 dark:text-emerald-400" />
                            <span>{rev.matchScore}% Best Match</span>
                          </Badge>
                        ) : rev.matchScore >= 50 ? (
                          <Badge className="bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/25 text-[0.68rem] px-1.5 py-0 font-bold">
                            {rev.matchScore}% Match
                          </Badge>
                        ) : null}
                      </div>
                      <div className="text-micro text-muted-foreground truncate max-w-sm">
                        {rev.position} • {rev.institution}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="flex items-center justify-end gap-1 text-micro font-bold text-slate-700 dark:text-slate-300">
                        <span
                          className={`size-1.5 rounded-full ${
                            rev.assignedProtocols <= 2
                              ? "bg-emerald-500"
                              : rev.assignedProtocols <= 4
                              ? "bg-amber-500"
                              : "bg-rose-500"
                          }`}
                        />
                        <span>{rev.assignedProtocols} Active Cases</span>
                      </div>
                      <span className="text-micro text-muted-foreground">
                        {rev.role}
                      </span>
                    </div>
                  </div>

                  {/* Criteria Badges & Specializations */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    {rev.matchBadges.map((badge) => (
                      <span
                        key={badge}
                        className="text-[0.65rem] font-bold px-2 py-0.5 rounded bg-primary/8 dark:bg-primary/20 text-primary dark:text-sky-300"
                      >
                        {badge}
                      </span>
                    ))}
                    {rev.specializations.slice(0, 2).map((spec) => (
                      <span
                        key={spec}
                        className="text-[0.65rem] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-slate-200/80 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAssignModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={!selectedReviewerId}
              onClick={handleDispatchAssignment}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold gap-1.5"
            >
              <UserPlus className="size-4" />
              <span>Dispatch Review Request</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Decision Confirmation Modal */}
      <AlertDialog
        open={!!decisionAction}
        onOpenChange={(open) => {
          if (!open) setDecisionAction(null)
        }}
      >
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-secondary" />
              <span>
                {decisionAction === "grant"
                  ? "Grant Institutional Ethical Clearance"
                  : decisionAction === "revise"
                  ? "Request Revisions from Investigator"
                  : "Activate Fast-Track Expedited Review"}
              </span>
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2 text-body-sm text-muted-foreground pt-2">
              <p>
                {decisionAction === "grant"
                  ? "Approving clearance will issue an official Digital Clearance Certificate with a SHA-256 cryptographic seal, advancing the protocol step to Clearance Granted (Step 5)."
                  : decisionAction === "revise"
                  ? "Requesting revisions will flag this protocol on the investigator's dashboard with required amendments before deliberation resumes."
                  : "Elevating this protocol will place it into the expedited triage queue for fast-track 72-hour review."}
              </p>
              <div className="p-3 rounded-lg bg-muted border border-border font-mono text-table-cell">
                <span className="font-bold text-foreground">{protocol.id}</span>: {protocol.title}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleExecuteDecision}
              className={`font-bold ${
                decisionAction === "grant"
                  ? "bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                  : decisionAction === "revise"
                  ? "bg-rose-600 hover:bg-rose-700 text-white"
                  : "bg-primary hover:bg-primary/90 text-primary-foreground"
              }`}
            >
              Confirm Determination
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardContainer>
  )
}
