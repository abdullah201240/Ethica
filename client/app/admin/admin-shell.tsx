"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import {
  Sliders,
  Users,
  ClipboardCheck,
  User,
  ShieldCheck,
  Contact,
} from "lucide-react"
import { DashboardShell, type NavItem } from "@/components/dashboard/dashboard-shell"

const adminNavItems: NavItem[] = [
  {
    label: "Governance Overview",
    href: "/admin/dashboard",
    icon: Sliders,
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
]

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname === "/admin/login" || pathname?.startsWith("/admin/login")

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
