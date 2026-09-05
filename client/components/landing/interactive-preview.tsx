"use client"

import * as React from "react"
import Image from "next/image"
import { Lock, ShieldCheck } from "lucide-react"

export function InteractivePreview() {
  return (
    <section
      id="preview"
      className="relative isolate py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-slate-50/60 via-white to-slate-50/40 dark:from-[#071321]/60 dark:via-background dark:to-[#071321]/40 overflow-hidden"
    >
      {/* Soft Ambient Background Luminous Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 w-[44rem] sm:w-[64rem] h-[26rem] bg-gradient-to-tr from-[#198754]/12 via-[#002752]/8 to-sky-200/25 blur-3xl rounded-full"
      />

      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 2xl:px-20 relative z-10">
        
        {/* Section Header with Giant Ghost Watermark Typography */}
        <div className="relative text-center mx-auto mb-12 sm:mb-16 w-full">
          
          {/* Giant Ghost Watermark Typography (Behind Header) */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[52%] font-sans font-black text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] xl:text-[13rem] uppercase tracking-[0.18em] text-primary/[0.038] dark:text-white/[0.03] select-none pointer-events-none whitespace-nowrap z-0 leading-none"
          >
            WORKSPACE
          </div>

          {/* Foreground Title & Accent */}
          <div className="relative z-10 w-full">
            <h2 className="font-sans text-3xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-black tracking-tight text-primary dark:text-white leading-[1.05] uppercase">
              EXPLORE THE END-TO-END <br />
              <span className="bg-gradient-to-r from-[#198754] via-[#22c55e] to-[#0d9488] bg-clip-text text-transparent drop-shadow-2xs">
                PROTOCOL WORKSPACE
              </span>
            </h2>

            {/* Matching DIU Green Gradient Accent Line Bar */}
            <div className="w-24 sm:w-28 h-2 bg-gradient-to-r from-[#198754] via-[#22c55e] to-[#0d9488] rounded-full mx-auto my-5" />

            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium mx-auto">
              A unified digital operating system for research ethics committees, principal investigators,
              and institutional compliance boards.
            </p>
          </div>
        </div>

        {/* Full Protocol Workspace Visual Showcase - Full Width */}
        <div className="relative w-full">
          {/* Subtle Ambient Glow behind the Browser Frame */}
          <div
            aria-hidden="true"
            className="absolute -inset-1 sm:-inset-2 rounded-3xl bg-gradient-to-tr from-[#198754]/20 via-[#002752]/15 to-sky-200/30 blur-2xl opacity-70 pointer-events-none"
          />

          {/* Browser Window Frame */}
          <div className="relative rounded-2xl sm:rounded-3xl border border-slate-200/85 dark:border-slate-800/80 bg-white dark:bg-[#071321] shadow-2xl shadow-slate-300/40 dark:shadow-black/60 overflow-hidden">
            
            {/* Top Browser Chrome Bar */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-3.5 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/60 backdrop-blur-md">
              
              {/* Traffic Light Dots */}
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/50 inline-block" />
                <span className="size-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/50 inline-block" />
                <span className="size-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/50 inline-block" />
              </div>

              {/* URL Address Bar */}
              <div className="flex items-center justify-center gap-2 px-3 sm:px-4 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-micro sm:text-xs text-muted-foreground font-mono shadow-2xs max-w-xs sm:max-w-md w-full mx-2">
                <Lock className="size-3 text-secondary shrink-0" />
                <span className="truncate">https://ethica.diu.edu.bd/protocols/ETH-2026-MED-0419</span>
              </div>

              {/* Status Indicator */}
              <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-secondary">
                <ShieldCheck className="size-3.5" />
                <span>Verified Protocol Hub</span>
              </div>
            </div>

            {/* Full Protocol Workspace Presentation Image */}
            <div className="relative w-full aspect-[1376/768] bg-slate-100 dark:bg-slate-900">
              <Image
                src="/images/protocol-workspace.webp"
                alt="Ethica institutional research ethics protocol review workspace showing active proposal, workflow timeline, reviewer comments, document depot, and digital clearance certificate"
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
    </section>
  )
}
