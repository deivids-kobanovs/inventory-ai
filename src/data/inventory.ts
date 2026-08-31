import type { Category, InventoryRow, StoreId } from '@/types'
import { products } from './products'
import { stores } from './stores'
import { randInt, randRange, seededRandom } from '@/lib/seed'

const categoryDailySales: Record<Category, [number, number]> = {
  'Power Tools': [0.8, 3.2],
  'Hand Tools': [1.0, 3.0],
  Electrical: [0.8, 2.6],
  Plumbing: [0.4, 1.8],
  'Lawn & Garden': [0.3, 2.2],
  Paint: [0.8, 2.4],
  Fasteners: [1.6, 4.5],
  Seasonal: [0.1, 0.9],
  'Building Materials': [2.2, 6.5],
}

const storeMultiplier: Record<StoreId, number> = {
  downtown: 1.15,
  north: 1.3,
  westside: 0.85,
}

function buildRow(productId: string, storeId: StoreId): InventoryRow {
  const product = products.find((p) => p.id === productId)!
  const rng = seededRandom(`${productId}:${storeId}`)
  const [lo, hi] = categoryDailySales[product.category]
  const base = randRange(rng, lo, hi) * storeMultiplier[storeId]
  const avgDailySales30 = Math.max(0.05, base * randRange(rng, 0.85, 1.15))
  const trendFactor = randRange(rng, 0.62, 1.38)
  const avgDailySales7 = Math.max(0, avgDailySales30 * trendFactor)

  const reorderPoint = Math.round(avgDailySales30 * product.leadTimeDays * 1.35)
  const targetStock = Math.round(reorderPoint * (1.7 + rng() * 0.4))

  const posRoll = rng()
  let onHand: number
  if (posRoll < 0.09) {
    // trending toward stockout
    onHand = Math.round(reorderPoint * randRange(rng, 0.15, 0.55))
  } else if (posRoll < 0.2) {
    // overstocked
    onHand = Math.round(targetStock * randRange(rng, 1.6, 2.8))
  } else if (posRoll < 0.28) {
    // dead stock, barely moving
    onHand = Math.round(targetStock * randRange(rng, 1.2, 2.2))
  } else {
    onHand = Math.round(randRange(rng, reorderPoint * 0.9, targetStock * 1.15))
  }
  onHand = Math.max(0, onHand)

  const reserved = randInt(rng, 0, Math.max(1, Math.round(onHand * 0.06)))
  const incoming = rng() < 0.3 ? Math.round(reorderPoint * randRange(rng, 0.6, 1.4)) : 0
  const daysOfSupply = avgDailySales30 > 0.08 ? onHand / avgDailySales30 : 999
  const lastReceivedDaysAgo = randInt(rng, 1, 52)

  return {
    productId,
    storeId,
    onHand,
    reserved,
    incoming,
    reorderPoint,
    targetStock,
    avgDailySales7: Math.round(avgDailySales7 * 100) / 100,
    avgDailySales30: Math.round(avgDailySales30 * 100) / 100,
    daysOfSupply: Math.round(daysOfSupply * 10) / 10,
    lastReceivedDaysAgo,
  }
}

export const inventory: InventoryRow[] = products.flatMap((p) => stores.map((s) => buildRow(p.id, s.id)))

