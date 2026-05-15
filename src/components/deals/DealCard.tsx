"use client"

import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { Pencil, Trash2, DollarSign, Building2, MoreHorizontal, ArrowRightLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { STAGES, type Deal, type Stage } from "./types"

interface DealCardProps {
  deal: Deal
  onEdit: (deal: Deal) => void
  onDelete: (deal: Deal) => void
  onMove?: (deal: Deal, newStage: Stage) => void
}

export function DealCard({ deal, onEdit, onDelete, onMove }: DealCardProps) {
  // Disable dragging completely on mobile to prevent scrolling issues
  // We can use a simple media query or just rely on the fact that touch devices 
  // shouldn't drag if we provide a move menu. dnd-kit can be configured, 
  // but for the card itself, we'll keep the drag handle and it will be ignored on mobile 
  // if we set up the sensors in KanbanBoard correctly.
  
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
        "bg-white rounded-xl border shadow-sm p-3.5 select-none transition-all duration-200",
        isDragging && "opacity-50 shadow-xl ring-2 ring-indigo-300 rotate-1 z-50",
        "cursor-grab active:cursor-grabbing"
      )}
    >
      {/* Title + actions */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div {...listeners} className="flex-1 min-w-0 py-1">
          <p className="font-semibold text-sm leading-tight line-clamp-2">{deal.title}</p>
        </div>
        
        {/* Mobile/Desktop Action Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 -mr-1" />}>
            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {onMove && (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <ArrowRightLeft className="mr-2 h-4 w-4" />
                  <span>Move to...</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {STAGES.map((stage) => {
                    if (stage === deal.stage) return null
                    return (
                      <DropdownMenuItem key={stage} onClick={() => onMove(deal, stage)}>
                        {stage.charAt(0) + stage.slice(1).toLowerCase()}
                      </DropdownMenuItem>
                    )
                  })}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit(deal)}>
              <Pencil className="mr-2 h-4 w-4" />
              <span>Edit deal</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => onDelete(deal)}>
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete deal</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
