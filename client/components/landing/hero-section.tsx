"use client"

import * as React from "react"
import Image from "next/image"
import {
  ArrowRight,
  Search,
  Settings2,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {

  return (
    <section className="relative isolate overflow-hidden min-h-[calc(100vh-4rem)] flex flex-col justify-center py-6 sm:py-10 md:py-12 bg-white dark:bg-[#071321]">
      {/* DESKTOP: Right-Side Full Background Gradient & Artwork Flow covering 100% of right display */}
      <div className="pointer-events-none hidden lg:block absolute inset-y-0 right-0 w-[55%] xl:w-[52%] 2xl:w-[50%] overflow-hidden select-none z-0">
        {/* Full-coverage right background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#EEF4FE] via-[#E7EFFB] to-[#EAF1FC]" />

        {/* Exact High-Fidelity Artwork filling the right half edge-to-edge */}
        <div className="absolute inset-0 flex items-center justify-end">
          <Image
            src="/images/hero-right-master.webp"
            alt="Institutional research proposal ethical clearance 3D holographic shield with compliance documents"
            width={2208}
            height={1692}
            priority
            quality={100}
            unoptimized
            className="h-full w-full object-cover object-left select-none pointer-events-none"
          />
        </div>

        {/* Soft Ambient Luminous Emerald Glow at Bottom */}
        <div
          aria-hidden="true"
          className="absolute -bottom-8 right-[20%] size-[36rem] rounded-full bg-gradient-to-tr from-[#198754]/20 via-emerald-100/25 to-transparent blur-3xl pointer-events-none"
        />
      </div>

      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 2xl:px-20 relative z-10 my-auto">
        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-14 items-center">
          
          {/* LEFT COLUMN: Optimally Sized Headline, Accent Bar, CTAs (7 cols) */}
          <div className="lg:col-span-7 text-left space-y-6 sm:space-y-7">
            
            {/* Main Hero Headline - One Level Larger Prominent Typography */}
            <h1 className="font-sans text-4xl sm:text-5xl md:text-6xl lg:text-[4.45rem] xl:text-[5rem] 2xl:text-[5.45rem] font-black tracking-tight text-[#002752] dark:text-white leading-[1.04] uppercase animate-fade-in-up [animation-delay:100ms]">
              THE COMPLETE PLATFORM FOR <br />
              <span className="bg-gradient-to-r from-[#198754] via-[#22c55e] to-[#0d9488] bg-clip-text text-transparent drop-shadow-2xs">RESEARCH ETHICS</span> &amp; <br />
              CLEARANCE APPROVAL
            </h1>

            {/* Matching Gradient Horizontal Accent Line Bar */}
            <div className="w-24 sm:w-28 h-2 bg-gradient-to-r from-[#198754] via-[#22c55e] to-[#0d9488] rounded-full animate-fade-in-up [animation-delay:200ms]" />

            {/* Primary Call to Action Buttons - Fully Rounded Pill Modern UI */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-5 pt-3 sm:pt-4 animate-fade-in-up [animation-delay:300ms]">
              <Button
                size="lg"
                onClick={() => {
                  document.getElementById("checker")?.scrollIntoView({ behavior: "smooth" })
                }}
                className="group relative h-15 sm:h-16 px-8 sm:px-10 text-lg sm:text-xl font-bold bg-gradient-to-r from-[#002752] via-[#003875] to-[#002752] hover:from-[#001c3d] hover:to-[#001c3d] text-white gap-3.5 rounded-full shadow-md hover:shadow-xl hover:shadow-[#002752]/25 border border-white/10 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 touch-manipulation"
                aria-label="Scroll to ethics requirement checker"
              >
                <div className="flex size-9 items-center justify-center rounded-full bg-white/15 group-hover:bg-white/20 transition-colors">
                  <Settings2 className="size-5 text-white group-hover:rotate-45 transition-transform duration-300" />
                </div>
                <span>Check Ethics Requirement</span>
                <ArrowRight className="size-5 opacity-80 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all duration-300" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  document.getElementById("preview")?.scrollIntoView({ behavior: "smooth" })
                }}
                className="group h-15 sm:h-16 px-8 sm:px-10 text-lg sm:text-xl font-bold bg-white/90 dark:bg-card/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-700/80 hover:border-[#002752]/40 hover:bg-slate-50/90 text-slate-800 dark:text-slate-100 gap-3.5 rounded-full transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 touch-manipulation shadow-2xs hover:shadow-md"
                aria-label="Scroll to live protocol inspector simulator"
              >
                <div className="flex size-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-[#002752]/10 transition-colors">
                  <Search className="size-5 text-slate-600 dark:text-slate-300 group-hover:text-primary transition-colors" />
                </div>
                <span>Explore Protocol Inspector</span>
              </Button>
            </div>

          </div>

          {/* RIGHT COLUMN (Desktop spacer, Mobile visual) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* On mobile, show the visual below text */}
            <div className="lg:hidden relative w-full max-w-lg aspect-[552/423] flex items-center justify-center">
              <Image
                src="/images/hero-right-master.webp"
                alt="Institutional research proposal ethical clearance 3D holographic shield with compliance documents"
                width={2208}
                height={1692}
                priority
                quality={100}
                unoptimized
                className="w-full h-auto object-contain pointer-events-none"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
