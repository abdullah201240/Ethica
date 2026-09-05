"use client"

import * as React from "react"
import Link from "next/link"
import { investigatorProfileApi } from "@/lib/api/investigator-profile.api"
import {
  Upload,
  Link as LinkIcon,
  CheckCircle2,
  Trash2,
  Camera,
  Award,
  ExternalLink,
  ShieldCheck,
  Mail,
  Phone,
  Clock,
  MapPin,
  Copy,
  Check,
  FileCheck2,
  RefreshCw,
  Image as ImageIcon,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  Globe,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import {
  DataTable,
  type ColumnDef,
  type DataTableFilter,
} from "@/components/ui/data-table"
import { DashboardContainer, DashboardCard } from "@/components/dashboard/dashboard-container"
import {
  userAvatarFileSchema,
  userAvatarUrlSchema,
  investigatorProfileSchema,
  changePasswordSchema,
  type InvestigatorProfileInput,
} from "@/lib/schemas"

// ── Curated Institutional Presets for Option 2 ──────────────────────────────
const AVATAR_PRESETS = [
  {
    id: "preset-1",
    label: "Clinical Investigator",
    role: "Physician & Lead PI",
    url: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "preset-2",
    label: "Epidemiology Faculty",
    role: "Associate Professor",
    url: "https://images.unsplash.com/photo-1594824813581-2292f72b2203?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "preset-3",
    label: "Research Scientist",
    role: "Allied Health Sciences",
    url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "preset-4",
    label: "Academic Scholar",
    role: "Bioethics Fellow",
    url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400",
  },
]

// ── Associated Protocols Docket Interface ──────────────────────────────────
interface InvestigatorProtocol {
  id: string
  title: string
  board: string
  status: "Clearance Granted" | "Under Committee Review" | "Revision Requested"
  statusColor: "emerald" | "amber" | "rose"
  riskLevel: "Minimal Risk" | "Exempt - Fast Track" | "Greater Than Minimal"
  submissionDate: string
  clearanceCertId?: string
}

const investigatorProtocols: InvestigatorProtocol[] = [
  {
    id: "ETH-2026-089",
    title: "Longitudinal AI-Assisted Clinical Biomarker Analysis in Type 2 Diabetes",
    board: "Biomedical IRB",
    status: "Under Committee Review",
    statusColor: "amber",
    riskLevel: "Minimal Risk",
    submissionDate: "Aug 28, 2026",
  },
  {
    id: "ETH-2026-074",
    title: "Cognitive Load and Decision Fatigue in Telemedicine Triage Nurses",
    board: "Social & Behavioral Board",
    status: "Clearance Granted",
    statusColor: "emerald",
    riskLevel: "Exempt - Fast Track",
    submissionDate: "Aug 14, 2026",
    clearanceCertId: "CERT-2026-DIU-074",
  },
  {
    id: "ETH-2026-061",
    title: "Anonymized Genomic Sequence Sharing Protocol for Regional Oncology Consortium",
    board: "Biomedical IRB",
    status: "Clearance Granted",
    statusColor: "emerald",
    riskLevel: "Greater Than Minimal",
    submissionDate: "Jul 19, 2026",
    clearanceCertId: "CERT-2026-DIU-061",
  },
  {
    id: "ETH-2026-042",
    title: "Digital Privacy and Consent Architecture in IoT Wearable Health Monitors",
    board: "AI & Data Ethics Board",
    status: "Revision Requested",
    statusColor: "rose",
    riskLevel: "Minimal Risk",
    submissionDate: "Jul 05, 2026",
  },
  {
    id: "ETH-2026-092",
    title: "Randomized Controlled Trial of Pediatric Cognitive Behavioral Teletherapy",
    board: "Biomedical IRB",
    status: "Under Committee Review",
    statusColor: "amber",
    riskLevel: "Minimal Risk",
    submissionDate: "Sep 01, 2026",
  },
]

// ── Default Profile State ──────────────────────────────────────────────────
const DEFAULT_PROFILE: InvestigatorProfileInput = {
  name: "Dr. Elena Rostova",
  title: "Associate Professor, Public Health & Clinical Epidemiology",
  email: "elena.rostova@diu.edu.bd",
  phone: "+880 2 9138234-5 (Ext: 312)",
  mobile: "+880 1711-223344",
  office: "Suite 408, Faculty of Allied Health Sciences, Daffodil Smart City, Ashulia",
  department: "Public Health & Clinical Epidemiology",
  institution: "Daffodil International University",
  orcidId: "0000-0002-8419-7241",
  googleScholarUrl: "https://scholar.google.com/citations?user=diu-elena-rostova",
  researchInterests:
    "Maternal & Child Health, Clinical Epidemiology, Pediatric Bioethics, AI Health Diagnostics, Field Trial Governance",
  bio: "Lead clinical investigator directing community-based maternal health trials and epidemiological surveillance. Recipient of DIU Chancellor Research Excellence Award (2025). Certified in GCP E6(R2) and institutional human subject protections under the WMA Declaration of Helsinki.",
  consultationHours: "Mon & Wed, 10:00 AM – 01:00 PM BST (Office Suite 408 or Teleconference)",
  avatarUrl: "",
}

const getInitialProfile = (): InvestigatorProfileInput => {
  return DEFAULT_PROFILE
}

export default function InvestigatorProfilePage() {
  // ── Main Profile State ───────────────────────────────────────────────────
  const [profile, setProfile] = React.useState<InvestigatorProfileInput>(getInitialProfile)
  const [isEditingProfile, setIsEditingProfile] = React.useState(false)
  const [editForm, setEditForm] = React.useState<InvestigatorProfileInput>(getInitialProfile)

  // ── Password Management State ────────────────────────────────────────────
  const [isPasswordModalOpen, setIsPasswordModalOpen] = React.useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false)
  const [showNewPassword, setShowNewPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [passwordForm, setPasswordForm] = React.useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [passwordErrors, setPasswordErrors] = React.useState<Record<string, string>>({})

  // ── Profile Picture Dialog State ─────────────────────────────────────────
  const [avatarDialogOpen, setAvatarDialogOpen] = React.useState(false)
  const [uploadOption, setUploadOption] = React.useState<"file" | "url">("file")

  // Option 1: File Upload State
  const [fileDraftUrl, setFileDraftUrl] = React.useState<string | null>(null)
  const [fileDraftMeta, setFileDraftMeta] = React.useState<{
    name: string
    sizeKb: string
    type: string
  } | null>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // Option 2: Image URL State
  const [urlInput, setUrlInput] = React.useState("")
  const [urlDraftUrl, setUrlDraftUrl] = React.useState<string | null>(null)
  const [isTestingUrl, setIsTestingUrl] = React.useState(false)
  const [urlVerified, setUrlVerified] = React.useState(false)

  // ── Sync with REST API & Custom Events ───────────────────────────────────
  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await investigatorProfileApi.get()
        if (data) {
          setProfile((prev) => ({ ...prev, ...data }))
          setEditForm((prev) => ({ ...prev, ...data }))
        }
      } catch {
        // Retain default
      }
    }

    void fetchProfile()

    const syncProfile = (e: Event) => {
      const customEvent = e as CustomEvent
      if (customEvent.detail) {
        const data = customEvent.detail
        setProfile((prev) => ({ ...prev, ...data }))
        setEditForm((prev) => ({ ...prev, ...data }))
      } else {
        void fetchProfile()
      }
    }

    window.addEventListener("ethica:investigator-profile-updated", syncProfile)

    return () => {
      window.removeEventListener("ethica:investigator-profile-updated", syncProfile)
    }
  }, [])

  // ── Save to Server REST API & Dispatch Sync Event ────────────────────────
  const persistProfile = (updated: InvestigatorProfileInput) => {
    setProfile(updated)
    setEditForm(updated)
    window.dispatchEvent(
      new CustomEvent("ethica:investigator-profile-updated", { detail: updated })
    )
    investigatorProfileApi.update(updated).catch(() => {
      // Retain optimistic state
    })
  }

  // ── Change Password Handler ─────────────────────────────────────────────
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
      description: "Your researcher account password has been safely updated.",
    })
  }

  // ── Handle Option 1: Local Device File Selection ─────────────────────────
  const processImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Invalid File Type", {
        description: "Please select an image file (.png, .jpg, .jpeg, .webp, or .gif).",
      })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File Exceeds Limit", {
        description: "Image file size must be less than 5MB.",
      })
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      const validation = userAvatarFileSchema.safeParse({
        mode: "file",
        fileData: result,
        fileName: file.name,
        fileSize: file.size,
      })

      if (!validation.success) {
        toast.error("Validation Failed", {
          description: validation.error.issues[0]?.message || "Invalid image file format.",
        })
        return
      }

      setFileDraftUrl(result)
      setFileDraftMeta({
        name: file.name,
        sizeKb: (file.size / 1024).toFixed(1) + " KB",
        type: file.type.replace("image/", "").toUpperCase(),
      })
      toast.success("Image Loaded Successfully", {
        description: `${file.name} (${(file.size / 1024).toFixed(1)} KB) ready for preview.`,
      })
    }
    reader.readAsDataURL(file)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processImageFile(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      processImageFile(file)
    }
  }

  // ── Handle Option 2: Image URL Validation & Testing ──────────────────────
  const handleVerifyUrl = (urlToTest: string) => {
    const trimmed = urlToTest.trim()
    if (!trimmed) {
      toast.error("URL Missing", { description: "Please enter an image web URL." })
      return
    }

    const validation = userAvatarUrlSchema.safeParse({
      mode: "url",
      imageUrl: trimmed,
    })

    if (!validation.success) {
      toast.error("Invalid URL", {
        description: validation.error.issues[0]?.message || "Please provide a valid HTTPS image link.",
      })
      setUrlVerified(false)
      return
    }

    setIsTestingUrl(true)
    const testImg = new window.Image()
    testImg.onload = () => {
      setIsTestingUrl(false)
      setUrlDraftUrl(trimmed)
      setUrlVerified(true)
      toast.success("Image URL Verified", {
        description: "Image successfully reached and verified for preview.",
      })
    }
    testImg.onerror = () => {
      setIsTestingUrl(false)
      setUrlVerified(false)
      toast.error("Failed to Load Image", {
        description: "The specified URL could not be resolved. Please check the link.",
      })
    }
    testImg.src = trimmed
  }

  const handleSelectPreset = (presetUrl: string, label: string) => {
    setUrlInput(presetUrl)
    handleVerifyUrl(presetUrl)
    toast.info("Preset Selected", {
      description: `Loaded preset: "${label}". Click Apply to save.`,
    })
  }

  // ── Commit & Save Selected Profile Picture ───────────────────────────────
  const handleApplyAvatar = () => {
    const chosenImage = uploadOption === "file" ? fileDraftUrl : urlDraftUrl

    if (!chosenImage) {
      toast.error("No Image Selected", {
        description:
          uploadOption === "file"
            ? "Please select or drop an image file first."
            : "Please verify and test an image web URL first.",
      })
      return
    }

    const updated = {
      ...profile,
      avatarUrl: chosenImage,
    }
    persistProfile(updated)
    setAvatarDialogOpen(false)
    toast.success("Profile Picture Updated", {
      description: "Your new institutional profile picture is now active across your workspace.",
    })
  }

  // ── Remove Profile Picture (Revert to Monogram) ──────────────────────────
  const handleRemoveAvatar = () => {
    const updated = {
      ...profile,
      avatarUrl: "",
    }
    persistProfile(updated)
    setFileDraftUrl(null)
    setFileDraftMeta(null)
    setUrlDraftUrl(null)
    setUrlInput("")
    setUrlVerified(false)
    toast.success("Profile Picture Removed", {
      description: "Reverted to default institutional monogram (ER).",
    })
  }

  // ── Handle Saving Editable Profile Info ──────────────────────────────────
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    const validation = investigatorProfileSchema.safeParse(editForm)
    if (!validation.success) {
      const firstError = Object.values(validation.error.flatten().fieldErrors)[0]?.[0]
      toast.error("Form Validation Error", {
        description: firstError || "Please check the highlighted coordinates.",
      })
      return
    }

    persistProfile(validation.data)
    setIsEditingProfile(false)
    toast.success("Investigator Profile Saved", {
      description: "Academic profile, office coordinates, and bio successfully updated.",
    })
  }

  // ── DataTable Columns for Investigator Protocols ─────────────────────────
  const protocolColumns: ColumnDef<InvestigatorProtocol>[] = React.useMemo(
    () => [
      {
        id: "id",
        accessorKey: "id",
        header: "Protocol ID",
        sortable: true,
        headerClassName: "w-32",
        cell: ({ row }) => (
          <span className="font-mono text-base font-bold text-primary dark:text-sky-300">
            {row.id}
          </span>
        ),
      },
      {
        id: "title",
        accessorKey: "title",
        header: "Protocol Title & Investigation Scope",
        sortable: true,
        cell: ({ row }) => (
          <div className="space-y-1 min-w-0">
            <span className="font-bold text-base text-slate-900 dark:text-slate-100 line-clamp-1">
              {row.title}
            </span>
            <div className="flex items-center gap-2 text-base text-muted-foreground">
              <span>{row.board}</span>
              <span>•</span>
              <span className="font-mono">{row.riskLevel}</span>
            </div>
          </div>
        ),
      },
      {
        id: "submissionDate",
        accessorKey: "submissionDate",
        header: "Submitted",
        sortable: true,
        headerClassName: "w-32",
        cell: ({ row }) => (
          <span className="text-base text-slate-600 dark:text-slate-300 font-medium">
            {row.submissionDate}
          </span>
        ),
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Ethics Status",
        sortable: true,
        headerClassName: "w-44",
        cell: ({ row }) => {
          const isClearance = row.status === "Clearance Granted"
          const isReview = row.status === "Under Committee Review"
          return (
            <Badge
              variant="outline"
              className={`text-base font-bold ${
                isClearance
                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                  : isReview
                  ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30"
                  : "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30"
              }`}
            >
              {row.status}
            </Badge>
          )
        },
      },
      {
        id: "clearanceCertId",
        accessorKey: "clearanceCertId",
        header: "Certificate",
        headerClassName: "w-32",
        cell: ({ row }) =>
          row.clearanceCertId ? (
            <span className="inline-flex items-center gap-1 font-mono text-base text-emerald-700 dark:text-emerald-400 font-semibold">
              <FileCheck2 className="size-3 shrink-0" />
              {row.clearanceCertId}
            </span>
          ) : (
            <span className="text-base text-slate-400 italic">In Deliberation</span>
          ),
      },
    ],
    []
  )

  const protocolFilters: DataTableFilter<InvestigatorProtocol>[] = React.useMemo(
    () => [
      {
        id: "status",
        title: "Clearance Status",
        accessorKey: "status",
        options: [
          { label: "Clearance Granted", value: "Clearance Granted" },
          { label: "Under Review", value: "Under Committee Review" },
          { label: "Revision Requested", value: "Revision Requested" },
        ],
      },
    ],
    []
  )

  return (
    <DashboardContainer>
      {/* ── Main Two-Column Profile & Credentials ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2-Columns: Primary Identity & Contact ─────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Identity & Profile Picture Card */}
          <DashboardCard className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-b border-border/70 pb-6">
              <div className="flex items-center gap-5">
                {/* Avatar with Status Ring and Quick Edit Trigger */}
                <div className="relative group shrink-0">
                  <div className="size-20 sm:size-24 rounded-2xl ring-4 ring-[#198754]/20 bg-gradient-to-br from-[#198754] to-[#002752] text-white flex items-center justify-center font-black text-3xl shadow-sm overflow-hidden select-none">
                    {profile.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={profile.avatarUrl}
                        alt={profile.name}
                        className="size-full object-cover"
                      />
                    ) : (
                      "ER"
                    )}
                  </div>

                  {/* Quick Photo Edit Badge */}
                  <Sheet open={avatarDialogOpen} onOpenChange={setAvatarDialogOpen}>
                    <SheetTrigger
                      render={
                        <Button
                          type="button"
                          size="icon"
                          className="absolute -bottom-1 -right-1 size-8 rounded-full bg-[#002752] hover:bg-[#003875] text-white shadow-md border-2 border-white dark:border-[#0C1E34]"
                          aria-label="Upload profile picture"
                        >
                          <Camera className="size-3.5" />
                        </Button>
                      }
                    />

                    {/* ── Profile Picture Upload Slide-over Sheet (Two Options) ──────── */}
                    <SheetContent side="right" size="default" className="p-6">
                      <SheetHeader className="p-0 pb-3">
                        <SheetTitle className="text-lg font-black text-primary dark:text-white flex items-center gap-2">
                          <ImageIcon className="size-5 text-secondary" />
                          Update Profile Picture
                        </SheetTitle>
                        <SheetDescription className="text-base text-muted-foreground">
                          Choose how you would like to set your institutional investigator photo.
                          Select between local device file upload or direct HTTPS web URL.
                        </SheetDescription>
                      </SheetHeader>

                      {/* Tabbed Two-Option Interface */}
                      <Tabs
                        value={uploadOption}
                        onValueChange={(val) => setUploadOption(val as "file" | "url")}
                        className="w-full"
                      >
                        <TabsList className="grid grid-cols-2 w-full h-10 p-1 bg-muted rounded-lg">
                          <TabsTrigger
                            value="file"
                            className="text-base font-bold gap-1.5 data-[active=true]:bg-white dark:data-[active=true]:bg-[#0C1E34] data-[active=true]:text-primary dark:data-[active=true]:text-white"
                          >
                            <Upload className="size-3.5" />
                            Option 1: Upload from Device
                          </TabsTrigger>
                          <TabsTrigger
                            value="url"
                            className="text-base font-bold gap-1.5 data-[active=true]:bg-white dark:data-[active=true]:bg-[#0C1E34] data-[active=true]:text-primary dark:data-[active=true]:text-white"
                          >
                            <LinkIcon className="size-3.5" />
                            Option 2: Web Image URL
                          </TabsTrigger>
                        </TabsList>

                        {/* ── OPTION 1: DEVICE FILE UPLOAD ─────────────────── */}
                        <TabsContent value="file" className="space-y-4 pt-4">
                          <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`rounded-xl border-2 border-dashed p-6 text-center transition-all flex flex-col items-center justify-center gap-3 ${
                              isDragging
                                ? "border-[#198754] bg-[#198754]/5 scale-[1.01]"
                                : "border-border/80 bg-muted/30 hover:bg-muted/50"
                            }`}
                          >
                            <div className="size-12 rounded-full bg-[#198754]/10 text-secondary flex items-center justify-center">
                              <Upload className="size-6" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-base font-bold text-foreground">
                                Drag & drop your photo here, or browse files
                              </p>
                              <p className="text-base text-muted-foreground">
                                Supports PNG, JPG, JPEG, WEBP, or GIF up to 5MB
                              </p>
                            </div>

                            {/* Hidden Base UI Input triggered by Button */}
                            <Input
                              ref={fileInputRef}
                              type="file"
                              accept="image/png,image/jpeg,image/webp,image/gif"
                              onChange={handleFileInputChange}
                              className="sr-only"
                              id="avatar-file-input"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => fileInputRef.current?.click()}
                              className="h-8 px-4 text-base font-bold rounded-md border-border/85 hover:bg-muted"
                            >
                              Browse Computer
                            </Button>
                          </div>

                          {/* File Draft Info & Preview */}
                          {fileDraftMeta && fileDraftUrl && (
                            <div className="p-3 rounded-lg border border-border/75 bg-muted/40 flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="size-10 rounded-lg overflow-hidden shrink-0 border border-border/75">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={fileDraftUrl}
                                    alt="Selected File"
                                    className="size-full object-cover"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-base font-bold text-foreground truncate">
                                    {fileDraftMeta.name}
                                  </p>
                                  <p className="text-base text-muted-foreground font-mono">
                                    {fileDraftMeta.type} • {fileDraftMeta.sizeKb}
                                  </p>
                                </div>
                              </div>
                              <Badge
                                variant="outline"
                                className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-base shrink-0"
                              >
                                Ready
                              </Badge>
                            </div>
                          )}
                        </TabsContent>

                        {/* ── OPTION 2: DIRECT IMAGE URL & PRESETS ─────────── */}
                        <TabsContent value="url" className="space-y-4 pt-4">
                          <div className="space-y-2">
                            <label className="text-base font-bold text-foreground flex items-center justify-between">
                              <span>Direct HTTPS Image Web Address:</span>
                              {urlVerified && (
                                <span className="text-base text-emerald-600 font-bold flex items-center gap-1">
                                  <CheckCircle2 className="size-3" />
                                  Link Verified
                                </span>
                              )}
                            </label>
                            <div className="flex items-center gap-2">
                              <Input
                                value={urlInput}
                                onChange={(e) => {
                                  setUrlInput(e.target.value)
                                  setUrlVerified(false)
                                }}
                                placeholder="https://images.example.com/dr-elena-headshot.jpg"
                                className="h-9 text-base font-mono"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={isTestingUrl || !urlInput.trim()}
                                onClick={() => handleVerifyUrl(urlInput)}
                                className="h-9 px-3 text-base font-bold shrink-0 rounded-md"
                              >
                                {isTestingUrl ? (
                                  <RefreshCw className="size-3.5 animate-spin" />
                                ) : (
                                  "Test & Verify"
                                )}
                              </Button>
                            </div>
                          </div>

                          {/* Quick Select Institutional Presets */}
                          <div className="space-y-2">
                            <span className="text-base font-bold text-muted-foreground block uppercase tracking-wider">
                              Or Choose Curated Institutional Headshots:
                            </span>
                            <div className="grid grid-cols-2 gap-2">
                              {AVATAR_PRESETS.map((preset) => (
                                <Button
                                  key={preset.id}
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSelectPreset(preset.url, preset.label)}
                                  className="h-auto p-2 justify-start items-center gap-2 rounded-lg border-border/75 hover:border-[#198754]/50"
                                >
                                  <div className="size-8 rounded-full overflow-hidden shrink-0 border border-border/60">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={preset.url}
                                      alt={preset.label}
                                      className="size-full object-cover"
                                    />
                                  </div>
                                  <div className="text-left leading-tight min-w-0">
                                    <span className="text-base font-bold text-foreground block truncate">
                                      {preset.label}
                                    </span>
                                    <span className="text-base text-muted-foreground block truncate">
                                      {preset.role}
                                    </span>
                                  </div>
                                </Button>
                              ))}
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>

                      {/* ── Real-Time Multi-Size Preview Arena ────────────── */}
                      {(fileDraftUrl || urlDraftUrl) && (
                        <div className="p-3.5 rounded-xl bg-muted/30 border border-border/70 space-y-2">
                          <span className="text-base font-bold text-muted-foreground block uppercase tracking-wider">
                            Live Multi-Viewport Preview:
                          </span>
                          <div className="flex items-center justify-around gap-4 pt-1">
                            {/* Card Hero Preview */}
                            <div className="flex flex-col items-center gap-1">
                              <div className="size-16 rounded-xl ring-2 ring-[#198754] overflow-hidden shadow-xs">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={
                                    uploadOption === "file"
                                      ? fileDraftUrl || ""
                                      : urlDraftUrl || ""
                                  }
                                  alt="Preview"
                                  className="size-full object-cover"
                                />
                              </div>
                              <span className="text-base text-muted-foreground font-medium">
                                Profile Card (64px)
                              </span>
                            </div>

                            {/* Navbar Pill Preview */}
                            <div className="flex flex-col items-center gap-1">
                              <div className="size-8 rounded-full ring-2 ring-[#002752] overflow-hidden shadow-xs">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={
                                    uploadOption === "file"
                                      ? fileDraftUrl || ""
                                      : urlDraftUrl || ""
                                  }
                                  alt="Preview"
                                  className="size-full object-cover"
                                />
                              </div>
                              <span className="text-base text-muted-foreground font-medium">
                                Navbar Pill (32px)
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      <SheetFooter className="p-0 pt-3 flex flex-row items-center justify-between sm:justify-between gap-2 border-t border-border/70">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setAvatarDialogOpen(false)}
                          className="h-9 px-3 text-base font-semibold"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          onClick={handleApplyAvatar}
                          disabled={
                            uploadOption === "file"
                              ? !fileDraftUrl
                              : !urlDraftUrl || !urlVerified
                          }
                          className="h-9 px-4 text-base font-bold bg-[#002752] hover:bg-[#003875] text-white rounded-md"
                        >
                          Apply Profile Picture
                        </Button>
                      </SheetFooter>
                    </SheetContent>
                  </Sheet>
                </div>

                {/* Name, Credentials, and Badges */}
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-black text-primary dark:text-white tracking-tight">
                      {profile.name}
                    </h1>
                    <Badge
                      variant="outline"
                      className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-base font-bold"
                    >
                      Verified PI
                    </Badge>
                  </div>
                  <p className="text-base sm:text-base font-semibold text-muted-foreground mt-0.5">
                    {profile.title}
                  </p>
                  <p className="text-base text-muted-foreground mt-1 flex flex-wrap items-center gap-2">
                    <span>{profile.institution}</span>
                    <span>•</span>
                    <span className="font-mono font-bold text-foreground">
                      ID: USR-INV-002
                    </span>
                  </p>
                </div>
              </div>

              {/* Photo Actions & Contact Toggle */}
              <div className="flex items-center gap-2 shrink-0">
                {profile.avatarUrl && (
                  <AlertDialog>
                    <AlertDialogTrigger
                      render={
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-9 px-3 text-base font-semibold text-rose-600 border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-md"
                        >
                          <Trash2 className="size-3.5 mr-1.5" />
                          Remove Photo
                        </Button>
                      }
                    />
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-base font-bold text-rose-600">
                          Revert to Institutional Monogram?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-base text-muted-foreground">
                          Removing your profile picture will reset your avatar to the default
                          initials &quot;ER&quot; in the header and investigator roster.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="text-base font-semibold">
                          Keep Photo
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleRemoveAvatar}
                          className="bg-rose-600 hover:bg-rose-700 text-white text-base font-bold"
                        >
                          Remove Photo
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}

                <Button
                  type="button"
                  variant={isEditingProfile ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="h-9 px-3.5 text-base font-bold rounded-md border-border/90"
                >
                  {isEditingProfile ? "Cancel Editing" : "Edit Profile Info"}
                </Button>
              </div>
            </div>

            {/* Academic Badges & Research Affiliations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-base">
              <div className="p-3.5 rounded-xl bg-muted/40 border border-border/70 space-y-1">
                <span className="text-muted-foreground block font-medium">Faculty & Department:</span>
                <strong className="text-foreground font-bold block text-base">
                  {profile.department}
                </strong>
                <span className="text-muted-foreground block">
                  Faculty of Allied Health Sciences • Campus Complex
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-muted/40 border border-border/70 space-y-1">
                <span className="text-muted-foreground block font-medium">Research Identifiers:</span>
                <div className="flex items-center gap-2 pt-0.5">
                  <span className="font-mono text-base font-bold text-foreground">
                    ORCID: {profile.orcidId}
                  </span>
                  <Link
                    href={`https://orcid.org/${profile.orcidId}`}
                    target="_blank"
                    className="text-emerald-600 hover:underline flex items-center gap-0.5 text-base font-semibold"
                  >
                    Verify <ExternalLink className="size-2.5" />
                  </Link>
                </div>
                <span className="text-muted-foreground block text-base">
                  Google Scholar: Verified Institutional Profile
                </span>
              </div>
            </div>

            {/* Editable or Display Profile Form */}
            {isEditingProfile ? (
              <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-base font-bold text-foreground">Full Name:</label>
                    <Input
                      value={editForm.name}
                      onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                      className="h-9 text-base"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-base font-bold text-foreground">Academic Title & Rank:</label>
                    <Input
                      value={editForm.title}
                      onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))}
                      className="h-9 text-base"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-base font-bold text-foreground">Office Direct Phone:</label>
                    <Input
                      value={editForm.phone}
                      onChange={(e) => setEditForm((p) => ({ ...p, phone: e.target.value }))}
                      className="h-9 text-base font-mono"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-base font-bold text-foreground">Mobile Phone:</label>
                    <Input
                      value={editForm.mobile}
                      onChange={(e) => setEditForm((p) => ({ ...p, mobile: e.target.value }))}
                      className="h-9 text-base font-mono"
                      required
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-base font-bold text-foreground">Campus Office Location:</label>
                    <Input
                      value={editForm.office}
                      onChange={(e) => setEditForm((p) => ({ ...p, office: e.target.value }))}
                      className="h-9 text-base"
                      required
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-base font-bold text-foreground">Office Consultation Hours:</label>
                    <Input
                      value={editForm.consultationHours}
                      onChange={(e) =>
                        setEditForm((p) => ({ ...p, consultationHours: e.target.value }))
                      }
                      className="h-9 text-base"
                      required
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-base font-bold text-foreground">Research Interests:</label>
                    <Input
                      value={editForm.researchInterests}
                      onChange={(e) =>
                        setEditForm((p) => ({ ...p, researchInterests: e.target.value }))
                      }
                      className="h-9 text-base"
                      required
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-base font-bold text-foreground">Academic Biography:</label>
                    <Textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm((p) => ({ ...p, bio: e.target.value }))}
                      className="min-h-24 text-base"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingProfile(false)}
                    className="h-9 text-base"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="h-9 px-4 text-base font-bold bg-[#002752] hover:bg-[#003875] text-white rounded-md"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 pt-1">
                {/* Contact Coordinates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-base">
                  <div className="flex items-center gap-2.5 p-3 rounded-lg border border-border/70 bg-muted/20">
                    <Mail className="size-4 text-slate-400 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-muted-foreground block text-base">Official Email</span>
                      <span className="font-semibold text-foreground truncate block font-mono">
                        {profile.email}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-3 rounded-lg border border-border/70 bg-muted/20">
                    <Phone className="size-4 text-slate-400 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-muted-foreground block text-base">Office Phone</span>
                      <span className="font-semibold text-foreground truncate block font-mono">
                        {profile.phone}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-3 rounded-lg border border-border/70 bg-muted/20">
                    <MapPin className="size-4 text-slate-400 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-muted-foreground block text-base">Campus Office</span>
                      <span className="font-semibold text-foreground truncate block">
                        {profile.office}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-3 rounded-lg border border-border/70 bg-muted/20">
                    <Clock className="size-4 text-slate-400 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-muted-foreground block text-base">Office Consultation</span>
                      <span className="font-semibold text-foreground truncate block">
                        {profile.consultationHours}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Research Interests Tags */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-base font-bold text-foreground block">
                    Research Domains & Specializations:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.researchInterests.split(",").map((interest, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="text-base font-semibold bg-muted text-foreground border border-border/70 px-2.5 py-0.5"
                      >
                        {interest.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Narrative Bio */}
                <div className="p-4 rounded-xl border border-border/75 bg-muted/30 text-base leading-relaxed text-muted-foreground">
                  <p className="font-medium text-foreground">{profile.bio}</p>
                </div>
              </div>
            )}
          </DashboardCard>
        </div>

        {/* Right 1-Column: Accreditations & Account Security ───────────── */}
        <div className="space-y-6">
          {/* Institutional Ethics Accreditations */}
          <DashboardCard className="space-y-4">
            <h3 className="text-base font-bold text-primary dark:text-white flex items-center gap-2">
              <Award className="size-4 text-accent" />
              Ethics Certifications & Training
            </h3>

            <div className="space-y-3 text-base">
              <div className="p-3 rounded-lg border border-border/75 bg-muted/30 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">CITI Bioethics & IRB Training</span>
                  <Badge variant="outline" className="text-base text-emerald-700 dark:text-emerald-400 border-emerald-500/30">
                    Active
                  </Badge>
                </div>
                <p className="text-muted-foreground text-base">
                  Credential #CITI-2025-9921 • Valid thru Dec 2027
                </p>
              </div>

              <div className="p-3 rounded-lg border border-border/75 bg-muted/30 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">Good Clinical Practice (GCP E6-R2)</span>
                  <Badge variant="outline" className="text-base text-emerald-700 dark:text-emerald-400 border-emerald-500/30">
                    Accredited
                  </Badge>
                </div>
                <p className="text-muted-foreground text-base">
                  International Council for Harmonisation (ICH) Standard
                </p>
              </div>

              <div className="p-3 rounded-lg border border-border/75 bg-muted/30 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">Declaration of Helsinki Compliance</span>
                  <Badge variant="outline" className="text-base text-emerald-700 dark:text-emerald-400 border-emerald-500/30">
                    Verified
                  </Badge>
                </div>
                <p className="text-muted-foreground text-base">
                  Human subjects ethics charter binding agreement on file
                </p>
              </div>
            </div>
          </DashboardCard>

          {/* Account Security & Sign-in */}
          <DashboardCard className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/75 pb-3">
              <h3 className="text-base font-bold text-primary dark:text-white flex items-center gap-2">
                <ShieldCheck className="size-4 text-secondary" />
                Account Security & Sign-in
              </h3>
              <Badge className="bg-[#198754] text-white text-xs font-bold">
                Active
              </Badge>
            </div>

            <div className="space-y-3 text-base">
              {/* Password Setting */}
              <div className="p-3.5 rounded-xl bg-muted/40 border border-border/75 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-muted-foreground block font-medium text-xs">Account Password</span>
                    <span className="font-mono text-sm font-bold text-foreground block">
                      ••••••••••••••••
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="h-7 px-2.5 text-xs font-bold rounded gap-1"
                  >
                    <Lock className="size-3" />
                    <span>Change Password</span>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Last updated 60 days ago. Keep your account secure with a strong password.
                </p>
              </div>

              {/* Two-Factor Authentication */}
              <div className="p-3 rounded-lg border border-border/75 bg-muted/30 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <KeyRound className="size-3.5 text-emerald-600" />
                    <span className="font-bold text-foreground text-sm">Two-Factor Auth (2FA)</span>
                  </div>
                  <Badge variant="outline" className="text-xs text-emerald-700 dark:text-emerald-400 border-emerald-500/30">
                    Enabled
                  </Badge>
                </div>
                <p className="text-muted-foreground text-xs">
                  DIU Authenticator / TOTP verification enabled on login.
                </p>
              </div>

              {/* Institutional Single Sign-On */}
              <div className="p-3 rounded-lg border border-border/75 bg-muted/30 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Globe className="size-3.5 text-primary dark:text-sky-400" />
                    <span className="font-bold text-foreground text-sm">Institutional SSO</span>
                  </div>
                  <Badge variant="outline" className="text-xs text-primary dark:text-sky-300 border-primary/20">
                    Connected
                  </Badge>
                </div>
                <p className="text-muted-foreground text-xs">
                  Linked to your DIU Google Workspace account ({profile.email}).
                </p>
              </div>
            </div>
          </DashboardCard>
        </div>
      </div>

      {/* ── Investigator Protocol Portfolio Docket (Centralized DataTable) ── */}
      <div className="space-y-4">
        <DataTable
          data={investigatorProtocols}
          columns={protocolColumns}
          filters={protocolFilters}
          searchKeys={["title", "id", "board"]}
          searchPlaceholder="Search investigator protocols by ID, title, or board..."
          title="Investigator Protocol Portfolio"
          initialPageSize={5}
        />
      </div>

      {/* ── Change Password Slide-over Sheet ──────────────────────────────── */}
      <Sheet open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <SheetContent side="right" size="default" className="p-6">
          <SheetHeader className="p-0 pb-4 border-b border-border/75">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-primary/10 dark:bg-sky-500/10 text-primary dark:text-sky-300 flex items-center justify-center">
                <Lock className="size-4" />
              </div>
              <div>
                <SheetTitle className="text-lg font-bold text-primary dark:text-white">
                  Change Account Password
                </SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground mt-0.5">
                  Update your credentials for the Ethica Researcher Portal.
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <form onSubmit={handleChangePassword} className="space-y-4 py-4" noValidate>
            {/* Current Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
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
                  className="absolute right-1 top-1 h-7 w-7 text-muted-foreground hover:text-foreground"
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
              <label className="text-xs font-bold text-foreground">
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
                  className="absolute right-1 top-1 h-7 w-7 text-muted-foreground hover:text-foreground"
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
              <label className="text-xs font-bold text-foreground">
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
                  className="absolute right-1 top-1 h-7 w-7 text-muted-foreground hover:text-foreground"
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

            {/* Requirements list */}
            <div className="p-3 rounded-lg bg-muted/40 border border-border/75 space-y-1.5 text-xs text-muted-foreground">
              <span className="font-bold text-foreground block">Password Requirements:</span>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className={`size-3.5 ${passwordForm.newPassword.length >= 8 ? "text-emerald-600" : "text-muted-foreground"}`} />
                <span>At least 8 characters long</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className={`size-3.5 ${/[A-Z]/.test(passwordForm.newPassword) ? "text-emerald-600" : "text-muted-foreground"}`} />
                <span>At least one uppercase letter (A-Z)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className={`size-3.5 ${/[0-9]/.test(passwordForm.newPassword) ? "text-emerald-600" : "text-muted-foreground"}`} />
                <span>At least one numerical digit (0-9)</span>
              </div>
            </div>

            <SheetFooter className="p-0 pt-4 flex flex-row items-center justify-end gap-2 border-t border-border/75">
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
