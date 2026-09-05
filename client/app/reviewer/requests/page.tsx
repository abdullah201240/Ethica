"use client"

import * as React from "react"
import Link from "next/link"
import {
  Inbox,
  Clock,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Zap,
  AlertTriangle,
  UserCheck,
  UserX,
  FileSearch,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
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
  getStoredProtocols,
  subscribeProtocols,
  syncProtocolsFromServer,
  respondToReviewAssignment,
  type Protocol,
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

export default function ReviewerRequestsPage() {
  const [protocols, setProtocols] = React.useState<Protocol[]>(getStoredProtocols)
  const [reviewers] = React.useState<AccreditedReviewer[]>(getStoredReviewers)
  const [activeReviewerEmail, setActiveReviewerEmailState] = React.useState<string>(getActiveReviewerEmail)

  // Modals state
  const [acceptingProtocol, setAcceptingProtocol] = React.useState<Protocol | null>(null)
  const [decliningProtocol, setDecliningProtocol] = React.useState<Protocol | null>(null)
  const [declineReason, setDeclineReason] = React.useState(DECLINE_REASONS[0])
  const [customReason, setCustomReason] = React.useState("")
  const [inspectingProtocol, setInspectingProtocol] = React.useState<Protocol | null>(null)

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

  // Filter pending review requests
  const pendingRequests = protocols.filter(
    (p) => p.assignmentStatus === "Pending Acceptance"
  )

  const activeEvaluationsCount = protocols.filter(
    (p) => p.assignmentStatus === "Accepted"
  ).length

  const completedEvaluationsCount = protocols.filter(
    (p) => p.assignmentStatus === "Review Completed" || p.status === "Clearance Granted"
  ).length

  const handleConfirmAccept = () => {
    if (!acceptingProtocol) return
    const updated = respondToReviewAssignment(acceptingProtocol.id, "Accepted")
    if (updated) {
      setProtocols(getStoredProtocols())
    }
    toast.success("Review Assignment Accepted", {
      description: `Protocol ${acceptingProtocol.id} added to your active deliberation queue. Proceed to deliberations to formulate ethical remarks.`,
    })
    setAcceptingProtocol(null)
  }

  const handleConfirmDecline = () => {
    if (!decliningProtocol) return
    const finalReason = declineReason === "Other" && customReason.trim() ? customReason.trim() : declineReason
    const updated = respondToReviewAssignment(decliningProtocol.id, "Declined", finalReason)
    if (updated) {
      setProtocols(getStoredProtocols())
    }
    toast.error("Review Assignment Declined", {
      description: `Declined review for ${decliningProtocol.id}. The Secretariat has been notified and will reassign the protocol to an alternative accredited reviewer.`,
    })
    setDecliningProtocol(null)
    setCustomReason("")
  }

  return (
    <DashboardContainer className="space-y-6 select-text pb-12">
      {/* KPI Review Metrics */}
      <KpiGrid columns={4}>
        <KpiCard
          label="Pending Review Requests"
          value={pendingRequests.length}
          description="Awaiting your acceptance / decline"
          icon={Inbox}
          color={pendingRequests.length > 0 ? "amber" : "navy"}
        />
        <KpiCard
          label="Active In-Progress Cases"
          value={activeEvaluationsCount}
          description="Accepted protocols in deliberation"
          icon={ShieldCheck}
          color="navy"
        />
        <KpiCard
          label="Determinations Sealed"
          value={completedEvaluationsCount}
          description="Clearances recorded in register"
          icon={CheckCircle2}
          color="green"
        />
        <KpiCard
          label="Acceptance Turnaround"
          value="< 24h"
          description="Secretariat target response SLA"
          icon={Clock}
          color="gold"
        />
      </KpiGrid>

      {/* Main Review Requests List Container */}
      <div className="rounded-xl sm:rounded-2xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] overflow-hidden shadow-xs">
        <div className="p-5 sm:p-6 border-b border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
              <Inbox className="size-6 text-amber-500" />
              Incoming Protocol Review Requests
            </h2>
            <p className="text-body-sm text-muted-foreground font-medium mt-1">
              Secretariat has dispatched these research protocols for your evaluation. Review the summary and accept to begin deliberation or decline with reasons so Secretariat can reassign.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 text-micro font-bold border border-amber-500/20">
              <Clock className="size-3.5 animate-pulse" />
              <span>{pendingRequests.length} Pending Action</span>
            </span>
          </div>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="p-12 text-center space-y-3 text-muted-foreground">
            <CheckCircle2 className="size-10 text-emerald-500 mx-auto" />
            <h3 className="text-lg font-bold text-foreground">All Review Requests Addressed</h3>
            <p className="text-body-sm max-w-md mx-auto">
              You currently have no pending review requests awaiting acceptance. All assignments have either been accepted into active deliberations or declined for reassignment.
            </p>
            <div className="pt-2">
              <Link href="/reviewer/deliberations">
                <Button variant="outline" className="font-bold gap-1.5 cursor-pointer">
                  <span>Go to Active Deliberations</span>
                  <ChevronRight className="size-4" />
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-200/70 dark:divide-slate-800">
            {pendingRequests.map((protocol) => (
              <div
                key={protocol.id}
                className="p-5 sm:p-6 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors flex flex-col lg:flex-row lg:items-start justify-between gap-5"
              >
                <div className="space-y-3 flex-1 min-w-0">
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
                      <Clock className="size-3 animate-pulse" />
                      <span>Assigned to You • Pending Acceptance</span>
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
                    <p className="text-body-sm text-muted-foreground line-clamp-3 italic pt-1">
                      &ldquo;{protocol.abstract}&rdquo;
                    </p>
                  )}

                  {/* Documents & Details Pills */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-micro">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Attachments:</span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-slate-600 dark:text-slate-300">
                      {protocol.proposalDocumentName || "Proposal_v2.pdf"}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-slate-600 dark:text-slate-300">
                      {protocol.consentDocumentName || "Consent_Form.pdf"}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setInspectingProtocol(protocol)}
                      className="h-6 px-2 text-micro font-bold text-primary dark:text-sky-400 hover:underline gap-1 p-0 cursor-pointer"
                    >
                      <FileSearch className="size-3" />
                      <span>View Full Summary</span>
                    </Button>
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
                    <span>Decline Assignment</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Acceptance Confirmation Dialog */}
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
              <span>Accept Review Assignment</span>
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3 text-body-sm text-muted-foreground pt-2">
              <p>
                By accepting, you confirm that you have no disqualifying conflicts of interest and commit to completing the ethical deliberation within the institutional SLA.
              </p>
              {acceptingProtocol && (
                <div className="p-3 rounded-lg bg-muted border border-border font-mono text-table-cell">
                  <span className="font-bold text-foreground">{acceptingProtocol.id}</span>: {acceptingProtocol.title}
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAccept}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold cursor-pointer"
            >
              Confirm Acceptance
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Decline Reason Dialog */}
      <Dialog
        open={!!decliningProtocol}
        onOpenChange={(open) => {
          if (!open) {
            setDecliningProtocol(null)
            setCustomReason("")
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="size-5" />
              <span>Decline Review Assignment</span>
            </DialogTitle>
            <DialogDescription className="text-body-sm text-muted-foreground">
              Please specify the reason for declining. The Secretariat will be notified immediately to reassign this protocol to another qualified reviewer.
            </DialogDescription>
          </DialogHeader>

          {decliningProtocol && (
            <div className="p-3 rounded-lg bg-muted border border-border text-micro space-y-1">
              <span className="font-bold font-mono text-foreground">{decliningProtocol.id}</span>
              <p className="text-muted-foreground truncate">{decliningProtocol.title}</p>
            </div>
          )}

          <div className="space-y-3 py-2">
            <label className="text-table-cell font-bold text-foreground block">
              Reason for Declining
            </label>
            <Select
              value={declineReason}
              onValueChange={(val) => {
                if (val) setDeclineReason(val)
              }}
            >
              <SelectTrigger className="w-full text-base">
                <SelectValue placeholder="Select decline reason" />
              </SelectTrigger>
              <SelectContent>
                {DECLINE_REASONS.map((reason) => (
                  <SelectItem key={reason} value={reason}>
                    {reason}
                  </SelectItem>
                ))}
                <SelectItem value="Other">Other Specific Reason...</SelectItem>
              </SelectContent>
            </Select>

            {declineReason === "Other" && (
              <div className="space-y-1 pt-2">
                <label className="text-micro font-bold text-foreground">
                  Specify Justification
                </label>
                <Textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Provide context for the Secretariat regarding this decline..."
                  rows={3}
                  className="text-base"
                />
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setDecliningProtocol(null)
                setCustomReason("")
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmDecline}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer"
            >
              Decline & Notify Secretariat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Protocol Summary Inspection Dialog */}
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
              <span>Protocol Summary Dossier</span>
            </DialogTitle>
            <DialogDescription>
              Review details prior to accepting or declining assignment.
            </DialogDescription>
          </DialogHeader>

          {inspectingProtocol && (
            <div className="space-y-4 py-2 text-table-cell">
              <div className="p-3 rounded-lg bg-muted border border-border space-y-1">
                <span className="font-mono font-bold text-foreground">{inspectingProtocol.id}</span>
                <h4 className="font-bold text-foreground">{inspectingProtocol.title}</h4>
                <p className="text-micro text-muted-foreground">
                  {inspectingProtocol.department} • {inspectingProtocol.board}
                </p>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-foreground block">Scientific Abstract</span>
                <p className="text-body-sm text-muted-foreground leading-relaxed p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-border">
                  {inspectingProtocol.abstract || "No abstract provided."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-micro">
                <div className="p-2.5 rounded bg-muted">
                  <span className="text-muted-foreground block">Methodology:</span>
                  <span className="font-bold text-foreground">{inspectingProtocol.studyType}</span>
                </div>
                <div className="p-2.5 rounded bg-muted">
                  <span className="text-muted-foreground block">Duration:</span>
                  <span className="font-bold text-foreground">{inspectingProtocol.durationMonths} Months</span>
                </div>
                <div className="p-2.5 rounded bg-muted">
                  <span className="text-muted-foreground block">Sample Size:</span>
                  <span className="font-bold text-foreground">{inspectingProtocol.targetSampleSize} Subjects</span>
                </div>
                <div className="p-2.5 rounded bg-muted">
                  <span className="text-muted-foreground block">Risk Tier:</span>
                  <span className="font-bold text-foreground">{inspectingProtocol.risk}</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-foreground block">Consent Safeguards</span>
                <p className="text-micro text-muted-foreground">
                  {inspectingProtocol.consentType || "Written Informed Consent"}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setInspectingProtocol(null)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardContainer>
  )
}
