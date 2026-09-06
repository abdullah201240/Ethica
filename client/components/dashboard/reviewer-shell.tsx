"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Inbox,
  Scale,
  Award,
  User,
  Bell,
} from "lucide-react"
import { DashboardShell, type NavItem } from "@/components/dashboard/dashboard-shell"
import {
  getActiveReviewer,
  subscribeReviewers,
  type AccreditedReviewer,
} from "@/lib/reviewer-roster"
import {
  getUnreadCountForRole,
  subscribeNotifications,
} from "@/lib/notifications-store"

export function ReviewerShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [currentReviewer, setCurrentReviewer] = React.useState<AccreditedReviewer>(getActiveReviewer)
  const [unreadCount, setUnreadCount] = React.useState<number>(() =>
    getUnreadCountForRole("reviewer", getActiveReviewer().email)
  )

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

  React.useEffect(() => {
    const updateCount = () => {
      setUnreadCount(getUnreadCountForRole("reviewer", currentReviewer.email))
    }
    const unsubscribe = subscribeNotifications(updateCount)
    return () => {
      unsubscribe()
    }
  }, [currentReviewer.email])

  const reviewerNavItems: NavItem[] = React.useMemo(
    () => [
      {
        label: "Dashboard",
        href: "/reviewer/dashboard",
        icon: LayoutDashboard,
      },
      {
        label: "Notifications",
        href: "/reviewer/notifications",
        icon: Bell,
        badge: unreadCount > 0 ? String(unreadCount) : undefined,
        badgeVariant: "warning",
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
      {
        label: "Reviewer Profile",
        href: "/reviewer/profile",
        icon: User,
      },
    ],
    [unreadCount]
  )

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
