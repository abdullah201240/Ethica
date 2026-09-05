import { Skeleton } from "@/components/ui/skeleton"
import { DataTableSkeleton } from "@/components/ui/data-table"

export default function ProfileLoading() {
  return (
    <div className="space-y-6 sm:space-y-8 select-none w-full" aria-busy="true" aria-label="Loading investigator profile">
      {/* 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2-Columns: Primary Identity & Contact */}
        <div className="lg:col-span-2 space-y-6">
          {/* Identity & Profile Picture Card Skeleton */}
          <div className="rounded-none sm:rounded-2xl border-y sm:border border-border/75 bg-card px-4 py-5 sm:p-6 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-b border-border/70 pb-6">
              <div className="flex items-center gap-5">
                <Skeleton className="size-20 sm:size-24 rounded-2xl shrink-0" />
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-7 w-48 sm:w-64 rounded-md" />
                    <Skeleton className="h-5 w-24 rounded-md" />
                  </div>
                  <Skeleton className="h-4 w-56 rounded-md" />
                  <Skeleton className="h-4 w-40 rounded-md" />
                </div>
              </div>
              <Skeleton className="h-9 w-32 rounded-md shrink-0" />
            </div>

            {/* Profile Fields Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-3.5 rounded-xl border border-border/60 bg-muted/20 space-y-2">
                  <Skeleton className="h-3 w-24 rounded-md" />
                  <Skeleton className="h-5 w-3/4 rounded-md" />
                </div>
              ))}
            </div>
          </div>

          {/* Institutional Credentials Card Skeleton */}
          <div className="rounded-none sm:rounded-2xl border-y sm:border border-border/75 bg-card px-4 py-5 sm:p-6 space-y-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-border/70 pb-4">
              <div className="space-y-1.5">
                <Skeleton className="h-5 w-44 rounded-md" />
                <Skeleton className="h-3 w-64 rounded-md" />
              </div>
              <Skeleton className="h-8 w-20 rounded-md" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-3 w-28 rounded-md" />
                  <Skeleton className="h-9 w-full rounded-md" />
                </div>
              ))}
            </div>
          </div>

          {/* Associated Protocols Docket Skeleton */}
          <DataTableSkeleton
            columnCount={4}
            rowCount={3}
            showHeader={true}
            showToolbar={true}
            showPagination={true}
          />
        </div>

        {/* Right 1-Column: Accreditation & Security Details */}
        <div className="space-y-6">
          {/* Institutional Accreditation Seal Card Skeleton */}
          <div className="rounded-none sm:rounded-2xl border-y sm:border border-border/75 bg-card p-5 sm:p-6 space-y-5 shadow-xs">
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-xl shrink-0" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-36 rounded-md" />
                <Skeleton className="h-3 w-28 rounded-md" />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <Skeleton className="h-16 w-full rounded-xl" />
              <Skeleton className="h-16 w-full rounded-xl" />
              <Skeleton className="h-16 w-full rounded-xl" />
            </div>
          </div>

          {/* Cryptographic Seal Card Skeleton */}
          <div className="rounded-none sm:rounded-2xl border-y sm:border border-border/75 bg-card p-5 sm:p-6 space-y-4 shadow-xs">
            <Skeleton className="h-4 w-40 rounded-md" />
            <Skeleton className="h-14 w-full rounded-xl" />
            <Skeleton className="h-8 w-full rounded-md" />
          </div>
        </div>
      </div>
    </div>
  )
}
