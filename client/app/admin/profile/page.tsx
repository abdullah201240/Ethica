"use client"

import * as React from "react"
import {
  ShieldCheck,
  KeyRound,
  Laptop,
  Smartphone,
  Globe,
  Clock,
  Fingerprint,
  Lock,
  Eye,
  EyeOff,
  Save,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/sonner"
import { adminContactSchema, changePasswordSchema } from "@/lib/schemas"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
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
  DataTable,
  type ColumnDef,
  type DataTableFilter,
} from "@/components/ui/data-table"
import { DashboardContainer, DashboardCard } from "@/components/dashboard/dashboard-container"

interface AdminSessionLog {
  id: string
  device: string
  deviceType: "desktop" | "mobile"
  ipAddress: string
  location: string
  authMethod: string
  lastActive: string
  status: "Active Session" | "Signed Out"
}

const initialSessionLogs: AdminSessionLog[] = [
  {
    id: "SESS-2026-881",
    device: "MacBook Pro 16\" (macOS Sonoma • Safari 17.5)",
    deviceType: "desktop",
    ipAddress: "103.114.98.12",
    location: "DIU Ashulia Research Complex",
    authMethod: "Touch ID / Passkey (WebAuthn)",
    lastActive: "Active now (Current session)",
    status: "Active Session",
  },
  {
    id: "SESS-2026-880",
    device: "iPhone 15 Pro (iOS 17.5 • Safari Mobile)",
    deviceType: "mobile",
    ipAddress: "103.114.98.45",
    location: "DIU Ashulia Campus Wi-Fi",
    authMethod: "Face ID / Mobile SSO",
    lastActive: "42 mins ago",
    status: "Active Session",
  },
  {
    id: "SESS-2026-879",
    device: "Dell Precision 5820 (Windows 11 • Edge)",
    deviceType: "desktop",
    ipAddress: "103.114.98.19",
    location: "Office of Research Governance (Room 602)",
    authMethod: "Institutional Single Sign-On (SSO)",
    lastActive: "Sep 04, 2026 06:15 PM",
    status: "Active Session",
  },
  {
    id: "SESS-2026-878",
    device: "iPad Pro 12.9\" (iPadOS 17.5 • Safari)",
    deviceType: "mobile",
    ipAddress: "103.114.98.33",
    location: "Daffodil Smart City Library Hub",
    authMethod: "Two-Factor Authentication (2FA)",
    lastActive: "Sep 03, 2026 05:00 PM",
    status: "Signed Out",
  },
  {
    id: "SESS-2026-877",
    device: "ThinkPad X1 Carbon (Ubuntu 24.04 LTS • Firefox)",
    deviceType: "desktop",
    ipAddress: "103.114.98.88",
    location: "Remote VPN • Dhaka, Bangladesh",
    authMethod: "Password + Security Key",
    lastActive: "Aug 28, 2026 02:30 PM",
    status: "Signed Out",
  },
]

