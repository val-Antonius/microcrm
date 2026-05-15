"use client"

import { useEffect } from "react"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service in production
    console.error("Global boundary caught error:", error)
  }, [error])

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-muted/20">
      <div className="flex max-w-[400px] flex-col items-center text-center space-y-4 rounded-xl border bg-background p-8 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>
        <h2 className="text-xl font-semibold tracking-tight">Something went wrong!</h2>
        <p className="text-sm text-muted-foreground">
          An unexpected error occurred. We have been notified and are looking into it.
        </p>
        <div className="pt-2">
          <Button onClick={() => reset()} className="bg-indigo-600 hover:bg-indigo-700">
            Try again
          </Button>
        </div>
      </div>
    </div>
  )
}
