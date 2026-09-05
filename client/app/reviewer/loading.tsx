import { KpiGridSkeleton } from "@/components/ui/kpi-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export default function ReviewerLoading() {
  return (
    <div className="space-y-6 sm:space-y-8 select-none" aria-busy="true" aria-label="Loading reviewer deliberation chamber">
      {/* Centralized KPI Counters Grid Skeleton */}
      <KpiGridSkeleton columns={4} />

      {/* Deliberation Queue Section Skeleton */}
      <div className="rounded-none sm:rounded-2xl border-y sm:border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-72 rounded-md" />
            <Skeleton className="h-4 w-96 rounded-md" />
          </div>
          <Skeleton className="h-7 w-48 rounded-lg" />
        </div>

        {/* Protocols Voting List Skeleton */}
        <div className="divide-y divide-slate-200/70 dark:divide-slate-800">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="p-4 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              <div className="space-y-2.5 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-28 rounded-md" />
                  <Skeleton className="h-5 w-32 rounded-full" />
                  <Skeleton className="h-5 w-24 rounded-md" />
                </div>
                <Skeleton className="h-5 w-3/4 rounded-md" />
                <div className="flex items-center gap-4">
                  <Skeleton className="h-4 w-36 rounded-md" />
                  <Skeleton className="h-4 w-44 rounded-md" />
                  <Skeleton className="h-4 w-32 rounded-md" />
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Skeleton className="h-9 w-24 rounded-lg" />
                <Skeleton className="h-9 w-24 rounded-lg" />
                <Skeleton className="h-9 w-28 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quorum Schedule Card Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5 sm:p-6 rounded-2xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs space-y-4">
          <Skeleton className="h-5 w-48 rounded-md" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 space-y-2">
                <Skeleton className="h-4 w-40 rounded-md" />
                <Skeleton className="h-3 w-56 rounded-md" />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 sm:p-6 rounded-2xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs space-y-4">
          <Skeleton className="h-5 w-44 rounded-md" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 space-y-2">
                <Skeleton className="h-4 w-48 rounded-md" />
                <Skeleton className="h-3 w-64 rounded-md" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
