import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // 1. Total Contacts
    const totalContacts = await prisma.contact.count({
      where: { userId },
    })

    // 2. Active Contacts count for pie chart
    const activeContacts = await prisma.contact.count({
      where: { userId, status: "ACTIVE" },
    })
    const inactiveContacts = totalContacts - activeContacts

    // 3. Total Deals
    const totalDeals = await prisma.deal.count({
      where: { userId },
    })

    // 4. Deals by Stage
    const deals = await prisma.deal.findMany({
      where: { userId },
      select: { id: true, amount: true, stage: true, title: true, contact: { select: { name: true } }, createdAt: true },
      orderBy: { createdAt: 'desc' }
    })

    let wonRevenue = 0
    let wonDeals = 0

    const dealsByStage = {
      LEAD: 0,
      PROPOSAL: 0,
      WON: 0,
      LOST: 0,
    }

    deals.forEach((deal) => {
      dealsByStage[deal.stage] += 1
      if (deal.stage === "WON") {
        wonRevenue += deal.amount
        wonDeals += 1
      }
    })

    const conversionRate = totalDeals > 0 ? (wonDeals / totalDeals) * 100 : 0

    // Recent 5 deals for the activity list
    const recentDeals = deals.slice(0, 5)

    return NextResponse.json({
      metrics: {
        totalContacts,
        totalDeals,
        wonRevenue,
        conversionRate,
      },
      charts: {
        dealsByStage: [
          { name: "Lead", value: dealsByStage.LEAD },
          { name: "Proposal", value: dealsByStage.PROPOSAL },
          { name: "Won", value: dealsByStage.WON },
          { name: "Lost", value: dealsByStage.LOST },
        ],
        contactStatus: [
          { name: "Active", value: activeContacts },
          { name: "Inactive", value: inactiveContacts },
        ],
      },
      recentDeals,
    })
  } catch (error) {
    console.error("[DASHBOARD_GET]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
