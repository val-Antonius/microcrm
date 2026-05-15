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

interface DeleteContactDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  contact: { id: string; name: string } | null
}

export function DeleteContactDialog({
  open,
  onClose,
  onSuccess,
  contact,
}: DeleteContactDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    if (!contact) return
    setIsLoading(true)
    try {
      const res = await fetch(`/api/contacts/${contact.id}`, { method: "DELETE" })
      if (!res.ok) {
        toast.error("Failed to delete contact")
        return
      }
      toast.success(`${contact.name} deleted`)
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
            <DialogTitle>Delete Contact</DialogTitle>
          </div>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">{contact?.name}</span>? This will also
            delete all their associated deals. This action cannot be undone.
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
