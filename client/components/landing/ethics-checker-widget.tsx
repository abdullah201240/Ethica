"use client"

import * as React from "react"
import {
  CheckCircle2,
  Scale,
  Shield,
  Lock,
  ArrowRight,
  Clock,
  Sparkles,
  Award,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const TIERS = [
  {
    tierNumber: "Tier 0",
    tierName: "Exempt",
    badgeIcon: CheckCircle2,
    badgeColor: "bg-[#198754] text-white",
    riskTitle: "Minimal Risk",
    riskDescription: "No further review needed for qualified studies.",
    processingTime: "1-3 Business Days",
    criteria: [
      "Non-identifiable secondary data",
      "Surveys, interviews & focus groups",
      "Standard educational tests & curricula",
    ],
    ctaText: "Check Exemption Eligibility",
    ctaVariant: "default",
    iconTheme: {
      container: "bg-gradient-to-b from-emerald-50 via-emerald-100/50 to-emerald-50/20 dark:from-emerald-950/40 dark:to-emerald-900/10 border-emerald-200/60 dark:border-emerald-800/40 shadow-emerald-500/10",
      glow: "from-emerald-400/20 to-teal-300/10",
      primaryIcon: Award,
      primaryColor: "text-secondary dark:text-emerald-400",
      secondaryIcon: CheckCircle2,
      secondaryColor: "text-emerald-600 dark:text-emerald-300",
    },
  },
  {
    tierNumber: "Tier 1",
    tierName: "Expedited",
    badgeIcon: Scale,
    badgeColor: "bg-teal-600 text-white",
    riskTitle: "Minor Risk",
    riskDescription: "Review conducted by a single appointed subcommittee member.",
    processingTime: "1-2 Weeks",
    criteria: [
      "Blood samples from healthy adult cohorts",
      "Non-invasive physiological & sensor recordings",
      "Voice, video & digital behavior tracking",
    ],
    ctaText: "Start Expedited Application",
    ctaVariant: "primary",
    iconTheme: {
      container: "bg-gradient-to-b from-cyan-50 via-sky-100/50 to-cyan-50/20 dark:from-cyan-950/40 dark:to-sky-900/10 border-sky-200/60 dark:border-sky-800/40 shadow-cyan-500/10",
      glow: "from-sky-400/20 to-cyan-300/10",
      primaryIcon: Scale,
      primaryColor: "text-cyan-700 dark:text-cyan-300",
      secondaryIcon: Sparkles,
      secondaryColor: "text-teal-600 dark:text-teal-300",
    },
  },
  {
    tierNumber: "Tier 2",
    tierName: "Full Committee Review",
    badgeIcon: Lock,
    badgeColor: "bg-[#002752] text-white",
    riskTitle: "Moderate to High Risk",
    riskDescription: "Review by full institutional review board with quorum.",
    processingTime: "4-6 Weeks",
    criteria: [
      "Studies involving vulnerable human populations",
      "Clinical trials of experimental drugs or devices",
      "Protocols with invasive interventions or deception",
    ],
    ctaText: "Initiate Full Board Review",
    ctaVariant: "navy",
    iconTheme: {
      container: "bg-gradient-to-b from-slate-100 via-blue-100/40 to-slate-50/30 dark:from-slate-800/50 dark:to-blue-950/20 border-slate-300/70 dark:border-slate-700/60 shadow-blue-500/10",
      glow: "from-blue-600/20 to-[#002752]/15",
      primaryIcon: Shield,
      primaryColor: "text-primary dark:text-blue-300",
      secondaryIcon: Lock,
      secondaryColor: "text-blue-700 dark:text-blue-400",
    },
  },
]

export function EthicsCheckerWidget() {
  return (
    <section
      id="checker"
      className="relative isolate py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-slate-50/40 via-white to-slate-50/60 dark:from-[#071321]/40 dark:via-background dark:to-[#071321]/60 overflow-hidden"
    >
      {/* Soft Ambient Background Luminous Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-16 left-1/2 -translate-x-1/2 w-[52rem] sm:w-[72rem] h-[28rem] bg-gradient-to-tr from-[#198754]/10 via-[#002752]/8 to-sky-100/30 blur-3xl rounded-full"
      />

      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 2xl:px-20 relative z-10">
        
        {/* Section Header with Giant Ghost Watermark Typography - Full Width */}
        <div className="relative text-center mx-auto mb-14 sm:mb-20 w-full">
          
          {/* Giant Ghost Watermark Typography (Behind Header) */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[52%] font-sans font-black text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] xl:text-[13rem] uppercase tracking-[0.18em] text-primary/[0.038] dark:text-white/[0.03] select-none pointer-events-none whitespace-nowrap z-0 leading-none"
          >
            CLEARANCE
          </div>

          {/* Foreground Title & Accent */}
          <div className="relative z-10 w-full">
            <h2 className="font-sans text-3xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-black tracking-tight text-primary dark:text-white leading-[1.05] uppercase">
              RESEARCH ETHICS CLEARANCE <br />
              <span className="bg-gradient-to-r from-[#198754] via-[#22c55e] to-[#0d9488] bg-clip-text text-transparent drop-shadow-2xs">
                DETERMINATION MATRIX
              </span>
            </h2>

            {/* Matching DIU Green Gradient Accent Line Bar */}
            <div className="w-24 sm:w-28 h-2 bg-gradient-to-r from-[#198754] via-[#22c55e] to-[#0d9488] rounded-full mx-auto my-5" />

            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium mx-auto">
              Understand the three institutional review pathways, risk classifications, and expected processing timelines.
            </p>
          </div>
        </div>

        {/* 3-Card Visual Matrix Grid - Full Width Edge-to-Edge */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 xl:gap-10 items-stretch">
          {TIERS.map((item, idx) => {
            const BadgeIcon = item.badgeIcon
            const PrimaryIcon = item.iconTheme.primaryIcon

            return (
              <div
                key={idx}
                className="group relative rounded-2xl sm:rounded-3xl border border-slate-200/85 dark:border-slate-800/80 bg-white dark:bg-card p-6 sm:p-8 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Top Subtle Hover Glow */}
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute -top-12 -right-12 size-36 rounded-full bg-gradient-to-br ${item.iconTheme.glow} blur-2xl group-hover:scale-125 transition-transform duration-500`}
                />

                {/* Card Top: Tier Header + Small Round Badge */}
                <div>
                  <div className="flex items-center justify-between pb-6">
                    <h3 className="font-heading text-lg sm:text-xl font-black text-primary dark:text-white tracking-tight">
                      {item.tierNumber}: {item.tierName}
                    </h3>
                    <div
                      className={`size-6 rounded-full flex items-center justify-center shadow-2xs ${item.badgeColor}`}
                    >
                      <BadgeIcon className="size-3.5" />
                    </div>
                  </div>

                  {/* Center Pure SVG Visual Graphic */}
                  <div className="my-3 sm:my-5 flex items-center justify-center">
                    <div
                      className={`relative size-28 sm:size-32 rounded-2xl sm:rounded-3xl border flex items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-sm ${item.iconTheme.container}`}
                    >
                      {/* Ambient Halo */}
                      <div
                        aria-hidden="true"
                        className={`absolute inset-0 rounded-3xl bg-gradient-to-tr ${item.iconTheme.glow} blur-xl`}
                      />
                      
                      {/* Main SVG Icon */}
                      <PrimaryIcon
                        strokeWidth={1.4}
                        className={`size-14 sm:size-16 relative z-10 transition-transform duration-300 group-hover:rotate-3 ${item.iconTheme.primaryColor}`}
                      />
                    </div>
                  </div>

                  {/* Risk Title & Explanation */}
                  <div className="pt-3 space-y-1">
                    <h4 className="text-base sm:text-lg font-black text-primary dark:text-white">
                      {item.riskTitle}
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {item.riskDescription}
                    </p>
                  </div>

                  {/* Typical Processing Badge */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-xs font-bold text-primary dark:text-slate-200">
                      <Clock className="size-3.5 text-secondary" />
                      <span>Typical Processing: {item.processingTime}</span>
                    </div>
                  </div>

                  {/* Bullet Criteria List */}
                  <div className="mt-4 space-y-2">
                    {item.criteria.map((point, cIdx) => (
                      <div
                        key={cIdx}
                        className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300"
                      >
                        <span className="size-1.5 rounded-full bg-slate-400 dark:bg-slate-500 shrink-0 mt-1.5" />
                        <span className="leading-snug">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Bottom: Pill Action Button */}
                <div className="pt-6 sm:pt-8 mt-auto">
                  <Button
                    onClick={() => {
                      document.getElementById("preview")?.scrollIntoView({ behavior: "smooth" })
                    }}
                    className={`w-full h-11 sm:h-12 px-5 text-xs sm:text-sm font-bold rounded-full gap-2 transition-all duration-300 shadow-2xs hover:shadow-md touch-manipulation group/btn ${
                      item.ctaVariant === "navy"
                        ? "bg-gradient-to-r from-[#002752] via-[#003875] to-[#002752] hover:from-[#001c3d] hover:to-[#001c3d] text-white border border-white/10"
                        : item.ctaVariant === "primary"
                        ? "bg-gradient-to-r from-teal-700 via-cyan-800 to-teal-700 hover:from-teal-800 hover:to-teal-900 text-white border border-white/10"
                        : "bg-gradient-to-r from-[#198754] via-[#22c55e] to-[#0d9488] hover:from-[#146c43] hover:to-[#0b7367] text-white border border-white/10"
                    }`}
                  >
                    <span>{item.ctaText}</span>
                    <ArrowRight className="size-3.5 opacity-80 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
