import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET /api/deals — list all deals for the current user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const deals = await prisma.deal.findMany({
      where: { userId: session.user.id },
      include: {
        contact: { select: { id: true, name: true, company: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(deals)
  } catch (error) {
    console.error("[DEALS_GET]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/deals — create a new deal
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { title, contactId, amount, stage } = body

    if (!title || !contactId) {
      return NextResponse.json(
        { error: "Title and contact are required" },
        { status: 400 }
      )
    }

    // Ensure the contact belongs to this user
    const contact = await prisma.contact.findFirst({
      where: { id: contactId, userId: session.user.id },
    })
    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 })
    }

    const deal = await prisma.deal.create({
      data: {
        userId: session.user.id,
        contactId,
        title,
        amount: parseFloat(amount) || 0,
        stage: stage ?? "LEAD",
      },
      include: {
        contact: { select: { id: true, name: true, company: true } },
      },
    })

    return NextResponse.json(deal, { status: 201 })
  } catch (error) {
    console.error("[DEALS_POST]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
