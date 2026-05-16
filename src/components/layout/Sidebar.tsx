"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Briefcase, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

export const sidebarNavItems = [
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
]

export function SidebarContent({ pathname, onClick }: { pathname: string, onClick?: () => void }) {
  return (
    <>
      <div className="p-6">
        <Link href="/dashboard" onClick={onClick} className="flex items-center gap-2 font-bold text-2xl tracking-tight text-foreground premium-interactive">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg shadow-sm">
            <Briefcase className="h-5 w-5" />
          </div>
          MicroCRM
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <ul className="grid gap-1 px-3">
          {sidebarNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClick}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all duration-200 relative group overflow-hidden premium-interactive",
                    isActive
                      ? "bg-accent/50 text-accent-foreground font-medium"
                      : "text-muted-foreground hover:bg-muted/80 hover:text-foreground font-medium"
                  )}
                >
                  {isActive && (
                    <span className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
                  )}
                  <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                  {item.title}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}

export function Sidebar() {
  const pathname = usePathname()

  return (
    <nav className="hidden md:flex flex-col w-64 bg-sidebar min-h-screen shrink-0 border-r border-border/40">
      <SidebarContent pathname={pathname} />
    </nav>
  )
}
