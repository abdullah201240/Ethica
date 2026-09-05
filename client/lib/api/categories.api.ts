import { apiFetch } from "./client"
import {
  type ResearchCategory,
  type CreateResearchCategoryInput,
  type UpdateResearchCategoryInput,
} from "@/lib/schemas"

export interface CategoryFilters {
  board?: string
  status?: string
  risk?: string
}

export const categoriesApi = {
  getAll: async (filters?: CategoryFilters): Promise<ResearchCategory[]> => {
    const params = new URLSearchParams()
    if (filters?.board && filters.board !== "all") params.set("board", filters.board)
    if (filters?.status && filters.status !== "all") params.set("status", filters.status)
    if (filters?.risk && filters.risk !== "all") params.set("risk", filters.risk)

    const query = params.toString() ? `?${params.toString()}` : ""
    return apiFetch<ResearchCategory[]>(`/api/categories${query}`)
  },

  getById: async (id: string): Promise<ResearchCategory> => {
    return apiFetch<ResearchCategory>(`/api/categories/${encodeURIComponent(id)}`)
  },

  create: async (data: CreateResearchCategoryInput): Promise<ResearchCategory> => {
    return apiFetch<ResearchCategory>("/api/categories", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  update: async (
    id: string,
    updates: UpdateResearchCategoryInput
  ): Promise<ResearchCategory> => {
    return apiFetch<ResearchCategory>(`/api/categories/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    })
  },

  delete: async (id: string): Promise<{ id: string; deleted: boolean }> => {
    return apiFetch<{ id: string; deleted: boolean }>(
      `/api/categories/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
      }
    )
  },

  toggleStatus: async (id: string): Promise<ResearchCategory> => {
    return apiFetch<ResearchCategory>(
      `/api/categories/${encodeURIComponent(id)}/toggle`,
      {
        method: "POST",
      }
    )
  },
}
