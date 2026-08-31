import type { Severity } from '@/types'
import { severityMeta } from '@/lib/recommendation-meta'
import { cn } from '@/lib/utils'

export function SeverityBadge({ severity, className }: { severity: Severity; className?: string }) {
  const meta = severityMeta[severity]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide',
        meta.className,
        className,
      )}
    >
      <span className={cn('size-1.5 rounded-full', meta.dot)} />
      {meta.label}
    </span>
  )
}
