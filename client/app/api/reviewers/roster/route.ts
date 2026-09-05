import { NextRequest, NextResponse } from "next/server"
import { serverDb } from "@/lib/server/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const board = searchParams.get("board")

    let data = serverDb.reviewerRoster.getAll()

    if (status && status !== "all") {
      data = data.filter((r) => r.status.toLowerCase() === status.toLowerCase())
    }
    if (board && board !== "all") {
      data = data.filter((r) => r.board.toLowerCase() === board.toLowerCase())
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
      { success: false, error: "Failed to retrieve accredited reviewers" },
      { status: 500 }
    )
  }
}
