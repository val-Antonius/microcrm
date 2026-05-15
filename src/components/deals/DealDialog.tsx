"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const dealSchema = z.object({
  title: z.string().min(1, "Title is required"),
  contactId: z.string().min(1, "Contact is required"),
  amount: z.string().optional(),
  stage: z.enum(["LEAD", "PROPOSAL", "WON", "LOST"]),
})

type DealForm = z.infer<typeof dealSchema>

interface Contact {
  id: string
  name: string
  company?: string | null
}

interface Deal {
  id: string
  title: string
  amount: number
  stage: string
  contactId: string
}

interface DealDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  deal?: Deal | null
  contacts: Contact[]
  defaultStage?: string
}

export function DealDialog({
  open,
  onClose,
  onSuccess,
  deal,
  contacts,
  defaultStage = "LEAD",
}: DealDialogProps) {
  const isEditing = !!deal
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DealForm>({
    resolver: zodResolver(dealSchema),
    defaultValues: { stage: "LEAD" },
  })

  useEffect(() => {
    if (open) {
      reset(
        deal
          ? {
              title: deal.title,
              contactId: deal.contactId,
              amount: deal.amount.toString(),
              stage: deal.stage as DealForm["stage"],
            }
          : {
              title: "",
              contactId: "",
              amount: "",
              stage: (defaultStage as DealForm["stage"]) ?? "LEAD",
            }
      )
    }
  }, [open, deal, defaultStage, reset])

  const onSubmit = async (data: DealForm) => {
    setIsLoading(true)
    try {
      const url = isEditing ? `/api/deals/${deal!.id}` : "/api/deals"
      const method = isEditing ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          amount: parseFloat(data.amount ?? "0") || 0,
        }),
      })

      if (!res.ok) {
        const json = await res.json()
        toast.error(json.error ?? "Failed to save deal")
        return
      }

      toast.success(isEditing ? "Deal updated!" : "Deal created!")
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Deal" : "Add New Deal"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="deal-title">Deal Title *</Label>
            <Input
              id="deal-title"
              placeholder="e.g. Website Redesign Project"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="deal-contact">Contact *</Label>
            <select
              id="deal-contact"
              {...register("contactId")}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">Select a contact...</option>
              {contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}{c.company ? ` — ${c.company}` : ""}
                </option>
              ))}
            </select>
            {errors.contactId && (
              <p className="text-sm text-destructive">{errors.contactId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="deal-amount">Value ($)</Label>
            <Input
              id="deal-amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              {...register("amount")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deal-stage">Stage</Label>
            <select
              id="deal-stage"
              {...register("stage")}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="LEAD">Lead</option>
              <option value="PROPOSAL">Proposal</option>
              <option value="WON">Won</option>
              <option value="LOST">Lost</option>
            </select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isEditing ? (
                "Save Changes"
              ) : (
                "Add Deal"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
