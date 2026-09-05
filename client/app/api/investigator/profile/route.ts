import { NextRequest, NextResponse } from "next/server"
import { serverDb } from "@/lib/server/db"

export async function GET() {
  try {
    const profile = serverDb.investigatorProfile.get()
    return NextResponse.json({
      success: true,
      data: profile,
      meta: { timestamp: new Date().toISOString() },
    })
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to retrieve investigator profile" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const updated = serverDb.investigatorProfile.update(body)
    return NextResponse.json({
      success: true,
      data: updated,
      meta: { timestamp: new Date().toISOString() },
    })
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update investigator profile" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  return PUT(request)
}
