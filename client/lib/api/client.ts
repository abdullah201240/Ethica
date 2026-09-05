export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  issues?: Record<string, string[]>
  meta?: {
    total?: number
    timestamp: string
  }
}

export class ApiError extends Error {
  status: number
  issues?: Record<string, string[]>

  constructor(message: string, status: number, issues?: Record<string, string[]>) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.issues = issues
  }
}

/**
 * Universal institutional HTTP client for Ethica platform APIs
 */
export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || ""
  const url = `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(options?.headers || {}),
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  let payload: ApiResponse<T>
  try {
    payload = await response.json()
  } catch {
    throw new ApiError(
      `HTTP error ${response.status}: Failed to parse server response`,
      response.status
    )
  }

  if (!response.ok || !payload.success) {
    throw new ApiError(
      payload.error || `HTTP error ${response.status}`,
      response.status,
      payload.issues
    )
  }

  return payload.data as T
}
