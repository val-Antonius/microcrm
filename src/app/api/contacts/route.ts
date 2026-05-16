import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET /api/contacts — list all contacts for the current user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search") ?? ""
    const limitParam = searchParams.get("limit")
    
    const page = parseInt(searchParams.get("page") ?? "1")
    const limit = limitParam === "all" ? undefined : parseInt(limitParam ?? "10")
    const skip = limit ? (page - 1) * limit : 0

    const where = {
      userId: session.user.id,
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" as const } },
              { email: { contains: search, mode: "insensitive" as const } },
              { company: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    }

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        include: {
          _count: { select: { deals: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.contact.count({ where }),
    ])

    return NextResponse.json({
      contacts,
      total,
      page,
      totalPages: limit ? Math.ceil(total / limit) : 1,
    })
  } catch (error) {
    console.error("[CONTACTS_GET]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/contacts — create a new contact
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { name, email, phone, company, status } = body

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const contact = await prisma.contact.create({
      data: {
        userId: session.user.id,
        name,
        email: email || null,
        phone: phone || null,
        company: company || null,
        status: status ?? "ACTIVE",
      },
    })

    return NextResponse.json(contact, { status: 201 })
  } catch (error) {
    console.error("[CONTACTS_POST]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
