"use client"

import * as React from "react"
import Image from "next/image"
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Copy,
  Check,
  FileCheck2,
  QrCode,
  Award,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"

export function CertificateShowcase() {
  const [copied, setCopied] = React.useState(false)

  const handleCopyHash = () => {
    navigator.clipboard.writeText("8f4b29c98a3e74d10fa4d1b82d90bc39e102948b813b2c1766a2e881fa2c92e1")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section
      id="certificate"
      className="relative isolate py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-slate-50/60 via-white to-slate-50/40 dark:from-[#071321]/60 dark:via-background dark:to-[#071321]/40 overflow-hidden"
    >
      {/* Soft Ambient Background Luminous Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-20 left-1/2 -translate-x-1/2 w-[52rem] sm:w-[76rem] h-[28rem] bg-gradient-to-tr from-[#198754]/12 via-[#002752]/8 to-sky-100/25 blur-3xl rounded-full"
      />

      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 2xl:px-20 relative z-10">
        
        {/* Section Header with Giant Ghost Watermark Typography */}
        <div className="relative text-center mx-auto mb-14 sm:mb-20 w-full">
          
          {/* Giant Ghost Watermark Typography (Behind Header) */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[52%] font-sans font-black text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] xl:text-[13rem] uppercase tracking-[0.18em] text-primary/[0.038] dark:text-white/[0.03] select-none pointer-events-none whitespace-nowrap z-0 leading-none"
          >
            CERTIFICATION
          </div>

          {/* Foreground Title & Accent */}
          <div className="relative z-10 w-full">
            <h2 className="font-sans text-3xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-black tracking-tight text-primary dark:text-white leading-[1.05] uppercase">
              TAMPER-PROOF DIGITAL <br />
              <span className="bg-gradient-to-r from-[#198754] via-[#22c55e] to-[#0d9488] bg-clip-text text-transparent drop-shadow-2xs">
                ETHICAL CLEARANCE
              </span>
            </h2>

            {/* Matching DIU Green Gradient Accent Line Bar */}
            <div className="w-24 sm:w-28 h-2 bg-gradient-to-r from-[#198754] via-[#22c55e] to-[#0d9488] rounded-full mx-auto my-5" />

            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium mx-auto">
              Approved research protocols receive an authentic, cryptographically verifiable digital
              clearance certificate recognized by international peer-reviewed journals and grant agencies.
            </p>
          </div>
        </div>

        {/* Two-Column Showcase: Left Narrative & Verification + Right High-Fidelity Certificate Mockup */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
          
          {/* Left Column: Certification Features & Live Validation Trigger */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <div className="size-12 sm:size-14 rounded-2xl bg-gradient-to-tr from-[#198754]/20 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 border border-[#198754]/30 text-secondary flex items-center justify-center shadow-xs">
                <Award className="size-6 sm:size-7" />
              </div>
              <span className="font-mono text-xs font-black uppercase tracking-wider text-secondary">
                Institutional Certificate Repository
              </span>
            </div>

            <h3 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-black text-primary dark:text-white leading-[1.12] tracking-tight">
              CRYPTOGRAPHICALLY SIGNED & INTERNATIONALLY RECOGNIZED
            </h3>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Say goodbye to paper certificates and unverifiable approval letters. Ethica issues
              cryptographically anchored digital clearance credentials that peer reviewers, publishers,
              and funding councils can verify instantly.
            </p>

            {/* 3 Key Feature Cards */}
            <div className="space-y-3 pt-1">
              <div className="p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-card/90 shadow-2xs">
                <div className="flex items-start gap-3.5">
                  <div className="size-9 rounded-xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="size-4.5" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-black text-primary dark:text-white">
                      SHA-256 Ledger Fingerprint
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
                      Immutable cryptographic hash binding protocol version, participant consents, and committee terms.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-card/90 shadow-2xs">
                <div className="flex items-start gap-3.5">
                  <div className="size-9 rounded-xl bg-teal-500/15 text-teal-600 flex items-center justify-center shrink-0 mt-0.5">
                    <QrCode className="size-4.5" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-black text-primary dark:text-white">
                      Instant Global QR Verification
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
                      Scannable live registry validates approval status in seconds for academic publishers worldwide.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-card/90 shadow-2xs">
                <div className="flex items-start gap-3.5">
                  <div className="size-9 rounded-xl bg-blue-500/15 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <FileCheck2 className="size-4.5" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-black text-primary dark:text-white">
                      Multi-Signatory Quorum Consensus
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
                      Certified with official institutional seals and verified credentials of the review board chair.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Verification Trigger Button */}
            <div className="pt-2">
              <Dialog>
                <DialogTrigger render={
                  <Button
                    size="lg"
                    className="h-13 sm:h-14 px-8 text-base font-bold rounded-full bg-gradient-to-r from-[#002752] via-[#003875] to-[#002752] hover:from-[#001c3d] hover:to-[#001c3d] text-white shadow-md hover:shadow-xl hover:shadow-[#002752]/25 border border-white/10 gap-3 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 touch-manipulation"
                  >
                    <div className="flex size-7 items-center justify-center rounded-full bg-white/15">
                      <Lock className="size-4 text-white" />
                    </div>
                    <span>Verify Certificate Authenticity</span>
                    <ShieldCheck className="size-4.5 text-secondary" />
                  </Button>
                } />

                <DialogContent className="sm:max-w-md rounded-2xl border border-slate-200/85 dark:border-slate-800/80 shadow-2xl p-6 sm:p-8 bg-white dark:bg-card">
                  <DialogHeader>
                    <div className="flex items-center gap-2 text-secondary mb-1">
                      <CheckCircle2 className="size-5" />
                      <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">
                        Cryptographic Verification Passed
                      </span>
                    </div>
                    <DialogTitle className="text-xl sm:text-2xl font-black text-primary dark:text-white">
                      Ethical Clearance Validity Report
                    </DialogTitle>
                    <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
                      Live cryptographic proof confirming protocol approval and signature authenticity.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-3 text-sm">
                    <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/40 space-y-2.5">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-muted-foreground">Protocol ID:</span>
                        <span className="font-mono font-bold text-primary dark:text-white">ETH-2026-MED-0419</span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-muted-foreground">Status:</span>
                        <span className="font-bold text-secondary">Active & Certified</span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-muted-foreground">Lead PI:</span>
                        <span className="font-semibold text-primary dark:text-white">Dr. Evelyn Reed</span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-muted-foreground">Approved by:</span>
                        <span className="font-semibold text-primary dark:text-white">Biomedical IRB Quorum</span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-muted-foreground">Ledger timestamp:</span>
                        <span className="font-mono tabular-nums text-slate-700 dark:text-slate-300">2026-09-03 10:00:00 UTC</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-xs text-muted-foreground block font-bold uppercase tracking-wider">
                        SHA-256 digital signature:
                      </span>
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs break-all">
                        <span className="text-slate-700 dark:text-slate-300">8f4b29c98a3e74d10fa4d1b82d90bc39e102948b813b2c1766a2e881fa2c92e1</span>
                        <button
                          type="button"
                          onClick={handleCopyHash}
                          className="ml-2 p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white shrink-0 transition-colors"
                          title="Copy Hash"
                          aria-label="Copy SHA-256 hash"
                        >
                          {copied ? <Check className="size-4 text-secondary" /> : <Copy className="size-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <DialogFooter>
                    <DialogClose render={
                      <Button size="lg" className="w-full text-sm font-bold rounded-full bg-[#002752] text-white">
                        Close Report
                      </Button>
                    } />
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Right Column: High-Fidelity Holographic Certificate Showcase */}
          <div className="lg:col-span-7 relative w-full">
            {/* Ambient Back Glow */}
            <div
              aria-hidden="true"
              className="absolute -inset-2 sm:-inset-4 rounded-3xl bg-gradient-to-tr from-[#198754]/20 via-[#E0C23C]/10 to-[#002752]/15 blur-3xl opacity-80 pointer-events-none"
            />

            {/* Browser Frame */}
            <div className="relative rounded-2xl sm:rounded-3xl border border-slate-200/85 dark:border-slate-800/80 bg-white dark:bg-[#071321] shadow-2xl shadow-slate-300/40 dark:shadow-black/60 overflow-hidden">
              
              {/* Chrome Top Bar */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/90 dark:bg-slate-900/60 backdrop-blur-md">
                <div className="flex items-center gap-1.5">
                  <span className="size-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/50 inline-block" />
                  <span className="size-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/50 inline-block" />
                  <span className="size-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/50 inline-block" />
                </div>

                <div className="flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-micro sm:text-xs text-muted-foreground font-mono shadow-2xs max-w-sm w-full mx-2 truncate">
                  <Lock className="size-3 text-secondary shrink-0" />
                  <span className="truncate">https://ethica.diu.edu.bd/verify/ETH-2026-MED-0419</span>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-secondary">
                  <CheckCircle2 className="size-3.5" />
                  <span className="hidden sm:inline">Certified</span>
                </div>
              </div>

              {/* Certificate Image Document - 4K Razor-Sharp Vector Clarity */}
              <div className="relative w-full aspect-[16/9] bg-slate-100 dark:bg-slate-900 p-2 sm:p-3 flex items-center justify-center">
                <Image
                  src="/images/certificate-master.webp"
                  alt="Official University Institutional Research Ethics Clearance Certificate with ornate gold embossed seal, QR code, and signatures"
                  width={1376}
                  height={768}
                  priority
                  quality={100}
                  unoptimized
                  className="w-full h-auto rounded-xl object-contain shadow-md select-none pointer-events-none"
                />
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
