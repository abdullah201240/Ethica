"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
} from "lucide-react"
import { DashboardShell, type NavItem } from "@/components/dashboard/dashboard-shell"

const reviewerNavItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/reviewer/dashboard",
    icon: LayoutDashboard,
  },
]

export function ReviewerShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isPublicPage =
    pathname === "/reviewer/login" ||
    pathname?.startsWith("/reviewer/login") ||
    pathname === "/reviewer/apply" ||
    pathname?.startsWith("/reviewer/apply")

  if (isPublicPage) {
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
