"use client"

import * as React from "react"
import Link from "next/link"
import { ShieldCheck, Menu, X, GraduationCap, Scale } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 dark:border-slate-800/50 bg-white/60 dark:bg-[#071321]/60 backdrop-blur-xl supports-[backdrop-filter]:bg-white/50 shadow-[0_4px_30px_rgba(0,0,0,0.02)] transition-all">
      <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 2xl:px-20">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md">
          <div className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-xs">
            <ShieldCheck className="size-6" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-heading text-xl sm:text-2xl font-black tracking-tight text-foreground">
                ETHICA
              </span>
              <Badge variant="secondary" className="h-5 px-2 text-xs font-bold">
                v2.6
              </Badge>
            </div>
            <span className="text-micro text-muted-foreground font-semibold uppercase tracking-wider hidden sm:block">
              Research Ethics & Governance
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm sm:text-base font-semibold text-muted-foreground">
          <a
            href="#checker"
            className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:text-foreground"
          >
            Clearance Checker
          </a>
          <a
            href="#workflow"
            className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:text-foreground"
          >
            Workflow
          </a>
          <a
            href="#preview"
            className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:text-foreground"
          >
            Protocol Inspector
          </a>
          <a
            href="#stakeholders"
            className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:text-foreground"
          >
            Roles
          </a>
          <a
            href="#certificate"
            className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:text-foreground"
          >
            Digital Certificate
          </a>
          <a
            href="#faq"
            className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:text-foreground"
          >
            FAQ
          </a>
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden sm:flex items-center gap-2.5">
          <Link
            href="/login"
            className="text-xs sm:text-sm font-bold text-foreground/85 hover:text-primary dark:hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Researcher Sign In
          </Link>
          <Link
            href="/reviewer/login"
            className="inline-flex items-center justify-center text-xs sm:text-sm font-bold h-9 px-4 bg-[#002752] hover:bg-[#001c3d] text-white rounded-lg shadow-xs gap-1.5 transition-all"
          >
            <Scale className="size-3.5 text-amber-400" />
            <span>IRB Portal</span>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex md:hidden size-9 items-center justify-center rounded-md border border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-card/60 backdrop-blur-md text-foreground hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-[#071321]/80 backdrop-blur-xl px-4 py-4 shadow-md">
          <nav className="flex flex-col gap-3 text-sm font-medium">
            <a
              href="#checker"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Clearance Checker
              <Badge variant="secondary" className="text-micro">Self-Check</Badge>
            </a>
            <a
              href="#workflow"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              5-Stage Workflow
            </a>
            <a
              href="#preview"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Protocol Inspector
            </a>
            <a
              href="#stakeholders"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Stakeholder Views
            </a>
            <a
              href="#certificate"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Clearance Certificate
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Frequently Asked Questions
            </a>
            <div className="mt-2 flex flex-col gap-2 pt-2 border-t border-border/60">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center h-8 rounded-md border border-border bg-background px-3 text-xs font-bold text-foreground hover:bg-muted"
              >
                <GraduationCap className="size-3.5 text-secondary mr-1.5" />
                Researcher / User Login
              </Link>
              <Link
                href="/reviewer/login"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center h-8 rounded-md bg-[#002752] px-3 text-xs font-bold text-white hover:bg-[#001c3d]"
              >
                <Scale className="size-3.5 text-amber-400 mr-1.5" />
                IRB Committee Reviewer Login
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
