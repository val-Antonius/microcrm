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

const COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
]
const PIE_COLORS = ["var(--color-chart-2)", "var(--color-muted-foreground)"]

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
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!data) return null

  const { metrics, charts, recentDeals } = data

  const metricCards = [
    { title: "Total Contacts", value: metrics.totalContacts, icon: Users, color: "text-primary" },
    { title: "Total Deals", value: metrics.totalDeals, icon: Briefcase, color: "text-chart-2" },
    {
      title: "Won Revenue",
      value: `$${metrics.wonRevenue.toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
      icon: DollarSign,
      color: "text-chart-3",
    },
    {
      title: "Win Rate",
      value: `${metrics.conversionRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: "text-chart-4",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metricCards.map((metric) => {
          const Icon = metric.icon
          return (
            <Card key={metric.title} className="premium-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <div className={`p-2 bg-muted rounded-md ${metric.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold font-mono tracking-tight">{metric.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 premium-card">
          <CardHeader>
            <CardTitle>Deals by Stage</CardTitle>
            <CardDescription>Number of deals in each pipeline stage</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] pb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.dealsByStage} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "var(--color-muted-foreground)", fontSize: 12, fontWeight: 500 }} dy={10} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "var(--color-muted-foreground)", fontSize: 12, fontFamily: "var(--font-mono)" }} />
                <RechartsTooltip cursor={{ fill: "var(--color-muted)", opacity: 0.4 }} contentStyle={{ borderRadius: "8px", border: "1px solid var(--color-border)", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} itemStyle={{ fontFamily: "var(--font-mono)", fontWeight: 600 }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                  {charts.dealsByStage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3 premium-card">
          <CardHeader>
            <CardTitle>Contact Status</CardTitle>
            <CardDescription>Active vs Inactive contacts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.contactStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {charts.contactStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ borderRadius: "8px", border: "1px solid var(--color-border)", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} itemStyle={{ fontFamily: "var(--font-mono)", fontWeight: 600 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              {charts.contactStatus.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }} />
                  <span className="text-sm font-medium text-foreground">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="premium-card">
        <CardHeader>
          <CardTitle>Recent Deals</CardTitle>
          <CardDescription>Latest updates to your pipeline</CardDescription>
        </CardHeader>
        <CardContent>
          {recentDeals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <Briefcase className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No active deals</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                You haven't added any deals to your pipeline yet. Navigate to the Deals tab to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {recentDeals.map((deal) => (
                <div key={deal.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="font-medium text-sm">{deal.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                      <Users className="h-3 w-3" />
                      {deal.contact.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm font-mono">${deal.amount.toLocaleString()}</p>
                    <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground mt-1 inline-block">
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
