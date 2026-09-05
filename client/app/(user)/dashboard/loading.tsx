import { KpiGridSkeleton } from "@/components/ui/kpi-card"
import { DataTableSkeleton } from "@/components/ui/data-table"
import { Skeleton } from "@/components/ui/skeleton"

export default function UserDashboardLoading() {
  return (
    <div className="space-y-6 sm:space-y-8 select-none" aria-busy="true" aria-label="Loading investigator dashboard">
      {/* Centralized KPI Counters Grid Skeleton */}
      <KpiGridSkeleton columns={4} />

      {/* Unified Institutional DataTable Skeleton */}
      <DataTableSkeleton
        columnCount={5}
        rowCount={5}
        showHeader={true}
        showToolbar={true}
        showPagination={true}
      />

      {/* Institutional Banner Skeleton */}
      <div className="p-4 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 w-full md:w-auto">
          <Skeleton className="size-10 rounded-xl shrink-0" />
          <div className="space-y-2 w-full max-w-md">
            <Skeleton className="h-4 w-3/4 rounded-md" />
            <Skeleton className="h-3 w-full rounded-md" />
          </div>
        </div>
        <Skeleton className="h-9 w-52 rounded-xl shrink-0" />
      </div>
    </div>
  )
}
