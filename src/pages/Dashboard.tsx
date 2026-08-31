import { Link } from 'react-router-dom'
import { ArrowRight, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { KpiCards } from '@/components/dashboard/KpiCards'
import { RecommendationCard } from '@/components/dashboard/RecommendationCard'
import { RecommendationDetail } from '@/components/dashboard/RecommendationDetail'
import { InventoryRiskByStore } from '@/components/dashboard/InventoryRiskByStore'
import { DemandForecastChart } from '@/components/dashboard/DemandForecastChart'
import { RecommendedTransfers } from '@/components/dashboard/RecommendedTransfers'
import { VendorPerformance } from '@/components/dashboard/VendorPerformance'
import { RecentAiActions } from '@/components/dashboard/RecentAiActions'
import { TopFastMoving } from '@/components/dashboard/TopFastMoving'
import { SlowDeadInventory } from '@/components/dashboard/SlowDeadInventory'
import { useRecommendations } from '@/lib/recommendations-store'
import { useReviewSheet } from '@/lib/use-review-sheet'
import { decisionsNeedingAttention } from '@/data/analytics'

const severityRank = { critical: 0, warning: 1, info: 2 }

export default function Dashboard() {
  const { recommendations } = useRecommendations()
  const { reviewId, open, setOpen, review } = useReviewSheet()

  const topRecs = [...recommendations]
    .filter((r) => r.status === 'pending')
    .sort((a, b) => severityRank[a.severity] - severityRank[b.severity])
    .slice(0, 6)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Good morning — here are today's inventory priorities</h1>
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{decisionsNeedingAttention} decisions</span> need your attention · Monday,
          August 31, 2026
        </p>
      </div>

      <KpiCards />

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">AI Recommended Decisions</h2>
            <p className="text-sm text-muted-foreground">Ranked by urgency and estimated financial impact</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <SlidersHorizontal className="size-3.5" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" asChild>
              <Link to="/ai-decisions">
                View all <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {topRecs.map((rec) => (
            <RecommendationCard key={rec.id} recommendation={rec} onReview={review} />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <InventoryRiskByStore />
        <DemandForecastChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecommendedTransfers onReview={review} />
        <VendorPerformance />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <RecentAiActions />
        <TopFastMoving />
        <SlowDeadInventory />
      </div>

      <RecommendationDetail recommendationId={reviewId} open={open} onOpenChange={setOpen} />
    </div>
  )
}
