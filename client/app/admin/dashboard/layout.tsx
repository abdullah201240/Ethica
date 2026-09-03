"use client"

import * as React from "react"
import {
  Sliders,
  Users,
  ScrollText,
  ShieldCheck,
  Settings,
  Download,
} from "lucide-react"
import { ThemeProvider } from "@/components/theme-provider"
import { DashboardShell, type NavItem } from "@/components/dashboard/dashboard-shell"

const adminNavItems: NavItem[] = [
  {
    label: "Governance Overview",
    href: "/admin/dashboard",
    icon: Sliders,
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
    label: "Policy Engine Config",
    href: "/admin/dashboard#policies",
    icon: Settings,
  },
]

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
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
        actionButton={{
          label: "Export Ledger",
          icon: Download,
          href: "/admin/dashboard#export",
        }}
      >
        {children}
      </DashboardShell>
    </ThemeProvider>
  )
}
