"use client"

import * as React from "react"
import Link from "next/link"
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Clock,
  Banknote,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Sparkles,
  Zap,
  Building2,
  ShieldAlert,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { KpiCard, KpiGrid } from "@/components/ui/kpi-card"
import { DataTable, type ColumnDef, type DataTableFilter } from "@/components/ui/data-table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
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
import { toast } from "@/components/ui/sonner"
import {
  createResearchCategorySchema,
  updateResearchCategorySchema,
  IRB_BOARDS,
  RISK_TIERS,
  type ResearchCategory,
  type CreateResearchCategoryInput,
  type UpdateResearchCategoryInput,
} from "@/lib/schemas"
import {
  getStoredCategories,
  subscribeCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
} from "@/lib/categories-store"
import { categoriesApi } from "@/lib/api/categories.api"

export default function AdminCategoriesPage() {
  const [categories, setCategories] = React.useState<ResearchCategory[]>(getStoredCategories)
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false)
  const [editDialogOpen, setEditDialogOpen] = React.useState(false)
  const [categoryToEdit, setCategoryToEdit] = React.useState<ResearchCategory | null>(null)
  const [categoryToDelete, setCategoryToDelete] = React.useState<ResearchCategory | null>(null)

  // ── Create Form State ──────────────────────────────────────────────────────
  const [createForm, setCreateForm] = React.useState<CreateResearchCategoryInput>({
    name: "",
    code: "",
    board: "Biomedical IRB",
    description: "",
    priceBdt: 7500,
    expeditedAllowed: true,
    expeditedFeeBdt: 3000,
    turnaroundDays: 14,
    riskDefault: "Minimal Risk",
    status: "Active",
  })
  const [createErrors, setCreateErrors] = React.useState<Record<string, string>>({})

  // ── Edit Form State ────────────────────────────────────────────────────────
  const [editForm, setEditForm] = React.useState<UpdateResearchCategoryInput>({})
  const [editErrors, setEditErrors] = React.useState<Record<string, string>>({})

  // ── Sync Store with API & Reactive Events ───────────────────────────────────
  React.useEffect(() => {
    const sync = () => {
      setCategories(getStoredCategories())
    }

    const unsubscribe = subscribeCategories(sync)

    // Background fetch to sync with server DB
    categoriesApi
      .getAll()
      .then((serverData) => {
        if (serverData && serverData.length > 0) {
          // If server returns items, ensure local storage and state reflect it
          setCategories(serverData)
        }
      })
      .catch((err) => {
        console.warn("Could not sync categories from server, using local store:", err)
      })

    return () => {
      unsubscribe()
    }
  }, [])

  // ── KPI Computations ───────────────────────────────────────────────────────
  const totalCategories = categories.length
  const activeCategories = categories.filter((c) => c.status === "Active").length
  const expeditedCount = categories.filter((c) => c.expeditedAllowed && c.status === "Active").length
  const averagePriceBdt =
    totalCategories > 0
      ? Math.round(
          categories.reduce((acc, curr) => acc + (curr.priceBdt || 0), 0) / totalCategories
        )
      : 0

  // ── Create Category Handler ────────────────────────────────────────────────
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setCreateErrors({})

    const validation = createResearchCategorySchema.safeParse(createForm)
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of validation.error.issues) {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message
        }
      }
      setCreateErrors(fieldErrors)
      toast.error("Form Validation Error", {
        description: "Please inspect highlighted fields before submitting.",
      })
      return
    }

    const newCat = addCategory(validation.data)
    categoriesApi.create(validation.data).catch((err) => {
      console.warn("Server create failed, retained optimistic store:", err)
    })

    toast.success("Research Category Created", {
      description: `${newCat.name} (${newCat.code}) registered with fee ৳ ${newCat.priceBdt.toLocaleString()} BDT.`,
    })

    setCreateDialogOpen(false)
    setCreateForm({
      name: "",
      code: "",
      board: "Biomedical IRB",
      description: "",
      priceBdt: 7500,
      expeditedAllowed: true,
      expeditedFeeBdt: 3000,
      turnaroundDays: 14,
      riskDefault: "Minimal Risk",
      status: "Active",
    })
  }

  // ── Edit Category Handler ──────────────────────────────────────────────────
  const openEditModal = (cat: ResearchCategory) => {
    setCategoryToEdit(cat)
    setEditForm({
      name: cat.name,
      code: cat.code,
      board: cat.board,
      description: cat.description,
      priceBdt: cat.priceBdt,
      expeditedAllowed: cat.expeditedAllowed,
      expeditedFeeBdt: cat.expeditedFeeBdt,
      turnaroundDays: cat.turnaroundDays,
      riskDefault: cat.riskDefault,
      status: cat.status,
    })
    setEditErrors({})
    setEditDialogOpen(true)
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!categoryToEdit) return
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
      toast.error("Validation Error", {
        description: "Please inspect highlighted fields before saving.",
      })
      return
    }

    const updated = updateCategory(categoryToEdit.id, validation.data)
    if (updated) {
      categoriesApi.update(categoryToEdit.id, validation.data).catch((err) => {
        console.warn("Server update failed, retained optimistic store:", err)
      })

      toast.success("Research Category Updated", {
        description: `${updated.name} updated with standard fee ৳ ${updated.priceBdt.toLocaleString()} BDT.`,
      })
    }

    setEditDialogOpen(false)
    setCategoryToEdit(null)
  }

  // ── Toggle Category Status Handler ─────────────────────────────────────────
  const handleToggleStatus = (id: string, currentStatus: string, name: string) => {
    toggleCategoryStatus(id)
    categoriesApi.toggleStatus(id).catch((err) => {
      console.warn("Server toggle status failed, retained optimistic store:", err)
    })

    const newStatus = currentStatus === "Active" ? "Inactive" : "Active"
    if (newStatus === "Active") {
      toast.success("Category Activated", {
        description: `${name} is now active for investigator clearance submissions.`,
      })
    } else {
      toast.warning("Category Suspended", {
        description: `${name} is now inactive. New submissions are paused for this category.`,
      })
    }
  }

  // ── Delete Category Handler ────────────────────────────────────────────────
  const handleDeleteConfirm = () => {
    if (!categoryToDelete) return
    const id = categoryToDelete.id
    const name = categoryToDelete.name

    deleteCategory(id)
    categoriesApi.delete(id).catch((err) => {
      console.warn("Server delete failed, retained optimistic store:", err)
    })

    toast.success("Category Removed", {
      description: `${name} (${id}) has been permanently deleted from institutional registers.`,
    })
    setCategoryToDelete(null)
  }

  // ── Autofill Demo Category ─────────────────────────────────────────────────
  const handleAutofillDemo = () => {
    setCreateForm({
      name: "Translational Stem Cell & Regenerative Bioengineering",
      code: "REGEN_STEM_CELL",
      board: "Biomedical IRB",
      description:
        "Investigative clinical human embryonic/adult stem cell grafts, regenerative tissue therapy, and autologous cellular bio-manufacture protocols.",
      priceBdt: 22500,
      expeditedAllowed: true,
      expeditedFeeBdt: 5000,
      turnaroundDays: 21,
      riskDefault: "Greater Than Minimal",
      status: "Active",
    })
    setCreateErrors({})
    toast.info("Sample Category Prefilled", {
      description: "Populated biomedical high-tier protocol details with ৳ 22,500 BDT fee.",
    })
  }

  // ── Table Column Definitions ───────────────────────────────────────────────
  const columns = React.useMemo<ColumnDef<ResearchCategory>[]>(
    () => [
      {
        id: "code",
        accessorKey: "code",
        header: "Code / ID",
        sortable: true,
        headerClassName: "w-[150px]",
        cell: ({ row }) => (
          <div className="space-y-1">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-[#002752]/8 dark:bg-white/8 text-[#002752] dark:text-sky-300 border border-[#002752]/10 dark:border-white/10 whitespace-nowrap inline-block">
              {row.code}
            </span>
            <span className="block font-mono text-[10px] text-slate-400 dark:text-slate-500">
              {row.id}
            </span>
          </div>
        ),
      },
      {
        id: "name",
        accessorKey: "name",
        header: "Category Name & Scientific Scope",
        sortable: true,
        cell: ({ row }) => (
          <div className="max-w-md min-w-[240px]">
            <Link
              href={`/admin/categories/${encodeURIComponent(row.id)}`}
              className="font-bold text-slate-900 dark:text-white text-[13px] hover:text-[#002752] dark:hover:text-sky-400 hover:underline leading-snug line-clamp-1"
            >
              {row.name}
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
              {row.description}
            </p>
          </div>
        ),
      },
      {
        id: "board",
        accessorKey: "board",
        header: "Ethics Board",
        sortable: true,
        headerClassName: "w-[170px]",
        cell: ({ row }) => (
          <Badge
            variant="outline"
            className="text-[11px] font-semibold bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 whitespace-nowrap"
          >
            <Building2 className="size-3 mr-1 text-[#002752] dark:text-sky-400" />
            {row.board}
          </Badge>
        ),
      },
      {
        id: "priceBdt",
        accessorKey: "priceBdt",
        header: "Standard Fee (BDT ৳)",
        sortable: true,
        headerClassName: "w-[160px]",
        cell: ({ row }) => (
          <div className="whitespace-nowrap">
            <span className="font-bold text-slate-900 dark:text-white text-sm">
              ৳ {row.priceBdt.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block uppercase font-mono">
              BDT / Submission
            </span>
          </div>
        ),
      },
      {
        id: "expeditedFeeBdt",
        accessorKey: "expeditedFeeBdt",
        header: "Expedited Review",
        sortable: true,
        headerClassName: "w-[150px]",
        cell: ({ row }) => (
          row.expeditedAllowed ? (
            <div className="whitespace-nowrap">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-400">
                <Zap className="size-3" />
                + ৳ {row.expeditedFeeBdt.toLocaleString()} BDT
              </span>
              <span className="text-[10px] text-slate-400 block">72h Docket</span>
            </div>
          ) : (
            <span className="text-[11px] text-slate-400 italic">Not Eligible</span>
          )
        ),
      },
      {
        id: "turnaroundDays",
        accessorKey: "turnaroundDays",
        header: "Turnaround",
        sortable: true,
        headerClassName: "w-[120px]",
        cell: ({ row }) => (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 dark:text-slate-300">
            <Clock className="size-3 text-slate-400" />
            ~{row.turnaroundDays} Days
          </span>
        ),
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Status",
        sortable: true,
        headerClassName: "w-[120px]",
        cell: ({ row }) => {
          const isActive = row.status === "Active"
          return (
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-md border whitespace-nowrap ${
                isActive
                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700"
              }`}
            >
              <span
                className={`size-1.5 rounded-full ${
                  isActive ? "bg-emerald-500" : "bg-slate-400"
                }`}
              />
              {row.status}
            </span>
          )
        },
      },
      {
        id: "actions",
        header: "Actions",
        headerClassName: "w-[150px] text-right",
        align: "right",
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
            {/* View Dossier Detail Page Link */}
            <Link href={`/admin/categories/${encodeURIComponent(row.id)}`}>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                title="Inspect Category Dossier"
                aria-label={`View dossier for ${row.name}`}
                className="text-slate-500 hover:text-[#002752] dark:hover:text-sky-300"
              >
                <ExternalLink className="size-3.5" />
              </Button>
            </Link>

            {/* Quick Edit Trigger */}
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => openEditModal(row)}
              title="Edit Category & Fee"
              aria-label={`Edit ${row.name}`}
              className="text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              <Edit2 className="size-3.5" />
            </Button>

            {/* Toggle Status Button */}
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => handleToggleStatus(row.id, row.status, row.name)}
              title={row.status === "Active" ? "Pause Category" : "Activate Category"}
              aria-label={`Toggle status for ${row.name}`}
              className={row.status === "Active" ? "text-amber-600 hover:text-amber-800" : "text-emerald-600 hover:text-emerald-800"}
            >
              {row.status === "Active" ? <XCircle className="size-3.5" /> : <CheckCircle2 className="size-3.5" />}
            </Button>

            {/* Delete Trigger */}
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => setCategoryToDelete(row)}
              title="Delete Category"
              aria-label={`Delete ${row.name}`}
              className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        ),
      },
    ],
    []
  )

  // ── Faceted Filters ────────────────────────────────────────────────────────
  const filters: DataTableFilter<ResearchCategory>[] = React.useMemo(
    () => [
      {
        id: "board",
        title: "Ethics Board",
        accessorKey: "board",
        options: [
          { label: "Biomedical IRB", value: "Biomedical IRB" },
          { label: "Social & Behavioral Board", value: "Social & Behavioral Board" },
          { label: "AI & Data Ethics Board", value: "AI & Data Ethics Board" },
        ],
      },
      {
        id: "status",
        title: "Status",
        accessorKey: "status",
        options: [
          { label: "Active Only", value: "Active" },
          { label: "Inactive / Suspended", value: "Inactive" },
        ],
      },
      {
        id: "riskDefault",
        title: "Default Risk",
        accessorKey: "riskDefault",
        options: [
          { label: "Minimal Risk", value: "Minimal Risk" },
          { label: "Exempt - Fast Track", value: "Exempt - Fast Track" },
          { label: "Greater Than Minimal", value: "Greater Than Minimal" },
        ],
      },
    ],
    []
  )

  return (
    <div className="space-y-6 sm:space-y-8 select-text">
      {/* ── Centralized KPI Metrics Grid ───────────────────────────────────── */}
      <KpiGrid columns={4}>
        <KpiCard
          label="Total Research Categories"
          value={totalCategories}
          description="Accredited scientific streams"
          icon={Layers}
          color="navy"
        />
        <KpiCard
          label="Active Categories"
          value={activeCategories}
          description="Available for researcher intake"
          icon={CheckCircle2}
          color="green"
        />
        <KpiCard
          label="Average Standard Fee"
          value={`৳ ${averagePriceBdt.toLocaleString()}`}
          description="Bangladeshi Taka (BDT ৳)"
          icon={Banknote}
          color="amber"
        />
        <KpiCard
          label="Expedited Tracks"
          value={expeditedCount}
          description="72-hour priority triage eligible"
          icon={Zap}
          color="sky"
        />
      </KpiGrid>

      {/* ── Unified DataTable Section ──────────────────────────────────────── */}
      <div className="w-full">
        <DataTable<ResearchCategory>
          data={categories}
          columns={columns}
          title="Institutional Research Categories & Fee Schedule"
          description="Manage academic protocol classification domains, ethical governance boards, and official processing fees in Bangladeshi Taka (BDT ৳)"
          searchPlaceholder="Search by category name, code, board, or description..."
          searchKeys={["name", "code", "board", "description"]}
          filters={filters}
          initialPageSize={10}
          pageSizeOptions={[5, 10, 20, 50]}
          initialSort={{
            columnId: "priceBdt",
            direction: "desc",
          }}
          toolbarActions={
            <Button
              type="button"
              onClick={() => setCreateDialogOpen(true)}
              className="gap-1.5 h-8 px-3 text-xs font-bold bg-[#002752] hover:bg-[#001c3d] text-white rounded-lg transition-colors shadow-xs"
            >
              <Plus className="size-3.5" />
              <span>New Research Category</span>
            </Button>
          }
        />
      </div>

      {/* ── Modal: Create New Research Category ─────────────────────────────── */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleCreateSubmit}>
            <DialogHeader>
              <div className="flex items-center justify-between gap-2">
                <DialogTitle className="text-lg font-black text-[#002752] dark:text-white flex items-center gap-2">
                  <Layers className="size-5 text-[#198754]" />
                  <span>Add New Research Category</span>
                </DialogTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  onClick={handleAutofillDemo}
                  className="text-[11px] font-bold text-[#002752] dark:text-sky-300 gap-1"
                >
                  <Sparkles className="size-3 text-amber-500" />
                  <span>Autofill Sample</span>
                </Button>
              </div>
              <DialogDescription className="text-xs text-muted-foreground">
                Define a scientific research categorization stream, assign its governing IRB board, and set institutional fee schedules in Bangladeshi Taka (BDT ৳).
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category Name */}
                <div className="sm:col-span-2 space-y-1.5">
                  <Label htmlFor="create-name" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Category Name <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="create-name"
                    value={createForm.name}
                    onChange={(e) => {
                      setCreateForm((p) => ({ ...p, name: e.target.value }))
                      if (createErrors.name) setCreateErrors((p) => ({ ...p, name: "" }))
                    }}
                    placeholder="e.g. Translational Stem Cell & Regenerative Bioengineering"
                    aria-invalid={Boolean(createErrors.name)}
                    className={createErrors.name ? "border-rose-500 ring-1 ring-rose-500/20" : ""}
                  />
                  {createErrors.name && (
                    <p className="text-xs text-rose-600 font-semibold">{createErrors.name}</p>
                  )}
                </div>

                {/* Category Code */}
                <div className="space-y-1.5">
                  <Label htmlFor="create-code" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Category Code <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="create-code"
                    value={createForm.code}
                    onChange={(e) => {
                      setCreateForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))
                      if (createErrors.code) setCreateErrors((p) => ({ ...p, code: "" }))
                    }}
                    placeholder="e.g. STEM_CELL_TRANS"
                    aria-invalid={Boolean(createErrors.code)}
                    className={createErrors.code ? "border-rose-500 ring-1 ring-rose-500/20 font-mono" : "font-mono"}
                  />
                  {createErrors.code && (
                    <p className="text-xs text-rose-600 font-semibold">{createErrors.code}</p>
                  )}
                </div>

                {/* Governing Ethics Board */}
                <div className="space-y-1.5">
                  <Label htmlFor="create-board" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Governing Ethics Board <span className="text-rose-500">*</span>
                  </Label>
                  <Select
                    value={createForm.board}
                    onValueChange={(val) =>
                      setCreateForm((p) => ({ ...p, board: val as CreateResearchCategoryInput["board"] }))
                    }
                  >
                    <SelectTrigger id="create-board">
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

                {/* Standard Fee in BDT */}
                <div className="space-y-1.5">
                  <Label htmlFor="create-price" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Standard Fee (BDT ৳) <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="create-price"
                    type="number"
                    min={0}
                    step={500}
                    value={createForm.priceBdt}
                    onChange={(e) => {
                      const val = Number(e.target.value) || 0
                      setCreateForm((p) => ({ ...p, priceBdt: val }))
                      if (createErrors.priceBdt) setCreateErrors((p) => ({ ...p, priceBdt: "" }))
                    }}
                    aria-invalid={Boolean(createErrors.priceBdt)}
                    className={createErrors.priceBdt ? "border-rose-500 ring-1 ring-rose-500/20 font-mono" : "font-mono"}
                  />
                  {createErrors.priceBdt && (
                    <p className="text-xs text-rose-600 font-semibold">{createErrors.priceBdt}</p>
                  )}
                </div>

                {/* Estimated Turnaround Days */}
                <div className="space-y-1.5">
                  <Label htmlFor="create-turnaround" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Turnaround Velocity (Days) <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="create-turnaround"
                    type="number"
                    min={1}
                    max={90}
                    value={createForm.turnaroundDays}
                    onChange={(e) => {
                      const val = Number(e.target.value) || 14
                      setCreateForm((p) => ({ ...p, turnaroundDays: val }))
                    }}
                    className="font-mono"
                  />
                </div>

                {/* Expedited Review Allowed Checkbox & Surcharge */}
                <div className="sm:col-span-2 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="create-expedited-toggle"
                      checked={createForm.expeditedAllowed}
                      onCheckedChange={(checked) =>
                        setCreateForm((p) => ({ ...p, expeditedAllowed: Boolean(checked) }))
                      }
                    />
                    <Label
                      htmlFor="create-expedited-toggle"
                      className="text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
                    >
                      Enable Fast-Track Expedited Review (72-Hour Triage)
                    </Label>
                  </div>

                  {createForm.expeditedAllowed && (
                    <div className="space-y-1.5 pl-6 pt-1">
                      <Label htmlFor="create-expedited-fee" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Expedited Surcharge (BDT ৳)
                      </Label>
                      <Input
                        id="create-expedited-fee"
                        type="number"
                        min={0}
                        step={500}
                        value={createForm.expeditedFeeBdt}
                        onChange={(e) =>
                          setCreateForm((p) => ({
                            ...p,
                            expeditedFeeBdt: Number(e.target.value) || 0,
                          }))
                        }
                        className="font-mono"
                      />
                    </div>
                  )}
                </div>

                {/* Default Ethics Risk Tier */}
                <div className="space-y-1.5">
                  <Label htmlFor="create-risk" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Default Ethics Risk Tier
                  </Label>
                  <Select
                    value={createForm.riskDefault}
                    onValueChange={(val) =>
                      setCreateForm((p) => ({
                        ...p,
                        riskDefault: val as CreateResearchCategoryInput["riskDefault"],
                      }))
                    }
                  >
                    <SelectTrigger id="create-risk">
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

                {/* Intake Status */}
                <div className="space-y-1.5">
                  <Label htmlFor="create-status" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Initial Status
                  </Label>
                  <Select
                    value={createForm.status}
                    onValueChange={(val) =>
                      setCreateForm((p) => ({
                        ...p,
                        status: val as CreateResearchCategoryInput["status"],
                      }))
                    }
                  >
                    <SelectTrigger id="create-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active (Intake Open)</SelectItem>
                      <SelectItem value="Inactive">Inactive (Suspended)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Scientific Scope Description */}
                <div className="sm:col-span-2 space-y-1.5">
                  <Label htmlFor="create-desc" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Scientific Scope & Guidance Description <span className="text-rose-500">*</span>
                  </Label>
                  <Textarea
                    id="create-desc"
                    rows={3}
                    value={createForm.description}
                    onChange={(e) => {
                      setCreateForm((p) => ({ ...p, description: e.target.value }))
                      if (createErrors.description)
                        setCreateErrors((p) => ({ ...p, description: "" }))
                    }}
                    placeholder="Provide clear institutional guidance on what research methodologies fall under this category..."
                    aria-invalid={Boolean(createErrors.description)}
                    className={createErrors.description ? "border-rose-500 ring-1 ring-rose-500/20" : ""}
                  />
                  {createErrors.description && (
                    <p className="text-xs text-rose-600 font-semibold">{createErrors.description}</p>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#002752] hover:bg-[#001c3d] text-white"
              >
                Create Category
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Modal: Edit Research Category & BDT Price ──────────────────────── */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {categoryToEdit && (
            <form onSubmit={handleEditSubmit}>
              <DialogHeader>
                <DialogTitle className="text-lg font-black text-[#002752] dark:text-white flex items-center gap-2">
                  <Edit2 className="size-5 text-[#198754]" />
                  <span>Edit Category: {categoryToEdit.code}</span>
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Update scientific scope, IRB board assignment, or adjust pricing in Bangladeshi Taka (BDT ৳).
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category Name */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <Label htmlFor="edit-name" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Category Name <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="edit-name"
                      value={editForm.name || ""}
                      onChange={(e) => {
                        setEditForm((p) => ({ ...p, name: e.target.value }))
                        if (editErrors.name) setEditErrors((p) => ({ ...p, name: "" }))
                      }}
                      aria-invalid={Boolean(editErrors.name)}
                      className={editErrors.name ? "border-rose-500 ring-1 ring-rose-500/20" : ""}
                    />
                    {editErrors.name && (
                      <p className="text-xs text-rose-600 font-semibold">{editErrors.name}</p>
                    )}
                  </div>

                  {/* Category Code */}
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-code" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Category Code <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="edit-code"
                      value={editForm.code || ""}
                      onChange={(e) => {
                        setEditForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))
                        if (editErrors.code) setEditErrors((p) => ({ ...p, code: "" }))
                      }}
                      className="font-mono"
                    />
                  </div>

                  {/* Governing Ethics Board */}
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-board" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Governing Ethics Board
                    </Label>
                    <Select
                      value={editForm.board}
                      onValueChange={(val) =>
                        setEditForm((p) => ({ ...p, board: val as UpdateResearchCategoryInput["board"] }))
                      }
                    >
                      <SelectTrigger id="edit-board">
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

                  {/* Standard Fee in BDT */}
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-price" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Standard Fee (BDT ৳) <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="edit-price"
                      type="number"
                      min={0}
                      step={500}
                      value={editForm.priceBdt ?? 0}
                      onChange={(e) => {
                        const val = Number(e.target.value) || 0
                        setEditForm((p) => ({ ...p, priceBdt: val }))
                      }}
                      className="font-mono"
                    />
                  </div>

                  {/* Estimated Turnaround Days */}
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-turnaround" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Turnaround Velocity (Days)
                    </Label>
                    <Input
                      id="edit-turnaround"
                      type="number"
                      min={1}
                      max={90}
                      value={editForm.turnaroundDays ?? 14}
                      onChange={(e) => {
                        const val = Number(e.target.value) || 14
                        setEditForm((p) => ({ ...p, turnaroundDays: val }))
                      }}
                      className="font-mono"
                    />
                  </div>

                  {/* Expedited Toggle & Surcharge */}
                  <div className="sm:col-span-2 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 space-y-3">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="edit-expedited-toggle"
                        checked={editForm.expeditedAllowed ?? false}
                        onCheckedChange={(checked) =>
                          setEditForm((p) => ({ ...p, expeditedAllowed: Boolean(checked) }))
                        }
                      />
                      <Label
                        htmlFor="edit-expedited-toggle"
                        className="text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
                      >
                        Enable Fast-Track Expedited Review (72-Hour Triage)
                      </Label>
                    </div>

                    {editForm.expeditedAllowed && (
                      <div className="space-y-1.5 pl-6 pt-1">
                        <Label htmlFor="edit-expedited-fee" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Expedited Surcharge (BDT ৳)
                        </Label>
                        <Input
                          id="edit-expedited-fee"
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

                  {/* Default Risk Tier */}
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-risk" className="text-xs font-bold text-slate-700 dark:text-slate-300">
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
                      <SelectTrigger id="edit-risk">
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

                  {/* Status Toggle */}
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-status" className="text-xs font-bold text-slate-700 dark:text-slate-300">
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
                      <SelectTrigger id="edit-status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active (Intake Open)</SelectItem>
                        <SelectItem value="Inactive">Inactive (Suspended)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Description */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <Label htmlFor="edit-desc" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Scientific Scope & Description <span className="text-rose-500">*</span>
                    </Label>
                    <Textarea
                      id="edit-desc"
                      rows={3}
                      value={editForm.description || ""}
                      onChange={(e) => {
                        setEditForm((p) => ({ ...p, description: e.target.value }))
                        if (editErrors.description)
                          setEditErrors((p) => ({ ...p, description: "" }))
                      }}
                      className={editErrors.description ? "border-rose-500 ring-1 ring-rose-500/20" : ""}
                    />
                    {editErrors.description && (
                      <p className="text-xs text-rose-600 font-semibold">{editErrors.description}</p>
                    )}
                  </div>
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#002752] hover:bg-[#001c3d] text-white"
                >
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Modal: Delete Confirmation (AlertDialog) ──────────────────────── */}
      <AlertDialog
        open={Boolean(categoryToDelete)}
        onOpenChange={(open) => {
          if (!open) setCategoryToDelete(null)
        }}
      >
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-black text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <ShieldAlert className="size-5" />
              <span>Confirm Category Removal</span>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete the research category{" "}
              <strong className="text-slate-900 dark:text-white">
                {categoryToDelete?.name} ({categoryToDelete?.code})
              </strong>
              ? This action removes its BDT fee structure from the institutional schedule. Existing submitted protocols will retain their historical fee snapshots.
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
