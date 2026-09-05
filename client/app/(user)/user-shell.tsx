"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  User,
} from "lucide-react"
import { DashboardShell, type NavItem } from "@/components/dashboard/dashboard-shell"

const userNavItems: NavItem[] = [
  {
    label: "Protocol Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Investigator Profile",
    href: "/dashboard/profile",
    icon: User,
  },
]

const DEFAULT_USER = {
  name: "Dr. Elena Rostova",
  title: "Associate Professor, Public Health",
  email: "elena.rostova@diu.edu.bd",
  avatarInitials: "ER",
  avatarImage: undefined as string | undefined,
}

import { investigatorProfileApi } from "@/lib/api/investigator-profile.api"

export function UserShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname === "/login" || pathname?.startsWith("/login")

  const [currentUser, setCurrentUser] = React.useState(DEFAULT_USER)

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await investigatorProfileApi.get()
        if (profile) {
          setCurrentUser((prev) => ({
            ...prev,
            name: profile.name || prev.name,
            title: profile.title || prev.title,
            email: profile.email || prev.email,
            avatarImage: profile.avatarUrl || undefined,
          }))
        }
      } catch {
        // Retain current state
      }
    }

    void fetchProfile()

    const handleCustomSync = (e: Event) => {
      const customEvent = e as CustomEvent
      if (customEvent.detail) {
        const updated = customEvent.detail
        setCurrentUser((prev) => ({
          ...prev,
          name: updated.name || prev.name,
          title: updated.title || prev.title,
          email: updated.email || prev.email,
          avatarImage: updated.avatarUrl || undefined,
        }))
      } else {
        void fetchProfile()
      }
    }

    window.addEventListener("ethica:investigator-profile-updated", handleCustomSync)
    return () => {
      window.removeEventListener("ethica:investigator-profile-updated", handleCustomSync)
    }
  }, [])

  if (isAuthPage) {
    return children
  }

  return (
    <DashboardShell
      role="user"
      roleTitle="Principal Investigator"
      roleBadge="INVESTIGATOR"
      roleColor="green"
      user={currentUser}
      navItems={userNavItems}
      loginRoute="/login"
      profileHref="/dashboard/profile"
    >
      {children}
    </DashboardShell>
  )
}
