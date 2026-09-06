"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Bell,
  CheckCheck,
  FileText,
  Scale,
  Award,
  ShieldAlert,
  Activity,
  ArrowRight,
  Trash2,
  BellOff,
  Sparkles,
} from "lucide-react"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"
import {
  getNotificationsForRole,
  getUnreadCountForRole,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  simulateIncomingAlert,
  subscribeNotifications,
  type EthicaNotification,
  type NotificationRole,
} from "@/lib/notifications-store"

interface NotificationPopoverProps {
  role: NotificationRole
  userEmail?: string
}

function playInstitutionalChime() {
  if (typeof window === "undefined") return
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const now = ctx.currentTime

    // Gentle institutional two-tone sine chime (523.25Hz -> 659.25Hz)
    const osc1 = ctx.createOscillator()
    const osc2 = ctx.createOscillator()
    const gainNode = ctx.createGain()

    osc1.type = "sine"
    osc1.frequency.setValueAtTime(523.25, now) // C5
    osc2.type = "sine"
    osc2.frequency.setValueAtTime(659.25, now + 0.08) // E5

    gainNode.gain.setValueAtTime(0.08, now)
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.45)

    osc1.connect(gainNode)
    osc2.connect(gainNode)
    gainNode.connect(ctx.destination)

    osc1.start(now)
    osc2.start(now + 0.08)
    osc1.stop(now + 0.45)
    osc2.stop(now + 0.45)
  } catch {
    // Ignore audio context autoplay restrictions
  }
}

