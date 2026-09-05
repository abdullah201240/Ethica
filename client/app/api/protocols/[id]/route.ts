import { NextRequest, NextResponse } from "next/server"
import { serverDb } from "@/lib/server/db"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const protocol = serverDb.protocols.getById(id)

    if (!protocol) {
      return NextResponse.json(
        { success: false, error: "Research protocol not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: protocol,
    })
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to retrieve research protocol" },
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
    const updated = serverDb.protocols.update(id, body)

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Research protocol not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updated,
    })
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update research protocol" },
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
    const deleted = serverDb.protocols.delete(id)

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Research protocol not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { id, deleted: true },
    })
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to delete research protocol" },
      { status: 500 }
    )
  }
}
