import { apiFetch } from "./client"
import { type ReviewerApplication } from "@/lib/reviewer-applications"
import { type CreateReviewerApplicationInput } from "@/lib/schemas"

export const reviewerApplicationsApi = {
  getAll: async (): Promise<ReviewerApplication[]> => {
    return apiFetch<ReviewerApplication[]>("/api/reviewers/applications")
  },

  getById: async (id: string): Promise<ReviewerApplication> => {
    return apiFetch<ReviewerApplication>(`/api/reviewers/applications/${encodeURIComponent(id)}`)
  },

  create: async (data: CreateReviewerApplicationInput): Promise<ReviewerApplication> => {
    return apiFetch<ReviewerApplication>("/api/reviewers/applications", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  updateStatus: async (
    id: string,
    status: "Approved" | "Rejected",
    notes?: string
  ): Promise<ReviewerApplication> => {
    return apiFetch<ReviewerApplication>(`/api/reviewers/applications/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify({ status, notes }),
    })
  },
}
