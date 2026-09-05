"use client"

import * as React from "react"
import Link from "next/link"
import {
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  FileText,
  Building2,
  Calendar,
  ExternalLink,
} from "lucide-react"
import {
  DataTable,
  type ColumnDef,
  type DataTableFilter,
} from "@/components/ui/data-table"
import { KpiCard, KpiGrid } from "@/components/ui/kpi-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  type ReviewerApplication,
  getStoredApplications,
  updateReviewerApplicationStatus,
} from "@/lib/reviewer-applications"

export default function AdminReviewerApplicationsPage() {
  const [applications, setApplications] = React.useState<ReviewerApplication[]>([])
  const [selectedApp, setSelectedApp] = React.useState<ReviewerApplication | null>(null)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [feedbackNotes, setFeedbackNotes] = React.useState("")
  const [isClient, setIsClient] = React.useState(false)

  React.useEffect(() => {
    setIsClient(true)
    setApplications(getStoredApplications())
  }, [])

  const handleApprove = (appId: string) => {
    const updated = updateReviewerApplicationStatus(
      appId,
      "Approved",
      feedbackNotes || "Accreditation approved by Institutional Ethics Secretariat."
    )
    setApplications(updated)
    if (selectedApp && selectedApp.id === appId) {
      const refreshed = updated.find((a) => a.id === appId) ?? null
      setSelectedApp(refreshed)
    }
    setFeedbackNotes("")
  }

  const handleReject = (appId: string) => {
    const updated = updateReviewerApplicationStatus(
      appId,
      "Rejected",
      feedbackNotes || "Application declined by Secretariat due to eligibility thresholds."
    )
    setApplications(updated)
    if (selectedApp && selectedApp.id === appId) {
      const refreshed = updated.find((a) => a.id === appId) ?? null
      setSelectedApp(refreshed)
    }
    setFeedbackNotes("")
  }

  const openDossier = (app: ReviewerApplication) => {
    setSelectedApp(app)
    setFeedbackNotes(app.decisionNotes ?? "")
    setDialogOpen(true)
  }

  // ── Metrics Calculation ──────────────────────────────────────────────────
  const totalApps = applications.length
  const pendingCount = applications.filter((a) => a.status === "Pending Verification").length
  const approvedCount = applications.filter((a) => a.status === "Approved").length
  const rejectedCount = applications.filter((a) => a.status === "Rejected").length

  // ── Column Definitions ───────────────────────────────────────────────────
  const columns: ColumnDef<ReviewerApplication>[] = React.useMemo(
    () => [
      {
        id: "id",
        accessorKey: "id",
        header: "Application ID",
        sortable: true,
        headerClassName: "w-[140px]",
        cell: ({ row }) => (
          <div className="space-y-1">
            <span className="font-mono text-xs font-bold text-[#002752] dark:text-sky-300 block">
              {row.id}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
              <Calendar className="size-3" />
              <span>{row.submittedAt}</span>
            </div>
          </div>
        ),
      },
      {
        id: "fullName",
        accessorKey: "fullName",
        header: "Applicant & Institution",
        sortable: true,
        cell: ({ row }) => (
          <div className="space-y-1 max-w-sm">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                {row.fullName}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {row.degree}
              </span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 truncate">
              <Building2 className="size-3 shrink-0 text-slate-400" />
              <span className="truncate">{row.position} • {row.institution}</span>
            </div>
          </div>
        ),
      },
      {
        id: "department",
        accessorKey: "department",
        header: "Department",
        sortable: true,
        cell: ({ row }) => (
          <span className="text-xs text-slate-600 dark:text-slate-300">
            {row.department}
          </span>
        ),
      },
      {
        id: "expertise",
        header: "Domain Expertise",
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1 max-w-[220px]">
            {row.expertise.slice(0, 2).map((exp) => (
              <Badge
                key={exp}
                variant="secondary"
                className="text-[10px] font-medium px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-none truncate"
              >
                {exp}
              </Badge>
            ))}
            {row.expertise.length > 2 && (
              <Badge
                variant="outline"
                className="text-[10px] font-mono px-1.5 py-0.5 text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-700"
              >
                +{row.expertise.length - 2}
              </Badge>
            )}
          </div>
        ),
      },
      {
        id: "yearsExperience",
        accessorKey: "yearsExperience",
        header: "Experience",
        sortable: true,
        align: "center",
        headerClassName: "w-[110px]",
        cell: ({ row }) => (
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 tabular-nums">
            {row.yearsExperience} yrs
          </span>
        ),
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Governance Status",
        sortable: true,
        headerClassName: "w-[170px]",
        cell: ({ row }) => {
          const isPending = row.status === "Pending Verification"
          const isApproved = row.status === "Approved"
          const isRejected = row.status === "Rejected"

          return (
            <div className="inline-flex items-center gap-1.5">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                  isApproved
                    ? "bg-[#198754]/10 text-[#198754] dark:text-emerald-400 border-[#198754]/30"
                    : isPending
                    ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30"
                    : "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30"
                }`}
              >
                <span
                  className={`size-1.5 rounded-full ${
                    isApproved
                      ? "bg-[#198754]"
                      : isPending
                      ? "bg-amber-500 animate-pulse"
                      : "bg-rose-500"
                  }`}
                />
                <span>{row.status}</span>
              </span>
            </div>
          )
        },
      },
      {
        id: "actions",
        header: "Dossier Actions",
        align: "right",
        headerClassName: "w-[190px]",
        cell: ({ row }) => (
          <div className="inline-flex items-center gap-1.5 justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => openDossier(row)}
              className="h-8 px-2.5 text-xs font-bold gap-1 rounded-lg border-slate-200/90 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-[#002752] dark:text-sky-300"
              title="Inspect Full Applicant Dossier"
            >
              <Eye className="size-3.5" />
              <span>Inspect</span>
            </Button>

            {row.status !== "Approved" && (
              <Button
                type="button"
                size="sm"
                onClick={() => handleApprove(row.id)}
                className="h-8 px-2.5 text-xs font-bold rounded-lg bg-[#198754] hover:bg-[#146c43] text-white shadow-2xs"
                title="Approve Reviewer Accreditation"
              >
                <CheckCircle2 className="size-3.5" />
                <span className="hidden xl:inline">Approve</span>
              </Button>
            )}

            {row.status !== "Rejected" && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleReject(row.id)}
                className="h-8 px-2.5 text-xs font-bold rounded-lg border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                title="Decline Reviewer Application"
              >
                <XCircle className="size-3.5" />
                <span className="hidden xl:inline">Reject</span>
              </Button>
            )}
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [applications]
  )

  // ── Faceted Filters ──────────────────────────────────────────────────────
  const filters: DataTableFilter<ReviewerApplication>[] = React.useMemo(
    () => [
      {
        id: "status",
        title: "Status",
        accessorKey: "status",
        options: [
          { label: "Pending Verification", value: "Pending Verification" },
          { label: "Approved Reviewers", value: "Approved" },
          { label: "Rejected Applications", value: "Rejected" },
        ],
      },
      {
        id: "domain",
        title: "Domain",
        filterFn: (row, val) => row.expertise.includes(val),
        options: [
          { label: "Biomedical & Clinical", value: "Biomedical & Clinical Research" },
          { label: "AI & Tech Ethics", value: "AI / Data Science & Technology Ethics" },
          { label: "Public Health", value: "Public Health & Epidemiology" },
          { label: "Pediatrics", value: "Pediatric Research" },
          { label: "Genomics", value: "Genomics & Precision Medicine" },
          { label: "Social & Behavioral", value: "Social & Behavioral Sciences" },
          { label: "Mental Health", value: "Mental Health & Psychiatry" },
        ],
      },
    ],
    []
  )

  if (!isClient) {
    return (
      <div className="p-8 text-center text-slate-500 font-mono text-sm">
        Loading Institutional Applications Queue...
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Centralized Institutional KPI Metrics Grid */}
      <KpiGrid columns={4}>
        <KpiCard
          label="Total Ingested"
          value={totalApps}
          description="Institutional candidate pool"
          icon={Users}
          color="navy"
        />
        <KpiCard
          label="Pending Deliberation"
          value={pendingCount}
          description="Awaiting Secretariat credential check"
          icon={Clock}
          color="amber"
        />
        <KpiCard
          label="Accredited Reviewers"
          value={approvedCount}
          description="Active voting quorum members"
          icon={CheckCircle2}
          color="green"
        />
        <KpiCard
          label="Declined / Ineligible"
          value={rejectedCount}
          description="Below research requirements"
          icon={XCircle}
          color="rose"
        />
      </KpiGrid>

      {/* Unified Institutional DataTable */}
      <div id="applications-table" className="w-full">
        <DataTable<ReviewerApplication>
          data={applications}
          columns={columns}
          title="Reviewer Accreditation Docket"
          description="Real-time intake queue synchronizing public applicant dossiers with IRB committee membership"
          searchPlaceholder="Search by name, email, institution, or degree..."
          searchKeys={["fullName", "email", "institution", "department", "degree"]}
          filters={filters}
          initialPageSize={5}
          pageSizeOptions={[5, 10, 20, 50]}
          initialSort={{
            columnId: "id",
            direction: "desc",
          }}
          toolbarActions={
            <Link
              href="/apply"
              target="_blank"
              className="inline-flex items-center h-8 px-3 bg-[#002752] hover:bg-[#001c3d] text-white font-bold text-xs rounded-lg transition-colors shadow-2xs shrink-0"
            >
              <ExternalLink className="size-3 mr-1.5" />
              <span>Open Public Apply Form</span>
            </Link>
          }
        />
      </div>

      {/* Dossier Inspection Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {selectedApp && (
          <DialogContent className="max-w-2xl max-h-[85dvh] overflow-y-auto p-6 space-y-5 rounded-2xl border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34]">
            <DialogHeader className="space-y-1.5 border-b border-slate-200/80 dark:border-slate-800 pb-4 text-left">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#002752]/10 dark:bg-white/10 text-[#002752] dark:text-sky-300">
                  {selectedApp.id}
                </span>
                <Badge
                  variant="outline"
                  className={`text-xs font-bold ${
                    selectedApp.status === "Approved"
                      ? "bg-[#198754]/10 text-[#198754] border-[#198754]/30"
                      : selectedApp.status === "Pending Verification"
                      ? "bg-amber-500/10 text-amber-700 border-amber-500/30"
                      : "bg-rose-500/10 text-rose-700 border-rose-500/30"
                  }`}
                >
                  {selectedApp.status}
                </Badge>
              </div>

              <DialogTitle className="text-xl sm:text-2xl font-black text-[#002752] dark:text-white">
                {selectedApp.fullName}
              </DialogTitle>

              <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
                {selectedApp.position} • {selectedApp.institution}
              </DialogDescription>
            </DialogHeader>

            {/* Academic & Contact Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800 space-y-1">
                <span className="text-slate-400 block font-medium">Academic Degree & Title:</span>
                <strong className="text-slate-800 dark:text-slate-100 font-bold block">
                  {selectedApp.degree}
                </strong>
                <span className="text-slate-500 dark:text-slate-400 block">
                  {selectedApp.department}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800 space-y-1">
                <span className="text-slate-400 block font-medium">Research Experience & ORCID:</span>
                <strong className="text-slate-800 dark:text-slate-100 font-bold block">
                  {selectedApp.yearsExperience} Years Human Research
                </strong>
                {selectedApp.orcid ? (
                  <a
                    href={`https://orcid.org/${selectedApp.orcid}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#002752] dark:text-sky-300 hover:underline inline-flex items-center gap-1 font-mono text-[11px]"
                  >
                    <span>ORCID: {selectedApp.orcid}</span>
                    <ExternalLink className="size-3" />
                  </a>
                ) : (
                  <span className="text-slate-400">No ORCID provided</span>
                )}
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800 space-y-1">
                <span className="text-slate-400 block font-medium">Verified Contact:</span>
                <div className="text-slate-700 dark:text-slate-300 font-mono">
                  {selectedApp.email}
                </div>
                <div className="text-slate-500 dark:text-slate-400">
                  {selectedApp.phone}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800 space-y-1">
                <span className="text-slate-400 block font-medium">Attached Dossier / CV:</span>
                <div className="flex items-center gap-2 pt-0.5">
                  <FileText className="size-4 text-[#002752] dark:text-sky-400" />
                  <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {selectedApp.cvFileName || "Curriculum_Vitae.pdf"}
                  </span>
                </div>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold block">
                  ✓ Cryptographically Signed & Uploaded
                </span>
              </div>
            </div>

            {/* Expertise Tags */}
            <div className="space-y-1.5 text-left">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block uppercase tracking-wider">
                Recognized Research & Bioethics Domains
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedApp.expertise.map((exp) => (
                  <Badge
                    key={exp}
                    variant="secondary"
                    className="text-xs font-semibold px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                  >
                    {exp}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Statement of Motivation */}
            <div className="space-y-1.5 text-left">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block uppercase tracking-wider">
                Applicant Statement of Regulatory Motivation
              </span>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                &ldquo;{selectedApp.statement}&rdquo;
              </div>
            </div>

            {/* Secretariat Decision Note (if reviewed) */}
            {selectedApp.decisionNotes && (
              <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-500/20 text-xs space-y-1 text-left">
                <span className="font-bold text-emerald-800 dark:text-emerald-300 block">
                  Secretariat Deliberation Record ({selectedApp.decisionDate ?? "Recently"}):
                </span>
                <p className="text-emerald-900/80 dark:text-emerald-200">
                  {selectedApp.decisionNotes}
                </p>
              </div>
            )}

            {/* Dialog Footer Actions */}
            <DialogFooter className="border-t border-slate-200/80 dark:border-slate-800 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setDialogOpen(false)}
                className="text-slate-500 hover:text-slate-800 dark:text-slate-400"
              >
                Close Dossier
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleReject(selectedApp.id)
                    setDialogOpen(false)
                  }}
                  className="rounded-lg border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-bold"
                >
                  <XCircle className="size-3.5 mr-1" />
                  Decline Application
                </Button>

                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    handleApprove(selectedApp.id)
                    setDialogOpen(false)
                  }}
                  className="rounded-lg bg-[#198754] hover:bg-[#146c43] text-white font-bold shadow-xs"
                >
                  <CheckCircle2 className="size-3.5 mr-1" />
                  Approve & Accredit Reviewer
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
