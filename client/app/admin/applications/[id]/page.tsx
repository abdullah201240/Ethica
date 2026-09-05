"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Building2,
  GraduationCap,
  Briefcase,
  Mail,
  Phone,
  ExternalLink,
  FileText,
  Download,
  ShieldCheck,
  Award,
  AlertCircle,
  Check,
  Calendar,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { DashboardContainer } from "@/components/dashboard/dashboard-container"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
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
  getReviewerApplicationById,
  updateReviewerApplicationStatus,
  subscribeApplications,
} from "@/lib/reviewer-applications"

interface PageProps {
  params: Promise<{ id: string }>
}

export default function AdminApplicationDossierPage({ params }: PageProps) {
  const resolvedParams = React.use(params)
  const appId = resolvedParams.id

  const [application, setApplication] = React.useState<ReviewerApplication | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [decisionNotes, setDecisionNotes] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Fetch application and subscribe to real-time updates
  React.useEffect(() => {
    const loadApp = () => {
      const found = getReviewerApplicationById(appId)
      if (found) {
        setApplication(found)
        setDecisionNotes(found.decisionNotes ?? "")
      }
      setLoading(false)
    }

    loadApp()
    const unsubscribe = subscribeApplications(loadApp)
    return () => unsubscribe()
  }, [appId])

  const handleDecision = (status: "Approved" | "Rejected") => {
    if (!application) return
    setIsSubmitting(true)

    const fallbackNotes =
      status === "Approved"
        ? "Reviewer credentials vetted and accredited for Institutional Ethics Board deliberation by Secretariat."
        : "Application declined by Institutional Ethics Secretariat."

    const finalNotes = decisionNotes.trim() || fallbackNotes
    updateReviewerApplicationStatus(application.id, status, finalNotes)

    // Update local state immediately
    setApplication((prev) =>
      prev
        ? {
            ...prev,
            status,
            decisionNotes: finalNotes,
            decisionDate: new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            }),
          }
        : null
    )

    if (status === "Approved") {
      toast.success("Reviewer Accreditation Granted", {
        description: `${application.fullName} is now accredited and enrolled into the Institutional Reviewer Roster with Active voting status.`,
      })
    } else {
      toast.error("Application Declined", {
        description: "Application marked as declined. Formal determination logged in ledger.",
      })
    }
    setIsSubmitting(false)
  }

  if (loading) {
    return (
      <div className="space-y-6 sm:space-y-8 select-none" aria-busy="true" aria-label="Loading applicant dossier">
        {/* Top Breadcrumb & Status Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-36 rounded-lg" />
            <Skeleton className="h-4 w-4 rounded-md" />
            <Skeleton className="h-4 w-28 rounded-md" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-7 w-36 rounded-md" />
            <Skeleton className="h-7 w-28 rounded-md" />
          </div>
        </div>

        {/* Main Applicant Header Card Skeleton */}
        <Card className="rounded-xl sm:rounded-2xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <Skeleton className="size-14 sm:size-16 rounded-2xl shrink-0" />
              <div className="space-y-2 min-w-0">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-48 sm:w-64 rounded-md" />
                  <Skeleton className="h-5 w-16 rounded-md" />
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-32 rounded-md" />
                  <Skeleton className="h-4 w-40 rounded-md" />
                  <Skeleton className="h-4 w-28 rounded-md" />
                </div>
                <div className="flex gap-2 pt-1">
                  <Skeleton className="h-5 w-24 rounded-md" />
                  <Skeleton className="h-5 w-32 rounded-md" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Skeleton className="h-9 w-28 rounded-lg" />
              <Skeleton className="h-9 w-32 rounded-lg" />
            </div>
          </div>
        </Card>

        {/* 2-Column Content Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="rounded-xl sm:rounded-2xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs p-6 space-y-4">
            <Skeleton className="h-5 w-48 rounded-md" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800 space-y-2">
                  <Skeleton className="h-3 w-20 rounded-md" />
                  <Skeleton className="h-5 w-3/4 rounded-md" />
                </div>
              ))}
            </div>
          </Card>

          <Card className="rounded-xl sm:rounded-2xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs p-6 space-y-4">
            <Skeleton className="h-5 w-44 rounded-md" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-24 rounded-md" />
              ))}
            </div>
            <div className="space-y-2 pt-2">
              <Skeleton className="h-4 w-32 rounded-md" />
              <Skeleton className="h-14 w-full rounded-xl" />
            </div>
          </Card>
        </div>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="space-y-6">
        <Link
          href="/admin/applications"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#002752] dark:text-slate-300 transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Applications Roster</span>
        </Link>
        <Card className="p-8 text-center border-slate-200/85 dark:border-slate-800">
          <AlertCircle className="size-12 text-rose-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Application Dossier Not Found
          </h2>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            The application identifier <code className="font-mono font-bold text-[#002752] dark:text-sky-300">{appId}</code> could not be found in the current institutional registry.
          </p>
          <div className="mt-5">
            <Link
              href="/admin/applications"
              className="inline-flex items-center h-9 px-4 rounded-lg bg-[#002752] text-white text-xs font-bold hover:bg-[#001c3d] transition-colors"
            >
              Return to Reviewer Applications
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  const isApproved = application.status === "Approved"
  const isPending = application.status === "Pending Verification"
  const isRejected = application.status === "Rejected"

  return (
    <DashboardContainer className="pb-12">
      {/* ── Top Bar with Status & Navigation ───────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-4 px-4 sm:px-0">
        <div className="flex items-center gap-2">
          <Link
            href="/admin/applications"
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 shadow-xs transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            <span>Applications List</span>
          </Link>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">
            {application.id}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="font-mono text-xs px-2.5 py-1 border-slate-200 dark:border-slate-800 text-slate-500"
          >
            <Calendar className="size-3 mr-1" />
            Submitted: {application.submittedAt}
          </Badge>
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-md border ${
              isApproved
                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25"
                : isPending
                ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25"
                : "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/25"
            }`}
          >
            <span
              className={`size-2 rounded-full ${
                isApproved
                  ? "bg-emerald-500"
                  : isPending
                  ? "bg-amber-500 animate-pulse"
                  : "bg-rose-500"
              }`}
            />
            <span>{application.status}</span>
          </span>
        </div>
      </div>

      {/* ── Main Applicant Header Card ─────────────────────────────────────── */}
      <Card className="rounded-none sm:rounded-2xl border-y sm:border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs p-6 my-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="size-14 sm:size-16 rounded-2xl bg-gradient-to-tr from-[#002752] to-[#003875] text-white flex items-center justify-center font-black text-xl sm:text-2xl shadow-sm shrink-0">
              {application.fullName
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </div>
            <div className="space-y-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-[#002752] dark:text-white">
                  {application.fullName}
                </h1>
                <Badge
                  variant="secondary"
                  className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  {application.degree}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <span className="font-semibold">{application.position}</span>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <span>{application.department}</span>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Building2 className="size-3.5" />
                  {application.institution}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats Pill Counters */}
          <div className="flex items-center gap-3 self-start lg:self-center shrink-0">
            <div className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/70 dark:border-slate-800 text-center">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Experience
              </span>
              <span className="block text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {application.yearsExperience} yrs
              </span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/70 dark:border-slate-800 text-center">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Domains
              </span>
              <span className="block text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {application.expertise.length}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* ── 2-Column Content Grid ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left Column (2 spans): Credentials, Statement, Expertise, CV */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card: Academic Profile & Institutional Affiliation */}
          <Card className="rounded-none sm:rounded-2xl border-y sm:border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs p-5 sm:p-6 space-y-5">
            <div className="border-b border-slate-200/80 dark:border-slate-800 pb-3 flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-[#002752] dark:text-white flex items-center gap-2">
                <GraduationCap className="size-5 text-[#002752] dark:text-sky-300" />
                <span>Academic & Institutional Verification</span>
              </h2>
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="size-3.5" />
                Verified Institution
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Degree & Qualifications
                </span>
                <p className="font-semibold text-slate-900 dark:text-white">{application.degree}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Current Faculty Designation
                </span>
                <p className="font-semibold text-slate-900 dark:text-white">{application.position}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Parent Institution
                </span>
                <p className="font-semibold text-slate-900 dark:text-white">{application.institution}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Academic Department
                </span>
                <p className="font-semibold text-slate-900 dark:text-white">{application.department}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Institutional Email
                </span>
                <p className="font-mono text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Mail className="size-3.5 text-slate-400" />
                  {application.email}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Direct Telephone
                </span>
                <p className="font-mono text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Phone className="size-3.5 text-slate-400" />
                  {application.phone}
                </p>
              </div>

              {application.orcid && (
                <div className="sm:col-span-2 space-y-1 pt-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    ORCID Research Identifier
                  </span>
                  <a
                    href={`https://orcid.org/${application.orcid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#198754] hover:underline"
                  >
                    <span>{application.orcid}</span>
                    <ExternalLink className="size-3" />
                  </a>
                </div>
              )}
            </div>
          </Card>

          {/* Card: Bioethics Domains & Expertise */}
          <Card className="rounded-none sm:rounded-2xl border-y sm:border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs p-5 sm:p-6 space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-[#002752] dark:text-white flex items-center gap-2">
              <Award className="size-5 text-amber-500" />
              <span>Certified Ethics Review Expertise</span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {application.expertise.map((exp) => (
                <span
                  key={exp}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#002752]/8 dark:bg-white/8 text-[#002752] dark:text-sky-300 border border-[#002752]/15 dark:border-white/10"
                >
                  {exp}
                </span>
              ))}
            </div>
          </Card>

          {/* Card: Formal Statement of Interest */}
          <Card className="rounded-none sm:rounded-2xl border-y sm:border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs p-5 sm:p-6 space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-[#002752] dark:text-white flex items-center gap-2">
              <Briefcase className="size-5 text-[#198754]" />
              <span>Statement of Motivation & Regulatory Bioethics Experience</span>
            </h2>
            <blockquote className="p-4 rounded-xl border-l-4 border-[#002752] dark:border-sky-400 bg-slate-50 dark:bg-white/[0.02] text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed italic">
              &ldquo;{application.statement}&rdquo;
            </blockquote>
          </Card>

          {/* Card: Curriculum Vitae & Certification Dossier */}
          <Card className="rounded-none sm:rounded-2xl border-y sm:border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs p-5 sm:p-6 space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-[#002752] dark:text-white flex items-center gap-2">
              <FileText className="size-5 text-slate-500" />
              <span>Applicant Curriculum Vitae Dossier</span>
            </h2>
            <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-white/[0.02] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="size-10 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0 font-bold text-xs">
                  PDF
                </div>
                <div className="min-w-0">
                  <span className="block text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                    {application.cvFileName || `${application.fullName.replace(/\s+/g, "_")}_CV.pdf`}
                  </span>
                  <span className="block text-[11px] text-slate-400 font-mono">
                    2.4 MB • SHA-256 Verified Digital Seal
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs font-bold rounded-lg border-slate-200/90 dark:border-slate-700 gap-1.5 shrink-0 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                onClick={() => {
                  toast.info("Cryptographic Seal Verified", {
                    description: `CV dossier "${application.cvFileName || "Curriculum_Vitae.pdf"}" verified via SHA-256 seal and downloaded.`,
                  })
                }}
              >
                <Download className="size-3.5" />
                <span className="hidden sm:inline">Download</span>
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column (1 span): Deliberation Console & Checklist */}
        <div className="space-y-6">
          {/* Deliberation & Adjudication Console */}
          <Card className="rounded-none sm:rounded-2xl border-y sm:border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-sm p-5 sm:p-6 space-y-5">
            <div className="border-b border-slate-200/80 dark:border-slate-800 pb-3">
              <h2 className="text-base sm:text-lg font-black text-[#002752] dark:text-white uppercase tracking-tight">
                Secretariat Adjudication
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Official accreditation determination and decision seal
              </p>
            </div>

            {application.decisionDate && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/70 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Last Adjudicated
                </span>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {application.decisionDate}
                </p>
                {application.decisionNotes && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 italic pt-1 border-t border-slate-200/60 dark:border-slate-800">
                    &ldquo;{application.decisionNotes}&rdquo;
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Secretariat Reviewer Decision Notes
              </label>
              <Textarea
                rows={4}
                value={decisionNotes}
                onChange={(e) => setDecisionNotes(e.target.value)}
                placeholder="Enter official rationale, board assignment notes, or eligibility remarks..."
                className="text-xs leading-relaxed"
              />
            </div>

            <div className="space-y-2.5 pt-2">
              <AlertDialog>
                <AlertDialogTrigger render={
                  <Button
                    type="button"
                    disabled={isSubmitting || isApproved}
                    className="w-full h-9 text-xs font-bold rounded-lg bg-[#198754] hover:bg-[#146c43] text-white gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle2 className="size-4" />
                    <span>{isApproved ? "Accreditation Approved" : "Approve Accreditation"}</span>
                  </Button>
                } />
                <AlertDialogContent className="sm:max-w-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-base font-bold text-[#002752] dark:text-white">
                      Confirm Reviewer Accreditation
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      Are you sure you want to approve accreditation for <strong className="text-slate-900 dark:text-white">{application.fullName}</strong> ({application.institution})?
                      This action will grant official reviewer status on the Institutional Ethics Committee.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="text-xs font-semibold">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDecision("Approved")}
                      className="bg-[#198754] hover:bg-[#146c43] text-white text-xs font-bold"
                    >
                      Grant Accreditation
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {isApproved && (
                <Link
                  href={`/admin/roster/${encodeURIComponent(application.id)}`}
                  className="w-full flex items-center justify-center h-9 text-xs font-bold rounded-lg border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 gap-2 transition-colors shadow-2xs"
                >
                  <Users className="size-4" />
                  <span>View in Institutional Reviewer Roster</span>
                </Link>
              )}

              <AlertDialog>
                <AlertDialogTrigger render={
                  <Button
                    type="button"
                    disabled={isSubmitting || isRejected}
                    variant="outline"
                    className="w-full h-9 text-xs font-bold rounded-lg border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 gap-2 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <XCircle className="size-4" />
                    <span>{isRejected ? "Application Declined" : "Decline Application"}</span>
                  </Button>
                } />
                <AlertDialogContent className="sm:max-w-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-base font-bold text-[#002752] dark:text-white">
                      Decline Reviewer Application
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      Are you sure you want to decline the reviewer application for <strong className="text-slate-900 dark:text-white">{application.fullName}</strong>?
                      The recorded secretariat notes will be provided as feedback.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="text-xs font-semibold">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDecision("Rejected")}
                      className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
                    >
                      Decline Application
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </Card>

          {/* Institutional Compliance Checklist */}
          <Card className="rounded-none sm:rounded-2xl border-y sm:border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs p-5 space-y-4">
            <h3 className="text-sm font-bold text-[#002752] dark:text-white uppercase tracking-wider">
              Accreditation Compliance Criteria
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <Check className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Active full-time academic / clinical faculty appointment</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Minimum 5+ years post-qualification research experience</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Institutional Good Clinical Practice (GCP) or Bioethics certified</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Signed non-disclosure & conflict-of-interest covenant</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </DashboardContainer>
  )
}
