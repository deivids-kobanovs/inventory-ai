import { ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/format'
import { productById } from '@/data/products'
import { storeById } from '@/data/stores'
import { useRecommendations } from '@/lib/recommendations-store'

export function RecommendedTransfers({ onReview }: { onReview: (id: string) => void }) {
  const { recommendations } = useRecommendations()
  const transfers = recommendations.filter((r) => r.type === 'transfer')

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended Store Transfers</CardTitle>
        <CardDescription>Rebalance inventory between locations before placing new purchase orders</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {transfers.map((t) => {
          const product = productById(t.productId)!
          const from = storeById(t.secondaryStoreId!)!
          const to = storeById(t.storeId)!
          return (
            <button
              key={t.id}
              onClick={() => onReview(t.id)}
              className="flex items-center justify-between gap-3 rounded-lg border border-border p-3 text-left hover:bg-secondary/50 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium truncate">{product.name}</div>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                  <Badge variant="outline" className="font-normal">{from.name}</Badge>
                  <ArrowRight className="size-3" />
                  <Badge variant="outline" className="font-normal">{to.name}</Badge>
                </div>
              </div>
              <div className="text-sm font-semibold text-success shrink-0">{formatCurrency(t.financialImpact)}</div>
            </button>
          )
        })}
      </CardContent>
    </Card>
  )
}
