"use client"

import * as React from "react"
import Link from "next/link"
import {
  ShieldCheck,
  UserCheck,
  UserX,
  UserPlus,
  Eye,
  KeyRound,
  Mail,
  Lock,
  Users,
  CheckCircle2,
  AlertTriangle,
  Clock,
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
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  type AdminMember,
  type AdminAccessLevel,
  initialAdminMembers,
  getStoredAdminMembers,
  subscribeAdminMembers,
  addAdminMember,
  updateAdminMember,
  toggleAdminMemberStatus,
} from "@/lib/admin-roster"

const AVAILABLE_PERMISSIONS = [
  "Root Governance Authority",
  "Full Server & DB Access",
  "Committee Accreditation Signoff",
  "Protocol Intake & Triage",
  "Reviewer Assignment Dispatch",
  "Policy Rule Overrides",
  "Audit Log Decryption",
  "HSM Key Vault Operations",
  "Clearance Certificate Generation",
  "RBAC & Session Management",
  "Institutional Liability Review",
  "Disaster Recovery & Snapshots",
]

export default function AdminListPage() {
  const members = React.useSyncExternalStore(
    subscribeAdminMembers,
    getStoredAdminMembers,
    () => initialAdminMembers
  )

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false)
  const [selectedAdminForEdit, setSelectedAdminForEdit] = React.useState<AdminMember | null>(null)
  const [formError, setFormError] = React.useState<string | null>(null)

  // New admin form state
  const [newAdmin, setNewAdmin] = React.useState({
    name: "",
    email: "",
    role: "",
    accessLevel: "System Admin" as AdminAccessLevel,
    department: "",
    phone: "",
    status: "Active" as "Active" | "Inactive",
    protocols: 0,
    permissions: [
      "Protocol Intake & Triage",
      "Reviewer Assignment Dispatch",
    ] as string[],
  })

  // Edit admin form state
  const [editForm, setEditForm] = React.useState({
    name: "",
    email: "",
    role: "",
    accessLevel: "System Admin" as AdminAccessLevel,
    department: "",
    phone: "",
    permissions: [] as string[],
  })

  // KPI Calculations
  const totalAdmins = members.length
  const activeAdmins = members.filter((m) => m.status === "Active").length
  const inactiveAdmins = members.filter((m) => m.status === "Inactive").length
  const superGovernanceAdmins = members.filter(
    (m) => m.accessLevel === "Super Admin" || m.accessLevel === "Governance Admin"
  ).length

  // Handlers
  const handleToggleStatus = (admin: AdminMember) => {
    const updated = toggleAdminMemberStatus(admin.id)
    if (updated) {
      if (updated.status === "Active") {
        toast.success("Administrator Account Activated", {
          description: `${admin.name} (${updated.id}) restored to Active status with full governance authority.`,
        })
      } else {
        toast.warning("Administrator Account Suspended", {
          description: `${admin.name} (${updated.id}) marked Inactive. Governance permissions and signing privileges paused.`,
        })
      }
    }
  }

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAdmin.name.trim()) {
      setFormError("Administrator full name is required.")
      return
    }
    if (!newAdmin.email.trim() || !newAdmin.email.includes("@")) {
      setFormError("A valid institutional email is required.")
      return
    }
    if (!newAdmin.role.trim()) {
      setFormError("Administrative role/designation is required.")
      return
    }
    if (!newAdmin.department.trim()) {
      setFormError("Department or institutional secretariat is required.")
      return
    }

    const created = addAdminMember({
      name: newAdmin.name,
      email: newAdmin.email,
      role: newAdmin.role,
      accessLevel: newAdmin.accessLevel,
      department: newAdmin.department,
      phone: newAdmin.phone || "+880 1713-000000",
      status: newAdmin.status,
      protocols: Number(newAdmin.protocols) || 0,
      permissions: newAdmin.permissions,
    })

    toast.success("New Administrator Appointed", {
      description: `${created.name} (${created.id}) successfully appointed as ${created.role} with ${created.status} status.`,
    })

    setNewAdmin({
      name: "",
      email: "",
      role: "",
      accessLevel: "System Admin",
      department: "",
      phone: "",
      status: "Active",
      protocols: 0,
      permissions: ["Protocol Intake & Triage", "Reviewer Assignment Dispatch"],
    })
    setFormError(null)
    setIsAddModalOpen(false)
  }

  const handleOpenEdit = (admin: AdminMember) => {
    setSelectedAdminForEdit(admin)
    setEditForm({
      name: admin.name,
      email: admin.email,
      role: admin.role,
      accessLevel: admin.accessLevel,
      department: admin.department,
      phone: admin.phone || "+880 1713-000000",
      permissions: admin.permissions || [],
    })
  }

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAdminForEdit) return

    const updated = updateAdminMember(selectedAdminForEdit.id, {
      name: editForm.name,
      email: editForm.email,
      role: editForm.role,
      accessLevel: editForm.accessLevel,
      department: editForm.department,
      phone: editForm.phone,
      permissions: editForm.permissions,
    })

    if (updated) {
      toast.success("Administrator Profile Updated", {
        description: `Credentials and role configurations for ${updated.name} have been updated.`,
      })
      setSelectedAdminForEdit(null)
    }
  }

  const togglePermission = (
    perm: string,
    currentList: string[],
    setter: (list: string[]) => void
  ) => {
    if (currentList.includes(perm)) {
      setter(currentList.filter((p) => p !== perm))
    } else {
      setter([...currentList, perm])
    }
  }

  // DataTable Columns
  const columns: ColumnDef<AdminMember>[] = [
    {
      id: "id",
      accessorKey: "id",
      header: "Admin ID",
      sortable: true,
      cell: ({ row }) => (
        <Link
          href={`/admin/admins/${encodeURIComponent(row.id)}`}
          className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-[#002752] dark:hover:text-sky-400 hover:underline select-text inline-flex items-center gap-1"
        >
          {row.id}
        </Link>
      ),
    },
    {
      id: "name",
      accessorKey: "name",
      header: "Administrator Identity",
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
            <Link
              href={`/admin/admins/${encodeURIComponent(row.id)}`}
              className="size-9 rounded-full bg-[#002752]/10 dark:bg-sky-500/10 text-[#002752] dark:text-sky-300 flex items-center justify-center font-bold text-xs shrink-0 border border-[#002752]/15 dark:border-sky-500/20 select-text hover:ring-2 hover:ring-[#002752]/30 transition-all"
            >
              {initials}
            </Link>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/admins/${encodeURIComponent(row.id)}`}
                  className="text-sm font-bold text-slate-900 dark:text-white truncate select-text hover:text-[#002752] dark:hover:text-sky-400 hover:underline"
                >
                  {row.name}
                </Link>
                {row.accessLevel === "Super Admin" && (
                  <Badge
                    variant="outline"
                    className="text-[9.5px] font-mono font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/25 px-1 py-0"
                  >
                    ROOT
                  </Badge>
                )}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 truncate flex items-center gap-2 select-text">
                <Mail className="size-3 text-slate-400 shrink-0" />
                <span>{row.email}</span>
              </div>
            </div>
          </div>
        )
      },
    },
    {
      id: "role",
      accessorKey: "role",
      header: "Administrative Role & Access Level",
      sortable: true,
      cell: ({ row }) => {
        const accessBadgeStyles: Record<AdminAccessLevel, string> = {
          "Super Admin": "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30",
          "System Admin": "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/30",
          "Governance Admin": "bg-[#002752]/10 text-[#002752] dark:text-sky-300 border-[#002752]/30",
          "Security & Audit": "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
          "Operations Admin": "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/30",
        }

        return (
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 select-text">
              {row.role}
            </div>
            <Badge
              variant="outline"
              className={`text-[10px] font-semibold border ${
                accessBadgeStyles[row.accessLevel] || accessBadgeStyles["System Admin"]
              }`}
            >
              {row.accessLevel}
            </Badge>
          </div>
        )
      },
    },
    {
      id: "department",
      accessorKey: "department",
      header: "Department / Directorate",
      sortable: true,
      cell: ({ row }) => (
        <span className="text-xs text-slate-600 dark:text-slate-300 truncate max-w-[220px] block select-text">
          {row.department}
        </span>
      ),
    },
    {
      id: "protocols",
      accessorKey: "protocols",
      header: "Workflows / Oversight",
      sortable: true,
      cell: ({ row }) => (
        <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 select-text">
          {row.protocols} cases
        </span>
      ),
    },
    {
      id: "lastActive",
      accessorKey: "lastActive",
      header: "Last Active",
      sortable: true,
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 select-text">
          <Clock className="size-3 text-slate-400 shrink-0" />
          <span>{row.lastActive}</span>
        </div>
      ),
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Account Status",
      sortable: true,
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={`text-xs font-semibold select-text ${
            row.status === "Active"
              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
              : "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30"
          }`}
        >
          {row.status}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Governance Actions",
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1.5">
          {/* View Details / Security Dossier Dynamic Page Link */}
          <Link href={`/admin/admins/${encodeURIComponent(row.id)}`}>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="View Security Dossier"
            >
              <Eye className="size-3.5 mr-1 text-[#002752] dark:text-sky-400" />
              <span>Dossier</span>
            </Button>
          </Link>

          {/* Edit Admin */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleOpenEdit(row)}
            className="h-7 px-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Edit Administrator Credentials"
          >
            <Lock className="size-3.5 mr-1 text-slate-500" />
            <span>Edit</span>
          </Button>

          {/* Active / Inactive Status Management with Confirmation */}
          <AlertDialog>
            <AlertDialogTrigger render={
              <Button
                type="button"
                variant="outline"
                size="sm"
                className={`h-7 px-2.5 text-xs font-bold rounded-md transition-colors ${
                  row.status === "Active"
                    ? "text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                    : "text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                }`}
              >
                {row.status === "Active" ? (
                  <>
                    <UserX className="size-3 mr-1 text-amber-600 dark:text-amber-400" />
                    <span>Deactivate</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="size-3 mr-1 text-emerald-600 dark:text-emerald-400" />
                    <span>Activate</span>
                  </>
                )}
              </Button>
            } />
            <AlertDialogContent className="w-full max-w-[calc(100vw-2rem)] sm:max-w-md">
              <AlertDialogHeader>
                <div className="flex items-center gap-3">
                  <div
                    className={`size-10 rounded-full flex items-center justify-center shrink-0 ${
                      row.status === "Active"
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                        : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                    }`}
                  >
                    {row.status === "Active" ? (
                      <AlertTriangle className="size-5" />
                    ) : (
                      <CheckCircle2 className="size-5" />
                    )}
                  </div>
                  <div>
                    <AlertDialogTitle className="text-base font-bold text-slate-900 dark:text-white">
                      {row.status === "Active"
                        ? "Suspend Administrative Authority?"
                        : "Restore Administrative Authority?"}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {row.name} • {row.id} ({row.role})
                    </AlertDialogDescription>
                  </div>
                </div>
              </AlertDialogHeader>

              <div className="py-2 text-xs text-slate-600 dark:text-slate-300 space-y-2">
                {row.status === "Active" ? (
                  <>
                    <p>
                      Suspending this administrator will immediately revoke their active governance session, pause cryptographic signing keys, and disallow protocol triage decisions.
                    </p>
                    <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-2.5 text-amber-800 dark:text-amber-200">
                      <strong>Security Note:</strong> Active protocol oversight assignments ({row.protocols} cases) will remain archived in the audit ledger.
                    </div>
                  </>
                ) : (
                  <>
                    <p>
                      Reactivating this administrator will restore their institutional governance authority, re-enable protocol triage privileges, and allow access to the administrative dashboard.
                    </p>
                    <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-2.5 text-emerald-800 dark:text-emerald-200">
                      <strong>Verification Note:</strong> Cryptographic token access and multi-factor credentials will be re-validated.
                    </div>
                  </>
                )}
              </div>

              <AlertDialogFooter>
                <AlertDialogCancel className="h-8 text-xs">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleToggleStatus(row)}
                  className={`h-8 text-xs font-bold text-white ${
                    row.status === "Active"
                      ? "bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800"
                      : "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800"
                  }`}
                >
                  {row.status === "Active" ? "Confirm Deactivation" : "Confirm Activation"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ]

  const filters: DataTableFilter<AdminMember>[] = [
    {
      id: "status",
      title: "Account Status",
      options: [
        { label: "Active", value: "Active" },
        { label: "Inactive", value: "Inactive" },
      ],
    },
    {
      id: "accessLevel",
      title: "Access Level",
      options: [
        { label: "Super Admin", value: "Super Admin" },
        { label: "System Admin", value: "System Admin" },
        { label: "Governance Admin", value: "Governance Admin" },
        { label: "Security & Audit", value: "Security & Audit" },
        { label: "Operations Admin", value: "Operations Admin" },
      ],
    },
  ]

  return (
    <div className="space-y-6 w-full max-w-full overflow-x-hidden">
      {/* KPI Cards Header (Rule 11) */}
      <KpiGrid columns={4}>
        <KpiCard
          label="Total System Admins"
          value={totalAdmins}
          color="navy"
          icon={ShieldCheck}
          description="Registered institutional officers"
        />
        <KpiCard
          label="Active Governance Leads"
          value={activeAdmins}
          color="green"
          icon={UserCheck}
          description="Authorized signing & triage leads"
        />
        <KpiCard
          label="Suspended / Inactive"
          value={inactiveAdmins}
          color="amber"
          icon={UserX}
          description="Privileges currently paused"
        />
        <KpiCard
          label="Super & Governance Leads"
          value={superGovernanceAdmins}
          color="gold"
          icon={KeyRound}
          description="Root security & policy authority"
        />
      </KpiGrid>

      {/* Main Admin List DataTable (Rule 6) */}
      <div className="space-y-4">
        <DataTable<AdminMember>
          data={members}
          columns={columns}
          title="Ethica System Administrator Directory"
          description={`Listed institutional administrators, access privilege levels, and active status controls across ${totalAdmins} officers.`}
          searchPlaceholder="Search system admins by name, email, role, department, or ID..."
          searchKeys={["name", "email", "role", "department", "id"]}
          filters={filters}
          initialPageSize={10}
          pageSizeOptions={[5, 10, 20, 50]}
          initialSort={{
            columnId: "id",
            direction: "asc",
          }}
          toolbarActions={
            <div className="flex items-center gap-2">
              <Link
                href="/admin/users"
                className="inline-flex items-center h-8 px-3 rounded-lg border border-slate-200/90 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors shrink-0"
              >
                <Users className="size-3.5 mr-1.5 text-[#002752] dark:text-sky-400" />
                <span>All Users</span>
              </Link>
              <Link
                href="/admin/roster"
                className="inline-flex items-center h-8 px-3 rounded-lg border border-slate-200/90 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors shrink-0"
              >
                <Users className="size-3.5 mr-1.5 text-[#002752] dark:text-sky-400" />
                <span>Reviewer Roster</span>
              </Link>

              {/* Appoint System Admin Dialog Modal */}
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger render={
                  <Button
                    type="button"
                    className="inline-flex items-center h-8 px-3.5 bg-[#002752] hover:bg-[#001c3d] text-white font-bold text-xs rounded-lg transition-colors shadow-2xs shrink-0 cursor-pointer"
                  >
                    <UserPlus className="size-3.5 mr-1.5" />
                    <span>Appoint System Admin</span>
                  </Button>
                } />
                <DialogContent className="w-full max-w-[calc(100vw-2rem)] sm:max-w-lg max-h-[calc(100dvh-2rem)] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-base font-bold text-[#002752] dark:text-white">
                      Appoint Institutional System Administrator
                    </DialogTitle>
                    <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
                      Register a new institutional officer with privileged access to the Ethica governance engine.
                    </DialogDescription>
                  </DialogHeader>

                  {formError && (
                    <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
                      <AlertTriangle className="size-4 shrink-0 text-rose-600" />
                      <span>{formError}</span>
                    </div>
                  )}

                  <form onSubmit={handleCreateAdmin} className="space-y-4 py-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Full Name & Academic Title <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        value={newAdmin.name}
                        onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                        placeholder="e.g. Dr. Tanvir Ahmed, Ph.D."
                        className="h-8 text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Institutional Email <span className="text-rose-500">*</span>
                        </label>
                        <Input
                          type="email"
                          value={newAdmin.email}
                          onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                          placeholder="e.g. tanvir.ethics@diu.edu.bd"
                          className="h-8 text-xs"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Official Contact Phone
                        </label>
                        <Input
                          value={newAdmin.phone}
                          onChange={(e) => setNewAdmin({ ...newAdmin, phone: e.target.value })}
                          placeholder="e.g. +880 1713-000000"
                          className="h-8 text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Administrative Designation <span className="text-rose-500">*</span>
                        </label>
                        <Input
                          value={newAdmin.role}
                          onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                          placeholder="e.g. Secretariat Triage Officer"
                          className="h-8 text-xs"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Access Privilege Group
                        </label>
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          {(
                            [
                              "Super Admin",
                              "System Admin",
                              "Governance Admin",
                              "Security & Audit",
                              "Operations Admin",
                            ] as AdminAccessLevel[]
                          ).map((lvl) => (
                            <Button
                              key={lvl}
                              type="button"
                              variant={newAdmin.accessLevel === lvl ? "default" : "outline"}
                              size="sm"
                              onClick={() => setNewAdmin({ ...newAdmin, accessLevel: lvl })}
                              className={`h-6 px-2 text-[10px] font-semibold rounded ${
                                newAdmin.accessLevel === lvl
                                  ? "bg-[#002752] text-white"
                                  : "text-slate-600 dark:text-slate-300"
                              }`}
                            >
                              {lvl}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Department / Institutional Unit <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        value={newAdmin.department}
                        onChange={(e) => setNewAdmin({ ...newAdmin, department: e.target.value })}
                        placeholder="e.g. Research Compliance Secretariat"
                        className="h-8 text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Initial Account Status
                      </label>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant={newAdmin.status === "Active" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setNewAdmin({ ...newAdmin, status: "Active" })}
                          className={`h-7 px-3 text-xs font-bold ${
                            newAdmin.status === "Active"
                              ? "bg-emerald-600 text-white"
                              : "text-slate-600"
                          }`}
                        >
                          Active
                        </Button>
                        <Button
                          type="button"
                          variant={newAdmin.status === "Inactive" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setNewAdmin({ ...newAdmin, status: "Inactive" })}
                          className={`h-7 px-3 text-xs font-bold ${
                            newAdmin.status === "Inactive"
                              ? "bg-amber-600 text-white"
                              : "text-slate-600"
                          }`}
                        >
                          Inactive (Suspended)
                        </Button>
                      </div>
                    </div>

                    {/* Permissions Multi-select */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Assigned Administrative Privileges
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-36 overflow-y-auto p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
                        {AVAILABLE_PERMISSIONS.map((perm) => {
                          const isSelected = newAdmin.permissions.includes(perm)
                          return (
                            <div
                              key={perm}
                              onClick={() =>
                                togglePermission(perm, newAdmin.permissions, (list) =>
                                  setNewAdmin({ ...newAdmin, permissions: list })
                                )
                              }
                              className={`flex items-center gap-2 p-1.5 rounded cursor-pointer text-[11px] font-medium transition-colors ${
                                isSelected
                                  ? "bg-[#002752]/10 dark:bg-sky-500/10 text-[#002752] dark:text-sky-300 font-bold"
                                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                              }`}
                            >
                              <div
                                className={`size-3.5 rounded flex items-center justify-center border ${
                                  isSelected
                                    ? "bg-[#002752] border-[#002752] text-white"
                                    : "border-slate-300 dark:border-slate-600"
                                }`}
                              >
                                {isSelected && <CheckCircle2 className="size-3" />}
                              </div>
                              <span className="truncate">{perm}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <DialogFooter className="pt-2">
                      <DialogClose render={
                        <Button type="button" variant="outline" className="h-8 text-xs font-semibold">
                          Cancel
                        </Button>
                      } />
                      <Button
                        type="submit"
                        className="h-8 text-xs font-bold bg-[#002752] hover:bg-[#001c3d] text-white"
                      >
                        Appoint Administrator
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          }
        />
      </div>

      {/* Edit Admin Modal */}
      {selectedAdminForEdit && (
        <Dialog
          open={!!selectedAdminForEdit}
          onOpenChange={(open) => {
            if (!open) setSelectedAdminForEdit(null)
          }}
        >
          <DialogContent className="w-full max-w-[calc(100vw-2rem)] sm:max-w-lg max-h-[calc(100dvh-2rem)] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-[#002752] dark:text-white">
                Edit Administrator Credentials: {selectedAdminForEdit.name}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
                Update designation, access privileges, and departmental assignment.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSaveEdit} className="space-y-4 py-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="h-8 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Institutional Email
                  </label>
                  <Input
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="h-8 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Phone
                  </label>
                  <Input
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Administrative Role
                  </label>
                  <Input
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    className="h-8 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Access Level
                  </label>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {(
                      [
                        "Super Admin",
                        "System Admin",
                        "Governance Admin",
                        "Security & Audit",
                        "Operations Admin",
                      ] as AdminAccessLevel[]
                    ).map((lvl) => (
                      <Button
                        key={lvl}
                        type="button"
                        variant={editForm.accessLevel === lvl ? "default" : "outline"}
                        size="sm"
                        onClick={() => setEditForm({ ...editForm, accessLevel: lvl })}
                        className={`h-6 px-2 text-[10px] font-semibold rounded ${
                          editForm.accessLevel === lvl
                            ? "bg-[#002752] text-white"
                            : "text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        {lvl}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Department
                </label>
                <Input
                  value={editForm.department}
                  onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                  className="h-8 text-xs"
                />
              </div>

              <DialogFooter>
                <DialogClose render={
                  <Button type="button" variant="outline" className="h-8 text-xs font-semibold">
                    Cancel
                  </Button>
                } />
                <Button
                  type="submit"
                  className="h-8 text-xs font-bold bg-[#002752] hover:bg-[#001c3d] text-white"
                >
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
