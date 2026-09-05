import { NextRequest, NextResponse } from "next/server"
import { serverDb } from "@/lib/server/db"
import { syncApprovedReviewerSchema } from "@/lib/schemas"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validation = syncApprovedReviewerSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid sync reviewer payload",
          issues: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const synced = serverDb.reviewerRoster.syncApprovedReviewer(validation.data)
    return NextResponse.json({
      success: true,
      data: synced,
      meta: { timestamp: new Date().toISOString() },
    })
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to sync reviewer to roster" },
      { status: 500 }
    )
  }
}
