"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowLeft,
  ShieldCheck,
  UserCheck,
  UserX,
  Building2,
  Mail,
  Phone,
  Calendar,
  AlertTriangle,
  Award,
  CheckCircle2,
  Lock,
  FileText,
  GraduationCap,
  Scale,
  RotateCcw,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { KpiCard, KpiGrid } from "@/components/ui/kpi-card"
import { DashboardContainer } from "@/components/dashboard/dashboard-container"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/sonner"
import { updatePlatformUserSchema } from "@/lib/schemas"
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
  type UserAccountStatus,
  type UserPillar,
  getStoredUsers,
  subscribeUsers,
  updateUser,
  updateUserStatus,
  initialPlatformUsers,
} from "@/lib/users-directory"

interface PageProps {
  params: Promise<{ id: string }>
}

export default function UserDossierDetailPage({ params }: PageProps) {
  const resolvedParams = React.use(params)
  const userId = decodeURIComponent(resolvedParams.id)

  const allUsers = React.useSyncExternalStore(
    subscribeUsers,
    getStoredUsers,
    () => initialPlatformUsers
  )

  const user = React.useMemo(() => {
    return allUsers.find((u) => u.id === userId)
  }, [allUsers, userId])

  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)
  const [editForm, setEditForm] = React.useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    department: "",
    institution: "",
    pillar: "Investigator" as UserPillar,
    bio: "",
  })

  const handleOpenEdit = React.useCallback(() => {
    if (user) {
      setEditForm({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        role: user.role,
        department: user.department,
        institution: user.institution,
        pillar: user.pillar,
        bio: user.bio || "",
      })
      setIsEditModalOpen(true)
    }
  }, [user])

  if (!user) {
    return (
      <div className="space-y-6 w-full max-w-full">
        <Link
          href="/admin/users"
          className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="size-3.5 mr-1.5" />
          <span>Back to All Users</span>
        </Link>
        <Card className="p-8 text-center space-y-4">
          <div className="size-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Users className="size-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Platform User Not Found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              No account found matching identifier &quot;{userId}&quot;.
            </p>
          </div>
          <Link href="/admin/users">
            <Button size="sm" className="bg-[#002752] text-white">
              Return to Users Directory
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  const isActive = user.status === "Active"

  const handleToggleStatus = (nextStatus: UserAccountStatus) => {
    updateUserStatus(user.id, nextStatus)
    if (nextStatus === "Active") {
      toast.success("User Account Activated", {
        description: `${user.name} (${user.id}) has been restored to Active status with full permissions.`,
      })
    } else if (nextStatus === "Suspended") {
      toast.warning("User Account Suspended", {
        description: `${user.name} (${user.id}) has been suspended. Platform access and tokens are locked.`,
      })
    } else {
      toast.info("User Status Updated", {
        description: `${user.name} (${user.id}) marked as ${nextStatus}.`,
      })
    }
  }

  const handleResetCredentials = () => {
    toast.success("Security Credentials Re-issued", {
      description: `Password reset token and session revocation dispatched to ${user.email}.`,
    })
  }

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault()

    const validation = updatePlatformUserSchema.safeParse(editForm)
    if (!validation.success) {
      const firstError = Object.values(validation.error.flatten().fieldErrors)[0]?.[0]
      toast.error("Validation Error", {
        description: firstError || "Please check user profile fields.",
      })
      return
    }

    const updated = updateUser(user.id, {
      name: editForm.name,
      email: editForm.email,
      phone: editForm.phone,
      role: editForm.role,
      department: editForm.department,
      institution: editForm.institution,
      pillar: editForm.pillar,
      bio: editForm.bio,
    })

    if (updated) {
      toast.success("Profile Updated", {
        description: `Profile information for ${updated.name} has been updated.`,
      })
      setIsEditModalOpen(false)
    }
  }

  const initials =
    user.name
      .replace(/^(Dr\.|Prof\.|Mr\.|Ms\.|Mrs\.)\s+/i, "")
      .split(" ")
      .filter(Boolean)
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "US"

  const pillarStyles: Record<UserPillar, string> = {
    Investigator: "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/30",
    Reviewer: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    Administrator: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30",
  }

  return (
    <DashboardContainer className="pb-12">
      {/* ── Top Navigation & Breadcrumbs ───────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-3 px-4 sm:px-0">
        <Link
          href="/admin/users"
          className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-[#002752] dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="size-3.5 mr-1.5" />
          <span>Back to All Users Directory</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleOpenEdit}
            className="h-8 gap-1.5 text-xs font-semibold rounded-lg border-slate-200 dark:border-slate-800"
          >
            <Lock className="size-3.5" />
            <span>Edit Profile</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleResetCredentials}
            className="h-8 gap-1.5 text-xs font-semibold rounded-lg border-slate-200 dark:border-slate-800"
          >
            <RotateCcw className="size-3.5" />
            <span>Reset Security Credentials</span>
          </Button>
        </div>
      </div>

      {/* ── User Header Card ───────────────────────────────────────────────── */}
      <Card className="p-5 sm:p-6 rounded-none sm:rounded-2xl border-y sm:border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="size-16 sm:size-20 rounded-2xl bg-[#002752]/10 dark:bg-sky-500/10 text-[#002752] dark:text-sky-300 flex items-center justify-center font-black text-xl sm:text-2xl shrink-0 border border-[#002752]/20">
              {initials}
            </div>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {user.name}
                </h1>
                <Badge
                  variant="outline"
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-md border ${
                    pillarStyles[user.pillar]
                  }`}
                >
                  {user.pillar}
                </Badge>
                <Badge
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${
                    isActive
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                      : "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30"
                  }`}
                >
                  {user.status}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-1.5 font-medium">
                  <Building2 className="size-3.5 text-slate-400 shrink-0" />
                  <span>
                    {user.role} • {user.department}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                  <Calendar className="size-3.5 text-slate-400 shrink-0" />
                  <span>Registered {user.joinedAt}</span>
                </div>
                <div className="font-mono text-xs font-bold text-[#002752] dark:text-sky-300">
                  {user.id}
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                <Badge
                  variant="outline"
                  className="text-[11px] font-semibold bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200"
                >
                  {user.institution}
                </Badge>
                <Badge
                  variant="outline"
                  className="text-[11px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                >
                  <CheckCircle2 className="size-3 mr-1 inline text-emerald-600" />
                  {user.verificationStatus}
                </Badge>
                <Badge
                  variant="outline"
                  className="text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                >
                  Last active: {user.lastLogin}
                </Badge>
              </div>
            </div>
          </div>

          {/* Header Action: Activate / Suspend Toggle */}
          <div className="flex flex-row lg:flex-col items-center lg:items-end gap-2 shrink-0">
            <AlertDialog>
              <AlertDialogTrigger render={
                <Button
                  type="button"
                  variant={isActive ? "outline" : "default"}
                  size="sm"
                  className={`h-9 px-4 text-xs font-bold rounded-lg cursor-pointer ${
                    isActive
                      ? "text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                      : "bg-[#198754] hover:bg-[#146c43] text-white"
                  }`}
                >
                  {isActive ? (
                    <>
                      <UserX className="size-3.5 mr-1.5 text-amber-600 dark:text-amber-400" />
                      <span>Suspend Account Access</span>
                    </>
                  ) : (
                    <>
                      <UserCheck className="size-3.5 mr-1.5 text-white" />
                      <span>Activate Account Access</span>
                    </>
                  )}
                </Button>
              } />
              <AlertDialogContent className="max-w-md">
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                    {isActive ? (
                      <>
                        <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400" />
                        <span>Suspend User Account</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400" />
                        <span>Activate User Account</span>
                      </>
                    )}
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-2">
                    {isActive ? (
                      <>
                        Are you sure you want to suspend{" "}
                        <strong className="text-slate-900 dark:text-white">
                          {user.name}
                        </strong>{" "}
                        ({user.id})?
                        <span className="block mt-2 text-xs text-amber-800 dark:text-amber-300 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
                          • User will be barred from creating or deliberating protocols.
                          <br />
                          • Live auth sessions and signing privileges will be suspended.
                        </span>
                      </>
                    ) : (
                      <>
                        Are you sure you want to restore{" "}
                        <strong className="text-slate-900 dark:text-white">
                          {user.name}
                        </strong>{" "}
                        ({user.id}) to <strong>Active</strong> standing?
                        <span className="block mt-2 text-xs text-emerald-800 dark:text-emerald-300 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
                          • Full platform privileges and login authority will be restored.
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
                    onClick={() =>
                      handleToggleStatus(isActive ? "Suspended" : "Active")
                    }
                    className={`text-xs font-bold text-white ${
                      isActive
                        ? "bg-amber-600 hover:bg-amber-700"
                        : "bg-emerald-600 hover:bg-emerald-700"
                    }`}
                  >
                    {isActive ? "Confirm Suspension" : "Confirm Activation"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </Card>

      {/* ── Key Metrics ────────────────────────────────────────────────────── */}
      <KpiGrid columns={4}>
        <KpiCard
          label="Protocols / Workload"
          value={user.protocolsCount}
          description={
            user.pillar === "Investigator"
              ? "Submitted research protocols"
              : user.pillar === "Reviewer"
              ? "Assigned board deliberations"
              : "Administrative oversight cases"
          }
          icon={FileText}
          color="navy"
        />
        <KpiCard
          label="Platform Pillar"
          value={user.pillar}
          description="Ecosystem security role"
          icon={
            user.pillar === "Investigator"
              ? GraduationCap
              : user.pillar === "Reviewer"
              ? Scale
              : ShieldCheck
          }
          color="green"
        />
        <KpiCard
          label="Account Standing"
          value={user.status}
          description="Access credential standing"
          icon={UserCheck}
          color={isActive ? "green" : "amber"}
        />
        <KpiCard
          label="Identity Tier"
          value={user.verificationStatus === "Verified Institutional ID" ? "Verified" : "SSO"}
          description="Authentication confidence"
          icon={Award}
          color="gold"
        />
      </KpiGrid>

      {/* ── Main Details Grid ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols wide) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card: Institutional & Contact Coordinates */}
          <Card className="p-5 rounded-none sm:rounded-2xl border-y sm:border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#002752] dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Building2 className="size-4 text-[#002752] dark:text-sky-400" />
              <span>Institutional Coordinates & Directory Info</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800">
                <span className="text-slate-400 block font-medium">Home Institution</span>
                <span className="font-bold text-slate-800 dark:text-slate-100 text-sm block">
                  {user.institution}
                </span>
                <span className="text-slate-500 dark:text-slate-400 block mt-0.5">
                  {user.department}
                </span>
              </div>

              <div className="space-y-1 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800">
                <span className="text-slate-400 block font-medium">Designation / Role</span>
                <span className="font-bold text-slate-800 dark:text-slate-100 text-sm block">
                  {user.role}
                </span>
                <span className="text-slate-500 dark:text-slate-400 block mt-0.5">
                  Pillar: {user.pillar}
                </span>
              </div>

              <div className="space-y-1 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800">
                <span className="text-slate-400 block font-medium">Official Contact Email</span>
                <a
                  href={`mailto:${user.email}`}
                  className="font-bold text-[#002752] dark:text-sky-300 text-xs block truncate hover:underline flex items-center gap-1.5"
                >
                  <Mail className="size-3.5 text-slate-400 shrink-0" />
                  <span>{user.email}</span>
                </a>
              </div>

              <div className="space-y-1 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800">
                <span className="text-slate-400 block font-medium">Official Contact Phone</span>
                <div className="font-bold text-slate-800 dark:text-slate-100 text-xs flex items-center gap-1.5">
                  <Phone className="size-3.5 text-slate-400 shrink-0" />
                  <span>{user.phone || "+880 1713-000000"}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Card: Biography / Research Profile */}
          {user.bio && (
            <Card className="p-5 rounded-xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-[#002752] dark:text-white uppercase tracking-wider flex items-center gap-2">
                <FileText className="size-4 text-[#002752] dark:text-sky-400" />
                <span>Profile Statement & Academic Focus</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200/70 dark:border-slate-800">
                &quot;{user.bio}&quot;
              </p>
            </Card>
          )}
        </div>

        {/* Right Column (1 Col wide) */}
        <div className="space-y-6">
          {/* Card: Security & RBAC Clearance */}
          <Card className="p-5 rounded-none sm:rounded-2xl border-y sm:border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#002752] dark:text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="size-4 text-[#002752] dark:text-sky-400" />
              <span>Identity & Security Status</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Identity Verification</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {user.verificationStatus}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Account Standing</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {user.status}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">2FA / Hardware Auth</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Enforced via DIU SSO
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Last Session</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {user.lastLogin}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* ── Edit Profile Modal ──────────────────────────────────────────────── */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="w-full max-w-[calc(100vw-2rem)] sm:max-w-lg max-h-[calc(100dvh-2rem)] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-[#002752] dark:text-white">
              Edit User Profile: {user.name}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
              Update institutional coordinates, contact information, and role designation.
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
                  Designation / Role
                </label>
                <Input
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  className="h-8 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Department
                </label>
                <Input
                  value={editForm.department}
                  onChange={(e) =>
                    setEditForm({ ...editForm, department: e.target.value })
                  }
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Institution
              </label>
              <Input
                value={editForm.institution}
                onChange={(e) =>
                  setEditForm({ ...editForm, institution: e.target.value })
                }
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
    </DashboardContainer>
  )
}
