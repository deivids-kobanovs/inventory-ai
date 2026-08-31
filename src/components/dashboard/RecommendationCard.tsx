import { CheckCircle2, RotateCcw, Sparkles, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SeverityBadge } from '@/components/common/SeverityBadge'
import { ConfidenceMeter } from '@/components/common/ConfidenceMeter'
import { typeMeta } from '@/lib/recommendation-meta'
import { formatCurrency } from '@/lib/format'
import { productById } from '@/data/products'
import { storeById } from '@/data/stores'
import { useRecommendations } from '@/lib/recommendations-store'
import type { RecommendationWithShape } from '@/data/recommendations'
import { cn } from '@/lib/utils'

export function RecommendationCard({
  recommendation,
  onReview,
}: {
  recommendation: RecommendationWithShape
  onReview: (id: string) => void
}) {
  const { approve, reset } = useRecommendations()
  const product = productById(recommendation.productId)!
  const store = storeById(recommendation.storeId)!
  const secondaryStore = recommendation.secondaryStoreId ? storeById(recommendation.secondaryStoreId) : undefined
  const TypeIcon = typeMeta[recommendation.type].icon
  const isPending = recommendation.status === 'pending'

  return (
    <Card
      className={cn(
        'p-5 flex flex-col gap-4 transition-opacity',
        !isPending && 'opacity-60',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <SeverityBadge severity={recommendation.severity} />
          <Badge variant="outline" className="gap-1.5 text-muted-foreground font-normal">
            <TypeIcon className="size-3" />
            {typeMeta[recommendation.type].label}
          </Badge>
          <Badge variant="outline" className="font-normal text-muted-foreground">
            {recommendation.type === 'transfer' && secondaryStore
              ? `${secondaryStore.name} → ${store.name}`
              : secondaryStore
                ? `${store.name} & ${secondaryStore.name}`
                : store.name}
          </Badge>
        </div>
        {!isPending && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            {recommendation.status === 'approved' && (
              <span className="flex items-center gap-1 text-success">
                <CheckCircle2 className="size-3.5" /> Approved
              </span>
            )}
            {recommendation.status === 'dismissed' && (
              <span className="flex items-center gap-1 text-muted-foreground">
                <XCircle className="size-3.5" /> Dismissed
              </span>
            )}
            {recommendation.status === 'modified' && (
              <span className="flex items-center gap-1 text-primary">
                <CheckCircle2 className="size-3.5" /> Modified
              </span>
            )}
            <button
              onClick={() => reset(recommendation.id)}
              className="ml-1 flex items-center gap-1 text-muted-foreground/70 hover:text-foreground"
            >
              <RotateCcw className="size-3" /> Undo
            </button>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-[15px] font-semibold text-foreground leading-snug">{recommendation.title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          {product.sku} · {product.name}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {recommendation.metrics.map((m) => (
          <div key={m.label} className="flex flex-col gap-0.5">
            <span className="text-[11px] text-muted-foreground">{m.label}</span>
            <span
              className={cn(
                'text-sm font-semibold tabular-nums',
                m.tone === 'critical' && 'text-destructive',
                m.tone === 'warning' && 'text-warning-foreground',
                m.tone === 'success' && 'text-success',
              )}
            >
              {m.value}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-2.5 rounded-lg bg-secondary/60 border border-border/60 p-3">
        <Sparkles className="size-4 shrink-0 text-primary mt-0.5" />
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          <span className="font-medium text-foreground">AI explanation: </span>
          {recommendation.aiExplanation}
        </p>
      </div>

      <div className="flex items-end justify-between gap-3 pt-1">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] text-muted-foreground">{recommendation.financialLabel}</span>
          <span className="text-lg font-semibold text-foreground tabular-nums">
            {formatCurrency(recommendation.financialImpact)}
          </span>
          <ConfidenceMeter value={recommendation.confidence} className="mt-0.5" />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onReview(recommendation.id)}>
            Review
          </Button>
          {isPending && (
            <Button size="sm" variant="success" onClick={() => approve(recommendation.id)}>
              Approve
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
