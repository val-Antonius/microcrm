import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ContactsTable } from "@/components/contacts/ContactsTable"

export const metadata = {
  title: "Contacts – MicroCRM",
  description: "Manage your contacts and leads",
}

export default async function ContactsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  return <ContactsTable />
}
