"use client"

import * as React from "react"
import Link from "next/link"
import {
  Users,
  ScrollText,
  Building2,
  CheckCircle2,
  XCircle,
  Lock,
  ArrowUpRight,
  Database,
  ShieldCheck,
  Settings,
  Key,
  UserPlus,
  UserCheck,
  UserX,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { KpiCard, KpiGrid } from "@/components/ui/kpi-card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "@/components/ui/sonner"
import { DataTable, type ColumnDef, type DataTableFilter } from "@/components/ui/data-table"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
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
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import {
  getStoredAdminMembers,
  subscribeAdminMembers,
  addAdminMember,
  toggleAdminMemberStatus,
  type AdminMember,
  initialAdminMembers,
} from "@/lib/admin-roster"

const auditLedgerLogs = [
  {
    txId: "TX-9942-A",
    action: "Digital Clearance Certificate Sealed",
    actor: "IRB Secretariat (Automated HSM)",
    protocol: "ETH-2026-074",
    hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    timestamp: "12 mins ago",
    status: "Immutable Block Confirmed",
  },
  {
    txId: "TX-9941-F",
    action: "Quorum Consensus Vote Recorded",
    actor: "Prof. Charles Montgomery (IRB Chair)",
    protocol: "ETH-2026-089",
    hash: "7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
    timestamp: "46 mins ago",
    status: "Immutable Block Confirmed",
  },
  {
    txId: "TX-9940-C",
    action: "Informed Consent Revision Submitted",
    actor: "Dr. Elena Rostova (PI)",
    protocol: "ETH-2026-042",
    hash: "a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e",
    timestamp: "2 hours ago",
    status: "Immutable Block Confirmed",
  },
  {
    txId: "TX-9939-E",
    action: "Initial Screening Triage Cleared",
    actor: "Officer Nusrat Jahan (Screening Lead)",
    protocol: "ETH-2026-092",
    hash: "2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae",
    timestamp: "4 hours ago",
    status: "Immutable Block Confirmed",
  },
]

export default function AdminDashboardPage() {
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false)
  const [formError, setFormError] = React.useState<string | null>(null)

  const [newAdmin, setNewAdmin] = React.useState({
    name: "",
    email: "",
    role: "System Administrator",
    department: "Research Compliance Secretariat",
    status: "Active" as "Active" | "Inactive",
    protocols: 0,
  })

  const members = React.useSyncExternalStore(
    subscribeAdminMembers,
    getStoredAdminMembers,
    () => initialAdminMembers
  )

  const handleToggleStatus = (id: string, name: string) => {
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
      setFormError("Please enter the administrator's full name.")
      return
    }
    if (!newAdmin.email.trim() || !newAdmin.email.includes("@")) {
      setFormError("Please enter a valid institutional email address.")
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
      description: `${created.name} (${created.id}) successfully appointed as ${created.role} with ${created.status} status.`,
    })
    setNewAdmin({
      name: "",
      email: "",
      role: "System Administrator",
      department: "Research Compliance Secretariat",
      status: "Active",
      protocols: 0,
    })
    setFormError(null)
    setIsAddModalOpen(false)
  }

  // ── DataTable Column Definitions ──────────────────────────────────────────
  const columns = React.useMemo<ColumnDef<AdminMember>[]>(
    () => [
      {
        id: "id",
        accessorKey: "id",
        header: "Admin ID",
        sortable: true,
        headerClassName: "w-[130px]",
        cell: ({ row }) => (
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-[#002752]/8 dark:bg-white/8 text-[#002752] dark:text-sky-300 border border-[#002752]/10 dark:border-white/10 whitespace-nowrap inline-block">
            {row.id}
          </span>
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
        align: "center",
        headerClassName: "w-[100px]",
        cell: ({ row }) => (
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200 tabular-nums">
            {row.protocols}
          </span>
        ),
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Account Status",
        sortable: true,
        headerClassName: "w-[130px]",
        cell: ({ row }) => {
          const isActive = row.status === "Active"
          return (
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-md border ${
                isActive
                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25"
                  : "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/25"
              }`}
            >
              <span
                className={`size-2 rounded-full ${
                  isActive ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                }`}
              />
              <span>{row.status}</span>
            </span>
          )
        },
      },
      {
        id: "actions",
        header: "Manage Access",
        align: "right",
        headerClassName: "w-[140px]",
        cell: ({ row }) => {
          const isActive = row.status === "Active"
          return (
            <div className="flex items-center justify-end">
              {isActive ? (
                <AlertDialog>
                  <AlertDialogTrigger render={
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 px-2.5 text-xs font-bold rounded-lg border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer gap-1"
                      title="Deactivate Administrator Account"
                    >
                      <UserX className="size-3.5" />
                      <span>Deactivate</span>
                    </Button>
                  } />
                  <AlertDialogContent className="sm:max-w-md">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-base font-bold text-[#002752] dark:text-white">
                        Deactivate Administrator Account
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        Are you sure you want to deactivate <strong className="text-slate-900 dark:text-white">{row.name}</strong> ({row.email})?
                        Their institutional governance permissions, protocol assignment authority, and credential signing access will be suspended immediately.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="text-xs font-semibold">Keep Active</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleToggleStatus(row.id, row.name)}
                        className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
                      >
                        Confirm Deactivation
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <AlertDialog>
                  <AlertDialogTrigger render={
                    <Button
                      type="button"
                      size="sm"
                      className="h-7 px-2.5 text-xs font-bold rounded-lg bg-[#198754] hover:bg-[#146c43] text-white cursor-pointer gap-1"
                      title="Activate Administrator Account"
                    >
                      <UserCheck className="size-3.5" />
                      <span>Activate</span>
                    </Button>
                  } />
                  <AlertDialogContent className="sm:max-w-md">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-base font-bold text-[#002752] dark:text-white">
                        Restore Administrator Account
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        Are you sure you want to activate <strong className="text-slate-900 dark:text-white">{row.name}</strong> ({row.email})?
                        Full institutional governance authority and protocol assignment privileges will be restored immediately.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="text-xs font-semibold">Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleToggleStatus(row.id, row.name)}
                        className="bg-[#198754] hover:bg-[#146c43] text-white text-xs font-bold"
                      >
                        Restore & Activate
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          )
        },
      },
    ],
    []
  )

  // ── DataTable Filters ─────────────────────────────────────────────────────
  const filters: DataTableFilter<AdminMember>[] = React.useMemo(
    () => [
      {
        id: "status",
        title: "Status",
        accessorKey: "status",
        options: [
          { label: "Active Admins", value: "Active" },
          { label: "Inactive Admins", value: "Inactive" },
        ],
      },
      {
        id: "role",
        title: "Role",
        accessorKey: "role",
        options: [
          { label: "Governance Director", value: "Director of Governance & Compliance" },
          { label: "IRB Committee Chair", value: "IRB Committee Chair" },
          { label: "Screening Triage Officer", value: "Screening Triage Officer" },
          { label: "Principal Investigator", value: "Principal Investigator" },
          { label: "Legal Counsel", value: "Institutional Legal & Ethics Counsel" },
          { label: "System Administrator", value: "System Administrator" },
        ],
      },
    ],
    []
  )

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Centralized Institutional Metrics Grid */}
      <KpiGrid columns={4}>
        <KpiCard
          label="Total Institution Protocols"
          value={248}
          description="Across 14 academic faculties"
          icon={Building2}
          color="navy"
        />
        <KpiCard
          label="Clearance Compliance"
          value="100%"
          description="Zero unresolved ethical non-conformities"
          icon={CheckCircle2}
          color="green"
        />
        <KpiCard
          label="Cryptographic Seals"
          value={184}
          description="SHA-256 certificate hashes verified"
          icon={Lock}
          color="amber"
        />
        <KpiCard
          label="Mean Review Velocity"
          value="5.2 Days"
          description="72% acceleration vs manual paper IRB"
          icon={ArrowUpRight}
          color="sky"
        />
      </KpiGrid>

      {/* Cryptographic Audit Trail Section */}
      <div className="rounded-2xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] overflow-hidden" id="audit">
        
        <div className="p-4 sm:p-6 border-b border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#002752] dark:text-white uppercase tracking-tight flex items-center gap-2">
              <ScrollText className="size-5 text-[#198754]" />
              Cryptographic Audit Trail (SHA-256 Ledger)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Every protocol triage, reviewer deliberation, consensus vote, and certificate issuance is immutably timestamped
            </p>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-500/20 self-start sm:self-auto">
            <Database className="size-3.5" />
            <span>FIPS 140-3 HSM Root of Trust</span>
          </span>
        </div>

        {/* Ledger Entries */}
        <div className="divide-y divide-slate-200/70 dark:divide-slate-800">
          {auditLedgerLogs.map((log) => (
            <div
              key={log.txId}
              className="p-4 sm:p-6 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[0.7rem] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {log.txId}
                  </span>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#002752]/10 dark:bg-white/10 text-[#002752] dark:text-sky-300">
                    {log.protocol}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="size-3.5" />
                    {log.status}
                  </span>
                  <span className="text-[0.65rem] text-slate-500 dark:text-slate-400">
                    {log.timestamp}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {log.action} • <span className="text-slate-500 dark:text-slate-400 font-normal">{log.actor}</span>
                </h3>

                <div className="font-mono text-[0.65rem] text-slate-500 dark:text-slate-400 break-all bg-slate-50 dark:bg-slate-900/60 p-2 rounded border border-slate-200/70 dark:border-slate-800/80">
                  <span className="text-slate-400">HASH: </span>
                  {log.hash}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Institutional Member Directory & Governance Administration */}
      <div id="roster" className="space-y-4">
        <DataTable<AdminMember>
          data={members}
          columns={columns}
          title="Institutional Ethics Directory & Governance Administration"
          description={`Role-Based Access Control (RBAC) governance across ${members.length} registered institutional officers (${members.filter((m) => m.status === "Active").length} Active, ${members.filter((m) => m.status === "Inactive").length} Inactive)`}
          searchPlaceholder="Search administrators by name, email, role, or department..."
          searchKeys={["name", "email", "role", "department"]}
          filters={filters}
          initialPageSize={5}
          pageSizeOptions={[5, 10, 20]}
          initialSort={{
            columnId: "id",
            direction: "asc",
          }}
          toolbarActions={
            <div className="flex items-center gap-2">
              <Link
                href="/admin/admins"
                className="inline-flex items-center h-8 px-3 rounded-lg border border-slate-200/90 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors shrink-0"
              >
                <ShieldCheck className="size-3.5 mr-1.5 text-[#002752] dark:text-sky-400" />
                <span>Admin List</span>
              </Link>
              <Link
                href="/admin/roster"
                className="inline-flex items-center h-8 px-3 rounded-lg border border-slate-200/90 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors shrink-0"
              >
                <Users className="size-3.5 mr-1.5 text-[#002752] dark:text-sky-400" />
                <span>Reviewer Roster</span>
              </Link>
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger render={
                  <Button
                    type="button"
                    className="inline-flex items-center h-8 px-3 bg-[#002752] hover:bg-[#001c3d] text-white font-bold text-xs rounded-lg transition-colors shadow-2xs shrink-0 cursor-pointer"
                  >
                    <UserPlus className="size-3.5 mr-1.5" />
                    <span>Add Administrator</span>
                  </Button>
                } />
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-base font-bold text-[#002752] dark:text-white">
                    Appoint Institutional Administrator
                  </DialogTitle>
                  <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
                    Register a new ethics governance officer, committee secretariat member, or triage lead into the RBAC directory.
                  </DialogDescription>
                </DialogHeader>

                {formError && (
                  <Alert className="border-rose-500/30 bg-rose-50/90 dark:bg-rose-950/40 text-rose-950 dark:text-rose-200 py-2">
                    <XCircle className="size-4 text-rose-600 dark:text-rose-400" />
                    <AlertDescription className="text-xs font-semibold text-rose-800 dark:text-rose-300">
                      {formError}
                    </AlertDescription>
                  </Alert>
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
                        setFormError(null)
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
                        setFormError(null)
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
                          onValueChange={(val) => setNewAdmin((p) => ({ ...p, role: val }))}
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
                          onValueChange={(val) => setNewAdmin((p) => ({ ...p, department: val }))}
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
                        Initial Status
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
                              ? "bg-slate-700 text-white"
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
                      setFormError(null)
                      setIsAddModalOpen(false)
                    }}
                    className="text-xs font-semibold"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleCreateAdmin}
                    className="bg-[#002752] hover:bg-[#001c3d] text-white text-xs font-bold"
                  >
                    Confirm & Appoint
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            </div>
          }
        />
      </div>

      {/* ── Section: Certificate Authority ─────────────────────────────────── */}
      <div id="authority" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-[#002752] dark:text-white uppercase tracking-tight flex items-center gap-2">
              <ShieldCheck className="size-5 text-[#002752] dark:text-sky-300" />
              <span>Institutional Certificate Authority & Cryptographic HSM</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              FIPS 140-3 Level 3 Hardware Security Module root-of-trust for tamper-proof ethical clearance issuance
            </p>
          </div>
          <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25 font-mono text-xs font-bold flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Root CA Online</span>
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 rounded-xl border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
              <span>HSM Node Appliance</span>
              <Key className="size-3.5 text-amber-500" />
            </div>
            <p className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
              ETHICA-HSM-PRIMARY-01
            </p>
            <p className="text-[11px] text-slate-500">
              Ed25519 & SHA-256 digital signature appliance in secure vault.
            </p>
          </Card>

          <Card className="p-4 rounded-xl border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
              <span>Public Key Fingerprint</span>
              <Lock className="size-3.5 text-sky-500" />
            </div>
            <p className="font-mono text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">
              SHA256:7a4f91e8c045b8...92df
            </p>
            <p className="text-[11px] text-slate-500">
              Root institutional anchor published on public transparency ledger.
            </p>
          </Card>

          <Card className="p-4 rounded-xl border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
              <span>Next Key Rotation</span>
              <CheckCircle2 className="size-3.5 text-emerald-500" />
            </div>
            <p className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
              In 318 Calendar Days
            </p>
            <p className="text-[11px] text-slate-500">
              Automated dual-custody key ceremony compliant with ISO 27001.
            </p>
          </Card>
        </div>
      </div>

      {/* ── Section: Policy Engine Configuration ───────────────────────────── */}
      <div id="policies" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-[#002752] dark:text-white uppercase tracking-tight flex items-center gap-2">
              <Settings className="size-5 text-[#002752] dark:text-sky-300" />
              <span>Institutional Research Policy Engine Config</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configurable compliance thresholds and automated review workflows
            </p>
          </div>
          <Badge variant="outline" className="text-xs font-mono text-slate-500">
            Engine Version 2026.4
          </Badge>
        </div>

        <Card className="p-5 rounded-xl border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-slate-200/70 dark:border-slate-800 space-y-1">
              <span className="text-slate-400 uppercase font-bold text-[10px] block">IRB Quorum Threshold</span>
              <strong className="text-sm font-black text-slate-900 dark:text-white block">5 Voting Members</strong>
              <span className="text-slate-500 text-[11px] block">Includes at least 1 non-scientific lay member</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-slate-200/70 dark:border-slate-800 space-y-1">
              <span className="text-slate-400 uppercase font-bold text-[10px] block">Fast-Track Turnaround Target</span>
              <strong className="text-sm font-black text-slate-900 dark:text-white block">3 Working Days</strong>
              <span className="text-slate-500 text-[11px] block">Single designated reviewer triage</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-slate-200/70 dark:border-slate-800 space-y-1">
              <span className="text-slate-400 uppercase font-bold text-[10px] block">Full Committee Cycle</span>
              <strong className="text-sm font-black text-slate-900 dark:text-white block">14 Calendar Days</strong>
              <span className="text-slate-500 text-[11px] block">Consensus or majority quorum vote</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-slate-200/70 dark:border-slate-800 space-y-1">
              <span className="text-slate-400 uppercase font-bold text-[10px] block">Data Retention Mandate</span>
              <strong className="text-sm font-black text-slate-900 dark:text-white block">7 Years Post-Closure</strong>
              <span className="text-slate-500 text-[11px] block">Encrypted cold archive storage</span>
            </div>
          </div>
        </Card>
      </div>

    </div>
  )
}
