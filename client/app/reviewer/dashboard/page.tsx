"use client"

import * as React from "react"
import Link from "next/link"
import {
  Scale,
  Clock,
  CheckCircle2,
  ExternalLink,
  Vote,
  FileSearch,
  Zap,
  Download,
  UserCheck,
  Send,
  UserX,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { KpiCard, KpiGrid } from "@/components/ui/kpi-card"
import { toast } from "@/components/ui/sonner"
import { DashboardContainer } from "@/components/dashboard/dashboard-container"
import {
  AlertDialog,
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
} from "@/components/ui/dialog"
import {
  getStoredProtocols,
  subscribeProtocols,
  syncProtocolsFromServer,
  respondToReviewAssignment,
  submitReviewerEvaluation,
  type Protocol,
  type ProtocolReviewerEvaluation,
} from "@/lib/protocols-store"
import {
  getStoredReviewers,
  getActiveReviewerEmail,
  type AccreditedReviewer,
} from "@/lib/reviewer-roster"

const DECLINE_REASONS = [
  "Conflict of interest with principal investigator or affiliated research site",
  "Specialization or methodology outside my clinical/academic domain",
  "Excess clinical, surgical, or administrative institutional workload",
  "Institutional leave or sabbatical commitments",
]

export default function ReviewerDashboardPage() {
  const [protocols, setProtocols] = React.useState<Protocol[]>(getStoredProtocols)
  const [reviewers] = React.useState<AccreditedReviewer[]>(getStoredReviewers)
  
  // Current active reviewer identity synced with global store
  const [activeReviewerEmail, setActiveReviewerEmailState] = React.useState<string>(getActiveReviewerEmail)

  // Modals state
  const [acceptingProtocol, setAcceptingProtocol] = React.useState<Protocol | null>(null)
  const [decliningProtocol, setDecliningProtocol] = React.useState<Protocol | null>(null)
  const [declineReason, setDeclineReason] = React.useState(DECLINE_REASONS[0])

  // Evaluation modal state
  const [evaluatingProtocol, setEvaluatingProtocol] = React.useState<Protocol | null>(null)
  const [evaluationRecommendation, setEvaluationRecommendation] = React.useState<"Clearance Approved" | "Revisions Required" | "Ethics Rejection">("Clearance Approved")
  const [deliberationRemarks, setDeliberationRemarks] = React.useState("")
  const [meritScore, setMeritScore] = React.useState(5)
  const [safeguardsScore, setSafeguardsScore] = React.useState(5)
  const [consentScore, setConsentScore] = React.useState(5)

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

  // Filter protocols for this reviewer, or show all assigned/test protocols
  const incomingRequests = protocols.filter(
    (p) => p.assignmentStatus === "Pending Acceptance"
  )

  const activeEvaluations = protocols.filter(
    (p) => p.assignmentStatus === "Accepted"
  )

  const completedEvaluations = protocols.filter(
    (p) => p.assignmentStatus === "Review Completed" || p.status === "Clearance Granted"
  )

  const handleConfirmAccept = () => {
    if (!acceptingProtocol) return
    const updated = respondToReviewAssignment(acceptingProtocol.id, "Accepted")
    if (updated) {
      setProtocols(getStoredProtocols())
    }
    toast.success("Review Assignment Accepted", {
      description: `You have accepted review of ${acceptingProtocol.id}. Protocol is now active in your deliberation queue.`,
    })
    setAcceptingProtocol(null)
  }

  const handleConfirmDecline = () => {
    if (!decliningProtocol) return
    const updated = respondToReviewAssignment(decliningProtocol.id, "Declined", declineReason)
    if (updated) {
      setProtocols(getStoredProtocols())
    }
    toast.error("Review Assignment Declined", {
      description: `Declined review for ${decliningProtocol.id}. Returned to Secretariat docket for reassignment.`,
    })
    setDecliningProtocol(null)
  }

  const handleSubmitEvaluation = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!evaluatingProtocol) return

    if (!deliberationRemarks.trim() || deliberationRemarks.trim().length < 10) {
      toast.error("Deliberation Remarks Required", {
        description: "Please provide detailed justification and ethical notes (minimum 10 characters).",
      })
      return
    }

    const now = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    })

    const evalPayload: ProtocolReviewerEvaluation = {
      recommendation: evaluationRecommendation,
      scientificMeritRating: meritScore,
      safeguardsRating: safeguardsScore,
      consentRating: consentScore,
      deliberationRemarks: deliberationRemarks.trim(),
      evaluatedAt: now,
      reviewerName: currentReviewer.name,
      reviewerId: currentReviewer.id,
    }

    submitReviewerEvaluation(evaluatingProtocol.id, evalPayload)
    setProtocols(getStoredProtocols())

    toast.success("Formal Determination Registered", {
      description: `Decision "${evaluationRecommendation}" sealed for ${evaluatingProtocol.id}. Logged into institutional review register.`,
    })

    setEvaluatingProtocol(null)
    setDeliberationRemarks("")
  }

  return (
    <DashboardContainer className="space-y-6 select-text">
      {/* KPI Review Metrics */}
      <KpiGrid columns={4}>
        <KpiCard
          label="Incoming Review Requests"
          value={incomingRequests.length}
          icon={Clock}
          color={incomingRequests.length > 0 ? "amber" : "navy"}
        />
        <KpiCard
          label="Active In-Progress Evaluations"
          value={activeEvaluations.length}
          icon={Vote}
          color="navy"
        />
        <KpiCard
          label="Determinations Sealed"
          value={completedEvaluations.length}
          icon={CheckCircle2}
          color="green"
        />
        <KpiCard
          label="Quorum Compliance"
          value="100%"
          icon={Scale}
          color="gold"
        />
      </KpiGrid>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* SECTION 1: INCOMING REVIEW REQUESTS (PENDING ACCEPTANCE)            */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="rounded-xl sm:rounded-2xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-section-heading text-primary dark:text-white uppercase tracking-tight flex items-center gap-2">
              <Clock className="size-5 text-amber-500" />
              <span>Incoming Protocol Review Requests ({incomingRequests.length})</span>
            </h2>
            <p className="text-body-sm text-muted-foreground font-medium mt-1">
              Secretariat has dispatched these research protocols for your evaluation. Accept to begin peer review or decline if unavailable or in conflict of interest.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Link href="/reviewer/requests">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 px-2.5 text-xs font-bold gap-1 cursor-pointer"
              >
                <span>View All Requests</span>
                <ExternalLink className="size-3" />
              </Button>
            </Link>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 text-micro font-bold border border-amber-500/20">
              <span>Requires Your Decision</span>
            </span>
          </div>
        </div>

        {incomingRequests.length === 0 ? (
          <div className="p-8 text-center space-y-2 text-muted-foreground">
            <CheckCircle2 className="size-8 text-emerald-500 mx-auto" />
            <p className="text-base font-bold text-foreground">No Pending Review Requests</p>
            <p className="text-body-sm max-w-sm mx-auto">
              You have responded to all review assignments. New assignments dispatched by the Secretariat will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200/70 dark:divide-slate-800">
            {incomingRequests.map((protocol) => (
              <div
                key={protocol.id}
                className="p-5 sm:p-6 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors flex flex-col lg:flex-row lg:items-start justify-between gap-5"
              >
                <div className="space-y-2.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-base font-bold px-2 py-0.5 rounded bg-primary/10 dark:bg-white/10 text-primary dark:text-sky-300">
                      {protocol.id}
                    </span>
                    <Badge variant="outline" className="text-base font-semibold">
                      {protocol.board}
                    </Badge>
                    {protocol.isExpedited && (
                      <Badge className="bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20 text-micro font-bold gap-1">
                        <Zap className="size-2.5" />
                        <span>Fast-Track</span>
                      </Badge>
                    )}
                    <span className="text-micro text-amber-700 dark:text-amber-400 font-bold bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 flex items-center gap-1">
                      <Clock className="size-3" />
                      <span>Pending Your Acceptance</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-foreground leading-snug">
                    {protocol.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-base text-muted-foreground">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      PI: {protocol.piName || "Dr. Elena Rostova"}
                    </span>
                    <span>•</span>
                    <span>{protocol.department}</span>
                    <span>•</span>
                    <span>Risk: <strong>{protocol.risk}</strong></span>
                    <span>•</span>
                    <span>Dispatched: {protocol.assignmentDate || "Recently"}</span>
                  </div>

                  {protocol.abstract && (
                    <p className="text-body-sm text-muted-foreground line-clamp-2 italic pt-1">
                      &ldquo;{protocol.abstract}&rdquo;
                    </p>
                  )}

                  {/* Documents Pills */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-micro">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Attachments:</span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-slate-600 dark:text-slate-300">
                      {protocol.proposalDocumentName || "Proposal_v2.pdf"}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-slate-600 dark:text-slate-300">
                      {protocol.consentDocumentName || "Consent_Form.pdf"}
                    </span>
                  </div>
                </div>

                {/* Accept / Decline Action Controls */}
                <div className="flex flex-row lg:flex-col items-center lg:items-end gap-2 shrink-0 pt-2 lg:pt-0">
                  <Button
                    type="button"
                    onClick={() => setAcceptingProtocol(protocol)}
                    className="h-10 px-4 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold text-base gap-1.5 shadow-xs cursor-pointer"
                  >
                    <UserCheck className="size-4" />
                    <span>Accept Assignment</span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDecliningProtocol(protocol)}
                    className="h-10 px-4 border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 hover:bg-rose-100 font-bold text-base gap-1.5 cursor-pointer"
                  >
                    <UserX className="size-4" />
                    <span>Decline</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* SECTION 2: ACTIVE PROTOCOL DELIBERATIONS & EVALUATIONS (ACCEPTED)   */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="rounded-xl sm:rounded-2xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-section-heading text-primary dark:text-white uppercase tracking-tight flex items-center gap-2">
              <FileSearch className="size-5 text-primary dark:text-sky-300" />
              <span>Active Deliberations & Protocol Evaluations ({activeEvaluations.length})</span>
            </h2>
            <p className="text-body-sm text-muted-foreground font-medium mt-1">
              Accepted research protocols undergoing formal ethical review. Submit your determination and remarks for committee consensus.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Link href="/reviewer/deliberations">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 px-2.5 text-xs font-bold gap-1 cursor-pointer"
              >
                <span>Open Deliberations Docket</span>
                <ExternalLink className="size-3" />
              </Button>
            </Link>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-micro font-bold border border-emerald-500/20">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Deliberation Active</span>
            </span>
          </div>
        </div>

        {activeEvaluations.length === 0 ? (
          <div className="p-8 text-center space-y-2 text-muted-foreground">
            <Vote className="size-8 text-slate-400 mx-auto" />
            <p className="text-base font-bold text-foreground">No Active Evaluations in Progress</p>
            <p className="text-body-sm max-w-sm mx-auto">
              Accept incoming review requests above to commence formal ethical evaluation and scoring.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200/70 dark:divide-slate-800">
            {activeEvaluations.map((protocol) => (
              <div
                key={protocol.id}
                className="p-5 sm:p-6 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors flex flex-col lg:flex-row lg:items-start justify-between gap-5"
              >
                <div className="space-y-2.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-base font-bold px-2 py-0.5 rounded bg-primary/10 dark:bg-white/10 text-primary dark:text-sky-300">
                      {protocol.id}
                    </span>
                    <Badge variant="outline" className="text-base font-semibold">
                      {protocol.board}
                    </Badge>
                    <span className="text-micro text-sky-700 dark:text-sky-400 font-bold bg-sky-500/10 px-2.5 py-0.5 rounded-full border border-sky-500/20">
                      Review In Progress
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-foreground leading-snug">
                    {protocol.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-base text-muted-foreground">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      PI: {protocol.piName || "Dr. Elena Rostova"}
                    </span>
                    <span>•</span>
                    <span>Department: {protocol.department}</span>
                    <span>•</span>
                    <span>Sample Size: {protocol.targetSampleSize?.toLocaleString() || "500"}</span>
                  </div>

                  {protocol.abstract && (
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 text-body-sm text-foreground/90">
                      {protocol.abstract}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        toast.info("Downloading Protocol Document", {
                          description: `Authenticated download: ${protocol.proposalDocumentName || "Proposal.pdf"}`,
                        })
                      }}
                      className="h-8 text-micro font-bold gap-1 cursor-pointer"
                    >
                      <Download className="size-3" />
                      <span>Download Proposal PDF</span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        toast.info("Downloading Consent Form", {
                          description: `Authenticated download: ${protocol.consentDocumentName || "Informed_Consent.pdf"}`,
                        })
                      }}
                      className="h-8 text-micro font-bold gap-1 cursor-pointer"
                    >
                      <Download className="size-3" />
                      <span>Informed Consent PDF</span>
                    </Button>
                  </div>
                </div>

                <div className="shrink-0 pt-2 lg:pt-0">
                  <Button
                    type="button"
                    onClick={() => {
                      setEvaluatingProtocol(protocol)
                      setEvaluationRecommendation("Clearance Approved")
                      setDeliberationRemarks("")
                    }}
                    className="h-10 px-5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base gap-2 shadow-xs cursor-pointer"
                  >
                    <Vote className="size-4" />
                    <span>Submit Formal Evaluation</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* SECTION 3: COMPLETED DETERMINATIONS ARCHIVE                         */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {completedEvaluations.length > 0 && (
        <div className="rounded-xl sm:rounded-2xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] overflow-hidden shadow-xs">
          <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-section-heading text-primary dark:text-white uppercase tracking-tight flex items-center gap-2">
              <CheckCircle2 className="size-5 text-secondary" />
              <span>Resolved & Sealed Deliberation Register ({completedEvaluations.length})</span>
            </h2>
            <div className="flex items-center gap-2">
              <Link href="/reviewer/completed">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 px-2.5 text-xs font-bold gap-1 cursor-pointer"
                >
                  <span>View Full Archive</span>
                  <ExternalLink className="size-3" />
                </Button>
              </Link>
              <span className="text-micro font-mono text-muted-foreground hidden sm:inline">
                FIPS 140-3 Sealed
              </span>
            </div>
          </div>

          <div className="divide-y divide-slate-200/70 dark:divide-slate-800">
            {completedEvaluations.slice(0, 5).map((protocol) => (
              <div key={protocol.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-bold text-primary dark:text-sky-300">
                      {protocol.id}
                    </span>
                    <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-micro border-emerald-500/20 font-bold">
                      {protocol.reviewerEvaluation?.recommendation || protocol.status}
                    </Badge>
                  </div>
                  <h4 className="font-bold text-base text-foreground line-clamp-1">
                    {protocol.title}
                  </h4>
                  {protocol.committeeRemarks && (
                    <p className="text-micro text-muted-foreground italic">
                      &ldquo;{protocol.committeeRemarks}&rdquo;
                    </p>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <span className="text-micro font-mono text-emerald-700 dark:text-emerald-400 font-bold block">
                    {protocol.hasCertificate ? "SHA-256 Sealed" : "Deliberation Closed"}
                  </span>
                  <span className="text-micro text-slate-400">
                    {protocol.submissionDate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* MODAL: ACCEPT REVIEW ASSIGNMENT CONFIRMATION                        */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <AlertDialog
        open={!!acceptingProtocol}
        onOpenChange={(open) => {
          if (!open) setAcceptingProtocol(null)
        }}
      >
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <UserCheck className="size-5 text-secondary" />
              <span>Accept Research Protocol Review Assignment</span>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-body-sm text-muted-foreground pt-1 leading-relaxed">
              You are accepting formal peer review and IRB committee deliberation. By accepting, you certify zero conflict of interest and agree to evaluate the scientific methodology and human subject safeguards under Declaration of Helsinki principles.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {acceptingProtocol && (
            <div className="p-3 rounded-lg bg-muted border border-border font-mono text-table-cell">
              <span className="font-bold text-foreground">{acceptingProtocol.id}</span>: {acceptingProtocol.title}
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAccept}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold"
            >
              Confirm Acceptance
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* MODAL: DECLINE REVIEW ASSIGNMENT (WITH REASON)                      */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <AlertDialog
        open={!!decliningProtocol}
        onOpenChange={(open) => {
          if (!open) setDecliningProtocol(null)
        }}
      >
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-rose-700 dark:text-rose-400">
              <UserX className="size-5 text-rose-600" />
              <span>Decline Review Assignment</span>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-body-sm text-muted-foreground pt-1 leading-relaxed">
              Decline review for this protocol. It will be returned to the Institutional Ethics Secretariat for reassignment to another accredited reviewer.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {decliningProtocol && (
            <div className="p-3 rounded-lg bg-muted border border-border font-mono text-table-cell">
              <span className="font-bold text-foreground">{decliningProtocol.id}</span>: {decliningProtocol.title}
            </div>
          )}

          <div className="space-y-2 text-left">
            <label className="text-xs font-bold text-foreground block">
              Reason for Declining
            </label>
            <Select
              value={declineReason}
              onValueChange={(val) => {
                if (val) setDeclineReason(val)
              }}
            >
              <SelectTrigger className="w-full h-10 px-3 text-sm bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700">
                <SelectValue placeholder="Select decline reason" />
              </SelectTrigger>
              <SelectContent>
                {DECLINE_REASONS.map((r, i) => (
                  <SelectItem key={i} value={r} className="text-xs py-2">
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Keep Assignment</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDecline}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold"
            >
              Decline & Return to Secretariat
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* MODAL: SUBMIT FORMAL PROTOCOL EVALUATION                            */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <Dialog
        open={!!evaluatingProtocol}
        onOpenChange={(open) => {
          if (!open) setEvaluatingProtocol(null)
        }}
      >
        <DialogContent className="sm:max-w-lg max-h-[85vh] flex flex-col p-6">
          <DialogHeader className="space-y-1">
            <DialogTitle className="flex items-center gap-2 text-xl font-black text-primary dark:text-white">
              <Vote className="size-5 text-secondary" />
              <span>Submit Committee Ethical Determination</span>
            </DialogTitle>
            <DialogDescription className="text-body-sm text-muted-foreground">
              Official peer evaluation for <strong className="text-foreground">{evaluatingProtocol?.id}</strong> (&ldquo;{evaluatingProtocol?.title}&rdquo;).
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitEvaluation} className="space-y-4 my-2 overflow-y-auto pr-1 max-h-[50vh]">
            {/* Formal Determination Recommendation */}
            <div className="space-y-1.5">
              <label className="text-micro font-bold uppercase tracking-wider text-foreground">
                Ethical Determination Recommendation
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    {
                      value: "Clearance Approved" as const,
                      label: "Approved",
                      color: "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300",
                    },
                    {
                      value: "Revisions Required" as const,
                      label: "Revisions Due",
                      color: "border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300",
                    },
                    {
                      value: "Ethics Rejection" as const,
                      label: "Reject / Capped",
                      color: "border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300",
                    },
                  ] as const
                ).map((opt) => (
                  <Button
                    key={opt.value}
                    type="button"
                    variant="outline"
                    onClick={() => setEvaluationRecommendation(opt.value)}
                    className={`h-10 p-2.5 rounded-lg border text-center font-bold text-base transition-all cursor-pointer ${
                      evaluationRecommendation === opt.value
                        ? `${opt.color} ring-2 ring-primary/20`
                        : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-muted-foreground"
                    }`}
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Criteria Evaluation Ratings (1 to 5) */}
            <div className="space-y-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-micro font-bold text-foreground">Scientific Merit & Design:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <Button
                      key={num}
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setMeritScore(num)}
                      className={`size-7 p-0 rounded text-micro font-bold cursor-pointer transition-all ${
                        meritScore >= num
                          ? "bg-primary text-white hover:bg-primary/90 hover:text-white"
                          : "bg-slate-200 dark:bg-slate-800 text-slate-500 hover:bg-slate-300"
                      }`}
                    >
                      {num}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-micro font-bold text-foreground">Human Subject Protections:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <Button
                      key={num}
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setSafeguardsScore(num)}
                      className={`size-7 p-0 rounded text-micro font-bold cursor-pointer transition-all ${
                        safeguardsScore >= num
                          ? "bg-secondary text-white hover:bg-secondary/90 hover:text-white"
                          : "bg-slate-200 dark:bg-slate-800 text-slate-500 hover:bg-slate-300"
                      }`}
                    >
                      {num}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-micro font-bold text-foreground">Informed Consent Compliance:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <Button
                      key={num}
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setConsentScore(num)}
                      className={`size-7 p-0 rounded text-micro font-bold cursor-pointer transition-all ${
                        consentScore >= num
                          ? "bg-amber-500 text-white hover:bg-amber-600 hover:text-white"
                          : "bg-slate-200 dark:bg-slate-800 text-slate-500 hover:bg-slate-300"
                      }`}
                    >
                      {num}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Deliberation Remarks Textarea */}
            <div className="space-y-1.5">
              <label className="text-micro font-bold uppercase tracking-wider text-foreground">
                Official Deliberation Notes & Feedback:
              </label>
              <Textarea
                value={deliberationRemarks}
                onChange={(e) => setDeliberationRemarks(e.target.value)}
                placeholder="Detail methodology assessment, participant risk mitigations, or necessary protocol amendments..."
                className="h-28 text-base"
                required
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-3 border-t border-slate-200/80 dark:border-slate-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEvaluatingProtocol(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold gap-1.5"
              >
                <Send className="size-4" />
                <span>Submit & Seal Determination</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardContainer>
  )
}
