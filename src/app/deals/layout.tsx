import { DashboardLayout } from "@/components/layout/DashboardLayout"

export default function DealsRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayout>{children}</DashboardLayout>
}
