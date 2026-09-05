"use client"

import * as React from "react"
import {
  Copy,
  Check,
  KeyRound,
  Laptop,
  Smartphone,
  Globe,
  Save,
  Clock,
  Fingerprint,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/sonner"
import { adminContactSchema } from "@/lib/schemas"
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
  deviceType: "desktop" | "mobile" | "server"
  ipAddress: string
  location: string
  authMethod: string
  lastActive: string
  status: "Active Session" | "Terminated" | "Key Rotated"
}

const initialSessionLogs: AdminSessionLog[] = [
  {
    id: "SESS-2026-881",
    device: "MacBook Pro 16\" (macOS Sonoma 14.6 • Safari)",
    deviceType: "desktop",
    ipAddress: "103.114.98.12",
    location: "DIU Ashulia Research Complex",
    authMethod: "YubiKey 5C FIPS Hardware Token",
    lastActive: "Active now",
    status: "Active Session",
  },
  {
    id: "SESS-2026-880",
    device: "iPhone 15 Pro (iOS 17.5 • Ethica Mobile Authenticator)",
    deviceType: "mobile",
    ipAddress: "103.114.98.45",
    location: "DIU Ashulia Campus Wi-Fi (802.1X)",
    authMethod: "FaceID + Cryptographic Biometric Enclave",
    lastActive: "42 mins ago",
    status: "Active Session",
  },
  {
    id: "SESS-2026-879",
    device: "HSM Hardware Appliance (Linux Enterprise • mTLS)",
    deviceType: "server",
    ipAddress: "192.168.10.2",
    location: "Institutional Datacenter HSM Chamber",
    authMethod: "Mutual TLS Certificate Auth",
    lastActive: "Sep 04, 2026 06:15 PM",
    status: "Active Session",
  },
  {
    id: "SESS-2026-878",
    device: "Workstation Dell Precision (Windows 11 Enterprise)",
    deviceType: "desktop",
    ipAddress: "103.114.98.19",
    location: "Office of Research Governance (Room 602)",
    authMethod: "SmartCard PKI Card Reader",
    lastActive: "Sep 03, 2026 05:00 PM",
    status: "Terminated",
  },
  {
    id: "SESS-2026-877",
    device: "Secure Vault Terminal (FreeBSD • Console Access)",
    deviceType: "server",
    ipAddress: "192.168.10.8",
    location: "Cold Storage Key Vault",
    authMethod: "Dual-Custodian Multi-Key Ceremony",
    lastActive: "Aug 28, 2026 02:30 PM",
    status: "Key Rotated",
  },
]

