import { NextRequest, NextResponse } from "next/server"
import { serverDb } from "@/lib/server/db"
import { fullProtocolApplicationSchema } from "@/lib/schemas"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const board = searchParams.get("board")
    const status = searchParams.get("status")
    const risk = searchParams.get("risk")

    let data = serverDb.protocols.getAll()

    if (board && board !== "all") {
      data = data.filter((p) => p.board.toLowerCase() === board.toLowerCase())
    }
    if (status && status !== "all") {
      data = data.filter((p) => p.status.toLowerCase() === status.toLowerCase())
    }
    if (risk && risk !== "all") {
      data = data.filter((p) => p.risk.toLowerCase() === risk.toLowerCase())
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
      { success: false, error: "Failed to retrieve research protocols docket" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Accept either full protocol application form payload or direct protocol record
    if (body.agreeHelsinkiTerms !== undefined) {
      const validation = fullProtocolApplicationSchema.safeParse(body)
      if (!validation.success) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid research protocol application submission",
            issues: validation.error.flatten().fieldErrors,
          },
          { status: 400 }
        )
      }

      const validated = validation.data
      const created = serverDb.protocols.create({
        title: validated.title,
        department: validated.department,
        board: validated.board,
        status: validated.isExpeditedTriage ? "Expedited Triage" : "Under Committee Review",
        statusColor: validated.isExpeditedTriage ? "blue" : "amber",
        risk: validated.riskTier,
        riskColor:
          validated.riskTier === "Exempt - Fast Track"
            ? "emerald"
            : validated.riskTier === "Greater Than Minimal"
            ? "purple"
            : "blue",
        feeAmountBdt: validated.feeAmountBdt,
        paymentMethod: validated.paymentMethod,
        transactionId: validated.transactionId,
        abstract: validated.abstract,
      })

      return NextResponse.json(
        {
          success: true,
          data: created,
          meta: { timestamp: new Date().toISOString() },
        },
        { status: 201 }
      )
    }

    // Direct protocol entity creation
    const created = serverDb.protocols.create(body)
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
      { success: false, error: "Failed to register research protocol" },
      { status: 500 }
    )
  }
}
