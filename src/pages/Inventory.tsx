import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { formatCurrency } from '@/lib/format'
import { inventory } from '@/data/inventory'
import { productById, products } from '@/data/products'
import { storeById } from '@/data/stores'
import { useStoreFilter } from '@/lib/store-filter'
import { cn } from '@/lib/utils'

const categories = Array.from(new Set(products.map((p) => p.category)))

type RowStatus = 'at-risk' | 'overstock' | 'dead' | 'healthy'

function getStatus(row: (typeof inventory)[number]): RowStatus {
  const product = productById(row.productId)!
  if (row.avgDailySales30 < 0.12 && row.onHand > 3) return 'dead'
  if (row.daysOfSupply < product.leadTimeDays * 1.15) return 'at-risk'
  if (row.onHand > row.targetStock * 1.5) return 'overstock'
  return 'healthy'
}

const statusMeta: Record<RowStatus, { label: string; className: string }> = {
  'at-risk': { label: 'At risk', className: 'bg-destructive/10 text-destructive border-destructive/20' },
  overstock: { label: 'Overstock', className: 'bg-warning/15 text-warning-foreground border-warning/25' },
  dead: { label: 'Dead stock', className: 'bg-muted text-muted-foreground border-border' },
  healthy: { label: 'Healthy', className: 'bg-success/10 text-success border-success/20' },
}

export default function Inventory() {
  const { storeFilter } = useStoreFilter()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState<RowStatus | 'all'>('all')

  const rows = useMemo(() => {
    return inventory
      .map((row) => ({ row, product: productById(row.productId)!, store: storeById(row.storeId)!, status: getStatus(row) }))
      .filter((r) => storeFilter === 'all' || r.row.storeId === storeFilter)
      .filter((r) => category === 'all' || r.product.category === category)
      .filter((r) => status === 'all' || r.status === status)
      .filter(
        (r) =>
          !search ||
          r.product.name.toLowerCase().includes(search.toLowerCase()) ||
          r.product.sku.toLowerCase().includes(search.toLowerCase()),
      )
      .sort((a, b) => (a.status === 'at-risk' ? -1 : 1) - (b.status === 'at-risk' ? -1 : 1))
  }, [storeFilter, category, status, search])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Inventory</h1>
        <p className="text-sm text-muted-foreground">
          {rows.length} SKU-store combinations {storeFilter !== 'all' ? `at ${storeById(storeFilter)!.name}` : 'across all stores'}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-64">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search SKU or product…" className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger size="sm" className="w-48">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
          <SelectTrigger size="sm" className="w-40">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="at-risk">At risk</SelectItem>
            <SelectItem value="overstock">Overstock</SelectItem>
            <SelectItem value="dead">Dead stock</SelectItem>
            <SelectItem value="healthy">Healthy</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="overflow-hidden py-0">
        <div className="max-h-[640px] overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow>
                <TableHead className="pl-5">SKU</TableHead>
                <TableHead>Product</TableHead>
                {storeFilter === 'all' && <TableHead>Store</TableHead>}
                <TableHead className="text-right">On hand</TableHead>
                <TableHead className="text-right">Reorder pt.</TableHead>
                <TableHead className="text-right">Days of supply</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead className="pr-5">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(({ row, product, store, status: rowStatus }) => (
                <TableRow key={`${row.productId}-${row.storeId}`}>
                  <TableCell className="pl-5 font-mono text-xs text-muted-foreground">{product.sku}</TableCell>
                  <TableCell>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-xs text-muted-foreground">{product.brand} · {product.category}</div>
                  </TableCell>
                  {storeFilter === 'all' && <TableCell className="text-muted-foreground">{store.name}</TableCell>}
                  <TableCell className="text-right tabular-nums font-medium">{row.onHand}</TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">{row.reorderPoint}</TableCell>
                  <TableCell className={cn('text-right tabular-nums', rowStatus === 'at-risk' && 'text-destructive font-medium')}>
                    {row.daysOfSupply >= 999 ? '999+' : row.daysOfSupply.toFixed(1)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{formatCurrency(row.onHand * product.unitCost)}</TableCell>
                  <TableCell className="pr-5">
                    <Badge variant="outline" className={statusMeta[rowStatus].className}>
                      {statusMeta[rowStatus].label}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
