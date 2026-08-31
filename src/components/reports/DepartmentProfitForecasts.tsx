import { useMemo, useState } from 'react'
import { Minus, TrendingDown, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { StatTile } from '@/components/common/StatTile'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'
import { departments, generateDepartmentProfit } from '@/data/profitForecast'
import { ProfitLineChart } from './ProfitLineChart'

const trendMeta = {
  up: { label: 'Growing', icon: TrendingUp, className: 'text-success' },
  down: { label: 'Declining', icon: TrendingDown, className: 'text-destructive' },
  flat: { label: 'Stable', icon: Minus, className: 'text-muted-foreground' },
} as const

export function DepartmentProfitForecasts() {
  const [selected, setSelected] = useState(departments[0])

  const allDepartmentData = useMemo(
    () => departments.map((category) => ({ category, data: generateDepartmentProfit(category) })),
    [],
  )

  const current = allDepartmentData.find((d) => d.category === selected) ?? allDepartmentData[0]
  const currentMonthProfit = current.data.months[9].thisYear ?? 0
  const trend = trendMeta[current.data.trend]

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4 flex-wrap">
          <div>
            <CardTitle>Department Profit Forecasts</CardTitle>
            <CardDescription>Same forecast model as the storewide chart, broken out by department</CardDescription>
          </div>
          <Select value={selected} onValueChange={(v) => setSelected(v as typeof selected)}>
            <SelectTrigger size="sm" className="w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {departments.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <StatTile label="Current Month Profit" value={formatCurrency(currentMonthProfit, { compact: true })} sublabel={current.data.months[9].fullLabel} />
            <StatTile
              label="vs Last Year"
              value={formatCurrency(current.data.ytdProfit - current.data.ytdLastYear, { compact: true })}
              delta={current.data.vsLastYearPct}
            />
            <StatTile
              label="Forecast Next Month"
              value={formatCurrency(current.data.forecastNextMonth, { compact: true })}
              sublabel={current.data.forecastNextMonthLabel}
            />
            <StatTile
              label="Forecast Month +2"
              value={formatCurrency(current.data.forecastMonthPlus2, { compact: true })}
              sublabel={current.data.forecastMonthPlus2Label}
            />
            <StatTile
              label="Trend / Outlook"
              value={trend.label}
              icon={trend.icon}
              iconTone={current.data.trend}
              sublabel={`${current.data.forecastGrowthPct >= 0 ? '+' : ''}${current.data.forecastGrowthPct.toFixed(1)}% month-over-month`}
            />
          </div>

          <ProfitLineChart data={current.data} />
        </CardContent>
      </Card>

      <Card className="overflow-hidden py-0">
        <div className="px-5 pt-5 pb-3">
          <h3 className="text-[15px] font-semibold">Department Overview</h3>
          <p className="text-sm text-muted-foreground">All departments, reconciled exactly to the storewide forecast above</p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-5">Department</TableHead>
              <TableHead className="text-right">Current profit</TableHead>
              <TableHead className="text-right">vs last year</TableHead>
              <TableHead className="text-right">Next month</TableHead>
              <TableHead className="text-right">Month +2</TableHead>
              <TableHead className="text-right">Forecast trend</TableHead>
              <TableHead className="pr-5">Outlook</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allDepartmentData.map(({ category, data }) => {
              const meta = trendMeta[data.trend]
              const Icon = meta.icon
              const isSelected = category === selected
              return (
                <TableRow
                  key={category}
                  className={cn('cursor-pointer', isSelected && 'bg-primary/5')}
                  onClick={() => setSelected(category)}
                >
                  <TableCell className="pl-5 font-medium">{category}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatCurrency(data.months[9].thisYear ?? 0, { compact: true })}</TableCell>
                  <TableCell className={cn('text-right tabular-nums font-medium', data.vsLastYearPct >= 0 ? 'text-success' : 'text-destructive')}>
                    {data.vsLastYearPct >= 0 ? '+' : ''}
                    {data.vsLastYearPct.toFixed(1)}%
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{formatCurrency(data.forecastNextMonth, { compact: true })}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatCurrency(data.forecastMonthPlus2, { compact: true })}</TableCell>
                  <TableCell className={cn('text-right tabular-nums font-medium', data.forecastGrowthPct >= 0 ? 'text-success' : 'text-destructive')}>
                    {data.forecastGrowthPct >= 0 ? '+' : ''}
                    {data.forecastGrowthPct.toFixed(1)}%
                  </TableCell>
                  <TableCell className="pr-5">
                    <span className={cn('flex items-center gap-1.5 text-xs font-medium', meta.className)}>
                      <Icon className="size-3.5" />
                      {meta.label}
                    </span>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
