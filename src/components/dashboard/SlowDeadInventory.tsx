import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { formatCurrency } from '@/lib/format'
import { productById } from '@/data/products'
import { storeById } from '@/data/stores'
import { slowDeadInventory } from '@/data/analytics'

export function SlowDeadInventory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Slow / Dead Inventory</CardTitle>
        <CardDescription>Highest cash value sitting in stalled SKUs</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {slowDeadInventory.map((s) => {
          const product = productById(s.productId)!
          const store = storeById(s.storeId)!
          return (
            <div key={`${s.productId}-${s.storeId}`} className="flex items-center justify-between gap-3 py-2.5 border-b border-border last:border-0">
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{product.name}</div>
                <div className="text-xs text-muted-foreground">
                  {store.name} · {s.daysOfSupply >= 999 ? '999+' : Math.round(s.daysOfSupply)} days of supply
                </div>
              </div>
              <div className="text-sm font-semibold text-warning-foreground shrink-0">{formatCurrency(s.value)}</div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
