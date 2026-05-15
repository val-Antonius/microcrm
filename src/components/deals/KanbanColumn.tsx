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
}> = {
  LEAD: {
    label: "Lead",
    color: "bg-blue-50/80 border-blue-200",
    dot: "bg-blue-400",
    count: "bg-blue-100 text-blue-700",
    total: "text-blue-700",
  },
  PROPOSAL: {
    label: "Proposal",
    color: "bg-violet-50/80 border-violet-200",
    dot: "bg-violet-400",
    count: "bg-violet-100 text-violet-700",
    total: "text-violet-700",
  },
  WON: {
    label: "Won ✓",
    color: "bg-emerald-50/80 border-emerald-200",
    dot: "bg-emerald-400",
    count: "bg-emerald-100 text-emerald-700",
    total: "text-emerald-700",
  },
  LOST: {
    label: "Lost",
    color: "bg-red-50/80 border-red-200",
    dot: "bg-red-300",
    count: "bg-red-100 text-red-600",
    total: "text-red-600",
  },
}

interface KanbanColumnProps {
  stage: Stage
  deals: Deal[]
  isLoading: boolean
  onAdd: () => void
  onEdit: (deal: Deal) => void
  onDelete: (deal: Deal) => void
}

export function KanbanColumn({
  stage,
  deals,
  isLoading,
  onAdd,
  onEdit,
  onDelete,
}: KanbanColumnProps) {
  const config = STAGE_CONFIG[stage]
  const { setNodeRef, isOver } = useDroppable({ id: stage })

  const totalValue = deals.reduce((sum, d) => sum + d.amount, 0)

  return (
    <div className="flex flex-col min-h-[500px]">
      {/* Column header */}
      <div className={cn("rounded-t-xl border border-b-0 px-4 py-3", config.color)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={cn("h-2 w-2 rounded-full", config.dot)} />
            <span className="font-semibold text-sm">{config.label}</span>
            <span className={cn("text-xs font-medium px-1.5 py-0.5 rounded-full", config.count)}>
              {deals.length}
            </span>
          </div>
          <button
            onClick={onAdd}
            className="h-6 w-6 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-black/5 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
        {totalValue > 0 && (
          <p className={cn("text-xs font-medium mt-1", config.total)}>
            ${totalValue.toLocaleString()}
          </p>
        )}
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 rounded-b-xl border border-t-0 p-2 space-y-2 transition-colors min-h-[400px]",
          config.color,
          isOver && "ring-2 ring-indigo-400 ring-inset bg-indigo-50/30"
        )}
      >
        {isLoading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border p-3.5 space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
              <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
              <div className="h-3 bg-muted rounded animate-pulse w-1/4 mt-3" />
            </div>
          ))
        ) : deals.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <p className="text-xs text-muted-foreground">Drop deals here</p>
          </div>
        ) : (
          deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} onEdit={onEdit} onDelete={onDelete} />
          ))
        )}
      </div>
    </div>
  )
}
