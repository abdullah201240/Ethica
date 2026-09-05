"use client"

import * as React from "react"
import {
  Sparkles,
  FileCheck2,
  FileCheck,
  Users2,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react"

const STEPS = [
  {
    step: "01",
    title: "Pre-Screening",
    tag: "Self-Check",
    description:
      "Interactive 3-minute diagnostic to determine whether formal IRB review, expedited review, or full exemption applies.",
    highlights: ["Dynamic risk diagnostic", "Instant exemption letter"],
    icon: Sparkles,
    theme: {
      pill: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
      container:
        "bg-gradient-to-b from-emerald-50/80 via-emerald-100/30 to-white dark:from-emerald-950/30 dark:to-card border-emerald-200/60 dark:border-emerald-800/40",
      iconColor: "text-secondary dark:text-emerald-400",
      glow: "from-emerald-400/20 to-teal-300/10",
      accentDot: "bg-[#198754]",
    },
  },
  {
    step: "02",
    title: "Proposal Depot",
    tag: "Filing Stage",
    description:
      "Structured multi-section protocol portal with secure file uploads, checksum validation, and supervisor digital sign-offs.",
    highlights: ["Guided protocol builder", "SHA-256 file checksums"],
    icon: FileCheck2,
    theme: {
      pill: "bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-500/20",
      container:
        "bg-gradient-to-b from-teal-50/80 via-teal-100/30 to-white dark:from-teal-950/30 dark:to-card border-teal-200/60 dark:border-teal-800/40",
      iconColor: "text-teal-600 dark:text-teal-400",
      glow: "from-teal-400/20 to-emerald-300/10",
      accentDot: "bg-teal-600",
    },
  },
  {
    step: "03",
    title: "Gatekeeper Triage",
    tag: "Audit Gate",
    description:
      "Administrative screening audits submissions for completeness, returning deficient files before committee convening.",
    highlights: ["Completeness audit", "Specialty board routing"],
    icon: FileCheck,
    theme: {
      pill: "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20",
      container:
        "bg-gradient-to-b from-sky-50/80 via-sky-100/30 to-white dark:from-sky-950/30 dark:to-card border-sky-200/60 dark:border-sky-800/40",
      iconColor: "text-sky-600 dark:text-sky-400",
      glow: "from-sky-400/20 to-cyan-300/10",
      accentDot: "bg-sky-600",
    },
  },
  {
    step: "04",
    title: "Committee Review",
    tag: "Deliberation",
    description:
      "Assigned reviewers evaluate ethical rubrics with threaded revision dialogues and immutable versioned diff histories.",
    highlights: ["Standardized rubrics", "Threaded revision loops"],
    icon: Users2,
    theme: {
      pill: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
      container:
        "bg-gradient-to-b from-blue-50/80 via-blue-100/30 to-white dark:from-blue-950/30 dark:to-card border-blue-200/60 dark:border-blue-800/40",
      iconColor: "text-blue-600 dark:text-blue-400",
      glow: "from-blue-400/20 to-indigo-300/10",
      accentDot: "bg-blue-600",
    },
  },
  {
    step: "05",
    title: "Clearance Award",
    tag: "Certified",
    description:
      "Upon approval, an official digital ethical clearance certificate is issued with cryptographic QR verification.",
    highlights: ["Cryptographic seal", "Global QR verification"],
    icon: ShieldCheck,
    theme: {
      pill: "bg-[#002752]/10 text-primary dark:text-sky-300 border-[#002752]/20",
      container:
        "bg-gradient-to-b from-slate-100/80 via-blue-100/30 to-white dark:from-slate-900/40 dark:to-card border-slate-300/70 dark:border-slate-700/60",
      iconColor: "text-primary dark:text-sky-400",
      glow: "from-blue-600/20 to-[#002752]/15",
      accentDot: "bg-[#002752]",
    },
  },
]

export function WorkflowSteps() {
  return (
    <section
      id="workflow"
      className="relative isolate py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-slate-50/60 via-white to-slate-50/40 dark:from-[#071321]/60 dark:via-background dark:to-[#071321]/40 overflow-hidden"
    >
      {/* Soft Ambient Background Luminous Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-16 left-1/2 -translate-x-1/2 w-[52rem] sm:w-[76rem] h-[28rem] bg-gradient-to-tr from-[#198754]/10 via-[#002752]/8 to-sky-100/25 blur-3xl rounded-full"
      />

      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 2xl:px-20 relative z-10">
        
        {/* Section Header with Giant Ghost Watermark Typography */}
        <div className="relative text-center mx-auto mb-14 sm:mb-20 w-full">
          
          {/* Giant Ghost Watermark Typography (Behind Header) */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[52%] font-sans font-black text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] xl:text-[13rem] uppercase tracking-[0.18em] text-primary/[0.038] dark:text-white/[0.03] select-none pointer-events-none whitespace-nowrap z-0 leading-none"
          >
            LIFECYCLE
          </div>

          {/* Foreground Title & Accent */}
          <div className="relative z-10 w-full">
            <h2 className="font-sans text-3xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-black tracking-tight text-primary dark:text-white leading-[1.05] uppercase">
              THE 5-STAGE RESEARCH ETHICS <br />
              <span className="bg-gradient-to-r from-[#198754] via-[#22c55e] to-[#0d9488] bg-clip-text text-transparent drop-shadow-2xs">
                GOVERNANCE LIFECYCLE
              </span>
            </h2>

            {/* Matching DIU Green Gradient Accent Line Bar */}
            <div className="w-24 sm:w-28 h-2 bg-gradient-to-r from-[#198754] via-[#22c55e] to-[#0d9488] rounded-full mx-auto my-5" />

            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium mx-auto">
              From initial self-screening to cryptographic clearance certification, Ethica enforces
              rigorous compliance, auditability, and speed at every phase.
            </p>
          </div>
        </div>

        {/* 5-Stage Connected Cards Grid - Full Width Edge-to-Edge */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 sm:gap-6 items-stretch">
          {STEPS.map((item, idx) => {
            const Icon = item.icon

            return (
              <div
                key={idx}
                className="group relative rounded-2xl sm:rounded-3xl border border-slate-200/85 dark:border-slate-800/80 bg-white dark:bg-card p-6 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Top Subtle Hover Glow */}
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute -top-10 -right-10 size-32 rounded-full bg-gradient-to-br ${item.theme.glow} blur-2xl group-hover:scale-125 transition-transform duration-500`}
                />

                {/* Card Top: Stage Number + Badge */}
                <div>
                  <div className="flex items-center justify-between pb-4">
                    <div className="flex items-center gap-2">
                      <span className={`size-2 rounded-full ${item.theme.accentDot}`} />
                      <span className="font-mono text-xs font-black text-muted-foreground tracking-wider">
                        STAGE {item.step}
                      </span>
                    </div>

                    <span
                      className={`text-micro font-bold py-0.5 px-2.5 rounded-full border ${item.theme.pill}`}
                    >
                      {item.tag}
                    </span>
                  </div>

                  {/* Center SVG Icon Visual */}
                  <div className="my-4 sm:my-5 flex items-center justify-center">
                    <div
                      className={`relative size-20 sm:size-24 rounded-2xl border flex items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-2xs ${item.theme.container}`}
                    >
                      {/* Ambient Halo */}
                      <div
                        aria-hidden="true"
                        className={`absolute inset-0 rounded-2xl bg-gradient-to-tr ${item.theme.glow} blur-lg`}
                      />

                      <Icon
                        strokeWidth={1.5}
                        className={`size-10 sm:size-11 relative z-10 transition-transform duration-300 group-hover:rotate-3 ${item.theme.iconColor}`}
                      />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="pt-2 text-center sm:text-left space-y-1.5">
                    <h3 className="text-base sm:text-lg font-black text-primary dark:text-white tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Card Bottom: Bullet Highlights */}
                <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  {item.highlights.map((feat, fIdx) => (
                    <div
                      key={fIdx}
                      className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300"
                    >
                      <CheckCircle2 className="size-3.5 text-secondary shrink-0" />
                      <span className="leading-tight font-medium">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
