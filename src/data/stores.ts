import type { Store } from '@/types'

export const stores: Store[] = [
  {
    id: 'downtown',
    name: 'Downtown',
    code: 'STR-101',
    address: '412 Market St, Downtown',
    manager: 'Renee Castillo',
    sqft: 38000,
  },
  {
    id: 'north',
    name: 'North',
    code: 'STR-104',
    address: '2200 Cedar Ridge Rd, North',
    manager: 'Marcus Webb',
    sqft: 45000,
  },
  {
    id: 'westside',
    name: 'Westside',
    code: 'STR-107',
    address: '88 Harbor Ave, Westside',
    manager: 'Priya Anand',
    sqft: 32000,
  },
]

export const storeById = (id: string) => stores.find((s) => s.id === id)
