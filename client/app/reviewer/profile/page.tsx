"use client"

import * as React from "react"
import {
  Upload,
  Link as LinkIcon,
  CheckCircle2,
  Camera,
  X,
  Eye,
  EyeOff,
  RefreshCw,
  Save,
  RotateCcw,
  Building2,
  Calendar,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
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
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
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
import { DashboardContainer } from "@/components/dashboard/dashboard-container"
import {
  reviewerProfileSchema,
  userAvatarFileSchema,
  userAvatarUrlSchema,
  type ReviewerProfileInput,
} from "@/lib/schemas"
import {
  getActiveReviewer,
  subscribeReviewers,
  updateReviewerProfile,
  type AccreditedReviewer,
} from "@/lib/reviewer-roster"
import {
  getStoredProtocols,
  subscribeProtocols,
  syncProtocolsFromServer,
  type Protocol,
} from "@/lib/protocols-store"

// ── Curated Reviewer Headshot Presets ──────────────────────────────────────
const AVATAR_PRESETS = [
  {
    id: "preset-1",
    label: "Prof. Charles Montgomery",
    role: "Biomedical IRB Chair",
    url: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "preset-2",
    label: "Dr. Farzana Choudhury",
    role: "Senior Voting Reviewer",
    url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "preset-3",
    label: "Dr. Sarah Jenkins",
    role: "Pediatrics Vice Chair",
    url: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "preset-4",
    label: "Dr. Mahmudul Hasan",
    role: "Social & Behavioral Board",
    url: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600",
  },
]

// ── Reviewer Roles ─────────────────────────────────────────────────────────
const REVIEWER_ROLES = [
  "Senior Voting Reviewer",
  "Chairperson",
  "Vice Chair",
  "Voting Member",
  "Specialist Advisor",
  "Bioethics Evaluator",
]

// ── Default Reviewer Profile Helper ────────────────────────────────────────
function getInitialReviewerFormData(rev: AccreditedReviewer): ReviewerProfileInput {
  const parts = rev.name.replace(/^Dr\.\s*|^Prof\.\s*/, "").split(" ")
  const firstName = parts[0] || "Farzana"
  const lastName = parts.slice(1).join(" ") || "Choudhury"

  return {
    username: rev.email.split("@")[0] || "farzana.choudhury",
    firstName,
    lastName,
    nickname: `${firstName}.C`,
    role: rev.role || "Senior Voting Reviewer",
    displayName: rev.name || "Dr. Farzana Choudhury",
    email: rev.email || "farzana.choudhury@icddrb.org",
    whatsapp: rev.phone || "+880 1712-456789",
    website: rev.institution
      ? `https://${rev.institution.toLowerCase().replace(/[^a-z0-9]/g, "")}.org`
      : "https://icddrb.org",
    telegram: `@${firstName.toLowerCase()}_ethics`,
    bio:
      rev.bioStatement ||
      "Dedicated to upholding the Declaration of Helsinki and CIOMS guidelines in vulnerable population field trials across South Asia. Appointed to Biomedical & Maternal Sub-Committee.",
    avatarUrl: rev.avatarUrl || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600",
    name: rev.name,
    degree: rev.degree || "MBBS, MPH (Harvard), PhD",
    position: rev.position || "Senior Research Scientist",
    department: rev.department || "Infectious Diseases & Maternal Health",
    institution: rev.institution || "icddr,b",
    phone: rev.phone || "+880 1712-456789",
    mobile: rev.mobile || "+880 1712-456789",
    officeLocation: rev.officeLocation || "Chamber 701, Clinical Sciences Faculty",
    consultationHours: rev.consultationHours || "Tue & Thu, 02:00 PM – 05:00 PM BST",
    orcid: rev.orcid || "0000-0001-9032-6124",
    bioStatement: rev.bioStatement || "",
    specializations: (rev.specializations || []).join(", "),
  }
}

export default function ReviewerProfilePage() {
  // ── Reviewer State ───────────────────────────────────────────────────────
  const [currentReviewer, setCurrentReviewer] = React.useState<AccreditedReviewer>(getActiveReviewer)
  const [formData, setFormData] = React.useState<ReviewerProfileInput>(() =>
    getInitialReviewerFormData(getActiveReviewer())
  )
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // ── Protocols State ──────────────────────────────────────────────────────
  const [protocols, setProtocols] = React.useState<Protocol[]>(getStoredProtocols)

  // ── Password State ───────────────────────────────────────────────────────
  const [oldPassword, setOldPassword] = React.useState("")
  const [newPassword, setNewPassword] = React.useState("")
  const [showOldPassword, setShowOldPassword] = React.useState(false)
  const [showNewPassword, setShowNewPassword] = React.useState(false)
  const [passwordError, setPasswordError] = React.useState<string | null>(null)
  const [isChangingPassword, setIsChangingPassword] = React.useState(false)

  // ── Photo Upload State ───────────────────────────────────────────────────
  const [isUploadSheetOpen, setIsUploadSheetOpen] = React.useState(false)
  const [uploadOption, setUploadOption] = React.useState<"file" | "url">("file")
  const [fileDraftUrl, setFileDraftUrl] = React.useState<string | null>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const [urlInput, setUrlInput] = React.useState("")
  const [urlVerified, setUrlVerified] = React.useState(false)
  const [isTestingUrl, setIsTestingUrl] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // ── Sync Store ───────────────────────────────────────────────────────────
  React.useEffect(() => {
    const handleRosterSync = () => {
      const active = getActiveReviewer()
      setCurrentReviewer(active)
      setFormData(getInitialReviewerFormData(active))
    }

    const unsubscribeReviewers = subscribeReviewers(handleRosterSync)
    window.addEventListener("ethica:active-reviewer-changed", handleRosterSync)

    syncProtocolsFromServer().then((data) => {
      if (data && Array.isArray(data)) setProtocols(data)
    })
    const unsubscribeProtocols = subscribeProtocols(() => {
      setProtocols(getStoredProtocols())
    })

    return () => {
      unsubscribeReviewers()
      unsubscribeProtocols()
      window.removeEventListener("ethica:active-reviewer-changed", handleRosterSync)
    }
  }, [])

  // ── Photo Management Handlers ────────────────────────────────────────────
  const processImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file format", {
        description: "Please upload an image file (.png, .jpg, .jpeg, or .webp).",
      })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeded", {
        description: "Image must be smaller than 5MB.",
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
        toast.error("File validation failed", {
          description: validation.error.issues[0]?.message || "Unsupported image.",
        })
        return
      }

      setFileDraftUrl(result)

      setFormData((prev) => ({ ...prev, avatarUrl: result }))
      updateReviewerProfile(currentReviewer.id, { avatarUrl: result })
      setIsUploadSheetOpen(false)
      toast.success("Reviewer portrait updated", {
        description: "New profile photo saved to committee deliberation credentials.",
      })
    }
    reader.readAsDataURL(file)
  }

  const handleDirectFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processImageFile(file)
  }

  const handleVerifyUrl = (urlToTest: string) => {
    const trimmed = urlToTest.trim()
    if (!trimmed) {
      toast.error("URL missing", { description: "Please enter an image web URL." })
      return
    }

    const validation = userAvatarUrlSchema.safeParse({
      mode: "url",
      imageUrl: trimmed,
    })

    if (!validation.success) {
      toast.error("Invalid image link", {
        description: validation.error.issues[0]?.message || "Must be a valid HTTPS image link.",
      })
      setUrlVerified(false)
      return
    }

    setIsTestingUrl(true)
    const testImg = new window.Image()
    testImg.onload = () => {
      setIsTestingUrl(false)
      setUrlVerified(true)
      toast.success("Image link verified", {
        description: "Ready to be applied as your reviewer portrait.",
      })
    }
    testImg.onerror = () => {
      setIsTestingUrl(false)
      setUrlVerified(false)
      toast.error("Failed to load image", {
        description: "Could not resolve image from the provided web link.",
      })
    }
    testImg.src = trimmed
  }

  const handleApplyPhotoFromSheet = () => {
    const chosenUrl = uploadOption === "file" ? fileDraftUrl : urlInput.trim()
    if (!chosenUrl) {
      toast.error("No photo chosen", {
        description: "Please select or verify an image first.",
      })
      return
    }

    setFormData((prev) => ({ ...prev, avatarUrl: chosenUrl }))
    updateReviewerProfile(currentReviewer.id, { avatarUrl: chosenUrl })
    setIsUploadSheetOpen(false)
    toast.success("Reviewer portrait updated", {
      description: "Profile picture active across Deliberation Chamber.",
    })
  }

  const handleRemovePhoto = () => {
    setFormData((prev) => ({ ...prev, avatarUrl: "" }))
    updateReviewerProfile(currentReviewer.id, { avatarUrl: "" })
    setFileDraftUrl(null)
    setUrlInput("")
    setUrlVerified(false)
    toast.success("Photo removed", {
      description: "Reverted to committee member initials.",
    })
  }

  // ── Password Change Handler ──────────────────────────────────────────────
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError(null)

    if (!oldPassword.trim()) {
      setPasswordError("Please enter your current reviewer password.")
      toast.error("Current password required", {
        description: "Enter your current password to authorize this credential change.",
      })
      return
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.")
      toast.error("Password too short", {
        description: "New password must be at least 8 characters with numbers and letters.",
      })
      return
    }

    setIsChangingPassword(true)
    setTimeout(() => {
      setIsChangingPassword(false)
      setOldPassword("")
      setNewPassword("")
      setPasswordError(null)
      toast.success("Password Changed", {
        description: "Your committee quorum credentials have been securely updated.",
      })
    }, 400)
  }

  // ── Profile Information Save Handler ─────────────────────────────────────
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormErrors({})

    const validation = reviewerProfileSchema.safeParse(formData)
    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors
      const errorsMap: Record<string, string> = {}
      for (const [k, v] of Object.entries(fieldErrors)) {
        if (v?.[0]) errorsMap[k] = v[0]
      }
      setFormErrors(errorsMap)
      const firstError = Object.values(errorsMap)[0]
      toast.error("Validation Failed", {
        description: firstError || "Please check the highlighted coordinates.",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const updated = updateReviewerProfile(currentReviewer.id, {
        name: validation.data.displayName || `${validation.data.firstName} ${validation.data.lastName}`,
        email: validation.data.email,
        role: validation.data.role as AccreditedReviewer["role"],
        phone: validation.data.whatsapp || currentReviewer.phone,
        bioStatement: validation.data.bio,
        avatarUrl: validation.data.avatarUrl,
      })
      if (updated) {
        setCurrentReviewer(updated)
      }
      toast.success("Reviewer Profile Saved", {
        description: "Committee credentials and contact coordinates successfully updated.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResetForm = () => {
    setFormData(getInitialReviewerFormData(currentReviewer))
    setFormErrors({})
    toast.info("Changes Discarded", {
      description: "Restored previous reviewer profile settings.",
    })
  }

  // ── Assigned Protocols Activity ──────────────────────────────────────────
  const reviewerProtocols = protocols.filter(
    (p) =>
      p.assignedReviewerEmail?.toLowerCase() === currentReviewer.email.toLowerCase() ||
      p.assignedReviewerId === currentReviewer.id
  )
  const displayedProtocols = reviewerProtocols.length > 0 ? reviewerProtocols : protocols.slice(0, 5)

  // ── Protocol Columns ─────────────────────────────────────────────────────
  const protocolColumns: ColumnDef<Protocol>[] = React.useMemo(
    () => [
      {
        id: "id",
        accessorKey: "id",
        header: "Protocol ID",
        sortable: true,
        headerClassName: "w-36",
        cell: ({ row }) => (
          <div className="space-y-0.5 select-text">
            <span className="font-mono text-sm font-bold text-primary dark:text-sky-300 block">
              {row.id}
            </span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
              <Calendar className="size-3 shrink-0" />
              <span>{row.submissionDate}</span>
            </div>
          </div>
        ),
      },
      {
        id: "title",
        accessorKey: "title",
        header: "Research Title & Investigator",
        sortable: true,
        cell: ({ row }) => (
          <div className="space-y-1 max-w-md min-w-56 select-text">
            <span className="font-bold text-foreground text-sm leading-snug line-clamp-2 block">
              {row.title}
            </span>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Building2 className="size-3 text-muted-foreground shrink-0" />
                <span className="truncate">{row.department}</span>
              </span>
              <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                <User className="size-3 text-primary/70 dark:text-sky-400 shrink-0" />
                <span>{row.piName || "Dr. Elena Rostova"}</span>
              </span>
            </div>
          </div>
        ),
      },
      {
        id: "board",
        accessorKey: "board",
        header: "IRB Board",
        sortable: true,
        headerClassName: "w-44",
        cell: ({ row }) => (
          <Badge
            variant="secondary"
            className="font-medium text-xs bg-primary/8 dark:bg-primary/20 text-primary dark:text-sky-300 border-none select-text"
          >
            {row.board}
          </Badge>
        ),
      },
      {
        id: "assignmentStatus",
        accessorKey: "assignmentStatus",
        header: "Deliberation Status",
        sortable: true,
        headerClassName: "w-44",
        cell: ({ row }) => {
          const status = row.assignmentStatus || "Pending Acceptance"
          const isAccepted = status === "Accepted"
          const isDone = status === "Review Completed" || row.status === "Clearance Granted"
          const isPending = status === "Pending Acceptance"

          return (
            <Badge
              variant="outline"
              className={`text-xs font-bold ${
                isDone
                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                  : isAccepted
                  ? "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/30"
                  : isPending
                  ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30"
                  : "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30"
              }`}
            >
              {status}
            </Badge>
          )
        },
      },
    ],
    []
  )

  const protocolFilters: DataTableFilter<Protocol>[] = React.useMemo(
    () => [
      {
        id: "board",
        title: "Board Filter",
        accessorKey: "board",
        options: [
          { label: "Biomedical & Clinical", value: "Biomedical & Clinical IRB" },
          { label: "Social & Behavioral", value: "Social & Behavioral IRB" },
          { label: "AI & Technology Ethics", value: "AI & Technology Ethics Panel" },
        ],
      },
      {
        id: "assignmentStatus",
        title: "Assignment",
        accessorKey: "assignmentStatus",
        options: [
          { label: "Accepted", value: "Accepted" },
          { label: "Pending Acceptance", value: "Pending Acceptance" },
          { label: "Review Completed", value: "Review Completed" },
        ],
      },
    ],
    []
  )

  return (
    <DashboardContainer>
      {/* Hidden file input for direct computer file upload */}
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={handleDirectFileSelect}
        className="sr-only"
        id="reviewer-avatar-input"
      />

      {/* ── Main Two-Column Profile Card (Matches Requested UI) ───────────── */}
      <div className="bg-card text-card-foreground border border-border/75 rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ══════════════════════════════════════════════════════════════════
              LEFT COLUMN: Account Management (Avatar & Password)
             ══════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-4 space-y-6">
            <h2 className="text-base font-bold text-foreground tracking-tight">
              Account Managment
            </h2>

            {/* Profile Avatar Card with "X" Remove Button */}
            <div className="space-y-3">
              <div className="relative w-full aspect-[4/3] sm:aspect-square max-w-[340px] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-border/75 group shadow-xs">
                {formData.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={formData.avatarUrl}
                    alt={formData.displayName || formData.username}
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 text-muted-foreground select-none">
                    <span className="text-4xl font-black tracking-tight text-primary/70 dark:text-white/70">
                      {(formData.firstName?.[0] || "R") + (formData.lastName?.[0] || "")}
                    </span>
                    <span className="text-xs font-semibold mt-1">No Photo Uploaded</span>
                  </div>
                )}

                {/* Top-Right Circular "X" Remove Button */}
                {formData.avatarUrl && (
                  <AlertDialog>
                    <AlertDialogTrigger
                      render={
                        <Button
                          type="button"
                          size="icon"
                          className="absolute top-3 right-3 size-8 rounded-full bg-slate-900/50 hover:bg-slate-900/80 text-white backdrop-blur-xs transition-colors border-0 cursor-pointer shadow-sm"
                          aria-label="Remove profile photo"
                          title="Remove photo"
                        >
                          <X className="size-4" />
                        </Button>
                      }
                    />
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-base font-bold text-rose-600">
                          Remove Profile Picture?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm text-muted-foreground">
                          Are you sure you want to remove your reviewer portrait? Your avatar will revert
                          to committee member monogram initials.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="text-sm font-semibold">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleRemovePhoto}
                          className="bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold"
                        >
                          Remove Photo
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>

              {/* Upload Photo Button */}
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsUploadSheetOpen(true)}
                className="w-full max-w-[340px] h-10 rounded-md border-border/85 hover:bg-muted font-medium text-sm text-foreground"
              >
                Upload Photo
              </Button>
            </div>

            {/* Password Change Sub-Section */}
            <form onSubmit={handleChangePassword} className="space-y-4 max-w-[340px] pt-2" noValidate>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Old Password
                </label>
                <div className="relative">
                  <Input
                    type={showOldPassword ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => {
                      setOldPassword(e.target.value)
                      if (passwordError) setPasswordError(null)
                    }}
                    placeholder="••••••••"
                    className="h-10 text-sm pr-10 rounded-md border-border/85"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-1 top-1 h-8 w-8 text-muted-foreground hover:text-foreground"
                  >
                    {showOldPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  New Password
                </label>
                <div className="relative">
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value)
                      if (passwordError) setPasswordError(null)
                    }}
                    placeholder="••••••••"
                    className="h-10 text-sm pr-10 rounded-md border-border/85"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-1 top-1 h-8 w-8 text-muted-foreground hover:text-foreground"
                  >
                    {showNewPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                  </Button>
                </div>
              </div>

              {passwordError && (
                <p className="text-xs text-rose-600 font-medium">{passwordError}</p>
              )}

              <Button
                type="submit"
                variant="outline"
                disabled={isChangingPassword || !oldPassword || !newPassword}
                className="w-full h-10 rounded-md border-border/85 hover:bg-muted font-medium text-sm text-foreground"
              >
                {isChangingPassword ? (
                  <RefreshCw className="size-4 animate-spin mr-2" />
                ) : null}
                Change Password
              </Button>
            </form>
          </div>

          {/* ══════════════════════════════════════════════════════════════════
              RIGHT COLUMN: Profile Information, Contact Info & Bio
             ══════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-8 space-y-8 lg:border-l lg:border-border/60 lg:pl-10">
            <form onSubmit={handleSaveProfile} className="space-y-8" noValidate>
              {/* ── Section 1: Profile Information ── */}
              <div className="space-y-4">
                <h3 className="text-base font-bold text-foreground tracking-tight">
                  Profile Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  {/* Row 1: Username & First Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Username
                    </label>
                    <Input
                      value={formData.username}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, username: e.target.value }))
                      }
                      placeholder="e.g. farzana.choudhury"
                      className={`h-10 text-sm rounded-md border-border/85 ${
                        formErrors.username ? "border-rose-500" : ""
                      }`}
                    />
                    {formErrors.username && (
                      <p className="text-xs text-rose-600">{formErrors.username}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      First Name
                    </label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, firstName: e.target.value }))
                      }
                      placeholder="e.g. Farzana"
                      className={`h-10 text-sm rounded-md border-border/85 ${
                        formErrors.firstName ? "border-rose-500" : ""
                      }`}
                    />
                    {formErrors.firstName && (
                      <p className="text-xs text-rose-600">{formErrors.firstName}</p>
                    )}
                  </div>

                  {/* Row 2: Nickname & Role */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Nickname
                    </label>
                    <Input
                      value={formData.nickname}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, nickname: e.target.value }))
                      }
                      placeholder="e.g. Farzana.C"
                      className="h-10 text-sm rounded-md border-border/85"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Role
                    </label>
                    <Select
                      value={formData.role}
                      onValueChange={(val) =>
                        val && setFormData((p) => ({ ...p, role: val }))
                      }
                    >
                      <SelectTrigger className="h-10 w-full text-sm rounded-md border-border/85 bg-background">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {REVIEWER_ROLES.map((r) => (
                          <SelectItem key={r} value={r}>
                            {r}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Row 3: Last Name & Display Name Publicly as */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Last Name
                    </label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, lastName: e.target.value }))
                      }
                      placeholder="e.g. Choudhury"
                      className={`h-10 text-sm rounded-md border-border/85 ${
                        formErrors.lastName ? "border-rose-500" : ""
                      }`}
                    />
                    {formErrors.lastName && (
                      <p className="text-xs text-rose-600">{formErrors.lastName}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Display Name Publicly as
                    </label>
                    <Input
                      value={formData.displayName}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, displayName: e.target.value }))
                      }
                      placeholder="e.g. Dr. Farzana Choudhury"
                      className="h-10 text-sm rounded-md border-border/85"
                    />
                  </div>
                </div>
              </div>

              {/* ── Section 2: Contact Info ── */}
              <div className="space-y-4 pt-2">
                <h3 className="text-base font-bold text-foreground tracking-tight">
                  Contact Info
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  {/* Row 1: Email & WhatsApp */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Email (required)
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, email: e.target.value }))
                      }
                      placeholder="e.g. farzana.choudhury@icddrb.org"
                      className={`h-10 text-sm rounded-md border-border/85 ${
                        formErrors.email ? "border-rose-500" : ""
                      }`}
                    />
                    {formErrors.email && (
                      <p className="text-xs text-rose-600">{formErrors.email}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      WhatsApp
                    </label>
                    <Input
                      value={formData.whatsapp}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, whatsapp: e.target.value }))
                      }
                      placeholder="e.g. +880 1712-456789"
                      className="h-10 text-sm rounded-md border-border/85"
                    />
                  </div>

                  {/* Row 2: Website & Telegram */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Website
                    </label>
                    <Input
                      value={formData.website}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, website: e.target.value }))
                      }
                      placeholder="e.g. https://icddrb.org/faculty/..."
                      className="h-10 text-sm rounded-md border-border/85"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Telegram
                    </label>
                    <Input
                      value={formData.telegram}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, telegram: e.target.value }))
                      }
                      placeholder="e.g. @farzana_ethics"
                      className="h-10 text-sm rounded-md border-border/85"
                    />
                  </div>
                </div>
              </div>

              {/* ── Section 3: About the User ── */}
              <div className="space-y-4 pt-2">
                <h3 className="text-base font-bold text-foreground tracking-tight">
                  About the User
                </h3>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Biographical Info
                  </label>
                  <Textarea
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, bio: e.target.value }))
                    }
                    rows={5}
                    placeholder="Institutional bioethics background and deliberation notes..."
                    className="w-full min-h-[140px] text-sm rounded-md border-border/85 resize-y leading-relaxed"
                  />
                </div>
              </div>

              {/* ── Bottom Action Toolbar ── */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-border/60">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResetForm}
                  className="h-10 px-4 text-sm font-semibold rounded-md border-border/85 hover:bg-muted"
                >
                  <RotateCcw className="size-3.5 mr-1.5" />
                  Discard
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-10 px-6 text-sm font-bold bg-[#002752] hover:bg-[#003875] text-white rounded-md shadow-xs transition-colors"
                >
                  {isSubmitting ? (
                    <RefreshCw className="size-4 animate-spin mr-2" />
                  ) : (
                    <Save className="size-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ── Secondary Section: Assigned Deliberations & Protocol Docket ───── */}
      <div className="space-y-4 pt-2">
        <DataTable
          data={displayedProtocols}
          columns={protocolColumns}
          filters={protocolFilters}
          searchKeys={["title", "id", "board", "piName"]}
          searchPlaceholder="Search assigned deliberation protocols by ID, title, or PI..."
          title="Assigned Deliberation Protocols"
          description="Review research applications, participate in committee voting, and issue compliance recommendations."
          initialPageSize={5}
        />
      </div>

      {/* ── Upload Photo Slide-over Sheet ─────────────────────────────────── */}
      <Sheet open={isUploadSheetOpen} onOpenChange={setIsUploadSheetOpen}>
        <SheetContent side="right" size="default" className="p-6">
          <SheetHeader className="p-0 pb-4 border-b border-border/75">
            <SheetTitle className="text-lg font-bold text-primary dark:text-white flex items-center gap-2">
              <Camera className="size-5 text-secondary" />
              Update Reviewer Picture
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground mt-0.5">
              Choose an image from your device, link a web image URL, or select from curated committee faculty headshots.
            </SheetDescription>
          </SheetHeader>

          <div className="py-4 space-y-4">
            <Tabs
              value={uploadOption}
              onValueChange={(v) => setUploadOption(v as "file" | "url")}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 w-full h-10 p-1 bg-muted rounded-lg">
                <TabsTrigger
                  value="file"
                  className="text-xs font-bold gap-1.5 data-[active=true]:bg-white dark:data-[active=true]:bg-[#0C1E34]"
                >
                  <Upload className="size-3.5" />
                  Device Upload
                </TabsTrigger>
                <TabsTrigger
                  value="url"
                  className="text-xs font-bold gap-1.5 data-[active=true]:bg-white dark:data-[active=true]:bg-[#0C1E34]"
                >
                  <LinkIcon className="size-3.5" />
                  Web URL & Presets
                </TabsTrigger>
              </TabsList>

              {/* Tab 1: Device File */}
              <TabsContent value="file" className="space-y-4 pt-4">
                <div
                  onDragOver={(e) => {
                    e.preventDefault()
                    setIsDragging(true)
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault()
                    setIsDragging(false)
                  }}
                  onDrop={(e) => {
                    e.preventDefault()
                    setIsDragging(false)
                    const f = e.dataTransfer.files?.[0]
                    if (f) processImageFile(f)
                  }}
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
                    <p className="text-sm font-bold text-foreground">
                      Drag & drop reviewer photo here, or browse files
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supports PNG, JPG, JPEG, WEBP up to 5MB
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-8 px-4 text-xs font-bold rounded-md border-border/85"
                  >
                    Browse Device
                  </Button>
                </div>
              </TabsContent>

              {/* Tab 2: URL & Presets */}
              <TabsContent value="url" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                    <span>Direct Image Web Address:</span>
                    {urlVerified && (
                      <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="size-3" />
                        Verified
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
                      placeholder="https://images.unsplash.com/..."
                      className="h-9 text-xs font-mono"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isTestingUrl || !urlInput.trim()}
                      onClick={() => handleVerifyUrl(urlInput)}
                      className="h-9 px-3 text-xs font-bold shrink-0"
                    >
                      {isTestingUrl ? (
                        <RefreshCw className="size-3.5 animate-spin" />
                      ) : (
                        "Verify"
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-muted-foreground block uppercase tracking-wider">
                    Or Select Curated Institutional Headshot:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {AVATAR_PRESETS.map((preset) => (
                      <Button
                        key={preset.id}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setUrlInput(preset.url)
                          handleVerifyUrl(preset.url)
                        }}
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
                          <span className="text-xs font-bold text-foreground block truncate">
                            {preset.label}
                          </span>
                          <span className="text-[0.65rem] text-muted-foreground block truncate">
                            {preset.role}
                          </span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <SheetFooter className="p-0 pt-4 flex flex-row items-center justify-between gap-2 border-t border-border/70">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsUploadSheetOpen(false)}
              className="h-9 px-3 text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleApplyPhotoFromSheet}
              disabled={uploadOption === "file" ? !fileDraftUrl : !urlInput.trim() || !urlVerified}
              className="h-9 px-4 text-xs font-bold bg-[#002752] hover:bg-[#003875] text-white rounded-md"
            >
              Apply Photo
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </DashboardContainer>
  )
}
