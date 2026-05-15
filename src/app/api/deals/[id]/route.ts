import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { Stage } from "@prisma/client"

const VALID_STAGES: Stage[] = ["LEAD", "PROPOSAL", "WON", "LOST"]

async function getOwnedDeal(dealId: string, userId: string) {
  return prisma.deal.findFirst({
    where: { id: dealId, userId },
  })
}

// GET /api/deals/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const deal = await prisma.deal.findFirst({
      where: { id, userId: session.user.id },
      include: { contact: true },
    })

    if (!deal) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 })
    }

    return NextResponse.json(deal)
  } catch (error) {
    console.error("[DEAL_GET]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/deals/[id] — full update
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()
    const { title, contactId, amount, stage } = body

    if (!title || !contactId) {
      return NextResponse.json(
        { error: "Title and contact are required" },
        { status: 400 }
      )
    }

    const existing = await getOwnedDeal(id, session.user.id)
    if (!existing) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 })
    }

    const deal = await prisma.deal.update({
      where: { id },
      data: {
        title,
        contactId,
        amount: parseFloat(amount) || 0,
        stage: stage ?? existing.stage,
      },
      include: { contact: { select: { id: true, name: true, company: true } } },
    })

    return NextResponse.json(deal)
  } catch (error) {
    console.error("[DEAL_PUT]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PATCH /api/deals/[id] — stage-only update (for drag-and-drop)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()
    const { stage } = body

    if (!stage || !VALID_STAGES.includes(stage)) {
      return NextResponse.json({ error: "Invalid stage" }, { status: 400 })
    }

    const existing = await getOwnedDeal(id, session.user.id)
    if (!existing) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 })
    }

    const deal = await prisma.deal.update({
      where: { id },
      data: { stage },
    })

    return NextResponse.json(deal)
  } catch (error) {
    console.error("[DEAL_PATCH]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/deals/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const existing = await getOwnedDeal(id, session.user.id)
    if (!existing) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 })
    }

    await prisma.deal.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[DEAL_DELETE]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