export function NotificationPopover({ role, userEmail }: NotificationPopoverProps) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [filter, setFilter] = React.useState<"all" | "unread">("all")
  const [notifications, setNotifications] = React.useState<EthicaNotification[]>(() =>
    getNotificationsForRole(role, userEmail)
  )
  const [unreadCount, setUnreadCount] = React.useState<number>(() =>
    getUnreadCountForRole(role, userEmail)
  )

  // Sync state from notifications store
  const syncState = React.useCallback(() => {
    const notifs = getNotificationsForRole(role, userEmail)
    setNotifications(notifs)
    setUnreadCount(getUnreadCountForRole(role, userEmail))
  }, [role, userEmail])

  React.useEffect(() => {
    const unsubscribe = subscribeNotifications(syncState)
    return () => {
      unsubscribe()
    }
  }, [syncState])

  const filteredNotifications = React.useMemo(() => {
    if (filter === "unread") {
      return notifications.filter((n) => !n.read)
    }
    return notifications
  }, [notifications, filter])

  const fullPageRoute =
    role === "admin"
      ? "/admin/notifications"
      : role === "reviewer"
      ? "/reviewer/notifications"
      : "/notifications"

  const roleTitle =
    role === "admin"
      ? "Secretariat Dispatches"
      : role === "reviewer"
      ? "Deliberation Notices"
      : "Investigator Alerts"

  const handleMarkAllRead = () => {
    markAllNotificationsAsRead(role, userEmail)
    syncState()
    toast.success("All notifications marked as read")
  }

  const handleItemClick = (notif: EthicaNotification) => {
    if (!notif.read) {
      markNotificationAsRead(notif.id)
      syncState()
    }
    setOpen(false)
    if (notif.actionUrl) {
      router.push(notif.actionUrl)
    }
  }

  const handleDeleteItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    deleteNotification(id)
    syncState()
  }

  const handleSimulate = () => {
    playInstitutionalChime()
    const newNotif = simulateIncomingAlert(role)
    syncState()
    toast.info(newNotif.title, {
      description: newNotif.message,
      action: newNotif.actionUrl ? (
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => router.push(newNotif.actionUrl!)}
          className="h-7 text-xs font-semibold px-2 cursor-pointer"
        >
          Inspect
        </Button>
      ) : undefined,
    })
  }

  const getCategoryIcon = (category: EthicaNotification["category"]) => {
    switch (category) {
      case "protocol":
        return <FileText className="size-4 text-sky-600 dark:text-sky-400" />
      case "deliberation":
        return <Scale className="size-4 text-amber-600 dark:text-amber-400" />
      case "accreditation":
        return <Award className="size-4 text-emerald-600 dark:text-emerald-400" />
      case "security":
        return <ShieldAlert className="size-4 text-purple-600 dark:text-purple-400" />
      default:
        return <Activity className="size-4 text-slate-500 dark:text-slate-400" />
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="relative flex size-9 sm:size-10 rounded-lg text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
            aria-label={`Notifications (${unreadCount} unread)`}
          >
            <Bell className="size-5 sm:size-[22px]" />
            {unreadCount > 0 ? (
              <span className="absolute top-1.5 right-1.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold ring-2 ring-white dark:ring-[#0C1E34] shadow-xs animate-in zoom-in-50">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            ) : null}
          </Button>
        }
      />

      <PopoverContent
        align="end"
        side="bottom"
        sideOffset={8}
        className="w-[calc(100vw-2rem)] sm:w-[420px] p-0 rounded-xl border border-border/75 shadow-lg bg-card text-card-foreground overflow-hidden"
      >
        {/* Header */}
        <div className="p-3.5 bg-slate-50/90 dark:bg-slate-900/60 border-b border-border/75 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-bold text-base text-foreground truncate">
              {roleTitle}
            </span>
            {unreadCount > 0 ? (
              <Badge
                variant="secondary"
                className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[11px] font-semibold rounded-md border-emerald-300 dark:border-emerald-800"
              >
                {unreadCount} new
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="text-[11px] font-medium text-muted-foreground rounded-md"
              >
                Up to date
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {unreadCount > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={handleMarkAllRead}
                title="Mark all as read"
                className="size-7 text-muted-foreground hover:text-foreground rounded-md"
              >
                <CheckCheck className="size-4" />
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={handleSimulate}
              title="Simulate incoming alert"
              className="size-7 text-slate-400 hover:text-amber-500 rounded-md"
            >
              <Sparkles className="size-3.5" />
            </Button>
          </div>
        </div>

        {/* Tab Filter */}
        <div className="px-3.5 py-1.5 bg-slate-50/40 dark:bg-slate-900/30 border-b border-border/50 flex items-center gap-2 text-xs">
          <Button
            type="button"
            variant={filter === "all" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setFilter("all")}
            className={cn(
              "h-7 px-2.5 rounded-md text-xs font-semibold cursor-pointer",
              filter === "all" && "bg-slate-200 dark:bg-slate-800 text-foreground"
            )}
          >
            All ({notifications.length})
          </Button>
          <Button
            type="button"
            variant={filter === "unread" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setFilter("unread")}
            className={cn(
              "h-7 px-2.5 rounded-md text-xs font-semibold cursor-pointer",
              filter === "unread" && "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300"
            )}
          >
            Unread ({unreadCount})
          </Button>
        </div>

        {/* Notification List */}
        <div className="max-h-[350px] overflow-y-auto divide-y divide-border/40 select-text">
          {filteredNotifications.length === 0 ? (
            <div className="py-10 px-4 text-center flex flex-col items-center justify-center">
              <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-muted-foreground mb-2.5">
                <BellOff className="size-5" />
              </div>
              <p className="text-sm font-semibold text-foreground">
                No notifications found
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 max-w-xs">
                {filter === "unread"
                  ? "You have acknowledged all dispatches in this category."
                  : "No notifications recorded for this institutional workspace yet."}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleItemClick(notif)}
                className={cn(
                  "p-3.5 flex items-start gap-3 transition-colors cursor-pointer group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 select-text",
                  !notif.read && "bg-sky-50/30 dark:bg-sky-950/15"
                )}
              >
                <div
                  className={cn(
                    "size-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border border-border/75 shadow-xs",
                    !notif.read
                      ? "bg-white dark:bg-slate-900 border-sky-300 dark:border-sky-800"
                      : "bg-slate-100/80 dark:bg-slate-800/80"
                  )}
                >
                  {getCategoryIcon(notif.category)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1.5 mb-1">
                    <span
                      className={cn(
                        "text-xs sm:text-sm font-semibold truncate select-text",
                        !notif.read
                          ? "text-primary dark:text-sky-300 font-bold"
                          : "text-foreground"
                      )}
                    >
                      {notif.title}
                    </span>
                    <span className="text-[11px] text-muted-foreground whitespace-nowrap shrink-0">
                      {notif.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 select-text">
                    {notif.message}
                  </p>

                  <div className="mt-2 flex items-center justify-between gap-2">
                    {notif.actionLabel ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-secondary dark:text-emerald-400 group-hover:underline">
                        <span>{notif.actionLabel}</span>
                        <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    ) : (
                      <span />
                    )}

                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        onClick={(e) => handleDeleteItem(e, notif.id)}
                        title="Dismiss notification"
                        className="size-6 text-slate-400 hover:text-rose-500 rounded-md"
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                {!notif.read && (
                  <span className="size-2 rounded-full bg-sky-500 dark:bg-sky-400 shrink-0 mt-1.5 ring-2 ring-white dark:ring-[#0C1E34]" />
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-2.5 bg-slate-50/90 dark:bg-slate-900/60 border-t border-border/75 flex items-center justify-between">
          <Link
            href={fullPageRoute}
            onClick={() => setOpen(false)}
            className="text-xs font-bold text-primary dark:text-sky-400 hover:underline px-2 py-1"
          >
            View all notifications ({notifications.length})
          </Link>
          <span className="text-[11px] text-muted-foreground px-2">
            SHA-256 Ledger Synced
          </span>
        </div>
      </PopoverContent>
    </Popover>
  )
}
