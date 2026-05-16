"use client"

import { useDroppable } from "@dnd-kit/core"
import { Plus } from "lucide-react"
import { DealCard } from "./DealCard"
import { cn } from "@/lib/utils"
import type { Stage, Deal } from "./types"

const STAGE_CONFIG: Record<Stage, {
  label: string
  color: string
  dot: string
  count: string
  total: string
  borderTop: string
}> = {
  LEAD: {
    label: "Lead",
    color: "bg-blue-50/40 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/50",
    dot: "bg-blue-500",
    count: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
    total: "text-blue-700 dark:text-blue-400 font-mono",
    borderTop: "border-t-blue-400",
  },
  PROPOSAL: {
    label: "Proposal",
    color: "bg-violet-50/40 dark:bg-violet-950/20 border-violet-100 dark:border-violet-900/50",
    dot: "bg-violet-500",
    count: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400",
    total: "text-violet-700 dark:text-violet-400 font-mono",
    borderTop: "border-t-violet-400",
  },
  WON: {
    label: "Won ✓",
    color: "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/50",
    dot: "bg-emerald-500",
    count: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    total: "text-emerald-700 dark:text-emerald-400 font-mono",
    borderTop: "border-t-emerald-400",
  },
  LOST: {
    label: "Lost",
    color: "bg-red-50/40 dark:bg-red-950/20 border-red-100 dark:border-red-900/50",
    dot: "bg-red-400",
    count: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
    total: "text-red-700 dark:text-red-400 font-mono",
    borderTop: "border-t-red-400",
  },
}

interface KanbanColumnProps {
  stage: Stage
  deals: Deal[]
  isLoading: boolean
  isActiveTab?: boolean // Added for mobile tabs
  onAdd: () => void
  onEdit: (deal: Deal) => void
  onDelete: (deal: Deal) => void
  onMove: (deal: Deal, newStage: Stage) => void
}

export function KanbanColumn({
  stage,
  deals,
  isLoading,
  isActiveTab = true,
  onAdd,
  onEdit,
  onDelete,
  onMove,
}: KanbanColumnProps) {
  const config = STAGE_CONFIG[stage]
  const { setNodeRef, isOver } = useDroppable({ id: stage })

  const totalValue = deals.reduce((sum, d) => sum + d.amount, 0)

  return (
    <div className={cn("flex-col min-h-[500px]", isActiveTab ? "flex" : "hidden md:flex")}>
      {/* Column header */}
      <div className={cn("rounded-t-xl border border-b-0 px-4 py-3 border-t-2 transition-colors", config.color, config.borderTop)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={cn("h-2 w-2 rounded-full shadow-sm", config.dot)} />
            <span className="font-semibold text-sm tracking-tight text-foreground">{config.label}</span>
            <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", config.count)}>
              {deals.length}
            </span>
          </div>
          <button
            onClick={onAdd}
            className="h-6 w-6 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors premium-interactive"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
        {totalValue > 0 && (
          <p className={cn("text-xs font-medium mt-1.5", config.total)}>
            ${totalValue.toLocaleString()}
          </p>
        )}
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 rounded-b-xl border border-t-0 p-2.5 space-y-2.5 transition-all duration-200 min-h-[400px]",
          config.color,
          isOver && "ring-2 ring-primary/40 ring-inset bg-primary/5 dark:bg-primary/10 shadow-inner"
        )}
      >
        {isLoading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="bg-card rounded-xl border border-border/40 p-3.5 space-y-2 shadow-sm">
              <div className="h-4 bg-muted/60 rounded animate-pulse w-3/4" />
              <div className="h-3 bg-muted/60 rounded animate-pulse w-1/2" />
              <div className="h-3 bg-muted/60 rounded animate-pulse w-1/4 mt-3" />
            </div>
          ))
        ) : deals.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center opacity-70">
            <div className="w-10 h-10 border-2 border-dashed border-muted-foreground/30 rounded-full flex items-center justify-center mb-2">
              <Plus className="h-4 w-4 text-muted-foreground/50" />
            </div>
            <p className="text-xs text-muted-foreground font-medium">Drop deals here</p>
          </div>
        ) : (
          deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} onEdit={onEdit} onDelete={onDelete} onMove={onMove} />
          ))
        )}
      </div>
    </div>
  )
}
