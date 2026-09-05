"use client"

import * as React from "react"
import Link from "next/link"
import {
  Users,
  UserCheck,
  UserX,
  UserPlus,
  Eye,
  Mail,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  GraduationCap,
  Scale,
  ToggleLeft,
} from "lucide-react"
import {
  DataTable,
  type ColumnDef,
  type DataTableFilter,
} from "@/components/ui/data-table"
import { KpiCard, KpiGrid } from "@/components/ui/kpi-card"
import { DashboardContainer } from "@/components/dashboard/dashboard-container"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/sonner"
import { createPlatformUserSchema } from "@/lib/schemas"
import {
  AlertDialog,
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
  SheetFooter,
  SheetClose,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import {
  type PlatformUser,
  type UserPillar,
  type UserAccountStatus,
  type UserVerificationStatus,
  initialPlatformUsers,
  getStoredUsers,
  subscribeUsers,
  addUser,
  updateUserStatus,
} from "@/lib/users-directory"

export default function AdminUsersDirectoryPage() {
  const users = React.useSyncExternalStore(
    subscribeUsers,
    getStoredUsers,
    () => initialPlatformUsers
  )

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false)
  const [pendingToggleUser, setPendingToggleUser] = React.useState<PlatformUser | null>(null)
  const [formError, setFormError] = React.useState<string | null>(null)

  // New user form state
  const [newUser, setNewUser] = React.useState({
    name: "",
    email: "",
    phone: "",
    pillar: "Investigator" as UserPillar,
    role: "",
    department: "",
    institution: "Daffodil International University",
    status: "Active" as UserAccountStatus,
    verificationStatus: "Verified Institutional ID" as UserVerificationStatus,
    bio: "",
  })

  // KPI Calculations
  const totalUsers = users.length
  const activeUsers = users.filter((u) => u.status === "Active").length
  const investigatorCount = users.filter((u) => u.pillar === "Investigator").length
  const reviewerCount = users.filter((u) => u.pillar === "Reviewer").length

  // Handlers
  const confirmToggleStatus = () => {
    if (!pendingToggleUser) return
    const nextStatus: UserAccountStatus =
      pendingToggleUser.status === "Active" ? "Suspended" : "Active"
    const updated = updateUserStatus(pendingToggleUser.id, nextStatus)
    if (updated) {
      if (nextStatus === "Active") {
        toast.success("User Account Activated", {
          description: `${pendingToggleUser.name} (${pendingToggleUser.id}) has been restored to Active standing with full platform access.`,
        })
      } else {
        toast.warning("User Account Suspended", {
          description: `${pendingToggleUser.name} (${pendingToggleUser.id}) has been suspended. Protocol submissions, voting, and login access are paused.`,
        })
      }
    }
    setPendingToggleUser(null)
  }

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault()

    const validation = createPlatformUserSchema.safeParse({
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      pillar: newUser.pillar,
      role: newUser.role,
      department: newUser.department,
      institution: newUser.institution,
      status: newUser.status,
      verificationStatus: newUser.verificationStatus,
      bio: newUser.bio,
    })

    if (!validation.success) {
      const firstError = Object.values(validation.error.flatten().fieldErrors)[0]?.[0]
      setFormError(firstError || "Please check platform user form fields.")
      return
    }

    const created = addUser({
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      pillar: newUser.pillar,
      role: newUser.role,
      department: newUser.department,
      institution: newUser.institution,
      status: newUser.status,
      verificationStatus: newUser.verificationStatus,
      bio: newUser.bio,
    })

    toast.success("User Account Created", {
      description: `${created.name} (${created.id}) successfully added as ${created.role} in ${created.pillar} directory.`,
    })

    setNewUser({
      name: "",
      email: "",
      phone: "",
      pillar: "Investigator",
      role: "",
      department: "",
      institution: "Daffodil International University",
      status: "Active",
      verificationStatus: "Verified Institutional ID",
      bio: "",
    })
    setFormError(null)
    setIsAddModalOpen(false)
  }

  // DataTable Columns
  const columns: ColumnDef<PlatformUser>[] = [
    {
      id: "id",
      accessorKey: "id",
      header: "User ID",
      sortable: true,
      headerClassName: "w-32",
      cell: ({ row }) => (
        <Link
          href={`/admin/users/${encodeURIComponent(row.id)}`}
          className="font-mono text-base font-bold text-[#002752] dark:text-sky-300 block hover:underline select-text"
        >
          {row.id}
        </Link>
      ),
    },
    {
      id: "name",
      accessorKey: "name",
      header: "User Identity",
      sortable: true,
      cell: ({ row }) => {
        const initials =
          row.name
            .replace(/^(Dr\.|Prof\.|Mr\.|Ms\.|Mrs\.)\s+/i, "")
            .split(" ")
            .filter(Boolean)
            .map((p) => p[0])
            .slice(0, 2)
            .join("")
            .toUpperCase() || "US"

        return (
          <div className="flex items-center gap-3 select-text">
            <Link
              href={`/admin/users/${encodeURIComponent(row.id)}`}
              className="size-9 rounded-full bg-[#002752]/10 dark:bg-sky-500/10 text-[#002752] dark:text-sky-300 flex items-center justify-center font-bold text-base shrink-0 border border-[#002752]/15 dark:border-sky-500/20 hover:ring-2 hover:ring-[#002752]/20 transition-all"
              title={`Inspect ${row.name}'s Profile`}
            >
              {initials}
            </Link>
            <div className="min-w-0">
              <Link
                href={`/admin/users/${encodeURIComponent(row.id)}`}
                className="text-base font-bold text-slate-900 dark:text-white truncate block hover:underline hover:text-[#002752] dark:hover:text-sky-300"
              >
                {row.name}
              </Link>
              <div className="text-base text-slate-500 dark:text-slate-400 truncate flex items-center gap-1 mt-0.5">
                <Mail className="size-3 text-slate-400 shrink-0" />
                <span>{row.email}</span>
              </div>
            </div>
          </div>
        )
      },
    },
    {
      id: "pillar",
      accessorKey: "pillar",
      header: "Platform Pillar",
      sortable: true,
      cell: ({ row }) => {
        const pillarStyles: Record<UserPillar, string> = {
          Investigator:
            "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/30",
          Reviewer:
            "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
          Administrator:
            "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30",
        }

        const pillarIcons: Record<UserPillar, React.ReactNode> = {
          Investigator: <GraduationCap className="size-3 mr-1 shrink-0" />,
          Reviewer: <Scale className="size-3 mr-1 shrink-0" />,
          Administrator: <ShieldCheck className="size-3 mr-1 shrink-0" />,
        }

        return (
          <Badge
            variant="outline"
            className={`text-base font-bold border inline-flex items-center select-text ${
              pillarStyles[row.pillar]
            }`}
          >
            {pillarIcons[row.pillar]}
            <span>{row.pillar}</span>
          </Badge>
        )
      },
    },
    {
      id: "role",
      accessorKey: "role",
      header: "Designation & Academic Unit",
      sortable: true,
      cell: ({ row }) => (
        <div className="space-y-0.5 select-text">
          <div className="text-base font-bold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
            {row.role}
          </div>
          <div className="text-base text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
            {row.department}
          </div>
        </div>
      ),
    },
    {
      id: "protocolsCount",
      accessorKey: "protocolsCount",
      header: "Protocols / Workload",
      sortable: true,
      headerClassName: "w-32 text-center",
      cell: ({ row }) => (
        <div className="text-center select-text">
          <span className="inline-flex items-center justify-center font-mono font-bold text-base text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-md">
            {row.protocolsCount}
          </span>
          <span className="block text-base text-slate-400 mt-0.5">
            {row.pillar === "Investigator"
              ? "submitted"
              : row.pillar === "Reviewer"
              ? "assigned"
              : "oversight"}
          </span>
        </div>
      ),
    },
    {
      id: "verificationStatus",
      accessorKey: "verificationStatus",
      header: "Identity Verification",
      sortable: true,
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={`text-base font-semibold border select-text ${
            row.verificationStatus === "Verified Institutional ID"
              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
              : row.verificationStatus === "SSO Authenticated"
              ? "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/30"
              : "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30"
          }`}
        >
          {row.verificationStatus === "Verified Institutional ID" ? (
            <CheckCircle2 className="size-3 mr-1 shrink-0 text-emerald-600 dark:text-emerald-400" />
          ) : null}
          <span>{row.verificationStatus}</span>
        </Badge>
      ),
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Account Status",
      sortable: true,
      headerClassName: "w-24",
      cell: ({ row }) => {
        const isActive = row.status === "Active"
        const isSuspended = row.status === "Suspended"
        const isPending = row.status === "Pending Verification"

        const switchColor = isActive
          ? "data-checked:bg-emerald-500 data-checked:border-emerald-600"
          : isSuspended
          ? "data-unchecked:bg-rose-400 dark:data-unchecked:bg-rose-600"
          : isPending
          ? "data-unchecked:bg-amber-400 dark:data-unchecked:bg-amber-500"
          : "data-unchecked:bg-slate-400 dark:data-unchecked:bg-slate-600"

        return (
          <Switch
            size="sm"
            checked={isActive}
            onCheckedChange={() => setPendingToggleUser(row)}
            aria-label={`Toggle status for ${row.name}`}
            className={switchColor}
          />
        )
      },
    },
    {
      id: "actions",
      header: "Governance Actions",
      headerClassName: "w-32 text-right",
      cell: ({ row }) => {
        const user = row

        return (
          <div className="flex items-center justify-end gap-1.5">
            {/* Direct Navigation to Dedicated Dynamic Page (Rule 13) */}
            <Link href={`/admin/users/${encodeURIComponent(user.id)}`}>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 px-2 text-base font-semibold rounded-md border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                title={`Inspect ${user.name}'s Profile`}
              >
                <Eye className="size-3.5 mr-1 text-[#002752] dark:text-sky-400" />
                <span>Inspect</span>
              </Button>
            </Link>
          </div>
        )
      },
    },
  ]

  const filters: DataTableFilter<PlatformUser>[] = [
    {
      id: "pillar",
      title: "Platform Pillar",
      options: [
        { label: "Investigators & Researchers", value: "Investigator" },
        { label: "Committee Reviewers", value: "Reviewer" },
        { label: "System Administrators", value: "Administrator" },
      ],
    },
    {
      id: "status",
      title: "Account Standing",
      options: [
        { label: "Active", value: "Active" },
        { label: "Inactive", value: "Inactive" },
        { label: "Pending Verification", value: "Pending Verification" },
        { label: "Suspended", value: "Suspended" },
      ],
    },
  ]

  return (
    <DashboardContainer>
      {/* ── KPI Grid (Rule 11) ─────────────────────────────────────────────── */}
      <KpiGrid columns={4}>
        <KpiCard
          label="Total Platform Users"
          value={totalUsers}
          description="Registered researchers, reviewers & admins"
          icon={Users}
          color="navy"
        />
        <KpiCard
          label="Active Accounts"
          value={activeUsers}
          description="Authorized with live access standing"
          icon={UserCheck}
          color="green"
        />
        <KpiCard
          label="Research Investigators"
          value={investigatorCount}
          description="Principal & co-investigator accounts"
          icon={GraduationCap}
          color="sky"
        />
        <KpiCard
          label="Committee Reviewers"
          value={reviewerCount}
          description="Accredited ethics committee members"
          icon={Scale}
          color="gold"
        />
      </KpiGrid>

      {/* ── Unified DataTable (Rule 6) ─────────────────────────────────────── */}
      <div className="w-full">
        <DataTable<PlatformUser>
          data={users}
          columns={columns}
          title="Centralized Institutional User Directory"
          description={`Comprehensive account registry and identity governance across ${totalUsers} accounts spanning all 3 platform pillars.`}
          searchPlaceholder="Search all users by name, email, department, institution, or role..."
          searchKeys={["name", "email", "department", "institution", "role", "id"]}
          filters={filters}
          initialPageSize={10}
          pageSizeOptions={[5, 10, 20, 50]}
          initialSort={{
            columnId: "id",
            direction: "asc",
          }}
          toolbarActions={
            <div className="flex items-center gap-2">
              <Link href="/admin/admins">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 text-base font-semibold rounded-lg border-slate-200 dark:border-slate-800"
                >
                  <ShieldCheck className="size-3.5 text-[#002752] dark:text-sky-400" />
                  <span>Admin List</span>
                </Button>
              </Link>
              <Link href="/admin/roster">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 text-base font-semibold rounded-lg border-slate-200 dark:border-slate-800"
                >
                  <Scale className="size-3.5 text-[#002752] dark:text-sky-400" />
                  <span>Reviewer Roster</span>
                </Button>
              </Link>

              {/* Add User Slide-over Sheet */}
              <Sheet open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <SheetTrigger render={
                  <Button
                    type="button"
                    className="inline-flex items-center h-8 px-3.5 bg-[#002752] hover:bg-[#001c3d] text-white font-bold text-base rounded-lg transition-colors shadow-2xs shrink-0 cursor-pointer"
                  >
                    <UserPlus className="size-3.5 mr-1.5" />
                    <span>Invite / Add User</span>
                  </Button>
                } />
                <SheetContent side="right" className="w-full sm:max-w-lg md:max-w-xl p-6">
                  <SheetHeader className="p-0 pb-3">
                    <SheetTitle className="text-base font-bold text-[#002752] dark:text-white">
                      Register Platform User Account
                    </SheetTitle>
                    <SheetDescription className="text-base text-slate-500 dark:text-slate-400">
                      Provision a new researcher, committee reviewer, or institutional administrator in the Ethica ecosystem.
                    </SheetDescription>
                  </SheetHeader>

                  {formError && (
                    <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-base flex items-center gap-2">
                      <AlertTriangle className="size-4 shrink-0 text-rose-600" />
                      <span>{formError}</span>
                    </div>
                  )}

                  <form onSubmit={handleCreateUser} className="space-y-4 py-2">
                    <div className="space-y-1.5">
                      <label className="text-base font-bold text-slate-700 dark:text-slate-300">
                        Full Name & Degree <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        placeholder="e.g. Dr. Sabrina Akhter, MD"
                        className="h-8 text-base"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-base font-bold text-slate-700 dark:text-slate-300">
                          Institutional Email <span className="text-rose-500">*</span>
                        </label>
                        <Input
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                          placeholder="e.g. user@diu.edu.bd"
                          className="h-8 text-base"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-base font-bold text-slate-700 dark:text-slate-300">
                          Official Contact Phone
                        </label>
                        <Input
                          value={newUser.phone}
                          onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                          placeholder="e.g. +880 1713-000000"
                          className="h-8 text-base"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-base font-bold text-slate-700 dark:text-slate-300">
                        Platform Pillar Assignment <span className="text-rose-500">*</span>
                      </label>
                      <div className="flex gap-2">
                        {(["Investigator", "Reviewer", "Administrator"] as UserPillar[]).map(
                          (pillar) => (
                            <Button
                              key={pillar}
                              type="button"
                              variant={newUser.pillar === pillar ? "default" : "outline"}
                              size="sm"
                              onClick={() => setNewUser({ ...newUser, pillar })}
                              className={`flex-1 h-7 text-base font-bold ${
                                newUser.pillar === pillar
                                  ? "bg-[#002752] text-white"
                                  : "text-slate-600 dark:text-slate-300"
                              }`}
                            >
                              {pillar}
                            </Button>
                          )
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-base font-bold text-slate-700 dark:text-slate-300">
                          Specific Designation / Role <span className="text-rose-500">*</span>
                        </label>
                        <Input
                          value={newUser.role}
                          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                          placeholder="e.g. Associate Professor & PI"
                          className="h-8 text-base"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-base font-bold text-slate-700 dark:text-slate-300">
                          Department / Faculty <span className="text-rose-500">*</span>
                        </label>
                        <Input
                          value={newUser.department}
                          onChange={(e) =>
                            setNewUser({ ...newUser, department: e.target.value })
                          }
                          placeholder="e.g. Public Health & Epidemiology"
                          className="h-8 text-base"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-base font-bold text-slate-700 dark:text-slate-300">
                        Home Institution
                      </label>
                      <Input
                        value={newUser.institution}
                        onChange={(e) =>
                          setNewUser({ ...newUser, institution: e.target.value })
                        }
                        placeholder="Daffodil International University"
                        className="h-8 text-base"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-base font-bold text-slate-700 dark:text-slate-300">
                          Initial Account Status
                        </label>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant={newUser.status === "Active" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setNewUser({ ...newUser, status: "Active" })}
                            className={`flex-1 h-7 text-base font-bold ${
                              newUser.status === "Active"
                                ? "bg-emerald-600 text-white"
                                : "text-slate-600"
                            }`}
                          >
                            Active
                          </Button>
                          <Button
                            type="button"
                            variant={
                              newUser.status === "Pending Verification"
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() =>
                              setNewUser({
                                ...newUser,
                                status: "Pending Verification",
                              })
                            }
                            className={`flex-1 h-7 text-base font-bold ${
                              newUser.status === "Pending Verification"
                                ? "bg-amber-600 text-white"
                                : "text-slate-600"
                            }`}
                          >
                            Pending
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-base font-bold text-slate-700 dark:text-slate-300">
                          Verification Clearance Tier
                        </label>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant={
                              newUser.verificationStatus === "Verified Institutional ID"
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() =>
                              setNewUser({
                                ...newUser,
                                verificationStatus: "Verified Institutional ID",
                              })
                            }
                            className={`flex-1 h-7 text-base font-bold ${
                              newUser.verificationStatus === "Verified Institutional ID"
                                ? "bg-[#002752] text-white"
                                : "text-slate-600"
                            }`}
                          >
                            Verified ID
                          </Button>
                          <Button
                            type="button"
                            variant={
                              newUser.verificationStatus === "SSO Authenticated"
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() =>
                              setNewUser({
                                ...newUser,
                                verificationStatus: "SSO Authenticated",
                              })
                            }
                            className={`flex-1 h-7 text-base font-bold ${
                              newUser.verificationStatus === "SSO Authenticated"
                                ? "bg-sky-600 text-white"
                                : "text-slate-600"
                            }`}
                          >
                            SSO
                          </Button>
                        </div>
                      </div>
                    </div>

                    <SheetFooter className="p-0 pt-4 flex-row justify-end gap-2 border-t border-slate-100 dark:border-slate-800/80">
                      <SheetClose render={
                        <Button type="button" variant="outline" className="h-8 text-base font-semibold">
                          Cancel
                        </Button>
                      } />
                      <Button
                        type="submit"
                        className="h-8 text-base font-bold bg-[#002752] hover:bg-[#001c3d] text-white"
                      >
                        Create Platform Account
                      </Button>
                    </SheetFooter>
                  </form>
                </SheetContent>
              </Sheet>
            </div>
          }
        />
      </div>

      {/* Status Toggle Confirmation AlertDialog (Rule 12) */}
      <AlertDialog
        open={!!pendingToggleUser}
        onOpenChange={(open) => { if (!open) setPendingToggleUser(null) }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-[#002752] dark:text-white">
              <ToggleLeft className="size-5 text-amber-500" />
              {pendingToggleUser?.status === "Active"
                ? "Suspend User Account"
                : "Restore User Account"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base text-slate-600 dark:text-slate-400">
              {pendingToggleUser?.status === "Active" ? (
                <>
                  You are about to <span className="font-bold text-rose-600">suspend</span> the account of{" "}
                  <span className="font-bold text-slate-800 dark:text-white">{pendingToggleUser?.name}</span>{" "}
                  <span className="text-base text-slate-500">({pendingToggleUser?.pillar})</span>.
                  <br />
                  <span className="text-base mt-1 block text-slate-500">
                    All protocol submissions, committee voting rights, and platform login access will be paused immediately.
                  </span>
                </>
              ) : (
                <>
                  You are about to <span className="font-bold text-emerald-600">restore</span> the account of{" "}
                  <span className="font-bold text-slate-800 dark:text-white">{pendingToggleUser?.name}</span>{" "}
                  <span className="text-base text-slate-500">({pendingToggleUser?.pillar})</span>.
                  <br />
                  <span className="text-base mt-1 block text-slate-500">
                    Full platform access, protocol capabilities, and standing will be reinstated.
                  </span>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel render={
              <Button variant="outline" className="h-8 text-base font-semibold">
                Cancel
              </Button>
            } />
            <AlertDialogAction
              render={
                <Button
                  className={`h-8 text-base font-bold text-white ${
                    pendingToggleUser?.status === "Active"
                      ? "bg-rose-600 hover:bg-rose-700"
                      : "bg-emerald-600 hover:bg-emerald-700"
                  }`}
                  onClick={confirmToggleStatus}
                >
                  {pendingToggleUser?.status === "Active" ? "Suspend Account" : "Restore Account"}
                </Button>
              }
            />
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardContainer>
  )
}
