import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { StoreId } from '@/types'

export type StoreFilter = StoreId | 'all'

interface StoreFilterContextValue {
  storeFilter: StoreFilter
  setStoreFilter: (s: StoreFilter) => void
}

const StoreFilterContext = createContext<StoreFilterContextValue | null>(null)

export function StoreFilterProvider({ children }: { children: ReactNode }) {
  const [storeFilter, setStoreFilter] = useState<StoreFilter>('all')
  const value = useMemo(() => ({ storeFilter, setStoreFilter }), [storeFilter])
  return <StoreFilterContext.Provider value={value}>{children}</StoreFilterContext.Provider>
}

export function useStoreFilter() {
  const ctx = useContext(StoreFilterContext)
  if (!ctx) throw new Error('useStoreFilter must be used within StoreFilterProvider')
  return ctx
}
