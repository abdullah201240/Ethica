import { Skeleton } from "@/components/ui/skeleton"
import { KpiGridSkeleton } from "@/components/ui/kpi-card"
import { Card } from "@/components/ui/card"

export default function AdminMemberDossierLoading() {
  return (
    <div className="space-y-6 select-none w-full max-w-full overflow-x-hidden pb-12" aria-busy="true" aria-label="Loading admin member dossier">
      {/* Top Navigation & Breadcrumbs Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-3">
        <Skeleton className="h-4 w-44 rounded-md" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-28 rounded-lg" />
          <Skeleton className="h-8 w-32 rounded-lg" />
        </div>
      </div>

      {/* Header Profile Identity Card Skeleton */}
      <Card className="p-6 rounded-2xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <Skeleton className="size-20 sm:size-24 rounded-2xl shrink-0" />
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-60 sm:w-80 rounded-md" />
                <Skeleton className="h-6 w-32 rounded-md" />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Skeleton className="h-4 w-48 rounded-md" />
                <Skeleton className="h-4 w-36 rounded-md" />
                <Skeleton className="h-4 w-28 rounded-md" />
              </div>
              <div className="flex gap-2 pt-1">
                <Skeleton className="h-5 w-28 rounded-md" />
                <Skeleton className="h-5 w-32 rounded-md" />
              </div>
            </div>
          </div>
          <Skeleton className="h-9 w-44 rounded-lg shrink-0" />
        </div>
      </Card>

      {/* KPI Grid Skeleton */}
      <KpiGridSkeleton columns={4} />

      {/* Main Details Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-5 rounded-xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs space-y-4">
            <Skeleton className="h-5 w-64 rounded-md" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800 space-y-2">
                  <Skeleton className="h-3 w-28 rounded-md" />
                  <Skeleton className="h-5 w-3/4 rounded-md" />
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-5 rounded-xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs space-y-4">
            <Skeleton className="h-5 w-44 rounded-md" />
            <Skeleton className="h-14 w-full rounded-xl" />
            <Skeleton className="h-8 w-full rounded-md" />
          </Card>
        </div>
      </div>
    </div>
  )
}
