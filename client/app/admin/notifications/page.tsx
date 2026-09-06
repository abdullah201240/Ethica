"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Bell,
  CheckCheck,
  Search,
  X,
  ScrollText,
  Scale,
  Award,
  ShieldAlert,
  ShieldCheck,
  ArrowRight,
  Trash2,
  Sparkles,
  ExternalLink,
  Eye,
  Sliders,
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

export default function GovernanceAdminNotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = React.useState<EthicaNotification[]>(() =>
    getNotificationsForRole("admin")
  )
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all")
  const [selectedPriority, setSelectedPriority] = React.useState<string>("all")
  const [activeTab, setActiveTab] = React.useState<"all" | "unread">("all")
  const [inspectingNotif, setInspectingNotif] = React.useState<EthicaNotification | null>(null)

  const syncData = React.useCallback(() => {
    const list = getNotificationsForRole("admin")
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
  const unreadCount = getUnreadCountForRole("admin")
  const protocolIntakeCount = notifications.filter((n) => n.category === "protocol").length
  const deliberationCount = notifications.filter((n) => n.category === "deliberation").length

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
    markAllNotificationsAsRead("admin")
    syncData()
    toast.success("All secretariat notifications marked as read")
  }

  const handleClearRead = () => {
    clearReadNotifications("admin")
    syncData()
    toast.success("Read administrative dispatches cleared")
  }

  const handleToggleRead = (id: string, currentRead: boolean) => {
    if (!currentRead) {
      markNotificationAsRead(id)
      syncData()
      toast.success("Dispatch marked as read")
    }
  }

  const handleDelete = (id: string) => {
    deleteNotification(id)
    syncData()
    toast.success("Notification removed")
  }

  const handleSimulateAlert = () => {
    const notif = simulateIncomingAlert("admin")
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
          Review
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
            <ScrollText className="size-3" />
            Protocol Intake
          </Badge>
        )
      case "deliberation":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800 text-xs font-semibold rounded-md gap-1"
          >
            <Scale className="size-3" />
            Deliberation Action
          </Badge>
        )
      case "accreditation":
        return (
          <Badge
            variant="outline"
            className="bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 text-xs font-semibold rounded-md gap-1"
          >
            <Award className="size-3" />
            Reviewer Dossier
          </Badge>
        )
      case "security":
        return (
          <Badge
            variant="outline"
            className="bg-purple-50 text-purple-800 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800 text-xs font-semibold rounded-md gap-1"
          >
            <ShieldAlert className="size-3" />
            Ledger & Security
          </Badge>
        )
      default:
        return (
          <Badge
            variant="outline"
            className="bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-300 text-xs font-semibold rounded-md gap-1"
          >
            <Sliders className="size-3" />
            Governance System
          </Badge>
        )
    }
  }

  return (
    <div className="w-full space-y-6 pb-12 select-text">
      {/* ── KPI METRIC CARDS (Rule 10 & 11) ────────────────────────────────── */}
      <KpiGrid columns={4}>
        <KpiCard
          label="Secretariat Dispatches"
          value={totalCount}
          description="Institutional audit log"
          icon={ShieldCheck}
          color="navy"
        />
        <KpiCard
          label="Unread Alerts"
          value={unreadCount}
          description={unreadCount === 0 ? "Secretariat synchronized" : "Action required"}
          icon={Bell}
          color="green"
          badge={
            unreadCount > 0 ? (
              <Badge className="bg-emerald-600 text-white text-xs font-bold rounded-md">
                {unreadCount} Pending
              </Badge>
            ) : undefined
          }
        />
        <KpiCard
          label="Protocol Intakes"
          value={protocolIntakeCount}
          description="Triage & submissions"
          icon={ScrollText}
          color="sky"
        />
        <KpiCard
          label="Reviewer Actions"
          value={deliberationCount}
          description="Acceptances & determinations"
          icon={Scale}
          color="amber"
        />
      </KpiGrid>

      {/* ── TOOLBAR & FILTERS ─────────────────────────────────────────────── */}
      <div className="rounded-xl border border-border/75 bg-white dark:bg-[#0C1E34] p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search secretariat dispatches by protocol, applicant, reviewer, or keywords..."
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
                    Purge Read Dispatches?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-body-sm text-muted-foreground">
                    This will remove all acknowledged notifications from the Compliance Secretariat queue. Active ledger records are safely retained.
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
                    Confirm Purge
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
              <span>Simulate Dispatch</span>
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
              All Dispatches ({totalCount})
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
              Pending Acknowledgment ({unreadCount})
            </Button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Category Select */}
            <Select value={selectedCategory} onValueChange={(val) => setSelectedCategory(val ?? "all")}>
              <SelectTrigger className="w-full sm:w-48 h-9 rounded-md border-border/75 text-xs font-medium">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="protocol">Protocol Submissions</SelectItem>
                <SelectItem value="deliberation">Reviewer Actions</SelectItem>
                <SelectItem value="accreditation">Reviewer Dossiers</SelectItem>
                <SelectItem value="security">Ledger & Security</SelectItem>
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
                <SelectItem value="low">Routine</SelectItem>
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
              <ShieldCheck className="size-7 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-foreground">
              No dispatches match your query
            </h3>
            <p className="text-body-sm text-muted-foreground mt-1 max-w-md">
              {searchQuery || selectedCategory !== "all" || selectedPriority !== "all"
                ? "Try clearing your query or reset the filter dropdowns."
                : "All secretariat operational items are acknowledged and up to date."}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={cn(
                "rounded-xl border transition-all duration-150 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs select-text",
                !notif.read
                  ? "bg-white dark:bg-[#0C1E34] border-primary/40 dark:border-sky-800 ring-1 ring-primary/10"
                  : "bg-white/80 dark:bg-[#0C1E34]/80 border-border/75 opacity-90 hover:opacity-100"
              )}
            >
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                <div
                  className={cn(
                    "size-10 rounded-lg flex items-center justify-center shrink-0 border border-border/75 shadow-xs mt-0.5",
                    !notif.read
                      ? "bg-slate-100 dark:bg-slate-800 border-primary/50"
                      : "bg-slate-50 dark:bg-slate-900"
                  )}
                >
                  {notif.category === "protocol" ? (
                    <ScrollText className="size-5 text-sky-600 dark:text-sky-400" />
                  ) : notif.category === "deliberation" ? (
                    <Scale className="size-5 text-amber-600 dark:text-amber-400" />
                  ) : notif.category === "accreditation" ? (
                    <Award className="size-5 text-emerald-600 dark:text-emerald-400" />
                  ) : notif.category === "security" ? (
                    <ShieldAlert className="size-5 text-purple-600 dark:text-purple-400" />
                  ) : (
                    <Sliders className="size-5 text-slate-500 dark:text-slate-400" />
                  )}
                </div>

                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {!notif.read && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary dark:text-sky-300 bg-primary/10 dark:bg-sky-950 px-2 py-0.5 rounded-full">
                        <span className="size-1.5 rounded-full bg-primary dark:bg-sky-400 animate-pulse" />
                        New Dispatch
                      </span>
                    )}
                    {getCategoryBadge(notif.category)}
                    {notif.priority === "urgent" && (
                      <Badge className="bg-rose-600 text-white text-[11px] font-bold rounded-md">
                        Urgent
                      </Badge>
                    )}
                    {notif.priority === "high" && (
                      <Badge className="bg-amber-600 text-white text-[11px] font-bold rounded-md">
                        High
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground ml-auto whitespace-nowrap">
                      {notif.timestamp}
                    </span>
                  </div>

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
                      <span>{notif.actionLabel || "Process"}</span>
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
                  title="Dismiss dispatch"
                  aria-label="Dismiss dispatch"
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
                  <span className="text-xs text-muted-foreground ml-auto">
                    {inspectingNotif.timestamp}
                  </span>
                </div>
                <SheetTitle className="text-xl font-bold text-foreground">
                  {inspectingNotif.title}
                </SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground">
                  Secretariat Record: {inspectingNotif.id}
                </SheetDescription>
              </SheetHeader>

              {/* Message Well */}
              <div className="rounded-xl border border-border/75 bg-slate-50 dark:bg-slate-900/60 p-4 space-y-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Dispatch Detail
                </h5>
                <p className="text-body text-foreground leading-relaxed select-text">
                  {inspectingNotif.message}
                </p>
              </div>

              {/* Ledger Metadata */}
              <div className="rounded-xl border border-border/75 p-4 space-y-3 bg-white dark:bg-[#0C1E34]">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Governance Dispatch Record
                </h5>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground block">Governance Pillar</span>
                    <span className="font-semibold text-foreground">
                      Research Compliance Secretariat
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Priority Level</span>
                    <span className="font-semibold text-foreground uppercase">
                      {inspectingNotif.priority}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground block">Timestamp</span>
                    <span className="font-mono text-[11px] text-foreground">
                      {inspectingNotif.createdAt}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/50 flex items-center gap-2 text-xs text-secondary dark:text-emerald-400 font-semibold">
                  <ShieldCheck className="size-4 shrink-0" />
                  <span>FIPS 140-3 SHA-256 Validated System Dispatch</span>
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
                      <span>{inspectingNotif.actionLabel || "Process Item"}</span>
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
                      toast.success("Dispatch marked as read")
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
