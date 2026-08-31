import { randRange, seededRandom } from '@/lib/seed'
import { products } from './products'
import type { Category } from '@/types'

const SEASONAL_FACTOR = [0.74, 0.78, 0.9, 1.08, 1.2, 1.24, 1.16, 1.1, 1.0, 0.92, 0.86, 0.96] // Jan..Dec
const BASE_MONTHLY_PROFIT = 410000
const ANCHOR_YEAR = 2024
const ANNUAL_GROWTH = 1.065

const MONTH_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const MONTH_FULL = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

// The app's existing department taxonomy — read from the product catalog
// rather than hardcoded, so this always reflects whatever departments the
// rest of the app is already using.
export const departments: Category[] = Array.from(new Set(products.map((p) => p.category)))

function yearMultiplier(year: number) {
  return Math.pow(ANNUAL_GROWTH, year - ANCHOR_YEAR)
}

function daysInMonth(year: number, monthIndex: number) {
  return new Date(year, monthIndex + 1, 0).getDate()
}

function fullMonthProfit(year: number, monthIndex: number) {
  const rng = seededRandom(`profit-actual:${year}-${monthIndex}`)
  const noise = randRange(rng, 0.95, 1.05)
  return Math.round(BASE_MONTHLY_PROFIT * SEASONAL_FACTOR[monthIndex] * yearMultiplier(year) * noise)
}

function forecastMonthProfit(year: number, monthIndex: number) {
  const rng = seededRandom(`profit-forecast:${year}-${monthIndex}`)
  const noise = randRange(rng, 0.98, 1.07)
  return Math.round(BASE_MONTHLY_PROFIT * SEASONAL_FACTOR[monthIndex] * yearMultiplier(year) * noise)
}

// --- Department revenue-mix model -----------------------------------------
// Each department carries a base share of storewide profit plus a seasonal
// tilt (e.g. Lawn & Garden peaks in summer, Seasonal peaks in winter). Shares
// are renormalized to sum to 1 every month, so department profit always adds
// up exactly to the storewide total for that same month.

const DEPARTMENT_BASE_SHARE: Record<Category, number> = {
  'Power Tools': 0.2,
  'Building Materials': 0.16,
  Electrical: 0.12,
  Plumbing: 0.1,
  'Lawn & Garden': 0.12,
  Paint: 0.09,
  Fasteners: 0.09,
  'Hand Tools': 0.07,
  Seasonal: 0.05,
}

const DEPARTMENT_SEASONAL_TILT: Partial<Record<Category, number[]>> = {
  'Lawn & Garden': [0.55, 0.6, 0.85, 1.25, 1.55, 1.6, 1.45, 1.25, 0.95, 0.75, 0.55, 0.5],
  Seasonal: [1.7, 1.5, 0.9, 0.4, 0.25, 0.2, 0.2, 0.25, 0.5, 1.1, 1.9, 2.0],
  Paint: [0.75, 0.8, 1.0, 1.2, 1.3, 1.25, 1.1, 1.0, 0.9, 0.85, 0.75, 0.8],
  'Building Materials': [0.85, 0.85, 1.0, 1.15, 1.2, 1.2, 1.1, 1.05, 1.0, 0.95, 0.85, 0.85],
}

function departmentRawWeight(category: Category, year: number, monthIndex: number) {
  const base = DEPARTMENT_BASE_SHARE[category]
  const tilt = DEPARTMENT_SEASONAL_TILT[category]?.[monthIndex] ?? 1
  const rng = seededRandom(`dept-weight:${category}:${year}-${monthIndex}`)
  const jitter = randRange(rng, 0.94, 1.06)
  return base * tilt * jitter
}

function departmentShare(category: Category, year: number, monthIndex: number) {
  const totalRaw = departments.reduce((s, dept) => s + departmentRawWeight(dept, year, monthIndex), 0)
  return departmentRawWeight(category, year, monthIndex) / totalRaw
}

// --- Shared 12-position window builder --------------------------------------

export interface ProfitMonth {
  position: number
  label: string
  fullLabel: string
  lastYear: number
  thisYear: number | null
  aiForecast: number | null
  isCurrent: boolean
  isForecast: boolean
}

export interface ProfitForecastData {
  months: ProfitMonth[]
  ytdProfit: number
  ytdLastYear: number
  vsLastYearPct: number
  forecastNextMonth: number
  forecastMonthPlus2: number
  forecastNextMonthLabel: string
  forecastMonthPlus2Label: string
  forecastGrowthPct: number
  trend: 'up' | 'down' | 'flat'
}

