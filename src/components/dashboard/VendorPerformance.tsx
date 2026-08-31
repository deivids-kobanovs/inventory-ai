import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { vendors } from '@/data/vendors'
import { cn } from '@/lib/utils'

export function VendorPerformance() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendor Performance</CardTitle>
        <CardDescription>On-time delivery, lead time, and backorder exposure by vendor</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-5">Vendor</TableHead>
              <TableHead className="text-right">On-time</TableHead>
              <TableHead className="text-right">Lead time</TableHead>
              <TableHead className="text-right">Open POs</TableHead>
              <TableHead className="text-right pr-5">Backorders</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendors.map((v) => (
              <TableRow key={v.id}>
                <TableCell className="pl-5">
                  <div className="font-medium">{v.name}</div>
                  <div className="text-xs text-muted-foreground">{v.categories.join(', ')}</div>
                </TableCell>
                <TableCell className="text-right">
                  <span className={cn('font-medium tabular-nums', v.onTimeRate < 85 && 'text-warning-foreground')}>{v.onTimeRate}%</span>
                </TableCell>
                <TableCell className="text-right tabular-nums text-muted-foreground">{v.avgLeadTimeDays}d</TableCell>
                <TableCell className="text-right tabular-nums text-muted-foreground">{v.openPOs}</TableCell>
                <TableCell className="text-right pr-5">
                  {v.backorderedItems > 0 ? (
                    <Badge variant="destructive">{v.backorderedItems}</Badge>
                  ) : (
                    <span className="text-muted-foreground text-xs">—</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
