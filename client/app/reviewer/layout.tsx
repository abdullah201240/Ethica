"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import {
  CheckCheck,
  CalendarDays,
  FileSearch,
  Users,
} from "lucide-react"
import { DashboardShell, type NavItem } from "@/components/dashboard/dashboard-shell"

const reviewerNavItems: NavItem[] = [
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

export default function ReviewerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAuthPage = pathname === "/reviewer/login" || pathname?.startsWith("/reviewer/login")

  if (isAuthPage) {
    return children
  }

  return (
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
    >
      {children}
    </DashboardShell>
  )
}
