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
  ChevronDown,
} from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  badgeVariant?: "default" | "success" | "warning" | "info"
  group?: string
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
  profileHref?: string
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
  profileHref,
  children,
}: DashboardShellProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const [collapsed, setCollapsed] = React.useState(false)

  // ── Derived color tokens ──────────────────────────────────────────────────
  const accentGradient =
    roleColor === "green"
      ? "from-[#198754] to-emerald-500"
      : roleColor === "gold"
        ? "from-[#002752] via-[#003875] to-[#198754]"
        : "from-[#002752] to-[#003875]"

  const activeNavBg =
    roleColor === "green"
      ? "bg-gradient-to-r from-[#198754]/12 to-emerald-500/5 text-[#198754] dark:text-emerald-300 border-l-2 border-[#198754]"
      : roleColor === "gold"
        ? "bg-gradient-to-r from-[#E0C23C]/12 to-amber-400/5 text-[#b09214] dark:text-[#E0C23C] border-l-2 border-[#E0C23C]"
        : "bg-gradient-to-r from-[#002752]/10 to-blue-500/5 text-[#002752] dark:text-sky-300 border-l-2 border-[#002752] dark:border-sky-400"

  const activeNavIconClass =
    roleColor === "green"
      ? "text-[#198754] dark:text-emerald-300"
      : roleColor === "gold"
        ? "text-[#b09214] dark:text-[#E0C23C]"
        : "text-[#002752] dark:text-sky-300"

  const activeCollapsedBg =
    roleColor === "green"
      ? "bg-gradient-to-br from-[#198754] to-emerald-500 text-white shadow-sm"
      : roleColor === "gold"
        ? "bg-gradient-to-br from-[#002752] to-[#003875] text-white shadow-sm"
        : "bg-gradient-to-br from-[#002752] to-[#003875] text-white shadow-sm"

  // Group nav items by their `group` field
  const grouped = React.useMemo(() => {
    const map: Record<string, NavItem[]> = {}
    navItems.forEach((item) => {
      const g = item.group ?? "_main"
      if (!map[g]) map[g] = []
      map[g].push(item)
    })
    return map
  }, [navItems])

  const groupKeys = Object.keys(grouped)

  const currentPageLabel = navItems.find((n) => n.href === pathname)?.label ?? "Dashboard"

  return (
    <div className="min-h-screen w-full bg-[#F5F7F9] dark:bg-[#071321] text-slate-900 dark:text-slate-100 flex font-sans">

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* ════════════════════════════════════════════════════════════════
          SIDEBAR
      ════════════════════════════════════════════════════════════════ */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen shrink-0 flex flex-col bg-white dark:bg-[#0C1E34] border-r border-border/75 transition-all duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
        } ${collapsed ? "w-[68px]" : "w-[240px]"}`}
      >
        {/* ── Brand header ───────────────────────────────────────── */}
        <div className={`px-3 ${collapsed ? "pt-4 pb-2" : "pt-4 pb-3"}`}>
          {collapsed ? (
            <div className="flex flex-col items-center gap-3">
              <Link href="/" className="group" title="Ethica Institutional Portal">
                <div
                  className={`flex size-10 items-center justify-center rounded-xl bg-gradient-to-tr ${accentGradient} text-white shadow-sm transition-all duration-200 group-hover:scale-105`}
                >
                  <ShieldCheck className="size-5" />
                </div>
              </Link>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => setCollapsed(false)}
                className="hidden lg:flex size-8 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 hover:text-[#002752] dark:hover:text-sky-300"
                title="Expand sidebar"
                aria-label="Expand sidebar"
              >
                <PanelLeft className="size-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between h-11">
              <Link href="/" className="flex items-center gap-3 group min-w-0">
                <div
                  className={`flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr ${accentGradient} text-white shadow-sm transition-all duration-200 group-hover:scale-105`}
                >
                  <ShieldCheck className="size-5" />
                </div>
                <div className="min-w-0 leading-none">
                  <span className="block text-[15px] font-black tracking-tight text-[#002752] dark:text-white">
                    ETHICA
                  </span>
                  <span className="block text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">
                    {roleTitle}
                  </span>
                </div>
              </Link>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => setCollapsed(true)}
                className="hidden lg:flex size-8 shrink-0 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
                aria-label="Collapse sidebar"
                title="Collapse sidebar"
              >
                <PanelLeft className="size-4" />
              </Button>
            </div>
          )}
        </div>

        {/* ── Divider ────────────────────────────────────────────── */}
        <div className="mx-3 h-px bg-slate-100 dark:bg-white/[0.06] shrink-0" />

        {/* ── Role status pill ───────────────────────────────────── */}
        {!collapsed && (
          <div className="px-3 py-2.5 shrink-0">
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 dark:bg-white/[0.03] border border-border/60">
              <div className="min-w-0">
                <span className="block text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  {roleBadge}
                </span>
                <span className="block text-[12px] font-semibold text-slate-700 dark:text-slate-200 mt-0.5 truncate">
                  {roleTitle}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">Live</span>
              </div>
            </div>
          </div>
        )}

        {/* ── Navigation ─────────────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto px-2.5 py-1 space-y-0.5 min-h-0">
          {groupKeys.map((group, gi) => (
            <div key={group} className={gi > 0 && !collapsed ? "pt-3" : ""}>
              {!collapsed && group !== "_main" && (
                <div className="px-2.5 pb-1.5 pt-1">
                  <span className="text-[9.5px] font-bold uppercase tracking-widest text-slate-400/70 dark:text-slate-600">
                    {group}
                  </span>
                </div>
              )}
              {grouped[group].map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    title={collapsed ? item.label : undefined}
                    className={`group relative flex items-center rounded-lg text-[13px] font-medium transition-all duration-150 ${
                      collapsed
                        ? `justify-center size-10 mx-auto my-0.5 ${
                            isActive ? activeCollapsedBg : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/[0.05] hover:text-slate-900 dark:hover:text-white"
                          }`
                        : `gap-3 px-3 py-2 w-full ${
                            isActive
                              ? activeNavBg
                              : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/[0.04] hover:text-slate-900 dark:hover:text-white"
                          }`
                    }`}
                  >
                    <item.icon
                      className={`shrink-0 size-4 ${
                        isActive && !collapsed
                          ? activeNavIconClass
                          : isActive && collapsed
                            ? "text-white"
                            : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                      }`}
                    />
                    {!collapsed && (
                      <>
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.badge && (
                          <span className="shrink-0 px-1.5 py-0.5 rounded-md text-[9.5px] font-mono font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* ── Bottom utilities + user card ───────────────────────── */}
        <div className="px-2.5 pb-3 pt-2 shrink-0">
          <div className="mx-0.5 mb-2 h-px bg-slate-100 dark:bg-white/[0.06]" />

          <Link
            href="/"
            title={collapsed ? "Institutional Portal" : undefined}
            className={`group flex items-center rounded-lg text-[13px] font-medium text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-all duration-150 ${
              collapsed ? "justify-center size-10 mx-auto" : "gap-3 px-3 py-2 w-full"
            }`}
          >
            <ExternalLink className="size-4 shrink-0" />
            {!collapsed && (
              <>
                <span className="flex-1 truncate">Institutional Portal</span>
                <ChevronRight className="size-3.5 text-slate-300 dark:text-slate-600" />
              </>
            )}
          </Link>

          <Link
            href={loginRoute}
            title={collapsed ? "Sign Out" : undefined}
            className={`group flex items-center rounded-lg text-[13px] font-medium text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 dark:hover:text-rose-300 transition-all duration-150 ${
              collapsed ? "justify-center size-10 mx-auto mt-0.5" : "gap-3 px-3 py-2 w-full"
            }`}
          >
            <LogOut className="size-4 shrink-0" />
            {!collapsed && <span className="flex-1 truncate">Sign Out Session</span>}
          </Link>

          {/* User profile card (expanded only) */}
          {!collapsed && (
            <>
              <div className="mx-0.5 my-2 h-px bg-slate-100 dark:bg-white/[0.06]" />
              {profileHref ? (
                <Link
                  href={profileHref}
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors cursor-pointer group"
                >
                  <div
                    className={`flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${accentGradient} text-white text-[11px] font-bold shadow-sm`}
                  >
                    {user.avatarInitials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block text-[12px] font-semibold text-slate-800 dark:text-slate-100 group-hover:text-[#002752] dark:group-hover:text-sky-300 transition-colors truncate">
                      {user.name}
                    </span>
                    <span className="block text-[10px] text-slate-400 dark:text-slate-500 truncate">
                      {user.title}
                    </span>
                  </div>
                  <ChevronRight className="size-3.5 text-slate-300 dark:text-slate-600 group-hover:text-slate-500 shrink-0" />
                </Link>
              ) : (
                <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors cursor-pointer">
                  <div
                    className={`flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${accentGradient} text-white text-[11px] font-bold shadow-sm`}
                  >
                    {user.avatarInitials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block text-[12px] font-semibold text-slate-800 dark:text-slate-100 truncate">
                      {user.name}
                    </span>
                    <span className="block text-[10px] text-slate-400 dark:text-slate-500 truncate">
                      {user.email}
                    </span>
                  </div>
                  <ChevronDown className="size-3.5 text-slate-300 dark:text-slate-600 shrink-0" />
                </div>
              )}
            </>
          )}
        </div>
      </aside>

      {/* ════════════════════════════════════════════════════════════════
          MAIN CONTENT AREA
      ════════════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">

        {/* ── TOP HEADER BAR ────────────────────────────────────── */}
        <header className="sticky top-0 z-30 w-full h-[60px] flex items-center px-4 sm:px-5 gap-3 bg-white/90 dark:bg-[#0C1E34]/90 backdrop-blur-md border-b border-border/60">

          {/* Left: Mobile toggle + collapsed-desktop expand + breadcrumb */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex lg:hidden size-9 text-slate-500 dark:text-slate-400"
              aria-label="Toggle Sidebar"
            >
              {sidebarOpen ? <X className="size-[18px]" /> : <Menu className="size-[18px]" />}
            </Button>

            {/* Page breadcrumb – desktop only */}
            <div className="hidden lg:flex items-center gap-1.5 pl-0.5">
              <span className="text-[13px] font-semibold text-slate-800 dark:text-slate-100">
                {currentPageLabel}
              </span>
            </div>
          </div>

          {/* Centre: Search */}
          <div className="flex-1 max-w-lg hidden md:block mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none z-10" />
              <Input
                type="text"
                placeholder="Search protocols, ethics ID, approvals… (⌘K)"
                className="w-full h-9 pl-9 pr-14 rounded-lg bg-slate-100/80 dark:bg-white/[0.04] border-transparent hover:border-border/50 text-[13px]"
              />
              <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden lg:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium text-slate-400 bg-slate-200/70 dark:bg-white/5 dark:text-slate-500">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 ml-auto shrink-0">

            {/* Primary action button */}
            {actionButton && (
              actionButton.href ? (
                <Link
                  href={actionButton.href}
                  className={`hidden sm:inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-gradient-to-r ${accentGradient} text-white text-[13px] font-semibold shadow-sm hover:shadow-md hover:opacity-95 transition-all duration-150 cursor-pointer`}
                >
                  <actionButton.icon className="size-3.5" />
                  <span>{actionButton.label}</span>
                </Link>
              ) : (
                <Button
                  type="button"
                  onClick={actionButton.onClick}
                  className={`hidden sm:inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-gradient-to-r ${accentGradient} text-white text-[13px] font-semibold shadow-sm hover:shadow-md hover:opacity-95`}
                >
                  <actionButton.icon className="size-3.5" />
                  <span>{actionButton.label}</span>
                </Button>
              )
            )}

            {/* Notifications */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="relative flex size-9 text-slate-500 dark:text-slate-400"
              aria-label="Notifications"
            >
              <Bell className="size-[17px]" />
              <span className="absolute top-[9px] right-[9px] size-[7px] rounded-full bg-emerald-500 ring-[1.5px] ring-white dark:ring-[#0C1E34]" />
            </Button>

            {/* Theme toggle */}
            <ThemeToggle />

            {/* Divider */}
            <div className="w-px h-5 bg-border/75 hidden sm:block mx-0.5" />

            {/* User profile pill */}
            {profileHref ? (
              <Link
                href={profileHref}
                className="flex items-center gap-2 pl-0.5 pr-2 py-1 h-auto rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-colors"
                aria-label="Profile"
              >
                <div
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${accentGradient} text-white text-[11px] font-bold shadow-sm`}
                >
                  {user.avatarInitials}
                </div>
                <div className="hidden xl:block text-left leading-tight">
                  <span className="block text-[12px] font-semibold text-slate-800 dark:text-slate-100 truncate max-w-[110px]">
                    {user.name}
                  </span>
                  <span className="block text-[10px] text-slate-400 dark:text-slate-500 truncate max-w-[110px]">
                    {user.title}
                  </span>
                </div>
              </Link>
            ) : (
              <Button
                type="button"
                variant="ghost"
                className="flex items-center gap-2 pl-0.5 pr-2 py-1 h-auto rounded-lg"
                aria-label="Profile menu"
              >
                <div
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${accentGradient} text-white text-[11px] font-bold shadow-sm`}
                >
                  {user.avatarInitials}
                </div>
                <div className="hidden xl:block text-left leading-tight">
                  <span className="block text-[12px] font-semibold text-slate-800 dark:text-slate-100 truncate max-w-[110px]">
                    {user.name}
                  </span>
                  <span className="block text-[10px] text-slate-400 dark:text-slate-500 truncate max-w-[110px]">
                    {user.title}
                  </span>
                </div>
                <ChevronDown className="hidden xl:block size-3.5 text-slate-300 dark:text-slate-600" />
              </Button>
            )}
          </div>
        </header>

        {/* ── MAIN VIEW AREA ──────────────────────────────────────── */}
        <main className="flex-1 w-full p-4 sm:p-6 md:p-8 max-w-full overflow-x-hidden">
          {children}
        </main>

        {/* ── FOOTER ─────────────────────────────────────────────── */}
        <footer className="w-full bg-white/60 dark:bg-[#0C1E34]/60 backdrop-blur-md border-t border-border/50 px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400 dark:text-slate-500">
          <div className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-600 dark:text-slate-300">
              Ethica Ledger: SHA-256 Verified
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span>WMA Declaration of Helsinki Aligned</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <Lock className="size-3 text-[#198754]" />
              <span>Encrypted Session</span>
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span>© {new Date().getFullYear()} Daffodil International University IRB</span>
          </div>
        </footer>
      </div>
    </div>
  )
}
