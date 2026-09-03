"use client"

import * as React from "react"
import Link from "next/link"
import {
  Sliders,
  Users,
  ScrollText,
  ShieldCheck,
  Download,
  Building2,
  CheckCircle2,
  Lock,
  ArrowUpRight,
  Database,
  Search,
} from "lucide-react"

const auditLedgerLogs = [
  {
    txId: "TX-9942-A",
    action: "Digital Clearance Certificate Sealed",
    actor: "IRB Secretariat (Automated HSM)",
    protocol: "ETH-2026-074",
    hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    timestamp: "12 mins ago",
    status: "Immutable Block Confirmed",
  },
  {
    txId: "TX-9941-F",
    action: "Quorum Consensus Vote Recorded",
    actor: "Prof. Charles Montgomery (IRB Chair)",
    protocol: "ETH-2026-089",
    hash: "7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
    timestamp: "46 mins ago",
    status: "Immutable Block Confirmed",
  },
  {
    txId: "TX-9940-C",
    action: "Informed Consent Revision Submitted",
    actor: "Dr. Elena Rostova (PI)",
    protocol: "ETH-2026-042",
    hash: "a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e",
    timestamp: "2 hours ago",
    status: "Immutable Block Confirmed",
  },
  {
    txId: "TX-9939-E",
    action: "Initial Screening Triage Cleared",
    actor: "Officer Nusrat Jahan (Screening Lead)",
    protocol: "ETH-2026-092",
    hash: "2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae",
    timestamp: "4 hours ago",
    status: "Immutable Block Confirmed",
  },
]

const memberRoster = [
  {
    name: "Dr. Elena Rostova",
    role: "Principal Investigator",
    department: "Public Health & Clinical Epidemiology",
    status: "Active",
    protocols: 4,
    email: "elena.rostova@diu.edu.bd",
  },
  {
    name: "Prof. Charles Montgomery",
    role: "IRB Committee Chair",
    department: "Biomedical Research Ethics Board",
    status: "Active",
    protocols: 18,
    email: "charles.montgomery@diu.edu.bd",
  },
  {
    name: "Dr. Ayesha Rahman",
    role: "Co-Investigator",
    department: "Pediatrics & Behavioral Health",
    status: "Active",
    protocols: 2,
    email: "ayesha.rahman@diu.edu.bd",
  },
  {
    name: "Nusrat Jahan, M.Sc.",
    role: "Screening Triage Officer",
    department: "Research Compliance Secretariat",
    status: "Active",
    protocols: 31,
    email: "nusrat.jahan@diu.edu.bd",
  },
]

