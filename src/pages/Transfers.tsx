import { CheckCircle2 } from 'lucide-react'
import { RecommendationCard } from '@/components/dashboard/RecommendationCard'
import { RecommendationDetail } from '@/components/dashboard/RecommendationDetail'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useRecommendations } from '@/lib/recommendations-store'
import { useReviewSheet } from '@/lib/use-review-sheet'
import { aiActions } from '@/data/aiActions'

export default function Transfers() {
  const { recommendations } = useRecommendations()
  const { reviewId, open, setOpen, review } = useReviewSheet()
  const transfers = recommendations.filter((r) => r.type === 'transfer')
  const completed = aiActions.filter((a) => a.type === 'transfer')

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Transfers</h1>
        <p className="text-sm text-muted-foreground">Move inventory between stores instead of placing a new purchase order</p>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Recommended transfers</h2>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {transfers.map((rec) => (
            <RecommendationCard key={rec.id} recommendation={rec} onReview={review} />
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recently completed transfers</CardTitle>
          <CardDescription>Executed in the last 7 days</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          {completed.map((a) => (
            <div key={a.id} className="flex items-center justify-between gap-3 py-2.5 border-b border-border last:border-0">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="size-4 text-success" />
                <span className="text-sm">{a.description}</span>
              </div>
              <span className="text-xs text-success font-medium shrink-0">{a.impact}</span>
            </div>
          ))}
          {completed.length === 0 && (
            <div className="text-sm text-muted-foreground py-6 text-center">No transfers completed yet.</div>
          )}
        </CardContent>
      </Card>

      <RecommendationDetail recommendationId={reviewId} open={open} onOpenChange={setOpen} />
    </div>
  )
}
