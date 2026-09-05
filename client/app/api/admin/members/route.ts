import { NextRequest, NextResponse } from "next/server"
import { serverDb } from "@/lib/server/db"
import { createAdminMemberSchema } from "@/lib/schemas"

export async function GET() {
  try {
    const data = serverDb.adminMembers.getAll()
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
      { success: false, error: "Failed to retrieve administrative members" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validation = createAdminMemberSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid administrator member payload",
          issues: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const created = serverDb.adminMembers.create(validation.data)
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
      { success: false, error: "Failed to create administrative member" },
      { status: 500 }
    )
  }
}
