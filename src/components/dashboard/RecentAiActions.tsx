import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { typeMeta } from '@/lib/recommendation-meta'
import { aiActions } from '@/data/aiActions'
import { Sparkles } from 'lucide-react'

function timeAgo(iso: string) {
  const now = new Date('2026-08-31T06:20:00')
  const then = new Date(iso)
  const diffMin = Math.round((now.getTime() - then.getTime()) / 60000)
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.round(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  const diffDay = Math.round(diffHr / 24)
  return `${diffDay}d ago`
}

export function RecentAiActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent AI Actions</CardTitle>
        <CardDescription>Decisions approved or executed across the network</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {aiActions.map((a) => {
          const meta = a.type === 'system' ? { icon: Sparkles } : typeMeta[a.type]
          const Icon = meta.icon
          return (
            <div key={a.id} className="flex items-start gap-3 py-2.5 border-b border-border last:border-0">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground mt-0.5">
                <Icon className="size-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] leading-snug text-foreground">{a.description}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] text-muted-foreground">{timeAgo(a.timestamp)}</span>
                  <span className="text-[11px] text-success font-medium">{a.impact}</span>
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
