"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Briefcase, Settings } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

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
    <nav className="flex flex-col w-64 border-r bg-muted/40 min-h-screen">
      <div className="p-6 border-b">
        <h2 className="font-bold text-2xl tracking-tight text-primary flex items-center gap-2">
          <Briefcase className="h-6 w-6" />
          MicroCRM
        </h2>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <ul className="grid gap-1 px-2">
          {sidebarNavItems.map((item, index) => {
            const Icon = item.icon
            return (
              <li key={index}>
                <Button
                  render={<Link href={item.href} />}
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-2",
                    pathname === item.href ? "font-semibold" : "font-normal"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.title}
                </Button>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
