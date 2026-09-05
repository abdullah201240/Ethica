import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export default function ApplicationDossierLoading() {
  return (
    <div className="space-y-6 sm:space-y-8 select-none" aria-busy="true" aria-label="Loading reviewer application dossier">
      {/* Top Navigation & Breadcrumb Skeleton */}
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
