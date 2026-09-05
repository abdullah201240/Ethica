import { DashboardContainer } from "@/components/dashboard/dashboard-container"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminProtocolDossierLoading() {
  return (
    <DashboardContainer className="space-y-6">
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-40" />
      </div>

      <div className="rounded-xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-8 w-96 max-w-full" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 w-36" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="rounded-xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] p-5 space-y-3">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="rounded-xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] p-5 space-y-3">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="rounded-xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] p-5 space-y-3">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </DashboardContainer>
  )
}
