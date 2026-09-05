"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import {
  Users,
  ShieldCheck,
  UserCheck,
  UserX,
  Scale,
  Calendar,
  Building2,
  Mail,
  Phone,
  ExternalLink,
  Eye,
  CheckCircle2,
  AlertTriangle,
  ClipboardCheck,
  UserPlus,
  ChevronDown,
  XCircle,
  FolderOpen,
} from "lucide-react"
import {
  DataTable,
  type ColumnDef,
  type DataTableFilter,
} from "@/components/ui/data-table"
import { KpiCard, KpiGrid } from "@/components/ui/kpi-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/sonner"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import {
  type AccreditedReviewer,
  initialAccreditedReviewers,
  getStoredReviewers,
  subscribeReviewers,
  updateReviewerStatus,
} from "@/lib/reviewer-roster"
import {
  type AdminMember,
  initialAdminMembers,
  getStoredAdminMembers,
  subscribeAdminMembers,
  addAdminMember,
  toggleAdminMemberStatus,
} from "@/lib/admin-roster"

function AdminRosterContent() {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")
  const [activeTab, setActiveTab] = React.useState<string>(
    tabParam === "admins" ? "admins" : "reviewers"
  )

  // ── Reviewer State ─────────────────────────────────────────────────────────
  const reviewers = React.useSyncExternalStore(
    subscribeReviewers,
    getStoredReviewers,
    () => initialAccreditedReviewers
  )

  const [selectedReviewer, setSelectedReviewer] =
    React.useState<AccreditedReviewer | null>(null)
  const [dossierOpen, setDossierOpen] = React.useState(false)

  const handleToggleReviewerStatus = (
    reviewer: AccreditedReviewer,
    nextStatus: "Active" | "Inactive"
  ) => {
    updateReviewerStatus(
      reviewer.id,
      nextStatus,
      nextStatus === "Inactive"
        ? "Account suspended by Secretariat"
        : undefined
    )

    if (nextStatus === "Active") {
      toast.success("Reviewer Account Activated", {
        description: `${reviewer.name} (${reviewer.id}) has been restored to Active standing with full quorum voting credentials.`,
      })
    } else {
      toast.warning("Reviewer Account Suspended", {
        description: `${reviewer.name} (${reviewer.id}) has been marked Inactive. Committee voting privileges are suspended.`,
      })
    }

    if (selectedReviewer?.id === reviewer.id) {
      setSelectedReviewer((prev) =>
        prev ? { ...prev, status: nextStatus } : null
      )
    }
  }

  // ── Administrator State & Actions ──────────────────────────────────────────
  const adminMembers = React.useSyncExternalStore(
    subscribeAdminMembers,
    getStoredAdminMembers,
    () => initialAdminMembers
  )

  const [isAddAdminOpen, setIsAddAdminOpen] = React.useState(false)
  const [adminFormError, setAdminFormError] = React.useState<string | null>(null)
  const [newAdmin, setNewAdmin] = React.useState({
    name: "",
    email: "",
    role: "System Administrator",
    department: "Research Compliance Secretariat",
    status: "Active" as "Active" | "Inactive",
    protocols: 0,
  })

  const handleToggleAdminStatus = (id: string, name: string) => {
    const updated = toggleAdminMemberStatus(id)
    if (updated) {
      if (updated.status === "Active") {
        toast.success("Administrator Account Activated", {
          description: `${name} (${updated.id}) restored to Active status with full governance authority.`,
        })
      } else {
        toast.warning("Administrator Account Suspended", {
          description: `${name} (${updated.id}) marked Inactive. Governance permissions and signing privileges paused.`,
        })
      }
    }
  }

  const handleCreateAdmin = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!newAdmin.name.trim()) {
      setAdminFormError("Please enter the administrator's full name.")
      return
    }
    if (!newAdmin.email.trim() || !newAdmin.email.includes("@")) {
      setAdminFormError("Please enter a valid institutional email address.")
      return
    }

    const created = addAdminMember({
      name: newAdmin.name,
      email: newAdmin.email,
      role: newAdmin.role,
      department: newAdmin.department,
      status: newAdmin.status,
      protocols: Number(newAdmin.protocols) || 0,
    })

    toast.success("New Administrator Appointed", {
      description: `${created.name} (${created.id}) appointed as ${created.role} with ${created.status} status.`,
    })

    setNewAdmin({
      name: "",
      email: "",
      role: "System Administrator",
      department: "Research Compliance Secretariat",
      status: "Active",
      protocols: 0,
    })
    setAdminFormError(null)
    setIsAddAdminOpen(false)
  }

  // ── Reviewers Metrics ────────────────────────────────────────────────────
  const reviewerTotal = reviewers.length
  const reviewerActive = reviewers.filter((r) => r.status === "Active").length
  const reviewerInactive = reviewers.filter((r) => r.status === "Inactive").length
  const reviewerProtocols = reviewers.reduce((sum, r) => sum + r.assignedProtocols, 0)
  const meanReviewerWorkload =
    reviewerTotal > 0 ? (reviewerProtocols / reviewerTotal).toFixed(1) : "0"

  // ── Admins Metrics ───────────────────────────────────────────────────────
  const adminTotal = adminMembers.length
  const adminActive = adminMembers.filter((m) => m.status === "Active").length
  const adminInactive = adminMembers.filter((m) => m.status === "Inactive").length
  const adminProtocols = adminMembers.reduce((sum, m) => sum + m.protocols, 0)

  // ── Reviewer Columns ─────────────────────────────────────────────────────
  const reviewerColumns: ColumnDef<AccreditedReviewer>[] = React.useMemo(
    () => [
      {
        id: "id",
        accessorKey: "id",
        header: "Reviewer ID",
        sortable: true,
        headerClassName: "w-[130px]",
        cell: ({ row }) => (
          <div className="space-y-1">
            <span className="font-mono text-xs font-bold text-[#002752] dark:text-sky-300 block">
              {row.id}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
              <Calendar className="size-3" />
              <span>{row.accreditationDate}</span>
            </div>
          </div>
        ),
      },
      {
        id: "name",
        accessorKey: "name",
        header: "Reviewer & Academic Profile",
        sortable: true,
        cell: ({ row }) => (
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {row.name}
              </span>
              <Badge
                variant="outline"
                className="text-[10px] font-mono px-1.5 py-0 h-4 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300"
              >
                {row.degree}
              </Badge>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
              <Building2 className="size-3 text-slate-400 shrink-0" />
              <span className="truncate max-w-[280px]">
                {row.position} • {row.department}, {row.institution}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
              <span className="flex items-center gap-1">
                <Mail className="size-3 text-slate-400" />
                <span>{row.email}</span>
              </span>
              <span className="flex items-center gap-1">
                <Phone className="size-3 text-slate-400" />
                <span>{row.phone}</span>
              </span>
            </div>
          </div>
        ),
      },
      {
        id: "board",
        accessorKey: "board",
        header: "Board & Quorum Role",
        sortable: true,
        headerClassName: "w-[200px]",
        cell: ({ row }) => (
          <div className="space-y-1.5">
            <Badge className="bg-[#002752]/10 dark:bg-sky-500/10 text-[#002752] dark:text-sky-300 border-[#002752]/20 font-medium text-[11px] block text-center truncate">
              {row.board}
            </Badge>
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {row.role}
              </span>
              <span className="text-[10px] text-slate-400">
                {row.clearanceLevel}
              </span>
            </div>
          </div>
        ),
      },
      {
        id: "specializations",
        accessorKey: "specializations",
        header: "Specializations",
        headerClassName: "w-[190px]",
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1 max-w-[200px]">
            {row.specializations.slice(0, 2).map((s) => (
              <Badge
                key={s}
                variant="secondary"
                className="text-[10px] py-0 px-1.5 bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300"
              >
                {s}
              </Badge>
            ))}
            {row.specializations.length > 2 && (
              <span className="text-[10px] text-slate-400 font-mono self-center">
                +{row.specializations.length - 2} more
              </span>
            )}
          </div>
        ),
      },
      {
        id: "assignedProtocols",
        accessorKey: "assignedProtocols",
        header: "Workload",
        sortable: true,
        headerClassName: "w-[100px] text-center",
        cell: ({ row }) => (
          <div className="text-center">
            <span className="font-mono text-sm font-bold text-slate-800 dark:text-slate-200">
              {row.assignedProtocols}
            </span>
            <span className="block text-[10px] text-slate-400">protocols</span>
          </div>
        ),
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Account Standing",
        sortable: true,
        headerClassName: "w-[130px] text-center",
        cell: ({ row }) => {
          const isActive = row.status === "Active"
          return (
            <div className="flex flex-col items-center gap-1">
              <Badge
                className={`text-[11px] font-bold px-2 py-0.5 border flex items-center gap-1.5 ${
                  isActive
                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20"
                }`}
              >
                <span
                  className={`size-1.5 rounded-full ${
                    isActive ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                  }`}
                />
                <span>{isActive ? "Active" : "Inactive"}</span>
              </Badge>
              {row.statusReason && !isActive && (
                <span className="text-[9px] text-slate-400 max-w-[110px] text-center truncate">
                  {row.statusReason}
                </span>
              )}
            </div>
          )
        },
      },
      {
        id: "actions",
        header: "Actions",
        headerClassName: "w-[180px] text-right",
        cell: ({ row }) => {
          const reviewer = row
          const isActive = reviewer.status === "Active"
          const nextStatus = isActive ? "Inactive" : "Active"

          return (
            <div className="flex items-center justify-end gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedReviewer(reviewer)
                  setDossierOpen(true)
                }}
                className="h-8 px-2.5 text-xs font-semibold rounded-lg text-slate-600 dark:text-slate-300 border-slate-200/90 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                title="View full credentials & dossier"
              >
                <Eye className="size-3.5 mr-1" />
                <span>Dossier</span>
              </Button>

              <AlertDialog>
                <AlertDialogTrigger render={
                  <Button
                    type="button"
                    variant={isActive ? "outline" : "default"}
                    size="sm"
                    className={`h-8 px-2.5 text-xs font-bold rounded-lg cursor-pointer ${
                      isActive
                        ? "text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                        : "bg-[#198754] hover:bg-[#146c43] text-white"
                    }`}
                  >
                    {isActive ? (
                      <>
                        <UserX className="size-3.5 mr-1" />
                        <span>Deactivate</span>
                      </>
                    ) : (
                      <>
                        <UserCheck className="size-3.5 mr-1" />
                        <span>Activate</span>
                      </>
                    )}
                  </Button>
                } />
                <AlertDialogContent className="sm:max-w-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-base font-bold text-[#002752] dark:text-white flex items-center gap-2">
                      {isActive ? (
                        <>
                          <AlertTriangle className="size-5 text-amber-500 shrink-0" />
                          <span>Suspend Reviewer Account Standing?</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="size-5 text-emerald-500 shrink-0" />
                          <span>Reactivate Reviewer Account Standing?</span>
                        </>
                      )}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-2">
                      {isActive ? (
                        <>
                          Are you sure you want to set{" "}
                          <strong className="text-slate-900 dark:text-white">
                            {reviewer.name}
                          </strong>{" "}
                          ({reviewer.id}) to <strong>Inactive</strong>?
                          <span className="block mt-2 text-xs text-amber-800 dark:text-amber-300 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
                            • Reviewer quorum voting privileges will be immediately paused.
                            <br />
                            • Protocol triage assignments will be temporarily suspended.
                          </span>
                        </>
                      ) : (
                        <>
                          Are you sure you want to restore{" "}
                          <strong className="text-slate-900 dark:text-white">
                            {reviewer.name}
                          </strong>{" "}
                          ({reviewer.id}) to <strong>Active</strong>?
                          <span className="block mt-2 text-xs text-emerald-800 dark:text-emerald-300 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
                            • Cryptographic quorum voting rights will be re-authorized.
                            <br />
                            • Reviewer will be eligible for new protocol deliberations.
                          </span>
                        </>
                      )}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="text-xs font-semibold">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleToggleReviewerStatus(reviewer, nextStatus)}
                      className={`text-xs font-bold text-white ${
                        isActive
                          ? "bg-amber-600 hover:bg-amber-700"
                          : "bg-emerald-600 hover:bg-emerald-700"
                      }`}
                    >
                      {isActive ? "Confirm Deactivation" : "Confirm Activation"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reviewers]
  )

  // ── Admin Columns ────────────────────────────────────────────────────────
  const adminColumns: ColumnDef<AdminMember>[] = React.useMemo(
    () => [
      {
        id: "id",
        accessorKey: "id",
        header: "Admin ID",
        sortable: true,
        headerClassName: "w-[130px]",
        cell: ({ row }) => (
          <div className="space-y-1">
            <span className="font-mono text-xs font-bold text-[#002752] dark:text-sky-300 block">
              {row.id}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
              <Calendar className="size-3" />
              <span>{row.addedAt}</span>
            </div>
          </div>
        ),
      },
      {
        id: "name",
        accessorKey: "name",
        header: "Officer / Administrator",
        sortable: true,
        cell: ({ row }) => {
          const initials =
            row.name
              .split(" ")
              .filter(Boolean)
              .map((p) => p[0])
              .slice(0, 2)
              .join("")
              .toUpperCase() || "AD"

          return (
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-full bg-[#002752]/10 dark:bg-sky-500/10 text-[#002752] dark:text-sky-300 flex items-center justify-center font-bold text-xs shrink-0 border border-[#002752]/15 dark:border-sky-500/20">
                {initials}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {row.name}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {row.email}
                </div>
              </div>
            </div>
          )
        },
      },
      {
        id: "role",
        accessorKey: "role",
        header: "Governance Role",
        sortable: true,
        cell: ({ row }) => (
          <Badge
            variant="outline"
            className="text-[11px] font-semibold bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 whitespace-nowrap"
          >
            {row.role}
          </Badge>
        ),
      },
      {
        id: "department",
        accessorKey: "department",
        header: "Department / Secretariat",
        sortable: true,
        cell: ({ row }) => (
          <span className="text-xs text-slate-600 dark:text-slate-300 truncate max-w-[220px] block">
            {row.department}
          </span>
        ),
      },
      {
        id: "protocols",
        accessorKey: "protocols",
        header: "Protocols",
        sortable: true,
        headerClassName: "w-[100px] text-center",
        cell: ({ row }) => (
          <div className="text-center">
            <span className="font-mono text-sm font-bold text-slate-800 dark:text-slate-200 tabular-nums">
              {row.protocols}
            </span>
            <span className="block text-[10px] text-slate-400">assigned</span>
          </div>
        ),
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Account Standing",
        sortable: true,
        headerClassName: "w-[130px] text-center",
        cell: ({ row }) => {
          const isActive = row.status === "Active"
          return (
            <div className="flex flex-col items-center">
              <Badge
                className={`text-[11px] font-bold px-2 py-0.5 border flex items-center gap-1.5 ${
                  isActive
                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25"
                    : "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/25"
                }`}
              >
                <span
                  className={`size-1.5 rounded-full ${
                    isActive ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                  }`}
                />
                <span>{row.status}</span>
              </Badge>
            </div>
          )
        },
      },
      {
        id: "actions",
        header: "Manage Access",
        headerClassName: "w-[140px] text-right",
        cell: ({ row }) => {
          const isActive = row.status === "Active"
          return (
            <div className="flex items-center justify-end">
              <AlertDialog>
                <AlertDialogTrigger render={
                  <Button
                    type="button"
                    variant={isActive ? "outline" : "default"}
                    size="sm"
                    className={`h-8 px-2.5 text-xs font-bold rounded-lg cursor-pointer ${
                      isActive
                        ? "border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                        : "bg-[#198754] hover:bg-[#146c43] text-white"
                    }`}
                  >
                    {isActive ? (
                      <>
                        <UserX className="size-3.5 mr-1" />
                        <span>Deactivate</span>
                      </>
                    ) : (
                      <>
                        <UserCheck className="size-3.5 mr-1" />
                        <span>Activate</span>
                      </>
                    )}
                  </Button>
                } />
                <AlertDialogContent className="sm:max-w-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-base font-bold text-[#002752] dark:text-white flex items-center gap-2">
                      {isActive ? (
                        <>
                          <AlertTriangle className="size-5 text-rose-500 shrink-0" />
                          <span>Deactivate Administrator Account?</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="size-5 text-emerald-500 shrink-0" />
                          <span>Restore Administrator Account?</span>
                        </>
                      )}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-2">
                      {isActive ? (
                        <>
                          Are you sure you want to deactivate{" "}
                          <strong className="text-slate-900 dark:text-white">
                            {row.name}
                          </strong>{" "}
                          ({row.email})?
                          <span className="block mt-2 text-xs text-rose-800 dark:text-rose-300 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
                            • Institutional governance permissions, protocol assignment authority, and credential signing access will be suspended immediately.
                          </span>
                        </>
                      ) : (
                        <>
                          Are you sure you want to activate{" "}
                          <strong className="text-slate-900 dark:text-white">
                            {row.name}
                          </strong>{" "}
                          ({row.email})?
                          <span className="block mt-2 text-xs text-emerald-800 dark:text-emerald-300 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
                            • Full institutional governance authority and protocol assignment privileges will be restored immediately.
                          </span>
                        </>
                      )}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="text-xs font-semibold">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleToggleAdminStatus(row.id, row.name)}
                      className={`text-xs font-bold text-white ${
                        isActive
                          ? "bg-rose-600 hover:bg-rose-700"
                          : "bg-emerald-600 hover:bg-emerald-700"
                      }`}
                    >
                      {isActive ? "Confirm Deactivation" : "Confirm Activation"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [adminMembers]
  )

  // ── Faceted Filters ──────────────────────────────────────────────────────
  const reviewerFilters: DataTableFilter<AccreditedReviewer>[] = React.useMemo(
    () => [
      {
        id: "status",
        title: "Account Standing",
        accessorKey: "status",
        options: [
          { label: "Active Members", value: "Active" },
          { label: "Inactive / Suspended", value: "Inactive" },
        ],
      },
      {
        id: "board",
        title: "Ethics Board",
        accessorKey: "board",
        options: [
          {
            label: "Biomedical & Clinical IRB",
            value: "Biomedical & Clinical IRB",
          },
          {
            label: "Social & Behavioral IRB",
            value: "Social & Behavioral IRB",
          },
          {
            label: "AI & Technology Ethics Panel",
            value: "AI & Technology Ethics Panel",
          },
        ],
      },
    ],
    []
  )

  const adminFilters: DataTableFilter<AdminMember>[] = React.useMemo(
    () => [
      {
        id: "status",
        title: "Account Standing",
        accessorKey: "status",
        options: [
          { label: "Active Officers", value: "Active" },
          { label: "Inactive / Suspended", value: "Inactive" },
        ],
      },
    ],
    []
  )

  return (
    <div className="space-y-6 sm:space-y-8 select-text">
      {/* ── Top Tabs Navigation ──────────────────────────────────────────────── */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <TabsList className="bg-slate-200/70 dark:bg-slate-800/80 p-1 rounded-xl h-10 border border-slate-300/60 dark:border-slate-700/60">
            <TabsTrigger
              value="reviewers"
              className="rounded-lg text-xs font-bold px-3.5 gap-2 cursor-pointer data-[state=active]:bg-white dark:data-[state=active]:bg-[#0C1E34] data-[state=active]:text-[#002752] dark:data-[state=active]:text-white shadow-xs"
            >
              <Users className="size-4 text-[#002752] dark:text-sky-300" />
              <span>Accredited Reviewers</span>
              <Badge className="ml-1 text-[10px] py-0 px-1.5 bg-[#002752]/10 dark:bg-white/10 text-[#002752] dark:text-white border-none">
                {reviewerTotal}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="admins"
              className="rounded-lg text-xs font-bold px-3.5 gap-2 cursor-pointer data-[state=active]:bg-white dark:data-[state=active]:bg-[#0C1E34] data-[state=active]:text-[#002752] dark:data-[state=active]:text-white shadow-xs"
            >
              <ShieldCheck className="size-4 text-[#198754] dark:text-emerald-400" />
              <span>Institutional Administrators</span>
              <Badge className="ml-1 text-[10px] py-0 px-1.5 bg-[#198754]/10 dark:bg-white/10 text-[#198754] dark:text-white border-none">
                {adminTotal}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Link href="/admin/applications">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-xs font-semibold rounded-lg border-slate-200/90 dark:border-slate-700"
              >
                <ClipboardCheck className="size-3.5 text-[#002752] dark:text-sky-400" />
                <span>Applications Queue</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            TAB 1: ACCREDITED REVIEWERS
        ══════════════════════════════════════════════════════════════════════ */}
        <TabsContent value="reviewers" className="space-y-6 focus-visible:outline-none">
          <KpiGrid columns={4}>
            <KpiCard
              label="Total Accredited Roster"
              value={reviewerTotal}
              description="Enrolled in institutional committee"
              icon={Users}
              color="navy"
            />
            <KpiCard
              label="Active Voting Quorum"
              value={reviewerActive}
              description="Authorized with voting credentials"
              icon={UserCheck}
              color="green"
            />
            <KpiCard
              label="Inactive / Suspended"
              value={reviewerInactive}
              description="Standing paused by Secretariat"
              icon={UserX}
              color="amber"
            />
            <KpiCard
              label="Mean Deliberation Workload"
              value={`${meanReviewerWorkload}`}
              description="Active protocol assignments"
              icon={Scale}
              color="gold"
            />
          </KpiGrid>

          <div className="w-full">
            <DataTable<AccreditedReviewer>
              data={reviewers}
              columns={reviewerColumns}
              title="Institutional Reviewer Roster & Quorum Standing"
              description="Official register of accredited ethics committee members authorized with quorum deliberation standing and voting seals"
              searchPlaceholder="Search reviewers by name, institution, email, or specialization..."
              searchKeys={[
                "name",
                "email",
                "department",
                "institution",
                "board",
                "specializations",
              ]}
              filters={reviewerFilters}
              initialPageSize={10}
              pageSizeOptions={[5, 10, 20, 50]}
              initialSort={{
                columnId: "id",
                direction: "desc",
              }}
            />
          </div>
        </TabsContent>

        {/* ══════════════════════════════════════════════════════════════════════
            TAB 2: INSTITUTIONAL ADMINISTRATORS
        ══════════════════════════════════════════════════════════════════════ */}
        <TabsContent value="admins" className="space-y-6 focus-visible:outline-none">
          <KpiGrid columns={4}>
            <KpiCard
              label="Total Administrators"
              value={adminTotal}
              description="Registered governance officers"
              icon={ShieldCheck}
              color="navy"
            />
            <KpiCard
              label="Active Governance Leads"
              value={adminActive}
              description="Authorized with administrative clearance"
              icon={UserCheck}
              color="green"
            />
            <KpiCard
              label="Inactive / Suspended"
              value={adminInactive}
              description="Administrative access paused"
              icon={UserX}
              color="rose"
            />
            <KpiCard
              label="Total Oversight Protocols"
              value={adminProtocols}
              description="Managed under active RBAC"
              icon={FolderOpen}
              color="gold"
            />
          </KpiGrid>

          <div className="w-full">
            <DataTable<AdminMember>
              data={adminMembers}
              columns={adminColumns}
              title="Governance Administrators & RBAC Directory"
              description="Role-Based Access Control (RBAC) governance for institutional ethics officers, secretariat directors, and triage leads"
              searchPlaceholder="Search administrators by name, email, role, or department..."
              searchKeys={["name", "email", "role", "department"]}
              filters={adminFilters}
              initialPageSize={10}
              pageSizeOptions={[5, 10, 20]}
              initialSort={{
                columnId: "id",
                direction: "asc",
              }}
              toolbarActions={
                <Dialog open={isAddAdminOpen} onOpenChange={setIsAddAdminOpen}>
                  <Button
                    type="button"
                    onClick={() => {
                      setAdminFormError(null)
                      setIsAddAdminOpen(true)
                    }}
                    className="inline-flex items-center h-8 px-3 bg-[#002752] hover:bg-[#001c3d] text-white font-bold text-xs rounded-lg transition-colors shadow-2xs shrink-0 cursor-pointer"
                  >
                    <UserPlus className="size-3.5 mr-1.5" />
                    <span>Appoint Administrator</span>
                  </Button>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-base font-bold text-[#002752] dark:text-white">
                        Appoint Institutional Administrator
                      </DialogTitle>
                      <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
                        Register a new ethics governance officer, committee secretariat member, or triage lead into the RBAC directory.
                      </DialogDescription>
                    </DialogHeader>

                    {adminFormError && (
                      <div className="flex items-center gap-2 p-2.5 rounded-lg border border-rose-500/30 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 text-xs font-semibold">
                        <XCircle className="size-4 shrink-0 text-rose-600 dark:text-rose-400" />
                        <span>{adminFormError}</span>
                      </div>
                    )}

                    <div className="space-y-3 py-1 text-xs">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Full Name & Title <span className="text-rose-500">*</span>
                        </label>
                        <Input
                          type="text"
                          placeholder="e.g. Prof. Mohammad Kabir"
                          value={newAdmin.name}
                          onChange={(e) => {
                            setAdminFormError(null)
                            setNewAdmin((p) => ({ ...p, name: e.target.value }))
                          }}
                          className="h-8 text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Institutional Email Address <span className="text-rose-500">*</span>
                        </label>
                        <Input
                          type="email"
                          placeholder="e.g. m.kabir@diu.edu.bd"
                          value={newAdmin.email}
                          onChange={(e) => {
                            setAdminFormError(null)
                            setNewAdmin((p) => ({ ...p, email: e.target.value }))
                          }}
                          className="h-8 text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Governance Role
                        </label>
                        <DropdownMenu>
                          <DropdownMenuTrigger render={
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full justify-between h-8 px-3 text-xs font-medium border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer"
                            >
                              <span className="truncate">{newAdmin.role}</span>
                              <ChevronDown className="size-3.5 text-slate-400 shrink-0 ml-2" />
                            </Button>
                          } />
                          <DropdownMenuContent className="w-[340px] max-h-56 overflow-y-auto">
                            <DropdownMenuRadioGroup
                              value={newAdmin.role}
                              onValueChange={(val) =>
                                setNewAdmin((p) => ({ ...p, role: val }))
                              }
                            >
                              {[
                                "Director of Governance & Compliance",
                                "System Administrator",
                                "IRB Committee Chair",
                                "Screening Triage Officer",
                                "Principal Investigator",
                                "Institutional Legal & Ethics Counsel",
                                "Research Ethics Auditor",
                              ].map((role) => (
                                <DropdownMenuRadioItem
                                  key={role}
                                  value={role}
                                  className="text-xs font-medium cursor-pointer py-1.5 px-2.5"
                                >
                                  {role}
                                </DropdownMenuRadioItem>
                              ))}
                            </DropdownMenuRadioGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Faculty / Department
                        </label>
                        <DropdownMenu>
                          <DropdownMenuTrigger render={
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full justify-between h-8 px-3 text-xs font-medium border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer"
                            >
                              <span className="truncate">{newAdmin.department}</span>
                              <ChevronDown className="size-3.5 text-slate-400 shrink-0 ml-2" />
                            </Button>
                          } />
                          <DropdownMenuContent className="w-[340px] max-h-56 overflow-y-auto">
                            <DropdownMenuRadioGroup
                              value={newAdmin.department}
                              onValueChange={(val) =>
                                setNewAdmin((p) => ({ ...p, department: val }))
                              }
                            >
                              {[
                                "Research Compliance Secretariat",
                                "Biomedical Research Ethics Board",
                                "Public Health & Clinical Epidemiology",
                                "Pediatrics & Behavioral Health",
                                "AI & Data Science Ethics Board",
                                "Legal & Regulatory Affairs",
                              ].map((dept) => (
                                <DropdownMenuRadioItem
                                  key={dept}
                                  value={dept}
                                  className="text-xs font-medium cursor-pointer py-1.5 px-2.5"
                                >
                                  {dept}
                                </DropdownMenuRadioItem>
                              ))}
                            </DropdownMenuRadioGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Assigned Protocols
                          </label>
                          <Input
                            type="number"
                            min={0}
                            value={newAdmin.protocols}
                            onChange={(e) =>
                              setNewAdmin((p) => ({
                                ...p,
                                protocols: Math.max(0, parseInt(e.target.value) || 0),
                              }))
                            }
                            className="h-8 text-xs tabular-nums"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Initial Standing
                          </label>
                          <div className="grid grid-cols-2 gap-1 pt-0.5">
                            <Button
                              type="button"
                              variant={newAdmin.status === "Active" ? "default" : "outline"}
                              onClick={() => setNewAdmin((p) => ({ ...p, status: "Active" }))}
                              className={`h-7 px-2 text-[11px] font-bold cursor-pointer ${
                                newAdmin.status === "Active"
                                  ? "bg-[#198754] hover:bg-[#146c43] text-white"
                                  : "text-slate-600 dark:text-slate-300"
                              }`}
                            >
                              <UserCheck className="size-3 mr-1" />
                              Active
                            </Button>
                            <Button
                              type="button"
                              variant={newAdmin.status === "Inactive" ? "default" : "outline"}
                              onClick={() => setNewAdmin((p) => ({ ...p, status: "Inactive" }))}
                              className={`h-7 px-2 text-[11px] font-bold cursor-pointer ${
                                newAdmin.status === "Inactive"
                                  ? "bg-rose-600 hover:bg-rose-700 text-white"
                                  : "text-slate-600 dark:text-slate-300"
                              }`}
                            >
                              <UserX className="size-3 mr-1" />
                              Inactive
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setAdminFormError(null)
                          setIsAddAdminOpen(false)
                        }}
                        className="text-xs font-semibold"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        onClick={handleCreateAdmin}
                        className="bg-[#002752] hover:bg-[#001c3d] text-white text-xs font-bold cursor-pointer"
                      >
                        Confirm & Appoint
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              }
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* ── Detailed Reviewer Dossier Modal (Dialog) ─────────────────────────── */}
      <Dialog open={dossierOpen} onOpenChange={setDossierOpen}>
        <DialogContent className="sm:max-w-2xl">
          {selectedReviewer && (
            <>
              <DialogHeader className="border-b border-slate-200/80 dark:border-slate-800 pb-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <DialogTitle className="text-lg font-black text-[#002752] dark:text-white">
                        {selectedReviewer.name}
                      </DialogTitle>
                      <Badge
                        variant="outline"
                        className="text-xs font-mono text-slate-600 dark:text-slate-300"
                      >
                        {selectedReviewer.degree}
                      </Badge>
                    </div>
                    <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
                      Accreditation Code:{" "}
                      <strong className="font-mono text-slate-700 dark:text-slate-200">
                        {selectedReviewer.id}
                      </strong>{" "}
                      • Enrolled {selectedReviewer.accreditationDate}
                    </DialogDescription>
                  </div>

                  <Badge
                    className={`text-xs font-bold px-2.5 py-1 ${
                      selectedReviewer.status === "Active"
                        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20"
                    }`}
                  >
                    {selectedReviewer.status === "Active"
                      ? "Active Standing"
                      : "Inactive Account"}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="space-y-4 py-2 text-xs">
                {/* Academic & Affiliation Coordinates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800">
                  <div className="space-y-1">
                    <span className="text-slate-400 block font-medium">
                      Institution & Department:
                    </span>
                    <strong className="text-slate-800 dark:text-slate-100 font-bold block text-sm">
                      {selectedReviewer.institution}
                    </strong>
                    <span className="text-slate-500 dark:text-slate-400 block">
                      {selectedReviewer.department} • {selectedReviewer.position}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-400 block font-medium">
                      Committee Board & Role:
                    </span>
                    <strong className="text-slate-800 dark:text-slate-100 font-bold block text-sm">
                      {selectedReviewer.board}
                    </strong>
                    <span className="text-slate-500 dark:text-slate-400 block">
                      Role: {selectedReviewer.role} ({selectedReviewer.clearanceLevel})
                    </span>
                  </div>
                </div>

                {/* Contact Coordinates */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-[#0C1E34]">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                      Official Email
                    </span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium block truncate mt-0.5">
                      {selectedReviewer.email}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-[#0C1E34]">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                      Direct Phone
                    </span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium block truncate mt-0.5">
                      {selectedReviewer.phone}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-[#0C1E34]">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                      ORCID Identifier
                    </span>
                    {selectedReviewer.orcid ? (
                      <a
                        href={`https://orcid.org/${selectedReviewer.orcid}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#002752] dark:text-sky-300 font-mono font-bold flex items-center gap-1 mt-0.5 hover:underline"
                      >
                        <span>{selectedReviewer.orcid}</span>
                        <ExternalLink className="size-3" />
                      </a>
                    ) : (
                      <span className="text-slate-400 font-mono">Not specified</span>
                    )}
                  </div>
                </div>

                {/* Specializations & Keywords */}
                <div className="space-y-1.5">
                  <span className="text-slate-500 dark:text-slate-400 font-semibold block">
                    Accredited Review Specializations:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedReviewer.specializations.map((spec) => (
                      <Badge
                        key={spec}
                        className="text-xs bg-[#002752]/10 dark:bg-sky-500/10 text-[#002752] dark:text-sky-300 border-[#002752]/20"
                      >
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Bio / Experience Statement */}
                {selectedReviewer.bioStatement && (
                  <div className="space-y-1">
                    <span className="text-slate-500 dark:text-slate-400 font-semibold block">
                      Ethics Statement & Research Background:
                    </span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-200/70 dark:border-slate-800 leading-relaxed italic">
                      &quot;{selectedReviewer.bioStatement}&quot;
                    </p>
                  </div>
                )}

                {/* Cryptographic Digital Seal Hash */}
                <div className="p-3 rounded-xl bg-slate-900 text-slate-200 dark:bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono text-emerald-400 font-bold flex items-center gap-1">
                      <ShieldCheck className="size-3.5" />
                      SHA-256 Committee Digital Seal
                    </span>
                    <span className="text-slate-400 font-mono text-[10px]">
                      DIU-IRB-FIPS-140-3
                    </span>
                  </div>
                  <div className="font-mono text-[10px] break-all text-slate-300 bg-slate-950/60 p-2 rounded border border-slate-800">
                    {selectedReviewer.digitalSealHash}
                  </div>
                </div>
              </div>

              <DialogFooter className="border-t border-slate-200/80 dark:border-slate-800 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant={selectedReviewer.status === "Active" ? "outline" : "default"}
                    size="sm"
                    onClick={() => {
                      const next = selectedReviewer.status === "Active" ? "Inactive" : "Active"
                      handleToggleReviewerStatus(selectedReviewer, next)
                    }}
                    className={`h-8 px-3 text-xs font-bold rounded-lg cursor-pointer ${
                      selectedReviewer.status === "Active"
                        ? "text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                        : "bg-[#198754] hover:bg-[#146c43] text-white"
                    }`}
                  >
                    {selectedReviewer.status === "Active"
                      ? "Suspend Account (Set Inactive)"
                      : "Reactivate Account (Set Active)"}
                  </Button>
                </div>

                <DialogClose render={
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 px-4 text-xs font-semibold rounded-lg cursor-pointer"
                  >
                    Close Dossier
                  </Button>
                } />
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function AdminReviewerRosterPage() {
  return (
    <React.Suspense fallback={
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="size-8 rounded-full border-2 border-[#002752] border-t-transparent animate-spin" />
      </div>
    }>
      <AdminRosterContent />
    </React.Suspense>
  )
}
