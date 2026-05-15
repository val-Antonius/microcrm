"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Loader2, AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface DeleteDealDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  deal: { id: string; title: string } | null
}

export function DeleteDealDialog({
  open,
  onClose,
  onSuccess,
  deal,
}: DeleteDealDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    if (!deal) return
    setIsLoading(true)
    try {
      const res = await fetch(`/api/deals/${deal.id}`, { method: "DELETE" })
      if (!res.ok) {
        toast.error("Failed to delete deal")
        return
      }
      toast.success(`"${deal.title}" deleted`)
      onSuccess()
      onClose()
    } catch {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <DialogTitle>Delete Deal</DialogTitle>
          </div>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">&ldquo;{deal?.title}&rdquo;</span>?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
