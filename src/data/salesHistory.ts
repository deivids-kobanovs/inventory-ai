import type { SalesPoint, StoreId } from '@/types'
import { randRange, seededRandom } from '@/lib/seed'
import { getInventoryFor } from './inventory'

function fmtDate(d: Date) {
  return d.toISOString().slice(0, 10)
}

export type TrendShape = 'flat' | 'rising' | 'falling' | 'spiking' | 'dead'

export function generateSalesHistory(
  productId: string,
  storeId: StoreId,
  opts: { historyDays?: number; forecastDays?: number; shape?: TrendShape } = {},
): SalesPoint[] {
  const { historyDays = 45, forecastDays = 14, shape = 'flat' } = opts
  const rng = seededRandom(`${productId}:${storeId}:hist`)
  const row = getInventoryFor(productId, storeId)
  const base = Math.max(0.05, row?.avgDailySales30 ?? 1)

  const points: SalesPoint[] = []
  const today = new Date('2026-08-31')

  for (let i = historyDays - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const progress = 1 - i / historyDays // 0 -> old, 1 -> recent

    let trendMultiplier = 1
    if (shape === 'rising') trendMultiplier = 0.55 + progress * 0.9
    if (shape === 'falling') trendMultiplier = 1.5 - progress * 0.9
    if (shape === 'spiking') trendMultiplier = progress > 0.75 ? 2.1 : 0.8 + progress * 0.3
    if (shape === 'dead') trendMultiplier = 0.05

    const weekday = d.getDay()
    const weekendBoost = weekday === 0 || weekday === 6 ? 1.35 : 1
    const noise = randRange(rng, 0.55, 1.45)
    const units = Math.max(0, Math.round(base * trendMultiplier * weekendBoost * noise))

    points.push({ date: fmtDate(d), units })
  }

  const recent = points.slice(-7).reduce((s, p) => s + (p.units ?? 0), 0) / 7
  let forecastBase = recent || base
  const forecastTrend =
    shape === 'rising' ? 1.04 : shape === 'falling' ? 0.96 : shape === 'spiking' ? 1.02 : shape === 'dead' ? 1 : 1

  for (let i = 1; i <= forecastDays; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() + i)
    forecastBase *= forecastTrend
    const weekday = d.getDay()
    const weekendBoost = weekday === 0 || weekday === 6 ? 1.35 : 1
    const spread = forecastBase * weekendBoost * (0.14 + i * 0.01)
    points.push({
      date: fmtDate(d),
      forecast: Math.round(forecastBase * weekendBoost * 10) / 10,
      forecastLow: Math.max(0, Math.round((forecastBase * weekendBoost - spread) * 10) / 10),
      forecastHigh: Math.round((forecastBase * weekendBoost + spread) * 10) / 10,
    })
  }

  return points
}
