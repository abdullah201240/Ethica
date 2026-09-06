"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Bell,
  CheckCheck,
  Search,
  X,
  FileText,
  Scale,
  Award,
  ShieldAlert,
  Activity,
  AlertTriangle,
  ArrowRight,
  Trash2,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Eye,
} from "lucide-react"
import { KpiGrid, KpiCard } from "@/components/ui/kpi-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { toast } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"
import {
  getNotificationsForRole,
  getUnreadCountForRole,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearReadNotifications,
  simulateIncomingAlert,
  subscribeNotifications,
  type EthicaNotification,
} from "@/lib/notifications-store"

export default function InvestigatorNotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = React.useState<EthicaNotification[]>(() =>
    getNotificationsForRole("user", "elena.rostova@diu.edu.bd")
  )
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all")
  const [selectedPriority, setSelectedPriority] = React.useState<string>("all")
  const [activeTab, setActiveTab] = React.useState<"all" | "unread">("all")
  const [inspectingNotif, setInspectingNotif] = React.useState<EthicaNotification | null>(null)

  const syncData = React.useCallback(() => {
    const list = getNotificationsForRole("user", "elena.rostova@diu.edu.bd")
    setNotifications(list)
  }, [])

  React.useEffect(() => {
    const unsubscribe = subscribeNotifications(syncData)
    return () => {
      unsubscribe()
    }
  }, [syncData])

  // Derived metrics
  const totalCount = notifications.length
  const unreadCount = getUnreadCountForRole("user", "elena.rostova@diu.edu.bd")
  const clearanceCount = notifications.filter(
    (n) => n.category === "protocol" && (n.title.includes("Clearance") || n.message.includes("Clearance"))
  ).length
  const urgentCount = notifications.filter(
    (n) => n.priority === "urgent" || n.priority === "high"
  ).length

  // Filtered items
  const filteredNotifications = React.useMemo(() => {
    return notifications.filter((item) => {
      if (activeTab === "unread" && item.read) return false

      if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false
      }

      if (selectedPriority !== "all" && item.priority !== selectedPriority) {
        return false
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        const matchesTitle = item.title.toLowerCase().includes(query)
        const matchesMessage = item.message.toLowerCase().includes(query)
        const matchesCategory = item.category.toLowerCase().includes(query)
        if (!matchesTitle && !matchesMessage && !matchesCategory) return false
      }

      return true
    })
  }, [notifications, activeTab, selectedCategory, selectedPriority, searchQuery])

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead("user", "elena.rostova@diu.edu.bd")
    syncData()
    toast.success("All investigator notifications marked as read")
  }

  const handleClearRead = () => {
    clearReadNotifications("user", "elena.rostova@diu.edu.bd")
    syncData()
    toast.success("Acknowledged notifications cleared from workspace")
  }

  const handleToggleRead = (id: string, currentRead: boolean) => {
    if (!currentRead) {
      markNotificationAsRead(id)
      syncData()
      toast.success("Notification marked as read")
    }
  }

  const handleDelete = (id: string) => {
    deleteNotification(id)
    syncData()
    toast.success("Notification dismissed")
  }

  const handleSimulateAlert = () => {
    const notif = simulateIncomingAlert("user")
    syncData()
    toast.info(notif.title, {
      description: notif.message,
      action: notif.actionUrl ? (
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => router.push(notif.actionUrl!)}
          className="h-7 text-xs font-semibold px-2 cursor-pointer"
        >
          Inspect
        </Button>
      ) : undefined,
    })
  }

  const getCategoryBadge = (category: EthicaNotification["category"]) => {
    switch (category) {
      case "protocol":
        return (
          <Badge
            variant="outline"
            className="bg-sky-50 text-sky-800 border-sky-300 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800 text-xs font-semibold rounded-md gap-1"
          >
            <FileText className="size-3" />
            Protocol Clearance
          </Badge>
        )
      case "deliberation":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800 text-xs font-semibold rounded-md gap-1"
          >
            <Scale className="size-3" />
            Committee Review
          </Badge>
        )
      case "accreditation":
        return (
          <Badge
            variant="outline"
            className="bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 text-xs font-semibold rounded-md gap-1"
          >
            <Award className="size-3" />
            Accreditation
          </Badge>
        )
      case "security":
        return (
          <Badge
            variant="outline"
            className="bg-purple-50 text-purple-800 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800 text-xs font-semibold rounded-md gap-1"
          >
            <ShieldAlert className="size-3" />
            Security & Audit
          </Badge>
        )
      default:
        return (
          <Badge
            variant="outline"
            className="bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-300 text-xs font-semibold rounded-md gap-1"
          >
            <Activity className="size-3" />
            System Notice
          </Badge>
        )
    }
  }

  const getPriorityBadge = (priority: EthicaNotification["priority"]) => {
    switch (priority) {
      case "urgent":
        return (
          <Badge className="bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold rounded-md uppercase tracking-wider">
            Urgent Action
          </Badge>
        )
      case "high":
        return (
          <Badge className="bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold rounded-md uppercase tracking-wider">
            High Priority
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="w-full space-y-6 pb-12 select-text">
      {/* ── KPI METRIC CARDS (Direct-to-Content, Rule 10 & 11) ─────────────── */}
      <KpiGrid columns={4}>
        <KpiCard
          label="Total Notifications"
          value={totalCount}
          description="Historical dispatches"
          icon={Bell}
          color="navy"
        />
        <KpiCard
          label="Unread Alerts"
          value={unreadCount}
          description={unreadCount === 0 ? "All caught up" : "Awaiting review"}
          icon={CheckCircle2}
          color="green"
          badge={
            unreadCount > 0 ? (
              <Badge className="bg-emerald-600 text-white text-xs font-bold rounded-md">
                Active
              </Badge>
            ) : undefined
          }
        />
        <KpiCard
          label="Clearance Grants"
          value={clearanceCount}
          description="Institutional determinations"
          icon={Award}
          color="sky"
        />
        <KpiCard
          label="Urgent Revisions"
          value={urgentCount}
          description="Action required by PI"
          icon={AlertTriangle}
          color="amber"
        />
      </KpiGrid>

      {/* ── TOOLBAR & FILTER CONTROLS ────────────────────────────────────── */}
      <div className="rounded-xl border border-border/75 bg-white dark:bg-[#0C1E34] p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notifications by protocol ID, title, or keywords..."
              className="pl-9 pr-8 h-10 w-full rounded-md border-border/75 bg-slate-50/50 dark:bg-slate-900/50 text-body-sm"
            />
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 size-6 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="size-3.5" />
              </Button>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {unreadCount > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="rounded-md border-border/75 text-body-sm font-semibold h-10 gap-1.5 cursor-pointer"
              >
                <CheckCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
                <span>Mark All Read</span>
              </Button>
            )}

            <AlertDialog>
              <AlertDialogTrigger
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="rounded-md text-slate-600 dark:text-slate-400 hover:text-rose-600 h-10 gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="size-4" />
                    <span className="hidden sm:inline">Clear Read</span>
                  </Button>
                }
              />
              <AlertDialogContent className="w-full max-w-[calc(100vw-2rem)] sm:max-w-md">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-lg font-bold text-foreground">
                    Clear Acknowledged Notifications?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-body-sm text-muted-foreground">
                    This action will purge all read notifications from your investigator workspace. Unread notices will remain intact.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2">
                  <AlertDialogCancel className="font-semibold">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleClearRead}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold"
                  >
                    Clear Read
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleSimulateAlert}
              className="rounded-md text-body-sm font-bold h-10 gap-1.5 cursor-pointer ml-auto sm:ml-0"
              title="Demonstrate dynamic incoming notification"
            >
              <Sparkles className="size-4 text-amber-500" />
              <span>Simulate Alert</span>
            </Button>
          </div>
        </div>

        {/* Filters row: Tab Pills + Category Dropdown + Priority Dropdown */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-border/50">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 dark:bg-slate-900/60 rounded-lg border border-border/50">
            <Button
              type="button"
              variant={activeTab === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("all")}
              className={cn(
                "h-8 px-3 rounded-md text-xs font-semibold cursor-pointer",
                activeTab === "all"
                  ? "bg-primary text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              All Notifications ({totalCount})
            </Button>
            <Button
              type="button"
              variant={activeTab === "unread" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("unread")}
              className={cn(
                "h-8 px-3 rounded-md text-xs font-semibold cursor-pointer",
                activeTab === "unread"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Unread Alerts ({unreadCount})
            </Button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Category Select */}
            <Select value={selectedCategory} onValueChange={(val) => setSelectedCategory(val ?? "all")}>
              <SelectTrigger className="w-full sm:w-44 h-9 rounded-md border-border/75 text-xs font-medium">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="protocol">Protocol Clearances</SelectItem>
                <SelectItem value="deliberation">Committee Deliberation</SelectItem>
                <SelectItem value="system">System Compliance</SelectItem>
              </SelectContent>
            </Select>

            {/* Priority Select */}
            <Select value={selectedPriority} onValueChange={(val) => setSelectedPriority(val ?? "all")}>
              <SelectTrigger className="w-full sm:w-36 h-9 rounded-md border-border/75 text-xs font-medium">
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* ── NOTIFICATIONS ROSTER ─────────────────────────────────────────── */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="rounded-xl border border-border/75 bg-white dark:bg-[#0C1E34] p-12 text-center flex flex-col items-center justify-center">
            <div className="size-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-muted-foreground mb-3 shadow-xs">
              <Bell className="size-7 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-foreground">
              No notifications matching your filter
            </h3>
            <p className="text-body-sm text-muted-foreground mt-1 max-w-md">
              {searchQuery || selectedCategory !== "all" || selectedPriority !== "all"
                ? "Try clearing your search query or reset your category and priority filters."
                : "Your investigator docket has zero pending alerts. You are completely up to date."}
            </p>
            {(searchQuery || selectedCategory !== "all" || selectedPriority !== "all") && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                  setSelectedPriority("all")
                  setActiveTab("all")
                }}
                className="mt-4 rounded-md border-border/75 font-semibold text-xs"
              >
                Reset All Filters
              </Button>
            )}
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={cn(
                "rounded-xl border transition-all duration-150 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs select-text",
                !notif.read
                  ? "bg-white dark:bg-[#0C1E34] border-sky-300/80 dark:border-sky-800 ring-1 ring-sky-500/10"
                  : "bg-white/80 dark:bg-[#0C1E34]/80 border-border/75 opacity-90 hover:opacity-100"
              )}
            >
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                {/* Visual indicator / category icon */}
                <div
                  className={cn(
                    "size-10 rounded-lg flex items-center justify-center shrink-0 border border-border/75 shadow-xs mt-0.5",
                    !notif.read
                      ? "bg-sky-50 dark:bg-sky-950/60 border-sky-300 dark:border-sky-700"
                      : "bg-slate-100 dark:bg-slate-800"
                  )}
                >
                  {notif.category === "protocol" ? (
                    <FileText className="size-5 text-sky-600 dark:text-sky-400" />
                  ) : notif.category === "deliberation" ? (
                    <Scale className="size-5 text-amber-600 dark:text-amber-400" />
                  ) : notif.category === "accreditation" ? (
                    <Award className="size-5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Activity className="size-5 text-slate-500 dark:text-slate-400" />
                  )}
                </div>

                <div className="space-y-1.5 min-w-0 flex-1">
                  {/* Badges and timestamp */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {!notif.read && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-700 dark:text-sky-300 bg-sky-100 dark:bg-sky-950 px-2 py-0.5 rounded-full">
                        <span className="size-1.5 rounded-full bg-sky-500 animate-pulse" />
                        Unread
                      </span>
                    )}
                    {getCategoryBadge(notif.category)}
                    {getPriorityBadge(notif.priority)}
                    <span className="text-xs text-muted-foreground ml-auto whitespace-nowrap">
                      {notif.timestamp}
                    </span>
                  </div>

                  {/* Title & message */}
                  <h4 className="text-base font-bold text-foreground leading-snug select-text">
                    {notif.title}
                  </h4>
                  <p className="text-body-sm text-muted-foreground leading-relaxed select-text">
                    {notif.message}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-border/40">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setInspectingNotif(notif)}
                  className="rounded-md h-9 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-foreground gap-1.5 cursor-pointer"
                >
                  <Eye className="size-3.5" />
                  <span>Inspect</span>
                </Button>

                {!notif.read ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleRead(notif.id, notif.read)}
                    className="rounded-md h-9 border-border/75 text-xs font-semibold gap-1.5 cursor-pointer"
                    title="Mark as read"
                  >
                    <CheckCheck className="size-3.5 text-emerald-600" />
                    <span>Acknowledge</span>
                  </Button>
                ) : null}

                {notif.actionUrl && (
                  <Link href={notif.actionUrl}>
                    <Button
                      type="button"
                      variant="default"
                      size="sm"
                      className="rounded-md h-9 text-xs font-bold bg-[#002752] hover:bg-[#003875] text-white gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span>{notif.actionLabel || "View Record"}</span>
                      <ArrowRight className="size-3.5" />
                    </Button>
                  </Link>
                )}

                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleDelete(notif.id)}
                  className="rounded-md size-9 text-slate-400 hover:text-rose-600"
                  title="Dismiss notification"
                  aria-label="Dismiss notification"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── DETAIL INSPECTION SHEET ──────────────────────────────────────── */}
      <Sheet open={Boolean(inspectingNotif)} onOpenChange={(open) => !open && setInspectingNotif(null)}>
        <SheetContent className="w-full sm:max-w-md md:max-w-lg p-6 overflow-y-auto space-y-6">
          {inspectingNotif && (
            <>
              <SheetHeader className="space-y-2 text-left">
                <div className="flex items-center gap-2">
                  {getCategoryBadge(inspectingNotif.category)}
                  {getPriorityBadge(inspectingNotif.priority)}
                  <span className="text-xs text-muted-foreground ml-auto">
                    {inspectingNotif.timestamp}
                  </span>
                </div>
                <SheetTitle className="text-xl font-bold text-foreground">
                  {inspectingNotif.title}
                </SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground">
                  Official dispatch identifier: {inspectingNotif.id}
                </SheetDescription>
              </SheetHeader>

              {/* Message Well */}
              <div className="rounded-xl border border-border/75 bg-slate-50 dark:bg-slate-900/60 p-4 space-y-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Notification Content
                </h5>
                <p className="text-body text-foreground leading-relaxed select-text">
                  {inspectingNotif.message}
                </p>
              </div>

              {/* Institutional Audit Record */}
              <div className="rounded-xl border border-border/75 p-4 space-y-3 bg-white dark:bg-[#0C1E34]">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Institutional Ledger Record
                </h5>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground block">Target Role</span>
                    <span className="font-semibold text-foreground uppercase">
                      {inspectingNotif.role}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Status</span>
                    <span className="font-semibold text-foreground">
                      {inspectingNotif.read ? "Acknowledged" : "Pending Acknowledgment"}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground block">Dispatched At</span>
                    <span className="font-mono text-[11px] text-foreground">
                      {inspectingNotif.createdAt}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/50 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  <ShieldCheck className="size-4 shrink-0" />
                  <span>Verified by DIU Ethics Secretariat System</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                {inspectingNotif.actionUrl && (
                  <Link
                    href={inspectingNotif.actionUrl}
                    className="flex-1"
                    onClick={() => setInspectingNotif(null)}
                  >
                    <Button
                      type="button"
                      className="w-full bg-primary text-white font-bold h-10 gap-2 cursor-pointer"
                    >
                      <span>{inspectingNotif.actionLabel || "Inspect Record"}</span>
                      <ExternalLink className="size-4" />
                    </Button>
                  </Link>
                )}
                {!inspectingNotif.read && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      markNotificationAsRead(inspectingNotif.id)
                      syncData()
                      setInspectingNotif({ ...inspectingNotif, read: true })
                      toast.success("Notification marked as read")
                    }}
                    className="font-semibold h-10 gap-1.5"
                  >
                    <CheckCheck className="size-4" />
                    <span>Acknowledge</span>
                  </Button>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
