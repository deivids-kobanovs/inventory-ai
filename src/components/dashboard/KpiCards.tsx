import { AlertTriangle, Ban, PackageX, PiggyBank, TrendingDown, Wallet } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/format'
import {
  cashReleasable,
  deadInventoryRows,
  deadInventoryValue,
  overstockRows,
  overstockValue,
  potentialLostSales,
  stockoutRiskRows,
  stockoutRiskValue,
  totalInventoryValue,
} from '@/data/analytics'

const kpis = [
  {
    label: 'Inventory Value',
    value: formatCurrency(totalInventoryValue, { compact: true }),
    sublabel: 'On hand across 3 stores',
    icon: Wallet,
    tone: 'neutral' as const,
  },
  {
    label: 'Stock-out Risk',
    value: formatCurrency(stockoutRiskValue, { compact: true }),
    sublabel: `${stockoutRiskRows.length} SKU-store combos trending toward stockout`,
    icon: AlertTriangle,
    tone: 'critical' as const,
  },
  {
    label: 'Overstock',
    value: formatCurrency(overstockValue, { compact: true }),
    sublabel: `${overstockRows.length} SKUs above target stock level`,
    icon: PackageX,
    tone: 'warning' as const,
  },
  {
    label: 'Dead Inventory',
    value: formatCurrency(deadInventoryValue, { compact: true }),
    sublabel: `${deadInventoryRows.length} SKUs with no recent sales`,
    icon: Ban,
    tone: 'warning' as const,
  },
  {
    label: 'Potential Lost Sales',
    value: formatCurrency(potentialLostSales, { compact: true }),
    sublabel: 'If open reorder alerts are ignored',
    icon: TrendingDown,
    tone: 'critical' as const,
  },
  {
    label: 'Cash That Could Be Released',
    value: formatCurrency(cashReleasable, { compact: true }),
    sublabel: 'By acting on overstock & dead stock',
    icon: PiggyBank,
    tone: 'success' as const,
  },
]

const toneStyles = {
  neutral: 'bg-secondary text-foreground',
  critical: 'bg-destructive/10 text-destructive',
  warning: 'bg-warning/15 text-warning-foreground',
  success: 'bg-success/10 text-success',
}

export function KpiCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {kpis.map((kpi) => (
        <Card key={kpi.label} className="p-5 flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1.5 min-w-0">
            <span className="text-xs font-medium text-muted-foreground">{kpi.label}</span>
            <span className="text-2xl font-semibold tracking-tight tabular-nums">{kpi.value}</span>
            <span className="text-xs text-muted-foreground leading-snug">{kpi.sublabel}</span>
          </div>
          <div className={cn('flex size-9 shrink-0 items-center justify-center rounded-lg', toneStyles[kpi.tone])}>
            <kpi.icon className="size-4.5" />
          </div>
        </Card>
      ))}
    </div>
  )
}
