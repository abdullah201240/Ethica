import { DashboardContainer } from "@/components/dashboard/dashboard-container"

export default function ReviewerProfileLoading() {
  return (
    <DashboardContainer className="space-y-6 animate-pulse">
      {/* Profile Header Skeleton */}
      <div className="rounded-xl sm:rounded-2xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="size-20 sm:size-24 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
          <div className="space-y-2 flex-1 w-full">
            <div className="h-7 w-64 bg-slate-200 dark:bg-slate-800 rounded-md" />
            <div className="h-4 w-48 bg-slate-200 dark:bg-slate-800 rounded-md" />
            <div className="flex gap-2 pt-1">
              <div className="h-5 w-28 bg-slate-200 dark:bg-slate-800 rounded-full" />
              <div className="h-5 w-24 bg-slate-200 dark:bg-slate-800 rounded-full" />
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="h-9 w-28 bg-slate-200 dark:bg-slate-800 rounded-lg" />
            <div className="h-9 w-28 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          </div>
        </div>
      </div>

      {/* KPI Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 rounded-xl sm:rounded-2xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] p-5 shadow-xs space-y-3"
          >
            <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
          </div>
        ))}
      </div>

      {/* Tabs Skeleton */}
      <div className="h-96 rounded-xl sm:rounded-2xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] p-6 shadow-xs" />
    </DashboardContainer>
  )
}
