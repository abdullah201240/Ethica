import { NextRequest, NextResponse } from "next/server"
import { serverDb } from "@/lib/server/db"
import { createReviewerApplicationInputSchema } from "@/lib/schemas"

export async function GET() {
  try {
    const data = serverDb.reviewerApplications.getAll()
    return NextResponse.json({
      success: true,
      data,
      meta: {
        total: data.length,
        timestamp: new Date().toISOString(),
      },
    })
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to retrieve reviewer applications" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validation = createReviewerApplicationInputSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid reviewer application payload",
          issues: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const created = serverDb.reviewerApplications.create(validation.data)
    return NextResponse.json(
      {
        success: true,
        data: created,
        meta: { timestamp: new Date().toISOString() },
      },
      { status: 201 }
    )
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to submit reviewer application" },
      { status: 500 }
    )
  }
}