export default function AdminDashboardPage() {
  const [searchTerm, setSearchTerm] = React.useState("")

  const filteredMembers = memberRoster.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* Admin Governance Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] p-6 sm:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#002752]/10 text-[#002752] dark:text-sky-300 text-xs font-bold border border-[#002752]/20 dark:border-sky-500/20">
              <Sliders className="size-3.5" />
              <span>Institutional Research Ethics Secretariat</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#002752] dark:text-white tracking-tight uppercase">
              System Governance & Audit Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
              Welcome, <strong className="text-slate-900 dark:text-white">Dr. Marcus Vance</strong>. Institutional ethics quorum rate is operating at <span className="text-[#198754] font-bold">96.4%</span> across all 14 university research divisions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/#certificate"
              className="inline-flex items-center h-10 px-4 bg-[#002752] hover:bg-[#001c3d] text-white font-bold text-xs rounded-xl transition-colors"
            >
              <ShieldCheck className="size-3.5 text-[#198754] mr-1.5" />
              <span>Inspect Certificate Authority</span>
            </Link>
            <Link
              href="#export"
              className="inline-flex items-center h-10 px-4 bg-[#198754] hover:bg-[#146c43] text-white font-bold text-xs rounded-xl transition-colors"
            >
              <Download className="size-3.5 mr-1.5" />
              <span>Export Ledger Audit Report</span>
            </Link>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -bottom-10 w-72 h-72 bg-gradient-to-br from-[#002752]/10 dark:from-sky-500/10 to-transparent blur-2xl rounded-full"
        />
      </div>

      {/* Institutional Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        <div className="rounded-xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] p-4 sm:p-5 space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Total Institution Protocols</span>
            <Building2 className="size-4 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#002752] dark:text-white">
            248
          </div>
          <span className="text-[0.65rem] text-slate-500 dark:text-slate-400 block">
            Across 14 academic faculties
          </span>
        </div>

        <div className="rounded-xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] p-4 sm:p-5 space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Clearance Compliance</span>
            <CheckCircle2 className="size-4 text-[#198754]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#198754]">
            100%
          </div>
          <span className="text-[0.65rem] text-slate-500 dark:text-slate-400 block">
            Zero unresolved ethical non-conformities
          </span>
        </div>

        <div className="rounded-xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] p-4 sm:p-5 space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Cryptographic Seals</span>
            <Lock className="size-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
            184
          </div>
          <span className="text-[0.65rem] text-slate-500 dark:text-slate-400 block">
            SHA-256 certificate hashes verified
          </span>
        </div>

        <div className="rounded-xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] p-4 sm:p-5 space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Mean Review Velocity</span>
            <ArrowUpRight className="size-4 text-sky-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-sky-600 dark:text-sky-400">
            5.2 Days
          </div>
          <span className="text-[0.65rem] text-slate-500 dark:text-slate-400 block">
            72% acceleration vs manual paper IRB
          </span>
        </div>

      </div>

      {/* Cryptographic Audit Trail Section */}
      <div className="rounded-2xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] overflow-hidden" id="audit">
        
        <div className="p-4 sm:p-6 border-b border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#002752] dark:text-white uppercase tracking-tight flex items-center gap-2">
              <ScrollText className="size-5 text-[#198754]" />
              Cryptographic Audit Trail (SHA-256 Ledger)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Every protocol triage, reviewer deliberation, consensus vote, and certificate issuance is immutably timestamped
            </p>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-500/20 self-start sm:self-auto">
            <Database className="size-3.5" />
            <span>FIPS 140-3 HSM Root of Trust</span>
          </span>
        </div>

        {/* Ledger Entries */}
        <div className="divide-y divide-slate-200/70 dark:divide-slate-800">
          {auditLedgerLogs.map((log) => (
            <div
              key={log.txId}
              className="p-4 sm:p-6 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[0.7rem] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {log.txId}
                  </span>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#002752]/10 dark:bg-white/10 text-[#002752] dark:text-sky-300">
                    {log.protocol}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="size-3.5" />
                    {log.status}
                  </span>
                  <span className="text-[0.65rem] text-slate-500 dark:text-slate-400">
                    {log.timestamp}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {log.action} • <span className="text-slate-500 dark:text-slate-400 font-normal">{log.actor}</span>
                </h3>

                <div className="font-mono text-[0.65rem] text-slate-500 dark:text-slate-400 break-all bg-slate-50 dark:bg-slate-900/60 p-2 rounded border border-slate-200/70 dark:border-slate-800/80">
                  <span className="text-slate-400">HASH: </span>
                  {log.hash}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Institutional Member Directory */}
      <div className="rounded-2xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] overflow-hidden" id="roster">
        
        <div className="p-4 sm:p-6 border-b border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#002752] dark:text-white uppercase tracking-tight flex items-center gap-2">
              <Users className="size-5 text-[#002752] dark:text-sky-400" />
              Institutional Ethics Directory & Roles
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Role-Based Access Control (RBAC) governance for investigators, committee members, and screening triage leads
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Filter members or roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-8 pl-8 pr-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002752] dark:focus-visible:ring-sky-500"
            />
          </div>
        </div>

        <div className="divide-y divide-slate-200/70 dark:divide-slate-800">
          {filteredMembers.map((member) => (
            <div
              key={member.email}
              className="p-4 sm:p-5 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {member.name}
                  </span>
                  <span className="text-[0.65rem] font-bold px-2 py-0.5 rounded-full bg-[#002752]/10 dark:bg-sky-500/10 text-[#002752] dark:text-sky-300">
                    {member.role}
                  </span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <span>{member.department}</span>
                  <span>•</span>
                  <span>{member.email}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <span>{member.protocols} Assigned Protocols</span>
                <span className="size-2 rounded-full bg-emerald-500" title="Active Account" />
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  )
}
