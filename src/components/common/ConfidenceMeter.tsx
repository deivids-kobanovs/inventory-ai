import { cn } from '@/lib/utils'

export function ConfidenceMeter({ value, className }: { value: number; className?: string }) {
  const tone = value >= 85 ? 'bg-success' : value >= 70 ? 'bg-primary' : 'bg-warning'
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
        <div className={cn('h-full rounded-full', tone)} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs font-medium text-muted-foreground tabular-nums">{value}%</span>
    </div>
  )
}
