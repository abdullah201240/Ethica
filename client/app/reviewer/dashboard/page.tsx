"use client"

import * as React from "react"
import Link from "next/link"
import {
  Scale,
  Clock,
  CheckCircle2,
  Calendar,
  ExternalLink,
  Vote,
  MessageSquare,
  Sparkles,
  FileSearch,
  Users,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { KpiCard, KpiGrid } from "@/components/ui/kpi-card"
import { toast } from "@/components/ui/sonner"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"

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
    toast.success("Institutional Quorum Ballot Sealed", {
      description: `Official Quorum Vote "${decision}" successfully registered and sealed for protocol ${protocolId}. The vote is cryptographically logged into the DIU IRB committee register.`,
    })
  }

  return (
    <div className="space-y-6 sm:space-y-8">
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

      {/* Deliberation Queue Section (Consensus & Triage) */}
      <div id="consensus" className="rounded-2xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] overflow-hidden">
        
        <div className="p-4 sm:p-6 border-b border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div id="triage">
            <h2 className="text-lg sm:text-xl font-black text-[#002752] dark:text-white uppercase tracking-tight flex items-center gap-2">
              <FileSearch className="size-5 text-[#002752] dark:text-sky-300" />
              <span>Active Deliberation & Voting Queue</span>
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

                {/* Reviewer Action Buttons with Institutional Confirmation AlertDialog */}
                <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0">
                  {hasVoted ? (
                    <div
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold ${
                        hasVoted === "Approved"
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25"
                          : hasVoted === "Rejected"
                          ? "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/25"
                          : "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/25"
                      }`}
                    >
                      {hasVoted === "Approved" ? (
                        <CheckCircle2 className="size-3.5" />
                      ) : hasVoted === "Rejected" ? (
                        <XCircle className="size-3.5" />
                      ) : (
                        <Clock className="size-3.5" />
                      )}
                      <span>Vote Recorded: {hasVoted}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <AlertDialog>
                        <AlertDialogTrigger render={
                          <Button
                            type="button"
                            size="sm"
                            className="h-8 px-3 text-xs font-bold rounded-lg bg-[#198754] hover:bg-[#146c43] text-white cursor-pointer"
                          >
                            Approve
                          </Button>
                        } />
                        <AlertDialogContent className="sm:max-w-md">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-base sm:text-lg font-bold text-[#002752] dark:text-white">
                              Confirm Protocol Approval Vote
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                              You are casting an official &ldquo;Approved&rdquo; vote on docket item{" "}
                              <strong className="text-slate-900 dark:text-white">{protocol.id}</strong> (&ldquo;{protocol.title}&rdquo;).
                              This affirms that participant consent safeguards, data confidentiality, and risk mitigation comply with DIU IRB Standards.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="text-xs font-semibold">Review Further</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleVote(protocol.id, "Approved")}
                              className="bg-[#198754] hover:bg-[#146c43] text-white text-xs font-bold"
                            >
                              Seal Approval Vote
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <AlertDialog>
                        <AlertDialogTrigger render={
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 px-3 text-xs font-bold rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-800 dark:text-amber-300 border-amber-400/30 cursor-pointer"
                          >
                            Request Revision
                          </Button>
                        } />
                        <AlertDialogContent className="sm:max-w-md">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-base sm:text-lg font-bold text-[#002752] dark:text-white">
                              Issue Protocol Modification Notice
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                              You are requesting revisions for docket item{" "}
                              <strong className="text-slate-900 dark:text-white">{protocol.id}</strong>.
                              The Principal Investigator (<strong className="text-slate-900 dark:text-white">{protocol.pi}</strong>) will be required to submit revised methodologies and participant consent documentation before final quorum certification.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="text-xs font-semibold">Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleVote(protocol.id, "Revision")}
                              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold"
                            >
                              Submit Revision Order
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <AlertDialog>
                        <AlertDialogTrigger render={
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 px-2.5 text-xs font-bold rounded-lg border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                          >
                            Reject
                          </Button>
                        } />
                        <AlertDialogContent className="sm:max-w-md">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-base sm:text-lg font-bold text-[#002752] dark:text-white">
                              Confirm Protocol Disapproval / Rejection
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                              You are casting an official &ldquo;Rejected&rdquo; vote on docket item{" "}
                              <strong className="text-slate-900 dark:text-white">{protocol.id}</strong> (&ldquo;{protocol.title}&rdquo;).
                              This records a critical ethical non-compliance determination that halts protocol progression.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="text-xs font-semibold">Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleVote(protocol.id, "Rejected")}
                              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
                            >
                              Seal Rejection Vote
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}

                  <Link
                    href="/#preview"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="size-8 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Open Full Protocol Inspector in New Tab"
                  >
                    <ExternalLink className="size-3.5" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

      </div>

      {/* Next Scheduled IRB Meeting Card (Calendar / Quorum) */}
      <div className="p-4 sm:p-6 rounded-2xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] flex flex-col md:flex-row items-center justify-between gap-4" id="calendar">
        <div className="flex items-center gap-3.5" id="convene">
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

      {/* ── Section: Committee Roster & Member Standings ─────────────────── */}
      <div id="roster" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-[#002752] dark:text-white uppercase tracking-tight flex items-center gap-2">
              <Users className="size-5 text-[#002752] dark:text-sky-300" />
              <span>Institutional Review Board Committee Roster</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Active voting members accredited under DIU Biomedical & Clinical Ethics Secretariat
            </p>
          </div>
          <Badge className="bg-[#002752]/10 text-[#002752] dark:text-sky-300 border-[#002752]/20 font-mono text-xs font-bold">
            Quorum: 5 of 5 Present
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 rounded-xl border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-[10px] font-mono text-emerald-600 border-emerald-500/30">
                Chairperson
              </Badge>
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Prof. Charles Montgomery</h4>
            <p className="text-[11px] text-slate-500">Biomedical Ethics & Clinical Trials</p>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-mono">
              Attendance: 100% (24 Sessions)
            </div>
          </Card>

          <Card className="p-4 rounded-xl border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-[10px] font-mono text-[#002752] border-[#002752]/30">
                Vice Chair
              </Badge>
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Dr. Sarah Jenkins</h4>
            <p className="text-[11px] text-slate-500">Pediatrics & Vulnerable Populations</p>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-mono">
              Attendance: 96% (23 Sessions)
            </div>
          </Card>

          <Card className="p-4 rounded-xl border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-[10px] font-mono text-slate-600 border-slate-300">
                Lay Member
              </Badge>
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Advocate Rafiqul Haque</h4>
            <p className="text-[11px] text-slate-500">Legal Counsel & Human Rights</p>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-mono">
              Attendance: 92% (22 Sessions)
            </div>
          </Card>

          <Card className="p-4 rounded-xl border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-[10px] font-mono text-purple-600 border-purple-300">
                Bioethicist
              </Badge>
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Dr. Tahmina Akter</h4>
            <p className="text-[11px] text-slate-500">Data Privacy & Genetic Research</p>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-mono">
              Attendance: 96% (23 Sessions)
            </div>
          </Card>
        </div>
      </div>

    </div>
  )
}
