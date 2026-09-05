import { NextRequest, NextResponse } from "next/server"
import { serverDb } from "@/lib/server/db"
import { updateAdminMemberSchema } from "@/lib/schemas"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const member = serverDb.adminMembers.getById(id)
    if (!member) {
      return NextResponse.json(
        { success: false, error: `Administrator with ID '${id}' not found` },
        { status: 404 }
      )
    }
    return NextResponse.json({
      success: true,
      data: member,
      meta: { timestamp: new Date().toISOString() },
    })
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to retrieve administrator" },
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

    // Validate partial update
    const validation = updateAdminMemberSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid administrator update payload",
          issues: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const updated = serverDb.adminMembers.update(id, validation.data)
    if (!updated) {
      return NextResponse.json(
        { success: false, error: `Administrator with ID '${id}' not found` },
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
      { success: false, error: "Failed to update administrator" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const deleted = serverDb.adminMembers.delete(id)
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: `Administrator with ID '${id}' not found` },
        { status: 404 }
      )
    }
    return NextResponse.json({
      success: true,
      data: { id, deleted: true },
      meta: { timestamp: new Date().toISOString() },
    })
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to delete administrator" },
      { status: 500 }
    )
  }
}
