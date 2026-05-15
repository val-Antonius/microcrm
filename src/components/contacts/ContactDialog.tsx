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

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").or(z.literal("")),
  phone: z.string().optional(),
  company: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]),
})

type ContactForm = z.infer<typeof contactSchema>

interface Contact {
  id: string
  name: string
  email?: string | null
  phone?: string | null
  company?: string | null
  status: string
}

interface ContactDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  contact?: Contact | null
}

export function ContactDialog({ open, onClose, onSuccess, contact }: ContactDialogProps) {
  const isEditing = !!contact
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: { status: "ACTIVE" },
  })

  useEffect(() => {
    if (open) {
      reset(
        contact
          ? {
              name: contact.name,
              email: contact.email ?? "",
              phone: contact.phone ?? "",
              company: contact.company ?? "",
              status: (contact.status as "ACTIVE" | "INACTIVE") ?? "ACTIVE",
            }
          : { name: "", email: "", phone: "", company: "", status: "ACTIVE" }
      )
    }
  }, [open, contact, reset])

  const onSubmit = async (data: ContactForm) => {
    setIsLoading(true)
    try {
      const url = isEditing ? `/api/contacts/${contact!.id}` : "/api/contacts"
      const method = isEditing ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const json = await res.json()
        toast.error(json.error ?? "Failed to save contact")
        return
      }

      toast.success(isEditing ? "Contact updated!" : "Contact created!")
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
          <DialogTitle>{isEditing ? "Edit Contact" : "Add New Contact"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input id="name" placeholder="Jane Doe" {...register("name")} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="jane@example.com" {...register("email")} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" placeholder="+1 555 000 0000" {...register("phone")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input id="company" placeholder="Acme Corp" {...register("company")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              {...register("status")}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : isEditing ? "Save Changes" : "Add Contact"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
