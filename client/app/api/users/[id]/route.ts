import { NextRequest, NextResponse } from "next/server"
import { serverDb } from "@/lib/server/db"
import { updatePlatformUserSchema } from "@/lib/schemas"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = serverDb.users.getById(id)
    if (!user) {
      return NextResponse.json(
        { success: false, error: `Platform user with ID '${id}' not found` },
        { status: 404 }
      )
    }
    return NextResponse.json({
      success: true,
      data: user,
      meta: { timestamp: new Date().toISOString() },
    })
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to retrieve platform user" },
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

    const validation = updatePlatformUserSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid user update payload",
          issues: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const updated = serverDb.users.update(id, validation.data)
    if (!updated) {
      return NextResponse.json(
        { success: false, error: `Platform user with ID '${id}' not found` },
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
      { success: false, error: "Failed to update platform user" },
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
    const deleted = serverDb.users.delete(id)
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: `Platform user with ID '${id}' not found` },
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
      { success: false, error: "Failed to delete platform user" },
      { status: 500 }
    )
  }
}
