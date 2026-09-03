"use client"

import * as React from "react"
import {
  LayoutDashboard,
  FileText,
  Award,
  Sparkles,
  BookOpen,
  PlusCircle,
} from "lucide-react"
import { ThemeProvider } from "@/components/theme-provider"
import { DashboardShell, type NavItem } from "@/components/dashboard/dashboard-shell"

const userNavItems: NavItem[] = [
  {
    label: "Protocol Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Active Protocols",
    href: "/dashboard#protocols",
    icon: FileText,
    badge: "3 In-Review",
  },
  {
    label: "Clearance Certificates",
    href: "/dashboard#certificates",
    icon: Award,
    badge: "12 Issued",
  },
  {
    label: "Fast-Track Checker",
    href: "/dashboard#eligibility",
    icon: Sparkles,
  },
  {
    label: "Institutional Guidelines",
    href: "/dashboard#guidelines",
    icon: BookOpen,
  },
]

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <DashboardShell
        role="user"
        roleTitle="Principal Investigator"
        roleBadge="INVESTIGATOR"
        roleColor="green"
        user={{
          name: "Dr. Elena Rostova",
          title: "Associate Professor, Public Health",
          email: "elena.rostova@diu.edu.bd",
          avatarInitials: "ER",
        }}
        navItems={userNavItems}
        loginRoute="/login"
        actionButton={{
          label: "New Protocol",
          icon: PlusCircle,
          href: "/dashboard#new-protocol",
        }}
      >
        {children}
      </DashboardShell>
    </ThemeProvider>
  )
}
