"use client"

import * as React from "react"
import {
  Search,
  X,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
  RotateCcw,
  FileQuestion,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"

// ─────────────────────────────────────────────────────────────────────────────
// Type Definitions
// ─────────────────────────────────────────────────────────────────────────────

export interface ColumnDef<T> {
  /** Unique key for the column */
  id?: string
  /** Column header title or custom render function */
  header:
    | React.ReactNode
    | ((context: {
        isSorted: "asc" | "desc" | false
        toggleSorting: () => void
      }) => React.ReactNode)
  /** Key on row object to access cell value */
  accessorKey?: keyof T
  /** Function to retrieve value for sorting and display */
  accessorFn?: (row: T) => unknown
  /** Custom cell render function */
  cell?: (context: { row: T; index: number; value: unknown }) => React.ReactNode
  /** Enable column sorting */
  sortable?: boolean
  /** Custom comparator for sorting */
  sortComparator?: (a: T, b: T) => number
  /** Additional CSS class for table body cells */
  className?: string
  /** Additional CSS class for the header cell */
  headerClassName?: string
  /** Column horizontal alignment */
  align?: "left" | "center" | "right"
}

export interface DataTableFilterOption {
  label: string
  value: string
  badge?: string | number
}

export interface DataTableFilter<T> {
  id: string
  title: string
  accessorKey?: keyof T
  filterFn?: (row: T, selectedValue: string) => boolean
  options: DataTableFilterOption[]
}

export interface DataTableProps<T> {
  /** Source data items */
  data: T[]
  /** Column definitions */
  columns: ColumnDef<T>[]
  /** Optional table title */
  title?: React.ReactNode
  /** Optional table subtitle / description */
  description?: React.ReactNode
  /** Searchable key or accessor functions. Defaults to searching all primitive fields */
  searchKeys?: (keyof T | ((row: T) => string))[]
  /** Placeholder text for search input */
  searchPlaceholder?: string
  /** Faceted category filter configurations */
  filters?: DataTableFilter<T>[]
  /** Default rows per page (default: 10) */
  initialPageSize?: number
  /** Allowed rows per page options (default: [5, 10, 20, 50]) */
  pageSizeOptions?: number[]
  /** Initial sorting state */
  initialSort?: {
    columnId: string
    direction: "asc" | "desc"
  }
  /** Custom actions in the toolbar (e.g. Export button, Create button) */
  toolbarActions?: React.ReactNode
  /** Custom empty state when no results match */
  emptyState?: React.ReactNode
  emptyTitle?: string
  emptyDescription?: string
  /** Row click callback */
  onRowClick?: (row: T) => void
  /** Root container className */
  className?: string
  /** Table wrapper className */
  tableWrapperClassName?: string
  /** Hide search bar (default: false) */
  showSearch?: boolean
  /** Hide pagination footer (default: false) */
  showPagination?: boolean
  /** Hide page size select (default: false) */
  showPageSize?: boolean
  /** Total count label or badge in header */
  totalCountBadge?: React.ReactNode
  /** Whether the table is in a loading state */
  isLoading?: boolean
  /** Number of skeleton rows to display when isLoading is true (default: 5) */
  skeletonRowCount?: number
}

// ─────────────────────────────────────────────────────────────────────────────
// DataTable Component (Composed 100% with Ethica UI Primitives)
// ─────────────────────────────────────────────────────────────────────────────

export function DataTable<T extends object>({
  data,
  columns,
  title,
  description,
  searchKeys,
  searchPlaceholder = "Search records...",
  filters = [],
  initialPageSize = 10,
  pageSizeOptions = [5, 10, 20, 50],
  initialSort,
  toolbarActions,
  emptyState,
  emptyTitle = "No records found",
  emptyDescription = "No data matches your current search or filter criteria.",
  onRowClick,
  className,
  tableWrapperClassName,
  showSearch = true,
  showPagination = true,
  showPageSize = true,
  totalCountBadge,
  isLoading = false,
  skeletonRowCount = 5,
}: DataTableProps<T>) {
  // ── State ──────────────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = React.useState("")
  const [activeFilters, setActiveFilters] = React.useState<Record<string, string>>({})
  const [sortColumn, setSortColumn] = React.useState<string | null>(
    initialSort?.columnId ?? null
  )
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc" | null>(
    initialSort?.direction ?? null
  )
  const [pageSize, setPageSize] = React.useState<number>(initialPageSize)
  const [currentPage, setCurrentPage] = React.useState<number>(1)

  // ── Filter & Search Logic ──────────────────────────────────────────────────
  const filteredData = React.useMemo(() => {
    return data.filter((row) => {
      // 1. Search Query
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase().trim()

        if (searchKeys && searchKeys.length > 0) {
          const matches = searchKeys.some((key) => {
            if (typeof key === "function") {
              const val = key(row)
              return val != null && String(val).toLowerCase().includes(query)
            }
            const val = (row as Record<string, unknown>)[key as string]
            return val != null && String(val).toLowerCase().includes(query)
          })
          if (!matches) return false
        } else {
          // Default: search all string/number columns
          const matches = Object.values(row).some((val) => {
            if (val == null) return false
            if (typeof val === "string" || typeof val === "number") {
              return String(val).toLowerCase().includes(query)
            }
            return false
          })
          if (!matches) return false
        }
      }

      // 2. Faceted Filters
      for (const filter of filters) {
        const selectedValue = activeFilters[filter.id]
        if (selectedValue && selectedValue !== "all") {
          if (filter.filterFn) {
            if (!filter.filterFn(row, selectedValue)) return false
          } else if (filter.accessorKey) {
            const rowValue = String((row as Record<string, unknown>)[filter.accessorKey as string] ?? "")
            if (rowValue !== selectedValue) return false
          }
        }
      }

      return true
    })
  }, [data, searchQuery, searchKeys, filters, activeFilters])

  // ── Sorting Logic ──────────────────────────────────────────────────────────
  const sortedData = React.useMemo(() => {
    if (!sortColumn || !sortDirection) return filteredData

    const colDef = columns.find(
      (c) => (c.id ?? String(c.accessorKey)) === sortColumn
    )
    if (!colDef) return filteredData

    const sorted = [...filteredData].sort((a, b) => {
      if (colDef.sortComparator) {
        const res = colDef.sortComparator(a, b)
        return sortDirection === "asc" ? res : -res
      }

      const valA = colDef.accessorFn
        ? colDef.accessorFn(a)
        : colDef.accessorKey
        ? (a as Record<string, unknown>)[colDef.accessorKey as string]
        : null

      const valB = colDef.accessorFn
        ? colDef.accessorFn(b)
        : colDef.accessorKey
        ? (b as Record<string, unknown>)[colDef.accessorKey as string]
        : null

      if (valA == null && valB == null) return 0
      if (valA == null) return 1
      if (valB == null) return -1

      if (typeof valA === "number" && typeof valB === "number") {
        return sortDirection === "asc" ? valA - valB : valB - valA
      }

      const strA = String(valA).toLowerCase()
      const strB = String(valB).toLowerCase()
      const res = strA.localeCompare(strB)
      return sortDirection === "asc" ? res : -res
    })

    return sorted
  }, [filteredData, sortColumn, sortDirection, columns])

  // ── Pagination Math ────────────────────────────────────────────────────────
  const totalRows = sortedData.length
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize))
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages)
  const startIndex = (safeCurrentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalRows)
  const paginatedRows = sortedData.slice(startIndex, endIndex)

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleSort = (colId: string) => {
    if (sortColumn === colId) {
      if (sortDirection === "asc") setSortDirection("desc")
      else if (sortDirection === "desc") {
        setSortColumn(null)
        setSortDirection(null)
      }
    } else {
      setSortColumn(colId)
      setSortDirection("asc")
    }
  }

  const handleSearchChange = (val: string) => {
    setSearchQuery(val)
    setCurrentPage(1)
  }

  const handleFilterChange = (filterId: string, value: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterId]: value,
    }))
    setCurrentPage(1)
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(1)
  }

  const handleResetFilters = () => {
    setSearchQuery("")
    setActiveFilters({})
    setSortColumn(initialSort?.columnId ?? null)
    setSortDirection(initialSort?.direction ?? null)
    setCurrentPage(1)
  }

  const activeFilterCount =
    (searchQuery ? 1 : 0) +
    Object.values(activeFilters).filter((v) => v && v !== "all").length

  // Generate smart pagination page numbers
  const pageNumbers = React.useMemo(() => {
    const pages: (number | "ellipsis")[] = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (safeCurrentPage > 3) pages.push("ellipsis")
      const start = Math.max(2, safeCurrentPage - 1)
      const end = Math.min(totalPages - 1, safeCurrentPage + 1)
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i)
      }
      if (safeCurrentPage < totalPages - 2) pages.push("ellipsis")
      if (!pages.includes(totalPages)) pages.push(totalPages)
    }
    return pages
  }, [totalPages, safeCurrentPage])

  return (
    <Card
      className={cn(
        "w-full rounded-none sm:rounded-2xl border-y sm:border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] overflow-hidden shadow-xs py-0 gap-0",
        className
      )}
    >
      {/* ── Optional Title & Description Header using CardHeader ───────────── */}
      {(title || description || totalCountBadge) && (
        <CardHeader className="p-4 sm:p-6 border-b border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              {typeof title === "string" ? (
                <CardTitle className="text-lg sm:text-xl font-black text-[#002752] dark:text-white uppercase tracking-tight">
                  {title}
                </CardTitle>
              ) : (
                title
              )}
              {totalCountBadge ?? (
                <Badge
                  variant="secondary"
                  className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  {totalRows} {totalRows === 1 ? "Record" : "Records"}
                </Badge>
              )}
            </div>
            {description && (
              <CardDescription className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                {description}
              </CardDescription>
            )}
          </div>
          {toolbarActions && (
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              {toolbarActions}
            </div>
          )}
        </CardHeader>
      )}

      {/* ── Toolbar: Search, Filters, Page Size & Clear ──────────────────────── */}
      {(showSearch || filters.length > 0 || activeFilterCount > 0) && (
        <div className="p-3 sm:p-4 bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-200/75 dark:border-slate-800/80 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Left: Search Input & Faceted Filters */}
          <div className="flex flex-1 flex-wrap items-center gap-2.5 min-w-0">
            {/* Search Input using UI Input component */}
            {showSearch && (
              <div className="relative w-full sm:w-72 md:w-80 shrink-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none z-10" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="h-9 pl-9 pr-8 bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-700/80 text-xs sm:text-sm"
                  aria-label="Search records"
                />
                {searchQuery && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => handleSearchChange("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    aria-label="Clear search"
                  >
                    <X className="size-3" />
                  </Button>
                )}
              </div>
            )}

            {/* Faceted Filters using UI DropdownMenu */}
            {filters.map((filter) => {
              const currentValue = activeFilters[filter.id] ?? "all"
              const currentOption = filter.options.find(
                (opt) => opt.value === currentValue
              )
              const isFiltered = currentValue !== "all"

              return (
                <div key={filter.id} className="relative shrink-0">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className={cn(
                            "h-9 gap-2 text-xs font-semibold rounded-lg bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800",
                            isFiltered &&
                              "border-[#002752]/40 bg-slate-50 dark:bg-slate-800 text-[#002752] dark:text-sky-300 font-bold"
                          )}
                          aria-label={`Filter by ${filter.title}`}
                        >
                          <Filter className="size-3.5 text-muted-foreground shrink-0" />
                          <span className="truncate max-w-32">
                            {currentOption
                              ? currentOption.label
                              : `All ${filter.title}s`}
                          </span>
                          <ChevronDown className="size-3.5 text-muted-foreground shrink-0 opacity-70" />
                        </Button>
                      }
                    />
                    <DropdownMenuContent align="start" className="min-w-44 p-1">
                      <DropdownMenuRadioGroup
                        value={currentValue}
                        onValueChange={(val) => handleFilterChange(filter.id, val)}
                      >
                        <DropdownMenuLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-2 py-1.5">
                          Filter by {filter.title}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioItem
                          value="all"
                          className="text-xs sm:text-sm font-medium cursor-pointer py-1.5 px-2"
                        >
                          All {filter.title}s
                        </DropdownMenuRadioItem>
                        {filter.options.map((opt) => (
                          <DropdownMenuRadioItem
                            key={opt.value}
                            value={opt.value}
                            className="text-xs sm:text-sm font-medium cursor-pointer py-1.5 px-2 flex items-center justify-between"
                          >
                            <span>{opt.label}</span>
                            {opt.badge != null && (
                              <Badge
                                variant="outline"
                                className="text-xs ml-2 px-1.5 py-0 font-mono"
                              >
                                {opt.badge}
                              </Badge>
                            )}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )
            })}

            {/* Reset Filters Action using UI Button & Badge */}
            {activeFilterCount > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="h-8 gap-1.5 px-2.5 text-xs sm:text-sm font-bold text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                title="Reset active search and filters"
              >
                <RotateCcw className="size-3" />
                <span>Reset</span>
                <Badge
                  variant="outline"
                  className="size-4 p-0 rounded-full font-mono text-xs items-center justify-center border-slate-300 dark:border-slate-700"
                >
                  {activeFilterCount}
                </Badge>
              </Button>
            )}
          </div>

          {/* Right: Page Size Selector using UI DropdownMenu */}
          <div className="flex items-center gap-3 self-end lg:self-center shrink-0">
            {showPageSize && (
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                <span className="hidden sm:inline">Rows per page:</span>
                <span className="sm:hidden">Show:</span>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1.5 px-2.5 text-xs sm:text-sm font-bold bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-700/80 rounded-lg text-slate-800 dark:text-slate-200"
                        aria-label="Select rows per page"
                      >
                        <span>{pageSize}</span>
                        <ChevronDown className="size-3 text-muted-foreground" />
                      </Button>
                    }
                  />
                  <DropdownMenuContent align="end" className="min-w-28 p-1">
                    <DropdownMenuRadioGroup
                      value={String(pageSize)}
                      onValueChange={(val) => handlePageSizeChange(Number(val))}
                    >
                      <DropdownMenuLabel className="text-xs uppercase font-bold text-muted-foreground px-2 py-1">
                        Rows per page
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {pageSizeOptions.map((opt) => (
                        <DropdownMenuRadioItem
                          key={opt}
                          value={String(opt)}
                          className="text-xs font-bold cursor-pointer py-1.5 px-2"
                        >
                          {opt} rows
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Table Viewport Container using UI Table Primitives ─────────────── */}
      <div
        className={cn(
          "w-full selection:bg-[#198754]/20 selection:text-[#002752]",
          tableWrapperClassName
        )}
      >
        <Table>
          {/* Table Header using UI TableHeader & TableHead */}
          <TableHeader>
            <TableRow className="bg-slate-50/90 dark:bg-slate-900/60 border-b border-slate-200/85 dark:border-slate-800 hover:bg-slate-50/90 dark:hover:bg-slate-900/60">
              {columns.map((col, idx) => {
                const colId = col.id ?? String(col.accessorKey ?? idx)
                const isCurrentSorted = sortColumn === colId
                const currentDirection = isCurrentSorted ? sortDirection : false

                return (
                  <TableHead
                    key={colId}
                    className={cn(
                      "px-4 py-3.5 text-sm sm:text-base font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 whitespace-nowrap select-none h-auto",
                      col.align === "center"
                        ? "text-center"
                        : col.align === "right"
                        ? "text-right"
                        : "text-left",
                      col.headerClassName
                    )}
                  >
                    {col.sortable ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="xs"
                        onClick={() => handleSort(colId)}
                        className={cn(
                          "h-auto p-0 hover:bg-transparent font-bold tracking-wider uppercase text-slate-500 hover:text-[#002752] dark:text-slate-400 dark:hover:text-white transition-colors gap-1.5",
                          isCurrentSorted &&
                            "text-[#002752] dark:text-sky-300 font-black"
                        )}
                        aria-label={`Sort by ${colId}`}
                      >
                        <span>
                          {typeof col.header === "function"
                            ? col.header({
                                isSorted: currentDirection ?? false,
                                toggleSorting: () => handleSort(colId),
                              })
                            : col.header}
                        </span>
                        <span className="shrink-0 text-slate-400 transition-colors">
                          {isCurrentSorted && sortDirection === "asc" ? (
                            <ArrowUp className="size-3.5 text-[#002752] dark:text-sky-400" />
                          ) : isCurrentSorted && sortDirection === "desc" ? (
                            <ArrowDown className="size-3.5 text-[#002752] dark:text-sky-400" />
                          ) : (
                            <ArrowUpDown className="size-3 opacity-60 hover:opacity-100" />
                          )}
                        </span>
                      </Button>
                    ) : typeof col.header === "function" ? (
                      col.header({
                        isSorted: false,
                        toggleSorting: () => {},
                      })
                    ) : (
                      col.header
                    )}
                  </TableHead>
                )
              })}
            </TableRow>
          </TableHeader>

          {/* Table Body using UI TableBody, TableRow & TableCell */}
          <TableBody className="divide-y divide-slate-200/70 dark:divide-slate-800">
            {isLoading ? (
              Array.from({ length: skeletonRowCount }).map((_, rIdx) => (
                <TableRow
                  key={`skeleton-row-${rIdx}`}
                  className="border-b border-slate-200/60 dark:border-slate-800/80"
                >
                  {columns.map((col, cIdx) => (
                    <TableCell
                      key={`skeleton-cell-${rIdx}-${col.id ?? String(col.accessorKey ?? cIdx)}`}
                      className={cn(
                        "px-4 py-4 align-middle",
                        col.align === "center"
                          ? "text-center"
                          : col.align === "right"
                          ? "text-right"
                          : "text-left",
                        col.className
                      )}
                    >
                      <Skeleton
                        className={cn(
                          "h-4 rounded-md",
                          cIdx === 0
                            ? "w-3/4"
                            : cIdx === 1
                            ? "w-1/2"
                            : cIdx === columns.length - 1
                            ? "w-16 ml-auto"
                            : "w-2/3"
                        )}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : paginatedRows.length > 0 ? (
              paginatedRows.map((row, rowIdx) => (
                <TableRow
                  key={
                    (row as { id?: string | number }).id != null
                      ? String((row as { id?: string | number }).id)
                      : `row-${startIndex + rowIdx}`
                  }
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    "group transition-colors border-b border-slate-200/60 dark:border-slate-800/80",
                    onRowClick && "cursor-pointer",
                    "hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                  )}
                >
                  {columns.map((col, colIdx) => {
                    const colId = col.id ?? String(col.accessorKey ?? colIdx)
                    const cellValue = col.accessorFn
                      ? col.accessorFn(row)
                      : col.accessorKey
                      ? (row as Record<string, unknown>)[col.accessorKey as string]
                      : null

                    return (
                      <TableCell
                        key={colId}
                        className={cn(
                          "px-4 py-4 align-middle text-slate-700 dark:text-slate-200 text-base whitespace-normal",
                          col.align === "center"
                            ? "text-center"
                            : col.align === "right"
                            ? "text-right"
                            : "text-left",
                          col.className
                        )}
                      >
                        {col.cell
                          ? col.cell({
                              row,
                              index: startIndex + rowIdx,
                              value: cellValue,
                            })
                          : cellValue != null
                          ? String(cellValue)
                          : "—"}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            ) : (
              /* Empty State using UI TableRow & TableCell */
              <TableRow>
                <TableCell colSpan={columns.length} className="py-14 text-center">
                  {emptyState ?? (
                    <div className="max-w-sm mx-auto space-y-3 px-4">
                      <div className="size-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto shadow-2xs">
                        <FileQuestion className="size-6" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        {emptyTitle}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {emptyDescription}
                      </p>
                      {activeFilterCount > 0 && (
                        <Button
                          type="button"
                          variant="link"
                          size="sm"
                          onClick={handleResetFilters}
                          className="gap-1.5 text-xs font-bold text-[#002752] dark:text-sky-400 pt-1 h-auto p-0"
                        >
                          <RotateCcw className="size-3" />
                          <span>Clear filters and search query</span>
                        </Button>
                      )}
                    </div>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Pagination Footer using UI Pagination Component ─────────────────── */}
      {showPagination && totalRows > 0 && (
        <div className="px-4 py-3 sm:px-6 sm:py-3.5 bg-slate-50/60 dark:bg-slate-900/40 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Result Counter */}
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium text-center sm:text-left">
            Showing <strong className="text-slate-800 dark:text-slate-200 tabular-nums">{totalRows > 0 ? startIndex + 1 : 0}</strong> to{" "}
            <strong className="text-slate-800 dark:text-slate-200 tabular-nums">{endIndex}</strong> of{" "}
            <strong className="text-slate-800 dark:text-slate-200 tabular-nums">{totalRows}</strong> {totalRows === 1 ? "entry" : "entries"}
            {searchQuery && (
              <span className="ml-1 text-slate-400 dark:text-slate-500">
                (filtered from {data.length} total)
              </span>
            )}
          </div>

          {/* Navigation Controls using UI Pagination Primitives */}
          {totalPages > 1 && (
            <Pagination className="mx-0 w-auto">
              <PaginationContent className="gap-1">
                {/* First Page using UI PaginationLink */}
                <PaginationItem>
                  <PaginationLink
                    href="#first"
                    onClick={(e) => {
                      e.preventDefault()
                      if (safeCurrentPage > 1) setCurrentPage(1)
                    }}
                    className={cn(
                      "size-8 rounded-lg border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors",
                      safeCurrentPage === 1 && "pointer-events-none opacity-40"
                    )}
                    title="First page"
                    aria-label="First page"
                  >
                    <ChevronsLeft className="size-4" />
                  </PaginationLink>
                </PaginationItem>

                {/* Previous Page using UI PaginationPrevious */}
                <PaginationItem>
                  <PaginationPrevious
                    href="#prev"
                    onClick={(e) => {
                      e.preventDefault()
                      if (safeCurrentPage > 1) setCurrentPage(safeCurrentPage - 1)
                    }}
                    className={cn(
                      "size-8 rounded-lg border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors",
                      safeCurrentPage === 1 && "pointer-events-none opacity-40"
                    )}
                    title="Previous page"
                  />
                </PaginationItem>

                {/* Numbered Page Buttons using UI PaginationLink / PaginationEllipsis */}
                {pageNumbers.map((page, idx) => (
                  <PaginationItem key={`page-${idx}`}>
                    {page === "ellipsis" ? (
                      <PaginationEllipsis className="size-8 text-slate-400" />
                    ) : (
                      <PaginationLink
                        href={`#page-${page}`}
                        isActive={page === safeCurrentPage}
                        onClick={(e) => {
                          e.preventDefault()
                          setCurrentPage(page)
                        }}
                        className={cn(
                          "size-8 rounded-lg text-xs font-bold transition-colors",
                          page === safeCurrentPage
                            ? "bg-[#002752] text-white shadow-xs dark:bg-sky-500 dark:text-[#002752]"
                            : "border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                        )}
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                {/* Next Page using UI PaginationNext */}
                <PaginationItem>
                  <PaginationNext
                    href="#next"
                    onClick={(e) => {
                      e.preventDefault()
                      if (safeCurrentPage < totalPages) setCurrentPage(safeCurrentPage + 1)
                    }}
                    className={cn(
                      "size-8 rounded-lg border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors",
                      safeCurrentPage === totalPages && "pointer-events-none opacity-40"
                    )}
                    title="Next page"
                  />
                </PaginationItem>

                {/* Last Page using UI PaginationLink */}
                <PaginationItem>
                  <PaginationLink
                    href="#last"
                    onClick={(e) => {
                      e.preventDefault()
                      if (safeCurrentPage < totalPages) setCurrentPage(totalPages)
                    }}
                    className={cn(
                      "size-8 rounded-lg border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors",
                      safeCurrentPage === totalPages && "pointer-events-none opacity-40"
                    )}
                    title="Last page"
                    aria-label="Last page"
                  >
                    <ChevronsRight className="size-4" />
                  </PaginationLink>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      )}
    </Card>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Standalone DataTable Skeleton (For full-page router loaders)
// ─────────────────────────────────────────────────────────────────────────────

export interface DataTableSkeletonProps {
  columnCount?: number
  rowCount?: number
  showHeader?: boolean
  showToolbar?: boolean
  showPagination?: boolean
  className?: string
}

export function DataTableSkeleton({
  columnCount = 5,
  rowCount = 5,
  showHeader = true,
  showToolbar = true,
  showPagination = true,
  className,
}: DataTableSkeletonProps) {
  return (
    <Card
      className={cn(
        "w-full rounded-none sm:rounded-2xl border-y sm:border border-slate-200/85 dark:border-slate-800 bg-white dark:bg-[#0C1E34] overflow-hidden shadow-xs py-0 gap-0",
        className
      )}
    >
      {showHeader && (
        <CardHeader className="p-4 sm:p-6 border-b border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48 rounded-md" />
            <Skeleton className="h-4 w-72 rounded-md" />
          </div>
          <Skeleton className="h-9 w-28 rounded-md" />
        </CardHeader>
      )}

      {showToolbar && (
        <div className="p-3 sm:p-4 bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-200/75 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Skeleton className="h-9 w-full sm:w-72 rounded-md" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-24 rounded-md" />
            <Skeleton className="h-8 w-28 rounded-md" />
          </div>
        </div>
      )}

      <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/90 dark:bg-slate-900/60 border-b border-slate-200/85 dark:border-slate-800">
              {Array.from({ length: columnCount }).map((_, idx) => (
                <TableHead key={idx} className="px-4 py-3">
                  <Skeleton className="h-4 w-20 rounded-md" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-slate-200/70 dark:divide-slate-800">
            {Array.from({ length: rowCount }).map((_, rIdx) => (
              <TableRow
                key={rIdx}
                className="border-b border-slate-200/60 dark:border-slate-800/80"
              >
                {Array.from({ length: columnCount }).map((_, cIdx) => (
                  <TableCell key={cIdx} className="px-4 py-4">
                    <Skeleton
                      className={cn(
                        "h-4 rounded-md",
                        cIdx === 0
                          ? "w-3/4"
                          : cIdx === 1
                          ? "w-1/2"
                          : cIdx === columnCount - 1
                          ? "w-16 ml-auto"
                          : "w-2/3"
                      )}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {showPagination && (
        <div className="p-3 sm:p-4 bg-slate-50/50 dark:bg-slate-900/30 border-t border-slate-200/75 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Skeleton className="h-4 w-44 rounded-md" />
          <div className="flex items-center gap-1.5">
            <Skeleton className="size-8 rounded-lg" />
            <Skeleton className="size-8 rounded-lg" />
            <Skeleton className="size-8 rounded-lg" />
            <Skeleton className="size-8 rounded-lg" />
          </div>
        </div>
      )}
    </Card>
  )
}
