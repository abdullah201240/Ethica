import { NextRequest, NextResponse } from "next/server"
import { serverDb } from "@/lib/server/db"
import { createPlatformUserSchema } from "@/lib/schemas"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pillar = searchParams.get("pillar")
    const status = searchParams.get("status")

    let data = serverDb.users.getAll()

    if (pillar && pillar !== "all") {
      data = data.filter((u) => u.pillar.toLowerCase() === pillar.toLowerCase())
    }
    if (status && status !== "all") {
      data = data.filter((u) => u.status.toLowerCase() === status.toLowerCase())
    }

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
      { success: false, error: "Failed to retrieve platform users" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validation = createPlatformUserSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid platform user payload",
          issues: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const created = serverDb.users.create(validation.data)
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
      { success: false, error: "Failed to create platform user" },
      { status: 500 }
    )
  }
}
