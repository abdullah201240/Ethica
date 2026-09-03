"use client"

import * as React from "react"
import {
  Scale,
  Inbox,
  CheckCheck,
  CalendarDays,
  FileSearch,
  Users,
} from "lucide-react"
import { ThemeProvider } from "@/components/theme-provider"
import { DashboardShell, type NavItem } from "@/components/dashboard/dashboard-shell"

const reviewerNavItems: NavItem[] = [
  {
    label: "Deliberation Queue",
    href: "/reviewer/dashboard",
    icon: Inbox,
    badge: "5 Urgent",
  },
  {
    label: "Expedited Triage",
    href: "/reviewer/dashboard#triage",
    icon: FileSearch,
  },
  {
    label: "Consensus Voting",
    href: "/reviewer/dashboard#consensus",
    icon: CheckCheck,
    badge: "2 Pending",
  },
  {
    label: "IRB Calendar & Quorum",
    href: "/reviewer/dashboard#calendar",
    icon: CalendarDays,
  },
  {
    label: "Committee Roster",
    href: "/reviewer/dashboard#roster",
    icon: Users,
  },
]

export default function ReviewerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <DashboardShell
        role="reviewer"
        roleTitle="IRB Committee Chair"
        roleBadge="DELIBERATION"
        roleColor="gold"
        user={{
          name: "Prof. Charles Montgomery",
          title: "Chair, Biomedical Research Ethics Board",
          email: "charles.montgomery@diu.edu.bd",
          avatarInitials: "CM",
        }}
        navItems={reviewerNavItems}
        loginRoute="/reviewer/login"
        actionButton={{
          label: "Convene Quorum",
          icon: Scale,
          href: "/reviewer/dashboard#convene",
        }}
      >
        {children}
      </DashboardShell>
    </ThemeProvider>
  )
}
