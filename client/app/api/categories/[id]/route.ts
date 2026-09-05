import { NextResponse } from "next/server"
import { serverDb } from "@/lib/server/db"
import { updateResearchCategorySchema } from "@/lib/schemas"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const resolvedParams = await params
    const id = decodeURIComponent(resolvedParams.id)
    const category = serverDb.categories.getById(id)

    if (!category) {
      return NextResponse.json(
        { error: `Research category with ID "${id}" not found` },
        { status: 404 }
      )
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error("Failed to fetch category:", error)
    return NextResponse.json(
      { error: "Internal Server Error fetching category" },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const resolvedParams = await params
    const id = decodeURIComponent(resolvedParams.id)
    const body = await request.json()

    const validation = updateResearchCategorySchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const updated = serverDb.categories.update(id, validation.data)
    if (!updated) {
      return NextResponse.json(
        { error: `Research category with ID "${id}" not found` },
        { status: 404 }
      )
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Failed to update category:", error)
    return NextResponse.json(
      { error: "Internal Server Error updating category" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  return PUT(request, { params })
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const resolvedParams = await params
    const id = decodeURIComponent(resolvedParams.id)

    const deleted = serverDb.categories.delete(id)
    if (!deleted) {
      return NextResponse.json(
        { error: `Research category with ID "${id}" not found` },
        { status: 404 }
      )
    }

    return NextResponse.json({ id, deleted: true })
  } catch (error) {
    console.error("Failed to delete category:", error)
    return NextResponse.json(
      { error: "Internal Server Error deleting category" },
      { status: 500 }
    )
  }
}