/**
 * Builds the 12-point profit window shared by the storewide chart and every
 * department chart. The current calendar month is always pinned to position
 * 10, with positions 11-12 supplied by the AI forecast instead of actuals —
 * so the window slides forward every month rather than resetting to a fixed
 * Jan-Dec axis. `monthTotal` / `monthForecast` compute the value for a given
 * (year, monthIndex); the storewide chart passes the raw totals through,
 * department charts multiply by that department's revenue share.
 */
function buildProfitWindow(
  referenceDate: Date,
  monthTotal: (year: number, monthIndex: number) => number,
  monthForecast: (year: number, monthIndex: number) => number,
): ProfitForecastData {
  const currentYear = referenceDate.getFullYear()
  const currentMonthIndex = referenceDate.getMonth()
  const currentDay = referenceDate.getDate()
  const dayFraction = Math.max(currentDay / daysInMonth(currentYear, currentMonthIndex), 1 / 30)

  const months: ProfitMonth[] = []

  for (let i = 0; i < 12; i++) {
    const offset = i - 9 // i=9 -> position 10 -> offset 0 (current month)
    const d = new Date(currentYear, currentMonthIndex + offset, 1)
    const y = d.getFullYear()
    const m = d.getMonth()
    const position = i + 1
    const isCurrent = position === 10
    const isForecast = position === 11 || position === 12

    const lastYearValue = monthTotal(y - 1, m)

    let thisYearValue: number | null = null
    let aiForecastValue: number | null = null

    if (isForecast) {
      aiForecastValue = monthForecast(y, m)
    } else if (isCurrent) {
      thisYearValue = Math.round(monthTotal(y, m) * dayFraction)
      aiForecastValue = thisYearValue // bridge point so the dashed forecast line connects to actuals
    } else {
      thisYearValue = monthTotal(y, m)
    }

    months.push({
      position,
      label: `${MONTH_ABBR[m]} ${String(y).slice(-2)}`,
      fullLabel: `${MONTH_FULL[m]} ${y}`,
      lastYear: lastYearValue,
      thisYear: thisYearValue,
      aiForecast: aiForecastValue,
      isCurrent,
      isForecast,
    })
  }

  let ytdProfit = 0
  let ytdLastYear = 0
  for (let m = 0; m <= currentMonthIndex; m++) {
    if (m === currentMonthIndex) {
      ytdProfit += Math.round(monthTotal(currentYear, m) * dayFraction)
      ytdLastYear += Math.round(monthTotal(currentYear - 1, m) * dayFraction)
    } else {
      ytdProfit += monthTotal(currentYear, m)
      ytdLastYear += monthTotal(currentYear - 1, m)
    }
  }

  const vsLastYearPct = ytdLastYear > 0 ? ((ytdProfit - ytdLastYear) / ytdLastYear) * 100 : 0
  const forecastNextMonth = months[10].aiForecast ?? 0
  const forecastMonthPlus2 = months[11].aiForecast ?? 0
  const forecastGrowthPct = forecastNextMonth > 0 ? ((forecastMonthPlus2 - forecastNextMonth) / forecastNextMonth) * 100 : 0
  const trend: 'up' | 'down' | 'flat' = forecastGrowthPct > 2 ? 'up' : forecastGrowthPct < -2 ? 'down' : 'flat'

  return {
    months,
    ytdProfit,
    ytdLastYear,
    vsLastYearPct,
    forecastNextMonth,
    forecastMonthPlus2,
    forecastNextMonthLabel: months[10].fullLabel,
    forecastMonthPlus2Label: months[11].fullLabel,
    forecastGrowthPct,
    trend,
  }
}

export function generateStorewideProfit(referenceDate: Date = new Date()): ProfitForecastData {
  return buildProfitWindow(referenceDate, fullMonthProfit, forecastMonthProfit)
}

export function generateDepartmentProfit(category: Category, referenceDate: Date = new Date()): ProfitForecastData {
  return buildProfitWindow(
    referenceDate,
    (year, monthIndex) => Math.round(fullMonthProfit(year, monthIndex) * departmentShare(category, year, monthIndex)),
    (year, monthIndex) => Math.round(forecastMonthProfit(year, monthIndex) * departmentShare(category, year, monthIndex)),
  )
}
