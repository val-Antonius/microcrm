"use client"

import { useState, useEffect, useCallback } from "react"
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragOverlay,
} from "@dnd-kit/core"
import { toast } from "sonner"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { KanbanColumn } from "./KanbanColumn"
import { DealCard } from "./DealCard"
import { DealDialog } from "./DealDialog"
import { DeleteDealDialog } from "./DeleteDealDialog"
import { STAGES, type Stage, type Deal, type DealsByStage } from "./types"

interface Contact {
  id: string
  name: string
  company?: string | null
}

export function KanbanBoard() {
  const [dealsByStage, setDealsByStage] = useState<DealsByStage>({
    LEAD: [],
    PROPOSAL: [],
    WON: [],
    LOST: [],
  })
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
  const [defaultStage, setDefaultStage] = useState<Stage>("LEAD")
  const [activeTab, setActiveTab] = useState<Stage>("LEAD") // For mobile view

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const fetchDeals = useCallback(async () => {
    setIsLoading(true)
    try {
      const [dealsRes, contactsRes] = await Promise.all([
        fetch("/api/deals"),
        fetch("/api/contacts?limit=all"),
      ])
      if (!dealsRes.ok || !contactsRes.ok) throw new Error()

      const deals: Deal[] = await dealsRes.json()
      const contactsData = await contactsRes.json()

      setContacts(contactsData.contacts || [])

      const grouped: DealsByStage = { LEAD: [], PROPOSAL: [], WON: [], LOST: [] }
      deals.forEach((deal) => { grouped[deal.stage].push(deal) })
      setDealsByStage(grouped)
    } catch {
      toast.error("Failed to load deals")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchDeals() }, [fetchDeals])

  const getActiveDeal = (): Deal | null => {
    if (!activeId) return null
    for (const stage of STAGES) {
      const found = dealsByStage[stage].find((d) => d.id === activeId)
      if (found) return found
    }
    return null
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return
    const dealId = active.id as string
    const newStage = over.id as Stage
    if (!STAGES.includes(newStage)) return

    let currentStage: Stage | null = null
    let deal: Deal | null = null

    for (const stage of STAGES) {
      const found = dealsByStage[stage].find((d) => d.id === dealId)
      if (found) { currentStage = stage; deal = found; break }
    }

    if (!deal || !currentStage || currentStage === newStage) return

    // Optimistic update
    setDealsByStage((prev) => {
      const next = { ...prev }
      next[currentStage!] = prev[currentStage!].filter((d) => d.id !== dealId)
      next[newStage] = [...prev[newStage], { ...deal!, stage: newStage }]
      return next
    })

    try {
      const res = await fetch(`/api/deals/${dealId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: newStage }),
      })
      if (!res.ok) throw new Error()
      const label = newStage.charAt(0) + newStage.slice(1).toLowerCase()
      toast.success(`Moved to ${label}`)
    } catch {
      toast.error("Failed to update deal stage")
      fetchDeals()
    }
  }

  const handleMove = async (deal: Deal, newStage: Stage) => {
    if (deal.stage === newStage) return

    // Optimistic update
    setDealsByStage((prev) => {
      const next = { ...prev }
      next[deal.stage] = prev[deal.stage].filter((d) => d.id !== deal.id)
      next[newStage] = [...prev[newStage], { ...deal, stage: newStage }]
      return next
    })

    try {
      const res = await fetch(`/api/deals/${deal.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: newStage }),
      })
      if (!res.ok) throw new Error()
      const label = newStage.charAt(0) + newStage.slice(1).toLowerCase()
      toast.success(`Moved to ${label}`)
    } catch {
      toast.error("Failed to update deal stage")
      fetchDeals()
    }
  }

  const handleAdd = (stage: Stage = "LEAD") => {
    setSelectedDeal(null)
    setDefaultStage(stage)
    setDialogOpen(true)
  }

  const handleEdit = (deal: Deal) => { setSelectedDeal(deal); setDialogOpen(true) }
  const handleDelete = (deal: Deal) => { setSelectedDeal(deal); setDeleteDialogOpen(true) }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pipeline</h1>
          <p className="text-muted-foreground mt-1">Drag deals between stages to update progress</p>
        </div>
        <Button onClick={() => handleAdd(activeTab)} className="bg-primary hover:bg-primary/90 text-primary-foreground premium-interactive gap-2 self-start sm:self-auto">
          <Plus className="h-4 w-4" /> Add Deal
        </Button>
      </div>

      {/* Mobile Tabs */}
      <div className="flex md:hidden overflow-x-auto gap-2 pb-4 mb-2 -mx-6 px-6 snap-x hide-scrollbar">
        {STAGES.map((stage) => {
          const isActive = activeTab === stage
          const label = stage.charAt(0) + stage.slice(1).toLowerCase()
          const count = dealsByStage[stage].length
          return (
            <button
              key={stage}
              onClick={() => setActiveTab(stage)}
              className={`flex-none snap-start whitespace-nowrap px-4 py-2 text-sm font-medium rounded-full border transition-colors ${
                isActive 
                  ? "bg-foreground text-background border-foreground" 
                  : "bg-background text-muted-foreground hover:bg-muted"
              }`}
            >
              {label} <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${isActive ? "bg-background/20" : "bg-muted"}`}>{count}</span>
            </button>
          )
        })}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 pb-8">
          {STAGES.map((stage) => (
            <KanbanColumn
              key={stage}
              stage={stage}
              deals={dealsByStage[stage]}
              isLoading={isLoading}
              isActiveTab={activeTab === stage}
              onAdd={() => handleAdd(stage)}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onMove={handleMove}
            />
          ))}
        </div>

        <DragOverlay>
          {activeId ? (
            <div className="rotate-2 opacity-90">
              {(() => {
                const deal = getActiveDeal()
                return deal ? <DealCard deal={deal} onEdit={() => {}} onDelete={() => {}} /> : null
              })()}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <DealDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSuccess={fetchDeals}
        deal={selectedDeal}
        contacts={contacts}
        defaultStage={defaultStage}
      />
      <DeleteDealDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onSuccess={fetchDeals}
        deal={selectedDeal}
      />
    </>
  )
}
