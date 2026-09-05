import { KpiGridSkeleton } from "@/components/ui/kpi-card"
import { DataTableSkeleton } from "@/components/ui/data-table"

export default function AdminCategoriesLoading() {
  return (
    <div className="space-y-6 sm:space-y-8 select-none" aria-busy="true" aria-label="Loading research categories">
      {/* Centralized KPI Metrics Grid Skeleton */}
      <KpiGridSkeleton columns={4} />

      {/* Unified Institutional DataTable Skeleton */}
      <DataTableSkeleton
        columnCount={7}
        rowCount={6}
        showHeader={true}
        showToolbar={true}
        showPagination={true}
      />
    </div>
  )
}
