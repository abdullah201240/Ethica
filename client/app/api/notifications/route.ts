import { NextRequest, NextResponse } from "next/server"
import { serverDb } from "@/lib/server/db"
import { createNotificationInputSchema } from "@/lib/schemas"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get("role") || undefined
    const email = searchParams.get("email") || undefined
    const unreadOnly = searchParams.get("unreadOnly") === "true"

    const data = serverDb.notifications.getAll({ role, email, unreadOnly })
    const unreadCount = data.filter((n) => !n.read).length

    return NextResponse.json({
      success: true,
      data,
      meta: {
        total: data.length,
        unreadCount,
        timestamp: new Date().toISOString(),
      },
    })
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch notifications" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validation = createNotificationInputSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid notification input",
          issues: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const created = serverDb.notifications.create(validation.data)
    return NextResponse.json(
      {
        success: true,
        data: created,
        message: "Notification dispatched successfully",
      },
      { status: 201 }
    )
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to dispatch notification" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { role, email } = body
    serverDb.notifications.markAllAsRead(role, email)

    return NextResponse.json({
      success: true,
      message: "All notifications marked as read",
    })
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to mark all as read" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get("role") || undefined
    const email = searchParams.get("email") || undefined

    serverDb.notifications.clearRead(role, email)
    return NextResponse.json({
      success: true,
      message: "Read notifications cleared successfully",
    })
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to clear read notifications" },
      { status: 500 }
    )
  }
}
