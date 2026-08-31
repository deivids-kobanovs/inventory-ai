import { randRange, seededRandom } from '@/lib/seed'

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

export interface StorewideProfitData {
  months: ProfitMonth[]
  ytdProfit: number
  ytdLastYear: number
  vsLastYearPct: number
  forecastNextMonth: number
  forecastMonthPlus2: number
  forecastNextMonthLabel: string
  forecastMonthPlus2Label: string
}

/**
 * Builds the 12-point storewide profit window. The current calendar month is
 * always pinned to position 10, with the two months that follow it (11 and
 * 12) supplied by the AI forecast instead of actuals — so the window slides
 * forward every month rather than resetting to a fixed Jan-Dec axis.
 */
export function generateStorewideProfit(referenceDate: Date = new Date()): StorewideProfitData {
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

    const lastYearValue = fullMonthProfit(y - 1, m)

    let thisYearValue: number | null = null
    let aiForecastValue: number | null = null

    if (isForecast) {
      aiForecastValue = forecastMonthProfit(y, m)
    } else if (isCurrent) {
      thisYearValue = Math.round(fullMonthProfit(y, m) * dayFraction)
      aiForecastValue = thisYearValue // bridge point so the dashed forecast line connects to actuals
    } else {
      thisYearValue = fullMonthProfit(y, m)
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
      ytdProfit += Math.round(fullMonthProfit(currentYear, m) * dayFraction)
      ytdLastYear += Math.round(fullMonthProfit(currentYear - 1, m) * dayFraction)
    } else {
      ytdProfit += fullMonthProfit(currentYear, m)
      ytdLastYear += fullMonthProfit(currentYear - 1, m)
    }
  }

  const vsLastYearPct = ytdLastYear > 0 ? ((ytdProfit - ytdLastYear) / ytdLastYear) * 100 : 0

  return {
    months,
    ytdProfit,
    ytdLastYear,
    vsLastYearPct,
    forecastNextMonth: months[10].aiForecast ?? 0,
    forecastMonthPlus2: months[11].aiForecast ?? 0,
    forecastNextMonthLabel: months[10].fullLabel,
    forecastMonthPlus2Label: months[11].fullLabel,
  }
}
