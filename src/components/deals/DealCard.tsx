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
        "premium-card p-3.5 select-none transition-all duration-200 group",
        isDragging 
          ? "opacity-70 shadow-2xl ring-2 ring-primary/40 rotate-2 z-50 scale-105 border-primary/30"
          : "cursor-grab active:cursor-grabbing hover:border-border/80"
      )}
    >
      {/* Title + actions */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div {...listeners} className="flex-1 min-w-0 py-0.5">
          <p className="font-semibold text-sm leading-tight line-clamp-2 text-foreground group-hover:text-primary transition-colors">{deal.title}</p>
        </div>
        
        {/* Mobile/Desktop Action Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 -mr-1 premium-interactive opacity-0 group-hover:opacity-100 transition-opacity [&[data-state=open]]:opacity-100 md:opacity-100 lg:opacity-0" />}>
            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-xl border-border/40 shadow-lg">
            {onMove && (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="premium-interactive">
                  <ArrowRightLeft className="mr-2 h-4 w-4" />
                  <span>Move to...</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="rounded-lg shadow-md border-border/40">
                  {STAGES.map((stage) => {
                    if (stage === deal.stage) return null
                    return (
                      <DropdownMenuItem key={stage} onClick={() => onMove(deal, stage)} className="premium-interactive">
                        {stage.charAt(0) + stage.slice(1).toLowerCase()}
                      </DropdownMenuItem>
                    )
                  })}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            )}
            <DropdownMenuSeparator className="bg-border/40" />
            <DropdownMenuItem onClick={() => onEdit(deal)} className="premium-interactive">
              <Pencil className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Edit deal</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive premium-interactive focus:text-destructive focus:bg-destructive/10" onClick={() => onDelete(deal)}>
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete deal</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Contact */}
      {deal.contact && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
          <div className="bg-muted p-1 rounded-md">
            <Building2 className="h-3 w-3 shrink-0" />
          </div>
          <span className="truncate font-medium">
            {deal.contact.company ?? deal.contact.name}
          </span>
        </div>
      )}

      {/* Amount */}
      {deal.amount > 0 && (
        <div className="flex items-center justify-between mt-2 pt-3 border-t border-border/40">
          <div className="flex items-center gap-1.5">
            <div className="bg-emerald-500/10 dark:bg-emerald-500/20 p-1 rounded-md">
              <DollarSign className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-sm font-semibold font-mono text-emerald-700 dark:text-emerald-400 tracking-tight">
              {deal.amount.toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
