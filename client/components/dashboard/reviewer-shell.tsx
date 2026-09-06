"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Inbox,
  Scale,
  Award,
} from "lucide-react"
import { DashboardShell, type NavItem } from "@/components/dashboard/dashboard-shell"
import {
  getActiveReviewer,
  subscribeReviewers,
  type AccreditedReviewer,
} from "@/lib/reviewer-roster"

const reviewerNavItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/reviewer/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Review Requests",
    href: "/reviewer/requests",
    icon: Inbox,
  },
  {
    label: "Active Deliberations",
    href: "/reviewer/deliberations",
    icon: Scale,
  },
  {
    label: "Completed Archive",
    href: "/reviewer/completed",
    icon: Award,
  },
]

export function ReviewerShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [currentReviewer, setCurrentReviewer] = React.useState<AccreditedReviewer>(getActiveReviewer)

  React.useEffect(() => {
    const syncReviewer = () => {
      setCurrentReviewer(getActiveReviewer())
    }

    const unsubscribe = subscribeReviewers(syncReviewer)

    const handleActiveChanged = () => {
      syncReviewer()
    }
    window.addEventListener("ethica:active-reviewer-changed", handleActiveChanged)

    return () => {
      unsubscribe()
      window.removeEventListener("ethica:active-reviewer-changed", handleActiveChanged)
    }
  }, [])

  const isPublicPage =
    pathname === "/reviewer/login" ||
    pathname?.startsWith("/reviewer/login") ||
    pathname === "/reviewer/apply" ||
    pathname?.startsWith("/reviewer/apply")

  if (isPublicPage) {
    return children
  }

  const initials = currentReviewer.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "RV"

  return (
    <DashboardShell
      role="reviewer"
      roleTitle={currentReviewer.role || "IRB Committee Reviewer"}
      roleBadge="DELIBERATION"
      roleColor="gold"
      user={{
        name: currentReviewer.name,
        title: `${currentReviewer.position}, ${currentReviewer.department}`,
        email: currentReviewer.email,
        avatarInitials: initials,
        avatarImage: currentReviewer.avatarUrl,
      }}
      navItems={reviewerNavItems}
      loginRoute="/reviewer/login"
      profileHref="/reviewer/profile"
    >
      {children}
    </DashboardShell>
  )
}
