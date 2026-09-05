"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
} from "lucide-react"
import { DashboardShell, type NavItem } from "@/components/dashboard/dashboard-shell"

const userNavItems: NavItem[] = [
  {
    label: "Protocol Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
]

export function UserShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname === "/login" || pathname?.startsWith("/login")

  if (isAuthPage) {
    return children
  }

  return (
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
    >
      {children}
    </DashboardShell>
  )
}
