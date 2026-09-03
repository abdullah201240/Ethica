"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ShieldCheck,
  Bell,
  Search,
  LogOut,
  Menu,
  X,
  Lock,
  ChevronRight,
  ExternalLink,
  PanelLeft,
} from "lucide-react"
import { ThemeToggle } from "./theme-toggle"

export interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  badgeVariant?: "default" | "success" | "warning" | "info"
}

export interface DashboardShellProps {
  role: "user" | "reviewer" | "admin"
  roleTitle: string
  roleBadge: string
  roleColor: "green" | "navy" | "gold"
  user: {
    name: string
    title: string
    email: string
    avatarInitials: string
  }
  navItems: NavItem[]
  loginRoute: string
  actionButton?: {
    label: string
    icon: React.ComponentType<{ className?: string }>
    onClick?: () => void
    href?: string
  }
  children: React.ReactNode
}

export function DashboardShell({
  roleTitle,
  roleBadge,
  roleColor,
  user,
  navItems,
  loginRoute,
  actionButton,
  children,
}: DashboardShellProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const [collapsed, setCollapsed] = React.useState(false)

  const badgeColorClass =
    roleColor === "green"
      ? "bg-[#198754]/10 text-[#198754]"
      : roleColor === "gold"
        ? "bg-[#E0C23C]/15 text-[#b09214] dark:text-[#E0C23C]"
        : "bg-[#002752]/10 text-[#002752] dark:text-sky-300"

  const brandIconBg =
    roleColor === "green"
      ? "from-[#198754] to-emerald-600"
      : roleColor === "gold"
        ? "from-[#002752] via-[#003875] to-[#198754]"
        : "from-[#002752] to-[#001c3d]"

  return (
    <div className="min-h-screen w-full bg-slate-50/70 dark:bg-[#071321] text-slate-900 dark:text-slate-100 flex flex-row font-sans transition-colors duration-200">
      
      {/* Mobile Sidebar Backdrop Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Responsive Collapsible Sidebar (ChatGPT Style: Top Left Logo & Right Button) */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen shrink-0 bg-white/95 dark:bg-[#0C1E34]/95 backdrop-blur-md flex flex-col justify-between p-3 sm:p-4 transition-all duration-300 ${
          sidebarOpen ? "translate-x-0 w-64 shadow-xl lg:shadow-none" : "-translate-x-full lg:translate-x-0"
        } ${collapsed ? "lg:w-20" : "lg:w-64"}`}
      >
        {/* Top Section: Brand Logo on Left, PanelLeft Toggle on Right */}
        <div className="space-y-4">
          
          {collapsed ? (
            /* Collapsed Small Mode: Centered Logo + Expand Button */
            <div className="flex flex-col items-center gap-3">
              <Link href="/" className="group" title="Ethica Institutional Portal">
                <div className={`flex size-9 items-center justify-center rounded-xl bg-gradient-to-tr ${brandIconBg} text-white transition-transform group-hover:scale-105`}>
                  <ShieldCheck className="size-5" />
                </div>
              </Link>
              <button
                type="button"
                onClick={() => setCollapsed(false)}
                className="hidden lg:flex size-9 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                title="Expand sidebar"
                aria-label="Expand sidebar"
              >
                <PanelLeft className="size-5 text-[#002752] dark:text-sky-400" />
              </button>
            </div>
          ) : (
            /* Expanded Large Mode (Exactly matching ChatGPT screenshot) */
            <div className="flex items-center justify-between gap-2 h-10 px-1">
              {/* Left Side: Brand Logo & Title */}
              <Link href="/" className="flex items-center gap-2.5 group min-w-0">
                <div className={`flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr ${brandIconBg} text-white transition-transform group-hover:scale-105`}>
                  <ShieldCheck className="size-5" />
                </div>
                <div className="min-w-0">
                  <span className="font-sans text-base font-black tracking-tight text-[#002752] dark:text-white block leading-tight">
                    ETHICA
                  </span>
                  <span className="font-mono text-[0.6rem] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block truncate">
                    {roleTitle}
                  </span>
                </div>
              </Link>

              {/* Right Side: PanelLeft Collapse Button (ChatGPT style) */}
              <button
                type="button"
                onClick={() => setCollapsed(true)}
                className="hidden lg:flex size-8 shrink-0 items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                aria-label="Collapse sidebar"
                title="Collapse sidebar"
              >
                <PanelLeft className="size-5" />
              </button>
            </div>
          )}

          {/* Role Badge Indicator */}
          {!collapsed && (
            <div className={`p-2.5 rounded-xl ${badgeColorClass} flex items-center justify-between`}>
              <div>
                <span className="font-mono text-[0.65rem] font-black uppercase tracking-wider block">
                  {roleBadge}
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-white block">
                  {roleTitle}
                </span>
              </div>
              <span className="size-2 rounded-full bg-[#198754] animate-pulse" />
            </div>
          )}

          {/* Navigation Menu */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  title={collapsed ? item.label : undefined}
                  className={`flex items-center rounded-lg text-xs font-bold transition-all ${
                    collapsed
                      ? "justify-center size-12 mx-auto"
                      : "justify-between px-3 py-2 w-full"
                  } ${
                    isActive
                      ? "bg-[#002752] text-white dark:bg-sky-500/20 dark:text-sky-300"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <item.icon className="size-4 shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </div>
                  {!collapsed && item.badge && (
                    <span className="px-1.5 py-0.5 rounded text-[0.65rem] font-mono font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Utility / Sign Out */}
        <div className="space-y-1.5 pt-4">
          <Link
            href="/"
            title={collapsed ? "Institutional Portal" : undefined}
            className={`flex items-center rounded-lg text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
              collapsed ? "justify-center size-12 mx-auto" : "justify-between px-3 py-2 w-full"
            }`}
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="size-3.5" />
              {!collapsed && <span>Institutional Portal</span>}
            </div>
            {!collapsed && <ChevronRight className="size-3 text-slate-400" />}
          </Link>

          <Link
            href={loginRoute}
            title={collapsed ? "Sign Out Session" : undefined}
            className={`flex items-center rounded-lg text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer ${
              collapsed ? "justify-center size-12 mx-auto" : "gap-2 px-3 py-2 w-full"
            }`}
          >
            <LogOut className="size-3.5" />
            {!collapsed && <span>Sign Out Session</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content Area (Header + Main Body + Footer) */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* Top Header Bar (No Brand Logo in Header, Borderless, Shadowless) */}
        <header className="sticky top-0 z-30 w-full h-16 bg-white/90 dark:bg-[#0C1E34]/90 backdrop-blur-md px-4 sm:px-6 md:px-8 flex items-center justify-between gap-4">
          
          {/* Header Left: Trigger on Mobile & Re-Open Trigger when Collapsed */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex lg:hidden size-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
              aria-label="Toggle Sidebar"
            >
              {sidebarOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>

            {/* When collapsed on desktop: show small re-open icon button in header */}
            {collapsed && (
              <button
                type="button"
                onClick={() => setCollapsed(false)}
                className="hidden lg:flex size-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                title="Expand sidebar"
                aria-label="Expand sidebar"
              >
                <PanelLeft className="size-5 text-[#002752] dark:text-sky-400" />
              </button>
            )}
          </div>

          {/* Global Search & Action Center */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search protocols, ethics ID, approvals, or guidelines... (⌘K)"
                className="w-full h-9 pl-9 pr-4 rounded-lg bg-slate-100/80 dark:bg-slate-900/60 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002752] dark:focus-visible:ring-sky-500"
              />
            </div>
          </div>

          {/* Right Header Utilities */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {actionButton && (
              actionButton.href ? (
                <Link
                  href={actionButton.href}
                  className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-[#002752] hover:bg-[#001c3d] text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  <actionButton.icon className="size-4 text-[#198754]" />
                  <span>{actionButton.label}</span>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={actionButton.onClick}
                  className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-[#002752] hover:bg-[#001c3d] text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  <actionButton.icon className="size-4 text-[#198754]" />
                  <span>{actionButton.label}</span>
                </button>
              )
            )}

            {/* Notifications Indicator */}
            <button
              type="button"
              className="relative flex size-9 items-center justify-center rounded-lg bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              aria-label="Institutional Notifications"
            >
              <Bell className="size-4" />
              <span className="absolute top-2 right-2 size-2 rounded-full bg-[#198754]" />
            </button>

            {/* Next Themes Dark/White Toggle */}
            <ThemeToggle />

            {/* User Profile Pill (No Border) */}
            <div className="flex items-center gap-2.5 pl-1">
              <div className="flex size-9 items-center justify-center rounded-full bg-[#002752] text-white text-xs font-bold">
                {user.avatarInitials}
              </div>
              <div className="hidden xl:block text-left leading-tight">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate max-w-[120px]">
                  {user.name}
                </span>
                <span className="text-[0.65rem] text-slate-500 dark:text-slate-400 block truncate max-w-[120px]">
                  {user.title}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Main View Area */}
        <main className="flex-1 w-full p-4 sm:p-6 md:p-8 lg:p-10 max-w-full overflow-x-hidden">
          {children}
        </main>

        {/* Dashboard Global Footer (No Border, No Shadow) */}
        <footer className="w-full bg-white/70 dark:bg-[#0C1E34]/70 backdrop-blur-md px-4 sm:px-6 md:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-500" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Ethica Ledger: SHA-256 Verified
            </span>
            <span>•</span>
            <span>WMA Declaration of Helsinki Aligned</span>
          </div>
          <div className="flex items-center gap-3 text-[0.7rem]">
            <span className="flex items-center gap-1">
              <Lock className="size-3 text-[#198754]" />
              Encrypted Session
            </span>
            <span>•</span>
            <span>© {new Date().getFullYear()} Daffodil International University IRB</span>
          </div>
        </footer>
      </div>
    </div>
  )
}
