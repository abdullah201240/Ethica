"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Scale,
  Sparkles,
  CheckCircle2,
  GraduationCap,
  KeyRound,
  ArrowLeft,
  FileCheck2,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ReviewerLoginPage() {
  const router = useRouter()
  const [memberId, setMemberId] = React.useState("")
  const [passphrase, setPassphrase] = React.useState("")
  const [twoFactorCode, setTwoFactorCode] = React.useState("")
  const [boardType, setBoardType] = React.useState("biomedical")
  const [showPassphrase, setShowPassphrase] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [statusMessage, setStatusMessage] = React.useState<string | null>(null)

  const handleDemoFill = () => {
    setMemberId("charles.montgomery@diu.edu.bd")
    setPassphrase("IRB_Chair_SecureKey_2026!")
    setTwoFactorCode("849201")
    setBoardType("biomedical")
    setStatusMessage("Demo Committee Chair credentials & 2FA token loaded!")
    setTimeout(() => setStatusMessage(null), 3500)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatusMessage("Verifying institutional credentials & 2FA quorum token...")
    setTimeout(() => {
      setLoading(false)
      setStatusMessage("IRB Quorum verification successful! Entering Committee Chamber...")
      setTimeout(() => {
        router.push("/#preview")
      }, 1000)
    }, 1200)
  }

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-slate-900 via-[#001c3d] to-[#040e1a] text-white flex flex-col justify-between overflow-x-hidden">
      {/* Soft Ambient Background Luminous Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 w-[52rem] sm:w-[72rem] h-[28rem] bg-gradient-to-tr from-[#198754]/20 via-[#002752]/30 to-[#E0C23C]/10 blur-3xl rounded-full"
      />

      {/* Top Header Bar */}
      <header className="relative z-20 w-full px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 2xl:px-20 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#198754] to-emerald-400 text-white shadow-md shadow-[#198754]/25 transition-transform group-hover:scale-105">
            <Scale className="size-6" />
          </div>
          <div>
            <span className="font-sans text-xl font-black tracking-tight text-white block leading-tight">
              ETHICA
            </span>
            <span className="font-mono text-[0.65rem] font-bold text-amber-300 uppercase tracking-wider block">
              IRB Committee Portal
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-xs sm:text-sm font-bold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-full hover:bg-white/10 border border-transparent hover:border-white/10"
          >
            <GraduationCap className="size-3.5 text-[#198754]" />
            <span className="hidden sm:inline">Researcher / PI</span>
            <span>User Login →</span>
          </Link>
          <Link
            href="/"
            className="text-xs sm:text-sm font-semibold text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            <span className="hidden sm:inline">Back to</span> Home
          </Link>
        </div>
      </header>

      {/* Main Content Card Container */}
      <main className="relative z-10 w-full px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 2xl:px-20 py-8 sm:py-12 flex items-center justify-center">
        
        {/* Giant Ghost Watermark Typography */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-sans font-black text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] xl:text-[14rem] uppercase tracking-[0.18em] text-white/[0.025] select-none pointer-events-none whitespace-nowrap z-0 leading-none"
        >
          DELIBERATION
        </div>

        <div className="relative z-10 w-full max-w-lg rounded-2xl sm:rounded-3xl border border-white/15 bg-white/10 dark:bg-card/90 backdrop-blur-2xl shadow-2xl p-6 sm:p-10 space-y-6">
          
          {/* Form Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E0C23C]/15 text-[#E0C23C] text-xs font-bold border border-[#E0C23C]/30 mb-1">
              <Scale className="size-3.5" />
              <span>Ethical Review Board Deliberation</span>
            </div>
            <h1 className="font-sans text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
              IRB Committee Sign In
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              Authorized Institutional Review Board Members & Screening Officers
            </p>
          </div>

          {/* Quick Demo Autofill Banner */}
          <div className="p-3 sm:p-3.5 rounded-xl border border-amber-400/30 bg-amber-400/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-amber-200 font-medium">
              <Sparkles className="size-4 text-[#E0C23C] shrink-0" />
              <span>Testing reviewer access?</span>
            </div>
            <button
              type="button"
              onClick={handleDemoFill}
              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[#E0C23C] hover:bg-[#c9ad32] text-slate-950 shadow-2xs transition-colors shrink-0 cursor-pointer"
            >
              Autofill IRB Chair
            </button>
          </div>

          {statusMessage && (
            <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Committee Specialty Board Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                Assigned Review Board Specialty
              </label>
              <div className="relative">
                <FileCheck2 className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                <select
                  value={boardType}
                  onChange={(e) => setBoardType(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/20 bg-white/10 text-white text-xs sm:text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white transition-all appearance-none cursor-pointer"
                >
                  <option value="biomedical" className="bg-[#001c3d] text-white">
                    Biomedical & Clinical Health Sciences IRB
                  </option>
                  <option value="behavioral" className="bg-[#001c3d] text-white">
                    Social & Behavioral Research Ethics Committee
                  </option>
                  <option value="ai-ethics" className="bg-[#001c3d] text-white">
                    Data Privacy & AI Ethical Governance Board
                  </option>
                  <option value="screening" className="bg-[#001c3d] text-white">
                    Administrative Gatekeeper & Screening Depot
                  </option>
                </select>
              </div>
            </div>

            {/* Reviewer ID / Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                Committee Member Email / ID
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="chair.irb@diu.edu.bd"
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/20 bg-white/10 text-white placeholder:text-slate-400 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white transition-all"
                />
              </div>
            </div>

            {/* Passphrase */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  Institutional Passphrase
                </label>
                <a
                  href="#support"
                  onClick={(e) => {
                    e.preventDefault()
                    setStatusMessage("Contact Institutional Compliance Secretariat for credential reset.")
                  }}
                  className="text-xs font-semibold text-amber-300 hover:underline"
                >
                  Need credential help?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                <input
                  type={showPassphrase ? "text" : "password"}
                  required
                  placeholder="••••••••••••••••"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  className="w-full h-11 pl-10 pr-10 rounded-xl border border-white/20 bg-white/10 text-white placeholder:text-slate-400 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassphrase(!showPassphrase)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassphrase ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {/* 2FA / Hardware Token Code */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  2FA / Hardware Token Verification Code
                </label>
                <span className="text-[0.65rem] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Required for Quorum
                </span>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  maxLength={6}
                  placeholder="6-digit authenticator code (e.g. 849201)"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/20 bg-white/10 text-white placeholder:text-slate-400 text-sm font-mono tracking-widest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white transition-all"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-sm sm:text-base font-bold rounded-full bg-gradient-to-r from-[#198754] via-emerald-600 to-[#198754] hover:from-[#146c43] hover:to-[#146c43] text-white shadow-lg hover:shadow-emerald-500/25 gap-2 transition-all duration-300 cursor-pointer"
            >
              <span>{loading ? "Verifying Quorum..." : "Access Deliberation Chamber"}</span>
              <ArrowRight className="size-4" />
            </Button>
          </form>

          {/* Switch to User Portal Link */}
          <div className="pt-2 text-center border-t border-white/10">
            <p className="text-xs text-slate-300 font-medium">
              Submitting a protocol as a Principal Investigator?{" "}
              <Link href="/login" className="font-bold text-amber-300 hover:underline">
                Researcher Login →
              </Link>
            </p>
          </div>

        </div>
      </main>

      {/* Footer Security Badges */}
      <footer className="relative z-20 w-full px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 2xl:px-20 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 border-t border-white/10 bg-black/20 backdrop-blur-md">
        <span>© {new Date().getFullYear()} Ethica Institutional Review Board Deliberation Hub</span>
        <div className="flex items-center gap-4 text-[0.7rem] font-semibold">
          <span className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="size-3.5" />
            Cryptographically Audited
          </span>
          <span>•</span>
          <span>FIPS 140-3 2FA Supported</span>
        </div>
      </footer>
    </div>
  )
}
