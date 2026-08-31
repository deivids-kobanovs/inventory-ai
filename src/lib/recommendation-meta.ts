import {
  AlertTriangle,
  ArrowLeftRight,
  Ban,
  Boxes,
  PackageX,
  Rocket,
  TrendingDown,
  TrendingUp,
  Truck,
  Wallet,
  type LucideIcon,
} from 'lucide-react'
import type { RecommendationType, Severity } from '@/types'

export const typeMeta: Record<RecommendationType, { label: string; icon: LucideIcon }> = {
  reorder: { label: 'Reorder', icon: Boxes },
  transfer: { label: 'Store transfer', icon: ArrowLeftRight },
  overstock: { label: 'Overstock', icon: PackageX },
  'dead-inventory': { label: 'Dead inventory', icon: Ban },
  'fast-mover': { label: 'Fast mover', icon: Rocket },
  declining: { label: 'Declining product', icon: TrendingDown },
  discontinue: { label: 'Discontinue candidate', icon: TrendingDown },
  'vendor-backorder': { label: 'Vendor backorder', icon: Truck },
  'cash-release': { label: 'Cash release', icon: Wallet },
}

export const severityMeta: Record<Severity, { label: string; className: string; dot: string }> = {
  critical: {
    label: 'Critical',
    className: 'bg-destructive/10 text-destructive border-destructive/20',
    dot: 'bg-destructive',
  },
  warning: {
    label: 'Warning',
    className: 'bg-warning/15 text-warning-foreground border-warning/25',
    dot: 'bg-warning',
  },
  info: {
    label: 'Info',
    className: 'bg-primary/10 text-primary border-primary/20',
    dot: 'bg-primary',
  },
}

export { TrendingUp, AlertTriangle }
