import { NextRequest, NextResponse } from "next/server"
import { serverDb } from "@/lib/server/db"
import { z } from "zod"

const updateApplicationStatusSchema = z.object({
  status: z.enum(["Approved", "Rejected"]),
  notes: z.string().optional(),
})

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const app = serverDb.reviewerApplications.getById(id)
    if (!app) {
      return NextResponse.json(
        { success: false, error: `Reviewer application with ID '${id}' not found` },
        { status: 404 }
      )
    }
    return NextResponse.json({
      success: true,
      data: app,
      meta: { timestamp: new Date().toISOString() },
    })
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to retrieve reviewer application" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const validation = updateApplicationStatusSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid application status payload",
          issues: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const updated = serverDb.reviewerApplications.updateStatus(
      id,
      validation.data.status,
      validation.data.notes
    )

    if (!updated) {
      return NextResponse.json(
        { success: false, error: `Reviewer application with ID '${id}' not found` },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updated,
      meta: { timestamp: new Date().toISOString() },
    })
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update reviewer application status" },
      { status: 500 }
    )
  }
}
