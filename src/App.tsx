import { Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { StoreFilterProvider } from '@/lib/store-filter'
import { RecommendationsProvider } from '@/lib/recommendations-store'
import Dashboard from '@/pages/Dashboard'
import AiDecisions from '@/pages/AiDecisions'
import Inventory from '@/pages/Inventory'
import Transfers from '@/pages/Transfers'
import PurchaseOrders from '@/pages/PurchaseOrders'
import Forecasting from '@/pages/Forecasting'
import Vendors from '@/pages/Vendors'
import Reports from '@/pages/Reports'
import Settings from '@/pages/Settings'

function App() {
  return (
    <StoreFilterProvider>
      <RecommendationsProvider>
        <TooltipProvider>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/ai-decisions" element={<AiDecisions />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/transfers" element={<Transfers />} />
              <Route path="/purchase-orders" element={<PurchaseOrders />} />
              <Route path="/forecasting" element={<Forecasting />} />
              <Route path="/vendors" element={<Vendors />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Routes>
          <Toaster position="bottom-right" />
        </TooltipProvider>
      </RecommendationsProvider>
    </StoreFilterProvider>
  )
}

export default App
