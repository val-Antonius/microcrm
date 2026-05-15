import { DashboardLayout } from "@/components/layout/DashboardLayout"

export default function ContactsRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayout>{children}</DashboardLayout>
}