// Hand-authored overrides so the AI recommendations and the underlying
// inventory ledger tell the exact same story when a user drills in.
const overrides: Array<Partial<InventoryRow> & { productId: string; storeId: StoreId }> = [
  { productId: 'p-bat-50a', storeId: 'downtown', onHand: 23, avgDailySales7: 5.9, avgDailySales30: 4.1, reorderPoint: 55, targetStock: 95, daysOfSupply: 3.9, incoming: 0 },
  { productId: 'g-blw-20v', storeId: 'westside', onHand: 6, avgDailySales7: 2.4, avgDailySales30: 1.1, reorderPoint: 22, targetStock: 40, daysOfSupply: 2.5, incoming: 0 },
  { productId: 'e-gfc-20', storeId: 'north', onHand: 34, avgDailySales7: 3.6, avgDailySales30: 2.3, reorderPoint: 48, targetStock: 82, daysOfSupply: 9.4, incoming: 0 },
  { productId: 'h-tpm-25', storeId: 'westside', onHand: 96, avgDailySales7: 0.6, avgDailySales30: 0.7, reorderPoint: 18, targetStock: 32, daysOfSupply: 137, incoming: 0 },
  { productId: 'h-tpm-25', storeId: 'downtown', onHand: 11, avgDailySales7: 2.1, avgDailySales30: 1.6, reorderPoint: 22, targetStock: 38, daysOfSupply: 6.9, incoming: 0 },
  { productId: 's-shv-stl', storeId: 'downtown', onHand: 88, avgDailySales7: 0.1, avgDailySales30: 0.1, reorderPoint: 12, targetStock: 26, daysOfSupply: 880, incoming: 0 },
  { productId: 's-shv-stl', storeId: 'north', onHand: 14, avgDailySales7: 0.2, avgDailySales30: 0.2, reorderPoint: 18, targetStock: 34, daysOfSupply: 70, incoming: 0 },
  { productId: 'a-ext-gry', storeId: 'westside', onHand: 142, avgDailySales7: 1.0, avgDailySales30: 1.3, reorderPoint: 20, targetStock: 36, daysOfSupply: 109, incoming: 0 },
  { productId: 'f-cnc-14', storeId: 'north', onHand: 210, avgDailySales7: 1.8, avgDailySales30: 2.0, reorderPoint: 34, targetStock: 58, daysOfSupply: 105, incoming: 0 },
  { productId: 's-rrk-01', storeId: 'downtown', onHand: 31, avgDailySales7: 0, avgDailySales30: 0.03, reorderPoint: 8, targetStock: 16, daysOfSupply: 999, incoming: 0 },
  { productId: 'l-drs-25', storeId: 'westside', onHand: 24, avgDailySales7: 0, avgDailySales30: 0.02, reorderPoint: 6, targetStock: 14, daysOfSupply: 999, incoming: 0 },
  { productId: 'p-imp-20v', storeId: 'downtown', onHand: 58, avgDailySales7: 5.4, avgDailySales30: 3.4, reorderPoint: 36, targetStock: 64, daysOfSupply: 10.7, incoming: 0 },
  { productId: 'a-ltx-wht', storeId: 'north', onHand: 64, avgDailySales7: 1.3, avgDailySales30: 2.1, reorderPoint: 30, targetStock: 52, daysOfSupply: 30.5, incoming: 0 },
  { productId: 'h-plr-nn', storeId: 'downtown', onHand: 47, avgDailySales7: 0.3, avgDailySales30: 0.5, reorderPoint: 14, targetStock: 24, daysOfSupply: 94, incoming: 0 },
  { productId: 'l-pex-100', storeId: 'downtown', onHand: 9, avgDailySales7: 1.8, avgDailySales30: 1.4, reorderPoint: 20, targetStock: 34, daysOfSupply: 6.4, incoming: 0 },
  { productId: 'l-pex-100', storeId: 'north', onHand: 13, avgDailySales7: 2.1, avgDailySales30: 1.6, reorderPoint: 22, targetStock: 38, daysOfSupply: 6.2, incoming: 0 },
  { productId: 'f-dck-3', storeId: 'downtown', onHand: 310, avgDailySales7: 4.6, avgDailySales30: 4.4, reorderPoint: 62, targetStock: 108, daysOfSupply: 70, incoming: 0 },
]

for (const o of overrides) {
  const row = inventory.find((r) => r.productId === o.productId && r.storeId === o.storeId)
  if (row) Object.assign(row, o)
}

export function getInventoryFor(productId: string, storeId: StoreId) {
  return inventory.find((r) => r.productId === productId && r.storeId === storeId)
}

export function getInventoryByProduct(productId: string) {
  return inventory.filter((r) => r.productId === productId)
}

export function getInventoryByStore(storeId: StoreId) {
  return inventory.filter((r) => r.storeId === storeId)
}
