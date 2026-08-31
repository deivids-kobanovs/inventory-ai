import { Area, Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { SalesPoint } from '@/types'

function formatDate(d: string) {
  const date = new Date(d)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function SalesForecastChart({ data }: { data: SalesPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <ComposedChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="forecastBand" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.18} />
            <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis
          dataKey="date"
          tickFormatter={formatDate}
          tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }}
          axisLine={false}
          tickLine={false}
          interval={Math.ceil(data.length / 8)}
        />
        <YAxis tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} width={32} />
        <Tooltip
          labelFormatter={(v) => formatDate(String(v))}
          contentStyle={{
            background: 'var(--color-popover)',
            border: '1px solid var(--color-border)',
            borderRadius: 8,
            fontSize: 12,
          }}
        />
        <Area type="monotone" dataKey="forecastHigh" stroke="none" fill="url(#forecastBand)" isAnimationActive={false} />
        <Area type="monotone" dataKey="forecastLow" stroke="none" fill="var(--color-background)" isAnimationActive={false} />
        <Bar dataKey="units" name="Units sold" fill="var(--color-chart-1)" radius={[3, 3, 0, 0]} maxBarSize={14} />
        <Line
          type="monotone"
          dataKey="forecast"
          name="Forecast"
          stroke="var(--color-chart-3)"
          strokeWidth={2}
          strokeDasharray="4 3"
          dot={false}
          isAnimationActive={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
