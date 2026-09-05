"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Upload,
  FileText,
  FileCheck2,
  Send,
  Copy,
  Check,
  Download,
  Wallet,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/sonner"
import { DashboardContainer } from "@/components/dashboard/dashboard-container"
import {
  step1ProtocolGeneralSchema,
  step2ProtocolMethodologySchema,
  step3ProtocolDocumentsSchema,
  step4ProtocolPaymentSchema,
  fullProtocolApplicationSchema,
  IRB_BOARDS,
  STUDY_TYPES,
  RISK_TIERS,
  CONSENT_PROCEDURES,
  FEE_TIERS,
  EXPEDITED_SURCHARGE_BDT,
  type Step1ProtocolGeneralInput,
  type Step2ProtocolMethodologyInput,
  type Step3ProtocolDocumentsInput,
  type Step4ProtocolPaymentInput,
} from "@/lib/schemas"
import { addProtocol } from "@/lib/protocols-store"

type FeeTierKey = "student" | "faculty" | "clinical" | "sponsored"
type PaymentMethodKey = "bkash" | "nagad" | "rocket" | "bank_transfer" | "card"

const STEPS = [
  { step: 1, label: "Protocol Scope", icon: Building2 },
  { step: 2, label: "Methodology & Risk", icon: ShieldCheck },
  { step: 3, label: "Dossier Attachments", icon: Upload },
  { step: 4, label: "Processing Fee (BDT ৳)", icon: Wallet },
  { step: 5, label: "Review & Submit", icon: FileCheck2 },
]

export default function ApplyForResearchPermissionPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = React.useState(1)
  const [submitted, setSubmitted] = React.useState(false)
  const [generatedProtocolId, setGeneratedProtocolId] = React.useState("")
  const [copiedTrx, setCopiedTrx] = React.useState(false)

  // ── Step 1 State ──────────────────────────────────────────────────────────
  const [step1, setStep1] = React.useState<Step1ProtocolGeneralInput>({
    title: "",
    department: "Public Health & Clinical Epidemiology",
    board: "Biomedical IRB",
    studyType: "Epidemiological / Observational",
    durationMonths: 12,
    studyLocation: "DIU Ashulia Research Complex & Associated Clinical Field Sites",
    coInvestigators: "Dr. Farzana Choudhury (icddr,b), Prof. Charles Montgomery (DIU)",
  })

  // ── Step 2 State ──────────────────────────────────────────────────────────
  const [step2, setStep2] = React.useState<Step2ProtocolMethodologyInput>({
    abstract: "",
    targetSampleSize: 500,
    vulnerablePopulations: ["Pregnant Women"],
    riskTier: "Minimal Risk",
    consentType: "Written Informed Consent (Bangla & English)",
    dataConfidentiality:
      "All patient identifiers will be cryptographically hashed using SHA-256. Primary research databases are hosted on encrypted DIU secure enclave servers with zero third-party disclosure.",
  })

  // ── Step 3 State ──────────────────────────────────────────────────────────
  const [step3, setStep3] = React.useState<Step3ProtocolDocumentsInput>({
    protocolProposalName: "",
    consentFormName: "",
    dataToolsName: "",
    investigatorCvName: "",
  })

  // File input refs for Step 3
  const proposalInputRef = React.useRef<HTMLInputElement>(null)
  const consentInputRef = React.useRef<HTMLInputElement>(null)
  const toolsInputRef = React.useRef<HTMLInputElement>(null)
  const cvInputRef = React.useRef<HTMLInputElement>(null)

  // ── Step 4 State (Bangladeshi Taka Fee & Payment) ─────────────────────────
  const [feeTier, setFeeTier] = React.useState<FeeTierKey>("faculty")
  const [isExpedited, setIsExpedited] = React.useState(false)
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethodKey>("bkash")
  const [senderNumber, setSenderNumber] = React.useState("")
  const [transactionId, setTransactionId] = React.useState("")
  const [paymentVerified, setPaymentVerified] = React.useState(false)
  const [isVerifyingPayment, setIsVerifyingPayment] = React.useState(false)

  // ── Step 5 Attestation ───────────────────────────────────────────────────
  const [agreeHelsinki, setAgreeHelsinki] = React.useState(false)

  // ── Form Errors ──────────────────────────────────────────────────────────
  const [stepErrors, setStepErrors] = React.useState<Record<string, string>>({})

  // ── Calculate Total BDT Fee ──────────────────────────────────────────────
  const baseFeeBdt = FEE_TIERS[feeTier].amountBdt
  const expeditedFeeBdt = isExpedited ? EXPEDITED_SURCHARGE_BDT : 0
  const totalFeeBdt = baseFeeBdt + expeditedFeeBdt

  // ── Step Validation ──────────────────────────────────────────────────────
  const validateStep = (stepNumber: number): boolean => {
    setStepErrors({})

    if (stepNumber === 1) {
      const parsed = step1ProtocolGeneralSchema.safeParse(step1)
      if (!parsed.success) {
        const errors: Record<string, string> = {}
        parsed.error.issues.forEach((issue) => {
          if (issue.path[0]) errors[issue.path[0].toString()] = issue.message
        })
        setStepErrors(errors)
        toast.error("Form Incomplete", {
          description: parsed.error.issues[0]?.message || "Please check required protocol details.",
        })
        return false
      }
      return true
    }

    if (stepNumber === 2) {
      const parsed = step2ProtocolMethodologySchema.safeParse(step2)
      if (!parsed.success) {
        const errors: Record<string, string> = {}
        parsed.error.issues.forEach((issue) => {
          if (issue.path[0]) errors[issue.path[0].toString()] = issue.message
        })
        setStepErrors(errors)
        toast.error("Methodology Requirements Unmet", {
          description: parsed.error.issues[0]?.message || "Please complete study abstract and ethics risk assessment.",
        })
        return false
      }
      return true
    }

    if (stepNumber === 3) {
      const parsed = step3ProtocolDocumentsSchema.safeParse(step3)
      if (!parsed.success) {
        const errors: Record<string, string> = {}
        parsed.error.issues.forEach((issue) => {
          if (issue.path[0]) errors[issue.path[0].toString()] = issue.message
        })
        setStepErrors(errors)
        toast.error("Missing Documents", {
          description: parsed.error.issues[0]?.message || "Please attach both the research proposal PDF and consent form.",
        })
        return false
      }
      return true
    }

    if (stepNumber === 4) {
      const payload: Step4ProtocolPaymentInput = {
        feeTier,
        isExpeditedTriage: isExpedited,
        feeAmountBdt: totalFeeBdt,
        paymentMethod,
        senderNumber,
        transactionId,
        paymentVerified,
      }
      const parsed = step4ProtocolPaymentSchema.safeParse(payload)
      if (!parsed.success) {
        const errors: Record<string, string> = {}
        parsed.error.issues.forEach((issue) => {
          if (issue.path[0]) errors[issue.path[0].toString()] = issue.message
        })
        setStepErrors(errors)
        toast.error("Payment Verification Required", {
          description: parsed.error.issues[0]?.message || "Please verify your fee payment in BDT.",
        })
        return false
      }
      return true
    }

    return true
  }

  // ── Navigation Between Steps ─────────────────────────────────────────────
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5))
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // ── Step 3 File Attachment Handlers ──────────────────────────────────────
  const handleFileAttach = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Step3ProtocolDocumentsInput
  ) => {
    const file = e.target.files?.[0]
    if (file) {
      setStep3((prev) => ({ ...prev, [field]: file.name }))
      setStepErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
      toast.success("Document Attached", {
        description: `Attached ${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
      })
    }
  }

  // ── Step 4 Payment Verification Simulation ───────────────────────────────
  const handleVerifyPayment = () => {
    if (!senderNumber.trim() || senderNumber.trim().length < 4) {
      toast.error("Invalid Sender Account", {
        description: "Please enter a valid sender mobile or bank account number.",
      })
      return
    }

    if (!transactionId.trim() || transactionId.trim().length < 6) {
      toast.error("Invalid Transaction ID", {
        description: "Please enter a valid TrxID or Bank Challan No (min 6 characters).",
      })
      return
    }

    setIsVerifyingPayment(true)
    setTimeout(() => {
      setIsVerifyingPayment(false)
      setPaymentVerified(true)
      setStepErrors((prev) => {
        const next = { ...prev }
        delete next.paymentVerified
        delete next.transactionId
        delete next.senderNumber
        return next
      })
      toast.success("Payment Successfully Verified", {
        description: `৳ ${totalFeeBdt.toLocaleString()} BDT confirmed via ${paymentMethod.toUpperCase()} (TrxID: ${transactionId.toUpperCase()}). Institutional receipt generated.`,
      })
    }, 1200)
  }

  // ── Autofill Sample Research Protocol (Testing Assistant) ─────────────────
  const handleAutofillDemoProtocol = () => {
    setStep1({
      title: "Randomized Evaluation of Point-of-Care Maternal Biomarker Surveillance in Rural Bangladesh",
      department: "Public Health & Clinical Epidemiology",
      board: "Biomedical IRB",
      studyType: "Epidemiological / Observational",
      durationMonths: 18,
      studyLocation: "DIU Ashulia Research Center & Tangail Upazila Health Complex",
      coInvestigators: "Dr. Farzana Choudhury (icddr,b), Prof. Charles Montgomery (DIU)",
    })
    setStep2({
      abstract:
        "This prospective clinical study evaluates the diagnostic efficacy, acceptability, and ethical safeguards of mobile point-of-care maternal pre-eclampsia biomarker screening across 500 rural participants in Bangladesh. Protocols follow Belmont Report principles with strict anonymization.",
      targetSampleSize: 500,
      vulnerablePopulations: ["Pregnant Women"],
      riskTier: "Minimal Risk",
      consentType: "Written Informed Consent (Bangla & English)",
      dataConfidentiality:
        "All patient identifiers will be cryptographically hashed using SHA-256. Primary research databases are hosted on encrypted DIU secure enclave servers with zero third-party disclosure.",
    })
    setStep3({
      protocolProposalName: "Maternal_Biomarker_Protocol_Proposal_v2.pdf",
      consentFormName: "Participant_Informed_Consent_Bengali_English.pdf",
      dataToolsName: "Structured_Clinical_Intake_Questionnaire.pdf",
      investigatorCvName: "Principal_Investigator_Biosketch_CV.pdf",
    })
    setFeeTier("faculty")
    setIsExpedited(true)
    setPaymentMethod("bkash")
    setSenderNumber("01711998877")
    setTransactionId("BKS99281726")
    setPaymentVerified(true)
    setAgreeHelsinki(true)
    setStepErrors({})
    toast.success("Sample Protocol Prefilled", {
      description: "Complete biomedical protocol dataset, informed consent procedure, and verified BDT payment credentials populated.",
    })
  }

  // ── Final Protocol Submission ────────────────────────────────────────────
  const handleSubmitProtocol = () => {
    if (!agreeHelsinki) {
      toast.error("Ethics Certification Required", {
        description: "You must certify compliance with the WMA Declaration of Helsinki before submission.",
      })
      return
    }

    const fullPayload = {
      ...step1,
      ...step2,
      ...step3,
      feeTier,
      isExpeditedTriage: isExpedited,
      feeAmountBdt: totalFeeBdt,
      paymentMethod,
      senderNumber,
      transactionId,
      paymentVerified,
      agreeHelsinkiTerms: agreeHelsinki,
    }

    const validation = fullProtocolApplicationSchema.safeParse(fullPayload)
    if (!validation.success) {
      toast.error("Submission Validation Failed", {
        description: validation.error.issues[0]?.message || "Please complete all required fields.",
      })
      return
    }

    const randomSuffix = Math.floor(100 + Math.random() * 900)
    const protocolId = `ETH-2026-${randomSuffix}`

    // Add protocol to centralized store
    addProtocol({
      id: protocolId,
      title: step1.title,
      department: step1.department,
      board: step1.board,
      status: isExpedited ? "Expedited Triage" : "Under Committee Review",
      statusColor: isExpedited ? "blue" : "amber",
      risk: step2.riskTier,
      riskColor:
        step2.riskTier === "Exempt - Fast Track"
          ? "emerald"
          : step2.riskTier === "Greater Than Minimal"
          ? "purple"
          : "blue",
      feeAmountBdt: totalFeeBdt,
      paymentMethod,
      transactionId,
      abstract: step2.abstract,
    })

    setGeneratedProtocolId(protocolId)
    setSubmitted(true)
    toast.success("Protocol Registered Successfully", {
      description: `Ethics application ${protocolId} submitted. Reference dossier dispatched to ${step1.board}.`,
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // ── Success View ─────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <DashboardContainer className="py-4">
        <div className="rounded-none sm:rounded-2xl border-y sm:border border-border/75 bg-card p-6 sm:p-10 shadow-sm space-y-8 text-center max-w-3xl mx-auto">
          {/* Animated Success Seal */}
          <div className="size-20 sm:size-24 rounded-full bg-[#198754]/10 text-secondary flex items-center justify-center mx-auto ring-8 ring-[#198754]/5">
            <CheckCircle2 className="size-10 sm:size-12" />
          </div>

          <div className="space-y-2">
            <Badge
              variant="outline"
              className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-xs font-bold uppercase tracking-wider py-1 px-3"
            >
              Application Submitted & Review Docket Queued
            </Badge>
            <h1 className="text-2xl sm:text-4xl font-black text-primary dark:text-white tracking-tight">
              Ethical Clearance Protocol Registered
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
              Your research protocol has been officially submitted to the{" "}
              <strong className="text-foreground">{step1.board}</strong> Secretariat. An
              institutional clearance ledger entry has been cryptographically sealed.
            </p>
          </div>

          {/* Institutional Submission Dossier Summary Card */}
          <div className="rounded-xl border border-border/75 bg-muted/30 p-5 text-left space-y-4 text-xs font-medium">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-3">
              <div>
                <span className="text-micro text-muted-foreground block uppercase tracking-wider font-bold">
                  Permanent Protocol Reference:
                </span>
                <span className="font-mono text-base font-black text-primary dark:text-sky-300">
                  {generatedProtocolId}
                </span>
              </div>
              <Badge
                variant="outline"
                className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 text-micro font-bold"
              >
                {isExpedited ? "Expedited Triage Track" : "Under Committee Review"}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-muted-foreground block text-micro">Research Scope:</span>
                <strong className="text-foreground block line-clamp-2">{step1.title}</strong>
              </div>
              <div>
                <span className="text-muted-foreground block text-micro">Governing Board:</span>
                <strong className="text-foreground block">{step1.board}</strong>
              </div>
              <div>
                <span className="text-muted-foreground block text-micro">Ethics Risk Category:</span>
                <strong className="text-foreground block">{step2.riskTier}</strong>
              </div>
              <div>
                <span className="text-muted-foreground block text-micro">
                  Institutional Fee Paid (Bangladeshi Taka):
                </span>
                <span className="font-bold text-secondary text-sm block">
                  ৳ {totalFeeBdt.toLocaleString()} BDT ({paymentMethod.toUpperCase()})
                </span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-muted-foreground block text-micro">
                  Gateway Transaction ID (TrxID):
                </span>
                <span className="font-mono font-bold text-foreground block">
                  {transactionId.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(generatedProtocolId)
                setCopiedTrx(true)
                toast.info("ID Copied", { description: "Protocol ID copied to clipboard." })
                setTimeout(() => setCopiedTrx(false), 2000)
              }}
              className="h-10 px-5 text-xs font-bold rounded-md w-full sm:w-auto"
            >
              {copiedTrx ? (
                <>
                  <Check className="size-3.5 text-emerald-600 mr-2" />
                  Copied Reference
                </>
              ) : (
                <>
                  <Copy className="size-3.5 mr-2" />
                  Copy Protocol ID
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                toast.success("Receipt Voucher Downloaded", {
                  description: `Official BDT fee payment receipt token for ${generatedProtocolId} exported as PDF.`,
                })
              }}
              className="h-10 px-5 text-xs font-bold rounded-md w-full sm:w-auto text-primary dark:text-sky-300"
            >
              <Download className="size-3.5 mr-2" />
              Download BDT Fee Receipt
            </Button>

            <Button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="h-10 px-6 text-xs font-bold bg-[#002752] hover:bg-[#003875] text-white rounded-md w-full sm:w-auto"
            >
              View Protocol Docket
            </Button>
          </div>
        </div>
      </DashboardContainer>
    )
  }

  // ── Main Wizard View ─────────────────────────────────────────────────────
  return (
    <DashboardContainer>
      {/* ── Wizard Stepper Bar ────────────────────────────────────────────── */}
      <div className="rounded-none sm:rounded-2xl border-y sm:border border-border/75 bg-card p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 sm:pb-0">
          {STEPS.map((s, idx) => {
            const Icon = s.icon
            const isActive = currentStep === s.step
            const isDone = currentStep > s.step

            return (
              <React.Fragment key={s.step}>
                <div
                  className={`flex items-center gap-2 sm:gap-2.5 shrink-0 px-2.5 py-1.5 rounded-lg transition-colors ${
                    isActive
                      ? "bg-[#002752]/10 dark:bg-white/10 text-primary dark:text-white font-bold"
                      : isDone
                      ? "text-secondary font-semibold"
                      : "text-muted-foreground opacity-60"
                  }`}
                >
                  <div
                    className={`size-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isActive
                        ? "bg-[#002752] dark:bg-white text-white dark:text-primary shadow-xs"
                        : isDone
                        ? "bg-[#198754] text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isDone ? <Check className="size-3.5" /> : s.step}
                  </div>
                  <div className="hidden md:block text-left leading-tight">
                    <span className="text-xs font-bold flex items-center gap-1.5">
                      <Icon className="size-3.5 shrink-0" />
                      {s.label}
                    </span>
                    <span className="text-micro opacity-75">Step {s.step} of 5</span>
                  </div>
                </div>

                {idx < STEPS.length - 1 && (
                  <div
                    className={`hidden sm:block flex-1 h-0.5 rounded-full transition-colors ${
                      currentStep > idx + 1
                        ? "bg-[#198754]"
                        : currentStep === idx + 1
                        ? "bg-[#002752]/30 dark:bg-white/20"
                        : "bg-border/60"
                    }`}
                  />
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>

      {/* ── Quick Demo Autofill Helper Banner ────────────────────────────── */}
      <div className="w-full p-3.5 sm:p-4 rounded-none sm:rounded-xl border-y sm:border border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5 text-xs sm:text-sm text-emerald-900 dark:text-emerald-300 font-medium">
          <Sparkles className="size-4 text-secondary shrink-0" />
          <span>Testing ethics clearance intake? Populate verified protocol metadata & BDT payment credentials:</span>
        </div>
        <Button
          type="button"
          size="sm"
          onClick={handleAutofillDemoProtocol}
          className="h-8 text-xs font-bold px-3.5 py-1.5 rounded-lg bg-[#198754] hover:bg-[#146c43] text-white transition-colors shrink-0 cursor-pointer shadow-none"
        >
          <Sparkles className="size-3 mr-1.5" />
          Autofill Sample Protocol
        </Button>
      </div>

      {/* ── Active Wizard Step Content ────────────────────────────────────── */}
      <div className="rounded-none sm:rounded-2xl border-y sm:border border-border/75 bg-card p-4 sm:p-8 shadow-xs space-y-6">
        {/* ── STEP 1: GENERAL PROTOCOL INFORMATION ────────────────────────── */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="border-b border-border/70 pb-4">
              <h2 className="text-xl sm:text-2xl font-black text-primary dark:text-white tracking-tight">
                Step 1: Protocol Scope & Ethics Governance Board
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Provide the full scientific title, academic discipline, and target ethics review board.
              </p>
            </div>

            <div className="space-y-4">
              {/* Protocol Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground flex items-center justify-between">
                  <span>Full Scientific Protocol Title *</span>
                  <span className="text-micro text-muted-foreground">Min 5 characters</span>
                </label>
                <Input
                  value={step1.title}
                  onChange={(e) => setStep1((p) => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Randomized Evaluation of Point-of-Care Maternal Biomarker Surveillance..."
                  className={`h-10 text-xs ${stepErrors.title ? "border-rose-500 ring-1 ring-rose-500/20" : ""}`}
                />
                {stepErrors.title && (
                  <p className="text-micro text-rose-600 font-semibold">{stepErrors.title}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Department */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">
                    Academic Department / Faculty *
                  </label>
                  <Input
                    value={step1.department}
                    onChange={(e) => setStep1((p) => ({ ...p, department: e.target.value }))}
                    className={`h-10 text-xs ${stepErrors.department ? "border-rose-500" : ""}`}
                  />
                  {stepErrors.department && (
                    <p className="text-micro text-rose-600 font-semibold">{stepErrors.department}</p>
                  )}
                </div>

                {/* Duration */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">
                    Estimated Study Duration (Months) *
                  </label>
                  <Input
                    type="number"
                    min={1}
                    max={60}
                    value={step1.durationMonths}
                    onChange={(e) =>
                      setStep1((p) => ({ ...p, durationMonths: Number(e.target.value) || 1 }))
                    }
                    className="h-10 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Ethics Board Selection (Cards) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground">
                  Select Governing Institutional Review Board (IRB) *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {IRB_BOARDS.map((b) => {
                    const isSelected = step1.board === b
                    return (
                      <Button
                        type="button"
                        variant="ghost"
                        key={b}
                        onClick={() => {
                          setStep1((p) => ({ ...p, board: b }))
                          if (stepErrors.board) {
                            setStepErrors((prev) => {
                              const next = { ...prev }
                              delete next.board
                              return next
                            })
                          }
                        }}
                        className={`p-4 rounded-xl border text-left h-auto flex flex-col items-stretch justify-start whitespace-normal font-normal transition-all cursor-pointer ${
                          isSelected
                            ? "border-[#002752] dark:border-sky-400 bg-[#002752]/5 dark:bg-white/5 ring-2 ring-[#002752]/20"
                            : "border-border/75 bg-muted/20 hover:bg-muted/40"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5 w-full">
                          <strong className="text-xs font-bold text-foreground">{b}</strong>
                          {isSelected && <CheckCircle2 className="size-4 text-secondary" />}
                        </div>
                        <p className="text-micro text-muted-foreground leading-snug">
                          {b === "Biomedical IRB"
                            ? "Clinical trials, biological samples, medical devices, invasive diagnostics."
                            : b === "Social & Behavioral Board"
                            ? "Surveys, community trials, qualitative interviews, educational studies."
                            : "Machine learning datasets, algorithm bias audits, electronic health records."}
                        </p>
                      </Button>
                    )
                  })}
                </div>
              </div>

              {/* Study Type Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground">
                  Study Methodology Classification *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {STUDY_TYPES.map((t) => (
                    <Button
                      key={t}
                      type="button"
                      variant={step1.studyType === t ? "default" : "outline"}
                      size="sm"
                      onClick={() => setStep1((p) => ({ ...p, studyType: t }))}
                      className={`h-auto py-2.5 px-3 justify-start text-xs font-bold rounded-lg border-border/75 ${
                        step1.studyType === t ? "bg-[#002752] text-white" : ""
                      }`}
                    >
                      {t}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Field Sites */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">
                  Study Location & Field Investigation Sites *
                </label>
                <Input
                  value={step1.studyLocation}
                  onChange={(e) => setStep1((p) => ({ ...p, studyLocation: e.target.value }))}
                  placeholder="e.g. Daffodil Smart City Ashulia, Savar Upazila Health Complex"
                  className="h-10 text-xs"
                />
              </div>

              {/* Co-Investigators */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">
                  Co-Investigators & Collaborating Institutions
                </label>
                <Input
                  value={step1.coInvestigators}
                  onChange={(e) => setStep1((p) => ({ ...p, coInvestigators: e.target.value }))}
                  className="h-10 text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: METHODOLOGY & RISK TIER ─────────────────────────────── */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="border-b border-border/70 pb-4">
              <h2 className="text-xl sm:text-2xl font-black text-primary dark:text-white tracking-tight">
                Step 2: Scientific Methodology & Ethics Risk Assessment
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Classify human subject exposure risk tier, target cohort size, and confidentiality protocols.
              </p>
            </div>

            <div className="space-y-4">
              {/* Executive Abstract */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground flex items-center justify-between">
                  <span>Executive Abstract & Clinical / Social Objectives *</span>
                  <span className="text-micro text-muted-foreground">Min 30 characters</span>
                </label>
                <Textarea
                  value={step2.abstract}
                  onChange={(e) => setStep2((p) => ({ ...p, abstract: e.target.value }))}
                  placeholder="Summarize research objectives, methodology, participant intervention, and expected ethical safeguards..."
                  className={`min-h-28 text-xs ${stepErrors.abstract ? "border-rose-500 ring-1 ring-rose-500/20" : ""}`}
                />
                {stepErrors.abstract && (
                  <p className="text-micro text-rose-600 font-semibold">{stepErrors.abstract}</p>
                )}
              </div>

              {/* Target Sample Size */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground flex items-center justify-between">
                  <span>Target Participant Cohort Size *</span>
                  <span className="text-micro text-muted-foreground">Statistical sample cohort</span>
                </label>
                <Input
                  type="number"
                  min={1}
                  value={step2.targetSampleSize}
                  onChange={(e) => {
                    setStep2((p) => ({ ...p, targetSampleSize: Number(e.target.value) || 1 }))
                    if (stepErrors.targetSampleSize) {
                      setStepErrors((prev) => {
                        const next = { ...prev }
                        delete next.targetSampleSize
                        return next
                      })
                    }
                  }}
                  className={`h-10 text-xs font-mono ${stepErrors.targetSampleSize ? "border-rose-500" : ""}`}
                />
                {stepErrors.targetSampleSize && (
                  <p className="text-micro text-rose-600 font-semibold">{stepErrors.targetSampleSize}</p>
                )}
              </div>

              {/* Informed Consent Architecture & Procedure Cards */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground">
                    Informed Consent Architecture & Procedure *
                  </label>
                  <span className="text-micro text-muted-foreground">
                    Institutional ethics consent standard
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {CONSENT_PROCEDURES.map((cp) => {
                    const isSelected = step2.consentType === cp.type
                    return (
                      <Button
                        type="button"
                        variant="ghost"
                        key={cp.type}
                        onClick={() => {
                          setStep2((p) => ({ ...p, consentType: cp.type }))
                          if (stepErrors.consentType) {
                            setStepErrors((prev) => {
                              const next = { ...prev }
                              delete next.consentType
                              return next
                            })
                          }
                        }}
                        className={`p-4 rounded-xl border text-left h-auto flex flex-col items-stretch justify-start whitespace-normal font-normal transition-all cursor-pointer ${
                          isSelected
                            ? "border-[#002752] dark:border-sky-400 bg-[#002752]/5 dark:bg-white/5 ring-2 ring-[#002752]/20"
                            : "border-border/75 bg-muted/20 hover:bg-muted/40"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5 w-full">
                          <strong className="text-xs font-bold text-foreground">{cp.type}</strong>
                          {isSelected ? (
                            <CheckCircle2 className="size-4 text-secondary shrink-0 ml-2" />
                          ) : (
                            <Badge variant="outline" className="text-[9px] font-semibold">
                              {cp.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-micro text-muted-foreground leading-snug">
                          {cp.description}
                        </p>
                      </Button>
                    )
                  })}
                </div>
                {stepErrors.consentType && (
                  <p className="text-micro text-rose-600 font-semibold">{stepErrors.consentType}</p>
                )}
              </div>

              {/* Risk Tier Selection (Crucial Ethics Standard) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground">
                  Human Subject Exposure Risk Tier *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {RISK_TIERS.map((tier) => {
                    const isSelected = step2.riskTier === tier
                    return (
                      <Button
                        type="button"
                        variant="ghost"
                        key={tier}
                        onClick={() => {
                          setStep2((p) => ({ ...p, riskTier: tier }))
                          if (stepErrors.riskTier) {
                            setStepErrors((prev) => {
                              const next = { ...prev }
                              delete next.riskTier
                              return next
                            })
                          }
                        }}
                        className={`p-4 rounded-xl border text-left h-auto flex flex-col items-stretch justify-start whitespace-normal font-normal transition-all cursor-pointer ${
                          isSelected
                            ? tier === "Exempt - Fast Track"
                              ? "border-emerald-600 bg-emerald-50/30 dark:bg-emerald-950/20 ring-2 ring-emerald-500/20"
                              : tier === "Minimal Risk"
                              ? "border-sky-600 bg-sky-50/30 dark:bg-sky-950/20 ring-2 ring-sky-500/20"
                              : "border-purple-600 bg-purple-50/30 dark:bg-purple-950/20 ring-2 ring-purple-500/20"
                            : "border-border/75 bg-muted/20 hover:bg-muted/40"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5 w-full">
                          <strong className="text-xs font-bold text-foreground">{tier}</strong>
                          {isSelected && <CheckCircle2 className="size-4 text-secondary" />}
                        </div>
                        <p className="text-micro text-muted-foreground leading-snug">
                          {tier === "Exempt - Fast Track"
                            ? "Anonymous educational surveys, non-invasive observations, public archival data."
                            : tier === "Minimal Risk"
                            ? "Standard physiological monitoring, routine blood draw, psychological questionnaires."
                            : "Interventional drug administration, invasive biopsy, vulnerable groups or stress."}
                        </p>
                      </Button>
                    )
                  })}
                </div>
                {stepErrors.riskTier && (
                  <p className="text-micro text-rose-600 font-semibold">{stepErrors.riskTier}</p>
                )}
              </div>

              {/* Confidentiality Statement */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">
                  Participant Confidentiality & Data Protection Safeguards *
                </label>
                <Textarea
                  value={step2.dataConfidentiality}
                  onChange={(e) => {
                    setStep2((p) => ({ ...p, dataConfidentiality: e.target.value }))
                    if (stepErrors.dataConfidentiality) {
                      setStepErrors((prev) => {
                        const next = { ...prev }
                        delete next.dataConfidentiality
                        return next
                      })
                    }
                  }}
                  className={`min-h-20 text-xs ${stepErrors.dataConfidentiality ? "border-rose-500 ring-1 ring-rose-500/20" : ""}`}
                />
                {stepErrors.dataConfidentiality && (
                  <p className="text-micro text-rose-600 font-semibold">{stepErrors.dataConfidentiality}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: DOSSIER ATTACHMENTS ─────────────────────────────────── */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="border-b border-border/70 pb-4">
              <h2 className="text-xl sm:text-2xl font-black text-primary dark:text-white tracking-tight">
                Step 3: Protocol Dossier & Document Attachments
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Upload your research protocol document, informed consent forms, and investigator credentials.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Document 1: Research Proposal */}
              <div
                className={`p-4 rounded-xl border ${
                  step3.protocolProposalName
                    ? "border-emerald-500/50 bg-emerald-50/20 dark:bg-emerald-950/20"
                    : "border-dashed border-border/90 bg-muted/20"
                } space-y-3`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="size-5 text-primary dark:text-sky-400" />
                    <strong className="text-xs font-bold text-foreground">
                      Research Protocol Proposal *
                    </strong>
                  </div>
                  {step3.protocolProposalName && (
                    <Badge variant="outline" className="text-micro text-emerald-700 dark:text-emerald-400 border-emerald-500/30">
                      Attached
                    </Badge>
                  )}
                </div>
                <p className="text-micro text-muted-foreground">
                  Complete scientific proposal with background, aims, methodology, and references (.pdf or .docx).
                </p>

                <Input
                  ref={proposalInputRef}
                  type="file"
                  accept=".pdf,.docx,.doc"
                  onChange={(e) => handleFileAttach(e, "protocolProposalName")}
                  className="sr-only"
                  id="proposal-upload"
                />

                {step3.protocolProposalName ? (
                  <div className="p-2 rounded-md bg-white dark:bg-[#0C1E34] border border-border/75 flex items-center justify-between">
                    <span className="font-mono text-xs text-foreground truncate max-w-[200px]">
                      {step3.protocolProposalName}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setStep3((p) => ({ ...p, protocolProposalName: "" }))}
                      className="h-6 px-2 text-micro text-rose-600"
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => proposalInputRef.current?.click()}
                    className="w-full h-8 text-xs font-bold rounded-md"
                  >
                    <Upload className="size-3.5 mr-1.5" />
                    Browse Proposal PDF
                  </Button>
                )}
                {stepErrors.protocolProposalName && (
                  <p className="text-micro text-rose-600 font-semibold">{stepErrors.protocolProposalName}</p>
                )}
              </div>

              {/* Document 2: Informed Consent Form */}
              <div
                className={`p-4 rounded-xl border ${
                  step3.consentFormName
                    ? "border-emerald-500/50 bg-emerald-50/20 dark:bg-emerald-950/20"
                    : "border-dashed border-border/90 bg-muted/20"
                } space-y-3`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck2 className="size-5 text-secondary" />
                    <strong className="text-xs font-bold text-foreground">
                      Informed Consent Form (ICF) *
                    </strong>
                  </div>
                  {step3.consentFormName && (
                    <Badge variant="outline" className="text-micro text-emerald-700 dark:text-emerald-400 border-emerald-500/30">
                      Attached
                    </Badge>
                  )}
                </div>
                <p className="text-micro text-muted-foreground">
                  Participant information sheet and signed consent template in Bengali and English (.pdf).
                </p>

                <Input
                  ref={consentInputRef}
                  type="file"
                  accept=".pdf,.docx,.doc"
                  onChange={(e) => handleFileAttach(e, "consentFormName")}
                  className="sr-only"
                  id="consent-upload"
                />

                {step3.consentFormName ? (
                  <div className="p-2 rounded-md bg-white dark:bg-[#0C1E34] border border-border/75 flex items-center justify-between">
                    <span className="font-mono text-xs text-foreground truncate max-w-[200px]">
                      {step3.consentFormName}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setStep3((p) => ({ ...p, consentFormName: "" }))}
                      className="h-6 px-2 text-micro text-rose-600"
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => consentInputRef.current?.click()}
                    className="w-full h-8 text-xs font-bold rounded-md"
                  >
                    <Upload className="size-3.5 mr-1.5" />
                    Browse Consent PDF
                  </Button>
                )}
                {stepErrors.consentFormName && (
                  <p className="text-micro text-rose-600 font-semibold">{stepErrors.consentFormName}</p>
                )}
              </div>

              {/* Document 3: Questionnaire / Survey Instrument (Optional) */}
              <div className="p-4 rounded-xl border border-dashed border-border/90 bg-muted/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">
                    Data Collection Tools / Survey Instruments
                  </span>
                  <Badge variant="secondary" className="text-micro">
                    Optional
                  </Badge>
                </div>
                <p className="text-micro text-muted-foreground">
                  Questionnaires, interview guides, or clinical diagnostic measurement forms.
                </p>

                <Input
                  ref={toolsInputRef}
                  type="file"
                  accept=".pdf,.docx"
                  onChange={(e) => handleFileAttach(e, "dataToolsName")}
                  className="sr-only"
                />

                {step3.dataToolsName ? (
                  <div className="p-2 rounded-md bg-white dark:bg-[#0C1E34] border border-border/75 flex items-center justify-between">
                    <span className="font-mono text-xs text-foreground truncate">
                      {step3.dataToolsName}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setStep3((p) => ({ ...p, dataToolsName: "" }))}
                      className="h-6 px-2 text-micro text-rose-600"
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => toolsInputRef.current?.click()}
                    className="w-full h-8 text-xs font-bold rounded-md"
                  >
                    <Upload className="size-3.5 mr-1.5" />
                    Attach Questionnaire
                  </Button>
                )}
              </div>

              {/* Document 4: Investigator CV & Ethics Training (Optional) */}
              <div className="p-4 rounded-xl border border-dashed border-border/90 bg-muted/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">
                    Investigator CV & CITI / GCP Certification
                  </span>
                  <Badge variant="secondary" className="text-micro">
                    Optional
                  </Badge>
                </div>
                <p className="text-micro text-muted-foreground">
                  Up-to-date academic curriculum vitae or Good Clinical Practice credential.
                </p>

                <Input
                  ref={cvInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileAttach(e, "investigatorCvName")}
                  className="sr-only"
                />

                {step3.investigatorCvName ? (
                  <div className="p-2 rounded-md bg-white dark:bg-[#0C1E34] border border-border/75 flex items-center justify-between">
                    <span className="font-mono text-xs text-foreground truncate">
                      {step3.investigatorCvName}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setStep3((p) => ({ ...p, investigatorCvName: "" }))}
                      className="h-6 px-2 text-micro text-rose-600"
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => cvInputRef.current?.click()}
                    className="w-full h-8 text-xs font-bold rounded-md"
                  >
                    <Upload className="size-3.5 mr-1.5" />
                    Attach CV / Certificate
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 4: BANGLADESHI TAKA (BDT ৳) PROCESSING FEE ─────────────── */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="border-b border-border/70 pb-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-primary dark:text-white tracking-tight">
                    Step 4: Institutional Review Processing Fee in BDT (Bangladeshi Taka ৳)
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Institutional ethics processing fees are charged in BDT (৳) under Daffodil International University IRB regulations.
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-xs font-mono font-bold"
                >
                  Currency: BDT (৳)
                </Badge>
              </div>
            </div>

            {/* Fee Tiers Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground">
                Select Research Protocol Fee Category *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(Object.keys(FEE_TIERS) as FeeTierKey[]).map((key) => {
                  const tier = FEE_TIERS[key]
                  const isSelected = feeTier === key
                  return (
                    <Button
                      type="button"
                      variant="ghost"
                      key={key}
                      onClick={() => {
                        setFeeTier(key)
                        setPaymentVerified(false)
                      }}
                      className={`p-4 rounded-xl border text-left h-auto flex flex-col items-stretch justify-start whitespace-normal font-normal transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#002752] dark:border-sky-400 bg-[#002752]/5 dark:bg-white/5 ring-2 ring-[#002752]/20"
                          : "border-border/75 bg-muted/20 hover:bg-muted/40"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1 w-full">
                        <strong className="text-xs font-bold text-foreground">{tier.label}</strong>
                        <span className="font-mono text-sm font-black text-secondary">
                          ৳ {tier.amountBdt.toLocaleString()} BDT
                        </span>
                      </div>
                      <p className="text-micro text-muted-foreground">
                        {key === "student"
                          ? "Undergraduate & Master's dissertations with faculty co-investigator."
                          : key === "faculty"
                          ? "Institutional departmental research and faculty seed grant projects."
                          : key === "clinical"
                          ? "Investigator-initiated clinical trials requiring full committee quorum."
                          : "Industry or internationally sponsored multicenter clinical protocols."}
                      </p>
                    </Button>
                  )
                })}
              </div>
            </div>

            {/* Fast-Track Expedited Review Toggle */}
            <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <strong className="text-xs font-bold text-amber-800 dark:text-amber-300 block">
                  Optional Expedited Fast-Track Triage (+ ৳ {EXPEDITED_SURCHARGE_BDT.toLocaleString()} BDT)
                </strong>
                <p className="text-micro text-muted-foreground">
                  Accelerated preliminary review with guaranteed committee docket placement within 72 hours.
                </p>
              </div>
              <Button
                type="button"
                variant={isExpedited ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setIsExpedited(!isExpedited)
                  setPaymentVerified(false)
                }}
                className={`h-8 px-3.5 text-xs font-bold rounded-md ${
                  isExpedited ? "bg-amber-600 hover:bg-amber-700 text-white" : ""
                }`}
              >
                {isExpedited ? "Expedited Active" : "Add Expedited"}
              </Button>
            </div>

            {/* Total Fee Voucher Summary */}
            <div className="p-4 rounded-xl border border-border/80 bg-muted/40 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-micro text-muted-foreground uppercase tracking-wider font-bold block">
                  Total Institutional Charge Payable:
                </span>
                <span className="text-2xl sm:text-3xl font-black text-primary dark:text-white tabular-nums">
                  ৳ {totalFeeBdt.toLocaleString()} <span className="text-sm font-bold text-muted-foreground">BDT</span>
                </span>
              </div>
              <div className="text-right text-micro text-muted-foreground space-y-0.5">
                <p>Base Protocol Review: ৳ {baseFeeBdt.toLocaleString()} BDT</p>
                {isExpedited && <p className="text-amber-700 font-semibold">+ Fast-Track Surcharge: ৳ {EXPEDITED_SURCHARGE_BDT.toLocaleString()} BDT</p>}
                <p className="text-emerald-700 dark:text-emerald-400 font-bold">VAT / Institutional Levy: Included</p>
              </div>
            </div>

            {/* Payment Method Selector (Bangladeshi Ecosystem) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground">
                Select Bangladeshi Payment Method *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {[
                  { id: "bkash", label: "bKash", type: "Mobile Wallet", color: "#D12053" },
                  { id: "nagad", label: "Nagad", type: "Post Office Wallet", color: "#F7931E" },
                  { id: "rocket", label: "Rocket", type: "DBBL Banking", color: "#8C3494" },
                  { id: "bank_transfer", label: "Bank Challan", type: "Sonali / City Bank", color: "#002752" },
                  { id: "card", label: "Debit/Credit Card", type: "Visa / Q-Cash", color: "#198754" },
                ].map((pm) => {
                  const isSelected = paymentMethod === pm.id
                  return (
                    <Button
                      type="button"
                      variant="ghost"
                      key={pm.id}
                      onClick={() => {
                        setPaymentMethod(pm.id as PaymentMethodKey)
                        setPaymentVerified(false)
                      }}
                      className={`p-3 rounded-xl border text-center h-auto flex flex-col items-center justify-center whitespace-normal font-normal transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#002752] dark:border-sky-400 bg-[#002752]/10 dark:bg-white/10 ring-2 ring-[#002752]/20"
                          : "border-border/75 bg-muted/20 hover:bg-muted/40"
                      }`}
                    >
                      <span className="font-bold text-xs text-foreground block">{pm.label}</span>
                      <span className="text-micro text-muted-foreground block">{pm.type}</span>
                    </Button>
                  )
                })}
              </div>
            </div>

            {/* Step-by-Step Payment Instructions */}
            <div className="p-4 rounded-xl border border-border/75 bg-muted/30 space-y-2 text-xs">
              <span className="font-bold text-foreground block">
                Payment Instructions for {paymentMethod === "bkash" ? "bKash Merchant Pay" : paymentMethod === "nagad" ? "Nagad Merchant" : paymentMethod === "rocket" ? "Rocket DBBL" : paymentMethod === "bank_transfer" ? "Bank Challan" : "Card Payment"}:
              </span>
              <div className="text-muted-foreground text-micro space-y-1">
                {paymentMethod === "bkash" && (
                  <>
                    <p>1. Open your <strong>bKash App</strong> or dial <strong>*247#</strong> and select <strong>Make Payment</strong>.</p>
                    <p>2. Enter DIU Official IRB Merchant Account: <strong className="font-mono text-foreground font-bold">01713-000001</strong>.</p>
                    <p>3. Enter Amount: <strong className="font-mono text-foreground font-bold">৳ {totalFeeBdt.toLocaleString()}</strong>.</p>
                    <p>4. Enter Counter: <strong className="font-mono text-foreground font-bold">1</strong> • Reference: <strong className="font-mono text-foreground font-bold">ETH-RES</strong>.</p>
                    <p>5. Copy the 8-character Transaction ID (TrxID) received via SMS.</p>
                  </>
                )}
                {paymentMethod === "nagad" && (
                  <>
                    <p>1. Open your <strong>Nagad App</strong> or dial <strong>*167#</strong> and select <strong>Merchant Pay</strong>.</p>
                    <p>2. Enter Nagad Merchant Number: <strong className="font-mono text-foreground font-bold">01713-000001</strong>.</p>
                    <p>3. Amount: <strong className="font-mono text-foreground font-bold">৳ {totalFeeBdt.toLocaleString()}</strong> BDT.</p>
                    <p>4. Complete payment and record the Transaction ID.</p>
                  </>
                )}
                {paymentMethod === "rocket" && (
                  <>
                    <p>1. Dial <strong>*322#</strong> or open Rocket app and choose <strong>Merchant Payment</strong>.</p>
                    <p>2. Enter DIU Merchant Biller Code: <strong className="font-mono text-foreground font-bold">249</strong>.</p>
                    <p>3. Complete payment of <strong>৳ {totalFeeBdt.toLocaleString()}</strong> BDT.</p>
                  </>
                )}
                {paymentMethod === "bank_transfer" && (
                  <>
                    <p>1. Deposit <strong>৳ {totalFeeBdt.toLocaleString()}</strong> BDT to <strong>Sonali Bank / Dhaka Bank</strong> (DIU Research Fund A/C <strong>02000-14892</strong>).</p>
                    <p>2. Enter the Bank Deposit Challan Number below.</p>
                  </>
                )}
                {paymentMethod === "card" && (
                  <>
                    <p>1. All local Bangladeshi Visa, MasterCard, and Q-Cash debit/credit cards accepted.</p>
                    <p>2. Enter your card billing reference number below.</p>
                  </>
                )}
              </div>
            </div>

            {/* Payment Input Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">
                  Sender Mobile / Bank Account Number *
                </label>
                <Input
                  value={senderNumber}
                  onChange={(e) => {
                    setSenderNumber(e.target.value)
                    setPaymentVerified(false)
                  }}
                  placeholder="e.g. 01711223344"
                  className={`h-10 text-xs font-mono ${stepErrors.senderNumber ? "border-rose-500" : ""}`}
                />
                {stepErrors.senderNumber && (
                  <p className="text-micro text-rose-600 font-semibold">{stepErrors.senderNumber}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">
                  Transaction ID (TrxID) / Bank Challan No *
                </label>
                <div className="flex gap-2">
                  <Input
                    value={transactionId}
                    onChange={(e) => {
                      setTransactionId(e.target.value.toUpperCase())
                      setPaymentVerified(false)
                    }}
                    placeholder="e.g. 9K2M4L7P01"
                    className={`h-10 text-xs font-mono uppercase ${stepErrors.transactionId ? "border-rose-500" : ""}`}
                  />
                  <Button
                    type="button"
                    variant={paymentVerified ? "secondary" : "outline"}
                    onClick={handleVerifyPayment}
                    disabled={isVerifyingPayment || paymentVerified}
                    className="h-10 px-4 text-xs font-bold shrink-0 rounded-md"
                  >
                    {isVerifyingPayment ? (
                      "Verifying..."
                    ) : paymentVerified ? (
                      <>
                        <CheckCircle2 className="size-3.5 text-emerald-600 mr-1" />
                        Verified
                      </>
                    ) : (
                      "Verify TrxID"
                    )}
                  </Button>
                </div>
                {stepErrors.transactionId && (
                  <p className="text-micro text-rose-600 font-semibold">{stepErrors.transactionId}</p>
                )}
              </div>
            </div>

            {/* Payment Status Token */}
            {paymentVerified && (
              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/20 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <Check className="size-4" />
                  </div>
                  <div>
                    <strong className="text-xs font-bold text-emerald-800 dark:text-emerald-300 block">
                      Institutional Fee Payment Confirmed
                    </strong>
                    <span className="text-micro text-muted-foreground font-mono">
                      ৳ {totalFeeBdt.toLocaleString()} BDT registered under TrxID: {transactionId}
                    </span>
                  </div>
                </div>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-micro font-bold">
                  Receipt Token Issued
                </Badge>
              </div>
            )}
            {stepErrors.paymentVerified && (
              <p className="text-xs text-rose-600 font-semibold">{stepErrors.paymentVerified}</p>
            )}
          </div>
        )}

        {/* ── STEP 5: REVIEW & ATTESTATION ────────────────────────────────── */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="border-b border-border/70 pb-4">
              <h2 className="text-xl sm:text-2xl font-black text-primary dark:text-white tracking-tight">
                Step 5: Attestation & Digital Protocol Submission
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Review your research protocol dossier, verify institutional details, and complete the digital submission.
              </p>
            </div>

            {/* Dossier Review Summary */}
            <div className="rounded-xl border border-border/75 bg-muted/20 p-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <span className="text-muted-foreground block text-micro">Protocol Title:</span>
                  <strong className="text-foreground text-sm block">{step1.title}</strong>
                </div>

                <div>
                  <span className="text-muted-foreground block text-micro">Department:</span>
                  <strong className="text-foreground block">{step1.department}</strong>
                </div>

                <div>
                  <span className="text-muted-foreground block text-micro">Target IRB Board:</span>
                  <strong className="text-foreground block">{step1.board}</strong>
                </div>

                <div>
                  <span className="text-muted-foreground block text-micro">Study Classification:</span>
                  <strong className="text-foreground block">{step1.studyType}</strong>
                </div>

                <div>
                  <span className="text-muted-foreground block text-micro">Ethics Risk Tier:</span>
                  <Badge variant="outline" className="text-micro font-bold mt-0.5">
                    {step2.riskTier}
                  </Badge>
                </div>

                <div>
                  <span className="text-muted-foreground block text-micro">Participant Cohort:</span>
                  <strong className="text-foreground block font-mono">{step2.targetSampleSize} subjects</strong>
                </div>

                <div>
                  <span className="text-muted-foreground block text-micro">Informed Consent Procedure:</span>
                  <strong className="text-foreground block">{step2.consentType}</strong>
                </div>

                <div>
                  <span className="text-muted-foreground block text-micro">Duration & Location:</span>
                  <strong className="text-foreground block">{step1.durationMonths} months • {step1.studyLocation}</strong>
                </div>

                <div className="sm:col-span-2 border-t border-border/60 pt-3">
                  <span className="text-muted-foreground block text-micro">Attached Documents:</span>
                  <div className="flex flex-wrap gap-2 pt-1 font-mono text-micro">
                    <span className="px-2 py-1 rounded bg-white dark:bg-[#0C1E34] border border-border/75">
                      Proposal: {step3.protocolProposalName}
                    </span>
                    <span className="px-2 py-1 rounded bg-white dark:bg-[#0C1E34] border border-border/75">
                      Consent Form: {step3.consentFormName}
                    </span>
                  </div>
                </div>

                <div className="sm:col-span-2 border-t border-border/60 pt-3 flex items-center justify-between">
                  <div>
                    <span className="text-muted-foreground block text-micro">Verified BDT Fee Payment:</span>
                    <span className="font-bold text-secondary text-sm">
                      ৳ {totalFeeBdt.toLocaleString()} BDT ({paymentMethod.toUpperCase()} • TrxID: {transactionId})
                    </span>
                  </div>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-micro font-bold">
                    Payment Verified
                  </Badge>
                </div>
              </div>
            </div>

            {/* Ethics Compliance Attestation Checkbox */}
            <div className="p-4 rounded-xl border border-border/75 bg-muted/40 space-y-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox
                  checked={agreeHelsinki}
                  onCheckedChange={(val) => setAgreeHelsinki(Boolean(val))}
                  className="mt-0.5"
                />
                <div className="text-xs leading-relaxed space-y-1">
                  <strong className="text-foreground block font-bold">
                    Institutional Code of Conduct & WMA Declaration of Helsinki Certification *
                  </strong>
                  <p className="text-muted-foreground">
                    I hereby certify that all information submitted in this application is truthful and accurate. 
                    I agree to conduct this study strictly in adherence to the institutional IRB protocols, 
                    respecting participant voluntary consent, safety, confidentiality, and data integrity.
                  </p>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* ── Wizard Controls (Back / Next / Submit) ─────────────────────── */}
        <div className="flex items-center justify-between pt-4 border-t border-border/70">
          {currentStep > 1 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleBack}
              className="h-9 px-4 text-xs font-bold rounded-md"
            >
              <ArrowLeft className="size-3.5 mr-1.5" />
              Previous Step
            </Button>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard")}
              className="h-9 px-4 text-xs font-semibold"
            >
              Cancel
            </Button>
          )}

          {currentStep < 5 ? (
            <Button
              type="button"
              size="sm"
              onClick={handleNext}
              className="h-9 px-5 text-xs font-bold bg-[#002752] hover:bg-[#003875] text-white rounded-md"
            >
              Next Step
              <ArrowRight className="size-3.5 ml-1.5" />
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              onClick={handleSubmitProtocol}
              disabled={!agreeHelsinki}
              className="h-9 px-6 text-xs font-bold bg-[#198754] hover:bg-[#157347] text-white rounded-md shadow-xs"
            >
              <Send className="size-3.5 mr-1.5" />
              Submit Protocol for Review
            </Button>
          )}
        </div>
      </div>
    </DashboardContainer>
  )
}
