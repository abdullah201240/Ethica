"use client"

import * as React from "react"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { HelpCircle, Mail, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const FAQS = [
  {
    question: "How does Ethica determine whether research requires full IRB review or qualifies for an exemption?",
    answer:
      "Ethica features an integrated Pre-Screening Determination Engine based on the WMA Declaration of Helsinki, CIOMS, and federal OHRP standards. If a protocol involves non-human secondary data or public observations without identifiers, it is instantly designated as Exempt with a downloadable confirmation waiver. Studies with minimal risk (e.g. non-invasive surveys) qualify for Expedited single-reviewer clearance, while high-risk protocols or studies with vulnerable populations (minors, clinical patients) are routed directly to the full convened review board.",
  },
  {
    question: "What is the role of the Administrative Gatekeeper Screening stage?",
    answer:
      "Before an application reaches reviewer committees, an administrative screening officer audits the package for structural completeness. If an informed consent form is missing, investigator CVs are unattached, or student supervisor sign-offs are absent, the officer can return the application in one click with a clear correction checklist. This eliminates committee backlog caused by incomplete dockets.",
  },
  {
    question: "How are revisions and version histories managed when a committee requests modifications?",
    answer:
      "Ethica automatically snapshots every submission as an immutable version (e.g. v1.0, v1.1, v2.0). When reviewers request modifications or apply conditions, researchers respond directly within the integrated deliberation thread and upload amended documents. Reviewers can examine direct differences between versions without having to re-read unchanged sections.",
  },
  {
    question: "How can academic journals, funding agencies, and external auditors verify digital certificates?",
    answer:
      "Every approved protocol receives a unique Certificate Reference (e.g. ETH-2026-MED-0419) coupled with a cryptographic SHA-256 digital signature and dynamic verification QR code. Journal editors or grant program officers can scan the QR code or enter the protocol hash on the public institutional portal to verify certificate authenticity, validity period, and approving board metadata in real time.",
  },
  {
    question: "Can multiple co-investigators, faculty supervisors, and external collaborators work on a single protocol?",
    answer:
      "Yes. Ethica provides multi-collaborator permissions. Principal Investigators can invite co-investigators, postdocs, and student researchers to co-edit protocol drafts, while designating mandatory sign-off checkpoints for departmental heads and faculty advisors prior to formal gatekeeper submission.",
  },
  {
    question: "Can universities configure custom review rubrics, specialty boards, and approval tiers?",
    answer:
      "Yes. Ethica provides granular institutional administration. Institutional boards can configure custom evaluation rubrics, define specialized committee quorum rules, specify departmental approval hierarchies, and adapt clearance templates to match local and international governance mandates.",
  },
]

export function FaqSection() {
  return (
    <section
      id="faq"
      className="relative isolate py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-slate-50/60 via-white to-slate-50/40 dark:from-[#071321]/60 dark:via-background dark:to-[#071321]/40 overflow-hidden"
    >
      {/* Soft Ambient Background Luminous Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-20 left-1/2 -translate-x-1/2 w-[52rem] sm:w-[76rem] h-[28rem] bg-gradient-to-tr from-[#198754]/10 via-[#002752]/8 to-sky-100/25 blur-3xl rounded-full"
      />

      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 2xl:px-20 relative z-10">
        
        {/* Section Header with Giant Ghost Watermark Typography */}
        <div className="relative text-center mx-auto mb-14 sm:mb-20 w-full">
          
          {/* Giant Ghost Watermark Typography (Behind Header) */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[52%] font-sans font-black text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] xl:text-[13rem] uppercase tracking-[0.18em] text-primary/[0.038] dark:text-white/[0.03] select-none pointer-events-none whitespace-nowrap z-0 leading-none"
          >
            QUESTIONS
          </div>

          {/* Foreground Title & Accent */}
          <div className="relative z-10 w-full">
            <h2 className="font-sans text-3xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-black tracking-tight text-primary dark:text-white leading-[1.05] uppercase">
              FREQUENTLY ASKED <br />
              <span className="bg-gradient-to-r from-[#198754] via-[#22c55e] to-[#0d9488] bg-clip-text text-transparent drop-shadow-2xs">
                QUESTIONS
              </span>
            </h2>

            {/* Matching DIU Green Gradient Accent Line Bar */}
            <div className="w-24 sm:w-28 h-2 bg-gradient-to-r from-[#198754] via-[#22c55e] to-[#0d9488] rounded-full mx-auto my-5" />

            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium mx-auto">
              Essential knowledge on institutional review tiers, gatekeeper screening, version history,
              and tamper-proof digital certification.
            </p>
          </div>
        </div>

        {/* 2 Questions in One Row Grid - Full Width Edge-to-Edge */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {FAQS.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl sm:rounded-3xl border border-slate-200/85 dark:border-slate-800/80 bg-white/95 dark:bg-card/95 backdrop-blur-md p-6 sm:p-7 shadow-xs hover:shadow-md transition-all duration-300"
            >
              <Accordion className="w-full">
                <AccordionItem value={`faq-${idx}`} className="border-none">
                  <AccordionTrigger className="text-left font-sans font-black text-base sm:text-lg text-primary dark:text-white py-1 hover:no-underline hover:text-secondary dark:hover:text-emerald-400 transition-colors">
                    <div className="flex items-start gap-3.5 pr-2">
                      <span className="font-mono text-xs font-black text-secondary bg-[#198754]/10 px-2.5 py-1 rounded-full shrink-0 mt-0.5">
                        0{idx + 1}
                      </span>
                      <span className="leading-snug">{item.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-3 pl-10 pr-2 font-medium">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          ))}
        </div>

        {/* Support Callout Pill Card */}
        <div className="mt-10 sm:mt-12 p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200/85 dark:border-slate-800/80 bg-white/80 dark:bg-card/80 backdrop-blur-md shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="size-12 sm:size-14 rounded-2xl bg-gradient-to-tr from-[#002752]/10 to-sky-100 dark:from-white/10 dark:to-white/5 border border-[#002752]/15 flex items-center justify-center text-primary dark:text-white shrink-0">
              <HelpCircle className="size-6 sm:size-7" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-black text-primary dark:text-white">
                Have specific institutional questions or custom IRB workflows?
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                Our academic compliance specialists can help configure Ethica for your university.
              </p>
            </div>
          </div>

          <Button
            size="lg"
            onClick={() => {
              window.location.href = "mailto:ethics-committee@diu.edu.bd"
            }}
            className="h-12 sm:h-13 px-8 text-sm sm:text-base font-bold rounded-full bg-gradient-to-r from-[#002752] via-[#003875] to-[#002752] hover:from-[#001c3d] hover:to-[#001c3d] text-white shadow-md hover:shadow-xl hover:shadow-[#002752]/25 border border-white/10 gap-2.5 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 touch-manipulation shrink-0"
          >
            <Mail className="size-4" />
            <span>Contact Institutional Secretariat</span>
            <ArrowRight className="size-4 opacity-80" />
          </Button>
        </div>

      </div>
    </section>
  )
}
