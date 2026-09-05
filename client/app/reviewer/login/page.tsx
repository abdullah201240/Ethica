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
  ArrowLeft,
} from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { reviewerLoginSchema, type ReviewerLoginInput } from "@/lib/schemas"

export default function ReviewerLoginPage() {
  const router = useRouter()
  const [showPassphrase, setShowPassphrase] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [statusMessage, setStatusMessage] = React.useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ReviewerLoginInput>({
    resolver: zodResolver(reviewerLoginSchema),
    mode: "onChange",
    defaultValues: {
      memberId: "",
      passphrase: "",
    },
  })

  const handleDemoFill = () => {
    setValue("memberId", "charles.montgomery@diu.edu.bd", { shouldValidate: true })
    setValue("passphrase", "IRB_Chair_SecureKey_2026!", { shouldValidate: true })
    setStatusMessage("Demo Committee Chair credentials loaded!")
    setTimeout(() => setStatusMessage(null), 3500)
  }

  const onSubmit = () => {
    setLoading(true)
    setStatusMessage("Verifying institutional committee credentials...")
    setTimeout(() => {
      setLoading(false)
      setStatusMessage("IRB verification successful! Entering Committee Chamber...")
      setTimeout(() => {
        router.push("/reviewer/dashboard")
      }, 1000)
    }, 1200)
  }

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-slate-50/70 via-white to-slate-50/70 dark:from-[#040e1a] dark:via-[#071321] dark:to-[#040e1a] text-foreground flex flex-col justify-between overflow-x-hidden">
      {/* Soft Ambient Background Luminous Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 w-[52rem] sm:w-[72rem] h-[28rem] bg-gradient-to-tr from-[#198754]/8 via-[#002752]/6 to-[#E0C23C]/8 blur-3xl rounded-full"
      />

      {/* Top Header Bar */}
      <header className="relative z-20 w-full px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 2xl:px-20 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#002752] via-[#003875] to-[#002752] text-white transition-transform group-hover:scale-105">
            <Scale className="size-6 text-[#E0C23C]" />
          </div>
          <div>
            <span className="font-sans text-xl font-black tracking-tight text-primary dark:text-white block leading-tight">
              ETHICA
            </span>
            <span className="font-mono text-micro font-bold text-slate-500 uppercase tracking-wider block">
              IRB Committee Portal
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200"
          >
            <GraduationCap className="size-3.5 text-secondary" />
            <span className="hidden sm:inline">Researcher / PI</span>
            <span>User Login →</span>
          </Link>
          <Link
            href="/"
            className="text-xs sm:text-sm font-semibold text-slate-500 hover:text-primary dark:hover:text-white flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            <span className="hidden sm:inline">Back to</span> Home
          </Link>
        </div>
      </header>

      {/* Main Content Card Container (Zero Shadow) */}
      <main className="relative z-10 w-full px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 2xl:px-20 py-8 sm:py-12 flex items-center justify-center">
        
        {/* Giant Ghost Watermark Typography */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-sans font-black text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] xl:text-[14rem] uppercase tracking-[0.18em] text-primary/[0.03] dark:text-white/[0.025] select-none pointer-events-none whitespace-nowrap z-0 leading-none"
        >
          DELIBERATION
        </div>

        <div className="relative z-10 w-full max-w-lg rounded-2xl sm:rounded-3xl border border-slate-200/85 dark:border-slate-800/80 bg-white/95 dark:bg-card/95 backdrop-blur-xl p-6 sm:p-10 space-y-6">
          
          {/* Form Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#002752]/10 text-primary dark:text-amber-300 text-xs font-bold border border-[#002752]/20 mb-1">
              <Scale className="size-3.5 text-primary dark:text-[#E0C23C]" />
              <span>Ethical Review Board Deliberation</span>
            </div>
            <h1 className="font-sans text-2xl sm:text-3xl font-black text-primary dark:text-white tracking-tight uppercase">
              IRB Committee Sign In
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">
              Authorized Institutional Review Board Members & Screening Officers
            </p>
          </div>

          {/* Quick Demo Autofill Banner */}
          <div className="p-3 sm:p-3.5 rounded-xl border border-amber-300/80 dark:border-amber-800/60 bg-amber-50/70 dark:bg-amber-950/40 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-amber-900 dark:text-amber-300 font-medium">
              <Sparkles className="size-4 text-[#E0C23C] shrink-0" />
              <span>Testing reviewer access?</span>
            </div>
            <Button
              type="button"
              size="sm"
              onClick={handleDemoFill}
              className="h-7 text-xs font-bold px-3 py-1.5 rounded-lg bg-[#002752] hover:bg-[#001c3d] text-white transition-colors shrink-0 cursor-pointer shadow-none"
            >
              Autofill IRB Chair
            </Button>
          </div>

          {statusMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Credentials Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            
            {/* Reviewer ID / Email */}
            <div className="space-y-1.5">
              <Label htmlFor="memberId" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                Committee Member Email / ID
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none z-10" />
                <Input
                  id="memberId"
                  type="email"
                  placeholder="chair.irb@diu.edu.bd"
                  {...register("memberId")}
                  aria-invalid={Boolean(errors.memberId)}
                  className={`w-full h-11 pl-10 pr-4 rounded-xl border ${
                    errors.memberId
                      ? "border-rose-500 ring-1 ring-rose-500/20 bg-rose-50/20"
                      : "border-slate-200/85 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60"
                  } text-foreground placeholder:text-slate-400 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002752] dark:focus-visible:ring-white transition-all`}
                />
              </div>
              {errors.memberId && (
                <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold mt-1">
                  {errors.memberId.message}
                </p>
              )}
            </div>

            {/* Passphrase */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="passphrase" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                  Institutional Passphrase
                </Label>
                <a
                  href="#support"
                  onClick={(e) => {
                    e.preventDefault()
                    setStatusMessage("Contact Institutional Compliance Secretariat for credential reset.")
                  }}
                  className="text-xs font-semibold text-secondary hover:underline"
                >
                  Need credential help?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none z-10" />
                <Input
                  id="passphrase"
                  type={showPassphrase ? "text" : "password"}
                  placeholder="••••••••••••••••"
                  {...register("passphrase")}
                  aria-invalid={Boolean(errors.passphrase)}
                  className={`w-full h-11 pl-10 pr-10 rounded-xl border ${
                    errors.passphrase
                      ? "border-rose-500 ring-1 ring-rose-500/20 bg-rose-50/20"
                      : "border-slate-200/85 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60"
                  } text-foreground placeholder:text-slate-400 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002752] dark:focus-visible:ring-white transition-all`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPassphrase(!showPassphrase)}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 size-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-transparent cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassphrase ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </Button>
              </div>
              {errors.passphrase && (
                <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold mt-1">
                  {errors.passphrase.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-sm sm:text-base font-bold rounded-full bg-gradient-to-r from-[#002752] via-[#003875] to-[#002752] hover:from-[#001c3d] hover:to-[#001c3d] text-white gap-2 transition-all duration-300 cursor-pointer"
            >
              <span>{loading ? "Authenticating..." : "Access Deliberation Chamber"}</span>
              <ArrowRight className="size-4" />
            </Button>
          </form>

          {/* Switch to User Portal Link */}
          <div className="pt-2 text-center border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs text-muted-foreground font-medium">
              Submitting a protocol as a Principal Investigator?{" "}
              <Link href="/login" className="font-bold text-primary dark:text-sky-400 hover:underline">
                Researcher Login →
              </Link>
            </p>
          </div>

        </div>
      </main>

      {/* Footer Security Badges */}
      <footer className="relative z-20 w-full px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 2xl:px-20 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground border-t border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-card/40 backdrop-blur-md">
        <span>© {new Date().getFullYear()} Ethica Institutional Review Board Deliberation Hub</span>
        <div className="flex items-center gap-4 text-micro font-semibold">
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="size-3.5" />
            Cryptographically Audited
          </span>
          <span>•</span>
          <span>Institutional Quorum Access</span>
        </div>
      </footer>
    </div>
  )
}
