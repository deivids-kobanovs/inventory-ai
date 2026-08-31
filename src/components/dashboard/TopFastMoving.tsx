import { TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { productById } from '@/data/products'
import { storeById } from '@/data/stores'
import { topFastMovers } from '@/data/analytics'

export function TopFastMoving() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Fast-Moving Products</CardTitle>
        <CardDescription>Largest week-over-week sell-through acceleration</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {topFastMovers.map((f) => {
          const product = productById(f.productId)!
          const store = storeById(f.storeId)!
          return (
            <div key={`${f.productId}-${f.storeId}`} className="flex items-center justify-between gap-3 py-2.5 border-b border-border last:border-0">
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{product.name}</div>
                <div className="text-xs text-muted-foreground">
                  {store.name} · {f.unitsPerDay.toFixed(1)} units/day
                </div>
              </div>
              <div className="flex items-center gap-1 text-success text-sm font-semibold shrink-0">
                <TrendingUp className="size-3.5" />+{Math.round(f.growthPct)}%
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
