import * as React from "react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

export type KpiColorVariant =
  | "navy"
  | "green"
  | "amber"
  | "rose"
  | "sky"
  | "gold"

const colorStyles: Record<
  KpiColorVariant,
  {
    value: string
    iconColor?: string
  }
> = {
  navy: {
    value: "text-[#002752] dark:text-white",
    iconColor: "text-slate-400 dark:text-slate-500",
  },
  green: {
    value: "text-[#198754] dark:text-emerald-400",
    iconColor: "text-[#198754] dark:text-emerald-400",
  },
  amber: {
    value: "text-amber-600 dark:text-amber-400",
    iconColor: "text-amber-500 dark:text-amber-400",
  },
  rose: {
    value: "text-rose-600 dark:text-rose-400",
    iconColor: "text-rose-500 dark:text-rose-400",
  },
  sky: {
    value: "text-sky-600 dark:text-sky-400",
    iconColor: "text-sky-500 dark:text-sky-400",
  },
  gold: {
    value: "text-[#B8961B] dark:text-[#E0C23C]",
    iconColor: "text-[#E0C23C] dark:text-[#E0C23C]",
  },
}

export interface KpiCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  value: React.ReactNode
  description?: React.ReactNode
  icon?: React.ComponentType<{ className?: string }>
  iconClassName?: string
  color?: KpiColorVariant
  trend?: {
    value: string
    isPositive?: boolean
    label?: string
  }
  badge?: React.ReactNode
  isLoading?: boolean
}

export function KpiCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      data-slot="kpi-card-skeleton"
      className={cn(
        "rounded-xl sm:rounded-2xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] p-4 sm:p-5 space-y-2.5 shadow-xs select-none",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-3.5 w-24 rounded" />
        <Skeleton className="size-4 rounded-full" />
      </div>
      <Skeleton className="h-8 w-28 rounded-md" />
      <Skeleton className="h-3 w-36 rounded" />
    </div>
  )
}

export function KpiGridSkeleton({
  columns = 4,
  count = 4,
  className,
}: {
  columns?: 2 | 3 | 4
  count?: number
  className?: string
}) {
  const colClass =
    columns === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : columns === 3
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      : "grid-cols-2 lg:grid-cols-4"

  return (
    <div
      data-slot="kpi-grid-skeleton"
      className={cn("grid gap-3 sm:gap-4 w-full px-3 sm:px-0", colClass, className)}
    >
      {Array.from({ length: count }).map((_, i) => (
        <KpiCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function KpiCard({
  label,
  value,
  description,
  icon: Icon,
  iconClassName,
  color = "navy",
  trend,
  badge,
  isLoading = false,
  className,
  ...props
}: KpiCardProps) {
  if (isLoading) {
    return <KpiCardSkeleton className={className} />
  }

  const colorStyle = colorStyles[color] || colorStyles.navy

  return (
    <div
      data-slot="kpi-card"
      className={cn(
        "rounded-xl sm:rounded-2xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] p-4 sm:p-5 space-y-1.5 shadow-xs transition-shadow hover:shadow-sm select-text",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between gap-2 text-slate-500 dark:text-slate-400 text-xs font-semibold">
        <span className="truncate select-text">{label}</span>
        <div className="flex items-center gap-1.5 shrink-0">
          {badge}
          {Icon && (
            <Icon
              className={cn("size-4 shrink-0", colorStyle.iconColor, iconClassName)}
            />
          )}
        </div>
      </div>

      <div
        className={cn(
          "text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight tabular-nums select-text",
          colorStyle.value
        )}
      >
        {value}
      </div>

      {(description || trend) && (
        <div className="flex items-center justify-between gap-2 pt-0.5 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 select-text">
          {description && <span className="truncate">{description}</span>}
          {trend && (
            <span
              className={cn(
                "inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0",
                trend.isPositive
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
              )}
            >
              {trend.value}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export interface KpiGridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 2 | 3 | 4
  children: React.ReactNode
}

export function KpiGrid({
  columns = 4,
  children,
  className,
  ...props
}: KpiGridProps) {
  const colClass =
    columns === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : columns === 3
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      : "grid-cols-2 lg:grid-cols-4"

  return (
    <div
      data-slot="kpi-grid"
      className={cn("grid gap-3 sm:gap-4 w-full px-3 sm:px-0", colClass, className)}
      {...props}
    >
      {children}
    </div>
  )
}