export default function AdminProfilePage() {
  const [copiedKey, setCopiedKey] = React.useState(false)
  const [isEditingContact, setIsEditingContact] = React.useState(false)
  const [sessionLogs, setSessionLogs] = React.useState<AdminSessionLog[]>(initialSessionLogs)

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
    hsmAuditReports: true,
    emergencySuspensions: true,
  })

  const publicFingerprint =
    "9F83 4B2A 7E19 D502 81C4 330F A72E 1189 BC44 901E"

  const handleCopyFingerprint = () => {
    navigator.clipboard.writeText(publicFingerprint)
    setCopiedKey(true)
    toast.info("Fingerprint Copied", {
      description: "Public key cryptographic fingerprint copied to clipboard.",
    })
    setTimeout(() => setCopiedKey(false), 2000)
  }

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
          ? { ...s, status: "Terminated", lastActive: "Just now (Revoked)" }
          : s
      )
    )
    toast.success("Session Security Invalidation Completed", {
      description: `Hardware token session ${sessionId} (${device}) was revoked. Cryptographic keys invalidated.`,
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
        headerClassName: "w-[130px]",
        cell: ({ row }) => (
          <span className="font-mono text-xs font-bold text-[#002752] dark:text-sky-300">
            {row.id}
          </span>
        ),
      },
      {
        id: "device",
        accessorKey: "device",
        header: "Authenticated Client / Device",
        sortable: true,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            {row.deviceType === "desktop" ? (
              <Laptop className="size-4 text-slate-400 shrink-0" />
            ) : row.deviceType === "mobile" ? (
              <Smartphone className="size-4 text-slate-400 shrink-0" />
            ) : (
              <Fingerprint className="size-4 text-[#002752] dark:text-sky-400 shrink-0" />
            )}
            <div className="space-y-0.5 min-w-0">
              <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block truncate">
                {row.device}
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 block truncate">
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
        headerClassName: "w-[170px]",
        cell: ({ row }) => (
          <div className="font-mono text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Globe className="size-3 text-slate-400" />
            <span>{row.ipAddress}</span>
          </div>
        ),
      },
      {
        id: "authMethod",
        accessorKey: "authMethod",
        header: "Cryptographic Credential",
        cell: ({ row }) => (
          <span className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
            <KeyRound className="size-3 text-emerald-600" />
            <span>{row.authMethod}</span>
          </span>
        ),
      },
      {
        id: "lastActive",
        accessorKey: "lastActive",
        header: "Activity Time",
        sortable: true,
        headerClassName: "w-[160px]",
        cell: ({ row }) => (
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
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
        headerClassName: "w-[130px]",
        cell: ({ row }) => (
          <Badge
            variant="outline"
            className={`text-[11px] font-bold ${
              row.status === "Active Session"
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                : row.status === "Key Rotated"
                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
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
        headerClassName: "w-[120px]",
        cell: ({ row }) => (
          <div className="inline-flex items-center justify-end">
            {row.status === "Active Session" ? (
              <AlertDialog>
                <AlertDialogTrigger render={
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    className="h-7 px-2.5 text-[11px] font-bold rounded-md border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                    title="Revoke Cryptographic Session"
                  >
                    Revoke
                  </Button>
                } />
                <AlertDialogContent className="sm:max-w-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-base font-bold text-[#002752] dark:text-white">
                      Revoke Cryptographic Session
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      Are you sure you want to terminate session <strong className="text-slate-900 dark:text-white">{row.id}</strong> on <strong className="text-slate-900 dark:text-white">{row.device}</strong>?
                      The hardware token and mTLS authorization certificate will be immediately invalidated across the DIU network.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="text-xs font-semibold">Keep Session</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleRevokeSession(row.id, row.device)}
                      className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
                    >
                      Revoke Token
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                Invalidated
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
          { label: "Terminated", value: "Terminated" },
          { label: "Key Rotated", value: "Key Rotated" },
        ],
      },
    ],
    []
  )

  return (
    <DashboardContainer>
      {/* ── Main Two-Column Profile & Credential Cards ──────────────────────── */}
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
                    <h2 className="text-xl sm:text-2xl font-black text-[#002752] dark:text-white">
                      Dr. Marcus Vance
                    </h2>
                    <Badge
                      variant="outline"
                      className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-bold"
                    >
                      Active Custodian
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Director of Research Governance & Compliance
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Office of Research Integrity & Institutional Review Board • ID: <span className="font-mono font-bold text-slate-600 dark:text-slate-300">SEC-DIU-001</span>
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant={isEditingContact ? "secondary" : "outline"}
                size="sm"
                onClick={() => setIsEditingContact(!isEditingContact)}
                className="h-9 px-3.5 text-xs font-bold rounded-lg shrink-0 border-slate-200/90 dark:border-slate-700"
              >
                {isEditingContact ? "Cancel Edit" : "Edit Contact Details"}
              </Button>
            </div>

            {/* Academic Profile Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800 space-y-1">
                <span className="text-slate-400 block font-medium">Academic Qualifications:</span>
                <strong className="text-slate-800 dark:text-slate-100 font-bold block text-sm">
                  MD, PhD in Bioethics & Health Policy
                </strong>
                <span className="text-slate-500 dark:text-slate-400 block">
                  Fellow of the International Bioethics Consortium
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800 space-y-1">
                <span className="text-slate-400 block font-medium">Institution & Jurisdiction:</span>
                <strong className="text-slate-800 dark:text-slate-100 font-bold block text-sm">
                  Daffodil International University
                </strong>
                <span className="text-slate-500 dark:text-slate-400 block">
                  Institutional Review Board (IRB00014298)
                </span>
              </div>
            </div>

            {/* Editable or Display Contact Information */}
            {isEditingContact ? (
              <form onSubmit={handleSaveContact} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Official Secretariat Direct Phone:
                    </label>
                    <Input
                      value={contactForm.phone}
                      onChange={(e) =>
                        setContactForm((p) => ({ ...p, phone: e.target.value }))
                      }
                      className="h-10 text-xs font-mono"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Emergency Quorum Mobile:
                    </label>
                    <Input
                      value={contactForm.mobile}
                      onChange={(e) =>
                        setContactForm((p) => ({ ...p, mobile: e.target.value }))
                      }
                      className="h-10 text-xs font-mono"
                      required
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Office Complex Location:
                    </label>
                    <Input
                      value={contactForm.office}
                      onChange={(e) =>
                        setContactForm((p) => ({ ...p, office: e.target.value }))
                      }
                      className="h-10 text-xs"
                      required
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Published Office Hours for Investigators:
                    </label>
                    <Input
                      value={contactForm.officeHours}
                      onChange={(e) =>
                        setContactForm((p) => ({ ...p, officeHours: e.target.value }))
                      }
                      className="h-10 text-xs"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800 space-y-1">
                  <span className="text-slate-400 block font-medium">Institutional Email & Phone:</span>
                  <div className="text-slate-900 dark:text-white font-mono font-semibold">
                    admin.secretariat@diu.edu.bd
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 font-mono">
                    {contactForm.phone}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800 space-y-1">
                  <span className="text-slate-400 block font-medium">Physical Office & Consultation Hours:</span>
                  <div className="text-slate-800 dark:text-slate-200 font-medium">
                    {contactForm.office}
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 text-[11px]">
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
                <h3 className="text-base font-bold text-[#002752] dark:text-white">
                  Regulatory Delegations & Committee Jurisdiction
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Standing delegated authorities under the DIU Research Ethics Charter
                </p>
              </div>
              <Badge variant="secondary" className="bg-[#002752]/10 text-[#002752] dark:text-sky-300 font-mono text-[11px]">
                Full Delegation Active
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
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
                    <span className="font-bold text-slate-900 dark:text-white">
                      {item.board}
                    </span>
                    <span className="size-2 rounded-full bg-[#198754]" />
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    {item.role}
                  </p>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>

        {/* Right Column: Cryptographic HSM Authority & Security (1 Col on lg) */}
        <div className="space-y-6">
          {/* Cryptographic Key & Root Authority Card */}
          <DashboardCard className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <KeyRound className="size-4 text-[#198754]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#002752] dark:text-white">
                  Cryptographic Authority
                </h3>
              </div>
              <Badge className="bg-[#198754] text-white text-[10px] font-bold">
                HSM Master Valid
              </Badge>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Digital Certificate Serial:</span>
                <span className="font-mono text-xs font-bold text-slate-900 dark:text-white block mt-0.5">
                  DIU-CA-2026-X509-ROOT-001
                </span>
              </div>

              <div>
                <span className="text-slate-400 block font-medium">ECDSA Key Fingerprint (SHA-256):</span>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 mt-1 space-y-2">
                  <div className="font-mono text-[11px] font-bold text-slate-800 dark:text-slate-200 break-all leading-relaxed">
                    {publicFingerprint}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    onClick={handleCopyFingerprint}
                    className="h-7 px-2 text-[11px] font-bold gap-1 rounded border-slate-300 dark:border-slate-700 w-full"
                  >
                    {copiedKey ? (
                      <>
                        <Check className="size-3 text-emerald-600" />
                        <span className="text-emerald-600">Copied to Clipboard</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-3 text-slate-500" />
                        <span>Copy Public Fingerprint</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">HSM Hardware Security:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">FIPS 140-2 L3</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-[11px]">
                  Keys stored in tamper-evident HSM partition. Dual-custody recovery protocol enabled.
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                <span>Validity Window:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  Jan 01, 2026 – Dec 31, 2028
                </span>
              </div>
            </div>
          </DashboardCard>

          {/* Governance & Notification Preferences */}
          <DashboardCard className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#002752] dark:text-white border-b border-slate-200/80 dark:border-slate-800 pb-3">
              Secretariat Notification Dispatch
            </h3>

            <div className="space-y-3 text-xs">
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
                  key: "hsmAuditReports" as const,
                  label: "Cryptographic Certificate Audits",
                  desc: "Notification on daily SHA-256 Merkle root verification",
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
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">
                      {setting.label}
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      {setting.desc}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant={alertSettings[setting.key] ? "default" : "outline"}
                    size="xs"
                    onClick={() => toggleAlert(setting.key)}
                    className={`h-6 px-2 text-[10px] font-bold rounded shrink-0 ${
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

      {/* ── Security & Cryptographic Session Docket (Unified DataTable - Rule 6) ── */}
      <div className="w-full space-y-3">
        <DataTable<AdminSessionLog>
          data={sessionLogs}
          columns={sessionColumns}
          title="Cryptographic Access & Active Sessions Docket"
          description="Hardware-authenticated sessions authorized with HSM clearance to seal institutional ethical records"
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
    </DashboardContainer>
  )
}
