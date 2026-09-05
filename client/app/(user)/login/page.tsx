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
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Scale,
  ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { userLoginSchema } from "@/lib/schemas"

export default function UserLoginPage() {
  const router = useRouter()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [rememberMe, setRememberMe] = React.useState(true)
  const [loading, setLoading] = React.useState(false)
  const [statusMessage, setStatusMessage] = React.useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = React.useState<{ email?: string; password?: string }>({})

  const handleDemoFill = () => {
    setEmail("elena.rostova@diu.edu.bd")
    setPassword("EthicaSecure2026!")
    setFieldErrors({})
    setStatusMessage("Demo Principal Investigator credentials loaded!")
    setTimeout(() => setStatusMessage(null), 3500)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Zod Runtime Schema Validation
    const validation = userLoginSchema.safeParse({ email, password, rememberMe })
    if (!validation.success) {
      const flattened = validation.error.flatten().fieldErrors
      setFieldErrors({
        email: flattened.email?.[0],
        password: flattened.password?.[0],
      })
      return
    }

    setFieldErrors({})
    setLoading(true)
    setStatusMessage("Authenticating with institutional directory...")
    setTimeout(() => {
      setLoading(false)
      setStatusMessage("Login successful! Redirecting to Investigator Dashboard...")
      setTimeout(() => {
        router.push("/dashboard")
      }, 1000)
    }, 1200)
  }

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-slate-50/70 via-white to-slate-50/70 dark:from-[#040e1a] dark:via-[#071321] dark:to-[#040e1a] text-slate-900 dark:text-white flex flex-col justify-between overflow-x-hidden">
      {/* Soft Ambient Background Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 w-[52rem] sm:w-[72rem] h-[28rem] bg-gradient-to-tr from-[#198754]/10 via-[#002752]/8 to-sky-100/20 blur-3xl rounded-full"
      />

      {/* Top Header Bar */}
      <header className="relative z-20 w-full px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 2xl:px-20 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#002752] via-[#003875] to-[#002752] text-white transition-transform group-hover:scale-105">
            <ShieldCheck className="size-6 text-[#198754]" />
          </div>
          <div>
            <span className="font-sans text-xl font-black tracking-tight text-[#002752] dark:text-white block leading-tight">
              ETHICA
            </span>
            <span className="font-mono text-[0.65rem] font-bold text-slate-500 uppercase tracking-wider block">
              Investigator Portal
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/reviewer/login"
            className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-[#002752] dark:hover:text-white flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200"
          >
            <Scale className="size-3.5 text-blue-600" />
            <span className="hidden sm:inline">IRB Committee</span>
            <span>Reviewer Login →</span>
          </Link>
          <Link
            href="/"
            className="text-xs sm:text-sm font-semibold text-slate-500 hover:text-[#002752] dark:hover:text-white flex items-center gap-1 transition-colors"
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
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-sans font-black text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] xl:text-[14rem] uppercase tracking-[0.18em] text-[#002752]/[0.03] dark:text-white/[0.025] select-none pointer-events-none whitespace-nowrap z-0 leading-none"
        >
          INVESTIGATOR
        </div>

        <div className="relative z-10 w-full max-w-lg rounded-2xl sm:rounded-3xl border border-slate-200/85 dark:border-slate-800/80 bg-white/95 dark:bg-card/95 backdrop-blur-xl p-6 sm:p-10 space-y-6">
          
          {/* Form Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#198754]/10 text-[#198754] text-xs font-bold border border-[#198754]/25 mb-1">
              <GraduationCap className="size-3.5" />
              <span>Researcher & PI Portal</span>
            </div>
            <h1 className="font-sans text-xl sm:text-2xl font-black text-[#002752] dark:text-white tracking-tight uppercase whitespace-nowrap">
              Sign In to Your Workspace
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              Create, submit, and track protocol clearance with your academic credentials.
            </p>
          </div>

          {/* Quick Demo Autofill Banner */}
          <div className="p-3 sm:p-3.5 rounded-xl border border-emerald-200/80 dark:border-emerald-800/60 bg-emerald-50/70 dark:bg-emerald-950/40 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300 font-medium">
              <Sparkles className="size-4 text-[#198754] shrink-0" />
              <span>Testing the platform?</span>
            </div>
            <Button
              type="button"
              size="sm"
              onClick={handleDemoFill}
              className="h-7 text-xs font-bold px-3 py-1.5 rounded-lg bg-[#198754] hover:bg-[#146c43] text-white transition-colors shrink-0 cursor-pointer shadow-none"
            >
              Autofill Demo PI
            </Button>
          </div>

          {statusMessage && (
            <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/50 border border-sky-200 text-sky-800 dark:text-sky-300 text-xs font-semibold flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="size-4 text-sky-600 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Single Google SSO Button */}
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setEmail("elena.rostova@gmail.com")
              setPassword("Google_Workspace_OAuth")
              setStatusMessage("Google Workspace selected.")
            }}
            className="w-full h-11 text-xs sm:text-sm font-bold border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-2.5 rounded-xl cursor-pointer"
          >
            <svg className="size-4.5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </Button>

          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            <span className="absolute bg-white dark:bg-card px-3 text-[0.7rem] font-bold uppercase tracking-wider text-slate-400">
              Or with email
            </span>
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                Institutional Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none z-10" />
                <Input
                  id="email"
                  type="email"
                  placeholder="investigator@diu.edu.bd"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: undefined }))
                  }}
                  aria-invalid={Boolean(fieldErrors.email)}
                  className={`w-full h-11 pl-10 pr-4 rounded-xl border bg-slate-50/60 dark:bg-slate-900/60 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 transition-all ${
                    fieldErrors.email
                      ? "border-rose-500 focus-visible:ring-rose-500"
                      : "border-slate-200/85 dark:border-slate-800 focus-visible:ring-[#002752] dark:focus-visible:ring-white"
                  }`}
                />
              </div>
              {fieldErrors.email && (
                <p className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 pt-0.5 animate-fade-in">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                  Password
                </Label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault()
                    setStatusMessage("Password recovery instructions sent to your institutional email.")
                  }}
                  className="text-xs font-semibold text-[#198754] hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none z-10" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: undefined }))
                  }}
                  aria-invalid={Boolean(fieldErrors.password)}
                  className={`w-full h-11 pl-10 pr-10 rounded-xl border bg-slate-50/60 dark:bg-slate-900/60 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 transition-all ${
                    fieldErrors.password
                      ? "border-rose-500 focus-visible:ring-rose-500"
                      : "border-slate-200/85 dark:border-slate-800 focus-visible:ring-[#002752] dark:focus-visible:ring-white"
                  }`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 size-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-transparent cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </Button>
              </div>
              {fieldErrors.password && (
                <p className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 pt-0.5 animate-fade-in">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(Boolean(checked))}
                className="cursor-pointer"
              />
              <Label htmlFor="remember" className="text-xs text-slate-600 dark:text-slate-400 font-medium cursor-pointer">
                Keep my active session signed in on this device
              </Label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-sm sm:text-base font-bold rounded-full bg-gradient-to-r from-[#002752] via-[#003875] to-[#002752] hover:from-[#001c3d] hover:to-[#001c3d] text-white gap-2 transition-all duration-300 cursor-pointer"
            >
              <span>{loading ? "Authenticating..." : "Access Researcher Workspace"}</span>
              <ArrowRight className="size-4" />
            </Button>
          </form>

          {/* Switch to Reviewer Portal Link */}
          <div className="pt-2 text-center border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Are you an appointed IRB Ethics Committee Reviewer?{" "}
              <Link href="/reviewer/login" className="font-bold text-[#002752] dark:text-sky-400 hover:underline">
                Committee Login →
              </Link>
            </p>
          </div>

        </div>
      </main>

      {/* Footer Security Badges */}
      <footer className="relative z-20 w-full px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 2xl:px-20 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-card/40 backdrop-blur-md">
        <span>© {new Date().getFullYear()} Ethica Research Ethics System • Institutional User Portal</span>
        <div className="flex items-center gap-4 text-[0.7rem] font-semibold">
          <span className="flex items-center gap-1">
            <Lock className="size-3 text-[#198754]" />
            AES-256 GCM Encrypted
          </span>
          <span>•</span>
          <span>FERPA & HIPAA Compliant</span>
        </div>
      </footer>
    </div>
  )
}
