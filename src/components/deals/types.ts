export const STAGES = ["LEAD", "PROPOSAL", "WON", "LOST"] as const
export type Stage = (typeof STAGES)[number]

export interface DealContact {
  id: string
  name: string
  company?: string | null
}

export interface Deal {
  id: string
  title: string
  amount: number
  stage: Stage
  contactId: string
  contact: DealContact
  createdAt: string
}

export type DealsByStage = Record<Stage, Deal[]>
