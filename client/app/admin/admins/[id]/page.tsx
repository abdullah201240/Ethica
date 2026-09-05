"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowLeft,
  ShieldCheck,
  UserCheck,
  Building2,
  Mail,
  Phone,
  Calendar,
  Award,
  CheckCircle2,
  Lock,
  KeyRound,
  FileText,
  Clock,
  Fingerprint,
  Copy,
  Check,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { KpiCard, KpiGrid } from "@/components/ui/kpi-card"
import { DashboardContainer } from "@/components/dashboard/dashboard-container"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/sonner"
import { updateAdminMemberSchema } from "@/lib/schemas"
import { Switch } from "@/components/ui/switch"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import {
  type AdminAccessLevel,
  getStoredAdminMembers,
  subscribeAdminMembers,
  updateAdminMember,
  toggleAdminMemberStatus,
  initialAdminMembers,
} from "@/lib/admin-roster"

interface PageProps {
  params: Promise<{ id: string }>
}

export default function SystemAdminDossierDetailPage({ params }: PageProps) {
  const resolvedParams = React.use(params)
  const adminId = decodeURIComponent(resolvedParams.id)

  const allAdmins = React.useSyncExternalStore(
    subscribeAdminMembers,
    getStoredAdminMembers,
    () => initialAdminMembers
  )

  const admin = React.useMemo(() => {
    return allAdmins.find((a) => a.id === adminId)
  }, [allAdmins, adminId])

  const [copiedHash, setCopiedHash] = React.useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)
  const [editForm, setEditForm] = React.useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    department: "",
    accessLevel: "System Admin" as AdminAccessLevel,
  })

  const handleOpenEdit = React.useCallback(() => {
    if (admin) {
      setEditForm({
        name: admin.name,
        email: admin.email,
        phone: admin.phone || "",
        role: admin.role,
        department: admin.department,
        accessLevel: admin.accessLevel,
      })
      setIsEditModalOpen(true)
    }
  }, [admin])

  if (!admin) {
    return (
      <div className="space-y-6 w-full max-w-full">
        <Link
          href="/admin/admins"
          className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="size-3.5 mr-1.5" />
          <span>Back to System Admin List</span>
        </Link>
        <Card className="p-8 text-center space-y-4">
          <div className="size-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Users className="size-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              System Administrator Not Found
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              No administrator found matching identifier &quot;{adminId}&quot;.
            </p>
          </div>
          <Link href="/admin/admins">
            <Button size="sm" className="bg-[#002752] text-white">
              Return to System Admin Directory
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  const isActive = admin.status === "Active"

  const handleToggleStatus = () => {
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

  const handleCopyHash = () => {
    const fingerprint = `SHA256:${admin.id.replace(/-/g, "")}9f8b7c6d5e4a3b2c1d0e9f8a7b6c5d4e`
    navigator.clipboard.writeText(fingerprint)
    setCopiedHash(true)
    toast.success("Cryptographic Token Fingerprint Copied", {
      description: "Hardware token PKI seal copied to clipboard.",
    })
    setTimeout(() => setCopiedHash(false), 2500)
  }

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault()

    const validation = updateAdminMemberSchema.safeParse(editForm)
    if (!validation.success) {
      const firstError = Object.values(validation.error.flatten().fieldErrors)[0]?.[0]
      toast.error("Validation Error", {
        description: firstError || "Please check administrator profile fields.",
      })
      return
    }

    const updated = updateAdminMember(admin.id, {
      name: editForm.name,
      email: editForm.email,
      phone: editForm.phone,
      role: editForm.role,
      department: editForm.department,
      accessLevel: editForm.accessLevel,
    })

    if (updated) {
      toast.success("Administrator Profile Updated", {
        description: `Credentials and role configurations for ${updated.name} have been updated.`,
      })
      setIsEditModalOpen(false)
    }
  }

  const initials =
    admin.name
      .replace(/^(Dr\.|Prof\.|Mr\.|Ms\.|Mrs\.|Engr\.)\s+/i, "")
      .split(" ")
      .filter(Boolean)
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "AD"

  const accessBadgeStyles: Record<AdminAccessLevel, string> = {
    "Super Admin": "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30",
    "System Admin": "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/30",
    "Governance Admin": "bg-[#002752]/10 text-primary dark:text-sky-300 border-[#002752]/30",
    "Security & Audit": "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    "Operations Admin": "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/30",
  }

  return (
    <DashboardContainer className="pb-12">
      {/* ── Top Navigation & Breadcrumbs ───────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-3 px-4 sm:px-0">
        <Link
          href="/admin/admins"
          className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="size-3.5 mr-1.5" />
          <span>Back to System Admin List</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link href="/admin/users">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs font-semibold rounded-lg border-slate-200 dark:border-slate-800"
            >
              <Users className="size-3.5 text-primary dark:text-sky-400" />
              <span>All Users</span>
            </Button>
          </Link>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleOpenEdit}
            className="h-8 gap-1.5 text-xs font-semibold rounded-lg border-slate-200 dark:border-slate-800"
          >
            <Lock className="size-3.5" />
            <span>Edit Credentials</span>
          </Button>
        </div>
      </div>

      {/* ── Admin Header Card ──────────────────────────────────────────────── */}
      <Card className="p-5 sm:p-6 rounded-none sm:rounded-2xl border-y sm:border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="size-16 sm:size-20 rounded-2xl bg-[#002752]/10 dark:bg-sky-500/10 text-primary dark:text-sky-300 flex items-center justify-center font-black text-xl sm:text-2xl shrink-0 border border-[#002752]/20">
              {initials}
            </div>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                  {admin.name}
                </h1>
                {admin.accessLevel === "Super Admin" && (
                  <Badge
                    variant="outline"
                    className="text-micro font-mono font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30 px-1.5 py-0.5"
                  >
                    ROOT AUTHORITY
                  </Badge>
                )}
                <Badge
                  variant="outline"
                  className={`text-xs font-semibold border ${
                    accessBadgeStyles[admin.accessLevel] || accessBadgeStyles["System Admin"]
                  }`}
                >
                  {admin.accessLevel}
                </Badge>
                <Badge
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${
                    isActive
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                      : "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30"
                  }`}
                >
                  {admin.status}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-1.5 font-medium">
                  <Building2 className="size-3.5 text-slate-400 shrink-0" />
                  <span>
                    {admin.role} • {admin.department}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="size-3.5 text-slate-400 shrink-0" />
                  <span>Appointed {admin.addedAt}</span>
                </div>
                <div className="font-mono text-xs font-bold text-primary dark:text-sky-300">
                  {admin.id}
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                <Badge
                  variant="outline"
                  className="text-micro font-semibold bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-foreground/85"
                >
                  Daffodil International University
                </Badge>
                <Badge
                  variant="outline"
                  className="text-micro font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-1"
                >
                  <Clock className="size-3 text-slate-400" />
                  <span>Last active: {admin.lastActive}</span>
                </Badge>
              </div>
            </div>
          </div>

          {/* Status Switch */}
          <div className="flex flex-row lg:flex-col items-center lg:items-end gap-2 shrink-0">
            <div className="flex items-center gap-2.5">
              <Switch
                checked={isActive}
                onCheckedChange={() => handleToggleStatus()}
                aria-label="Toggle administrator status"
              />
              <span className={`text-xs font-semibold ${
                isActive ? "text-emerald-700 dark:text-emerald-400" : "text-muted-foreground"
              }`}>
                {isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* ── Key Metrics ────────────────────────────────────────────────────── */}
      <KpiGrid columns={4}>
        <KpiCard
          label="Oversight Protocols"
          value={admin.protocols}
          icon={FileText}
          color="navy"
        />
        <KpiCard
          label="Privilege Tier"
          value={admin.accessLevel}
          icon={KeyRound}
          color="gold"
        />
        <KpiCard
          label="Account Standing"
          value={admin.status}
          icon={UserCheck}
          color={isActive ? "green" : "amber"}
        />
        <KpiCard
          label="Assigned Permissions"
          value={admin.permissions?.length || 0}
          icon={Award}
          color="sky"
        />
      </KpiGrid>

      {/* ── Main Details Grid ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols wide) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card: Institutional Coordinates & Role Scope */}
          <Card className="p-5 rounded-none sm:rounded-2xl border-y sm:border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-primary dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Building2 className="size-4 text-primary dark:text-sky-400" />
              <span>Administrative Profile & Directorate Coordinates</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800">
                <span className="text-slate-400 block font-medium">Department / Directorate</span>
                <span className="font-bold text-slate-800 dark:text-slate-100 text-sm block">
                  {admin.department}
                </span>
                <span className="text-muted-foreground block mt-0.5">
                  Daffodil International University
                </span>
              </div>

              <div className="space-y-1 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800">
                <span className="text-slate-400 block font-medium">Governance Designation</span>
                <span className="font-bold text-slate-800 dark:text-slate-100 text-sm block">
                  {admin.role}
                </span>
                <span className="text-muted-foreground block mt-0.5">
                  Tier: {admin.accessLevel}
                </span>
              </div>

              <div className="space-y-1 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800">
                <span className="text-slate-400 block font-medium">Official Contact Email</span>
                <a
                  href={`mailto:${admin.email}`}
                  className="font-bold text-primary dark:text-sky-300 text-xs block truncate hover:underline flex items-center gap-1.5"
                >
                  <Mail className="size-3.5 text-slate-400 shrink-0" />
                  <span>{admin.email}</span>
                </a>
              </div>

              <div className="space-y-1 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800">
                <span className="text-slate-400 block font-medium">Official Contact Phone</span>
                <div className="font-bold text-slate-800 dark:text-slate-100 text-xs flex items-center gap-1.5">
                  <Phone className="size-3.5 text-slate-400 shrink-0" />
                  <span>{admin.phone || "+880 1713-000000"}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Card: Granted Administrative Privileges */}
          <Card className="p-5 rounded-none sm:rounded-2xl border-y sm:border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-primary dark:text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
              <span>Granted Administrative Privileges & RBAC Authorizations</span>
            </h3>
            <p className="text-xs text-muted-foreground">
              Cryptographically signed capabilities authorized by the Institutional Compliance Secretariat:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {(admin.permissions || []).map((perm) => (
                <div
                  key={perm}
                  className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 text-xs text-foreground"
                >
                  <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="font-medium">{perm}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column (1 Col wide) */}
        <div className="space-y-6">
          {/* Card: Hardware Security Module (HSM) Token */}
          <Card className="p-5 rounded-none sm:rounded-2xl border-y sm:border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-primary dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Fingerprint className="size-4 text-primary dark:text-sky-400" />
              <span>HSM Token & PKI Credentials</span>
            </h3>

            <p className="text-xs text-muted-foreground">
              Hardware Security Module public key token for signing governance decisions and audit certificates.
            </p>

            <div className="p-3 rounded-lg bg-slate-900 text-slate-200 dark:bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-micro">
                <span className="font-mono text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="size-3.5" />
                  <span>TOKEN ACTIVE</span>
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyHash}
                  className="h-6 px-2 text-micro text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer"
                >
                  {copiedHash ? (
                    <Check className="size-3 mr-1 text-emerald-400" />
                  ) : (
                    <Copy className="size-3 mr-1" />
                  )}
                  <span>{copiedHash ? "Copied" : "Copy Token"}</span>
                </Button>
              </div>

              <div className="font-mono text-micro break-all text-slate-300 bg-slate-950/80 p-2 rounded border border-slate-800 select-text">
                SHA256:{admin.id.replace(/-/g, "")}9f8b7c6d5e4a3b2c1d0e9f8a7b6c5d4e
              </div>
            </div>
          </Card>

          {/* Card: Security Authority & Cryptographic Signing */}
          <Card className="p-5 rounded-none sm:rounded-2xl border-y sm:border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-primary dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Award className="size-4 text-primary dark:text-sky-400" />
              <span>Oversight Scope</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800">
                <span className="text-muted-foreground">Total Protocols</span>
                <span className="font-bold text-foreground">
                  {admin.protocols} cases
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800">
                <span className="text-muted-foreground">Security Clearance</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  FIPS 140-3 L3
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800">
                <span className="text-muted-foreground">Governance Term</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Permanent Appointee
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* ── Edit Admin Credentials Slide-over Sheet ─────────────────────────── */}
      <Sheet open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg md:max-w-xl p-6">
          <SheetHeader className="p-0 pb-3">
            <SheetTitle className="text-base font-bold text-primary dark:text-white">
              Edit Administrator Credentials: {admin.name}
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">
              Update designation, access privileges, and departmental assignment.
            </SheetDescription>
          </SheetHeader>

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
                      className={`h-6 px-2 text-micro font-semibold rounded ${
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

            <SheetFooter className="p-0 pt-4 flex-row justify-end gap-2 border-t border-slate-100 dark:border-slate-800/80">
              <SheetClose render={
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
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </DashboardContainer>
  )
}
