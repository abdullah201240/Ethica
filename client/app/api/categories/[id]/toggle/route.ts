import { NextResponse } from "next/server"
import { serverDb } from "@/lib/server/db"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const resolvedParams = await params
    const id = decodeURIComponent(resolvedParams.id)

    const updated = serverDb.categories.toggleStatus(id)
    if (!updated) {
      return NextResponse.json(
        { error: `Research category with ID "${id}" not found` },
        { status: 404 }
      )
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Failed to toggle category status:", error)
    return NextResponse.json(
      { error: "Internal Server Error toggling category status" },
      { status: 500 }
    )
  }
}
