"use client"

import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { Pencil, Trash2, DollarSign, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Deal } from "./types"

interface DealCardProps {
  deal: Deal
  onEdit: (deal: Deal) => void
  onDelete: (deal: Deal) => void
}

export function DealCard({ deal, onEdit, onDelete }: DealCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: deal.id,
  })

  const style = {
    transform: CSS.Translate.toString(transform),
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn(
        "bg-white rounded-xl border shadow-sm p-3.5 cursor-grab active:cursor-grabbing select-none group transition-all duration-200",
        isDragging && "opacity-50 shadow-xl ring-2 ring-indigo-300 rotate-1 z-50"
      )}
    >
      {/* Title + actions */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div {...listeners} className="flex-1 min-w-0">
          <p className="font-semibold text-sm leading-tight line-clamp-2">{deal.title}</p>
        </div>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => { e.stopPropagation(); onEdit(deal) }}
          >
            <Pencil className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-destructive hover:text-destructive"
            onClick={(e) => { e.stopPropagation(); onDelete(deal) }}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Contact */}
      {deal.contact && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
          <Building2 className="h-3 w-3 shrink-0" />
          <span className="truncate">
            {deal.contact.company ?? deal.contact.name}
          </span>
        </div>
      )}

      {/* Amount */}
      {deal.amount > 0 && (
        <div className="flex items-center gap-1 mt-2 pt-2 border-t">
          <DollarSign className="h-3 w-3 text-green-600" />
          <span className="text-sm font-semibold text-green-700">
            {deal.amount.toLocaleString("en-US", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </span>
        </div>
      )}
    </div>
  )
}
