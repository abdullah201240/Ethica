"use client"

import * as React from "react"
import Link from "next/link"
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Sparkles,
  Download,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Building2,
  Calendar,
} from "lucide-react"

const sampleProtocols = [
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
]

export default function UserDashboardPage() {
  const [filter, setFilter] = React.useState("all")

  const filtered = sampleProtocols.filter((p) => {
    if (filter === "review") return p.status === "Under Committee Review"
    if (filter === "approved") return p.status === "Clearance Granted"
    if (filter === "revision") return p.status === "Revision Requested"
    return true
  })

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* Welcome Banner Card */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] p-6 sm:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#198754]/10 text-[#198754] text-xs font-bold border border-[#198754]/25">
              <ShieldCheck className="size-3.5" />
              <span>Daffodil International University IRB Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#002752] dark:text-white tracking-tight uppercase">
              Investigator Protocol Workspace
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
              Welcome back, <strong className="text-slate-900 dark:text-white">Dr. Elena Rostova</strong>. You have 1 protocol currently undergoing full IRB committee deliberation and 1 protocol requiring revision updates.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/#checker"
              className="inline-flex items-center h-10 px-4 bg-[#002752] hover:bg-[#001c3d] text-white font-bold text-xs rounded-xl transition-colors"
            >
              <Sparkles className="size-3.5 text-[#198754] mr-1.5" />
              <span>Check Fast-Track</span>
            </Link>
            <Link
              href="#new-protocol"
              className="inline-flex items-center h-10 px-4 bg-[#198754] hover:bg-[#146c43] text-white font-bold text-xs rounded-xl transition-colors"
            >
              <Plus className="size-3.5 mr-1.5" />
              <span>Submit New Protocol</span>
            </Link>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -bottom-10 w-72 h-72 bg-gradient-to-br from-[#198754]/10 to-transparent blur-2xl rounded-full"
        />
      </div>

      {/* Metric Counters Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        <div className="rounded-xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] p-4 sm:p-5 space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Total Submissions</span>
            <FileText className="size-4 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#002752] dark:text-white">
            16
          </div>
          <span className="text-[0.65rem] text-slate-500 dark:text-slate-400 block">
            Across 4 research programs
          </span>
        </div>

        <div className="rounded-xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] p-4 sm:p-5 space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>In Active Review</span>
            <Clock className="size-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
            3
          </div>
          <span className="text-[0.65rem] text-slate-500 dark:text-slate-400 block">
            Avg review velocity: 4.8 days
          </span>
        </div>

        <div className="rounded-xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] p-4 sm:p-5 space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Clearance Granted</span>
            <CheckCircle2 className="size-4 text-[#198754]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#198754]">
            12
          </div>
          <span className="text-[0.65rem] text-slate-500 dark:text-slate-400 block">
            Cryptographically sealed certificates
          </span>
        </div>

        <div className="rounded-xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] p-4 sm:p-5 space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Revisions Due</span>
            <AlertCircle className="size-4 text-rose-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400">
            1
          </div>
          <span className="text-[0.65rem] text-slate-500 dark:text-slate-400 block">
            Deadline in 8 calendar days
          </span>
        </div>

      </div>

      {/* Protocols Section with Filters */}
      <div className="rounded-2xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] overflow-hidden" id="protocols">
        
        {/* Table Header & Tabs */}
        <div className="p-4 sm:p-6 border-b border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#002752] dark:text-white uppercase tracking-tight">
              My Protocol Dossiers
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Real-time multi-stage governance tracking from initial screening to digital clearance certificate
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                filter === "all"
                  ? "bg-white dark:bg-card text-slate-900 dark:text-white shadow-2xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              All ({sampleProtocols.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("review")}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                filter === "review"
                  ? "bg-white dark:bg-card text-slate-900 dark:text-white shadow-2xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              In Review
            </button>
            <button
              type="button"
              onClick={() => setFilter("approved")}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                filter === "approved"
                  ? "bg-white dark:bg-card text-slate-900 dark:text-white shadow-2xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Approved
            </button>
            <button
              type="button"
              onClick={() => setFilter("revision")}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                filter === "revision"
                  ? "bg-white dark:bg-card text-slate-900 dark:text-white shadow-2xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Revisions
            </button>
          </div>
        </div>

        {/* Protocols List Items */}
        <div className="divide-y divide-slate-200/70 dark:divide-slate-800">
          {filtered.map((protocol) => (
            <div
              key={protocol.id}
              className="p-4 sm:p-6 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#002752]/10 dark:bg-white/10 text-[#002752] dark:text-sky-300">
                    {protocol.id}
                  </span>
                  
                  {/* Status Badge */}
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                      protocol.statusColor === "emerald"
                        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                        : protocol.statusColor === "amber"
                          ? "bg-amber-500/10 text-amber-800 dark:text-amber-400 border-amber-500/30"
                          : "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30"
                    }`}
                  >
                    {protocol.status}
                  </span>

                  {/* Risk Badge */}
                  <span className="text-[0.65rem] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {protocol.risk}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {protocol.title}
                </h3>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Building2 className="size-3.5" />
                    {protocol.department}
                  </span>
                  <span>•</span>
                  <span>Board: {protocol.board}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3.5" />
                    Submitted {protocol.submissionDate}
                  </span>
                </div>
              </div>

              {/* Protocol Action Buttons */}
              <div className="flex items-center gap-2.5 shrink-0 pt-2 lg:pt-0">
                {protocol.hasCertificate ? (
                  <Link
                    href="/#certificate"
                    className="inline-flex items-center h-8 px-3 text-xs font-bold bg-[#198754] hover:bg-[#146c43] text-white rounded-lg gap-1.5 transition-colors"
                  >
                    <Download className="size-3.5" />
                    <span>Certificate PDF</span>
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="inline-flex items-center h-8 px-3 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <span>Inspect Stages</span>
                    <ChevronRight className="size-3.5 ml-1" />
                  </button>
                )}

                <Link
                  href="/#preview"
                  className="size-8 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Open Protocol Inspector"
                >
                  <ExternalLink className="size-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Institutional Support & Integrity Banner */}
      <div className="p-4 sm:p-6 rounded-2xl border border-[#198754]/30 bg-[#198754]/5 dark:bg-[#198754]/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="size-10 rounded-xl bg-[#198754] text-white flex items-center justify-center shrink-0">
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

    </div>
  )
}
