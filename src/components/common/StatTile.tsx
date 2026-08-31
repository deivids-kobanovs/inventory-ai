import { ArrowDownRight, ArrowUpRight, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export function StatTile({
  label,
  value,
  sublabel,
  delta,
  deltaSuffix = 'vs last year',
  icon: Icon,
  iconTone,
}: {
  label: string
  value: string
  sublabel?: string
  delta?: number
  deltaSuffix?: string
  icon?: LucideIcon
  iconTone?: 'up' | 'down' | 'flat'
}) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-border bg-secondary/40 px-4 py-3">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span className="text-xl font-semibold tabular-nums text-foreground flex items-center gap-1.5">
        {Icon && (
          <Icon
            className={cn(
              'size-4',
              iconTone === 'up' && 'text-success',
              iconTone === 'down' && 'text-destructive',
              iconTone === 'flat' && 'text-muted-foreground',
            )}
          />
        )}
        {value}
      </span>
      {delta !== undefined ? (
        <span className={cn('flex items-center gap-1 text-xs font-medium', delta >= 0 ? 'text-success' : 'text-destructive')}>
          {delta >= 0 ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
          {delta >= 0 ? '+' : ''}
          {delta.toFixed(1)}% {deltaSuffix}
        </span>
      ) : (
        sublabel && <span className="text-[11px] text-muted-foreground">{sublabel}</span>
      )}
    </div>
  )
}
