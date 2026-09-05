"use client"

import * as React from "react"
import Link from "next/link"
import {
  Users,
  ShieldCheck,
  UserCheck,
  UserX,
  Scale,
  Calendar,
  Building2,
  Eye,
  AlertTriangle,
  ClipboardCheck,
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
  type AccreditedReviewer,
  initialAccreditedReviewers,
  getStoredReviewers,
  subscribeReviewers,
  updateReviewerStatus,
} from "@/lib/reviewer-roster"

function AdminRosterContent() {
  // ── Reviewer State ─────────────────────────────────────────────────────────
  const reviewers = React.useSyncExternalStore(
    subscribeReviewers,
    getStoredReviewers,
    () => initialAccreditedReviewers
  )

  const handleToggleReviewerStatus = (
    reviewer: AccreditedReviewer,
    nextStatus: "Active" | "Inactive"
  ) => {
    updateReviewerStatus(
      reviewer.id,
      nextStatus,
      nextStatus === "Inactive"
        ? "Account suspended by Secretariat"
        : undefined
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

  // ── Reviewer KPI Calculations ──────────────────────────────────────────────
  const reviewerTotal = reviewers.length
  const reviewerActive = reviewers.filter((r) => r.status === "Active").length
  const reviewerInactive = reviewers.filter((r) => r.status === "Inactive").length
  const meanReviewerWorkload =
    reviewerTotal > 0
      ? (
          reviewers.reduce((acc, r) => acc + (r.assignedProtocols || 0), 0) /
          reviewerTotal
        ).toFixed(1)
      : "0.0"

  // ── Reviewer Columns ───────────────────────────────────────────────────────
  const reviewerColumns: ColumnDef<AccreditedReviewer>[] = React.useMemo(
    () => [
      {
        id: "id",
        accessorKey: "id",
        header: "Roster ID",
        sortable: true,
        headerClassName: "w-32",
        cell: ({ row }) => (
          <div className="space-y-1 select-text">
            <Link
              href={`/admin/roster/${encodeURIComponent(row.id)}`}
              className="font-mono text-base font-bold text-primary dark:text-sky-300 block hover:underline"
            >
              {row.id}
            </Link>
            <div className="flex items-center gap-1 text-base text-slate-400 dark:text-slate-500">
              <Calendar className="size-3" />
              <span>{row.accreditationDate}</span>
            </div>
          </div>
        ),
      },
      {
        id: "name",
        accessorKey: "name",
        header: "Accredited Reviewer",
        sortable: true,
        cell: ({ row }) => {
          const initials =
            row.name
              .replace(/^(Dr\.|Prof\.|Mr\.|Ms\.|Mrs\.)\s+/i, "")
              .split(" ")
              .filter(Boolean)
              .map((p) => p[0])
              .slice(0, 2)
              .join("")
              .toUpperCase() || "RV"

          return (
            <div className="flex items-center gap-3 select-text">
              <Link
                href={`/admin/roster/${encodeURIComponent(row.id)}`}
                className="size-10 rounded-full bg-[#002752]/10 dark:bg-sky-500/10 text-primary dark:text-sky-300 flex items-center justify-center font-bold text-base shrink-0 border border-[#002752]/15 dark:border-sky-500/20 hover:ring-2 hover:ring-[#002752]/20 transition-all"
                title={`View ${row.name}'s Dossier`}
              >
                {initials}
              </Link>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <Link
                    href={`/admin/roster/${encodeURIComponent(row.id)}`}
                    className="text-base font-bold text-foreground truncate hover:underline hover:text-primary dark:hover:text-sky-300"
                  >
                    {row.name}
                  </Link>
                  <span className="text-base font-normal text-muted-foreground">
                    ({row.degree})
                  </span>
                </div>
                <div className="flex items-center gap-2 text-base text-muted-foreground truncate">
                  <Building2 className="size-3 text-slate-400 shrink-0" />
                  <span className="truncate">
                    {row.department} • {row.institution}
                  </span>
                </div>
              </div>
            </div>
          )
        },
      },
      {
        id: "board",
        accessorKey: "board",
        header: "Assigned Board & Role",
        sortable: true,
        cell: ({ row }) => (
          <div className="space-y-1 select-text">
            <Badge
              variant="outline"
              className="text-base font-semibold bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-foreground/85 whitespace-nowrap"
            >
              {row.board}
            </Badge>
            <div className="text-base text-muted-foreground">
              Role: <strong className="text-slate-700 dark:text-slate-300">{row.role}</strong>
            </div>
          </div>
        ),
      },
      {
        id: "specializations",
        accessorKey: "specializations",
        header: "Discipline & Specializations",
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1 max-w-64 select-text">
            {row.specializations.slice(0, 2).map((spec) => (
              <Badge
                key={spec}
                variant="secondary"
                className="text-base py-0 px-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-none"
              >
                {spec}
              </Badge>
            ))}
            {row.specializations.length > 2 && (
              <Badge
                variant="outline"
                className="text-base py-0 px-1 text-slate-400 dark:text-slate-500"
              >
                +{row.specializations.length - 2}
              </Badge>
            )}
          </div>
        ),
      },
      {
        id: "assignedProtocols",
        accessorKey: "assignedProtocols",
        header: "Workload",
        sortable: true,
        headerClassName: "w-24 text-center",
        cell: ({ row }) => (
          <div className="text-center select-text">
            <span className="inline-flex items-center justify-center font-bold text-base text-foreground bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-md min-w-[28px]">
              {row.assignedProtocols}
            </span>
            <span className="block text-base text-slate-400 mt-0.5">cases</span>
          </div>
        ),
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Account Standing",
        sortable: true,
        headerClassName: "w-32",
        cell: ({ row }) => {
          const isActive = row.status === "Active"
          return (
            <div className="flex items-center gap-1.5 select-text">
              <span
                className={`size-2.5 rounded-full shrink-0 ${
                  isActive ? "bg-emerald-500" : "bg-amber-500"
                }`}
              />
              <span
                className={`text-base font-bold ${
                  isActive
                    ? "text-emerald-700 dark:text-emerald-300"
                    : "text-amber-700 dark:text-amber-300"
                }`}
              >
                {isActive ? "Active (Quorum)" : "Inactive"}
              </span>
            </div>
          )
        },
      },
      {
        id: "actions",
        header: "Roster Actions",
        headerClassName: "w-44 text-right",
        cell: ({ row }) => {
          const reviewer = row
          const isActive = reviewer.status === "Active"
          const nextStatus = isActive ? "Inactive" : "Active"

          return (
            <div className="flex items-center justify-end gap-1.5">
              {/* Direct Navigation to Dedicated Dynamic Page (Rule 13) */}
              <Link href={`/admin/roster/${encodeURIComponent(reviewer.id)}`}>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 text-base font-semibold rounded-md border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  title="View Complete Reviewer Dossier on Dedicated Page"
                >
                  <Eye className="size-3.5 mr-1 text-primary dark:text-sky-400" />
                  <span>View Dossier</span>
                </Button>
              </Link>

              <AlertDialog>
                <AlertDialogTrigger render={
                  <Button
                    type="button"
                    variant={isActive ? "outline" : "default"}
                    size="sm"
                    className={`h-7 px-2.5 text-base font-bold rounded-md transition-colors cursor-pointer ${
                      isActive
                        ? "text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                        : "bg-[#198754] hover:bg-[#146c43] text-white"
                    }`}
                  >
                    {isActive ? (
                      <>
                        <UserX className="size-3 mr-1 text-amber-600 dark:text-amber-400" />
                        <span>Deactivate</span>
                      </>
                    ) : (
                      <>
                        <UserCheck className="size-3 mr-1 text-white" />
                        <span>Activate</span>
                      </>
                    )}
                  </Button>
                } />
                <AlertDialogContent className="max-w-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 text-base font-bold text-foreground">
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
                    <AlertDialogDescription className="text-base sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed pt-2">
                      {isActive ? (
                        <>
                          Are you sure you want to transition{" "}
                          <strong className="text-foreground">
                            {reviewer.name}
                          </strong>{" "}
                          ({reviewer.id}) to <strong>Inactive</strong>?
                          <span className="block mt-2 text-base text-amber-800 dark:text-amber-300 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
                            • Reviewer quorum voting privileges will be immediately paused.
                            <br />
                            • Protocol triage assignments will be temporarily suspended.
                          </span>
                        </>
                      ) : (
                        <>
                          Are you sure you want to restore{" "}
                          <strong className="text-foreground">
                            {reviewer.name}
                          </strong>{" "}
                          ({reviewer.id}) to <strong>Active</strong>?
                          <span className="block mt-2 text-base text-emerald-800 dark:text-emerald-300 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
                            • Cryptographic quorum voting rights will be re-authorized.
                            <br />
                            • Reviewer will be eligible for new protocol deliberations.
                          </span>
                        </>
                      )}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="text-base font-semibold">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleToggleReviewerStatus(reviewer, nextStatus)}
                      className={`text-base font-bold text-white ${
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
          )
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reviewers]
  )

  // ── Faceted Filters ──────────────────────────────────────────────────────
  const reviewerFilters: DataTableFilter<AccreditedReviewer>[] = React.useMemo(
    () => [
      {
        id: "status",
        title: "Account Standing",
        accessorKey: "status",
        options: [
          { label: "Active Members", value: "Active" },
          { label: "Inactive / Suspended", value: "Inactive" },
        ],
      },
      {
        id: "board",
        title: "Ethics Board",
        accessorKey: "board",
        options: [
          {
            label: "Biomedical & Health Research",
            value: "Biomedical Research Ethics Board",
          },
          {
            label: "Social & Behavioral IRB",
            value: "Social & Behavioral IRB",
          },
          {
            label: "AI, Data & Tech Ethics",
            value: "AI & Emerging Technologies Ethics Panel",
          },
          {
            label: "Public Health & Clinical",
            value: "Public Health & Clinical Epidemiology",
          },
        ],
      },
    ],
    []
  )

  return (
    <DashboardContainer>
      {/* ── KPI Grid ───────────────────────────────────────────────────────── */}
      <KpiGrid columns={4}>
        <KpiCard
          label="Total Accredited Roster"
          value={reviewerTotal}
          icon={Users}
          color="navy"
        />
        <KpiCard
          label="Active Voting Quorum"
          value={reviewerActive}
          icon={UserCheck}
          color="green"
        />
        <KpiCard
          label="Inactive / Suspended"
          value={reviewerInactive}
          icon={UserX}
          color="amber"
        />
        <KpiCard
          label="Mean Deliberation Workload"
          value={`${meanReviewerWorkload}`}
          icon={Scale}
          color="gold"
        />
      </KpiGrid>

      {/* ── Unified DataTable ──────────────────────────────────────────────── */}
      <div className="w-full">
        <DataTable<AccreditedReviewer>
          data={reviewers}
          columns={reviewerColumns}
          title="Institutional Reviewer Roster & Quorum Standing"
          searchPlaceholder="Search reviewers by name, institution, email, or specialization..."
          searchKeys={[
            "name",
            "email",
            "department",
            "institution",
            "board",
            "specializations",
          ]}
          filters={reviewerFilters}
          initialPageSize={10}
          pageSizeOptions={[5, 10, 20, 50]}
          initialSort={{
            columnId: "id",
            direction: "desc",
          }}
          toolbarActions={
            <div className="flex items-center gap-2">
              <Link href="/admin/users">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 text-base font-semibold rounded-lg border-slate-200/90 dark:border-slate-700"
                >
                  <Users className="size-3.5 text-primary dark:text-sky-400" />
                  <span>All Users</span>
                </Button>
              </Link>
              <Link href="/admin/admins">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 text-base font-semibold rounded-lg border-slate-200/90 dark:border-slate-700"
                >
                  <ShieldCheck className="size-3.5 text-primary dark:text-sky-400" />
                  <span>Admin List</span>
                </Button>
              </Link>
              <Link href="/admin/applications">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 text-base font-semibold rounded-lg border-slate-200/90 dark:border-slate-700"
                >
                  <ClipboardCheck className="size-3.5 text-primary dark:text-sky-400" />
                  <span>Applications Queue</span>
                </Button>
              </Link>
            </div>
          }
        />
      </div>
    </DashboardContainer>
  )
}

export default function AdminReviewerRosterPage() {
  return (
    <React.Suspense fallback={
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="size-8 rounded-full border-2 border-[#002752] border-t-transparent animate-spin" />
      </div>
    }>
      <AdminRosterContent />
    </React.Suspense>
  )
}
