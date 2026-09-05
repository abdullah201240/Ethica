"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import {
  Sliders,
  Users,
  ScrollText,
  ShieldCheck,
  Settings,
  ClipboardCheck,
  User,
} from "lucide-react"
import { DashboardShell, type NavItem } from "@/components/dashboard/dashboard-shell"

const adminNavItems: NavItem[] = [
  {
    label: "Governance Overview",
    href: "/admin/dashboard",
    icon: Sliders,
  },
  {
    label: "Reviewer Applications",
    href: "/admin/applications",
    icon: ClipboardCheck,
    badge: "Pending Intake",
  },
  {
    label: "Institutional Roster",
    href: "/admin/dashboard#roster",
    icon: Users,
    badge: "148 Members",
  },
  {
    label: "Cryptographic Audit Logs",
    href: "/admin/dashboard#audit",
    icon: ScrollText,
    badge: "SHA-256",
  },
  {
    label: "Certificate Authority",
    href: "/admin/dashboard#authority",
    icon: ShieldCheck,
  },
  {
    label: "Secretariat Profile",
    href: "/admin/profile",
    icon: User,
  },
  {
    label: "Policy Engine Config",
    href: "/admin/dashboard#policies",
    icon: Settings,
  },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
