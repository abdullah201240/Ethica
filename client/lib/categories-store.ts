import {
  type ResearchCategory,
  type CreateResearchCategoryInput,
  type UpdateResearchCategoryInput,
  researchCategorySchema,
} from "@/lib/schemas"
import { z } from "zod"
import { categoriesApi } from "@/lib/api/categories.api"

export const initialCategories: ResearchCategory[] = [
  {
    id: "CAT-BIO-001",
    name: "Clinical Trial (Interventional)",
    code: "CLINICAL_TRIAL",
    board: "Biomedical IRB",
    description:
      "Interventional human subject clinical drug, device, vaccine, or therapy protocols requiring full committee quorum deliberation.",
    priceBdt: 20000,
    expeditedAllowed: true,
    expeditedFeeBdt: 5000,
    turnaroundDays: 21,
    riskDefault: "Greater Than Minimal",
    status: "Active",
    createdAt: "2026-01-10",
    updatedAt: "2026-08-15",
  },
  {
    id: "CAT-BIO-002",
    name: "Epidemiological & Observational",
    code: "EPIDEMIOLOGY",
    board: "Biomedical IRB",
    description:
      "Prospective and retrospective observational cohort studies, case-control analyses, and disease registry bio-surveillance.",
    priceBdt: 7500,
    expeditedAllowed: true,
    expeditedFeeBdt: 3000,
    turnaroundDays: 14,
    riskDefault: "Minimal Risk",
    status: "Active",
    createdAt: "2026-01-12",
    updatedAt: "2026-07-20",
  },
  {
    id: "CAT-SOC-001",
    name: "Social, Behavioral & Survey Research",
    code: "SOCIAL_BEHAVIORAL",
    board: "Social & Behavioral Board",
    description:
      "Quantitative questionnaires, qualitative interviews, psychometric evaluations, and human cognitive behavior field experiments.",
    priceBdt: 5000,
    expeditedAllowed: true,
    expeditedFeeBdt: 2500,
    turnaroundDays: 10,
    riskDefault: "Minimal Risk",
    status: "Active",
    createdAt: "2026-01-15",
    updatedAt: "2026-08-01",
  },
  {
    id: "CAT-AI-001",
    name: "AI, Machine Learning & Health Informatics",
    code: "AI_HEALTH_DATA",
    board: "AI & Data Ethics Board",
    description:
      "Algorithmic diagnostic models, electronic health record deep learning, medical computer vision, and patient privacy safety audits.",
    priceBdt: 12000,
    expeditedAllowed: true,
    expeditedFeeBdt: 4000,
    turnaroundDays: 14,
    riskDefault: "Minimal Risk",
    status: "Active",
    createdAt: "2026-02-01",
    updatedAt: "2026-08-22",
  },
  {
    id: "CAT-BIO-003",
    name: "Genomic, Biobanking & Biospecimens",
    code: "GENOMICS_BIOBANK",
    board: "Biomedical IRB",
    description:
      "High-throughput sequencing, genetic linkage studies, human tissue biorepository banking, and long-term DNA storage consent.",
    priceBdt: 25000,
    expeditedAllowed: true,
    expeditedFeeBdt: 6000,
    turnaroundDays: 28,
    riskDefault: "Greater Than Minimal",
    status: "Active",
    createdAt: "2026-02-10",
    updatedAt: "2026-07-30",
  },
  {
    id: "CAT-SOC-002",
    name: "Community & Public Health Intervention",
    code: "COMMUNITY_HEALTH",
    board: "Social & Behavioral Board",
    description:
      "Participatory action research in rural/urban communities, nutrition guidance programs, and healthcare accessibility field surveys.",
    priceBdt: 6500,
    expeditedAllowed: true,
    expeditedFeeBdt: 2500,
    turnaroundDays: 12,
    riskDefault: "Minimal Risk",
    status: "Active",
    createdAt: "2026-02-15",
    updatedAt: "2026-08-10",
  },
  {
    id: "CAT-SOC-003",
    name: "Educational & Curriculum Evaluation",
    code: "EDUCATIONAL_EVAL",
    board: "Social & Behavioral Board",
    description:
      "University classroom pedagogical assessments, teaching methodology efficacy evaluations, and educational survey instruments.",
    priceBdt: 3500,
    expeditedAllowed: false,
    expeditedFeeBdt: 0,
    turnaroundDays: 7,
    riskDefault: "Exempt - Fast Track",
    status: "Active",
    createdAt: "2026-03-01",
    updatedAt: "2026-06-14",
  },
  {
    id: "CAT-AI-002",
    name: "Secondary De-Identified Data Analytics",
    code: "DEIDENTIFIED_DATA",
    board: "AI & Data Ethics Board",
    description:
      "Retrospective studies on anonymized, publicly licensed, or fully de-identified clinical benchmark datasets without patient contact.",
    priceBdt: 4000,
    expeditedAllowed: true,
    expeditedFeeBdt: 2000,
    turnaroundDays: 7,
    riskDefault: "Exempt - Fast Track",
    status: "Inactive",
    createdAt: "2026-03-10",
    updatedAt: "2026-08-05",
  },
]

