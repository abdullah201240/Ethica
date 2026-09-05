import { apiFetch } from "./client"
import type { InvestigatorProfile } from "@/lib/server/db"

export type { InvestigatorProfile }

export const investigatorProfileApi = {
  get: async (): Promise<InvestigatorProfile> => {
    return apiFetch<InvestigatorProfile>("/api/investigator/profile")
  },

  update: async (data: Partial<InvestigatorProfile>): Promise<InvestigatorProfile> => {
    return apiFetch<InvestigatorProfile>("/api/investigator/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },
}
