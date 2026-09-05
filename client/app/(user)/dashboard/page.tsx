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
  ChevronRight,
  ShieldCheck,
  Building2,
  Calendar,
  Award,
  Sparkles,
  BookOpen,
  Check,
} from "lucide-react"
import { DataTable, type ColumnDef, type DataTableFilter } from "@/components/ui/data-table"
import { KpiCard, KpiGrid } from "@/components/ui/kpi-card"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Protocol {
  id: string
  title: string
  department: string
  board: string
  status: "Under Committee Review" | "Clearance Granted" | "Revision Requested" | "Expedited Triage"
  statusColor: "amber" | "emerald" | "rose" | "blue"
  risk: "Minimal Risk" | "Exempt - Fast Track" | "Greater Than Minimal"
  riskColor: "blue" | "emerald" | "purple"
  submissionDate: string
  daysInReview: number
  hasCertificate: boolean
}

const sampleProtocols: Protocol[] = [
  {
    id: "ETH-2026-089",
    title: "Longitudinal AI-Assisted Clinical Biomarker Analysis in Type 2 Diabetes",
    department: "Public Health & Clinical Epidemiology",
    board: "Biomedical IRB",
    status: "Under Committee Review",
    statusColor: "amber",
    risk: "Minimal Risk",
    riskColor: "blue",
    submissionDate: "Aug 28, 2026",
    daysInReview: 6,
    hasCertificate: false,
  },
  {
    id: "ETH-2026-074",
    title: "Cognitive Load and Decision Fatigue in Telemedicine Triage Nurses",
    department: "Behavioral Sciences & Nursing",
    board: "Social & Behavioral Board",
    status: "Clearance Granted",
    statusColor: "emerald",
    risk: "Exempt - Fast Track",
    riskColor: "emerald",
    submissionDate: "Aug 14, 2026",
    daysInReview: 3,
    hasCertificate: true,
  },
  {
    id: "ETH-2026-061",
    title: "Anonymized Genomic Sequence Sharing Protocol for Regional Oncology Consortium",
    department: "Genomics & Precision Medicine",
    board: "Biomedical IRB",
    status: "Clearance Granted",
    statusColor: "emerald",
    risk: "Greater Than Minimal",
    riskColor: "purple",
    submissionDate: "Jul 19, 2026",
    daysInReview: 11,
    hasCertificate: true,
  },
  {
    id: "ETH-2026-042",
    title: "Digital Privacy and Consent Architecture in IoT Wearable Health Monitors",
    department: "Computer Science & Ethics",
    board: "AI & Data Ethics Board",
    status: "Revision Requested",
    statusColor: "rose",
    risk: "Minimal Risk",
    riskColor: "blue",
    submissionDate: "Jul 05, 2026",
    daysInReview: 14,
    hasCertificate: false,
  },
  {
    id: "ETH-2026-092",
    title: "Randomized Controlled Trial of Pediatric Cognitive Behavioral Teletherapy",
    department: "Pediatrics & Behavioral Health",
    board: "Biomedical IRB",
    status: "Under Committee Review",
    statusColor: "amber",
    risk: "Greater Than Minimal",
    riskColor: "purple",
    submissionDate: "Sep 01, 2026",
    daysInReview: 4,
    hasCertificate: false,
  },
  {
    id: "ETH-2026-085",
    title: "Occupational Ergonomics and Musculoskeletal Disorders Among Remote Tech Workers",
    department: "Occupational Health & Ergonomics",
    board: "Social & Behavioral Board",
    status: "Expedited Triage",
    statusColor: "blue",
    risk: "Minimal Risk",
    riskColor: "blue",
    submissionDate: "Aug 22, 2026",
    daysInReview: 5,
    hasCertificate: false,
  },
  {
    id: "ETH-2026-055",
    title: "Cross-Sectional Investigation into Maternal Nutritional Biomarkers in Rural Cohorts",
    department: "Nutrition & Food Engineering",
    board: "Biomedical IRB",
    status: "Clearance Granted",
    statusColor: "emerald",
    risk: "Minimal Risk",
    riskColor: "blue",
    submissionDate: "Jun 30, 2026",
    daysInReview: 7,
    hasCertificate: true,
  },
  {
    id: "ETH-2026-038",
    title: "Generative AI Code Assistance and Academic Integrity Perceptions Among Students",
    department: "Software Engineering & Pedagogy",
    board: "AI & Data Ethics Board",
    status: "Clearance Granted",
    statusColor: "emerald",
    risk: "Exempt - Fast Track",
    riskColor: "emerald",
    submissionDate: "May 18, 2026",
    daysInReview: 2,
    hasCertificate: true,
  },
  {
    id: "ETH-2026-029",
    title: "Microbiome Alterations in Patients Undergoing Early-Stage Chemotherapy",
    department: "Biomedical Engineering & Oncology",
    board: "Biomedical IRB",
    status: "Clearance Granted",
    statusColor: "emerald",
    risk: "Greater Than Minimal",
    riskColor: "purple",
    submissionDate: "Apr 25, 2026",
    daysInReview: 16,
    hasCertificate: true,
  },
  {
    id: "ETH-2026-021",
    title: "Perceived Fairness of Automated Healthcare Resource Allocation Algorithms",
    department: "Public Health Informatics",
    board: "AI & Data Ethics Board",
    status: "Clearance Granted",
    statusColor: "emerald",
    risk: "Minimal Risk",
    riskColor: "blue",
    submissionDate: "Apr 04, 2026",
    daysInReview: 6,
    hasCertificate: true,
  },
  {
    id: "ETH-2026-015",
    title: "Bioimpedance Sensor Calibration for Non-Invasive Cardiovascular Screening",
    department: "Electrical Engineering & Health Devices",
    board: "Biomedical IRB",
    status: "Clearance Granted",
    statusColor: "emerald",
    risk: "Minimal Risk",
    riskColor: "blue",
    submissionDate: "Mar 12, 2026",
    daysInReview: 8,
    hasCertificate: true,
  },
  {
    id: "ETH-2026-008",
    title: "Ethical Implications of Autonomous Vehicle Collision Triage Models",
    department: "Robotics & Moral Philosophy",
    board: "AI & Data Ethics Board",
    status: "Clearance Granted",
    statusColor: "emerald",
    risk: "Exempt - Fast Track",
    riskColor: "emerald",
    submissionDate: "Feb 19, 2026",
    daysInReview: 3,
    hasCertificate: true,
  },
]

