import { Bell, Search, RefreshCw } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { stores } from '@/data/stores'
import { useStoreFilter } from '@/lib/store-filter'

export function Topbar() {
  const { storeFilter, setStoreFilter } = useStoreFilter()

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-border bg-background/95 backdrop-blur px-4 lg:px-6">
      <div className="relative hidden md:block w-72">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search SKU, product, or vendor…" className="pl-8" />
      </div>

      <div className="flex-1" />

      <Select value={storeFilter} onValueChange={(v) => setStoreFilter(v as typeof storeFilter)}>
        <SelectTrigger size="sm" className="w-40">
          <SelectValue placeholder="All stores" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All stores</SelectItem>
          {stores.map((s) => (
            <SelectItem key={s.id} value={s.id}>
              {s.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Tooltip>
        <TooltipTrigger asChild>
          <div className="hidden sm:flex items-center gap-1.5 rounded-md border border-border bg-secondary/60 px-2.5 py-1.5 text-xs text-muted-foreground">
            <RefreshCw className="size-3.5" />
            Synced with ERP · 6:02 AM
          </div>
        </TooltipTrigger>
        <TooltipContent>Last sync completed this morning across all 3 stores</TooltipContent>
      </Tooltip>

      <Button variant="outline" size="icon" className="relative">
        <Bell className="size-4" />
        <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-blue-600 text-[9px] font-semibold text-white">
          12
        </span>
      </Button>
    </header>
  )
}
