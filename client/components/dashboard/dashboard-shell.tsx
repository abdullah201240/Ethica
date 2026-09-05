"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  ShieldCheck,
  Bell,
  LogOut,
  Menu,
  X,
  Lock,
  PanelLeft,
  ChevronDown,
} from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { DASHBOARD_LAYOUT_PADDING } from "./dashboard-container"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"

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
    avatarImage?: string
  }
  navItems: NavItem[]
  loginRoute: string
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
  profileHref,
  children,
}: DashboardShellProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const [collapsed, setCollapsed] = React.useState(false)

  // Derive current hash segment from pathname (no manual history tracking)
  const currentHash = React.useMemo(() => {
    const hashIndex = pathname.indexOf("#")
    return hashIndex >= 0 ? pathname.slice(hashIndex) : ""
  }, [pathname])

  const isItemActive = React.useCallback(
    (itemHref: string) => {
      // Strip hash from current pathname for path comparison
      const currentPath = pathname.split("#")[0]
      const [itemPath, itemHash] = itemHref.split("#")
      const hasHash = Boolean(itemHash)

      if (hasHash) {
        return currentPath === itemPath && currentHash === `#${itemHash}`
      }
      if (currentPath === itemPath) {
        if (currentHash) {
          const matchesOtherHash = navItems.some((other) => {
            const [, otherHash] = other.href.split("#")
            return Boolean(otherHash) && currentHash === `#${otherHash}`
          })
          return !matchesOtherHash
        }
        return true
      }
      if (
        itemPath !== "/admin" &&
        itemPath !== "/admin/dashboard" &&
        itemPath !== "/reviewer" &&
        itemPath !== "/reviewer/dashboard" &&
        itemPath !== "/dashboard" &&
        currentPath.startsWith(itemPath + "/")
      ) {
        return true
      }
      return false
    },
    [pathname, currentHash, navItems]
  )

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setSidebarOpen(false)
    const [targetPath, targetHash] = href.split("#")
    const currentPath = pathname.split("#")[0]

    if (targetHash && (targetPath === currentPath || !targetPath)) {
      // Same-page hash navigation: prevent default, scroll smoothly
      e.preventDefault()
      const el = document.getElementById(targetHash)
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" })
      }
      // Update URL hash via Next.js router (stays in sync with router state)
      router.push(`${currentPath}#${targetHash}`, { scroll: false })
    }
    // For cross-path navigation, let Next.js <Link> handle client-side transition
  }

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
  const activeItem = navItems.find((n) => isItemActive(n.href))
  const currentPageLabel = activeItem?.label ?? "Dashboard"

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
                  <span className="block text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5 truncate" title={`${roleBadge} • ${roleTitle}`}>
                    {roleBadge ? `${roleBadge} • ` : ""}{roleTitle}
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
        <div className="mx-3 mb-2 h-px bg-slate-100 dark:bg-white/[0.06] shrink-0" />

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
                const isActive = isItemActive(item.href)
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
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
                      <span className="flex-1 truncate">{item.label}</span>
                    )}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* ── Bottom utilities ───────────────────────── */}
        <div className="px-2.5 pb-3 pt-2 shrink-0">
          <div className="mx-0.5 mb-2 h-px bg-slate-100 dark:bg-white/[0.06]" />

          <AlertDialog>
            <AlertDialogTrigger render={
              <Button
                type="button"
                variant="ghost"
                title={collapsed ? "Sign Out" : undefined}
                className={`group flex items-center rounded-lg text-[13px] font-medium text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 dark:hover:text-rose-300 transition-all duration-150 cursor-pointer ${
                  collapsed ? "justify-center size-10 mx-auto mt-0.5 p-0" : "gap-3 px-3 py-2 w-full justify-start h-auto"
                }`}
              >
                <LogOut className="size-4 shrink-0" />
                {!collapsed && <span className="flex-1 truncate text-left">Sign Out Session</span>}
              </Button>
            } />
            <AlertDialogContent className="sm:max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-base font-bold text-[#002752] dark:text-white">
                  Confirm Workspace Sign Out
                </AlertDialogTitle>
                <AlertDialogDescription className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Are you sure you wish to sign out of your institutional account ({user.name})? Your secure session will be closed and you will be returned to the accreditation login portal.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="text-xs font-semibold">Stay Signed In</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => router.push(loginRoute)}
                  className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
                >
                  Sign Out
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </aside>

      {/* ════════════════════════════════════════════════════════════════
          MAIN CONTENT AREA
      ════════════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">

        {/* ── TOP HEADER BAR ────────────────────────────────────── */}
        <header className="sticky top-0 z-30 w-full h-[56px] flex items-center px-3 sm:px-4 md:px-5 gap-2.5 bg-white/90 dark:bg-[#0C1E34]/90 backdrop-blur-md border-b border-border/60">

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

          {/* Right: actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 ml-auto shrink-0">
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
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${accentGradient} text-white text-[11px] font-bold shadow-sm overflow-hidden`}
                >
                  {user.avatarImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.avatarImage}
                      alt={user.name}
                      className="size-full object-cover"
                    />
                  ) : (
                    user.avatarInitials
                  )}
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
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${accentGradient} text-white text-[11px] font-bold shadow-sm overflow-hidden`}
                >
                  {user.avatarImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.avatarImage}
                      alt={user.name}
                      className="size-full object-cover"
                    />
                  ) : (
                    user.avatarInitials
                  )}
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
        <main className={cn("flex-1 w-full max-w-full overflow-x-hidden", DASHBOARD_LAYOUT_PADDING)}>
          {children}
        </main>

        {/* ── FOOTER ─────────────────────────────────────────────── */}
        <footer className="w-full bg-white/60 dark:bg-[#0C1E34]/60 backdrop-blur-md border-t border-border/50 px-3 sm:px-4 md:px-5 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400 dark:text-slate-500">
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
