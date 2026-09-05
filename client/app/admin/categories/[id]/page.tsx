"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Layers,
  Building2,
  Banknote,
  Clock,
  Zap,
  Edit2,
  Trash2,
  Copy,
  Check,
  AlertTriangle,
  Scale,
  FileCheck2,
  FolderKanban,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { KpiCard, KpiGrid } from "@/components/ui/kpi-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
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
import { toast } from "@/components/ui/sonner"
import {
  getStoredCategories,
  subscribeCategories,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
  initialCategories,
} from "@/lib/categories-store"
import { categoriesApi } from "@/lib/api/categories.api"
import {
  updateResearchCategorySchema,
  IRB_BOARDS,
  RISK_TIERS,
  type UpdateResearchCategoryInput,
} from "@/lib/schemas"

interface PageProps {
  params: Promise<{ id: string }>
}

export default function ResearchCategoryDetailPage({ params }: PageProps) {
  const resolvedParams = React.use(params)
  const categoryId = decodeURIComponent(resolvedParams.id)
  const router = useRouter()

  const allCategories = React.useSyncExternalStore(
    subscribeCategories,
    getStoredCategories,
    () => initialCategories
  )

  const category = React.useMemo(() => {
    return allCategories.find((c) => c.id === categoryId || c.code === categoryId)
  }, [allCategories, categoryId])

  const [editDialogOpen, setEditDialogOpen] = React.useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [copiedCode, setCopiedCode] = React.useState(false)

  // Edit Form State
  const [editForm, setEditForm] = React.useState<UpdateResearchCategoryInput>({})
  const [editErrors, setEditErrors] = React.useState<Record<string, string>>({})

  // If not found
  if (!category) {
    return (
      <div className="space-y-6 w-full max-w-full">
        <Link
          href="/admin/categories"
          className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="size-3.5 mr-1.5" />
          <span>Back to Research Categories</span>
        </Link>
        <Card className="p-8 text-center space-y-4">
          <div className="size-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Layers className="size-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Research Category Not Found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              No registered category matches identifier &quot;{categoryId}&quot;.
            </p>
          </div>
          <Link href="/admin/categories">
            <Button size="sm" className="bg-[#002752] text-white">
              Return to Category List
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  const isActive = category.status === "Active"
  const nextStatus = isActive ? "Inactive" : "Active"

  const handleToggleStatus = () => {
    toggleCategoryStatus(category.id)
    categoriesApi.toggleStatus(category.id).catch((err) => {
      console.warn("API toggle error:", err)
    })

    if (nextStatus === "Active") {
      toast.success("Category Activated", {
        description: `${category.name} is now open for researcher applications.`,
      })
    } else {
      toast.warning("Category Suspended", {
        description: `${category.name} intake is paused. New submissions will not be accepted under this category.`,
      })
    }
  }

  const handleOpenEdit = () => {
    setEditForm({
      name: category.name,
      code: category.code,
      board: category.board,
      description: category.description,
      priceBdt: category.priceBdt,
      expeditedAllowed: category.expeditedAllowed,
      expeditedFeeBdt: category.expeditedFeeBdt,
      turnaroundDays: category.turnaroundDays,
      riskDefault: category.riskDefault,
      status: category.status,
    })
    setEditErrors({})
    setEditDialogOpen(true)
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setEditErrors({})

    const validation = updateResearchCategorySchema.safeParse(editForm)
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of validation.error.issues) {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message
        }
      }
      setEditErrors(fieldErrors)
      return
    }

    updateCategory(category.id, validation.data)
    categoriesApi.update(category.id, validation.data).catch((err) => {
      console.warn("API update error:", err)
    })

    toast.success("Research Category Updated", {
      description: "Changes and BDT fee structure saved successfully.",
    })
    setEditDialogOpen(false)
  }

  const handleDeleteConfirm = () => {
    deleteCategory(category.id)
    categoriesApi.delete(category.id).catch((err) => {
      console.warn("API delete error:", err)
    })

    toast.success("Category Removed", {
      description: `${category.name} has been deleted from institutional registers.`,
    })
    router.push("/admin/categories")
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(category.code)
    setCopiedCode(true)
    toast.info("Category Code Copied", {
      description: `Copied ${category.code} to clipboard.`,
    })
    setTimeout(() => setCopiedCode(false), 2000)
  }

  return (
    <div className="space-y-6 select-text w-full max-w-full overflow-x-hidden pb-12">
      {/* ── Top Navigation & Breadcrumbs ───────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-3 px-4 sm:px-0">
        <Link
          href="/admin/categories"
          className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-[#002752] dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="size-3.5 mr-1.5" />
          <span>Back to Research Categories</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleOpenEdit}
            className="h-8 gap-1.5 text-xs font-semibold rounded-lg border-slate-200 dark:border-slate-800"
          >
            <Edit2 className="size-3.5 text-[#002752] dark:text-sky-400" />
            <span>Edit Category & Fee</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setDeleteDialogOpen(true)}
            className="h-8 gap-1.5 text-xs font-semibold rounded-lg border-rose-200 dark:border-rose-900/50 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
          >
            <Trash2 className="size-3.5" />
            <span>Delete Category</span>
          </Button>
        </div>
      </div>

      {/* ── Header Profile Identity Card ───────────────────────────────────── */}
      <Card className="p-6 rounded-none sm:rounded-2xl border-y sm:border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="size-16 sm:size-20 rounded-2xl bg-gradient-to-br from-[#002752] to-[#198754] text-white flex items-center justify-center font-black text-2xl shadow-sm shrink-0">
              <Layers className="size-9" />
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#002752] dark:text-white tracking-tight">
                  {category.name}
                </h1>
                <Badge
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${
                    isActive
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                      : "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30"
                  }`}
                >
                  {isActive ? "Active (Intake Open)" : "Inactive / Suspended"}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-1.5 font-mono font-bold text-[#002752] dark:text-sky-300">
                  <span>Code: {category.code}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={handleCopyCode}
                    title="Copy category code"
                    className="size-5 p-0"
                  >
                    {copiedCode ? <Check className="size-3 text-emerald-600" /> : <Copy className="size-3" />}
                  </Button>
                </div>
                <div className="flex items-center gap-1 text-slate-500">
                  <Building2 className="size-3.5 text-slate-400 shrink-0" />
                  <span>{category.board}</span>
                </div>
                <div className="font-mono text-xs text-slate-400">
                  Ref: {category.id}
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                <Badge
                  variant="outline"
                  className="text-[11px] font-semibold bg-[#002752]/5 text-[#002752] dark:text-sky-300 border-[#002752]/20"
                >
                  Risk: {category.riskDefault}
                </Badge>
                <Badge
                  variant="outline"
                  className="text-[11px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                >
                  Turnaround: ~{category.turnaroundDays} Days
                </Badge>
                {category.expeditedAllowed && (
                  <Badge
                    variant="outline"
                    className="text-[11px] font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30"
                  >
                    72h Expedited Eligible
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Header Action: Toggle Status */}
          <div className="flex flex-row lg:flex-col items-center lg:items-end gap-2 shrink-0">
            {/* Status Toggle */}
            <div className="flex items-center gap-2.5">
              <Switch
                checked={isActive}
                onCheckedChange={() => handleToggleStatus()}
                aria-label="Toggle category status"
              />
              <span className={`text-xs font-bold ${
                isActive ? "text-emerald-700 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"
              }`}>
                {isActive ? "Active (Intake Open)" : "Inactive / Suspended"}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* ── KPI Grid Metrics ───────────────────────────────────────────────── */}
      <KpiGrid columns={4}>
        <KpiCard
          label="Standard Review Fee"
          value={`৳ ${category.priceBdt.toLocaleString()}`}
          description="Bangladeshi Taka (BDT ৳)"
          icon={Banknote}
          color="navy"
        />
        <KpiCard
          label="Expedited Surcharge"
          value={category.expeditedAllowed ? `৳ ${category.expeditedFeeBdt.toLocaleString()}` : "N/A"}
          description={category.expeditedAllowed ? "72h fast-track add-on" : "Expedited not applicable"}
          icon={Zap}
          color="gold"
        />
        <KpiCard
          label="Total Expedited Fee"
          value={category.expeditedAllowed ? `৳ ${(category.priceBdt + category.expeditedFeeBdt).toLocaleString()}` : "N/A"}
          description="Combined priority fee"
          icon={FileCheck2}
          color="green"
        />
        <KpiCard
          label="Target Velocity"
          value={`~${category.turnaroundDays} Days`}
          description="Standard deliberation timeline"
          icon={Clock}
          color="sky"
        />
      </KpiGrid>

      {/* ── Deep Details Context Grid ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols wide) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card: Scientific Scope Description */}
          <Card className="p-5 rounded-none sm:rounded-2xl border-y sm:border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-[#002752] dark:text-white uppercase tracking-wider flex items-center gap-2">
              <FolderKanban className="size-4 text-[#002752] dark:text-sky-400" />
              <span>Scientific Scope & Protocol Classification</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
              {category.description}
            </p>
          </Card>

          {/* Card: Institutional Fee Breakdown */}
          <Card className="p-5 rounded-none sm:rounded-2xl border-y sm:border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#002752] dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Banknote className="size-4 text-[#198754]" />
              <span>Official Institutional Fee Schedule (BDT ৳)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800 space-y-1">
                <span className="text-slate-400 block font-semibold uppercase text-[10px]">
                  Standard Institutional Clearance Fee
                </span>
                <span className="font-extrabold text-[#002752] dark:text-sky-300 text-xl block">
                  ৳ {category.priceBdt.toLocaleString()} BDT
                </span>
                <span className="text-slate-500 text-[11px] block mt-1">
                  Required baseline payment per submitted protocol in this stream.
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800 space-y-1">
                <span className="text-slate-400 block font-semibold uppercase text-[10px]">
                  Fast-Track Expedited Review Surcharge
                </span>
                <span className="font-extrabold text-amber-700 dark:text-amber-400 text-xl block">
                  {category.expeditedAllowed
                    ? `+ ৳ ${category.expeditedFeeBdt.toLocaleString()} BDT`
                    : "Not Supported"}
                </span>
                <span className="text-slate-500 text-[11px] block mt-1">
                  {category.expeditedAllowed
                    ? "Guarantees triage placement and screening within 72 hours."
                    : "This category strictly requires regular committee quorum deliberation."}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column (1 Col wide) */}
        <div className="space-y-6">
          {/* Card: Operational Specifications */}
          <Card className="p-5 rounded-none sm:rounded-2xl border-y sm:border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#002752] dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Scale className="size-4 text-[#002752] dark:text-sky-400" />
              <span>Operational Criteria</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Governing Board</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{category.board}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Default Risk Tier</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{category.riskDefault}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Target Velocity</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{category.turnaroundDays} Calendar Days</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Currency Standard</span>
                <span className="font-mono font-bold text-[#198754]">BDT (Bangladeshi ৳)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Registered On</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">{category.createdAt}</span>
              </div>
            </div>
          </Card>

          {/* Card: Quick Actions */}
          <Card className="p-5 rounded-none sm:rounded-2xl border-y sm:border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-[#002752] dark:text-white uppercase tracking-wider">
              Management Actions
            </h3>
            <div className="space-y-2">
              <Button
                type="button"
                onClick={handleOpenEdit}
                className="w-full justify-start text-xs font-bold h-9 bg-[#002752] hover:bg-[#001c3d] text-white"
              >
                <Edit2 className="size-3.5 mr-2" />
                Edit Category & Fee Structure
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeleteDialogOpen(true)}
                className="w-full justify-start text-xs font-bold h-9 text-rose-600 border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/30"
              >
                <Trash2 className="size-3.5 mr-2" />
                Delete Research Category
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* ── Sheet: Edit Research Category & BDT Price ──────────────────────── */}
      <Sheet open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <SheetContent side="right" className="sm:max-w-xl md:max-w-2xl w-full p-6">
          <form onSubmit={handleEditSubmit} className="flex flex-col h-full" noValidate>
            <SheetHeader className="p-0 pb-3">
              <SheetTitle className="text-lg font-black text-[#002752] dark:text-white flex items-center gap-2">
                <Edit2 className="size-5 text-[#198754]" />
                <span>Edit Category: {category.code}</span>
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground">
                Update scientific scope, governing board, or adjust pricing in Bangladeshi Taka (BDT ৳).
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <Label htmlFor="detail-edit-name" className="text-xs font-bold">
                    Category Name <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="detail-edit-name"
                    value={editForm.name || ""}
                    onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                    className={editErrors.name ? "border-rose-500 ring-1 ring-rose-500/20" : ""}
                  />
                  {editErrors.name && (
                    <p className="text-xs text-rose-600 font-semibold">{editErrors.name}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="detail-edit-code" className="text-xs font-bold">
                    Category Code <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="detail-edit-code"
                    value={editForm.code || ""}
                    onChange={(e) => setEditForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
                    className="font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="detail-edit-board" className="text-xs font-bold">
                    Governing Ethics Board
                  </Label>
                  <Select
                    value={editForm.board}
                    onValueChange={(val) =>
                      setEditForm((p) => ({ ...p, board: val as UpdateResearchCategoryInput["board"] }))
                    }
                  >
                    <SelectTrigger id="detail-edit-board">
                      <SelectValue placeholder="Select board" />
                    </SelectTrigger>
                    <SelectContent>
                      {IRB_BOARDS.map((b) => (
                        <SelectItem key={b} value={b}>
                          {b}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="detail-edit-price" className="text-xs font-bold">
                    Standard Fee (BDT ৳) <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="detail-edit-price"
                    type="number"
                    min={0}
                    step={500}
                    value={editForm.priceBdt ?? 0}
                    onChange={(e) => setEditForm((p) => ({ ...p, priceBdt: Number(e.target.value) || 0 }))}
                    className="font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="detail-edit-turnaround" className="text-xs font-bold">
                    Turnaround Velocity (Days)
                  </Label>
                  <Input
                    id="detail-edit-turnaround"
                    type="number"
                    min={1}
                    max={90}
                    value={editForm.turnaroundDays ?? 14}
                    onChange={(e) => setEditForm((p) => ({ ...p, turnaroundDays: Number(e.target.value) || 14 }))}
                    className="font-mono"
                  />
                </div>

                <div className="sm:col-span-2 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="detail-edit-expedited-toggle"
                      checked={editForm.expeditedAllowed ?? false}
                      onCheckedChange={(checked) =>
                        setEditForm((p) => ({ ...p, expeditedAllowed: Boolean(checked) }))
                      }
                    />
                    <Label
                      htmlFor="detail-edit-expedited-toggle"
                      className="text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
                    >
                      Enable Fast-Track Expedited Review (72-Hour Triage)
                    </Label>
                  </div>

                  {editForm.expeditedAllowed && (
                    <div className="space-y-1.5 pl-6 pt-1">
                      <Label htmlFor="detail-edit-expedited-fee" className="text-xs font-bold">
                        Expedited Surcharge (BDT ৳)
                      </Label>
                      <Input
                        id="detail-edit-expedited-fee"
                        type="number"
                        min={0}
                        step={500}
                        value={editForm.expeditedFeeBdt ?? 0}
                        onChange={(e) =>
                          setEditForm((p) => ({
                            ...p,
                            expeditedFeeBdt: Number(e.target.value) || 0,
                          }))
                        }
                        className="font-mono"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="detail-edit-risk" className="text-xs font-bold">
                    Default Ethics Risk Tier
                  </Label>
                  <Select
                    value={editForm.riskDefault}
                    onValueChange={(val) =>
                      setEditForm((p) => ({
                        ...p,
                        riskDefault: val as UpdateResearchCategoryInput["riskDefault"],
                      }))
                    }
                  >
                    <SelectTrigger id="detail-edit-risk">
                      <SelectValue placeholder="Select risk tier" />
                    </SelectTrigger>
                    <SelectContent>
                      {RISK_TIERS.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="detail-edit-status" className="text-xs font-bold">
                    Status
                  </Label>
                  <Select
                    value={editForm.status}
                    onValueChange={(val) =>
                      setEditForm((p) => ({
                        ...p,
                        status: val as UpdateResearchCategoryInput["status"],
                      }))
                    }
                  >
                    <SelectTrigger id="detail-edit-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active (Intake Open)</SelectItem>
                      <SelectItem value="Inactive">Inactive (Suspended)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <Label htmlFor="detail-edit-desc" className="text-xs font-bold">
                    Scientific Scope & Description <span className="text-rose-500">*</span>
                  </Label>
                  <Textarea
                    id="detail-edit-desc"
                    rows={3}
                    value={editForm.description || ""}
                    onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))}
                    className={editErrors.description ? "border-rose-500 ring-1 ring-rose-500/20" : ""}
                  />
                  {editErrors.description && (
                    <p className="text-xs text-rose-600 font-semibold">{editErrors.description}</p>
                  )}
                </div>
              </div>
            </div>

            <SheetFooter className="p-0 pt-4 gap-2 flex-row justify-end border-t border-slate-100 dark:border-slate-800/80">
              <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#002752] hover:bg-[#001c3d] text-white">
                Save Changes
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      {/* ── Modal: Delete Confirmation (AlertDialog) ──────────────────────── */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-black text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <AlertTriangle className="size-5" />
              <span>Delete Category: {category.name}</span>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <strong className="text-slate-900 dark:text-white">
                {category.name} ({category.code})
              </strong>
              ? Its BDT fee schedule will be removed from future protocol clearance submissions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 pt-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
            >
              Confirm Deletion
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
