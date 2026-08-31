import { useMemo, useState } from 'react'
import { RecommendationCard } from '@/components/dashboard/RecommendationCard'
import { RecommendationDetail } from '@/components/dashboard/RecommendationDetail'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useRecommendations } from '@/lib/recommendations-store'
import { useReviewSheet } from '@/lib/use-review-sheet'
import { typeMeta } from '@/lib/recommendation-meta'
import { stores } from '@/data/stores'
import type { RecommendationStatus } from '@/types'

const severityRank = { critical: 0, warning: 1, info: 2 }

export default function AiDecisions() {
  const { recommendations } = useRecommendations()
  const { reviewId, open, setOpen, review } = useReviewSheet()
  const [status, setStatus] = useState<RecommendationStatus | 'all'>('all')
  const [type, setType] = useState('all')
  const [store, setStore] = useState('all')

  const filtered = useMemo(() => {
    return [...recommendations]
      .filter((r) => status === 'all' || r.status === status)
      .filter((r) => type === 'all' || r.type === type)
      .filter((r) => store === 'all' || r.storeId === store || r.secondaryStoreId === store)
      .sort((a, b) => severityRank[a.severity] - severityRank[b.severity])
  }, [recommendations, status, type, store])

  const pendingCount = recommendations.filter((r) => r.status === 'pending').length

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">AI Decisions</h1>
        <p className="text-sm text-muted-foreground">
          Every recommendation the AI has surfaced across all 3 stores · {pendingCount} pending review
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Tabs value={status} onValueChange={(v) => setStatus(v as typeof status)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="dismissed">Dismissed</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex-1" />

        <Select value={type} onValueChange={setType}>
          <SelectTrigger size="sm" className="w-48">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {Object.entries(typeMeta).map(([key, meta]) => (
              <SelectItem key={key} value={key}>
                {meta.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={store} onValueChange={setStore}>
          <SelectTrigger size="sm" className="w-40">
            <SelectValue placeholder="All stores" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All stores</SelectItem>
            {stores.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
          No recommendations match these filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {filtered.map((rec) => (
            <RecommendationCard key={rec.id} recommendation={rec} onReview={review} />
          ))}
        </div>
      )}

      <RecommendationDetail recommendationId={reviewId} open={open} onOpenChange={setOpen} />
    </div>
  )
}
