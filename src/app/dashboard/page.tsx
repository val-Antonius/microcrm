import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardClient } from "@/components/dashboard/DashboardClient"

export const metadata = {
  title: "Dashboard – MicroCRM",
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back{session.user?.name ? `, ${session.user.name.split(" ")[0]}` : ""}! 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s what&apos;s happening in your pipeline today.
        </p>
      </div>

      <DashboardClient />
    </div>
  )
}
