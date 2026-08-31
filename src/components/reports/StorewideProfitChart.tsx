import { useMemo } from 'react'
import { ArrowDownRight, ArrowUpRight, Sparkles } from 'lucide-react'
import {
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'
import { generateStorewideProfit, type ProfitMonth } from '@/data/profitForecast'

function ProfitTooltip({ active, payload, months }: { active?: boolean; payload?: unknown[]; months: ProfitMonth[] }) {
  if (!active || !payload || payload.length === 0) return null
  const point = payload[0] as { payload: ProfitMonth }
  const month = months.find((m) => m.label === point.payload.label)
  if (!month) return null

  return (
    <div className="rounded-lg border border-border bg-popover p-3 shadow-lg text-xs min-w-[190px]">
      <div className="font-semibold text-popover-foreground mb-1.5">{month.fullLabel}</div>
      <div className="flex items-center justify-between gap-4 py-0.5">
        <span className="text-muted-foreground">Last year</span>
        <span className="font-medium tabular-nums text-popover-foreground">{formatCurrency(month.lastYear)}</span>
      </div>
      {month.isForecast ? (
        <div className="flex items-center justify-between gap-4 py-0.5">
          <span className="text-muted-foreground flex items-center gap-1">
            <Sparkles className="size-3 text-chart-3" /> AI forecast
          </span>
          <span className="font-medium tabular-nums text-chart-3">{formatCurrency(month.aiForecast ?? 0)}</span>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-4 py-0.5">
          <span className="text-muted-foreground">{month.isCurrent ? 'This year (MTD)' : 'This year'}</span>
          <span className="font-medium tabular-nums text-primary">{formatCurrency(month.thisYear ?? 0)}</span>
        </div>
      )}
    </div>
  )
}

function StatTile({
  label,
  value,
  sublabel,
  delta,
}: {
  label: string
  value: string
  sublabel?: string
  delta?: number
}) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-border bg-secondary/40 px-4 py-3">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span className="text-xl font-semibold tabular-nums text-foreground">{value}</span>
      {delta !== undefined ? (
        <span className={cn('flex items-center gap-1 text-xs font-medium', delta >= 0 ? 'text-success' : 'text-destructive')}>
          {delta >= 0 ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
          {delta >= 0 ? '+' : ''}
          {delta.toFixed(1)}% vs last year
        </span>
      ) : (
        sublabel && <span className="text-[11px] text-muted-foreground">{sublabel}</span>
      )}
    </div>
  )
}

export function StorewideProfitChart() {
  const data = useMemo(() => generateStorewideProfit(), [])
  const { months } = data
  const todayLabel = months[9].label
  const forecastStartLabel = months[10].label
  const forecastEndLabel = months[11].label

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

        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={months} margin={{ top: 12, right: 16, left: -8, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} />
            <YAxis
              tickFormatter={(v) => formatCurrency(Number(v), { compact: true })}
              tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }}
              axisLine={false}
              tickLine={false}
              width={56}
            />
            <Tooltip content={<ProfitTooltip months={months} />} />
            <Legend wrapperStyle={{ fontSize: 12 }} />

            <ReferenceArea x1={forecastStartLabel} x2={forecastEndLabel} fill="var(--color-chart-3)" fillOpacity={0.07} />
            <ReferenceLine
              x={todayLabel}
              stroke="var(--color-muted-foreground)"
              strokeDasharray="4 4"
              label={{ value: 'Today', position: 'top', fill: 'var(--color-foreground)', fontSize: 11, fontWeight: 600 }}
            />

            <Line
              type="monotone"
              dataKey="lastYear"
              name="Last year"
              stroke="var(--color-muted-foreground)"
              strokeWidth={2}
              dot={{ r: 2.5 }}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="thisYear"
              name="This year (actual)"
              stroke="var(--color-primary)"
              strokeWidth={2.5}
              dot={{ r: 3 }}
              connectNulls={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="aiForecast"
              name="AI forecast"
              stroke="var(--color-chart-3)"
              strokeWidth={2.5}
              strokeDasharray="5 4"
              dot={{ r: 3 }}
              connectNulls
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
