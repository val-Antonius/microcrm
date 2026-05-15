"use client"

import { useSession, signOut } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, LogOut, Settings, User } from "lucide-react"

export function Navbar() {
  const { data: session } = useSession()
  const user = session?.user

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?"

  return (
    <header className="flex h-16 items-center gap-4 border-b bg-background px-6 justify-between">
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Notifications</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Avatar className="h-9 w-9 cursor-pointer">
              <AvatarImage src={user?.image ?? ""} alt={user?.name ?? "User"} />
              <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <div className="px-2 py-1.5 border-b mb-1">
              <p className="text-sm font-semibold leading-none">{user?.name ?? "User"}</p>
              <p className="text-xs leading-none text-muted-foreground mt-1">{user?.email}</p>
            </div>
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
