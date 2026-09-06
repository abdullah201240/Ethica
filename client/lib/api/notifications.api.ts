import { apiFetch } from "./client"
import {
  type EthicaNotification,
  type CreateNotificationInput,
  type UpdateNotificationInput,
} from "@/lib/schemas"

export interface NotificationFilters {
  role?: string
  email?: string
  unreadOnly?: boolean
}

export const notificationsApi = {
  getAll: async (filters?: NotificationFilters): Promise<EthicaNotification[]> => {
    const params = new URLSearchParams()
    if (filters?.role && filters.role !== "all") params.set("role", filters.role)
    if (filters?.email) params.set("email", filters.email)
    if (filters?.unreadOnly) params.set("unreadOnly", "true")

    const query = params.toString() ? `?${params.toString()}` : ""
    return apiFetch<EthicaNotification[]>(`/api/notifications${query}`)
  },

  create: async (data: CreateNotificationInput): Promise<EthicaNotification> => {
    return apiFetch<EthicaNotification>("/api/notifications", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  markAsRead: async (id: string): Promise<EthicaNotification> => {
    return apiFetch<EthicaNotification>(`/api/notifications/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify({ read: true } satisfies UpdateNotificationInput),
    })
  },

  markAllAsRead: async (role?: string, email?: string): Promise<{ success: boolean }> => {
    return apiFetch<{ success: boolean }>("/api/notifications", {
      method: "PATCH",
      body: JSON.stringify({ role, email }),
    })
  },

  delete: async (id: string): Promise<{ id: string; deleted: boolean }> => {
    return apiFetch<{ id: string; deleted: boolean }>(`/api/notifications/${encodeURIComponent(id)}`, {
      method: "DELETE",
    })
  },

  clearRead: async (role?: string, email?: string): Promise<{ success: boolean }> => {
    const params = new URLSearchParams()
    if (role && role !== "all") params.set("role", role)
    if (email) params.set("email", email)
    const query = params.toString() ? `?${params.toString()}` : ""
    return apiFetch<{ success: boolean }>(`/api/notifications${query}`, {
      method: "DELETE",
    })
  },
}
