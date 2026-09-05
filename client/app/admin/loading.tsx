import { KpiGridSkeleton } from "@/components/ui/kpi-card"
import { DataTableSkeleton } from "@/components/ui/data-table"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminLoading() {
  return (
    <div className="space-y-6 sm:space-y-8 select-none" aria-busy="true" aria-label="Loading admin console">
      {/* Centralized KPI Counters Grid Skeleton */}
      <KpiGridSkeleton columns={4} />

      {/* Audit Log Card Skeleton */}
      <div className="rounded-none sm:rounded-2xl border-y sm:border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-64 rounded-md" />
            <Skeleton className="h-4 w-96 rounded-md" />
          </div>
          <Skeleton className="h-8 w-32 rounded-md" />
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800/80 p-4 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-28 rounded-md" />
                  <Skeleton className="h-4 w-44 rounded-md" />
                </div>
                <Skeleton className="h-3 w-64 rounded-md" />
              </div>
              <Skeleton className="h-6 w-36 rounded-md shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Unified Institutional Admin Roster DataTable Skeleton */}
      <DataTableSkeleton
        columnCount={5}
        rowCount={5}
        showHeader={true}
        showToolbar={true}
        showPagination={true}
      />
    </div>
  )
}
