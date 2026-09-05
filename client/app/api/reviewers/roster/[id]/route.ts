import { NextRequest, NextResponse } from "next/server"
import { serverDb } from "@/lib/server/db"
import { z } from "zod"

const updateStatusSchema = z.object({
  status: z.enum(["Active", "Inactive"]),
  statusReason: z.string().optional(),
})

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const reviewer = serverDb.reviewerRoster.getById(id)
    if (!reviewer) {
      return NextResponse.json(
        { success: false, error: `Reviewer with ID '${id}' not found` },
        { status: 404 }
      )
    }
    return NextResponse.json({
      success: true,
      data: reviewer,
      meta: { timestamp: new Date().toISOString() },
    })
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to retrieve reviewer dossier" },
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

    const validation = updateStatusSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid status update payload",
          issues: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const updated = serverDb.reviewerRoster.updateStatus(
      id,
      validation.data.status,
      validation.data.statusReason
    )

    if (!updated) {
      return NextResponse.json(
        { success: false, error: `Reviewer with ID '${id}' not found` },
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
      { success: false, error: "Failed to update reviewer status" },
      { status: 500 }
    )
  }
}
