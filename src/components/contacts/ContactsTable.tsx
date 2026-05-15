"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { Plus, Search, Pencil, Trash2, Building2, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ContactDialog } from "@/components/contacts/ContactDialog"
import { DeleteContactDialog } from "@/components/contacts/DeleteContactDialog"

interface Contact {
  id: string
  name: string
  email?: string | null
  phone?: string | null
  company?: string | null
  status: string
  createdAt: string
  _count?: { deals: number }
}

export function ContactsTable() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)

  const fetchContacts = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/contacts?search=${encodeURIComponent(search)}`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      setContacts(data)
    } catch {
      toast.error("Failed to load contacts")
    } finally {
      setIsLoading(false)
    }
  }, [search])

  useEffect(() => {
    const timeout = setTimeout(fetchContacts, 300)
    return () => clearTimeout(timeout)
  }, [fetchContacts])

  const handleAdd = () => {
    setSelectedContact(null)
    setDialogOpen(true)
  }

  const handleEdit = (contact: Contact) => {
    setSelectedContact(contact)
    setDialogOpen(true)
  }

  const handleDelete = (contact: Contact) => {
    setSelectedContact(contact)
    setDeleteDialogOpen(true)
  }

  const initials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase()

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
          <p className="text-muted-foreground mt-1">
            {contacts.length} contact{contacts.length !== 1 ? "s" : ""} in your workspace
          </p>
        </div>
        <Button onClick={handleAdd} className="bg-indigo-600 hover:bg-indigo-700 gap-2 self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          Add Contact
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[280px]">Contact</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Deals</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-4 bg-muted rounded animate-pulse" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : contacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-16">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                      <Mail className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">No contacts found</p>
                      <p className="text-sm text-muted-foreground">
                        {search ? "Try a different search" : "Add your first contact to get started"}
                      </p>
                    </div>
                    {!search && (
                      <Button size="sm" onClick={handleAdd} className="bg-indigo-600 hover:bg-indigo-700">
                        <Plus className="h-4 w-4 mr-1" /> Add Contact
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              contacts.map((contact) => (
                <TableRow key={contact.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs font-semibold">
                          {initials(contact.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium leading-tight">{contact.name}</p>
                        {contact.email && (
                          <p className="text-xs text-muted-foreground">{contact.email}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {contact.company ? (
                      <div className="flex items-center gap-1.5 text-sm">
                        <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                        {contact.company}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {contact.phone ? (
                      <div className="flex items-center gap-1.5 text-sm">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                        {contact.phone}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium">{contact._count?.deals ?? 0}</span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={contact.status === "ACTIVE" ? "default" : "secondary"}
                      className={
                        contact.status === "ACTIVE"
                          ? "bg-green-100 text-green-700 hover:bg-green-100"
                          : "bg-slate-100 text-slate-600"
                      }
                    >
                      {contact.status === "ACTIVE" ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEdit(contact)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(contact)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ContactDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSuccess={fetchContacts}
        contact={selectedContact}
      />
      <DeleteContactDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onSuccess={fetchContacts}
        contact={selectedContact}
      />
    </>
  )
}
