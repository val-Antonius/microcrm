import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { KanbanBoard } from "@/components/deals/KanbanBoard"

export const metadata = {
  title: "Pipeline – MicroCRM",
  description: "Manage your deals and sales pipeline",
}

export default async function DealsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  return <KanbanBoard />
}
