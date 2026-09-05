"use client"

import * as React from "react"
import Link from "next/link"
import {
  Scale,
  Clock,
  CheckCircle2,
  Users,
  Calendar,
  ExternalLink,
  Vote,
  MessageSquare,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { KpiCard, KpiGrid } from "@/components/ui/kpi-card"

const deliberationProtocols = [
  {
    id: "ETH-2026-092",
    title: "Randomized Controlled Trial of Pediatric Cognitive Behavioral Teletherapy",
    pi: "Dr. Ayesha Rahman",
    board: "Biomedical & Clinical IRB",
    risk: "Greater Than Minimal",
    status: "Urgent Quorum Vote",
    statusColor: "rose",
    quorumVotes: "3 of 5 Voted",
    votesPercent: 60,
    deadline: "Tomorrow, 4:00 PM",
  },
  {
    id: "ETH-2026-089",
    title: "Longitudinal AI-Assisted Clinical Biomarker Analysis in Type 2 Diabetes",
    pi: "Dr. Elena Rostova",
    board: "Biomedical & Clinical IRB",
    risk: "Minimal Risk",
    status: "Deliberation Open",
    statusColor: "amber",
    quorumVotes: "4 of 5 Voted",
    votesPercent: 80,
    deadline: "In 3 Days",
  },
  {
    id: "ETH-2026-085",
    title: "Survey of Stress Biomarkers Among Medical Residents During Night Shifts",
    pi: "Prof. Tariqul Islam",
    board: "Social & Behavioral Board",
    status: "Expedited Triage",
    statusColor: "blue",
    quorumVotes: "Single Reviewer Assigned",
    votesPercent: 100,
    deadline: "In 5 Days",
  },
  {
    id: "ETH-2026-081",
    title: "Cross-Institutional Genomic Data Exchange for Rare Childhood Disorders",
    pi: "Dr. Susan Lin",
    board: "Biomedical & Clinical IRB",
    risk: "Greater Than Minimal",
    status: "Consensus Reached",
    statusColor: "emerald",
    quorumVotes: "5 of 5 Approved",
    votesPercent: 100,
    deadline: "Clearance Pending",
  },
]

export default function ReviewerDashboardPage() {
  const [votedMap, setVotedMap] = React.useState<Record<string, string>>({})

  const handleVote = (protocolId: string, decision: string) => {
    setVotedMap((prev) => ({ ...prev, [protocolId]: decision }))
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* Reviewer Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] p-6 sm:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E0C23C]/15 text-[#b09214] dark:text-[#E0C23C] text-xs font-bold border border-[#E0C23C]/30">
              <Scale className="size-3.5" />
              <span>IRB Deliberation Chamber Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#002752] dark:text-white tracking-tight uppercase">
              Ethical Review Deliberation Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
              Welcome, <strong className="text-slate-900 dark:text-white">Prof. Charles Montgomery</strong>. 2 protocols require your casting vote to establish institutional quorum before the Friday deadline.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/#stakeholders"
              className="inline-flex items-center h-10 px-4 bg-[#002752] hover:bg-[#001c3d] text-white font-bold text-xs rounded-xl transition-colors"
            >
              <Users className="size-3.5 text-amber-400 mr-1.5" />
              <span>View Committee Roster</span>
            </Link>
            <Link
              href="#convene"
              className="inline-flex items-center h-10 px-4 bg-[#198754] hover:bg-[#146c43] text-white font-bold text-xs rounded-xl transition-colors"
            >
              <Calendar className="size-3.5 mr-1.5" />
              <span>Convene Board Meeting</span>
            </Link>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -bottom-10 w-72 h-72 bg-gradient-to-br from-[#E0C23C]/10 to-transparent blur-2xl rounded-full"
        />
      </div>

      {/* Centralized Review Metrics Counters */}
      <KpiGrid columns={4}>
        <KpiCard
          label="Pending Deliberation"
          value={5}
          description="2 protocols need quorum tie-break"
          icon={Clock}
          color="rose"
        />
        <KpiCard
          label="Quorum Participation"
          value="96.4%"
          description="Institutional target: >90%"
          icon={Vote}
          color="green"
        />
        <KpiCard
          label="Expedited Approvals"
          value={28}
          description="Avg turnaround: 3.2 days"
          icon={CheckCircle2}
          color="navy"
        />
        <KpiCard
          label="Consensus Reached"
          value={41}
          description="Zero appeals lodged this term"
          icon={Scale}
          color="gold"
        />
      </KpiGrid>

      {/* Deliberation Queue Section */}
      <div className="rounded-2xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] overflow-hidden">
        
        <div className="p-4 sm:p-6 border-b border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#002752] dark:text-white uppercase tracking-tight">
              Active Deliberation & Voting Queue
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Review full protocol methodology, examine informed consent forms, and record official committee vote
            </p>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-500/20">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Quorum Ledger Synchronized</span>
          </span>
        </div>

        {/* Protocols Voting List */}
        <div className="divide-y divide-slate-200/70 dark:divide-slate-800">
          {deliberationProtocols.map((protocol) => {
            const hasVoted = votedMap[protocol.id]

            return (
              <div
                key={protocol.id}
                className="p-4 sm:p-6 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#002752]/10 dark:bg-white/10 text-[#002752] dark:text-sky-300">
                      {protocol.id}
                    </span>

                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                        protocol.statusColor === "rose"
                          ? "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30"
                          : protocol.statusColor === "amber"
                            ? "bg-amber-500/10 text-amber-800 dark:text-amber-400 border-amber-500/30"
                            : protocol.statusColor === "blue"
                              ? "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/30"
                              : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                      }`}
                    >
                      {protocol.status}
                    </span>

                    {protocol.risk && (
                      <span className="text-[0.65rem] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {protocol.risk}
                      </span>
                    )}

                    <span className="text-[0.65rem] font-mono text-slate-500 dark:text-slate-400">
                      Deadline: {protocol.deadline}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {protocol.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                    <span>Lead Investigator: <strong className="text-slate-700 dark:text-slate-300">{protocol.pi}</strong></span>
                    <span>•</span>
                    <span>Board: {protocol.board}</span>
                    <span>•</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                      Quorum Status: {protocol.quorumVotes}
                    </span>
                  </div>
                </div>

                {/* Reviewer Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0">
                  {hasVoted ? (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25 text-xs font-bold">
                      <CheckCircle2 className="size-3.5" />
                      <span>Vote Recorded: {hasVoted}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleVote(protocol.id, "Approved")}
                        className="h-8 px-3 text-xs font-bold rounded-lg bg-[#198754] hover:bg-[#146c43] text-white cursor-pointer"
                      >
                        Approve
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleVote(protocol.id, "Revision")}
                        className="h-8 px-3 text-xs font-bold rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-800 dark:text-amber-300 border-amber-400/30 cursor-pointer"
                      >
                        Request Revision
                      </Button>
                    </div>
                  )}

                  <Link
                    href="/#preview"
                    className="size-8 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Open Full Protocol Inspector"
                  >
                    <ExternalLink className="size-3.5" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

      </div>

      {/* Next Scheduled IRB Meeting Card */}
      <div className="p-4 sm:p-6 rounded-2xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] flex flex-col md:flex-row items-center justify-between gap-4" id="convene">
        <div className="flex items-center gap-3.5">
          <div className="size-10 rounded-xl bg-[#002752] text-[#E0C23C] flex items-center justify-center shrink-0">
            <Calendar className="size-5" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-[#002752] dark:text-white">
              Next Scheduled IRB Plenary Session
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Thursday, 10:00 AM • Senate Hall Conference Room B & Secure Institutional Teleconference
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            className="h-9 px-3.5 text-xs font-bold rounded-xl border-slate-200 dark:border-slate-800"
          >
            <MessageSquare className="size-3.5 mr-1.5" />
            Agenda Dossier
          </Button>
          <Button
            className="h-9 px-3.5 text-xs font-bold rounded-xl bg-[#002752] text-white hover:bg-[#001c3d]"
          >
            <Sparkles className="size-3.5 text-[#E0C23C] mr-1.5" />
            Launch Virtual Chamber
          </Button>
        </div>
      </div>

    </div>
  )
}
