"use client"

import * as React from "react"
import Link from "next/link"
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Eye,
  Building2,
  Calendar,
  Download,
  Sparkles,
  Layers,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataTable, type ColumnDef, type DataTableFilter } from "@/components/ui/data-table"
import { KpiCard, KpiGrid } from "@/components/ui/kpi-card"
import { DashboardContainer } from "@/components/dashboard/dashboard-container"
import {
  getStoredProtocols,
  subscribeProtocols,
  type Protocol,
} from "@/lib/protocols-store"

export default function UserApplicationsPage() {
  const [protocols, setProtocols] = React.useState<Protocol[]>(getStoredProtocols)

  React.useEffect(() => {
    const sync = () => {
      setProtocols(getStoredProtocols())
    }
    const unsubscribe = subscribeProtocols(sync)
    return () => unsubscribe()
  }, [])

  // ── Metrics Calculation ──────────────────────────────────────────────────
  const totalApps = protocols.length
  const underReviewCount = protocols.filter(
    (p) => p.status === "Under Committee Review" || p.status === "Expedited Triage"
  ).length
  const clearanceGrantedCount = protocols.filter(
    (p) => p.status === "Clearance Granted"
  ).length
  const revisionDueCount = protocols.filter(
    (p) => p.status === "Revision Requested"
  ).length

  // ── Column Definitions ───────────────────────────────────────────────────
  const columns = React.useMemo<ColumnDef<Protocol>[]>(
    () => [
      {
        id: "id",
        accessorKey: "id",
        header: "Application ID",
        sortable: true,
        headerClassName: "w-36",
        cell: ({ row }) => (
          <div className="space-y-1">
            <Link
              href={`/applications/${row.id}`}
              className="font-mono text-base font-bold text-primary dark:text-sky-300 hover:underline block"
            >
              {row.id}
            </Link>
            <div className="flex items-center gap-1 text-micro text-muted-foreground whitespace-nowrap">
              <Calendar className="size-3 text-slate-400 shrink-0" />
              <span>{row.submissionDate}</span>
            </div>
            {row.isExpedited && (
              <Badge
                variant="outline"
                className="bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20 text-[0.68rem] px-1.5 py-0 font-medium"
              >
                Fast-Track
              </Badge>
            )}
          </div>
        ),
      },
      {
        id: "title",
        accessorKey: "title",
        header: "Research Title & Department",
        sortable: true,
        cell: ({ row }) => (
          <div className="max-w-md min-w-56 space-y-1">
            <Link
              href={`/applications/${row.id}`}
              className="font-semibold text-foreground text-table-cell leading-snug hover:text-primary dark:hover:text-sky-300 line-clamp-2"
            >
              {row.title}
            </Link>
            <div className="flex items-center gap-1.5 text-micro text-muted-foreground flex-wrap">
              <span className="inline-flex items-center gap-1">
                <Building2 className="size-3 shrink-0" />
                <span className="truncate">{row.department}</span>
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="font-medium text-muted-foreground truncate">
                {row.board}
              </span>
            </div>
          </div>
        ),
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Governance Status",
        sortable: true,
        headerClassName: "w-44",
        cell: ({ row }) => (
          <span
            className={`inline-flex items-center gap-1.5 text-micro font-bold px-2.5 py-1 rounded-md border whitespace-nowrap ${
              row.statusColor === "emerald"
                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                : row.statusColor === "amber"
                ? "bg-amber-500/10 text-amber-800 dark:text-amber-400 border-amber-500/20"
                : row.statusColor === "blue"
                ? "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20"
                : "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20"
            }`}
          >
            <span
              className={`size-1.5 rounded-full shrink-0 ${
                row.statusColor === "emerald"
                  ? "bg-emerald-500"
                  : row.statusColor === "amber"
                  ? "bg-amber-500"
                  : row.statusColor === "blue"
                  ? "bg-sky-500"
                  : "bg-rose-500"
              }`}
            />
            {row.status}
          </span>
        ),
      },
      {
        id: "risk",
        accessorKey: "risk",
        header: "Risk Tier",
        sortable: true,
        headerClassName: "w-36",
        cell: ({ row }) => (
          <span
            className={`text-micro font-semibold px-2 py-1 rounded-md whitespace-nowrap inline-block ${
              row.riskColor === "emerald"
                ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400"
                : row.riskColor === "purple"
                ? "bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-400"
                : "bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-400"
            }`}
          >
            {row.risk}
          </span>
        ),
      },
      {
        id: "reviewStage",
        header: "Deliberation Stage",
        headerClassName: "w-40",
        cell: ({ row }) => {
          const step = row.reviewStep ?? (row.status === "Clearance Granted" ? 5 : 4)
          const stageLabels: Record<number, string> = {
            1: "1/5 Protocol Registered",
            2: "2/5 Payment Confirmed",
            3: "3/5 Secretariat Triage",
            4: "4/5 Peer Deliberation",
            5: "5/5 Determination Sealed",
          }
          return (
            <div className="space-y-1">
              <span className="text-micro font-medium text-foreground block whitespace-nowrap">
                {stageLabels[step] || "Under Deliberation"}
              </span>
              <div className="w-24 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    row.statusColor === "emerald"
                      ? "bg-emerald-500 w-full"
                      : row.statusColor === "rose"
                      ? "bg-rose-500 w-4/5"
                      : row.statusColor === "blue"
                      ? "bg-sky-500 w-3/5"
                      : "bg-amber-500 w-4/5"
                  }`}
                />
              </div>
            </div>
          )
        },
      },
      {
        id: "payment",
        header: "BDT Fee & TrxID",
        headerClassName: "w-40",
        cell: ({ row }) => (
          <div className="space-y-0.5 whitespace-nowrap">
            <div className="text-table-cell font-bold text-foreground flex items-center gap-1">
              <span>৳ {(row.feeAmountBdt ?? 7500).toLocaleString()}</span>
              <span className="text-micro font-normal text-muted-foreground uppercase">
                ({row.paymentMethod || "bKash"})
              </span>
            </div>
            {row.transactionId && (
              <span className="font-mono text-[0.7rem] text-muted-foreground block">
                Trx: {row.transactionId}
              </span>
            )}
          </div>
        ),
      },
      {
        id: "daysInReview",
        accessorKey: "daysInReview",
        header: "Turnaround",
        sortable: true,
        align: "center",
        headerClassName: "w-24",
        cell: ({ row }) => (
          <div className="text-center">
            <span className="text-table-cell font-bold text-foreground tabular-nums block">
              {row.daysInReview}d
            </span>
            <span className="text-[0.68rem] text-muted-foreground block">in review</span>
          </div>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        align: "right",
        headerClassName: "w-44 text-right",
        cell: ({ row }) => (
          <div className="inline-flex items-center gap-2 justify-end">
            <Link href={`/applications/${row.id}`}>
              <Button
                type="button"
                variant="default"
                className="h-8 px-3 text-body-sm font-bold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs gap-1.5 transition-colors cursor-pointer"
                title="Inspect Application Dossier"
              >
                <Eye className="size-3.5" />
                <span>Dossier</span>
              </Button>
            </Link>

            {row.hasCertificate && (
              <Link href={`/applications/${row.id}#certificate`}>
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  className="h-8 w-8 rounded-lg border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors cursor-pointer"
                  title="View Clearance Seal & Certificate"
                >
                  <Download className="size-3.5" />
                </Button>
              </Link>
            )}
          </div>
        ),
      },
    ],
    []
  )

  // ── Faceted Filter Definitions ───────────────────────────────────────────
  const filters = React.useMemo<DataTableFilter<Protocol>[]>(
    () => [
      {
        id: "status",
        title: "Status",
        accessorKey: "status",
        options: [
          { label: "Under Committee Review", value: "Under Committee Review" },
          { label: "Clearance Granted", value: "Clearance Granted" },
          { label: "Revision Requested", value: "Revision Requested" },
          { label: "Expedited Triage", value: "Expedited Triage" },
        ],
      },
      {
        id: "board",
        title: "Ethics Board",
        accessorKey: "board",
        options: [
          { label: "Biomedical IRB", value: "Biomedical IRB" },
          { label: "Social & Behavioral Board", value: "Social & Behavioral Board" },
          { label: "AI & Data Ethics Board", value: "AI & Data Ethics Board" },
        ],
      },
      {
        id: "risk",
        title: "Risk Tier",
        accessorKey: "risk",
        options: [
          { label: "Minimal Risk", value: "Minimal Risk" },
          { label: "Exempt - Fast Track", value: "Exempt - Fast Track" },
          { label: "Greater Than Minimal", value: "Greater Than Minimal" },
        ],
      },
      {
        id: "paymentMethod",
        title: "Payment Gateway",
        accessorKey: "paymentMethod",
        options: [
          { label: "bKash", value: "bkash" },
          { label: "Nagad", value: "nagad" },
          { label: "Rocket", value: "rocket" },
          { label: "Bank Challan", value: "bank_transfer" },
          { label: "Debit/Credit Card", value: "card" },
        ],
      },
    ],
    []
  )

  return (
    <DashboardContainer>
      {/* ── Centralized Metric Counters Grid (Rule 11) ────────────────────── */}
      <KpiGrid columns={4}>
        <KpiCard
          label="Total Applications"
          value={totalApps}
          icon={Layers}
          color="navy"
          description="Lifetime research protocol submissions"
        />
        <KpiCard
          label="In Deliberation"
          value={underReviewCount}
          icon={Clock}
          color="amber"
          description="Currently active under committee review"
        />
        <KpiCard
          label="Clearance Granted"
          value={clearanceGrantedCount}
          icon={CheckCircle2}
          color="green"
          description="Official ethical clearance certificates issued"
        />
        <KpiCard
          label="Revisions Due"
          value={revisionDueCount}
          icon={AlertCircle}
          color="rose"
          description="Committee feedback requiring investigator action"
        />
      </KpiGrid>

      {/* ── Mandatory Centralized DataTable (Rule 6) ──────────────────────── */}
      <div id="applications-table" className="w-full">
        <DataTable<Protocol>
          data={protocols}
          columns={columns}
          title="Principal Investigator Applications Docket"
          searchPlaceholder="Search by protocol title, ID, board, department, or TrxID..."
          searchKeys={["title", "id", "department", "board", "transactionId"]}
          filters={filters}
          initialPageSize={10}
          pageSizeOptions={[5, 10, 20, 50]}
          initialSort={{
            columnId: "id",
            direction: "desc",
          }}
          toolbarActions={
            <Link
              href="/apply"
              className="inline-flex items-center gap-1.5 h-8 px-3 text-body-sm font-bold bg-primary hover:bg-[#001c3d] text-white rounded-lg transition-colors shadow-xs"
            >
              <Plus className="size-3.5" />
              <span className="hidden sm:inline">Apply for Permission</span>
              <span className="sm:hidden">Apply</span>
            </Link>
          }
        />
      </div>

      {/* ── Status Lifecycle Guide Footer ─────────────────────────────────── */}
      <div className="rounded-none sm:rounded-2xl border-y sm:border border-border/75 bg-muted/30 p-4 sm:p-5 shadow-xs space-y-3">
        <h4 className="text-body-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="size-4 text-amber-500" />
          <span>Institutional Review Governance Stages</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-body-sm">
          <div className="p-3 rounded-lg border border-border/70 bg-card space-y-1">
            <span className="font-bold text-foreground block">1. Intake & Fee Triage</span>
            <p className="text-muted-foreground text-micro">
              Proposal sealed, BDT fee verified via gateway, initial completeness check by Secretariat.
            </p>
          </div>
          <div className="p-3 rounded-lg border border-border/70 bg-card space-y-1">
            <span className="font-bold text-foreground block">2. Board Assignment</span>
            <p className="text-muted-foreground text-micro">
              Routed to Biomedical, Social & Behavioral, or AI Ethics Board based on methodology scope.
            </p>
          </div>
          <div className="p-3 rounded-lg border border-border/70 bg-card space-y-1">
            <span className="font-bold text-foreground block">3. Peer Deliberation</span>
            <p className="text-muted-foreground text-micro">
              Independent evaluation by accredited committee reviewers assessing human subject risk.
            </p>
          </div>
          <div className="p-3 rounded-lg border border-border/70 bg-card space-y-1">
            <span className="font-bold text-foreground block">4. Clearance Certificate</span>
            <p className="text-muted-foreground text-micro">
              Clearance granted with SHA-256 tamper-evident digital seal, or detailed revision directives issued.
            </p>
          </div>
        </div>
      </div>
    </DashboardContainer>
  )
}
