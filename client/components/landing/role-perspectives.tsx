"use client"

import * as React from "react"
import Image from "next/image"
import {
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Scale,
  ArrowRight,
  Lock,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

const ROLE_TABS = [
  {
    id: "researchers",
    label: "Researchers & PIs",
    icon: GraduationCap,
    category: "Principal Investigator Hub",
    categoryColor: "text-[#198754]",
    iconBg: "from-[#198754]/20 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 border-[#198754]/30 text-[#198754]",
    title: "ACCELERATE YOUR RESEARCH JOURNEY WITH TOTAL TRANSPARENCY",
    description:
      "Eliminate lost paperwork, delayed emails, and mysterious review boards. Researchers gain real-time visibility into application status, clear reviewer feedback, and versioned document depots.",
    highlights: [
      "Dynamic pre-screening determination & instant exemption letter",
      "Guided multi-step protocol builder with co-investigator sign-offs",
      "Immutable version-controlled revisions (v1.1 → v2.0 diffs)",
    ],
    ctaText: "Self-Check Ethics Clearance",
    ctaTarget: "checker",
    image: "/images/role-researcher.webp",
    alt: "Ethica Researcher and Principal Investigator protocol submission dashboard",
    url: "https://ethica.diu.edu.bd/portal/pi/protocols/new",
  },
  {
    id: "screening",
    label: "Screening Officers",
    icon: ShieldCheck,
    category: "Gatekeeper & Triage Hub",
    categoryColor: "text-sky-600",
    iconBg: "from-sky-500/20 to-sky-100 dark:from-sky-950 dark:to-sky-900 border-sky-500/30 text-sky-600",
    title: "THE ADMINISTRATIVE GATEKEEPER & COMPLETENESS SHIELD",
    description:
      "Screening officers protect review committees from incomplete submissions. Audit incoming protocols against institutional checklists, return deficient files in one click, and triage valid proposals to the correct specialty board.",
    highlights: [
      "Automated documentation completeness checklist audit",
      "One-click return for corrections with structured reviewer notes",
      "Intelligent triage to Health, Behavioral, Animal, or Data/AI boards",
    ],
    ctaText: "Learn About Gatekeeper Triage",
    ctaTarget: "workflow",
    image: "/images/role-screening.webp",
    alt: "Ethica Institutional Screening Officer protocol audit queue and completeness checklist",
    url: "https://ethica.diu.edu.bd/admin/triage/queue",
  },
  {
    id: "committee",
    label: "IRB Committees",
    icon: Scale,
    category: "Ethical Review Committee Hub",
    categoryColor: "text-blue-600",
    iconBg: "from-blue-500/20 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-500/30 text-blue-600",
    title: "STRUCTURED ETHICAL EVALUATION & COLLABORATIVE DELIBERATION",
    description:
      "Ethics review committee members examine study protocols using standardized criteria: risk-benefit ratio, informed consent clarity, data privacy, and vulnerable population safeguards with collaborative condition management.",
    highlights: [
      "Standardized rubrics based on Belmont, Helsinki, and institutional criteria",
      "Collaborative conditional approval with precise revision stipulations",
      "Direct document version comparison diffs without re-reading clean pages",
    ],
    ctaText: "Inspect Reviewer Deliberation",
    ctaTarget: "preview",
    image: "/images/role-committee.webp",
    alt: "Ethica Ethical Review Board evaluation rubric, comments, and voting tally interface",
    url: "https://ethica.diu.edu.bd/committee/deliberation/review",
  },
]

export function RolePerspectives() {
  const [selectedRole, setSelectedRole] = React.useState("researchers")

  return (
    <section
      id="stakeholders"
      className="relative isolate py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-slate-50/40 via-white to-slate-50/60 dark:from-[#071321]/40 dark:via-background dark:to-[#071321]/60 overflow-hidden"
    >
      {/* Soft Ambient Background Luminous Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-20 left-1/2 -translate-x-1/2 w-[52rem] sm:w-[72rem] h-[28rem] bg-gradient-to-tr from-[#002752]/6 via-[#198754]/10 to-sky-100/25 blur-3xl rounded-full"
      />

      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 2xl:px-20 relative z-10">
        
        {/* Section Header with Giant Ghost Watermark Typography */}
        <div className="relative text-center mx-auto mb-14 sm:mb-20 w-full">
          
          {/* Giant Ghost Watermark Typography (Behind Header) */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[52%] font-sans font-black text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] xl:text-[13rem] uppercase tracking-[0.18em] text-[#002752]/[0.038] dark:text-white/[0.03] select-none pointer-events-none whitespace-nowrap z-0 leading-none"
          >
            PERSPECTIVES
          </div>

          {/* Foreground Title & Accent */}
          <div className="relative z-10 w-full">
            <h2 className="font-sans text-3xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-black tracking-tight text-[#002752] dark:text-white leading-[1.05] uppercase">
              TAILORED EXPERIENCES FOR <br />
              <span className="bg-gradient-to-r from-[#198754] via-[#22c55e] to-[#0d9488] bg-clip-text text-transparent drop-shadow-2xs">
                EVERY RESEARCH ACTOR
              </span>
            </h2>

            {/* Matching DIU Green Gradient Accent Line Bar */}
            <div className="w-24 sm:w-28 h-2 bg-gradient-to-r from-[#198754] via-[#22c55e] to-[#0d9488] rounded-full mx-auto my-5" />

            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium mx-auto">
              Ethica delivers purpose-built workspaces tailored for investigators, administrative gatekeepers,
              and ethical review board members.
            </p>
          </div>
        </div>

        {/* Tab Switcher - Pill-Shaped Modern Controls */}
        <div className="w-full">
          <Tabs value={selectedRole} onValueChange={setSelectedRole} className="w-full">
            
            {/* Pill Tab Bar */}
            <div className="flex justify-center mb-10 sm:mb-14">
              <TabsList className="h-auto p-1.5 bg-white/90 dark:bg-card/90 border border-slate-200/85 dark:border-slate-800/80 rounded-full shadow-xs flex flex-wrap sm:flex-nowrap gap-1.5 sm:gap-2 backdrop-blur-md">
                {ROLE_TABS.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="py-3 px-6 sm:px-8 text-sm sm:text-base font-bold rounded-full transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#002752] data-[state=active]:via-[#003875] data-[state=active]:to-[#002752] data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-[#002752]/20 text-slate-600 dark:text-slate-300 hover:text-[#002752] dark:hover:text-white"
                    >
                      <Icon className="size-4.5 mr-2 shrink-0" />
                      <span>{tab.label}</span>
                    </TabsTrigger>
                  )
                })}
              </TabsList>
            </div>

            {/* Tab Contents: Left Text + Right Image for every tab */}
            {ROLE_TABS.map((tab) => {
              const Icon = tab.icon

              return (
                <TabsContent key={tab.id} value={tab.id} className="space-y-8 animate-fade-in-up">
                  <Card className="rounded-2xl sm:rounded-3xl border border-slate-200/85 dark:border-slate-800/80 shadow-md bg-white/95 dark:bg-card/95 backdrop-blur-md p-6 sm:p-10 lg:p-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
                      
                      {/* Left Column: Role Narrative & Bullet Highlights */}
                      <div className="lg:col-span-5 space-y-6">
                        <div className="flex items-center gap-3">
                          <div className={`size-12 sm:size-14 rounded-2xl bg-gradient-to-tr border flex items-center justify-center shadow-xs ${tab.iconBg}`}>
                            <Icon className="size-6 sm:size-7" />
                          </div>
                          <span className={`font-mono text-xs font-black uppercase tracking-wider ${tab.categoryColor}`}>
                            {tab.category}
                          </span>
                        </div>

                        <h3 className="font-sans text-2xl sm:text-3xl font-black text-[#002752] dark:text-white leading-[1.12] tracking-tight">
                          {tab.title}
                        </h3>

                        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                          {tab.description}
                        </p>

                        {/* Bullet Highlights */}
                        <div className="space-y-3 pt-2">
                          {tab.highlights.map((point, pIdx) => (
                            <div key={pIdx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                              <div className="size-5 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                                <CheckCircle2 className="size-3.5" />
                              </div>
                              <span className="font-semibold leading-snug">{point}</span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-3">
                          <Button
                            size="lg"
                            onClick={() => {
                              document.getElementById(tab.ctaTarget)?.scrollIntoView({ behavior: "smooth" })
                            }}
                            className="h-12 sm:h-13 px-8 text-sm sm:text-base font-bold rounded-full bg-gradient-to-r from-[#002752] via-[#003875] to-[#002752] hover:from-[#001c3d] hover:to-[#001c3d] text-white shadow-md hover:shadow-xl hover:shadow-[#002752]/25 border border-white/10 gap-2.5 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 touch-manipulation"
                          >
                            <span>{tab.ctaText}</span>
                            <ArrowRight className="size-4 opacity-80" />
                          </Button>
                        </div>
                      </div>

                      {/* Right Column: High-Fidelity Dedicated Interface Image in Modern Frame */}
                      <div className="lg:col-span-7 relative w-full">
                        {/* Ambient Back Glow */}
                        <div
                          aria-hidden="true"
                          className="absolute -inset-2 sm:-inset-3 rounded-3xl bg-gradient-to-tr from-[#198754]/15 via-[#002752]/10 to-sky-200/20 blur-2xl opacity-80 pointer-events-none"
                        />

                        {/* Browser Window Frame */}
                        <div className="relative rounded-2xl sm:rounded-3xl border border-slate-200/85 dark:border-slate-800/80 bg-white dark:bg-[#071321] shadow-2xl shadow-slate-300/40 dark:shadow-black/60 overflow-hidden">
                          
                          {/* Chrome Top Bar */}
                          <div className="flex items-center justify-between px-4 py-2.5 sm:py-3 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/90 dark:bg-slate-900/60 backdrop-blur-md">
                            <div className="flex items-center gap-1.5">
                              <span className="size-2.5 sm:size-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/50 inline-block" />
                              <span className="size-2.5 sm:size-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/50 inline-block" />
                              <span className="size-2.5 sm:size-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/50 inline-block" />
                            </div>

                            <div className="flex items-center justify-center gap-1.5 px-3 py-0.5 sm:py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-[0.68rem] sm:text-xs text-slate-500 dark:text-slate-400 font-mono shadow-2xs max-w-xs w-full mx-2 truncate">
                              <Lock className="size-2.5 sm:size-3 text-[#198754] shrink-0" />
                              <span className="truncate">{tab.url}</span>
                            </div>

                            <div className="text-[0.68rem] font-bold text-[#198754] hidden sm:block">
                              Active Workspace
                            </div>
                          </div>

                          {/* Image Presentation */}
                          <div className="relative w-full aspect-[16/9] bg-slate-100 dark:bg-slate-900">
                            <Image
                              src={tab.image}
                              alt={tab.alt}
                              width={1376}
                              height={768}
                              priority
                              quality={100}
                              unoptimized
                              className="w-full h-full object-cover select-none pointer-events-none"
                            />
                          </div>
                        </div>
                      </div>

                    </div>
                  </Card>
                </TabsContent>
              )
            })}

          </Tabs>
        </div>

      </div>
    </section>
  )
}
