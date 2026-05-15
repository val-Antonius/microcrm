import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET /api/contacts/[id]
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

    const contact = await prisma.contact.findFirst({
      where: { id, userId: session.user.id },
      include: { deals: { orderBy: { createdAt: "desc" } } },
    })

    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 })
    }

    return NextResponse.json(contact)
  } catch (error) {
    console.error("[CONTACT_GET]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/contacts/[id]
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
    const { name, email, phone, company, status } = body

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    // Verify ownership
    const existing = await prisma.contact.findFirst({
      where: { id, userId: session.user.id },
    })

    if (!existing) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 })
    }

    const contact = await prisma.contact.update({
      where: { id },
      data: {
        name,
        email: email || null,
        phone: phone || null,
        company: company || null,
        status: status ?? existing.status,
      },
    })

    return NextResponse.json(contact)
  } catch (error) {
    console.error("[CONTACT_PUT]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/contacts/[id]
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

    const existing = await prisma.contact.findFirst({
      where: { id, userId: session.user.id },
    })

    if (!existing) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 })
    }

    await prisma.contact.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[CONTACT_DELETE]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
