import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Sparkles,
  Boxes,
  ArrowLeftRight,
  ClipboardList,
  LineChart,
  Truck,
  BarChart3,
  Settings,
  Warehouse,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { decisionsNeedingAttention } from '@/data/analytics'

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/ai-decisions', label: 'AI Decisions', icon: Sparkles, badge: decisionsNeedingAttention },
  { to: '/inventory', label: 'Inventory', icon: Boxes },
  { to: '/transfers', label: 'Transfers', icon: ArrowLeftRight },
  { to: '/purchase-orders', label: 'Purchase Orders', icon: ClipboardList },
  { to: '/forecasting', label: 'Forecasting', icon: LineChart },
  { to: '/vendors', label: 'Vendors', icon: Truck },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border h-screen sticky top-0">
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-sidebar-border shrink-0">
        <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm">
          <Warehouse className="size-4.5" />
        </div>
        <div className="flex flex-col leading-none">
          <span className="font-semibold text-[15px] text-white tracking-tight">Inventory AI</span>
          <span className="text-[11px] text-sidebar-muted mt-0.5">Enterprise</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-0.5">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-2.5 rounded-md px-3 py-2 text-[13.5px] font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-muted hover:bg-white/5 hover:text-sidebar-foreground',
              )
            }
          >
            <item.icon className="size-4 shrink-0" />
            <span className="flex-1">{item.label}</span>
            {!!item.badge && (
              <span className="flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-blue-500 px-1 text-[10px] font-semibold text-white">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-4 pt-2 border-t border-sidebar-border">
        <div className="flex items-center gap-2.5 rounded-md px-2 py-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-sidebar-accent text-[12px] font-semibold text-sidebar-accent-foreground">
            RC
          </div>
          <div className="flex flex-col leading-tight min-w-0">
            <span className="text-[13px] font-medium text-sidebar-foreground truncate">Renee Castillo</span>
            <span className="text-[11px] text-sidebar-muted truncate">VP Merchandising</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
