"use client"

import { useState, useEffect } from "react"
import { Users, Briefcase, TrendingUp, DollarSign, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "sonner"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface DashboardData {
  metrics: {
    totalContacts: number
    totalDeals: number
    wonRevenue: number
    conversionRate: number
  }
  charts: {
    dealsByStage: { name: string; value: number }[]
    contactStatus: { name: string; value: number }[]
  }
  recentDeals: {
    id: string
    title: string
    amount: number
    stage: string
    contact: { name: string }
    createdAt: string
  }[]
}

const COLORS = ["#4f46e5", "#8b5cf6", "#10b981", "#ef4444"]
const PIE_COLORS = ["#10b981", "#94a3b8"]

export function DashboardClient() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/dashboard")
        if (!res.ok) throw new Error()
        const json = await res.json()
        setData(json)
      } catch {
        toast.error("Failed to load dashboard data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    )
  }

  if (!data) return null

  const { metrics, charts, recentDeals } = data

  const metricCards = [
    { title: "Total Contacts", value: metrics.totalContacts, icon: Users, color: "text-blue-500" },
    { title: "Total Deals", value: metrics.totalDeals, icon: Briefcase, color: "text-purple-500" },
    {
      title: "Won Revenue",
      value: `$${metrics.wonRevenue.toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
      icon: DollarSign,
      color: "text-emerald-500",
    },
    {
      title: "Win Rate",
      value: `${metrics.conversionRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: "text-orange-500",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metricCards.map((metric) => {
          const Icon = metric.icon
          return (
            <Card key={metric.title} className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Deals by Stage</CardTitle>
            <CardDescription>Number of deals in each pipeline stage</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.dealsByStage}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <RechartsTooltip cursor={{ fill: "rgba(0,0,0,0.05)" }} contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {charts.dealsByStage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Contact Status</CardTitle>
            <CardDescription>Active vs Inactive contacts</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.contactStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {charts.contactStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {charts.contactStatus.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }} />
                  <span className="text-sm text-muted-foreground">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Recent Deals</CardTitle>
          <CardDescription>Latest updates to your pipeline</CardDescription>
        </CardHeader>
        <CardContent>
          {recentDeals.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No recent deals</p>
          ) : (
            <div className="space-y-4">
              {recentDeals.map((deal) => (
                <div key={deal.id} className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0">
                  <div>
                    <p className="font-medium">{deal.title}</p>
                    <p className="text-sm text-muted-foreground">{deal.contact.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${deal.amount.toLocaleString()}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      deal.stage === "WON" ? "bg-emerald-100 text-emerald-700" :
                      deal.stage === "LOST" ? "bg-red-100 text-red-700" :
                      deal.stage === "PROPOSAL" ? "bg-violet-100 text-violet-700" :
                      "bg-blue-100 text-blue-700"
                    }`}>
                      {deal.stage}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
