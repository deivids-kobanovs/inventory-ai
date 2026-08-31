import { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { StatTile } from '@/components/common/StatTile'
import { formatCurrency } from '@/lib/format'
import { generateStorewideProfit } from '@/data/profitForecast'
import { ProfitLineChart } from './ProfitLineChart'

export function StorewideProfitChart() {
  const data = useMemo(() => generateStorewideProfit(), [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Storewide Profit Performance &amp; Forecast</CardTitle>
        <CardDescription>Actual performance vs last year with 2-month AI forecast</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatTile label="YTD Profit" value={formatCurrency(data.ytdProfit, { compact: true })} sublabel="Calendar year to date" />
          <StatTile label="vs Last Year" value={formatCurrency(data.ytdProfit - data.ytdLastYear, { compact: true })} delta={data.vsLastYearPct} />
          <StatTile
            label="Forecast Next Month"
            value={formatCurrency(data.forecastNextMonth, { compact: true })}
            sublabel={data.forecastNextMonthLabel}
          />
          <StatTile
            label="Forecast Month +2"
            value={formatCurrency(data.forecastMonthPlus2, { compact: true })}
            sublabel={data.forecastMonthPlus2Label}
          />
        </div>

        <ProfitLineChart data={data} />
      </CardContent>
    </Card>
  )
}
