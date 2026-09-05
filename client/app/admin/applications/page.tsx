"use client"

import * as React from "react"
import Link from "next/link"
import {
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
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
import { DashboardContainer } from "@/components/dashboard/dashboard-container"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  initialReviewerApplications,
  getStoredApplications,
  subscribeApplications,
  updateReviewerApplicationStatus,
} from "@/lib/reviewer-applications"

export default function AdminReviewerApplicationsPage() {
  const isClient = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )

  const applications = React.useSyncExternalStore(
    subscribeApplications,
    getStoredApplications,
    () => initialReviewerApplications
  )

  const handleApprove = (appId: string, fullName: string) => {
    updateReviewerApplicationStatus(
      appId,
      "Approved",
      "Accreditation approved by Institutional Ethics Secretariat."
    )
    toast.success("Reviewer Accreditation Granted", {
      description: `${fullName} (${appId}) is now accredited and enrolled into the Institutional Reviewer Roster with Active voting status.`,
    })
  }

  const handleReject = (appId: string, fullName: string) => {
    updateReviewerApplicationStatus(
      appId,
      "Rejected",
      "Application declined by Secretariat due to eligibility thresholds."
    )
    toast.error("Application Declined", {
      description: `Application declined for ${fullName} (${appId}). Formal determination logged in institutional ledger.`,
    })
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
        headerClassName: "w-36",
        cell: ({ row }) => (
          <div className="space-y-1">
            <span className="font-mono text-base font-bold text-primary dark:text-sky-300 block">
              {row.id}
            </span>
            <div className="flex items-center gap-1 text-base text-slate-400 dark:text-slate-500">
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
              <span className="font-bold text-base text-foreground">
                {row.fullName}
              </span>
              <span className="text-base font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {row.degree}
              </span>
            </div>
            <div className="text-base text-muted-foreground flex items-center gap-1.5 truncate">
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
          <span className="text-base text-slate-600 dark:text-slate-300">
            {row.department}
          </span>
        ),
      },
      {
        id: "expertise",
        header: "Domain Expertise",
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1 max-w-56">
            {row.expertise.slice(0, 2).map((exp) => (
              <Badge
                key={exp}
                variant="secondary"
                className="text-base font-medium px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-none truncate"
              >
                {exp}
              </Badge>
            ))}
            {row.expertise.length > 2 && (
              <Badge
                variant="outline"
                className="text-base font-mono px-1.5 py-0.5 text-muted-foreground border-slate-300 dark:border-slate-700"
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
        headerClassName: "w-28",
        cell: ({ row }) => (
          <span className="text-base font-bold text-foreground tabular-nums">
            {row.yearsExperience} yrs
          </span>
        ),
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Governance Status",
        sortable: true,
        headerClassName: "w-44",
        cell: ({ row }) => {
          const isPending = row.status === "Pending Verification"
          const isApproved = row.status === "Approved"

          return (
            <div className="inline-flex items-center gap-1.5">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-base font-bold border ${
                  isApproved
                    ? "bg-[#198754]/10 text-secondary dark:text-emerald-400 border-[#198754]/30"
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
        headerClassName: "w-48",
        cell: ({ row }) => (
          <div className="inline-flex items-center gap-1.5 justify-end">
            <Link
              href={`/admin/applications/${row.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-8 px-2.5 text-base font-bold gap-1 rounded-lg border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-primary dark:text-sky-300 shadow-2xs transition-colors cursor-pointer"
              title="Inspect Full Applicant Dossier in New Tab"
            >
              <Eye className="size-3.5" />
              <span>Inspect</span>
            </Link>

            {row.status === "Approved" && (
              <Link
                href={`/admin/roster?search=${encodeURIComponent(row.fullName)}`}
                className="inline-flex items-center justify-center h-8 px-2.5 text-base font-bold gap-1 rounded-lg border border-emerald-300/80 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/40 hover:bg-emerald-100/70 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 transition-colors"
                title="View in Accredited Reviewer Roster"
              >
                <Users className="size-3.5" />
                <span className="hidden xl:inline">In Roster</span>
              </Link>
            )}

            {row.status !== "Approved" && (
              <AlertDialog>
                <AlertDialogTrigger render={
                  <Button
                    type="button"
                    size="sm"
                    className="h-8 px-2.5 text-base font-bold rounded-lg bg-[#198754] hover:bg-[#146c43] text-white shadow-2xs cursor-pointer"
                    title="Approve Reviewer Accreditation"
                  >
                    <CheckCircle2 className="size-3.5" />
                    <span className="hidden xl:inline">Approve</span>
                  </Button>
                } />
                <AlertDialogContent className="sm:max-w-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-base font-bold text-primary dark:text-white">
                      Approve Reviewer Accreditation
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-base sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                      You are approving reviewer accreditation for{" "}
                      <strong className="text-foreground">{row.fullName}</strong> ({row.id}) from{" "}
                      {row.institution}. This will grant active voting privileges on the IRB deliberation docket.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="text-base font-semibold">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleApprove(row.id, row.fullName)}
                      className="bg-[#198754] hover:bg-[#146c43] text-white text-base font-bold"
                    >
                      Confirm Approval
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {row.status !== "Rejected" && (
              <AlertDialog>
                <AlertDialogTrigger render={
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 px-2.5 text-base font-bold rounded-lg border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                    title="Decline Reviewer Application"
                  >
                    <XCircle className="size-3.5" />
                    <span className="hidden xl:inline">Reject</span>
                  </Button>
                } />
                <AlertDialogContent className="sm:max-w-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-base font-bold text-primary dark:text-white">
                      Decline Reviewer Application
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-base sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                      Are you sure you want to decline accreditation for{" "}
                      <strong className="text-foreground">{row.fullName}</strong> ({row.id})?
                      This decision will be registered in the institutional intake ledger.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="text-base font-semibold">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleReject(row.id, row.fullName)}
                      className="bg-rose-600 hover:bg-rose-700 text-white text-base font-bold"
                    >
                      Decline Application
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
      <div className="p-8 text-center text-slate-500 font-mono text-base">
        Loading Institutional Applications Queue...
      </div>
    )
  }

  return (
    <DashboardContainer>
      {/* Centralized Institutional KPI Metrics Grid */}
      <KpiGrid columns={4}>
        <KpiCard
          label="Total Ingested"
          value={totalApps}
          icon={Users}
          color="navy"
        />
        <KpiCard
          label="Pending Deliberation"
          value={pendingCount}
          icon={Clock}
          color="amber"
        />
        <KpiCard
          label="Accredited Reviewers"
          value={approvedCount}
          icon={CheckCircle2}
          color="green"
        />
        <KpiCard
          label="Declined / Ineligible"
          value={rejectedCount}
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
            <div className="flex items-center gap-2">
              <Link
                href="/admin/roster"
                className="inline-flex items-center h-8 px-3 rounded-lg border border-slate-200/90 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-foreground/85 font-semibold text-base transition-colors shrink-0"
              >
                <Users className="size-3.5 mr-1.5 text-primary dark:text-sky-400" />
                <span>Accredited Reviewer Roster</span>
              </Link>
              <Link
                href="/reviewer/apply"
                target="_blank"
                className="inline-flex items-center h-8 px-3 bg-[#002752] hover:bg-[#001c3d] text-white font-bold text-base rounded-lg transition-colors shadow-2xs shrink-0"
              >
                <ExternalLink className="size-3 mr-1.5" />
                <span>Open Public Apply Form</span>
              </Link>
            </div>
          }
        />
      </div>
    </DashboardContainer>
  )
}
