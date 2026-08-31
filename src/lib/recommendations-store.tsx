import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { toast } from 'sonner'
import { CheckCircle2, ArrowLeftRight, PackageCheck } from 'lucide-react'
import { recommendations as initialRecommendations, type RecommendationWithShape } from '@/data/recommendations'
import type { RecommendationStatus } from '@/types'

interface RecommendationsContextValue {
  recommendations: RecommendationWithShape[]
  approve: (id: string) => void
  dismiss: (id: string) => void
  modify: (id: string, note?: string) => void
  reset: (id: string) => void
}

const RecommendationsContext = createContext<RecommendationsContextValue | null>(null)

function approvalMessage(rec: RecommendationWithShape) {
  switch (rec.type) {
    case 'transfer':
      return { title: 'Transfer request created', icon: ArrowLeftRight }
    case 'overstock':
    case 'cash-release':
      return { title: 'Purchase order quantity adjusted', icon: PackageCheck }
    case 'reorder':
    case 'vendor-backorder':
    case 'fast-mover':
      return { title: 'Recommendation approved — purchase order draft created', icon: CheckCircle2 }
    default:
      return { title: 'Recommendation approved — action queued', icon: CheckCircle2 }
  }
}

export function RecommendationsProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<RecommendationWithShape[]>(initialRecommendations)

  const setStatus = useCallback((id: string, status: RecommendationStatus) => {
    setItems((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
  }, [])

  const approve = useCallback(
    (id: string) => {
      const rec = items.find((r) => r.id === id)
      if (!rec) return
      setStatus(id, 'approved')
      const { title, icon: Icon } = approvalMessage(rec)
      toast.custom(
        () => (
          <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 shadow-lg w-[380px]">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
              <Icon className="size-4" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold text-foreground">{title}</span>
              <span className="text-xs text-muted-foreground">{rec.title}</span>
            </div>
          </div>
        ),
        { duration: 4000 },
      )
    },
    [items, setStatus],
  )

  const dismiss = useCallback(
    (id: string) => {
      setStatus(id, 'dismissed')
      toast('Recommendation dismissed', { description: 'It has been moved out of your active queue.' })
    },
    [setStatus],
  )

  const modify = useCallback(
    (id: string) => {
      setStatus(id, 'modified')
      toast('Recommendation updated', { description: 'Your changes were saved to the proposed action.' })
    },
    [setStatus],
  )

  const reset = useCallback(
    (id: string) => {
      setStatus(id, 'pending')
    },
    [setStatus],
  )

  const value = useMemo(() => ({ recommendations: items, approve, dismiss, modify, reset }), [items, approve, dismiss, modify, reset])

  return <RecommendationsContext.Provider value={value}>{children}</RecommendationsContext.Provider>
}

export function useRecommendations() {
  const ctx = useContext(RecommendationsContext)
  if (!ctx) throw new Error('useRecommendations must be used within RecommendationsProvider')
  return ctx
}
