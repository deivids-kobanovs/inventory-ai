import type { StoreId } from '@/types'
import { inventory } from './inventory'
import { products, productById } from './products'
import { stores } from './stores'
import { recommendations } from './recommendations'
import { randRange, seededRandom } from '@/lib/seed'

export const totalInventoryValue = inventory.reduce((sum, row) => {
  const product = productById(row.productId)!
  return sum + row.onHand * product.unitCost
}, 0)

export interface RiskRow {
  productId: string
  storeId: StoreId
  value: number
  daysOfSupply: number
}

export const stockoutRiskRows: RiskRow[] = inventory
  .map((row) => {
    const product = productById(row.productId)!
    return { productId: row.productId, storeId: row.storeId, value: row.avgDailySales30 * product.unitPrice * product.leadTimeDays, daysOfSupply: row.daysOfSupply, leadTime: product.leadTimeDays }
  })
  .filter((r) => r.daysOfSupply < r.leadTime * 1.15 && r.daysOfSupply < 30)
  .sort((a, b) => a.daysOfSupply - b.daysOfSupply)

export const stockoutRiskValue = stockoutRiskRows.reduce((s, r) => s + r.value, 0)

export const overstockRows = inventory
  .map((row) => {
    const product = productById(row.productId)!
    const excess = Math.max(0, row.onHand - row.targetStock)
    return { productId: row.productId, storeId: row.storeId, excessUnits: excess, value: excess * product.unitCost }
  })
  .filter((r) => r.excessUnits > 0 && r.value > 50)
  .sort((a, b) => b.value - a.value)

export const overstockValue = overstockRows.reduce((s, r) => s + r.value, 0)

export const deadInventoryRows = inventory
  .map((row) => {
    const product = productById(row.productId)!
    return { productId: row.productId, storeId: row.storeId, onHand: row.onHand, value: row.onHand * product.unitCost, avgDailySales30: row.avgDailySales30 }
  })
  .filter((r) => r.avgDailySales30 < 0.12 && r.onHand > 3)
  .sort((a, b) => b.value - a.value)

export const deadInventoryValue = deadInventoryRows.reduce((s, r) => s + r.value, 0)

export const potentialLostSales = recommendations
  .filter((r) => r.type === 'reorder' || r.type === 'vendor-backorder')
  .reduce((s, r) => s + r.financialImpact, 0)

export const cashReleasable = recommendations
  .filter((r) => r.type === 'overstock' || r.type === 'dead-inventory' || r.type === 'cash-release' || r.type === 'discontinue')
  .reduce((s, r) => s + r.financialImpact, 0)

export const decisionsNeedingAttention = recommendations.filter((r) => r.status === 'pending').length

export interface StoreRisk {
  storeId: StoreId
  storeName: string
  critical: number
  warning: number
  info: number
  inventoryValue: number
}

export const inventoryRiskByStore: StoreRisk[] = stores.map((store) => {
  const storeRecs = recommendations.filter((r) => r.storeId === store.id || r.secondaryStoreId === store.id)
  const storeValue = inventory
    .filter((r) => r.storeId === store.id)
    .reduce((s, r) => s + r.onHand * productById(r.productId)!.unitCost, 0)
  return {
    storeId: store.id,
    storeName: store.name,
    critical: storeRecs.filter((r) => r.severity === 'critical').length,
    warning: storeRecs.filter((r) => r.severity === 'warning').length,
    info: storeRecs.filter((r) => r.severity === 'info').length,
    inventoryValue: storeValue,
  }
})

export interface FastMover {
  productId: string
  growthPct: number
  unitsPerDay: number
  storeId: StoreId
}

export const topFastMovers: FastMover[] = inventory
  .map((row) => {
    const growthPct = row.avgDailySales30 > 0.15 ? ((row.avgDailySales7 - row.avgDailySales30) / row.avgDailySales30) * 100 : 0
    return { productId: row.productId, storeId: row.storeId, growthPct, unitsPerDay: row.avgDailySales7 }
  })
  .filter((r) => r.growthPct > 15 && r.unitsPerDay > 0.6)
  .sort((a, b) => b.growthPct - a.growthPct)
  .slice(0, 8)

export interface SlowMover {
  productId: string
  storeId: StoreId
  daysOfSupply: number
  value: number
}

export const slowDeadInventory: SlowMover[] = inventory
  .map((row) => {
    const product = productById(row.productId)!
    return { productId: row.productId, storeId: row.storeId, daysOfSupply: Math.min(row.daysOfSupply, 999), value: row.onHand * product.unitCost }
  })
  .filter((r) => r.daysOfSupply > 60)
  .sort((a, b) => b.value - a.value)
  .slice(0, 8)

export interface DemandPoint {
  date: string
  actual?: number
  forecast?: number
}

export function generateCompanyDemand(): DemandPoint[] {
  const rng = seededRandom('company-demand')
  const today = new Date('2026-08-31')
  const points: DemandPoint[] = []
  const base = 640

  for (let i = 29; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const weekday = d.getDay()
    const weekendBoost = weekday === 0 || weekday === 6 ? 1.28 : 1
    const drift = 1 + (29 - i) * 0.004
    const noise = randRange(rng, 0.9, 1.1)
    points.push({ date: d.toISOString().slice(0, 10), actual: Math.round(base * weekendBoost * drift * noise) })
  }

  let last = points[points.length - 1].actual! / 1.28
  for (let i = 1; i <= 14; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() + i)
    const weekday = d.getDay()
    const weekendBoost = weekday === 0 || weekday === 6 ? 1.3 : 1
    last *= 1.006
    points.push({ date: d.toISOString().slice(0, 10), forecast: Math.round(last * weekendBoost) })
  }

  return points
}

export const productCatalog = products
