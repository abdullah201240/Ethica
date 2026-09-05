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
  Send,
  Upload,
  FileCheck2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { DashboardContainer } from "@/components/dashboard/dashboard-container"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  getProtocolById,
  updateProtocol,
  subscribeProtocols,
  type Protocol,
} from "@/lib/protocols-store"

interface PageProps {
  params: Promise<{ id: string }>
}

export default function ApplicationDossierPage({ params }: PageProps) {
  const resolvedParams = React.use(params)
  const appId = resolvedParams.id

  const [protocol, setProtocol] = React.useState<Protocol | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [copiedId, setCopiedId] = React.useState(false)

  // Revision submission state
  const [revisionDialogOpen, setRevisionDialogOpen] = React.useState(false)
  const [revisionNotes, setRevisionNotes] = React.useState("")
  const [revisionFileName, setRevisionFileName] = React.useState("")
  const [isSubmittingRevision, setIsSubmittingRevision] = React.useState(false)

  React.useEffect(() => {
    const load = () => {
      const found = getProtocolById(appId)
      if (found) {
        setProtocol(found)
      }
      setLoading(false)
    }

    load()
    const unsubscribe = subscribeProtocols(load)
    return () => unsubscribe()
  }, [appId])

  const handleCopyId = () => {
    if (!protocol) return
    navigator.clipboard.writeText(protocol.id)
    setCopiedId(true)
    toast.info("Reference Copied", {
      description: `Protocol ID ${protocol.id} copied to clipboard.`,
    })
    setTimeout(() => setCopiedId(false), 2000)
  }

  const handleDownloadCertificate = () => {
    if (!protocol) return
    toast.success("Digital Clearance Certificate Exported", {
      description: `Official sealed clearance certificate PDF for ${protocol.id} generated with SHA-256 seal ${protocol.certificateSealHash?.slice(0, 16) || "8f92a47e..."}.`,
    })
  }

  const handleDownloadReceipt = () => {
    if (!protocol) return
    toast.success("Institutional Fee Voucher Exported", {
      description: `Official BDT fee payment receipt token for ${protocol.id} (TrxID: ${protocol.transactionId || "N/A"}) downloaded.`,
    })
  }

  const handleSubmitRevision = (e: React.FormEvent) => {
    e.preventDefault()
    if (!revisionNotes.trim() || revisionNotes.trim().length < 15) {
      toast.error("Detailed Remarks Required", {
        description: "Please provide at least 15 characters detailing your revisions and compliance responses.",
      })
      return
    }

    setIsSubmittingRevision(true)
    setTimeout(() => {
      if (protocol) {
        updateProtocol(protocol.id, {
          status: "Under Committee Review",
          statusColor: "amber",
          reviewStep: 4,
          committeeRemarks: `Revision Submitted: "${revisionNotes.trim()}" (File: ${revisionFileName || "Revised_Dossier_Addendum.pdf"}). Under re-review by Secretariat.`,
        })
      }
      setIsSubmittingRevision(false)
      setRevisionDialogOpen(false)
      toast.success("Revisions Dispatched to Secretariat", {
        description: "Your revised protocol dossier and compliance notes have been routed back to the Review Board for re-evaluation.",
      })
    }, 900)
  }

  if (loading) {
    return (
      <DashboardContainer className="py-4 space-y-6">
        <Skeleton className="h-6 w-48 rounded-md" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 rounded-2xl lg:col-span-2" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </DashboardContainer>
    )
  }

  if (!protocol) {
    return (
      <DashboardContainer className="py-8 text-center space-y-4">
        <div className="size-16 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="size-8" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Application Record Not Found</h2>
        <p className="text-body-sm text-muted-foreground max-w-md mx-auto">
          No research clearance application was found matching reference <strong>{appId}</strong>. It may have been archived or removed.
        </p>
        <Link href="/applications">
          <Button variant="default" className="mt-2 font-bold cursor-pointer">
            Back to My Applications
          </Button>
        </Link>
      </DashboardContainer>
    )
  }

  const currentStep = protocol.reviewStep ?? (protocol.status === "Clearance Granted" ? 5 : 4)

  const steps = [
    {
      num: 1,
      title: "Intake & Sealing",
      desc: "Protocol Registered",
      completed: true,
    },
    {
      num: 2,
      title: "Payment Verified",
      desc: `৳ ${(protocol.feeAmountBdt ?? 7500).toLocaleString()} BDT Settled`,
      completed: true,
    },
    {
      num: 3,
      title: "Secretariat Triage",
      desc: protocol.isExpedited ? "Fast-Track Cleared" : "Board Assigned",
      completed: currentStep >= 3,
    },
    {
      num: 4,
      title: "Committee Deliberation",
      desc:
        protocol.status === "Revision Requested"
          ? "Revisions Required"
          : currentStep > 4
          ? "Deliberation Concluded"
          : "Peer Review In Progress",
      completed: currentStep >= 4 && protocol.status !== "Revision Requested",
      active: currentStep === 4,
      alert: protocol.status === "Revision Requested",
    },
    {
      num: 5,
      title: "Determination",
      desc:
        protocol.status === "Clearance Granted"
          ? "Clearance Granted"
          : "Awaiting Board Vote",
      completed: protocol.status === "Clearance Granted",
      active: currentStep === 5,
    },
  ]

  return (
    <DashboardContainer className="py-4 space-y-6">
      {/* ── Top Back-Navigation Bar (Rule 13) ─────────────────────────────── */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/applications"
          className="inline-flex items-center gap-1.5 text-body-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span>Back to My Applications</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopyId}
            className="h-8 px-3 text-body-sm font-semibold rounded-md gap-1.5 cursor-pointer"
          >
            {copiedId ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
            <span>{copiedId ? "Copied" : "Copy ID"}</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="h-8 px-3 text-body-sm font-semibold rounded-md gap-1.5 cursor-pointer hidden sm:inline-flex"
          >
            <Printer className="size-3.5" />
            <span>Print Dossier</span>
          </Button>
        </div>
      </div>

      {/* ── Comprehensive Entity Header Card (Rule 13) ────────────────────── */}
      <Card className="rounded-none sm:rounded-2xl border-y sm:border border-border/75 bg-card p-5 sm:p-6 shadow-xs select-text space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-base font-bold px-2.5 py-1 rounded-md bg-primary/8 dark:bg-white/8 text-primary dark:text-sky-300 border border-primary/15 dark:border-white/10">
                {protocol.id}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 text-micro font-bold px-2.5 py-1 rounded-md border whitespace-nowrap ${
                  protocol.statusColor === "emerald"
                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                    : protocol.statusColor === "amber"
                    ? "bg-amber-500/10 text-amber-800 dark:text-amber-400 border-amber-500/20"
                    : protocol.statusColor === "blue"
                    ? "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20"
                    : "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20"
                }`}
              >
                <span
                  className={`size-1.5 rounded-full shrink-0 ${
                    protocol.statusColor === "emerald"
                      ? "bg-emerald-500"
                      : protocol.statusColor === "amber"
                      ? "bg-amber-500"
                      : protocol.statusColor === "blue"
                      ? "bg-sky-500"
                      : "bg-rose-500"
                  }`}
                />
                {protocol.status}
              </span>
              <Badge
                variant="outline"
                className={`text-micro font-semibold ${
                  protocol.riskColor === "emerald"
                    ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400"
                    : protocol.riskColor === "purple"
                    ? "bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-400"
                    : "bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-400"
                }`}
              >
                {protocol.risk}
              </Badge>
              {protocol.isExpedited && (
                <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 text-micro">
                  Expedited Fast-Track
                </Badge>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight leading-snug">
              {protocol.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-body-sm text-muted-foreground pt-1">
              <span className="flex items-center gap-1.5">
                <Building2 className="size-4 text-slate-400" />
                <strong className="text-foreground">{protocol.department}</strong>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-secondary" />
                <span>{protocol.board}</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="size-4 text-slate-400" />
                <span>Submitted {protocol.submissionDate} ({protocol.daysInReview}d ago)</span>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {protocol.hasCertificate && (
              <Button
                type="button"
                variant="default"
                onClick={handleDownloadCertificate}
                className="h-10 px-4 text-body-sm font-bold bg-[#198754] hover:bg-[#157347] text-white rounded-md gap-2 shadow-xs cursor-pointer"
              >
                <Download className="size-4" />
                <span>Download Clearance Certificate</span>
              </Button>
            )}

            {protocol.status === "Revision Requested" && (
              <Button
                type="button"
                variant="default"
                onClick={() => setRevisionDialogOpen(true)}
                className="h-10 px-4 text-body-sm font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-md gap-2 shadow-xs cursor-pointer animate-pulse"
              >
                <Send className="size-4" />
                <span>Submit Revisions</span>
              </Button>
            )}

            <Button
              type="button"
              variant="outline"
              onClick={handleDownloadReceipt}
              className="h-10 px-4 text-body-sm font-bold rounded-md gap-2 cursor-pointer"
            >
              <Wallet className="size-4 text-secondary" />
              <span>Payment Voucher</span>
            </Button>
          </div>
        </div>

        {/* ── 5-Stage Visual Lifecycle Stepper ──────────────────────────────── */}
        <div className="pt-4 border-t border-border/70">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {steps.map((s) => (
              <div
                key={s.num}
                className={`p-3 rounded-lg border text-left space-y-1 transition-all ${
                  s.completed
                    ? "border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10"
                    : s.alert
                    ? "border-rose-500/40 bg-rose-500/5 dark:bg-rose-500/10 ring-1 ring-rose-500/20"
                    : s.active
                    ? "border-primary/40 bg-primary/5 dark:bg-white/5 ring-1 ring-primary/20"
                    : "border-border/60 bg-muted/20 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[0.68rem] font-bold uppercase tracking-wider text-muted-foreground">
                    Stage {s.num}
                  </span>
                  {s.completed ? (
                    <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                  ) : s.alert ? (
                    <AlertCircle className="size-3.5 text-rose-600" />
                  ) : (
                    <Clock className="size-3.5 text-slate-400" />
                  )}
                </div>
                <h5 className="font-bold text-micro sm:text-body-sm text-foreground truncate">
                  {s.title}
                </h5>
                <p className="text-[0.68rem] text-muted-foreground truncate">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* ── Revisions Requested Urgent Alert (if applicable) ────────────────── */}
      {protocol.status === "Revision Requested" && (
        <div className="rounded-none sm:rounded-2xl border-y sm:border border-rose-500/40 bg-rose-500/5 dark:bg-rose-500/10 p-5 shadow-xs space-y-3">
          <div className="flex items-start gap-3.5">
            <div className="size-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <AlertCircle className="size-5" />
            </div>
            <div className="space-y-1 flex-1">
              <h4 className="text-card-title text-rose-700 dark:text-rose-400">
                Action Required: Research Ethics Board Revision Directives
              </h4>
              <p className="text-body-sm text-foreground/80 leading-relaxed">
                {protocol.committeeRemarks ||
                  "The Institutional Review Board committee has reviewed your proposal and requested amendments before ethical clearance can be granted."}
              </p>
            </div>
            <Button
              type="button"
              onClick={() => setRevisionDialogOpen(true)}
              className="h-9 px-4 text-body-sm font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-md shrink-0 cursor-pointer"
            >
              Respond & Resubmit
            </Button>
          </div>
        </div>
      )}

      {/* ── Deep Context Responsive Cards Grid ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Scientific Scope, Methodology, Cohorts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card: Study Abstract & Scientific Design */}
          <Card className="rounded-none sm:rounded-2xl border-y sm:border border-border/75 bg-card p-5 sm:p-6 shadow-xs select-text space-y-4">
            <h3 className="text-card-title text-foreground flex items-center gap-2">
              <FileText className="size-5 text-primary dark:text-sky-300" />
              <span>Scientific Methodology & Protocol Abstract</span>
            </h3>
            <p className="text-body text-foreground/85 leading-relaxed bg-muted/20 p-4 rounded-xl border border-border/60">
              {protocol.abstract ||
                "Prospective observational study evaluating biometric surveillance, diagnostic efficacy, and participant risk thresholds in accordance with DIU Research Ethics Board governance criteria."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-body-sm">
              <div>
                <span className="text-micro font-bold text-muted-foreground uppercase tracking-wider block">
                  Study Classification:
                </span>
                <span className="font-semibold text-foreground">
                  {protocol.studyType || "Epidemiological / Observational"}
                </span>
              </div>
              <div>
                <span className="text-micro font-bold text-muted-foreground uppercase tracking-wider block">
                  Project Duration:
                </span>
                <span className="font-semibold text-foreground">
                  {protocol.durationMonths || 12} Months
                </span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-micro font-bold text-muted-foreground uppercase tracking-wider block">
                  Research Location & Field Sites:
                </span>
                <span className="font-semibold text-foreground">
                  {protocol.studyLocation || "DIU Research Enclave & Associated Regional Field Units"}
                </span>
              </div>
              {protocol.coInvestigators && (
                <div className="sm:col-span-2">
                  <span className="text-micro font-bold text-muted-foreground uppercase tracking-wider block">
                    Co-Investigators & Key Personnel:
                  </span>
                  <span className="font-semibold text-foreground">
                    {protocol.coInvestigators}
                  </span>
                </div>
              )}
            </div>
          </Card>

          {/* Card: Human Subjects, Cohort, and Consent Protections */}
          <Card className="rounded-none sm:rounded-2xl border-y sm:border border-border/75 bg-card p-5 sm:p-6 shadow-xs select-text space-y-4">
            <h3 className="text-card-title text-foreground flex items-center gap-2">
              <Users className="size-5 text-secondary" />
              <span>Human Participants & Ethical Safeguards</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-body-sm">
              <div className="p-3.5 rounded-xl border border-border/70 bg-muted/20 space-y-1">
                <span className="text-micro font-bold text-muted-foreground uppercase tracking-wider block">
                  Target Sample Size:
                </span>
                <span className="text-lg font-black text-foreground tabular-nums">
                  {(protocol.targetSampleSize || 500).toLocaleString()} Participants
                </span>
              </div>

              <div className="p-3.5 rounded-xl border border-border/70 bg-muted/20 space-y-1">
                <span className="text-micro font-bold text-muted-foreground uppercase tracking-wider block">
                  Consent Procedure:
                </span>
                <span className="font-bold text-foreground">
                  {protocol.consentType || "Written Informed Consent (Bangla & English)"}
                </span>
              </div>

              <div className="sm:col-span-2 p-3.5 rounded-xl border border-border/70 bg-muted/20 space-y-1">
                <span className="text-micro font-bold text-muted-foreground uppercase tracking-wider block">
                  Vulnerable Cohorts Identified:
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {protocol.vulnerablePopulations && protocol.vulnerablePopulations.length > 0 ? (
                    protocol.vulnerablePopulations.map((v) => (
                      <Badge key={v} variant="secondary" className="text-micro">
                        {v}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-micro">
                      None identified (Standard healthy adult cohorts)
                    </span>
                  )}
                </div>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <span className="text-micro font-bold text-muted-foreground uppercase tracking-wider block">
                  Data Confidentiality & Cryptographic Security:
                </span>
                <p className="text-body-sm text-foreground/80 leading-relaxed bg-muted/10 p-3 rounded-lg border border-border/60">
                  {protocol.dataConfidentiality ||
                    "All patient identifiers will be cryptographically hashed using SHA-256. Primary research databases are hosted on encrypted DIU secure enclave servers with zero third-party disclosure."}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column (1 Col): Dossier Attachments, Payment Voucher, Certificate */}
        <div className="space-y-6">
          {/* Card: Attached Documents Dossier */}
          <Card className="rounded-none sm:rounded-2xl border-y sm:border border-border/75 bg-card p-5 sm:p-6 shadow-xs select-text space-y-4">
            <h3 className="text-card-title text-foreground flex items-center gap-2">
              <FileCheck2 className="size-5 text-primary dark:text-sky-300" />
              <span>Dossier Attachments</span>
            </h3>

            <div className="space-y-2.5 text-body-sm">
              <div className="flex items-center justify-between p-3 rounded-lg border border-border/70 bg-muted/20 hover:bg-muted/40 transition-colors">
                <div className="min-w-0 pr-2">
                  <span className="font-bold text-foreground block truncate">
                    {protocol.proposalDocumentName || "Research_Protocol_Proposal.pdf"}
                  </span>
                  <span className="text-micro text-muted-foreground">Full Protocol Specification</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() =>
                    toast.info("Document Preview", {
                      description: `Opening ${protocol.proposalDocumentName || "Research_Protocol_Proposal.pdf"} in secure viewer.`,
                    })
                  }
                  className="size-7 text-primary hover:text-primary cursor-pointer"
                >
                  <Download className="size-3.5" />
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-border/70 bg-muted/20 hover:bg-muted/40 transition-colors">
                <div className="min-w-0 pr-2">
                  <span className="font-bold text-foreground block truncate">
                    {protocol.consentDocumentName || "Informed_Consent_Bengali_English.pdf"}
                  </span>
                  <span className="text-micro text-muted-foreground">Consent Form (ICF)</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() =>
                    toast.info("Document Preview", {
                      description: `Opening ${protocol.consentDocumentName || "Informed_Consent_Bengali_English.pdf"} in secure viewer.`,
                    })
                  }
                  className="size-7 text-primary hover:text-primary cursor-pointer"
                >
                  <Download className="size-3.5" />
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-border/70 bg-muted/20 hover:bg-muted/40 transition-colors">
                <div className="min-w-0 pr-2">
                  <span className="font-bold text-foreground block truncate">
                    {protocol.dataToolsDocumentName || "Questionnaire_Clinical_Tools.pdf"}
                  </span>
                  <span className="text-micro text-muted-foreground">Survey / Instruments</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() =>
                    toast.info("Document Preview", {
                      description: `Opening ${protocol.dataToolsDocumentName || "Questionnaire_Clinical_Tools.pdf"} in secure viewer.`,
                    })
                  }
                  className="size-7 text-primary hover:text-primary cursor-pointer"
                >
                  <Download className="size-3.5" />
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-border/70 bg-muted/20 hover:bg-muted/40 transition-colors">
                <div className="min-w-0 pr-2">
                  <span className="font-bold text-foreground block truncate">
                    {protocol.investigatorCvName || "Principal_Investigator_Biosketch.pdf"}
                  </span>
                  <span className="text-micro text-muted-foreground">Investigator Biosketch</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() =>
                    toast.info("Document Preview", {
                      description: `Opening ${protocol.investigatorCvName || "Principal_Investigator_Biosketch.pdf"} in secure viewer.`,
                    })
                  }
                  className="size-7 text-primary hover:text-primary cursor-pointer"
                >
                  <Download className="size-3.5" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Card: BDT Payment & Gateway Settlement */}
          <Card className="rounded-none sm:rounded-2xl border-y sm:border border-border/75 bg-card p-5 sm:p-6 shadow-xs select-text space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-card-title text-foreground flex items-center gap-2">
                <Wallet className="size-5 text-secondary" />
                <span>BDT Fee Settlement</span>
              </h3>
              <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-micro">
                Paid & Verified
              </Badge>
            </div>

            <div className="space-y-2.5 text-body-sm font-mono">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="text-muted-foreground font-sans">Total Fee (BDT):</span>
                <span className="text-lg font-black text-secondary font-sans">
                  ৳ {(protocol.feeAmountBdt ?? 7500).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-micro">
                <span className="text-muted-foreground font-sans">Payment Method:</span>
                <span className="font-bold uppercase text-foreground">
                  {protocol.paymentMethod || "bKash Gateway"}
                </span>
              </div>
              {protocol.senderNumber && (
                <div className="flex items-center justify-between text-micro">
                  <span className="text-muted-foreground font-sans">Sender Account:</span>
                  <span className="text-foreground">{protocol.senderNumber}</span>
                </div>
              )}
              {protocol.transactionId && (
                <div className="flex items-center justify-between text-micro">
                  <span className="text-muted-foreground font-sans">Gateway TrxID:</span>
                  <span className="text-primary dark:text-sky-300 font-bold">
                    {protocol.transactionId}
                  </span>
                </div>
              )}
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleDownloadReceipt}
              className="w-full h-9 text-body-sm font-bold gap-2 cursor-pointer"
            >
              <Download className="size-3.5" />
              <span>Download BDT Payment Receipt</span>
            </Button>
          </Card>

          {/* Card: Digital Clearance Certificate (if cleared) */}
          {protocol.hasCertificate && (
            <Card
              id="certificate"
              className="rounded-none sm:rounded-2xl border-y sm:border border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-500/10 p-5 sm:p-6 shadow-xs select-text space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-card-title text-foreground flex items-center gap-2">
                  <Award className="size-5 text-secondary" />
                  <span>Digital Ethical Clearance</span>
                </h3>
                <Badge className="bg-secondary text-white font-mono text-micro font-bold">
                  VALID SEAL
                </Badge>
              </div>

              <div className="space-y-2 text-body-sm font-mono text-muted-foreground">
                <div className="p-2.5 rounded-lg bg-card border border-emerald-500/20 text-micro">
                  <span className="block text-slate-400 uppercase font-sans font-bold text-[0.65rem]">
                    Cryptographic Seal (SHA-256):
                  </span>
                  <span className="text-emerald-700 dark:text-emerald-400 break-all font-bold">
                    {protocol.certificateSealHash ||
                      "8f92a47e19b02356c9a34e007821ef9a128f7734bbd82910c4412efb6680a34e"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-micro font-sans">
                  <span>Issued: {protocol.certificateIssueDate || "Aug 17, 2026"}</span>
                  <span>Expires: {protocol.certificateExpiryDate || "Aug 17, 2027"}</span>
                </div>
              </div>

              <Button
                type="button"
                variant="default"
                onClick={handleDownloadCertificate}
                className="w-full h-10 text-body-sm font-bold bg-secondary hover:bg-secondary/90 text-white gap-2 shadow-xs cursor-pointer"
              >
                <Download className="size-4" />
                <span>Download Sealed Certificate</span>
              </Button>
            </Card>
          )}
        </div>
      </div>

      {/* ── Modal Dialog: Submit Revisions to Secretariat ─────────────────── */}
      <Dialog open={revisionDialogOpen} onOpenChange={setRevisionDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">
              Submit Protocol Revisions & Clarifications
            </DialogTitle>
            <DialogDescription className="text-body-sm text-muted-foreground">
              Provide detailed responses to the IRB Committee’s remarks. Your update will be logged and routed to the Secretariat.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitRevision} className="space-y-4 py-2">
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-body-sm text-rose-700 dark:text-rose-400">
              <strong>Committee Directive:</strong>
              <p className="text-micro mt-0.5">{protocol.committeeRemarks}</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-body-sm font-bold text-foreground block">
                Investigator Response & Amendment Notes:
              </label>
              <Textarea
                rows={4}
                value={revisionNotes}
                onChange={(e) => setRevisionNotes(e.target.value)}
                placeholder="Explain the changes made to your protocol, data handling safeguards, or participant consent procedures..."
                className="text-body-sm"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-body-sm font-bold text-foreground block">
                Attach Revised Dossier / Addendum (PDF):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  id="revFile"
                  className="hidden"
                  accept=".pdf,.docx"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) setRevisionFileName(f.name)
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById("revFile")?.click()}
                  className="h-9 px-3 text-body-sm font-medium gap-1.5 cursor-pointer"
                >
                  <Upload className="size-3.5" />
                  <span>Choose File</span>
                </Button>
                <span className="text-body-sm text-muted-foreground truncate">
                  {revisionFileName || "No file selected"}
                </span>
              </div>
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setRevisionDialogOpen(false)}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmittingRevision}
                className="bg-primary text-white font-bold cursor-pointer"
              >
                {isSubmittingRevision ? "Dispatching..." : "Submit to Secretariat"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardContainer>
  )
}
