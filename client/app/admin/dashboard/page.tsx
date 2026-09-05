"use client"

import * as React from "react"
import {
  Users,
  ScrollText,
  Building2,
  CheckCircle2,
  Lock,
  ArrowUpRight,
  Database,
  Search,
  ShieldCheck,
  Settings,
  Key,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { KpiCard, KpiGrid } from "@/components/ui/kpi-card"

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
      {/* Centralized Institutional Metrics Grid */}
      <KpiGrid columns={4}>
        <KpiCard
          label="Total Institution Protocols"
          value={248}
          description="Across 14 academic faculties"
          icon={Building2}
          color="navy"
        />
        <KpiCard
          label="Clearance Compliance"
          value="100%"
          description="Zero unresolved ethical non-conformities"
          icon={CheckCircle2}
          color="green"
        />
        <KpiCard
          label="Cryptographic Seals"
          value={184}
          description="SHA-256 certificate hashes verified"
          icon={Lock}
          color="amber"
        />
        <KpiCard
          label="Mean Review Velocity"
          value="5.2 Days"
          description="72% acceleration vs manual paper IRB"
          icon={ArrowUpRight}
          color="sky"
        />
      </KpiGrid>

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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none z-10" />
            <Input
              type="text"
              placeholder="Filter members or roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-8 pl-8 pr-3 text-xs bg-slate-50 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800"
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

      {/* ── Section: Certificate Authority ─────────────────────────────────── */}
      <div id="authority" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-[#002752] dark:text-white uppercase tracking-tight flex items-center gap-2">
              <ShieldCheck className="size-5 text-[#002752] dark:text-sky-300" />
              <span>Institutional Certificate Authority & Cryptographic HSM</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              FIPS 140-3 Level 3 Hardware Security Module root-of-trust for tamper-proof ethical clearance issuance
            </p>
          </div>
          <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25 font-mono text-xs font-bold flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Root CA Online</span>
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 rounded-xl border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
              <span>HSM Node Appliance</span>
              <Key className="size-3.5 text-amber-500" />
            </div>
            <p className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
              ETHICA-HSM-PRIMARY-01
            </p>
            <p className="text-[11px] text-slate-500">
              Ed25519 & SHA-256 digital signature appliance in secure vault.
            </p>
          </Card>

          <Card className="p-4 rounded-xl border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
              <span>Public Key Fingerprint</span>
              <Lock className="size-3.5 text-sky-500" />
            </div>
            <p className="font-mono text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">
              SHA256:7a4f91e8c045b8...92df
            </p>
            <p className="text-[11px] text-slate-500">
              Root institutional anchor published on public transparency ledger.
            </p>
          </Card>

          <Card className="p-4 rounded-xl border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
              <span>Next Key Rotation</span>
              <CheckCircle2 className="size-3.5 text-emerald-500" />
            </div>
            <p className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
              In 318 Calendar Days
            </p>
            <p className="text-[11px] text-slate-500">
              Automated dual-custody key ceremony compliant with ISO 27001.
            </p>
          </Card>
        </div>
      </div>

      {/* ── Section: Policy Engine Configuration ───────────────────────────── */}
      <div id="policies" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-[#002752] dark:text-white uppercase tracking-tight flex items-center gap-2">
              <Settings className="size-5 text-[#002752] dark:text-sky-300" />
              <span>Institutional Research Policy Engine Config</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configurable compliance thresholds and automated review workflows
            </p>
          </div>
          <Badge variant="outline" className="text-xs font-mono text-slate-500">
            Engine Version 2026.4
          </Badge>
        </div>

        <Card className="p-5 rounded-xl border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-slate-200/70 dark:border-slate-800 space-y-1">
              <span className="text-slate-400 uppercase font-bold text-[10px] block">IRB Quorum Threshold</span>
              <strong className="text-sm font-black text-slate-900 dark:text-white block">5 Voting Members</strong>
              <span className="text-slate-500 text-[11px] block">Includes at least 1 non-scientific lay member</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-slate-200/70 dark:border-slate-800 space-y-1">
              <span className="text-slate-400 uppercase font-bold text-[10px] block">Fast-Track Turnaround Target</span>
              <strong className="text-sm font-black text-slate-900 dark:text-white block">3 Working Days</strong>
              <span className="text-slate-500 text-[11px] block">Single designated reviewer triage</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-slate-200/70 dark:border-slate-800 space-y-1">
              <span className="text-slate-400 uppercase font-bold text-[10px] block">Full Committee Cycle</span>
              <strong className="text-sm font-black text-slate-900 dark:text-white block">14 Calendar Days</strong>
              <span className="text-slate-500 text-[11px] block">Consensus or majority quorum vote</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-slate-200/70 dark:border-slate-800 space-y-1">
              <span className="text-slate-400 uppercase font-bold text-[10px] block">Data Retention Mandate</span>
              <strong className="text-sm font-black text-slate-900 dark:text-white block">7 Years Post-Closure</strong>
              <span className="text-slate-500 text-[11px] block">Encrypted cold archive storage</span>
            </div>
          </div>
        </Card>
      </div>

    </div>
  )
}
