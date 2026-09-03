"use client"

import * as React from "react"
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  FileCheck2,
  Scale,
  GraduationCap,
} from "lucide-react"

export function Footer() {
  return (
    <footer className="relative isolate bg-[#001c3d] text-slate-300 dark:bg-[#040e1a] overflow-hidden">
      {/* Soft Ambient Top Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[48rem] sm:w-[68rem] h-28 bg-gradient-to-r from-[#198754]/20 via-sky-500/10 to-[#198754]/20 blur-3xl opacity-60"
      />

      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 2xl:px-20 pt-16 sm:pt-20 pb-12 relative z-10">

        {/* Main Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-14 border-b border-white/10">

          {/* Brand & Mission Column (Span 2) */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#198754] to-emerald-400 text-white shadow-md shadow-[#198754]/25">
                <ShieldCheck className="size-6" />
              </div>
              <span className="font-sans text-2xl font-black tracking-tight text-white">
                ETHICA
              </span>
            </div>

            <p className="text-sm text-slate-300 dark:text-slate-400 leading-relaxed font-medium max-w-md">
              The institutional research proposal and ethical clearance management platform.
              Safeguarding human participants, streamlining committee deliberations, and issuing
              cryptographically verifiable clearance certificates.
            </p>

            {/* Institutional Security Pill */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-slate-200">
              <span className="size-2 rounded-full bg-[#198754] animate-pulse" />
              <span>Institutional Network Active • SHA-256 Ledger Validated</span>
            </div>
          </div>

          {/* Column 2: Governance Lifecycle */}
          <div className="space-y-4">
            <span className="font-mono text-xs font-black uppercase tracking-wider text-white/90 block">
              Governance Lifecycle
            </span>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium">
              <li>
                <a href="#checker" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 group">
                  <span className="size-1 rounded-full bg-white/40 group-hover:bg-emerald-400" />
                  <span>Pre-Screening Determination</span>
                </a>
              </li>
              <li>
                <a href="#preview" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 group">
                  <span className="size-1 rounded-full bg-white/40 group-hover:bg-emerald-400" />
                  <span>Protocol Workspace</span>
                </a>
              </li>
              <li>
                <a href="#workflow" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 group">
                  <span className="size-1 rounded-full bg-white/40 group-hover:bg-emerald-400" />
                  <span>Administrative Triage</span>
                </a>
              </li>
              <li>
                <a href="#workflow" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 group">
                  <span className="size-1 rounded-full bg-white/40 group-hover:bg-emerald-400" />
                  <span>IRB Committee Hub</span>
                </a>
              </li>
              <li>
                <a href="#certificate" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 group">
                  <span className="size-1 rounded-full bg-white/40 group-hover:bg-emerald-400" />
                  <span>Clearance Certification</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Institutional Actors */}
          <div className="space-y-4">
            <span className="font-mono text-xs font-black uppercase tracking-wider text-white/90 block">
              Actor Portals
            </span>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium">
              <li>
                <a href="#stakeholders" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 group">
                  <GraduationCap className="size-3.5 text-emerald-400" />
                  <span>Principal Investigators</span>
                </a>
              </li>
              <li>
                <a href="#stakeholders" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 group">
                  <FileCheck2 className="size-3.5 text-sky-400" />
                  <span>Screening Officers</span>
                </a>
              </li>
              <li>
                <a href="#stakeholders" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 group">
                  <Scale className="size-3.5 text-blue-400" />
                  <span>Review Committee Members</span>
                </a>
              </li>
              <li>
                <a href="#certificate" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 group">
                  <Lock className="size-3.5 text-amber-400" />
                  <span>Public Registry Verifiers</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Standards & Compliance */}
          <div className="space-y-4">
            <span className="font-mono text-xs font-black uppercase tracking-wider text-white/90 block">
              Ethical Standards
            </span>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 text-[#198754] shrink-0" />
                <span>Declaration of Helsinki</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 text-[#198754] shrink-0" />
                <span>CIOMS Ethical Guidelines</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 text-[#198754] shrink-0" />
                <span>The Belmont Report</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 text-[#198754] shrink-0" />
                <span>ICH-GCP Compliance</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 text-[#198754] shrink-0" />
                <span>ISO 27001 & SOC 2 Ready</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Institutional Attribution & Policies */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-400">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} Ethica Institutional Research Ethics & Clearance Platform. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <span className="hover:text-white transition-colors cursor-pointer">
              Institutional Governance Charter
            </span>
            <span>•</span>
            <span className="hover:text-white transition-colors cursor-pointer">
              Participant Privacy Policy
            </span>
            <span>•</span>
            <span className="hover:text-white transition-colors cursor-pointer">
              Security Specifications
            </span>
          </div>
        </div>

      </div>
    </footer>
  )
}
