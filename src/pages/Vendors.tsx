import { Star, Truck } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { vendors } from '@/data/vendors'
import { cn } from '@/lib/utils'

export default function Vendors() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Vendors</h1>
        <p className="text-sm text-muted-foreground">Delivery performance and reliability across all supply partners</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vendors.map((v) => (
          <Card key={v.id} className="p-5 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                  <Truck className="size-4.5" />
                </div>
                <div>
                  <div className="font-semibold text-[15px]">{v.name}</div>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {v.categories.map((c) => (
                      <Badge key={c} variant="outline" className="font-normal text-[10px] text-muted-foreground">
                        {c}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm font-medium shrink-0">
                <Star className="size-3.5 fill-warning text-warning" />
                {v.rating.toFixed(1)}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">On-time delivery</span>
                <span className={cn('font-medium', v.onTimeRate < 85 && 'text-warning-foreground')}>{v.onTimeRate}%</span>
              </div>
              <Progress value={v.onTimeRate} indicatorClassName={v.onTimeRate < 85 ? 'bg-warning' : 'bg-success'} />
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-md bg-secondary/50 py-2">
                <div className="text-sm font-semibold">{v.avgLeadTimeDays}d</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">Lead time</div>
              </div>
              <div className="rounded-md bg-secondary/50 py-2">
                <div className="text-sm font-semibold">{v.openPOs}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">Open POs</div>
              </div>
              <div className={cn('rounded-md py-2', v.backorderedItems > 0 ? 'bg-destructive/10' : 'bg-secondary/50')}>
                <div className={cn('text-sm font-semibold', v.backorderedItems > 0 && 'text-destructive')}>{v.backorderedItems}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">Backorders</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
