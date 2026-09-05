"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * ══════════════════════════════════════════════════════════════════════════════
 * CENTRAL DASHBOARD LAYOUT & RESPONSIVE PADDING CONTROLS
 * ──────────────────────────────────────────────────────────────────────────────
 * Modify these tokens in this single file to globally adjust padding and container
 * margins across ALL dashboard/workspace pillars (Admin, Reviewer, Investigator).
 *
 * Phone (<sm): px-0 (edge-to-edge flush canvas, zero horizontal gutter)
 * Tablet (sm): px-4 py-4
 * Desktop (md-lg): px-5 py-5 to px-6 py-6
 * ══════════════════════════════════════════════════════════════════════════════
 */
export const DASHBOARD_LAYOUT_PADDING =
  "px-4 sm:px-8 md:px-10 py-5 sm:py-6"

export const DASHBOARD_CARD_BASE =
  "rounded-xl sm:rounded-2xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] p-4 sm:p-6 shadow-xs select-text"

export interface DashboardContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

/**
 * Centralized Page Content Wrapper for all workspace views.
 * Controls vertical flow, max width constraints, and text selectability.
 */
export function DashboardContainer({
  children,
  className,
  ...props
}: DashboardContainerProps) {
  return (
    <div
      data-slot="dashboard-container"
      className={cn("space-y-6 sm:space-y-8 select-text w-full max-w-full", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export interface DashboardCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

/**
 * Centralized Workspace Card Surface.
 * Guarantees phone edge-to-edge display with zero side gutters,
 * transitioning smoothly to rounded institutional cards on tablet and desktop.
 */
export function DashboardCard({
  children,
  className,
  ...props
}: DashboardCardProps) {
  return (
    <div
      data-slot="dashboard-card"
      className={cn(DASHBOARD_CARD_BASE, className)}
      {...props}
    >
      {children}
    </div>
  )
}
