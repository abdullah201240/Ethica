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
} from "@/components/ui/dialog"
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
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              System Administrator Not Found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
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
    "Governance Admin": "bg-[#002752]/10 text-[#002752] dark:text-sky-300 border-[#002752]/30",
    "Security & Audit": "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    "Operations Admin": "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/30",
  }

  return (
    <div className="space-y-6 select-text w-full max-w-full overflow-x-hidden pb-12">
      {/* ── Top Navigation & Breadcrumbs ───────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-3">
        <Link
          href="/admin/admins"
          className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-[#002752] dark:text-slate-400 dark:hover:text-white transition-colors"
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
              <Users className="size-3.5 text-[#002752] dark:text-sky-400" />
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
      <Card className="p-5 sm:p-6 rounded-xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="size-16 sm:size-20 rounded-2xl bg-[#002752]/10 dark:bg-sky-500/10 text-[#002752] dark:text-sky-300 flex items-center justify-center font-black text-xl sm:text-2xl shrink-0 border border-[#002752]/20">
              {initials}
            </div>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {admin.name}
                </h1>
                {admin.accessLevel === "Super Admin" && (
                  <Badge
                    variant="outline"
                    className="text-[10px] font-mono font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30 px-1.5 py-0.5"
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
                <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                  <Calendar className="size-3.5 text-slate-400 shrink-0" />
                  <span>Appointed {admin.addedAt}</span>
                </div>
                <div className="font-mono text-xs font-bold text-[#002752] dark:text-sky-300">
                  {admin.id}
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                <Badge
                  variant="outline"
                  className="text-[11px] font-semibold bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200"
                >
                  Daffodil International University
                </Badge>
                <Badge
                  variant="outline"
                  className="text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-1"
                >
                  <Clock className="size-3 text-slate-400" />
                  <span>Last active: {admin.lastActive}</span>
                </Badge>
              </div>
            </div>
          </div>

          {/* Header Action: Activate / Deactivate Toggle */}
          <div className="flex flex-row lg:flex-col items-center lg:items-end gap-2 shrink-0">
            <AlertDialog>
              <AlertDialogTrigger render={
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className={`h-9 px-4 text-xs font-bold rounded-lg cursor-pointer ${
                    isActive
                      ? "text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                      : "text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                  }`}
                >
                  {isActive ? (
                    <>
                      <UserX className="size-3.5 mr-1.5 text-amber-600 dark:text-amber-400" />
                      <span>Suspend Authority (Inactive)</span>
                    </>
                  ) : (
                    <>
                      <UserCheck className="size-3.5 mr-1.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Restore Authority (Active)</span>
                    </>
                  )}
                </Button>
              } />
              <AlertDialogContent className="w-full max-w-[calc(100vw-2rem)] sm:max-w-md">
                <AlertDialogHeader>
                  <div className="flex items-center gap-3">
                    <div
                      className={`size-10 rounded-full flex items-center justify-center shrink-0 ${
                        isActive
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                      }`}
                    >
                      {isActive ? (
                        <AlertTriangle className="size-5" />
                      ) : (
                        <CheckCircle2 className="size-5" />
                      )}
                    </div>
                    <div>
                      <AlertDialogTitle className="text-base font-bold text-slate-900 dark:text-white">
                        {isActive
                          ? "Suspend Administrative Authority?"
                          : "Restore Administrative Authority?"}
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {admin.name} • {admin.id} ({admin.role})
                      </AlertDialogDescription>
                    </div>
                  </div>
                </AlertDialogHeader>

                <div className="py-2 text-xs text-slate-600 dark:text-slate-300 space-y-2">
                  {isActive ? (
                    <>
                      <p>
                        Suspending this administrator will immediately revoke their active governance session, pause cryptographic signing keys, and disallow protocol triage decisions.
                      </p>
                      <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-2.5 text-amber-800 dark:text-amber-200">
                        <strong>Security Note:</strong> Active protocol oversight assignments ({admin.protocols} cases) will remain archived in the audit ledger.
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
                    onClick={handleToggleStatus}
                    className={`h-8 text-xs font-bold text-white ${
                      isActive
                        ? "bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800"
                        : "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800"
                    }`}
                  >
                    {isActive ? "Confirm Deactivation" : "Confirm Activation"}
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
          label="Oversight Protocols"
          value={admin.protocols}
          description="Active oversight cases"
          icon={FileText}
          color="navy"
        />
        <KpiCard
          label="Privilege Tier"
          value={admin.accessLevel}
          description="Role-based access authority"
          icon={KeyRound}
          color="gold"
        />
        <KpiCard
          label="Account Standing"
          value={admin.status}
          description="Live governance standing"
          icon={UserCheck}
          color={isActive ? "green" : "amber"}
        />
        <KpiCard
          label="Assigned Permissions"
          value={admin.permissions?.length || 0}
          description="Granted security capabilities"
          icon={Award}
          color="sky"
        />
      </KpiGrid>

      {/* ── Main Details Grid ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols wide) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card: Institutional Coordinates */}
          <Card className="p-5 rounded-xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#002752] dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Building2 className="size-4 text-[#002752] dark:text-sky-400" />
              <span>Administrative Profile & Directorate Coordinates</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800">
                <span className="text-slate-400 block font-medium">Department / Directorate</span>
                <span className="font-bold text-slate-800 dark:text-slate-100 text-sm block">
                  {admin.department}
                </span>
                <span className="text-slate-500 dark:text-slate-400 block mt-0.5">
                  Daffodil International University
                </span>
              </div>

              <div className="space-y-1 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800">
                <span className="text-slate-400 block font-medium">Governance Designation</span>
                <span className="font-bold text-slate-800 dark:text-slate-100 text-sm block">
                  {admin.role}
                </span>
                <span className="text-slate-500 dark:text-slate-400 block mt-0.5">
                  Tier: {admin.accessLevel}
                </span>
              </div>

              <div className="space-y-1 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800">
                <span className="text-slate-400 block font-medium">Official Contact Email</span>
                <a
                  href={`mailto:${admin.email}`}
                  className="font-bold text-[#002752] dark:text-sky-300 text-xs block truncate hover:underline flex items-center gap-1.5"
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
          <Card className="p-5 rounded-xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-[#002752] dark:text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
              <span>Granted Administrative Privileges & RBAC Authorizations</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Cryptographically signed capabilities authorized by the Institutional Compliance Secretariat:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {(admin.permissions || []).map((perm) => (
                <div
                  key={perm}
                  className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200"
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
          <Card className="p-5 rounded-xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-[#002752] dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Fingerprint className="size-4 text-[#002752] dark:text-sky-400" />
              <span>HSM Token & PKI Credentials</span>
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Hardware Security Module public key token for signing governance decisions and audit certificates.
            </p>

            <div className="p-3 rounded-lg bg-slate-900 text-slate-200 dark:bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-mono text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="size-3.5" />
                  <span>TOKEN ACTIVE</span>
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyHash}
                  className="h-6 px-2 text-[10px] text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer"
                >
                  {copiedHash ? (
                    <Check className="size-3 mr-1 text-emerald-400" />
                  ) : (
                    <Copy className="size-3 mr-1" />
                  )}
                  <span>{copiedHash ? "Copied" : "Copy Token"}</span>
                </Button>
              </div>

              <div className="font-mono text-[10px] break-all text-slate-300 bg-slate-950/80 p-2 rounded border border-slate-800 select-text">
                SHA256:{admin.id.replace(/-/g, "")}9f8b7c6d5e4a3b2c1d0e9f8a7b6c5d4e
              </div>
            </div>
          </Card>

          {/* Card: Audit & Compliance Ledger */}
          <Card className="p-5 rounded-xl border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-[#002752] dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Award className="size-4 text-[#002752] dark:text-sky-400" />
              <span>Oversight Scope</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Total Protocols</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {admin.protocols} cases
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Security Clearance</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  FIPS 140-3 L3
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Governance Term</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Permanent Appointee
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* ── Edit Admin Credentials Modal ────────────────────────────────────── */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="w-full max-w-[calc(100vw-2rem)] sm:max-w-lg max-h-[calc(100dvh-2rem)] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-[#002752] dark:text-white">
              Edit Administrator Credentials: {admin.name}
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
    </div>
  )
}
