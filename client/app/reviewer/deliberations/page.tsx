"use client"

import * as React from "react"
import Link from "next/link"
import {
  Scale,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Zap,
  AlertCircle,
  AlertTriangle,
  Vote,
  ChevronRight,
  Send,
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
  getStoredProtocols,
  subscribeProtocols,
  syncProtocolsFromServer,
  submitReviewerEvaluation,
  type Protocol,
  type ProtocolReviewerEvaluation,
} from "@/lib/protocols-store"
import {
  getStoredReviewers,
  getActiveReviewerEmail,
  setActiveReviewerEmail as setGlobalActiveReviewerEmail,
  type AccreditedReviewer,
} from "@/lib/reviewer-roster"

export default function ReviewerDeliberationsPage() {
  const [protocols, setProtocols] = React.useState<Protocol[]>(getStoredProtocols)
  const [reviewers] = React.useState<AccreditedReviewer[]>(getStoredReviewers)
  const [activeReviewerEmail, setActiveReviewerEmailState] = React.useState<string>(getActiveReviewerEmail)

  // Evaluation modal state
  const [evaluatingProtocol, setEvaluatingProtocol] = React.useState<Protocol | null>(null)
  const [evaluationRecommendation, setEvaluationRecommendation] = React.useState<
    "Clearance Approved" | "Revisions Required" | "Ethics Rejection"
  >("Clearance Approved")
  const [deliberationRemarks, setDeliberationRemarks] = React.useState("")
  const [meritScore, setMeritScore] = React.useState(5)
  const [safeguardsScore, setSafeguardsScore] = React.useState(5)
  const [consentScore, setConsentScore] = React.useState(5)

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

  // Active in-progress evaluations
  const activeDeliberations = protocols.filter(
    (p) => p.assignmentStatus === "Accepted"
  )

  const pendingRequestsCount = protocols.filter(
    (p) => p.assignmentStatus === "Pending Acceptance"
  ).length

  const completedEvaluationsCount = protocols.filter(
    (p) => p.assignmentStatus === "Review Completed" || p.status === "Clearance Granted"
  ).length

  const expeditedCount = activeDeliberations.filter((p) => p.isExpedited).length

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

    const evaluation: ProtocolReviewerEvaluation = {
      recommendation: evaluationRecommendation,
      scientificMeritRating: meritScore,
      safeguardsRating: safeguardsScore,
      consentRating: consentScore,
      deliberationRemarks: deliberationRemarks.trim(),
      evaluatedAt: now,
      reviewerName: currentReviewer.name,
      reviewerId: currentReviewer.id,
    }

    const updated = submitReviewerEvaluation(evaluatingProtocol.id, evaluation)
    if (updated) {
      setProtocols(getStoredProtocols())
    }

    if (evaluationRecommendation === "Clearance Approved") {
      toast.success("Institutional Clearance Recommended", {
        description: `Deliberation determination recorded for ${evaluatingProtocol.id}. Protocol cleared with cryptographic seal.`,
      })
    } else if (evaluationRecommendation === "Revisions Required") {
      toast.warning("Revision Notice Dispatched", {
        description: `Revision requirements recorded for ${evaluatingProtocol.id}. Sent back to Principal Investigator.`,
      })
    } else {
      toast.error("Ethics Rejection Recorded", {
        description: `Protocol ${evaluatingProtocol.id} rejected on bioethical safeguards grounds.`,
      })
    }

    setEvaluatingProtocol(null)
    setDeliberationRemarks("")
  }

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

      {/* KPI Deliberation Metrics */}
      <KpiGrid columns={4}>
        <KpiCard
          label="Active Deliberations"
          value={activeDeliberations.length}
          description="Protocols currently under your evaluation"
          icon={Vote}
          color={activeDeliberations.length > 0 ? "navy" : "green"}
        />
        <KpiCard
          label="Pending Requests"
          value={pendingRequestsCount}
          description="Awaiting your initial response"
          icon={Clock}
          color={pendingRequestsCount > 0 ? "amber" : "navy"}
        />
        <KpiCard
          label="Expedited Triage Cases"
          value={expeditedCount}
          description="72-hour priority review track"
          icon={Zap}
          color={expeditedCount > 0 ? "gold" : "navy"}
        />
        <KpiCard
          label="Determinations Sealed"
          value={completedEvaluationsCount}
          description="Reviews registered with seals"
          icon={CheckCircle2}
          color="green"
        />
      </KpiGrid>

      {/* Active Deliberations Docket Container */}
      <div className="rounded-xl sm:rounded-2xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] overflow-hidden shadow-xs">
        <div className="p-5 sm:p-6 border-b border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
              <Scale className="size-6 text-primary dark:text-sky-400" />
              Active Deliberation Docket
            </h2>
            <p className="text-body-sm text-muted-foreground font-medium mt-1">
              Accepted protocol assignments under peer review. Conduct your independent ethical evaluation, score safeguards, and submit binding institutional determinations.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-primary/10 text-primary dark:text-sky-300 text-micro font-bold border border-primary/20">
              <Vote className="size-3.5" />
              <span>{activeDeliberations.length} Cases in Deliberation</span>
            </span>
          </div>
        </div>

        {activeDeliberations.length === 0 ? (
          <div className="p-12 text-center space-y-3 text-muted-foreground">
            <CheckCircle2 className="size-10 text-emerald-500 mx-auto" />
            <h3 className="text-lg font-bold text-foreground">No Active Deliberations in Queue</h3>
            <p className="text-body-sm max-w-md mx-auto">
              You do not have any accepted protocols pending evaluation. Check your review requests to accept incoming assignments.
            </p>
            <div className="pt-2">
              <Link href="/reviewer/requests">
                <Button variant="outline" className="font-bold gap-1.5 cursor-pointer">
                  <span>View Review Requests ({pendingRequestsCount})</span>
                  <ChevronRight className="size-4" />
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-200/70 dark:divide-slate-800">
            {activeDeliberations.map((protocol) => (
              <div
                key={protocol.id}
                className="p-5 sm:p-6 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors flex flex-col lg:flex-row lg:items-start justify-between gap-6"
              >
                <div className="space-y-3.5 flex-1 min-w-0">
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
                        <span>Fast-Track Expedited</span>
                      </Badge>
                    )}
                    <span className="text-micro text-sky-700 dark:text-sky-300 font-bold bg-sky-500/10 px-2.5 py-0.5 rounded-full border border-sky-500/20 flex items-center gap-1">
                      <span className="size-1.5 rounded-full bg-sky-500 animate-pulse" />
                      <span>Accepted • Review in Progress</span>
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
                    <span>Methodology: <strong>{protocol.studyType || "Observational"}</strong></span>
                    <span>•</span>
                    <span>Risk: <strong>{protocol.risk}</strong></span>
                  </div>

                  {protocol.abstract && (
                    <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 text-body-sm text-foreground/90 leading-relaxed">
                      {protocol.abstract}
                    </div>
                  )}

                  {/* Vulnerable Populations & Consent Procedure Tags */}
                  <div className="flex flex-wrap items-center gap-2 text-micro">
                    {protocol.vulnerablePopulations && protocol.vulnerablePopulations.length > 0 && (
                      <div className="flex items-center gap-1 text-rose-700 dark:text-rose-400 font-bold">
                        <AlertCircle className="size-3.5 shrink-0" />
                        <span>Vulnerable Cohorts:</span>
                        {protocol.vulnerablePopulations.map((v) => (
                          <Badge key={v} className="bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/25 text-[0.68rem]">
                            {v}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <ShieldCheck className="size-3.5 text-secondary shrink-0" />
                      <span>Consent: <strong>{protocol.consentType || "Written Informed Consent"}</strong></span>
                    </div>
                  </div>

                  {/* Documents Pills */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-micro">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Attachments:</span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-slate-600 dark:text-slate-300">
                      {protocol.proposalDocumentName || "Proposal_v2.pdf"}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-slate-600 dark:text-slate-300">
                      {protocol.consentDocumentName || "Consent_Form.pdf"}
                    </span>
                    {protocol.dataToolsDocumentName && (
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-slate-600 dark:text-slate-300">
                        {protocol.dataToolsDocumentName}
                      </span>
                    )}
                  </div>
                </div>

                {/* Deliberation Trigger Action */}
                <div className="flex flex-col items-end gap-2 shrink-0 pt-2 lg:pt-0">
                  <Button
                    type="button"
                    onClick={() => {
                      setEvaluatingProtocol(protocol)
                      setEvaluationRecommendation("Clearance Approved")
                      setDeliberationRemarks("")
                      setMeritScore(5)
                      setSafeguardsScore(5)
                      setConsentScore(5)
                    }}
                    className="h-10 px-5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base gap-2 shadow-xs cursor-pointer"
                  >
                    <Vote className="size-4" />
                    <span>Conduct Deliberation</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Formal Deliberation & Ethical Scoring Modal */}
      <Dialog
        open={!!evaluatingProtocol}
        onOpenChange={(open) => {
          if (!open) setEvaluatingProtocol(null)
        }}
      >
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-1">
            <DialogTitle className="flex items-center gap-2 text-xl font-black text-primary dark:text-white">
              <Scale className="size-5 text-secondary" />
              <span>Ethical Deliberation & Clearance Determination</span>
            </DialogTitle>
            <DialogDescription className="text-body-sm text-muted-foreground">
              Formulate your independent evaluation for protocol{" "}
              <strong className="text-foreground">{evaluatingProtocol?.id}</strong> (&ldquo;{evaluatingProtocol?.title}&rdquo;).
            </DialogDescription>
          </DialogHeader>

          {evaluatingProtocol && (
            <div className="space-y-5 py-3">
              {/* Scoring Rubric Grid */}
              <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-4">
                <span className="text-micro font-bold uppercase tracking-wider text-muted-foreground block">
                  Institutional Ethical Evaluation Scores (1 = Poor, 5 = Exemplary)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Merit Score */}
                  <div className="space-y-1.5">
                    <label className="text-micro font-bold text-foreground flex items-center justify-between">
                      <span>Scientific Merit</span>
                      <span className="text-primary font-black">{meritScore}/5</span>
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Button
                          key={s}
                          type="button"
                          variant={meritScore >= s ? "default" : "outline"}
                          size="sm"
                          onClick={() => setMeritScore(s)}
                          className={`flex-1 h-8 p-0 text-xs font-bold ${
                            meritScore >= s ? "bg-primary text-white" : ""
                          }`}
                        >
                          {s}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Safeguards Score */}
                  <div className="space-y-1.5">
                    <label className="text-micro font-bold text-foreground flex items-center justify-between">
                      <span>Human Safeguards</span>
                      <span className="text-secondary font-black">{safeguardsScore}/5</span>
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Button
                          key={s}
                          type="button"
                          variant={safeguardsScore >= s ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSafeguardsScore(s)}
                          className={`flex-1 h-8 p-0 text-xs font-bold ${
                            safeguardsScore >= s ? "bg-secondary text-white" : ""
                          }`}
                        >
                          {s}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Consent Score */}
                  <div className="space-y-1.5">
                    <label className="text-micro font-bold text-foreground flex items-center justify-between">
                      <span>Informed Consent</span>
                      <span className="text-amber-600 font-black">{consentScore}/5</span>
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Button
                          key={s}
                          type="button"
                          variant={consentScore >= s ? "default" : "outline"}
                          size="sm"
                          onClick={() => setConsentScore(s)}
                          className={`flex-1 h-8 p-0 text-xs font-bold ${
                            consentScore >= s ? "bg-amber-500 text-white" : ""
                          }`}
                        >
                          {s}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendation Selection */}
              <div className="space-y-2">
                <label className="text-table-cell font-bold text-foreground block">
                  Final Deliberation Determination
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEvaluationRecommendation("Clearance Approved")}
                    className={`h-11 justify-start px-3.5 font-bold text-sm ${
                      evaluationRecommendation === "Clearance Approved"
                        ? "bg-emerald-500/15 border-emerald-500 text-emerald-800 dark:text-emerald-200 ring-2 ring-emerald-500/20"
                        : "hover:bg-slate-50 dark:hover:bg-slate-900"
                    }`}
                  >
                    <CheckCircle2 className="size-4 mr-2 text-secondary shrink-0" />
                    <span>Clearance Approved</span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEvaluationRecommendation("Revisions Required")}
                    className={`h-11 justify-start px-3.5 font-bold text-sm ${
                      evaluationRecommendation === "Revisions Required"
                        ? "bg-amber-500/15 border-amber-500 text-amber-800 dark:text-amber-200 ring-2 ring-amber-500/20"
                        : "hover:bg-slate-50 dark:hover:bg-slate-900"
                    }`}
                  >
                    <AlertCircle className="size-4 mr-2 text-amber-500 shrink-0" />
                    <span>Revisions Required</span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEvaluationRecommendation("Ethics Rejection")}
                    className={`h-11 justify-start px-3.5 font-bold text-sm ${
                      evaluationRecommendation === "Ethics Rejection"
                        ? "bg-rose-500/15 border-rose-500 text-rose-800 dark:text-rose-200 ring-2 ring-rose-500/20"
                        : "hover:bg-slate-50 dark:hover:bg-slate-900"
                    }`}
                  >
                    <AlertTriangle className="size-4 mr-2 text-rose-500 shrink-0" />
                    <span>Ethics Rejection</span>
                  </Button>
                </div>
              </div>

              {/* Deliberation Written Remarks */}
              <div className="space-y-1.5">
                <label className="text-table-cell font-bold text-foreground block">
                  Official Deliberation Remarks & Justification <span className="text-rose-500">*</span>
                </label>
                <Textarea
                  value={deliberationRemarks}
                  onChange={(e) => setDeliberationRemarks(e.target.value)}
                  placeholder="Record formal IRB committee observations, participant safety assessments, data security conditions, or required amendments..."
                  rows={4}
                  className="text-base"
                />
                <p className="text-micro text-muted-foreground">
                  Minimum 10 characters. These remarks will be permanently recorded in the institutional ledger.
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-slate-200/80 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEvaluatingProtocol(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => handleSubmitEvaluation()}
              disabled={!deliberationRemarks.trim() || deliberationRemarks.trim().length < 10}
              className={`font-bold gap-1.5 cursor-pointer ${
                evaluationRecommendation === "Clearance Approved"
                  ? "bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                  : evaluationRecommendation === "Revisions Required"
                  ? "bg-amber-600 hover:bg-amber-700 text-white"
                  : "bg-rose-600 hover:bg-rose-700 text-white"
              }`}
            >
              <Send className="size-4" />
              <span>Submit Binding Determination</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardContainer>
  )
}
