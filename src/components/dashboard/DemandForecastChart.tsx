import { useMemo } from 'react'
import { Area, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { generateCompanyDemand } from '@/data/analytics'

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function DemandForecastChart() {
  const data = useMemo(() => generateCompanyDemand(), [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Demand Forecast</CardTitle>
        <CardDescription>Company-wide units sold per day — actual vs. next 14 days forecast</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <ComposedChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="actualFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.25} />
                <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
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
            <YAxis tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} width={36} />
            <Tooltip
              labelFormatter={(v) => formatDate(String(v))}
              contentStyle={{ background: 'var(--color-popover)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12 }}
            />
            <Area type="monotone" dataKey="actual" name="Actual units" stroke="var(--color-chart-1)" strokeWidth={2} fill="url(#actualFill)" isAnimationActive={false} />
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
      </CardContent>
    </Card>
  )
}
