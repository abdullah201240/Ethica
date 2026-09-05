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
import { DashboardContainer } from "@/components/dashboard/dashboard-container"
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
    <DashboardContainer>
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
      <div id="consensus" className="rounded-none sm:rounded-2xl border-y sm:border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] overflow-hidden">
        
        <div className="p-4 sm:p-6 border-b border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div id="triage">
            <h2 className="text-section-heading text-primary dark:text-white uppercase tracking-tight flex items-center gap-2">
              <FileSearch className="size-5 text-primary dark:text-sky-300" />
              <span>Active Deliberation & Voting Queue</span>
            </h2>
            <p className="text-micro text-muted-foreground font-medium">
              Review full protocol methodology, examine informed consent forms, and record official committee vote
            </p>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-micro font-bold border border-emerald-500/20">
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
                    <span className="font-mono text-micro font-bold px-2 py-0.5 rounded bg-primary/10 dark:bg-white/10 text-primary dark:text-sky-300">
                      {protocol.id}
                    </span>

                    <span
                      className={`text-micro font-bold px-2.5 py-0.5 rounded-full border ${
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
                      <span className="text-micro font-medium px-2 py-0.5 rounded bg-muted text-foreground/70">
                        {protocol.risk}
                      </span>
                    )}

                    <span className="text-micro font-mono text-muted-foreground">
                      Deadline: {protocol.deadline}
                    </span>
                  </div>

                  <h3 className="text-table-cell sm:text-card-title font-bold text-foreground leading-snug">
                    {protocol.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-micro text-muted-foreground">
                    <span>Lead Investigator: <strong className="text-foreground/85">{protocol.pi}</strong></span>
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
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-micro font-bold ${
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
                            className="h-8 px-3 text-micro font-bold rounded-lg bg-secondary hover:bg-[#146c43] text-white cursor-pointer"
                          >
                            Approve
                          </Button>
                        } />
                        <AlertDialogContent className="sm:max-w-md">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-card-title text-primary dark:text-white">
                              Confirm Protocol Approval Vote
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-body-sm text-foreground/70 leading-relaxed">
                              You are casting an official &ldquo;Approved&rdquo; vote on docket item{" "}
                              <strong className="text-foreground">{protocol.id}</strong> (&ldquo;{protocol.title}&rdquo;).
                              This affirms that participant consent safeguards, data confidentiality, and risk mitigation comply with DIU IRB Standards.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="text-micro font-semibold">Review Further</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleVote(protocol.id, "Approved")}
                              className="bg-secondary hover:bg-[#146c43] text-white text-micro font-bold"
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
                            className="h-8 px-3 text-micro font-bold rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-800 dark:text-amber-300 border-amber-400/30 cursor-pointer"
                          >
                            Request Revision
                          </Button>
                        } />
                        <AlertDialogContent className="sm:max-w-md">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-card-title text-primary dark:text-white">
                              Issue Protocol Modification Notice
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-body-sm text-foreground/70 leading-relaxed">
                              You are requesting revisions for docket item{" "}
                              <strong className="text-foreground">{protocol.id}</strong>.
                              The Principal Investigator (<strong className="text-foreground">{protocol.pi}</strong>) will be required to submit revised methodologies and participant consent documentation before final quorum certification.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="text-micro font-semibold">Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleVote(protocol.id, "Revision")}
                              className="bg-amber-600 hover:bg-amber-700 text-white text-micro font-bold"
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
                            className="h-8 px-2.5 text-micro font-bold rounded-lg border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                          >
                            Reject
                          </Button>
                        } />
                        <AlertDialogContent className="sm:max-w-md">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-card-title text-primary dark:text-white">
                              Confirm Protocol Disapproval / Rejection
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-body-sm text-foreground/70 leading-relaxed">
                              You are casting an official &ldquo;Rejected&rdquo; vote on docket item{" "}
                              <strong className="text-foreground">{protocol.id}</strong> (&ldquo;{protocol.title}&rdquo;).
                              This records a critical ethical non-compliance determination that halts protocol progression.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="text-micro font-semibold">Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleVote(protocol.id, "Rejected")}
                              className="bg-rose-600 hover:bg-rose-700 text-white text-micro font-bold"
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
                    className="size-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
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
      <div className="p-4 sm:p-6 rounded-none sm:rounded-2xl border-y sm:border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] flex flex-col md:flex-row items-center justify-between gap-4" id="calendar">
        <div className="flex items-center gap-3.5" id="convene">
          <div className="size-10 rounded-xl bg-primary text-accent flex items-center justify-center shrink-0">
            <Calendar className="size-5" />
          </div>
          <div>
            <h4 className="text-card-title text-primary dark:text-white">
              Next Scheduled IRB Plenary Session
            </h4>
            <p className="text-body-sm text-foreground/70">
              Thursday, 10:00 AM • Senate Hall Conference Room B & Secure Institutional Teleconference
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            className="h-9 px-3.5 text-micro font-bold rounded-xl border-border"
          >
            <MessageSquare className="size-3.5 mr-1.5" />
            Agenda Dossier
          </Button>
          <Button
            className="h-9 px-3.5 text-micro font-bold rounded-xl bg-primary text-white hover:bg-[#001c3d]"
          >
            <Sparkles className="size-3.5 text-accent mr-1.5" />
            Launch Virtual Chamber
          </Button>
        </div>
      </div>

      {/* ── Section: Committee Roster & Member Standings ─────────────────── */}
      <div id="roster" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-section-heading text-primary dark:text-white uppercase tracking-tight flex items-center gap-2">
              <Users className="size-5 text-primary dark:text-sky-300" />
              <span>Institutional Review Board Committee Roster</span>
            </h3>
            <p className="text-micro text-muted-foreground">
              Active voting members accredited under DIU Biomedical & Clinical Ethics Secretariat
            </p>
          </div>
          <Badge className="bg-primary/10 text-primary dark:text-sky-300 border-primary/20 font-mono text-micro font-bold">
            Quorum: 5 of 5 Present
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 rounded-xl border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-micro font-mono text-emerald-600 border-emerald-500/30">
                Chairperson
              </Badge>
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <h4 className="font-bold text-body-sm text-foreground">Prof. Charles Montgomery</h4>
            <p className="text-micro text-muted-foreground">Biomedical Ethics & Clinical Trials</p>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-micro text-muted-foreground font-mono">
              Attendance: 100% (24 Sessions)
            </div>
          </Card>

          <Card className="p-4 rounded-xl border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-micro font-mono text-primary border-primary/30">
                Vice Chair
              </Badge>
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <h4 className="font-bold text-body-sm text-foreground">Dr. Sarah Jenkins</h4>
            <p className="text-micro text-muted-foreground">Pediatrics & Vulnerable Populations</p>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-micro text-muted-foreground font-mono">
              Attendance: 96% (23 Sessions)
            </div>
          </Card>

          <Card className="p-4 rounded-xl border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-micro font-mono text-muted-foreground border-border">
                Lay Member
              </Badge>
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <h4 className="font-bold text-body-sm text-foreground">Advocate Rafiqul Haque</h4>
            <p className="text-micro text-muted-foreground">Legal Counsel & Human Rights</p>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-micro text-muted-foreground font-mono">
              Attendance: 92% (22 Sessions)
            </div>
          </Card>

          <Card className="p-4 rounded-xl border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-micro font-mono text-purple-600 border-purple-300">
                Bioethicist
              </Badge>
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <h4 className="font-bold text-body-sm text-foreground">Dr. Tahmina Akter</h4>
            <p className="text-micro text-muted-foreground">Data Privacy & Genetic Research</p>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-micro text-muted-foreground font-mono">
              Attendance: 96% (23 Sessions)
            </div>
          </Card>
        </div>
      </div>

    </DashboardContainer>
  )
}
