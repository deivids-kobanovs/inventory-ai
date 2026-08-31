import { useMemo } from 'react'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { DemandForecastChart } from '@/components/dashboard/DemandForecastChart'
import { formatCurrency } from '@/lib/format'
import { inventory } from '@/data/inventory'
import { productById, products } from '@/data/products'
import { cn } from '@/lib/utils'

const categories = Array.from(new Set(products.map((p) => p.category)))

export default function Forecasting() {
  const categoryForecast = useMemo(() => {
    return categories
      .map((category) => {
        const rows = inventory.filter((r) => productById(r.productId)!.category === category)
        const dailyUnits = rows.reduce((s, r) => s + r.avgDailySales30, 0)
        const dailyUnits7 = rows.reduce((s, r) => s + r.avgDailySales7, 0)
        const trend = dailyUnits > 0 ? ((dailyUnits7 - dailyUnits) / dailyUnits) * 100 : 0
        const forecastValue = rows.reduce((s, r) => s + r.avgDailySales30 * 14 * productById(r.productId)!.unitPrice, 0)
        return { category, dailyUnits, trend, forecastValue }
      })
      .sort((a, b) => b.forecastValue - a.forecastValue)
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Forecasting</h1>
        <p className="text-sm text-muted-foreground">14-day demand projections generated from 90 days of ERP sell-through history</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="text-xs text-muted-foreground">Forecast accuracy (90-day)</div>
          <div className="text-2xl font-semibold mt-1">92.4%</div>
          <div className="text-xs text-muted-foreground mt-1">Mean absolute percentage error: 7.6%</div>
        </Card>
        <Card className="p-5">
          <div className="text-xs text-muted-foreground">Projected 14-day revenue</div>
          <div className="text-2xl font-semibold mt-1">
            {formatCurrency(categoryForecast.reduce((s, c) => s + c.forecastValue, 0), { compact: true })}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Across all categories and stores</div>
        </Card>
        <Card className="p-5">
          <div className="text-xs text-muted-foreground">Categories trending up</div>
          <div className="text-2xl font-semibold mt-1">{categoryForecast.filter((c) => c.trend > 5).length} of {categories.length}</div>
          <div className="text-xs text-muted-foreground mt-1">Trailing 7-day vs. 30-day pace</div>
        </Card>
      </div>

      <DemandForecastChart />

      <Card>
        <CardHeader>
          <CardTitle>Demand Forecast by Category</CardTitle>
          <CardDescription>Projected units/day and 14-day revenue opportunity</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          {categoryForecast.map((c) => (
            <div key={c.category} className="flex items-center justify-between gap-3 py-2.5 border-b border-border last:border-0">
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium">{c.category}</div>
                <div className="text-xs text-muted-foreground">{c.dailyUnits.toFixed(1)} units/day company-wide</div>
              </div>
              <div
                className={cn(
                  'flex items-center gap-1 text-xs font-semibold shrink-0 w-16',
                  c.trend >= 0 ? 'text-success' : 'text-destructive',
                )}
              >
                {c.trend >= 0 ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
                {c.trend >= 0 ? '+' : ''}
                {c.trend.toFixed(0)}%
              </div>
              <div className="text-sm font-semibold tabular-nums w-24 text-right shrink-0">{formatCurrency(c.forecastValue)}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
