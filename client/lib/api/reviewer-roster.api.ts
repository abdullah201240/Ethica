import { apiFetch } from "./client"
import { type AccreditedReviewer } from "@/lib/reviewer-roster"
import { type SyncApprovedReviewerInput } from "@/lib/schemas"

export const reviewerRosterApi = {
  getAll: async (filters?: { status?: string; board?: string }): Promise<AccreditedReviewer[]> => {
    const params = new URLSearchParams()
    if (filters?.status) params.set("status", filters.status)
    if (filters?.board) params.set("board", filters.board)
    const qs = params.toString()
    return apiFetch<AccreditedReviewer[]>(`/api/reviewers/roster${qs ? `?${qs}` : ""}`)
  },

  getById: async (id: string): Promise<AccreditedReviewer> => {
    return apiFetch<AccreditedReviewer>(`/api/reviewers/roster/${encodeURIComponent(id)}`)
  },

  updateStatus: async (
    id: string,
    status: "Active" | "Inactive",
    statusReason?: string
  ): Promise<AccreditedReviewer> => {
    return apiFetch<AccreditedReviewer>(`/api/reviewers/roster/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify({ status, statusReason }),
    })
  },

  syncApprovedReviewer: async (data: SyncApprovedReviewerInput): Promise<AccreditedReviewer> => {
    return apiFetch<AccreditedReviewer>("/api/reviewers/roster/sync", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },
}