export default function AdminProfilePage() {
  const [isEditingContact, setIsEditingContact] = React.useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = React.useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false)
  const [showNewPassword, setShowNewPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [sessionLogs, setSessionLogs] = React.useState<AdminSessionLog[]>(initialSessionLogs)

  const [passwordForm, setPasswordForm] = React.useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [passwordErrors, setPasswordErrors] = React.useState<Record<string, string>>({})

  const [contactForm, setContactForm] = React.useState({
    phone: "+880 2 9138234-5 (Ext: 104)",
    mobile: "+880 1713-000001",
    office: "Suite 602, Research & Innovation Complex, Daffodil Smart City, Ashulia",
    emergencyBackupEmail: "marcus.vance.ethics@diu.edu.bd",
    officeHours: "Sun–Thu, 09:00 AM – 04:00 PM BST",
  })

  const [alertSettings, setAlertSettings] = React.useState({
    quorumDeadlines: true,
    newApplicationsDigest: true,
    securityAlerts: true,
    emergencySuspensions: true,
  })

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault()

    const validation = adminContactSchema.safeParse(contactForm)
    if (!validation.success) {
      const firstError = Object.values(validation.error.flatten().fieldErrors)[0]?.[0]
      toast.error("Validation Error", {
        description: firstError || "Please check contact coordinates.",
      })
      return
    }

    setIsEditingContact(false)
    toast.success("Institutional Profile Updated", {
      description:
        "Contact coordinates and emergency contact details have been safely registered to institutional records.",
    })
  }

  const handleRevokeSession = (sessionId: string, device: string) => {
    setSessionLogs((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? { ...s, status: "Signed Out", lastActive: "Just now (Signed out)" }
          : s
      )
    )
    toast.success("Device Session Signed Out", {
      description: `Session ${sessionId} on ${device} has been signed out successfully.`,
    })
  }

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordErrors({})

    const validation = changePasswordSchema.safeParse(passwordForm)
    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors
      const formatted: Record<string, string> = {}
      for (const [key, msgs] of Object.entries(fieldErrors)) {
        if (msgs?.[0]) formatted[key] = msgs[0]
      }
      setPasswordErrors(formatted)
      const firstError = Object.values(fieldErrors)[0]?.[0]
      toast.error("Password Validation Error", {
        description: firstError || "Please ensure password meets all complexity requirements.",
      })
      return
    }

    setIsPasswordModalOpen(false)
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
    setPasswordErrors({})
    toast.success("Password Updated Successfully", {
      description: "Your administrative account password has been safely updated.",
    })
  }

  const toggleAlert = (key: keyof typeof alertSettings) => {
    setAlertSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  // ── Session Docket Columns ──────────────────────────────────────────────
  const sessionColumns: ColumnDef<AdminSessionLog>[] = React.useMemo(
    () => [
      {
        id: "id",
        accessorKey: "id",
        header: "Session ID",
        sortable: true,
        headerClassName: "w-32",
        cell: ({ row }) => (
          <span className="font-mono text-sm font-bold text-primary dark:text-sky-300">
            {row.id}
          </span>
        ),
      },
      {
        id: "device",
        accessorKey: "device",
        header: "Authenticated Device / Browser",
        sortable: true,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            {row.deviceType === "desktop" ? (
              <Laptop className="size-4 text-slate-400 shrink-0" />
            ) : row.deviceType === "mobile" ? (
              <Smartphone className="size-4 text-slate-400 shrink-0" />
            ) : (
              <Fingerprint className="size-4 text-primary dark:text-sky-400 shrink-0" />
            )}
            <div className="space-y-0.5 min-w-0">
              <span className="font-bold text-sm text-slate-900 dark:text-slate-100 block truncate">
                {row.device}
              </span>
              <span className="text-sm text-slate-400 dark:text-slate-500 block truncate">
                {row.location}
              </span>
            </div>
          </div>
        ),
      },
      {
        id: "ipAddress",
        accessorKey: "ipAddress",
        header: "IP Address & Network",
        sortable: true,
        headerClassName: "w-44",
        cell: ({ row }) => (
          <div className="font-mono text-sm text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Globe className="size-3 text-slate-400" />
            <span>{row.ipAddress}</span>
          </div>
        ),
      },
      {
        id: "authMethod",
        accessorKey: "authMethod",
        header: "Authentication Method",
        cell: ({ row }) => (
          <span className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
            <KeyRound className="size-3 text-emerald-600" />
            <span>{row.authMethod}</span>
          </span>
        ),
      },
      {
        id: "lastActive",
        accessorKey: "lastActive",
        header: "Last Active",
        sortable: true,
        headerClassName: "w-40",
        cell: ({ row }) => (
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            <Clock className="size-3" />
            <span>{row.lastActive}</span>
          </div>
        ),
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Status",
        sortable: true,
        headerClassName: "w-32",
        cell: ({ row }) => (
          <Badge
            variant="outline"
            className={`text-sm font-bold ${
              row.status === "Active Session"
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                : "bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700"
            }`}
          >
            {row.status}
          </Badge>
        ),
      },
      {
        id: "actions",
        header: "Session Action",
        align: "right",
        headerClassName: "w-32",
        cell: ({ row }) => (
          <div className="inline-flex items-center justify-end">
            {row.status === "Active Session" ? (
              <AlertDialog>
                <AlertDialogTrigger render={
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    className="h-7 px-2.5 text-sm font-bold rounded-md border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                    title="Sign Out Session"
                  >
                    Sign Out
                  </Button>
                } />
                <AlertDialogContent className="sm:max-w-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-body-sm font-bold text-primary dark:text-white">
                      Sign Out Device Session
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-body-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      Are you sure you want to sign out session <strong className="text-foreground">{row.id}</strong> on <strong className="text-foreground">{row.device}</strong>?
                      This device will be immediately disconnected from your administrator account.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="text-body-sm font-semibold">Keep Session</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleRevokeSession(row.id, row.device)}
                      className="bg-rose-600 hover:bg-rose-700 text-white text-body-sm font-bold"
                    >
                      Sign Out Device
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <span className="text-sm font-mono text-slate-400 dark:text-slate-500">
                Signed Out
              </span>
            )}
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sessionLogs]
  )

  const sessionFilters: DataTableFilter<AdminSessionLog>[] = React.useMemo(
    () => [
      {
        id: "status",
        title: "Session Status",
        accessorKey: "status",
        options: [
          { label: "Active Sessions", value: "Active Session" },
          { label: "Signed Out", value: "Signed Out" },
        ],
      },
    ],
    []
  )

  return (
    <DashboardContainer>
      {/* ── Main Two-Column Profile & Account Cards ──────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Academic & Institutional Identity (2 Cols on lg) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Identity & Office Card */}
          <DashboardCard className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
              <div className="flex items-center gap-4">
                <div className="size-16 rounded-2xl bg-gradient-to-br from-[#002752] to-[#003875] text-white flex items-center justify-center font-black text-2xl shadow-sm ring-4 ring-[#002752]/10 dark:ring-white/10 shrink-0">
                  MV
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-primary dark:text-white">
                      Dr. Marcus Vance
                    </h2>
                    <Badge
                      variant="outline"
                      className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-micro font-bold"
                    >
                      Active Administrator
                    </Badge>
                  </div>
                  <p className="text-body-sm font-semibold text-slate-600 dark:text-slate-300">
                    Director of Research Governance & Compliance
                  </p>
                  <p className="text-sm text-slate-400 mt-0.5">
                    Office of Research Integrity & Institutional Review Board • ID: <span className="font-mono font-bold text-slate-600 dark:text-slate-300">SEC-DIU-001</span>
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant={isEditingContact ? "secondary" : "outline"}
                size="sm"
                onClick={() => setIsEditingContact(!isEditingContact)}
                className="h-8 px-3 text-body-sm font-bold rounded-md shrink-0 border-slate-200/90 dark:border-slate-700"
              >
                {isEditingContact ? "Cancel Edit" : "Edit Contact Details"}
              </Button>
            </div>

            {/* Academic Profile Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-body-sm">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800 space-y-1">
                <span className="text-slate-400 block font-medium text-micro">Academic Qualifications:</span>
                <strong className="text-slate-800 dark:text-slate-100 font-bold block text-body-sm">
                  MD, PhD in Bioethics & Health Policy
                </strong>
                <span className="text-muted-foreground block">
                  Fellow of the International Bioethics Consortium
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800 space-y-1">
                <span className="text-slate-400 block font-medium text-micro">Institution & Jurisdiction:</span>
                <strong className="text-slate-800 dark:text-slate-100 font-bold block text-body-sm">
                  Daffodil International University
                </strong>
                <span className="text-muted-foreground block">
                  Institutional Review Board (IRB00014298)
                </span>
              </div>
            </div>

            {/* Editable or Display Contact Information */}
            {isEditingContact ? (
              <form onSubmit={handleSaveContact} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-micro font-bold text-slate-700 dark:text-slate-300">
                      Official Secretariat Direct Phone:
                    </label>
                    <Input
                      value={contactForm.phone}
                      onChange={(e) =>
                        setContactForm((p) => ({ ...p, phone: e.target.value }))
                      }
                      className="h-9 text-body-sm font-mono"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-micro font-bold text-slate-700 dark:text-slate-300">
                      Emergency Quorum Mobile:
                    </label>
                    <Input
                      value={contactForm.mobile}
                      onChange={(e) =>
                        setContactForm((p) => ({ ...p, mobile: e.target.value }))
                      }
                      className="h-9 text-body-sm font-mono"
                      required
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-micro font-bold text-slate-700 dark:text-slate-300">
                      Office Complex Location:
                    </label>
                    <Input
                      value={contactForm.office}
                      onChange={(e) =>
                        setContactForm((p) => ({ ...p, office: e.target.value }))
                      }
                      className="h-9 text-body-sm"
                      required
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-micro font-bold text-slate-700 dark:text-slate-300">
                      Published Office Hours for Investigators:
                    </label>
                    <Input
                      value={contactForm.officeHours}
                      onChange={(e) =>
                        setContactForm((p) => ({ ...p, officeHours: e.target.value }))
                      }
                      className="h-9 text-body-sm"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingContact(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="bg-[#002752] hover:bg-[#001c3d] text-white font-bold gap-1.5"
                  >
                    <Save className="size-3.5" />
                    <span>Save Contact Details</span>
                  </Button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-body-sm">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800 space-y-1">
                  <span className="text-slate-400 block font-medium text-micro">Institutional Email & Phone:</span>
                  <div className="text-foreground font-mono font-semibold">
                    admin.secretariat@diu.edu.bd
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 font-mono">
                    {contactForm.phone}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800 space-y-1">
                  <span className="text-slate-400 block font-medium text-micro">Physical Office & Consultation Hours:</span>
                  <div className="text-foreground font-medium">
                    {contactForm.office}
                  </div>
                  <div className="text-muted-foreground text-body-sm">
                    {contactForm.officeHours}
                  </div>
                </div>
              </div>
            )}
          </DashboardCard>

          {/* Committee Oversight Delegations Card */}
          <DashboardCard className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-body-sm font-bold text-primary dark:text-white">
                  Regulatory Delegations & Committee Jurisdiction
                </h3>
                <p className="text-body-sm text-slate-400 mt-0.5">
                  Standing delegated authorities under the DIU Research Ethics Charter
                </p>
              </div>
              <Badge variant="secondary" className="bg-[#002752]/10 text-primary dark:text-sky-300 font-mono text-micro">
                Full Delegation Active
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-body-sm">
              {[
                {
                  board: "Biomedical & Clinical Trials IRB",
                  role: "Standing Secretariat & Quorum Tie-Breaker",
                  status: "Active Quorum",
                },
                {
                  board: "AI, Data Science & Tech Ethics Chamber",
                  role: "Computational Governance Overseer",
                  status: "Active Quorum",
                },
                {
                  board: "Social, Behavioral & Community Research",
                  role: "Vulnerable Population Compliance Reviewer",
                  status: "Active Quorum",
                },
                {
                  board: "Genomics & Precision Medicine Sub-Panel",
                  role: "Biological Material Transfer (MTA) Auditor",
                  status: "Active Quorum",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">
                      {item.board}
                    </span>
                    <span className="size-2 rounded-full bg-[#198754]" />
                  </div>
                  <p className="text-body-sm text-slate-600 dark:text-slate-300">
                    {item.role}
                  </p>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>

        {/* Right Column: Standard Account Security & Notifications (1 Col on lg) */}
        <div className="space-y-6">
          {/* Account Security & Sign-in Card */}
          <DashboardCard className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-secondary" />
                <h3 className="text-body-sm font-bold uppercase tracking-wider text-primary dark:text-white">
                  Security & Authentication
                </h3>
              </div>
              <Badge className="bg-[#198754] text-white text-micro font-bold">
                Account Secured
              </Badge>
            </div>

            <div className="space-y-4 text-body-sm">
              {/* Password Setting */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block font-medium text-micro">Account Password</span>
                    <span className="font-mono text-sm font-bold text-foreground block">
                      ••••••••••••••••
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="h-7 px-2.5 text-micro font-bold rounded gap-1 border-slate-300 dark:border-slate-700"
                  >
                    <Lock className="size-3" />
                    <span>Change Password</span>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Last updated 45 days ago. Minimum 8 characters with numbers & uppercase letters.
                </p>
              </div>

              {/* Two-Factor Authentication */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <KeyRound className="size-3.5 text-emerald-600" />
                    <span className="text-foreground font-bold text-body-sm">Two-Factor Authentication (2FA)</span>
                  </div>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-micro font-bold">
                    Enabled
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Authenticator App (TOTP) and Hardware Passkeys (WebAuthn) configured for login verification.
                </p>
              </div>

              {/* Single Sign-On (SSO) */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Globe className="size-3.5 text-[#002752] dark:text-sky-400" />
                    <span className="text-foreground font-bold text-body-sm">Institutional SSO</span>
                  </div>
                  <Badge variant="outline" className="bg-[#002752]/10 text-primary dark:text-sky-300 border-[#002752]/20 text-micro font-bold">
                    Connected
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Linked to DIU Google Workspace (<code className="font-mono text-[0.7rem]">admin.secretariat@diu.edu.bd</code>).
                </p>
              </div>

              {/* Session Timeout Policy */}
              <div className="flex items-center justify-between text-body-sm text-muted-foreground pt-1 px-1">
                <span>Inactivity Session Timeout:</span>
                <span className="font-mono font-bold text-foreground">
                  60 minutes
                </span>
              </div>
            </div>
          </DashboardCard>

          {/* Governance & Notification Preferences */}
          <DashboardCard className="space-y-4">
            <h3 className="text-body-sm font-bold uppercase tracking-wider text-primary dark:text-white border-b border-slate-200/80 dark:border-slate-800 pb-3">
              Secretariat Notification Dispatch
            </h3>

            <div className="space-y-3 text-body-sm">
              {[
                {
                  key: "quorumDeadlines" as const,
                  label: "Urgent Quorum Vote Deadlines",
                  desc: "Push alerts 4h before deliberation vote closure",
                },
                {
                  key: "newApplicationsDigest" as const,
                  label: "Reviewer Intake Daily Digest",
                  desc: "Summary of new applicant dossiers submitted to docket",
                },
                {
                  key: "securityAlerts" as const,
                  label: "Security & Sign-in Alerts",
                  desc: "Immediate email notifications for unrecognized devices or logins",
                },
                {
                  key: "emergencySuspensions" as const,
                  label: "Adverse Safety Event Flagging",
                  desc: "Immediate escalation for severe protocol deviations",
                },
              ].map((setting) => (
                <div
                  key={setting.key}
                  className="flex items-start justify-between gap-3 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-foreground block">
                      {setting.label}
                    </span>
                    <span className="text-body-sm text-slate-400 block">
                      {setting.desc}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant={alertSettings[setting.key] ? "default" : "outline"}
                    size="xs"
                    onClick={() => toggleAlert(setting.key)}
                    className={`h-6 px-2 text-micro font-bold rounded shrink-0 ${
                      alertSettings[setting.key]
                        ? "bg-[#198754] hover:bg-[#146c43] text-white"
                        : "text-slate-400"
                    }`}
                  >
                    {alertSettings[setting.key] ? "Enabled" : "Disabled"}
                  </Button>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>
      </div>

      {/* ── Active Devices & Login Sessions Docket (Unified DataTable - Rule 6) ── */}
      <div className="w-full space-y-3">
        <DataTable<AdminSessionLog>
          data={sessionLogs}
          columns={sessionColumns}
          title="Active Devices & Login Sessions"
          searchPlaceholder="Search by client device, location, or IP address..."
          searchKeys={["device", "location", "ipAddress", "authMethod"]}
          filters={sessionFilters}
          initialPageSize={5}
          pageSizeOptions={[5, 10, 20]}
          initialSort={{
            columnId: "id",
            direction: "desc",
          }}
        />
      </div>

      {/* ── Change Password Slide-over Sheet ──────────────────────────────── */}
      <Sheet open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <SheetContent side="right" size="default" className="p-6">
          <SheetHeader className="p-0 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-[#002752]/10 dark:bg-sky-500/10 text-primary dark:text-sky-300 flex items-center justify-center">
                <Lock className="size-4" />
              </div>
              <div>
                <SheetTitle className="text-lg font-bold text-primary dark:text-white">
                  Change Account Password
                </SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground mt-0.5">
                  Update your credentials for the Institutional Administrator Console.
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <form onSubmit={handleChangePassword} className="space-y-4 py-4" noValidate>
            {/* Current Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Current Password
              </label>
              <div className="relative">
                <Input
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordForm.currentPassword}
                  onChange={(e) => {
                    setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))
                    if (passwordErrors.currentPassword) {
                      setPasswordErrors((prev) => {
                        const next = { ...prev }
                        delete next.currentPassword
                        return next
                      })
                    }
                  }}
                  placeholder="Enter current password"
                  className={`h-9 text-sm pr-10 font-mono ${
                    passwordErrors.currentPassword
                      ? "border-rose-500 ring-1 ring-rose-500/20 bg-rose-50/20"
                      : ""
                  }`}
                  aria-invalid={Boolean(passwordErrors.currentPassword)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-1 top-1 h-7 w-7 text-slate-400 hover:text-slate-600"
                >
                  {showCurrentPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                </Button>
              </div>
              {passwordErrors.currentPassword && (
                <p className="text-xs text-rose-600 font-semibold mt-1">
                  {passwordErrors.currentPassword}
                </p>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                New Password
              </label>
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={(e) => {
                    setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))
                    if (passwordErrors.newPassword) {
                      setPasswordErrors((prev) => {
                        const next = { ...prev }
                        delete next.newPassword
                        return next
                      })
                    }
                  }}
                  placeholder="Enter new strong password"
                  className={`h-9 text-sm pr-10 font-mono ${
                    passwordErrors.newPassword
                      ? "border-rose-500 ring-1 ring-rose-500/20 bg-rose-50/20"
                      : ""
                  }`}
                  aria-invalid={Boolean(passwordErrors.newPassword)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-1 top-1 h-7 w-7 text-slate-400 hover:text-slate-600"
                >
                  {showNewPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                </Button>
              </div>
              {passwordErrors.newPassword && (
                <p className="text-xs text-rose-600 font-semibold mt-1">
                  {passwordErrors.newPassword}
                </p>
              )}
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Confirm New Password
              </label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => {
                    setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))
                    if (passwordErrors.confirmPassword) {
                      setPasswordErrors((prev) => {
                        const next = { ...prev }
                        delete next.confirmPassword
                        return next
                      })
                    }
                  }}
                  placeholder="Re-type new password"
                  className={`h-9 text-sm pr-10 font-mono ${
                    passwordErrors.confirmPassword
                      ? "border-rose-500 ring-1 ring-rose-500/20 bg-rose-50/20"
                      : ""
                  }`}
                  aria-invalid={Boolean(passwordErrors.confirmPassword)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-1 top-1 h-7 w-7 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                </Button>
              </div>
              {passwordErrors.confirmPassword && (
                <p className="text-xs text-rose-600 font-semibold mt-1">
                  {passwordErrors.confirmPassword}
                </p>
              )}
            </div>

            {/* Password Policy Checklist */}
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800 space-y-1.5 text-xs text-muted-foreground">
              <span className="font-bold text-foreground block">Password Requirements:</span>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className={`size-3.5 ${passwordForm.newPassword.length >= 8 ? "text-emerald-600" : "text-slate-400"}`} />
                <span>At least 8 characters long</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className={`size-3.5 ${/[A-Z]/.test(passwordForm.newPassword) ? "text-emerald-600" : "text-slate-400"}`} />
                <span>At least one uppercase letter (A-Z)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className={`size-3.5 ${/[0-9]/.test(passwordForm.newPassword) ? "text-emerald-600" : "text-slate-400"}`} />
                <span>At least one numerical digit (0-9)</span>
              </div>
            </div>

            <SheetFooter className="p-0 pt-4 flex flex-row items-center justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsPasswordModalOpen(false)
                  setPasswordErrors({})
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-[#002752] hover:bg-[#001c3d] text-white font-bold"
              >
                Update Password
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </DashboardContainer>
  )
}
