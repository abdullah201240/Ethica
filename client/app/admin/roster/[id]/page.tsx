"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowLeft,
  ShieldCheck,
  UserCheck,
  UserX,
  Building2,
  Mail,
  Phone,
  ExternalLink,
  Calendar,
  AlertTriangle,
  Award,
  CheckCircle2,
  Copy,
  Check,
  Download,
  Scale,
  FileCheck2,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { KpiCard, KpiGrid } from "@/components/ui/kpi-card"
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
  updateReviewerStatus,
  subscribeReviewers,
  getStoredReviewers,
  initialAccreditedReviewers,
} from "@/lib/reviewer-roster"

interface PageProps {
  params: Promise<{ id: string }>
}

export default function ReviewerDossierDetailPage({ params }: PageProps) {
  const resolvedParams = React.use(params)
  const reviewerId = decodeURIComponent(resolvedParams.id)

  const allReviewers = React.useSyncExternalStore(
    subscribeReviewers,
    getStoredReviewers,
    () => initialAccreditedReviewers
  )

  const reviewer = React.useMemo(() => {
    return allReviewers.find(
      (r) => r.id === reviewerId || r.applicationId === reviewerId
    )
  }, [allReviewers, reviewerId])

  const [copiedHash, setCopiedHash] = React.useState(false)

  if (!reviewer) {
    return (
      <div className="space-y-6 w-full max-w-full">
        <Link
          href="/admin/roster"
          className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="size-3.5 mr-1.5" />
          <span>Back to Reviewer Roster</span>
        </Link>
        <Card className="p-8 text-center space-y-4">
          <div className="size-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Users className="size-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Reviewer Record Not Found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              No accredited reviewer found matching identifier &quot;{reviewerId}&quot;.
            </p>
          </div>
          <Link href="/admin/roster">
            <Button size="sm" className="bg-[#002752] text-white">
              Return to Reviewer Directory
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  const isActive = reviewer.status === "Active"
  const nextStatus = isActive ? "Inactive" : "Active"

  const handleToggleStatus = () => {
    updateReviewerStatus(
      reviewer.id,
      nextStatus,
      nextStatus === "Inactive" ? "Account suspended by Secretariat" : undefined
    )

    if (nextStatus === "Active") {
      toast.success("Reviewer Account Activated", {
        description: `${reviewer.name} (${reviewer.id}) has been restored to Active standing with full quorum voting credentials.`,
      })
    } else {
      toast.warning("Reviewer Account Suspended", {
        description: `${reviewer.name} (${reviewer.id}) has been marked Inactive. Committee voting privileges are suspended.`,
      })
    }
  }

  const handleCopyHash = () => {
    if (reviewer.digitalSealHash) {
      navigator.clipboard.writeText(reviewer.digitalSealHash)
      setCopiedHash(true)
      toast.success("Cryptographic Seal Copied", {
        description: "SHA-256 digital signature copied to clipboard.",
      })
      setTimeout(() => setCopiedHash(false), 2500)
    }
  }

  const handleDownloadCertificate = () => {
    toast.success("Accreditation Certificate Downloaded", {
      description: `Official clearance PDF verification token generated for ${reviewer.name}.`,
    })
  }

  const initials =
    reviewer.name
      .replace(/^(Dr\.|Prof\.|Mr\.|Ms\.|Mrs\.)\s+/i, "")
      .split(" ")
      .filter(Boolean)
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "RV"

  return (
    <DashboardContainer className="pb-12">
      {/* ── Top Navigation & Breadcrumbs ───────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-3 px-4 sm:px-0">
        <Link
          href="/admin/roster"
          className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-[#002752] dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="size-3.5 mr-1.5" />
          <span>Back to Reviewer Roster</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link href="/admin/admins">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs font-semibold rounded-lg border-slate-200 dark:border-slate-800"
            >
              <ShieldCheck className="size-3.5 text-[#002752] dark:text-sky-400" />
              <span>Admin List</span>
            </Button>
          </Link>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDownloadCertificate}
            className="h-8 gap-1.5 text-xs font-semibold rounded-lg border-slate-200 dark:border-slate-800"
          >
            <Download className="size-3.5" />
            <span>Download Certificate</span>
          </Button>
        </div>
      </div>

      {/* ── Header Dossier Card ────────────────────────────────────────────── */}
      <Card className="p-5 sm:p-6 rounded-none sm:rounded-2xl border-y sm:border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="size-16 sm:size-20 rounded-2xl bg-[#002752]/10 dark:bg-sky-500/10 text-[#002752] dark:text-sky-300 flex items-center justify-center font-black text-xl sm:text-2xl shrink-0 border border-[#002752]/20">
              {initials}
            </div>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {reviewer.name}
                </h1>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  ({reviewer.degree})
                </span>
                <Badge
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${
                    isActive
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                      : "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30"
                  }`}
                >
                  {isActive ? "Active (Quorum Voting Member)" : "Inactive / Suspended"}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-1.5 font-medium">
                  <Building2 className="size-3.5 text-slate-400 shrink-0" />
                  <span>
                    {reviewer.position} • {reviewer.department}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                  <Calendar className="size-3.5 text-slate-400 shrink-0" />
                  <span>Accredited on {reviewer.accreditationDate}</span>
                </div>
                <div className="font-mono text-xs font-bold text-[#002752] dark:text-sky-300">
                  {reviewer.id}
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                <Badge
                  variant="outline"
                  className="text-[11px] font-semibold bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200"
                >
                  {reviewer.board}
                </Badge>
                <Badge
                  variant="outline"
                  className="text-[11px] font-semibold bg-[#002752]/5 text-[#002752] dark:text-sky-300 border-[#002752]/20"
                >
                  Role: {reviewer.role}
                </Badge>
                <Badge
                  variant="outline"
                  className="text-[11px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                >
                  {reviewer.clearanceLevel}
                </Badge>
              </div>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex flex-row lg:flex-col items-center lg:items-end gap-2 shrink-0">
            <AlertDialog>
              <AlertDialogTrigger render={
                <Button
                  type="button"
                  variant={isActive ? "outline" : "default"}
                  size="sm"
                  className={`h-9 px-4 text-xs font-bold rounded-lg cursor-pointer ${
                    isActive
                      ? "text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                      : "bg-[#198754] hover:bg-[#146c43] text-white"
                  }`}
                >
                  {isActive ? (
                    <>
                      <UserX className="size-3.5 mr-1.5 text-amber-600 dark:text-amber-400" />
                      <span>Suspend Standing (Inactive)</span>
                    </>
                  ) : (
                    <>
                      <UserCheck className="size-3.5 mr-1.5 text-white" />
                      <span>Reactivate Standing (Active)</span>
                    </>
                  )}
                </Button>
              } />
              <AlertDialogContent className="max-w-md">
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                    {isActive ? (
                      <>
                        <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400" />
                        <span>Suspend Reviewer Account</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="size-5 text-emerald-600 dark:text-emerald-400" />
                        <span>Reactivate Reviewer Account</span>
                      </>
                    )}
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-2">
                    {isActive ? (
                      <>
                        Are you sure you want to transition{" "}
                        <strong className="text-slate-900 dark:text-white">
                          {reviewer.name}
                        </strong>{" "}
                        ({reviewer.id}) to <strong>Inactive</strong>?
                        <span className="block mt-2 text-xs text-amber-800 dark:text-amber-300 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
                          • Reviewer quorum voting privileges will be immediately paused.
                          <br />
                          • Protocol triage assignments will be temporarily suspended.
                        </span>
                      </>
                    ) : (
                      <>
                        Are you sure you want to restore{" "}
                        <strong className="text-slate-900 dark:text-white">
                          {reviewer.name}
                        </strong>{" "}
                        ({reviewer.id}) to <strong>Active</strong>?
                        <span className="block mt-2 text-xs text-emerald-800 dark:text-emerald-300 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
                          • Cryptographic quorum voting rights will be re-authorized.
                          <br />
                          • Reviewer will be eligible for new protocol deliberations.
                        </span>
                      </>
                    )}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="text-xs font-semibold">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleToggleStatus}
                    className={`text-xs font-bold text-white ${
                      isActive
                        ? "bg-amber-600 hover:bg-amber-700"
                        : "bg-emerald-600 hover:bg-emerald-700"
                    }`}
                  >
                    {isActive ? "Confirm Deactivation" : "Confirm Activation"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </Card>

      {/* ── Key Reviewer Metrics ───────────────────────────────────────────── */}
      <KpiGrid columns={4}>
        <KpiCard
          label="Active Protocol Deliberations"
          value={reviewer.assignedProtocols || 0}
          description="Assigned cases in progress"
          icon={FileCheck2}
          color="navy"
        />
        <KpiCard
          label="Clearance Authority"
          value={reviewer.clearanceLevel === "Full Voting Quorum" ? "Quorum" : "Ad-Hoc"}
          description="Official deliberation tier"
          icon={Scale}
          color="green"
        />
        <KpiCard
          label="Standing Status"
          value={reviewer.status}
          description="Accredited by Secretariat"
          icon={Award}
          color={isActive ? "green" : "amber"}
        />
        <KpiCard
          label="Specialization Domains"
          value={reviewer.specializations.length}
          description="Certified ethics categories"
          icon={ShieldCheck}
          color="gold"
        />
      </KpiGrid>

      {/* ── Main Details Grid ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols wide on large screen) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card: Institutional & Contact Coordinates */}
          <Card className="p-5 rounded-none sm:rounded-2xl border-y sm:border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#002752] dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Building2 className="size-4 text-[#002752] dark:text-sky-400" />
              <span>Academic & Institutional Coordinates</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800">
                <span className="text-slate-400 block font-medium">Home Institution</span>
                <span className="font-bold text-slate-800 dark:text-slate-100 text-sm block">
                  {reviewer.institution}
                </span>
                <span className="text-slate-500 dark:text-slate-400 block mt-0.5">
                  {reviewer.department}
                </span>
              </div>

              <div className="space-y-1 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800">
                <span className="text-slate-400 block font-medium">Position & Rank</span>
                <span className="font-bold text-slate-800 dark:text-slate-100 text-sm block">
                  {reviewer.position}
                </span>
                <span className="text-slate-500 dark:text-slate-400 block mt-0.5">
                  Highest Degree: {reviewer.degree}
                </span>
              </div>

              <div className="space-y-1 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800">
                <span className="text-slate-400 block font-medium">Official Contact Email</span>
                <a
                  href={`mailto:${reviewer.email}`}
                  className="font-bold text-[#002752] dark:text-sky-300 text-xs block truncate hover:underline flex items-center gap-1.5"
                >
                  <Mail className="size-3.5 text-slate-400 shrink-0" />
                  <span>{reviewer.email}</span>
                </a>
              </div>

              <div className="space-y-1 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800">
                <span className="text-slate-400 block font-medium">Official Contact Phone</span>
                <div className="font-bold text-slate-800 dark:text-slate-100 text-xs flex items-center gap-1.5">
                  <Phone className="size-3.5 text-slate-400 shrink-0" />
                  <span>{reviewer.phone}</span>
                </div>
              </div>
            </div>

            {/* ORCID identifier */}
            <div className="p-3 rounded-lg bg-[#002752]/5 dark:bg-sky-950/20 border border-[#002752]/15 dark:border-sky-800/30 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">ORCID Record:</span>
                {reviewer.orcid ? (
                  <span className="font-mono text-xs text-[#002752] dark:text-sky-300 font-bold">
                    {reviewer.orcid}
                  </span>
                ) : (
                  <span className="text-slate-400 italic">Not provided</span>
                )}
              </div>
              {reviewer.orcid && (
                <a
                  href={`https://orcid.org/${reviewer.orcid}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#002752] dark:text-sky-300 hover:underline"
                >
                  <span>Verify Registry</span>
                  <ExternalLink className="size-3" />
                </a>
              )}
            </div>
          </Card>

          {/* Card: Specializations & Domain Expertise */}
          <Card className="p-5 rounded-xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-[#002752] dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Award className="size-4 text-[#198754] dark:text-emerald-400" />
              <span>Accredited Review Specializations & Disciplines</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verified competency domains under which this reviewer may be empaneled for expedited or full-board deliberations:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {reviewer.specializations.map((spec) => (
                <div
                  key={spec}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200"
                >
                  <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{spec}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Card: Bio Statement */}
          {reviewer.bioStatement && (
            <Card className="p-5 rounded-xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-[#002752] dark:text-white uppercase tracking-wider flex items-center gap-2">
                <FileCheck2 className="size-4 text-[#002752] dark:text-sky-400" />
                <span>Ethics Statement & Research Philosophy</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200/70 dark:border-slate-800">
                &quot;{reviewer.bioStatement}&quot;
              </p>
            </Card>
          )}
        </div>

        {/* Right Column (1 Col wide) */}
        <div className="space-y-6">
          {/* Card: Research Specializations */}
          <Card className="p-5 rounded-none sm:rounded-2xl border-y sm:border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-[#002752] dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Scale className="size-4 text-[#002752] dark:text-sky-400" />
              <span>IRB Committee Standing</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Assigned Board</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-right">
                  {reviewer.board}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Committee Role</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {reviewer.role}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Quorum Clearance</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {reviewer.clearanceLevel}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Committee Term</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  2025 – 2027 Triennium
                </span>
              </div>
            </div>
          </Card>

          {/* Card: FIPS SHA-256 Digital Signature Seal */}
          <Card className="p-5 rounded-none sm:rounded-2xl border-y sm:border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-[#002752] dark:text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
              <span>Cryptographic Seal & PKI</span>
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              FIPS 140-3 SHA-256 digital committee signature verifying official accreditation by the DIU Research Compliance Secretariat.
            </p>

            <div className="p-3 rounded-lg bg-slate-900 text-slate-200 dark:bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-mono text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="size-3.5" />
                  <span>SEAL VERIFIED</span>
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyHash}
                  className="h-6 px-2 text-[10px] text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer"
                >
                  {copiedHash ? (
                    <Check className="size-3 mr-1 text-emerald-400" />
                  ) : (
                    <Copy className="size-3 mr-1" />
                  )}
                  <span>{copiedHash ? "Copied" : "Copy Hash"}</span>
                </Button>
              </div>

              <div className="font-mono text-[10px] break-all text-slate-300 bg-slate-950/80 p-2 rounded border border-slate-800 select-text">
                {reviewer.digitalSealHash}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardContainer>
  )
}
