import { useMemo } from 'react'
import { Sparkles, Wallet } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { SeverityBadge } from '@/components/common/SeverityBadge'
import { ConfidenceMeter } from '@/components/common/ConfidenceMeter'
import { SalesForecastChart } from './SalesForecastChart'
import { typeMeta } from '@/lib/recommendation-meta'
import { formatCurrency } from '@/lib/format'
import { productById } from '@/data/products'
import { stores, storeById } from '@/data/stores'
import { getInventoryByProduct } from '@/data/inventory'
import { generateSalesHistory } from '@/data/salesHistory'
import { useRecommendations } from '@/lib/recommendations-store'
import { cn } from '@/lib/utils'

export function RecommendationDetail({
  recommendationId,
  open,
  onOpenChange,
}: {
  recommendationId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { recommendations, approve, dismiss, modify } = useRecommendations()
  const recommendation = recommendations.find((r) => r.id === recommendationId)

  const chartData = useMemo(() => {
    if (!recommendation) return []
    return generateSalesHistory(recommendation.productId, recommendation.storeId, { shape: recommendation.chartShape })
  }, [recommendation])

  if (!recommendation) return null

  const product = productById(recommendation.productId)!
  const store = storeById(recommendation.storeId)!
  const secondaryStore = recommendation.secondaryStoreId ? storeById(recommendation.secondaryStoreId) : undefined
  const inventoryByStore = getInventoryByProduct(recommendation.productId)
  const TypeIcon = typeMeta[recommendation.type].icon
  const isPending = recommendation.status === 'pending'

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <SeverityBadge severity={recommendation.severity} />
            <Badge variant="outline" className="gap-1.5 text-muted-foreground font-normal">
              <TypeIcon className="size-3" />
              {typeMeta[recommendation.type].label}
            </Badge>
          </div>
          <SheetTitle className="text-lg">{recommendation.title}</SheetTitle>
          <SheetDescription>
            {product.sku} · {product.brand} {product.name}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-6 px-6 py-5">
          {/* Product info */}
          <section className="grid grid-cols-2 gap-3 text-sm">
            <InfoRow label="Category" value={product.category} />
            <InfoRow label="Vendor lead time" value={`${product.leadTimeDays} days`} />
            <InfoRow label="Unit cost" value={formatCurrency(product.unitCost)} />
            <InfoRow label="Unit price" value={formatCurrency(product.unitPrice)} />
            <InfoRow label="Primary store" value={store.name} />
            {secondaryStore && <InfoRow label="Secondary store" value={secondaryStore.name} />}
          </section>

          <Separator />

          {/* Metrics */}
          <section>
            <h4 className="text-sm font-semibold mb-3">Current situation</h4>
            <div className="grid grid-cols-2 gap-3">
              {recommendation.metrics.map((m) => (
                <div key={m.label} className="rounded-lg border border-border bg-secondary/40 p-3">
                  <span className="text-[11px] text-muted-foreground">{m.label}</span>
                  <div
                    className={cn(
                      'text-base font-semibold tabular-nums mt-0.5',
                      m.tone === 'critical' && 'text-destructive',
                      m.tone === 'warning' && 'text-warning-foreground',
                      m.tone === 'success' && 'text-success',
                    )}
                  >
                    {m.value}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Inventory by store */}
          <section>
            <h4 className="text-sm font-semibold mb-3">Inventory by store</h4>
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-secondary/60 text-[11px] uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="text-left font-medium px-3 py-2">Store</th>
                    <th className="text-right font-medium px-3 py-2">On hand</th>
                    <th className="text-right font-medium px-3 py-2">Days of supply</th>
                  </tr>
                </thead>
                <tbody>
                  {stores.map((s) => {
                    const row = inventoryByStore.find((r) => r.storeId === s.id)
                    const isFocus = s.id === recommendation.storeId || s.id === recommendation.secondaryStoreId
                    return (
                      <tr key={s.id} className={cn('border-t border-border', isFocus && 'bg-primary/5')}>
                        <td className="px-3 py-2 font-medium">{s.name}</td>
                        <td className="px-3 py-2 text-right tabular-nums">{row?.onHand ?? '—'}</td>
                        <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">
                          {row ? (row.daysOfSupply >= 999 ? '999+' : row.daysOfSupply.toFixed(1)) : '—'} days
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Chart */}
          <section>
            <h4 className="text-sm font-semibold mb-1">Sales history & forecast</h4>
            <p className="text-xs text-muted-foreground mb-2">Last 45 days actual, next 14 days forecast at {store.name}</p>
            <SalesForecastChart data={chartData} />
          </section>

          <Separator />

          {/* Explanation */}
          <section className="flex gap-2.5 rounded-lg bg-secondary/60 border border-border/60 p-3.5">
            <Sparkles className="size-4 shrink-0 text-primary mt-0.5" />
            <div>
              <span className="text-sm font-medium text-foreground">Why the AI recommends this</span>
              <p className="text-[13px] leading-relaxed text-muted-foreground mt-1">{recommendation.aiExplanation}</p>
            </div>
          </section>

          {/* Financial impact */}
          <section className="flex items-center justify-between rounded-lg border border-border p-3.5">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-full bg-success/10 text-success">
                <Wallet className="size-4" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">{recommendation.financialLabel}</div>
                <div className="text-base font-semibold tabular-nums">{formatCurrency(recommendation.financialImpact)}</div>
              </div>
            </div>
            <ConfidenceMeter value={recommendation.confidence} />
          </section>

          {/* Proposed action */}
          <section>
            <h4 className="text-sm font-semibold mb-1.5">Proposed action</h4>
            <p className="text-[13px] leading-relaxed text-muted-foreground rounded-lg border border-dashed border-border p-3">
              {recommendation.proposedAction}
            </p>
          </section>
        </div>

        <SheetFooter className="gap-2">
          {isPending ? (
            <>
              <Button variant="outline" className="flex-1" onClick={() => dismiss(recommendation.id)}>
                Dismiss
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => modify(recommendation.id)}>
                Modify
              </Button>
              <Button
                variant="success"
                className="flex-1"
                onClick={() => {
                  approve(recommendation.id)
                  onOpenChange(false)
                }}
              >
                Approve
              </Button>
            </>
          ) : (
            <div className="flex w-full items-center justify-center text-sm text-muted-foreground py-1 capitalize">
              This recommendation has been {recommendation.status}
            </div>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}
