"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import {
  Sliders,
  Users,
  ClipboardCheck,
  ScrollText,
  User,
  ShieldCheck,
  Contact,
  Layers,
  Bell,
} from "lucide-react"
import { DashboardShell, type NavItem } from "@/components/dashboard/dashboard-shell"
import {
  getUnreadCountForRole,
  subscribeNotifications,
} from "@/lib/notifications-store"

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname === "/admin/login" || pathname?.startsWith("/admin/login")

  const [unreadCount, setUnreadCount] = React.useState<number>(() =>
    getUnreadCountForRole("admin")
  )

  React.useEffect(() => {
    const updateCount = () => {
      setUnreadCount(getUnreadCountForRole("admin"))
    }
    const unsubscribe = subscribeNotifications(updateCount)
    return () => {
      unsubscribe()
    }
  }, [])

  const adminNavItems: NavItem[] = React.useMemo(
    () => [
      {
        label: "Dashboard",
        href: "/admin/dashboard",
        icon: Sliders,
      },
      {
        label: "Notifications",
        href: "/admin/notifications",
        icon: Bell,
        badge: unreadCount > 0 ? String(unreadCount) : undefined,
        badgeVariant: "info",
      },
      {
        label: "Protocol Applications",
        href: "/admin/protocols",
        icon: ScrollText,
      },
      {
        label: "Research Categories",
        href: "/admin/categories",
        icon: Layers,
      },
      {
        label: "All Users",
        href: "/admin/users",
        icon: Contact,
      },
      {
        label: "Reviewer Applications",
        href: "/admin/applications",
        icon: ClipboardCheck,
      },
      {
        label: "Reviewer Roster",
        href: "/admin/roster",
        icon: Users,
      },
      {
        label: "Admin List",
        href: "/admin/admins",
        icon: ShieldCheck,
      },
      {
        label: "Secretariat Profile",
        href: "/admin/profile",
        icon: User,
      },
    ],
    [unreadCount]
  )

  if (isAuthPage) {
    return children
  }

  return (
    <DashboardShell
      role="admin"
      roleTitle="Compliance Secretariat"
      roleBadge="GOVERNANCE"
      roleColor="navy"
      user={{
        name: "Dr. Marcus Vance",
        title: "Director of Research Governance & Compliance",
        email: "admin.secretariat@diu.edu.bd",
        avatarInitials: "MV",
      }}
      navItems={adminNavItems}
      loginRoute="/admin/login"
      profileHref="/admin/profile"
    >
      {children}
    </DashboardShell>
  )
}