export default function UserDashboardPage() {
  // ── Column Definitions ──────────────────────────────────────────────────────
  const columns = React.useMemo<ColumnDef<Protocol>[]>(
    () => [
      {
        id: "id",
        accessorKey: "id",
        header: "Protocol ID",
        sortable: true,
        headerClassName: "w-[130px]",
        cell: ({ row }) => (
          <span className="font-mono text-xs font-bold px-2 py-1 rounded-md bg-[#002752]/8 dark:bg-white/8 text-[#002752] dark:text-sky-300 border border-[#002752]/10 dark:border-white/10 whitespace-nowrap inline-block">
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
          <div className="max-w-md min-w-[220px]">
            <p className="font-semibold text-slate-900 dark:text-white text-[13px] leading-snug line-clamp-2">
              {row.title}
            </p>
            <div className="flex items-center gap-1.5 mt-1 text-[0.7rem] text-slate-400 dark:text-slate-500 flex-wrap">
              <span className="inline-flex items-center gap-1">
                <Building2 className="size-3 shrink-0" />
                <span className="truncate">{row.department}</span>
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="truncate font-medium text-slate-500 dark:text-slate-400">
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
        headerClassName: "w-[180px]",
        cell: ({ row }) => (
          <span
            className={`inline-flex items-center gap-1.5 text-[0.7rem] font-bold px-2.5 py-1 rounded-md border whitespace-nowrap ${
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
        headerClassName: "w-[150px]",
        cell: ({ row }) => (
          <span
            className={`text-[0.7rem] font-semibold px-2 py-1 rounded-md whitespace-nowrap inline-block ${
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
        headerClassName: "w-[130px]",
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
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
        headerClassName: "w-[80px]",
        cell: ({ row }) => (
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200 tabular-nums">
            {row.daysInReview}d
          </span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        align: "right",
        headerClassName: "w-[140px]",
        cell: ({ row }) => (
          <div className="inline-flex items-center gap-2">
            {row.hasCertificate ? (
              <Link
                href="/#certificate"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center h-8 px-2.5 text-[0.7rem] font-bold bg-[#198754] hover:bg-[#146c43] text-white rounded-lg gap-1 transition-colors cursor-pointer"
                title="Download Digital Clearance Certificate in New Tab"
              >
                <Download className="size-3.5" />
                <span>Certificate</span>
              </Link>
            ) : (
              <Link
                href="/#preview"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center h-8 px-2.5 text-[0.7rem] font-bold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 gap-1 transition-colors cursor-pointer"
                title="Inspect Protocol in New Tab"
              >
                <span>Inspect</span>
                <ChevronRight className="size-3.5" />
              </Link>
            )}
            <Link
              href="/#preview"
              target="_blank"
              rel="noopener noreferrer"
              className="size-8 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Open Protocol Inspector in New Tab"
            >
              <ExternalLink className="size-3.5" />
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
    <div className="space-y-6 sm:space-y-8">
      {/* Centralized Institutional Metric Counters Grid */}
      <KpiGrid columns={4}>
        <KpiCard
          label="Total Submissions"
          value={16}
          description="Across 4 research programs"
          icon={FileText}
          color="navy"
        />
        <KpiCard
          label="In Active Review"
          value={3}
          description="Avg review velocity: 4.8 days"
          icon={Clock}
          color="amber"
        />
        <KpiCard
          label="Clearance Granted"
          value={12}
          description="Cryptographically sealed certificates"
          icon={CheckCircle2}
          color="green"
        />
        <KpiCard
          label="Revisions Due"
          value={1}
          description="Deadline in 8 calendar days"
          icon={AlertCircle}
          color="rose"
        />
      </KpiGrid>

      {/* Unified Institutional DataTable Section */}
      <div id="protocols" className="w-full">
        <DataTable<Protocol>
          data={sampleProtocols}
          columns={columns}
          title="Institutional Research Ethics Docket"
          description="Comprehensive human subject research protocols registered under Daffodil International University IRB oversight"
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
              href="#new-protocol"
              className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-bold bg-[#002752] hover:bg-[#001c3d] text-white rounded-lg transition-colors shadow-xs"
            >
              <Plus className="size-3.5" />
              <span className="hidden sm:inline">New Submission</span>
              <span className="sm:hidden">New</span>
            </Link>
          }
        />
      </div>

      {/* Institutional Support & Integrity Banner */}
      <div className="p-4 sm:p-6 rounded-2xl border border-[#198754]/30 bg-[#198754]/5 dark:bg-[#198754]/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="size-10 rounded-xl bg-[#198754] text-white flex items-center justify-center shrink-0 shadow-xs">
            <ShieldCheck className="size-6" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-[#002752] dark:text-white">
              Institutional Ethics Helpline & Guidance Secretariat
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Need assistance determining human participant risk categorization or crafting informed consent documentation?
            </p>
          </div>
        </div>

        <Link
          href="/#faq"
          className="inline-flex items-center h-9 px-4 text-xs font-bold rounded-xl border border-[#198754]/40 text-[#198754] hover:bg-[#198754]/10 shrink-0 transition-colors"
        >
          Read Institutional Ethics Guidelines
        </Link>
      </div>

      {/* ── Section: Clearance Certificates Showcase ──────────────────────── */}
      <div id="certificates" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-[#002752] dark:text-white uppercase tracking-tight flex items-center gap-2">
              <Award className="size-5 text-[#198754]" />
              <span>Digital Ethical Clearance Certificates</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Official tamper-evident ethical clearance seals issued by DIU Institutional Review Board
            </p>
          </div>
          <Badge className="bg-[#198754]/10 text-[#198754] border-[#198754]/30 font-mono text-xs font-bold">
            12 Valid Certificates
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-5 rounded-2xl border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="font-mono text-xs font-bold text-[#002752] dark:text-sky-300">
                  ETH-2026-074
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                  Cognitive Load and Decision Fatigue in Telemedicine Triage Nurses
                </h4>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 text-[10px] font-mono">
                Exempt - Fast Track
              </Badge>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono space-y-0.5">
              <div>Seal Hash: 8f92...a34e (SHA-256 Verified)</div>
              <div>Issued: Aug 14, 2026 • Valid until Aug 14, 2027</div>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-[#198754] flex items-center gap-1">
                <Check className="size-3.5" /> Institutional Seal Confirmed
              </span>
              <Link
                href="/#certificate"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#002752] dark:text-sky-300 hover:underline"
              >
                <span>View Full Seal</span>
                <ExternalLink className="size-3" />
              </Link>
            </div>
          </Card>

          <Card className="p-5 rounded-2xl border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="font-mono text-xs font-bold text-[#002752] dark:text-sky-300">
                  ETH-2026-061
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                  Anonymized Genomic Sequence Sharing Protocol for Oncology Consortium
                </h4>
              </div>
              <Badge className="bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20 text-[10px] font-mono">
                Full Committee
              </Badge>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono space-y-0.5">
              <div>Seal Hash: c104...e571 (SHA-256 Verified)</div>
              <div>Issued: Jul 19, 2026 • Valid until Jul 19, 2027</div>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-[#198754] flex items-center gap-1">
                <Check className="size-3.5" /> Institutional Seal Confirmed
              </span>
              <Link
                href="/#certificate"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#002752] dark:text-sky-300 hover:underline"
              >
                <span>View Full Seal</span>
                <ExternalLink className="size-3" />
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* ── Section: Fast-Track Eligibility Checker ────────────────────────── */}
      <div id="eligibility" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-[#002752] dark:text-white uppercase tracking-tight flex items-center gap-2">
              <Sparkles className="size-5 text-amber-500" />
              <span>Fast-Track & Exemption Eligibility Self-Assessment</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Evaluate whether your planned study qualifies for expedited triage or IRB review exemption
            </p>
          </div>
          <Link
            href="/#checker"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#002752] dark:text-sky-300 hover:underline"
          >
            <span>Launch Interactive Simulator</span>
            <ExternalLink className="size-3" />
          </Link>
        </div>

        <Card className="p-6 rounded-2xl border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/70 dark:border-slate-800 space-y-2">
              <div className="size-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white">Minimal Risk Threshold</h4>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                Surveys, anonymous interviews, non-invasive physiological measurements with no vulnerable cohorts.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/70 dark:border-slate-800 space-y-2">
              <div className="size-8 rounded-lg bg-sky-500/10 text-sky-600 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white">De-Identified Data Use</h4>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                Secondary analysis of anonymized medical datasets or public institutional records.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/70 dark:border-slate-800 space-y-2">
              <div className="size-8 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white">Educational & QA Studies</h4>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                Curriculum evaluations, pedagogy effectiveness research, and quality improvement audits.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* ── Section: Institutional Guidelines & Regulatory Policies ───────── */}
      <div id="guidelines" className="space-y-4">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-[#002752] dark:text-white uppercase tracking-tight flex items-center gap-2">
            <BookOpen className="size-5 text-[#002752] dark:text-sky-300" />
            <span>Institutional Bioethics Guidelines & Standard Operating Procedures</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Daffodil International University Research Ethics Board Governance Manual (2026 Edition)
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <Card className="p-4 rounded-xl border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs flex flex-col justify-between gap-3">
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                Informed Consent Templates
              </h4>
              <p className="text-slate-500 dark:text-slate-400">
                Standard adult consent, pediatric assent, and digital teletherapy participant agreements.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="font-mono text-[10px] text-slate-400">DOCX & PDF</span>
              <span className="text-[#002752] dark:text-sky-300 font-bold hover:underline cursor-pointer">
                Download Kit
              </span>
            </div>
          </Card>

          <Card className="p-4 rounded-xl border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs flex flex-col justify-between gap-3">
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                Data Privacy & Security Protocols
              </h4>
              <p className="text-slate-500 dark:text-slate-400">
                Guidelines on participant de-identification, encryption standards, and cloud repository audits.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="font-mono text-[10px] text-slate-400">PDF • 1.8 MB</span>
              <span className="text-[#002752] dark:text-sky-300 font-bold hover:underline cursor-pointer">
                Read Policy
              </span>
            </div>
          </Card>

          <Card className="p-4 rounded-xl border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs flex flex-col justify-between gap-3">
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                AI & Algorithm Deliberation Framework
              </h4>
              <p className="text-slate-500 dark:text-slate-400">
                Specialized ethics criteria for generative models, clinical decision support, and training datasets.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="font-mono text-[10px] text-slate-400">PDF • 2.2 MB</span>
              <span className="text-[#002752] dark:text-sky-300 font-bold hover:underline cursor-pointer">
                Read Framework
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
