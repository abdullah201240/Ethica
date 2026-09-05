"use client"

import { ShieldCheck, BookOpen, FileCheck, TrendingUp } from "lucide-react"

const METRICS = [
  {
    value: "72%",
    label: "Review Velocity Increase",
    tag: "14-Day Turnaround",
    description: "Average protocol turnaround drops from 45+ days to under 14 business days across institutions.",
    icon: TrendingUp,
    theme: {
      container: "bg-gradient-to-b from-emerald-50 via-emerald-100/40 to-white dark:from-emerald-950/30 dark:to-card border-emerald-200/60 dark:border-emerald-800/40",
      iconColor: "text-secondary dark:text-emerald-400",
      glow: "from-emerald-400/20 to-teal-300/10",
      badge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
    },
  },
  {
    value: "100%",
    label: "Audit & Version Traceability",
    tag: "Immutable Ledger",
    description: "Every reviewer remark, condition waiver, and document amendment is permanently archived.",
    icon: ShieldCheck,
    theme: {
      container: "bg-gradient-to-b from-slate-100 via-blue-100/40 to-white dark:from-slate-900/40 dark:to-card border-slate-300/70 dark:border-slate-700/60",
      iconColor: "text-primary dark:text-sky-400",
      glow: "from-blue-600/20 to-[#002752]/15",
      badge: "bg-[#002752]/10 text-primary dark:text-sky-300 border-[#002752]/20",
    },
  },
  {
    value: "0%",
    label: "Incomplete Docket Submissions",
    tag: "Deficiency Filter",
    description: "Gatekeeper screening automatically halts deficient submissions before board convening.",
    icon: FileCheck,
    theme: {
      container: "bg-gradient-to-b from-teal-50 via-teal-100/40 to-white dark:from-teal-950/30 dark:to-card border-teal-200/60 dark:border-teal-800/40",
      iconColor: "text-teal-600 dark:text-teal-400",
      glow: "from-teal-400/20 to-emerald-300/10",
      badge: "bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-500/20",
    },
  },
  {
    value: "14+",
    label: "Specialized Review Disciplines",
    tag: "Multi-Disciplinary",
    description: "Configurable institutional rubrics for clinical trials, behavioral studies, and AI ethics.",
    icon: BookOpen,
    theme: {
      container: "bg-gradient-to-b from-sky-50 via-sky-100/40 to-white dark:from-sky-950/30 dark:to-card border-sky-200/60 dark:border-sky-800/40",
      iconColor: "text-sky-600 dark:text-sky-400",
      glow: "from-sky-400/20 to-cyan-300/10",
      badge: "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20",
    },
  },
]

export function ImpactMetrics() {
  return (
    <section
      className="relative isolate py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-slate-50/40 via-white to-slate-50/60 dark:from-[#071321]/40 dark:via-background dark:to-[#071321]/60 overflow-hidden"
    >
      {/* Soft Ambient Background Luminous Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-16 left-1/2 -translate-x-1/2 w-[52rem] sm:w-[72rem] h-[26rem] bg-gradient-to-tr from-[#198754]/10 via-[#002752]/8 to-sky-100/25 blur-3xl rounded-full"
      />

      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 2xl:px-20 relative z-10">
        
        {/* Section Header with Giant Ghost Watermark Typography */}
        <div className="relative text-center mx-auto mb-14 sm:mb-20 w-full">
          
          {/* Giant Ghost Watermark Typography (Behind Header) */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[52%] font-sans font-black text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] xl:text-[13rem] uppercase tracking-[0.18em] text-primary/[0.038] dark:text-white/[0.03] select-none pointer-events-none whitespace-nowrap z-0 leading-none"
          >
            IMPACT
          </div>

          {/* Foreground Title & Accent */}
          <div className="relative z-10 w-full">
            <h2 className="font-sans text-3xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-black tracking-tight text-primary dark:text-white leading-[1.05] uppercase">
              MEASURABLE ACCELERATION IN <br />
              <span className="bg-gradient-to-r from-[#198754] via-[#22c55e] to-[#0d9488] bg-clip-text text-transparent drop-shadow-2xs">
                ACADEMIC GOVERNANCE
              </span>
            </h2>

            {/* Matching DIU Green Gradient Accent Line Bar */}
            <div className="w-24 sm:w-28 h-2 bg-gradient-to-r from-[#198754] via-[#22c55e] to-[#0d9488] rounded-full mx-auto my-5" />

            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium mx-auto">
              Universities and research hospitals trust Ethica to protect human participants
              while removing bureaucratic friction from high-impact scholarship.
            </p>
          </div>
        </div>

        {/* 4 Impact Metric Cards - Full Width Edge-to-Edge */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 items-stretch">
          {METRICS.map((item, idx) => {
            const Icon = item.icon

            return (
              <div
                key={idx}
                className="group relative rounded-2xl sm:rounded-3xl border border-slate-200/85 dark:border-slate-800/80 bg-white dark:bg-card p-6 sm:p-8 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Top Subtle Hover Glow */}
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute -top-10 -right-10 size-32 rounded-full bg-gradient-to-br ${item.theme.glow} blur-2xl group-hover:scale-125 transition-transform duration-500`}
                />

                {/* Card Top: Icon & Badge */}
                <div>
                  <div className="flex items-center justify-between pb-6">
                    <div
                      className={`size-13 sm:size-14 rounded-2xl border flex items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-2xs ${item.theme.container}`}
                    >
                      <Icon className={`size-6 sm:size-7 ${item.theme.iconColor}`} />
                    </div>

                    <span
                      className={`text-micro font-bold py-0.5 px-2.5 rounded-full border ${item.theme.badge}`}
                    >
                      {item.tag}
                    </span>
                  </div>

                  {/* Giant Stat Value */}
                  <div className="space-y-2">
                    <span className="font-sans text-5xl sm:text-6xl font-black text-primary dark:text-white tracking-tight tabular-nums block">
                      {item.value}
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-primary dark:text-white">
                      {item.label}
                    </h3>
                  </div>
                </div>

                {/* Card Bottom: Description */}
                <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
