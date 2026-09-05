import { apiFetch } from "./client"
import { type PlatformUser, type UserStatus } from "@/lib/users-directory"
import { type CreatePlatformUserInput, type UpdatePlatformUserInput } from "@/lib/schemas"

export const usersDirectoryApi = {
  getAll: async (filters?: { pillar?: string; status?: string }): Promise<PlatformUser[]> => {
    const params = new URLSearchParams()
    if (filters?.pillar) params.set("pillar", filters.pillar)
    if (filters?.status) params.set("status", filters.status)
    const qs = params.toString()
    return apiFetch<PlatformUser[]>(`/api/users${qs ? `?${qs}` : ""}`)
  },

  getById: async (id: string): Promise<PlatformUser> => {
    return apiFetch<PlatformUser>(`/api/users/${encodeURIComponent(id)}`)
  },

  create: async (data: CreatePlatformUserInput): Promise<PlatformUser> => {
    return apiFetch<PlatformUser>("/api/users", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  update: async (id: string, updates: UpdatePlatformUserInput): Promise<PlatformUser> => {
    return apiFetch<PlatformUser>(`/api/users/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    })
  },

  delete: async (id: string): Promise<{ id: string; deleted: boolean }> => {
    return apiFetch<{ id: string; deleted: boolean }>(`/api/users/${encodeURIComponent(id)}`, {
      method: "DELETE",
    })
  },

  updateStatus: async (id: string, status: UserStatus): Promise<PlatformUser> => {
    return usersDirectoryApi.update(id, { status })
  },

  updateRole: async (id: string, role: string): Promise<PlatformUser> => {
    return usersDirectoryApi.update(id, { role })
  },
}
