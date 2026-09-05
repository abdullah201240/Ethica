import { Skeleton } from "@/components/ui/skeleton"

export default function ApplyLoading() {
  return (
    <div className="space-y-6 sm:space-y-8 select-none w-full" aria-busy="true" aria-label="Loading research clearance wizard">
      {/* Wizard Stepper Bar Skeleton */}
      <div className="rounded-none sm:rounded-2xl border-y sm:border border-border/75 bg-card p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between gap-2 overflow-x-auto">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2.5 shrink-0 px-2.5 py-1.5">
              <Skeleton className="size-6 sm:size-7 rounded-md" />
              <Skeleton className="h-4 w-20 sm:w-28 rounded-md hidden md:block" />
            </div>
          ))}
        </div>
      </div>

      {/* Step Form Card Skeleton */}
      <div className="rounded-none sm:rounded-2xl border-y sm:border border-border/75 bg-card p-5 sm:p-8 shadow-xs space-y-6">
        {/* Step Header */}
        <div className="space-y-2 border-b border-border/70 pb-5">
          <Skeleton className="h-4 w-28 rounded-md" />
          <Skeleton className="h-7 w-72 sm:w-96 rounded-md" />
          <Skeleton className="h-4 w-full max-w-lg rounded-md" />
        </div>

        {/* Form Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
          <div className="sm:col-span-2 space-y-2">
            <Skeleton className="h-4 w-36 rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32 rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-40 rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-28 rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-36 rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <div className="sm:col-span-2 space-y-2">
            <Skeleton className="h-4 w-48 rounded-md" />
            <Skeleton className="h-24 w-full rounded-md" />
          </div>
        </div>

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-border/70">
          <Skeleton className="h-10 w-28 rounded-md" />
          <Skeleton className="h-10 w-36 rounded-md" />
        </div>
      </div>
    </div>
  )
}
