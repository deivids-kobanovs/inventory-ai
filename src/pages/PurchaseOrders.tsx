import { useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCurrency } from '@/lib/format'
import { purchaseOrders, type PoStatus } from '@/data/purchaseOrders'
import { vendorById } from '@/data/vendors'
import { storeById } from '@/data/stores'
import { productById } from '@/data/products'
import { useRecommendations } from '@/lib/recommendations-store'
import { cn } from '@/lib/utils'

const statusStyles: Record<PoStatus, string> = {
  Draft: 'bg-muted text-muted-foreground border-border',
  Submitted: 'bg-primary/10 text-primary border-primary/20',
  'In Transit': 'bg-warning/15 text-warning-foreground border-warning/25',
  Received: 'bg-success/10 text-success border-success/20',
}

export default function PurchaseOrders() {
  const { recommendations } = useRecommendations()

  const draftsFromAi = useMemo(
    () =>
      recommendations
        .filter((r) => r.status === 'approved' && (r.type === 'reorder' || r.type === 'vendor-backorder' || r.type === 'fast-mover')),
    [recommendations],
  )

  const totalInTransit = purchaseOrders.filter((po) => po.status === 'In Transit').reduce((s, po) => s + po.totalValue, 0)
  const totalOpen = purchaseOrders.filter((po) => po.status !== 'Received').length + draftsFromAi.length

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Purchase Orders</h1>
        <p className="text-sm text-muted-foreground">Open, in-transit, and AI-drafted orders across all vendors</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="text-xs text-muted-foreground">Open purchase orders</div>
          <div className="text-2xl font-semibold mt-1">{totalOpen}</div>
        </Card>
        <Card className="p-5">
          <div className="text-xs text-muted-foreground">Value in transit</div>
          <div className="text-2xl font-semibold mt-1">{formatCurrency(totalInTransit)}</div>
        </Card>
        <Card className="p-5">
          <div className="text-xs text-muted-foreground">AI-drafted this morning</div>
          <div className="text-2xl font-semibold mt-1">{draftsFromAi.length}</div>
        </Card>
      </div>

      {draftsFromAi.length > 0 && (
        <Card className="overflow-hidden py-0">
          <div className="px-5 py-3 border-b border-border bg-secondary/40">
            <h3 className="text-sm font-semibold">AI-drafted orders awaiting submission</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-5">Product</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Store</TableHead>
                <TableHead className="text-right pr-5">Est. value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {draftsFromAi.map((rec) => {
                const product = productById(rec.productId)!
                const vendor = vendorById(product.vendorId)!
                const store = storeById(rec.storeId)!
                return (
                  <TableRow key={rec.id}>
                    <TableCell className="pl-5 font-medium">{product.name}</TableCell>
                    <TableCell className="text-muted-foreground">{vendor.name}</TableCell>
                    <TableCell className="text-muted-foreground">{store.name}</TableCell>
                    <TableCell className="text-right pr-5 tabular-nums">{formatCurrency(rec.financialImpact)}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Card>
      )}

      <Card className="overflow-hidden py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-5">PO number</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Store</TableHead>
              <TableHead className="text-right">Items</TableHead>
              <TableHead className="text-right">Value</TableHead>
              <TableHead>Expected</TableHead>
              <TableHead className="pr-5">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchaseOrders.map((po) => {
              const vendor = vendorById(po.vendorId)!
              const store = storeById(po.storeId)!
              return (
                <TableRow key={po.id}>
                  <TableCell className="pl-5 font-mono text-xs">{po.id}</TableCell>
                  <TableCell className="font-medium">{vendor.name}</TableCell>
                  <TableCell className="text-muted-foreground">{store.name}</TableCell>
                  <TableCell className="text-right tabular-nums">{po.itemCount}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatCurrency(po.totalValue)}</TableCell>
                  <TableCell className="text-muted-foreground">{new Date(po.expectedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</TableCell>
                  <TableCell className="pr-5">
                    <Badge variant="outline" className={cn(statusStyles[po.status])}>
                      {po.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
