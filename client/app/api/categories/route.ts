import { NextResponse } from "next/server"
import { serverDb } from "@/lib/server/db"
import { createResearchCategorySchema } from "@/lib/schemas"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const board = searchParams.get("board") || undefined
    const status = searchParams.get("status") || undefined
    const risk = searchParams.get("risk") || undefined

    const categories = serverDb.categories.getAll({ board, status, risk })
    return NextResponse.json(categories)
  } catch (error) {
    console.error("Failed to fetch research categories:", error)
    return NextResponse.json(
      { error: "Internal Server Error fetching research categories" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validation = createResearchCategorySchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const created = serverDb.categories.create(validation.data)
    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    console.error("Failed to create research category:", error)
    return NextResponse.json(
      { error: "Internal Server Error creating research category" },
      { status: 500 }
    )
  }
}
