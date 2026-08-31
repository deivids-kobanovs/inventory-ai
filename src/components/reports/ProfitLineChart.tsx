import { Sparkles } from 'lucide-react'
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
import { formatCurrency } from '@/lib/format'
import type { ProfitForecastData, ProfitMonth } from '@/data/profitForecast'

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

/**
 * The shared 12-position profit chart: last year (solid, full width), this
 * year / actual (solid, stops at position 10), and AI forecast (dashed,
 * bridges from position 10 through 11-12), with a shaded forecast zone and a
 * "Today" divider. Used by both the storewide chart and every department
 * chart so they stay visually and behaviorally identical.
 */
export function ProfitLineChart({ data, height = 300 }: { data: ProfitForecastData; height?: number }) {
  const { months } = data
  const todayLabel = months[9].label
  const forecastStartLabel = months[10].label
  const forecastEndLabel = months[11].label

  return (
    <ResponsiveContainer width="100%" height={height}>
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
  )
}
