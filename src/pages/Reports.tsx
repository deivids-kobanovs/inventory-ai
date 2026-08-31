import { useMemo } from 'react'
import { toast } from 'sonner'
import { FileText } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCurrency } from '@/lib/format'
import { inventory } from '@/data/inventory'
import { productById, products } from '@/data/products'
import { inventoryRiskByStore, deadInventoryRows } from '@/data/analytics'
import { StorewideProfitChart } from '@/components/reports/StorewideProfitChart'
import { DepartmentProfitForecasts } from '@/components/reports/DepartmentProfitForecasts'

const categories = Array.from(new Set(products.map((p) => p.category)))

const savedReports = [
  { title: 'Weekly Inventory Health Summary', description: 'KPI snapshot across all stores, delivered every Monday morning', lastRun: 'Aug 31, 2026' },
  { title: 'Dead & Slow-Moving Stock', description: 'SKUs with no sell-through in 60+ days, by store and category', lastRun: 'Aug 30, 2026' },
  { title: 'Vendor Scorecard', description: 'On-time delivery, defect rate, and backorder trends by vendor', lastRun: 'Aug 24, 2026' },
  { title: 'Cash Tied Up in Inventory', description: 'Overstock and dead-stock cash exposure with release recommendations', lastRun: 'Aug 31, 2026' },
]

export default function Reports() {
  const categoryValue = useMemo(
    () =>
      categories
        .map((category) => ({
          category,
          value: inventory
            .filter((r) => productById(r.productId)!.category === category)
            .reduce((s, r) => s + r.onHand * productById(r.productId)!.unitCost, 0),
        }))
        .sort((a, b) => b.value - a.value),
    [],
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
        <p className="text-sm text-muted-foreground">Scheduled and on-demand reporting across inventory, vendors, and cash flow</p>
      </div>

      <StorewideProfitChart />

      <DepartmentProfitForecasts />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Inventory Value by Category</CardTitle>
            <CardDescription>On-hand cost value, all stores combined</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={categoryValue} layout="vertical" margin={{ left: 8, right: 16 }}>
                <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} />
                <YAxis
                  type="category"
                  dataKey="category"
                  width={110}
                  tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(v) => formatCurrency(Number(v))}
                  contentStyle={{ background: 'var(--color-popover)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="value" fill="var(--color-chart-1)" radius={[0, 4, 4, 0]} maxBarSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory Value &amp; Risk by Store</CardTitle>
            <CardDescription>Open AI decisions and cash on hand by location</CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-5">Store</TableHead>
                  <TableHead className="text-right">Inventory value</TableHead>
                  <TableHead className="text-right">Critical</TableHead>
                  <TableHead className="text-right pr-5">Warning</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventoryRiskByStore.map((s) => (
                  <TableRow key={s.storeId}>
                    <TableCell className="pl-5 font-medium">{s.storeName}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatCurrency(s.inventoryValue, { compact: true })}</TableCell>
                    <TableCell className="text-right tabular-nums text-destructive font-medium">{s.critical}</TableCell>
                    <TableCell className="text-right pr-5 tabular-nums text-warning-foreground font-medium">{s.warning}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="px-5 pt-4 text-xs text-muted-foreground">
              {deadInventoryRows.length} SKUs flagged as dead inventory network-wide
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Saved Reports</CardTitle>
          <CardDescription>Generate an updated export using this morning's data</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {savedReports.map((r) => (
            <div key={r.title} className="flex items-start justify-between gap-3 rounded-lg border border-border p-4">
              <div className="flex items-start gap-3 min-w-0">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary text-muted-foreground">
                  <FileText className="size-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium">{r.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{r.description}</div>
                  <div className="text-[11px] text-muted-foreground mt-1.5">Last run {r.lastRun}</div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0"
                onClick={() => toast('Report generated', { description: `${r.title} is ready in your reports library.` })}
              >
                Generate
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