// In-Memory Repository Key & Cache
const CATEGORIES_KEY = "ethica_research_categories"
let cachedCategories: ResearchCategory[] = [...initialCategories]
let isCategoriesInitialized = false
const listeners = new Set<() => void>()

async function syncFromApi(): Promise<void> {
  try {
    const serverData = await categoriesApi.getAll()
    const validation = z.array(researchCategorySchema).safeParse(serverData)
    if (validation.success && validation.data.length > 0) {
      cachedCategories = validation.data
      if (typeof window !== "undefined") {
        localStorage.setItem(CATEGORIES_KEY, JSON.stringify(validation.data))
      }
      notifyCategoryChange()
    }
  } catch {
    // Offline or server unavailable fallback to local cache
  }
}

function initCategoriesFromStorage(): void {
  if (typeof window === "undefined" || isCategoriesInitialized) return
  isCategoriesInitialized = true
  try {
    const raw = localStorage.getItem(CATEGORIES_KEY)
    if (!raw) {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(initialCategories))
      cachedCategories = [...initialCategories]
      void syncFromApi()
      return
    }
    const parsed = JSON.parse(raw)
    const result = z.array(researchCategorySchema).safeParse(parsed)
    if (result.success && result.data.length > 0) {
      cachedCategories = result.data
    } else {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(initialCategories))
      cachedCategories = [...initialCategories]
    }
  } catch {
    cachedCategories = [...initialCategories]
  }
  void syncFromApi()
}

function notifyCategoryChange() {
  listeners.forEach((listener) => listener())
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("ethica:categories-updated"))
  }
}

export function getStoredCategories(): ResearchCategory[] {
  initCategoriesFromStorage()
  return cachedCategories
}

export function saveStoredCategories(categories: ResearchCategory[]): void {
  cachedCategories = categories
  if (typeof window !== "undefined") {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories))
  }
  notifyCategoryChange()
}

export function subscribeCategories(callback: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {}
  }
  listeners.add(callback)
  initCategoriesFromStorage()

  const storageHandler = (e: StorageEvent) => {
    if (e.key === CATEGORIES_KEY) {
      try {
        const raw = localStorage.getItem(CATEGORIES_KEY)
        if (raw) {
          const parsed = JSON.parse(raw)
          const result = z.array(researchCategorySchema).safeParse(parsed)
          if (result.success) {
            cachedCategories = result.data
          }
        }
      } catch {
        // Retain in-memory cache
      }
      notifyCategoryChange()
    }
  }

  window.addEventListener("storage", storageHandler)
  return () => {
    listeners.delete(callback)
    window.removeEventListener("storage", storageHandler)
  }
}

export function addCategory(input: CreateResearchCategoryInput): ResearchCategory {
  initCategoriesFromStorage()
  const current = cachedCategories
  const boardPrefix =
    input.board === "Biomedical IRB"
      ? "BIO"
      : input.board === "Social & Behavioral Board"
      ? "SOC"
      : "AI"
  const randomSuffix = Math.floor(100 + Math.random() * 900)
  const today = new Date().toISOString().split("T")[0]

  const newCategory: ResearchCategory = {
    ...input,
    id: `CAT-${boardPrefix}-${randomSuffix}`,
    code: input.code.toUpperCase().trim(),
    createdAt: today,
    updatedAt: today,
  }

  const updated = [newCategory, ...current]
  cachedCategories = updated
  if (typeof window !== "undefined") {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(updated))
  }
  notifyCategoryChange()
  return newCategory
}

export function updateCategory(
  id: string,
  updates: UpdateResearchCategoryInput
): ResearchCategory | undefined {
  initCategoriesFromStorage()
  const current = cachedCategories
  const index = current.findIndex((c) => c.id === id)
  if (index === -1) return undefined

  const today = new Date().toISOString().split("T")[0]
  const updatedItem: ResearchCategory = {
    ...current[index],
    ...updates,
    code: updates.code ? updates.code.toUpperCase().trim() : current[index].code,
    updatedAt: today,
  }

  const updatedList = [...current]
  updatedList[index] = updatedItem
  cachedCategories = updatedList

  if (typeof window !== "undefined") {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(updatedList))
  }
  notifyCategoryChange()
  return updatedItem
}

export function deleteCategory(id: string): boolean {
  initCategoriesFromStorage()
  const current = cachedCategories
  const filtered = current.filter((c) => c.id !== id)
  if (filtered.length === current.length) return false

  cachedCategories = filtered
  if (typeof window !== "undefined") {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(filtered))
  }
  notifyCategoryChange()
  return true
}

export function toggleCategoryStatus(id: string): ResearchCategory | undefined {
  initCategoriesFromStorage()
  const current = cachedCategories
  const cat = current.find((c) => c.id === id)
  if (!cat) return undefined

  const nextStatus = cat.status === "Active" ? "Inactive" : "Active"
  return updateCategory(id, { status: nextStatus })
}

