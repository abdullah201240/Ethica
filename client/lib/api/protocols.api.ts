import { apiFetch } from "./client"
import { type Protocol } from "@/lib/protocols-store"

export interface ProtocolFilters {
  board?: string
  status?: string
  risk?: string
}

export const protocolsApi = {
  getAll: async (filters?: ProtocolFilters): Promise<Protocol[]> => {
    const params = new URLSearchParams()
    if (filters?.board && filters.board !== "all") params.set("board", filters.board)
    if (filters?.status && filters.status !== "all") params.set("status", filters.status)
    if (filters?.risk && filters.risk !== "all") params.set("risk", filters.risk)

    const query = params.toString() ? `?${params.toString()}` : ""
    return apiFetch<Protocol[]>(`/api/protocols${query}`)
  },

  getById: async (id: string): Promise<Protocol> => {
    return apiFetch<Protocol>(`/api/protocols/${encodeURIComponent(id)}`)
  },

  create: async (data: Partial<Protocol>): Promise<Protocol> => {
    return apiFetch<Protocol>("/api/protocols", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  update: async (id: string, updates: Partial<Protocol>): Promise<Protocol> => {
    return apiFetch<Protocol>(`/api/protocols/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    })
  },

  delete: async (id: string): Promise<{ id: string; deleted: boolean }> => {
    return apiFetch<{ id: string; deleted: boolean }>(`/api/protocols/${encodeURIComponent(id)}`, {
      method: "DELETE",
    })
  },
}
