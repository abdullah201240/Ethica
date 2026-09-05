import { Skeleton } from "@/components/ui/skeleton"

export default function ApplicationDossierLoading() {
  return (
    <div className="space-y-6 select-none" aria-busy="true" aria-label="Loading application dossier">
      {/* Back button skeleton */}
      <Skeleton className="h-6 w-48 rounded-md" />

      {/* Header card skeleton */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-card p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-28 rounded-md" />
          <Skeleton className="h-6 w-36 rounded-md" />
          <Skeleton className="h-6 w-24 rounded-md" />
        </div>
        <Skeleton className="h-8 w-3/4 rounded-md" />
        <Skeleton className="h-4 w-1/2 rounded-md" />
        <div className="grid grid-cols-5 gap-2 pt-3">
          <Skeleton className="h-16 rounded-lg" />
          <Skeleton className="h-16 rounded-lg" />
          <Skeleton className="h-16 rounded-lg" />
          <Skeleton className="h-16 rounded-lg" />
          <Skeleton className="h-16 rounded-lg" />
        </div>
      </div>

      {/* Two column layout skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-72 rounded-2xl" />
          <Skeleton className="h-60 rounded-2xl" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-56 rounded-2xl" />
        </div>
      </div>
    </div>
  )
}
