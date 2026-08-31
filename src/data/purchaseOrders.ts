import type { StoreId } from '@/types'

export type PoStatus = 'Draft' | 'Submitted' | 'In Transit' | 'Received'

export interface PurchaseOrder {
  id: string
  vendorId: string
  storeId: StoreId
  status: PoStatus
  itemCount: number
  totalValue: number
  createdAt: string
  expectedAt: string
}

export const purchaseOrders: PurchaseOrder[] = [
  { id: 'PO-10482', vendorId: 'v-voltek', storeId: 'north', status: 'In Transit', itemCount: 3, totalValue: 4820, createdAt: '2026-08-27', expectedAt: '2026-09-03' },
  { id: 'PO-10481', vendorId: 'v-buildright', storeId: 'north', status: 'In Transit', itemCount: 2, totalValue: 2960, createdAt: '2026-08-29', expectedAt: '2026-09-06' },
  { id: 'PO-10479', vendorId: 'v-flowmaster', storeId: 'downtown', status: 'Submitted', itemCount: 4, totalValue: 3140, createdAt: '2026-08-30', expectedAt: '2026-09-11' },
  { id: 'PO-10477', vendorId: 'v-colorcraft', storeId: 'downtown', status: 'Received', itemCount: 5, totalValue: 2210, createdAt: '2026-08-18', expectedAt: '2026-08-24' },
  { id: 'PO-10475', vendorId: 'v-sturdy', storeId: 'westside', status: 'Received', itemCount: 3, totalValue: 1680, createdAt: '2026-08-15', expectedAt: '2026-08-22' },
  { id: 'PO-10473', vendorId: 'v-greenscape', storeId: 'westside', status: 'Submitted', itemCount: 2, totalValue: 3960, createdAt: '2026-08-28', expectedAt: '2026-09-07' },
  { id: 'PO-10470', vendorId: 'v-ironclad', storeId: 'downtown', status: 'Received', itemCount: 6, totalValue: 1420, createdAt: '2026-08-10', expectedAt: '2026-08-15' },
  { id: 'PO-10468', vendorId: 'v-winterguard', storeId: 'north', status: 'Draft', itemCount: 2, totalValue: 2340, createdAt: '2026-08-31', expectedAt: '2026-09-14' },
]
