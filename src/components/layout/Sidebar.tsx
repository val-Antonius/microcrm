"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Briefcase, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Contacts",
    href: "/contacts",
    icon: Users,
  },
  {
    title: "Deals",
    href: "/deals",
    icon: Briefcase,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col w-64 border-r bg-muted/40 min-h-screen shrink-0">
      <div className="p-6 border-b">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-2xl tracking-tight text-primary">
          <Briefcase className="h-6 w-6" />
          MicroCRM
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <ul className="grid gap-1 px-2">
          {sidebarNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-secondary text-secondary-foreground font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground font-normal"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.title}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
