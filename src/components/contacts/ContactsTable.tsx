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
import { cn } from "@/lib/utils"

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
  
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const limit = 10
  const [totalPages, setTotalPages] = useState(1)

  const fetchContacts = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/contacts?search=${encodeURIComponent(search)}&page=${page}&limit=${limit}`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      setContacts(data.contacts)
      setTotal(data.total)
      setTotalPages(data.totalPages)
    } catch {
      toast.error("Failed to load contacts")
    } finally {
      setIsLoading(false)
    }
  }, [search, page, limit])

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
            {total} contact{total !== 1 ? "s" : ""} in your workspace
          </p>
        </div>
        <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90 text-primary-foreground premium-interactive gap-2 self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          Add Contact
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, or company..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="pl-9 h-10 bg-background/50 border-border/60 focus-visible:ring-1 focus-visible:ring-primary shadow-sm"
        />
      </div>

      {/* Table */}
      <div className="premium-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40 border-b border-border/60">
              <TableHead className="w-[280px] font-medium text-muted-foreground">Contact</TableHead>
              <TableHead className="font-medium text-muted-foreground">Company</TableHead>
              <TableHead className="font-medium text-muted-foreground">Phone</TableHead>
              <TableHead className="font-medium text-muted-foreground">Deals</TableHead>
              <TableHead className="font-medium text-muted-foreground">Status</TableHead>
              <TableHead className="w-[100px] text-right font-medium text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-b border-border/40">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-4 bg-muted/60 rounded animate-pulse" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : contacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-20">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center border border-border/50 shadow-sm">
                      <Mail className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-lg text-foreground">No contacts found</p>
                      <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                        {search ? "We couldn't find any contacts matching your search." : "Your contact directory is empty. Add your first contact to start building your network."}
                      </p>
                    </div>
                    {!search && (
                      <Button onClick={handleAdd} className="mt-2 bg-primary hover:bg-primary/90 premium-interactive">
                        <Plus className="h-4 w-4 mr-2" /> Add Contact
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              contacts.map((contact, index) => (
                <TableRow 
                  key={contact.id} 
                  className={cn(
                    "hover:bg-muted/40 transition-colors border-b border-border/40 group",
                    index % 2 === 0 ? "bg-background" : "bg-muted/10"
                  )}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border shadow-sm">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                          {initials(contact.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium leading-tight text-foreground">{contact.name}</p>
                        {contact.email && (
                          <p className="text-xs text-muted-foreground mt-0.5">{contact.email}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {contact.company ? (
                      <div className="flex items-center gap-1.5 text-sm text-foreground">
                        <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                        {contact.company}
                      </div>
                    ) : (
                      <span className="text-muted-foreground/50 text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {contact.phone ? (
                      <div className="flex items-center gap-1.5 text-sm font-mono text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" />
                        {contact.phone}
                      </div>
                    ) : (
                      <span className="text-muted-foreground/50 text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium font-mono bg-muted/50 px-2 py-0.5 rounded-md text-muted-foreground border border-border/50">{contact._count?.deals ?? 0}</span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "rounded-full px-2.5 py-0.5 border-0 font-medium",
                        contact.status === "ACTIVE"
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {contact.status === "ACTIVE" ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 premium-interactive hover:bg-muted"
                        onClick={() => handleEdit(contact)}
                      >
                        <Pencil className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 premium-interactive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleDelete(contact)}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {contacts.length > 0 && !isLoading && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-border/60 bg-muted/20">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{(page - 1) * limit + 1}</span> to <span className="font-medium text-foreground">{Math.min(page * limit, total)}</span> of <span className="font-medium text-foreground">{total}</span> contacts
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="premium-interactive h-8"
              >
                Previous
              </Button>
              <div className="text-sm font-medium px-2 text-foreground">
                Page {page} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || totalPages === 0}
                className="premium-interactive h-8"
              >
                Next
              </Button>
            </div>
          </div>
        )}
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
