"use client"

import * as React from "react"
import Link from "next/link"
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Download,
  ExternalLink,
  ShieldCheck,
  Building2,
  Calendar,
  Award,
  Sparkles,
  BookOpen,
  Check,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable, type ColumnDef, type DataTableFilter } from "@/components/ui/data-table"
import { KpiCard, KpiGrid } from "@/components/ui/kpi-card"
import { DashboardContainer } from "@/components/dashboard/dashboard-container"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getStoredProtocols, type Protocol } from "@/lib/protocols-store"
import { CertificateModal } from "@/components/certificate/certificate-modal"

export default function UserDashboardPage() {
  const [protocols, setProtocols] = React.useState<Protocol[]>(getStoredProtocols)
  const [selectedCertificateProtocol, setSelectedCertificateProtocol] = React.useState<Protocol | null>(null)
  const [isCertificateModalOpen, setIsCertificateModalOpen] = React.useState(false)

  React.useEffect(() => {
    const syncProtocols = () => {
      setProtocols(getStoredProtocols())
    }

    window.addEventListener("ethica:protocols-updated", syncProtocols)

    return () => {
      window.removeEventListener("ethica:protocols-updated", syncProtocols)
    }
  }, [])

  // ── Column Definitions ──────────────────────────────────────────────────────
  const columns = React.useMemo<ColumnDef<Protocol>[]>(
    () => [
      {
        id: "id",
        accessorKey: "id",
        header: "Protocol ID",
        sortable: true,
        headerClassName: "w-32",
        cell: ({ row }) => (
          <span className="font-mono text-table-cell font-bold px-2 py-1 rounded-md bg-primary/8 dark:bg-white/8 text-primary dark:text-sky-300 border border-primary/10 dark:border-white/10 whitespace-nowrap inline-block">
            {row.id}
          </span>
        ),
      },
      {
        id: "title",
        accessorKey: "title",
        header: "Title & Research Department",
        sortable: true,
        cell: ({ row }) => (
          <div className="max-w-md min-w-56">
            <p className="font-semibold text-foreground text-table-cell leading-snug line-clamp-2">
              {row.title}
            </p>
            <div className="flex items-center gap-1.5 mt-1 text-micro text-muted-foreground flex-wrap">
              <span className="inline-flex items-center gap-1">
                <Building2 className="size-3 shrink-0" />
                <span className="truncate">{row.department}</span>
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="truncate font-medium text-muted-foreground">
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
              className={`size-1.5 rounded-full ${
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
        id: "submissionDate",
        accessorKey: "submissionDate",
        header: "Submitted",
        sortable: true,
        headerClassName: "w-32",
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5 text-table-cell text-muted-foreground whitespace-nowrap">
            <Calendar className="size-3.5 text-slate-400 shrink-0" />
            {row.submissionDate}
          </div>
        ),
      },
      {
        id: "daysInReview",
        accessorKey: "daysInReview",
        header: "Days",
        sortable: true,
        align: "center",
        headerClassName: "w-20",
        cell: ({ row }) => (
          <span className="text-table-cell font-bold text-foreground/85 tabular-nums">
            {row.daysInReview}d
          </span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        align: "right",
        headerClassName: "w-36 text-right",
        cell: ({ row }) => (
          <div className="inline-flex items-center gap-1.5 justify-end">
            {row.hasCertificate ? (
              <Button
                type="button"
                variant="default"
                size="xs"
                onClick={() => {
                  setSelectedCertificateProtocol(row)
                  setIsCertificateModalOpen(true)
                }}
                className="h-7 px-2.5 text-micro font-bold bg-[#198754] hover:bg-[#157347] text-white rounded-md gap-1 shadow-xs transition-colors cursor-pointer"
                title="View & Download Official Digital Clearance Certificate"
              >
                <Download className="size-3.5" />
                <span>Certificate</span>
              </Button>
            ) : (
              <Link href="/apply">
                <Button
                  type="button"
                  variant="default"
                  size="xs"
                  className="h-7 px-2.5 text-micro font-bold rounded-md bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs gap-1 transition-colors cursor-pointer"
                  title="Inspect Protocol Dossier"
                >
                  <Eye className="size-3.5" />
                  <span>Inspect</span>
                </Button>
              </Link>
            )}
            <Link href="/apply">
              <Button
                type="button"
                variant="outline"
                size="icon-xs"
                className="h-7 w-7 rounded-md border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-muted-foreground transition-colors cursor-pointer"
                title="Open Protocol Inspector"
              >
                <ExternalLink className="size-3" />
              </Button>
            </Link>
          </div>
        ),
      },
    ],
    []
  )

  // ── Faceted Filter Definitions ──────────────────────────────────────────────
  const filters = React.useMemo<DataTableFilter<Protocol>[]>(
    () => [
      {
        id: "status",
        title: "Status",
        accessorKey: "status",
        options: [
          { label: "Under Review", value: "Under Committee Review" },
          { label: "Clearance Granted", value: "Clearance Granted" },
          { label: "Revisions Due", value: "Revision Requested" },
          { label: "Expedited Triage", value: "Expedited Triage" },
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
        id: "board",
        title: "Ethics Board",
        accessorKey: "board",
        options: [
          { label: "Biomedical IRB", value: "Biomedical IRB" },
          { label: "Social & Behavioral", value: "Social & Behavioral Board" },
          { label: "AI & Data Ethics", value: "AI & Data Ethics Board" },
        ],
      },
    ],
    []
  )

  return (
    <DashboardContainer>
      {/* Centralized Institutional Metric Counters Grid */}
      <KpiGrid columns={4}>
        <KpiCard
          label="Total Submissions"
          value={16}
          icon={FileText}
          color="navy"
        />
        <KpiCard
          label="In Active Review"
          value={3}
          icon={Clock}
          color="amber"
        />
        <KpiCard
          label="Clearance Granted"
          value={12}
          icon={CheckCircle2}
          color="green"
        />
        <KpiCard
          label="Revisions Due"
          value={1}
          icon={AlertCircle}
          color="rose"
        />
      </KpiGrid>

      {/* Unified Institutional DataTable Section */}
      <div id="protocols" className="w-full">
        <DataTable<Protocol>
          data={protocols}
          columns={columns}
          title="Institutional Research Ethics Docket"
          searchPlaceholder="Search by protocol title, ID, board, or department..."
          searchKeys={["title", "id", "department", "board"]}
          filters={filters}
          initialPageSize={5}
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
              <span className="hidden sm:inline">New Submission</span>
              <span className="sm:hidden">New</span>
            </Link>
          }
        />
      </div>

      {/* Institutional Support & Guidance Banner */}
      <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-emerald-500/25 dark:border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="size-10 rounded-xl bg-[#198754] text-white flex items-center justify-center shrink-0 shadow-xs">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm sm:text-base text-primary dark:text-white">
              Institutional Ethics Helpline & Guidance Secretariat
            </h4>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Need assistance determining human participant risk categorization or crafting informed consent documentation?
            </p>
          </div>
        </div>

        <Link
          href="/apply"
          className="inline-flex items-center h-8 px-3.5 text-xs font-bold rounded-lg border border-[#198754]/40 text-[#198754] hover:bg-[#198754]/10 shrink-0 transition-colors"
        >
          Institutional Ethics Guidelines
        </Link>
      </div>

      {/* ── Section: Clearance Certificates Showcase ──────────────────────── */}
      <div id="certificates" className="space-y-4 w-full">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-section-heading text-primary dark:text-white uppercase tracking-tight flex items-center gap-2">
              <Award className="size-5 text-secondary" />
              <span>Digital Ethical Clearance Certificates</span>
            </h3>
            <p className="text-body text-muted-foreground">
              Official tamper-evident ethical clearance seals issued by DIU Institutional Review Board
            </p>
          </div>
          <Badge className="bg-secondary/10 text-secondary border-secondary/30 font-mono text-micro font-bold">
            12 Valid Certificates
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-5 rounded-2xl border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="font-mono text-table-cell font-bold text-primary dark:text-sky-300">
                  ETH-2026-074
                </span>
                <h4 className="text-card-title text-foreground mt-1">
                  Cognitive Load and Decision Fatigue in Telemedicine Triage Nurses
                </h4>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 text-micro font-mono">
                Exempt - Fast Track
              </Badge>
            </div>
            <div className="text-body-sm text-muted-foreground font-mono space-y-0.5">
              <div>Seal Hash: 8f92...a34e (SHA-256 Verified)</div>
              <div>Issued: Aug 14, 2026 • Valid until Aug 14, 2027</div>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-body-sm font-semibold text-secondary flex items-center gap-1">
                <Check className="size-3.5" /> Institutional Seal Confirmed
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  const p = protocols.find((item) => item.id === "ETH-2026-074") || null
                  setSelectedCertificateProtocol(p)
                  setIsCertificateModalOpen(true)
                }}
                className="inline-flex items-center gap-1 text-body-sm font-bold text-primary dark:text-sky-300 hover:underline p-0 h-auto cursor-pointer"
                title="View Ethical Clearance Certificate"
              >
                <span>View Full Certificate</span>
                <ExternalLink className="size-3" />
              </Button>
            </div>
          </Card>

          <Card className="p-5 rounded-2xl border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="font-mono text-table-cell font-bold text-primary dark:text-sky-300">
                  ETH-2026-061
                </span>
                <h4 className="text-card-title text-foreground mt-1">
                  Anonymized Genomic Sequence Sharing Protocol for Oncology Consortium
                </h4>
              </div>
              <Badge className="bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20 text-micro font-mono">
                Full Committee
              </Badge>
            </div>
            <div className="text-body-sm text-muted-foreground font-mono space-y-0.5">
              <div>Seal Hash: c104...e571 (SHA-256 Verified)</div>
              <div>Issued: Jul 19, 2026 • Valid until Jul 19, 2027</div>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-body-sm font-semibold text-secondary flex items-center gap-1">
                <Check className="size-3.5" /> Institutional Seal Confirmed
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  const p = protocols.find((item) => item.id === "ETH-2026-061") || null
                  setSelectedCertificateProtocol(p)
                  setIsCertificateModalOpen(true)
                }}
                className="inline-flex items-center gap-1 text-body-sm font-bold text-primary dark:text-sky-300 hover:underline p-0 h-auto cursor-pointer"
                title="View Ethical Clearance Certificate"
              >
                <span>View Full Certificate</span>
                <ExternalLink className="size-3" />
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* ── Section: Fast-Track Eligibility Checker ────────────────────────── */}
      <div id="eligibility" className="space-y-4 w-full">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-section-heading text-primary dark:text-white uppercase tracking-tight flex items-center gap-2">
              <Sparkles className="size-5 text-amber-500" />
              <span>Fast-Track & Exemption Eligibility Self-Assessment</span>
            </h3>
            <p className="text-body text-muted-foreground">
              Evaluate whether your planned study qualifies for expedited triage or IRB review exemption
            </p>
          </div>
          <Link
            href="/#checker"
            className="inline-flex items-center gap-1 text-body-sm font-bold text-primary dark:text-sky-300 hover:underline"
          >
            <span>Launch Interactive Simulator</span>
            <ExternalLink className="size-3" />
          </Link>
        </div>

        <Card className="p-6 rounded-2xl border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-body">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/70 dark:border-slate-800 space-y-2">
              <div className="size-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-body-sm">
                1
              </div>
              <h4 className="font-bold text-foreground">Minimal Risk Threshold</h4>
              <p className="text-muted-foreground leading-relaxed">
                Surveys, anonymous interviews, non-invasive physiological measurements with no vulnerable cohorts.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/70 dark:border-slate-800 space-y-2">
              <div className="size-8 rounded-lg bg-sky-500/10 text-sky-600 flex items-center justify-center font-bold text-body-sm">
                2
              </div>
              <h4 className="font-bold text-foreground">De-Identified Data Use</h4>
              <p className="text-muted-foreground leading-relaxed">
                Secondary analysis of anonymized medical datasets or public institutional records.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/70 dark:border-slate-800 space-y-2">
              <div className="size-8 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold text-body-sm">
                3
              </div>
              <h4 className="font-bold text-foreground">Educational & QA Studies</h4>
              <p className="text-muted-foreground leading-relaxed">
                Curriculum evaluations, pedagogy effectiveness research, and quality improvement audits.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* ── Section: Institutional Guidelines & Regulatory Policies ───────── */}
      <div id="guidelines" className="space-y-4 w-full">
        <div>
          <h3 className="text-section-heading text-primary dark:text-white uppercase tracking-tight flex items-center gap-2">
            <BookOpen className="size-5 text-primary dark:text-sky-300" />
            <span>Institutional Bioethics Guidelines & Standard Operating Procedures</span>
          </h3>
          <p className="text-body text-muted-foreground">
            Daffodil International University Research Ethics Board Governance Manual (2026 Edition)
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-body">
          <Card className="p-4 rounded-xl border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs flex flex-col justify-between gap-3">
            <div className="space-y-1">
              <h4 className="font-bold text-foreground text-card-title">
                Informed Consent Templates
              </h4>
              <p className="text-muted-foreground">
                Standard adult consent, pediatric assent, and digital teletherapy participant agreements.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="font-mono text-body-sm text-muted-foreground">DOCX & PDF</span>
              <span className="text-primary dark:text-sky-300 font-bold hover:underline cursor-pointer">
                Download Kit
              </span>
            </div>
          </Card>

          <Card className="p-4 rounded-xl border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs flex flex-col justify-between gap-3">
            <div className="space-y-1">
              <h4 className="font-bold text-foreground text-card-title">
                Data Privacy & Security Protocols
              </h4>
              <p className="text-muted-foreground">
                Guidelines on participant de-identification, encryption standards, and cloud repository audits.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="font-mono text-body-sm text-muted-foreground">PDF • 1.8 MB</span>
              <span className="text-primary dark:text-sky-300 font-bold hover:underline cursor-pointer">
                Read Policy
              </span>
            </div>
          </Card>

          <Card className="p-4 rounded-xl border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs flex flex-col justify-between gap-3">
            <div className="space-y-1">
              <h4 className="font-bold text-foreground text-card-title">
                AI & Algorithm Deliberation Framework
              </h4>
              <p className="text-muted-foreground">
                Specialized ethics criteria for generative models, clinical decision support, and training datasets.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="font-mono text-body-sm text-muted-foreground">PDF • 2.2 MB</span>
              <span className="text-primary dark:text-sky-300 font-bold hover:underline cursor-pointer">
                Read Framework
              </span>
            </div>
          </Card>
        </div>
      </div>

      {/* ── Official Ethical Clearance Certificate Modal ─────────────────────── */}
      <CertificateModal
        open={isCertificateModalOpen}
        onOpenChange={setIsCertificateModalOpen}
        protocol={selectedCertificateProtocol}
      />
    </DashboardContainer>
  )
}
