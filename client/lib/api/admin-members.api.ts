import { apiFetch } from "./client"
import { type AdminMember } from "@/lib/admin-roster"
import { type CreateAdminMemberInput, type UpdateAdminMemberInput } from "@/lib/schemas"

export const adminMembersApi = {
  getAll: async (): Promise<AdminMember[]> => {
    return apiFetch<AdminMember[]>("/api/admin/members")
  },

  getById: async (id: string): Promise<AdminMember> => {
    return apiFetch<AdminMember>(`/api/admin/members/${encodeURIComponent(id)}`)
  },

  create: async (data: CreateAdminMemberInput): Promise<AdminMember> => {
    return apiFetch<AdminMember>("/api/admin/members", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  update: async (id: string, updates: UpdateAdminMemberInput): Promise<AdminMember> => {
    return apiFetch<AdminMember>(`/api/admin/members/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    })
  },

  delete: async (id: string): Promise<{ id: string; deleted: boolean }> => {
    return apiFetch<{ id: string; deleted: boolean }>(`/api/admin/members/${encodeURIComponent(id)}`, {
      method: "DELETE",
    })
  },

  toggleStatus: async (id: string, currentStatus: "Active" | "Inactive"): Promise<AdminMember> => {
    const nextStatus = currentStatus === "Active" ? "Inactive" : "Active"
    return adminMembersApi.update(id, {
      status: nextStatus,
    })
  },
}
