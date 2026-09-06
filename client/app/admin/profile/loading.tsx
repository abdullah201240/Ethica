import { Skeleton } from "@/components/ui/skeleton"
import { DataTableSkeleton } from "@/components/ui/data-table"

export default function AdminProfileLoading() {
  return (
    <div className="space-y-6 sm:space-y-8 select-none w-full" aria-busy="true" aria-label="Loading administrator profile">
      {/* Main Admin Profile 2-Column Card Skeleton */}
      <div className="bg-card border border-border/75 rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Account Management */}
          <div className="lg:col-span-4 space-y-6">
            <Skeleton className="h-5 w-44 rounded-md" />
            <div className="space-y-3">
              <Skeleton className="w-full aspect-[4/3] sm:aspect-square max-w-[340px] rounded-xl" />
              <Skeleton className="w-full max-w-[340px] h-10 rounded-md" />
            </div>
            <div className="space-y-4 max-w-[340px] pt-2">
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-24 rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-24 rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>

          {/* Right Column: Profile Information, Contact Info & Bio */}
          <div className="lg:col-span-8 space-y-8 lg:border-l lg:border-border/60 lg:pl-10">
            {/* Section 1: Profile Information */}
            <div className="space-y-4">
              <Skeleton className="h-5 w-40 rounded-md" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-1.5">
                    <Skeleton className="h-3 w-24 rounded-md" />
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2: Contact Info */}
            <div className="space-y-4 pt-2">
              <Skeleton className="h-5 w-32 rounded-md" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-1.5">
                    <Skeleton className="h-3 w-24 rounded-md" />
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: About the User */}
            <div className="space-y-4 pt-2">
              <Skeleton className="h-5 w-36 rounded-md" />
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-28 rounded-md" />
                <Skeleton className="h-36 w-full rounded-md" />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border/60">
              <Skeleton className="h-10 w-24 rounded-md" />
              <Skeleton className="h-10 w-32 rounded-md" />
            </div>
          </div>
        </div>
      </div>

      {/* Device Sessions Docket Skeleton */}
      <DataTableSkeleton
        columnCount={7}
        rowCount={4}
        showHeader={true}
        showToolbar={true}
        showPagination={true}
      />
    </div>
  )
}
