import { DashboardContainer } from "@/components/dashboard/dashboard-container"
import { DataTableSkeleton } from "@/components/ui/data-table"
import { KpiGridSkeleton } from "@/components/ui/kpi-card"

export default function AdminProtocolsLoading() {
  return (
    <DashboardContainer className="space-y-6">
      <KpiGridSkeleton columns={4} />
      <DataTableSkeleton
        columnCount={7}
        rowCount={8}
        showHeader={true}
        showToolbar={true}
        showPagination={true}
      />
    </DashboardContainer>
  )
}
