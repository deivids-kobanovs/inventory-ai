export type StoreId = 'downtown' | 'north' | 'westside'

export interface Store {
  id: StoreId
  name: string
  code: string
  address: string
  manager: string
  sqft: number
}

export type Category =
  | 'Power Tools'
  | 'Hand Tools'
  | 'Electrical'
  | 'Plumbing'
  | 'Lawn & Garden'
  | 'Paint'
  | 'Fasteners'
  | 'Seasonal'
  | 'Building Materials'

export interface Vendor {
  id: string
  name: string
  categories: Category[]
  onTimeRate: number
  avgLeadTimeDays: number
  defectRatePct: number
  openPOs: number
  backorderedItems: number
  rating: number
}

export interface Product {
  id: string
  sku: string
  name: string
  brand: string
  category: Category
  vendorId: string
  unitCost: number
  unitPrice: number
  leadTimeDays: number
  packLabel: string
  image?: string
}

export interface InventoryRow {
  productId: string
  storeId: StoreId
  onHand: number
  reserved: number
  incoming: number
  reorderPoint: number
  targetStock: number
  avgDailySales7: number
  avgDailySales30: number
  daysOfSupply: number
  lastReceivedDaysAgo: number
}

export type RecommendationType =
  | 'reorder'
  | 'transfer'
  | 'overstock'
  | 'dead-inventory'
  | 'fast-mover'
  | 'declining'
  | 'discontinue'
  | 'vendor-backorder'
  | 'cash-release'

export type Severity = 'critical' | 'warning' | 'info'

export type RecommendationStatus = 'pending' | 'approved' | 'dismissed' | 'modified'

export interface RecommendationMetric {
  label: string
  value: string
  tone?: 'critical' | 'warning' | 'success' | 'neutral'
}

export interface Recommendation {
  id: string
  type: RecommendationType
  severity: Severity
  title: string
  aiExplanation: string
  productId: string
  storeId: StoreId
  secondaryStoreId?: StoreId
  metrics: RecommendationMetric[]
  financialImpact: number
  financialLabel: string
  confidence: number
  proposedAction: string
  status: RecommendationStatus
  detectedAt: string
  category: Category
}

export interface AiAction {
  id: string
  timestamp: string
  type: RecommendationType | 'system'
  description: string
  impact: string
  storeId?: StoreId
}

export interface SalesPoint {
  date: string
  units?: number
  forecast?: number
  forecastLow?: number
  forecastHigh?: number
}
