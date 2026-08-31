import { useState } from 'react'
import { CheckCircle2, Database } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

const team = [
  { name: 'Renee Castillo', role: 'VP Merchandising', access: 'Full access', store: 'All stores' },
  { name: 'Marcus Webb', role: 'Store Manager', access: 'Store-level', store: 'North' },
  { name: 'Priya Anand', role: 'Store Manager', access: 'Store-level', store: 'Westside' },
  { name: 'Devon Ruiz', role: 'Inventory Analyst', access: 'Read-only', store: 'All stores' },
]

function ToggleRow({ label, description, defaultChecked = true }: { label: string; description: string; defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked)
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <Label className="text-sm font-medium">{label}</Label>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={setChecked} />
    </div>
  )
}

export default function Settings() {
  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage integrations, AI thresholds, and team access</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ERP Connection</CardTitle>
          <CardDescription>Inventory AI reads sales, stock, and purchasing data every morning</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
              <Database className="size-4.5" />
            </div>
            <div>
              <div className="text-sm font-medium">Retail ERP — Production</div>
              <div className="text-xs text-muted-foreground">3 stores · 41,208 SKU-store combinations</div>
            </div>
          </div>
          <Badge variant="success" className="gap-1">
            <CheckCircle2 className="size-3" /> Connected
          </Badge>
        </CardContent>
        <CardContent className="pt-0">
          <Separator className="mb-4" />
          <div className="flex items-center justify-between gap-4">
            <div>
              <Label className="text-sm font-medium">Sync frequency</Label>
              <p className="text-xs text-muted-foreground mt-0.5">How often Inventory AI pulls fresh data</p>
            </div>
            <Select defaultValue="daily">
              <SelectTrigger size="sm" className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="6hours">Every 6 hours</SelectItem>
                <SelectItem value="daily">Daily, 6:00 AM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Decision Thresholds</CardTitle>
          <CardDescription>Tune how aggressively the AI surfaces recommendations</CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          <ToggleRow label="Flag stockout risk within lead-time window" description="Recommend reordering when days of supply falls under vendor lead time" />
          <ToggleRow label="Flag overstock above 150% of target" description="Recommend PO reductions when stock exceeds target levels" />
          <ToggleRow label="Auto-approve transfers under $500" description="Skip manual review for small, low-risk inter-store transfers" defaultChecked={false} />
          <ToggleRow label="Seasonal forecasting" description="Weight recommendations using prior-year seasonal sell-through patterns" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>How your team hears about new AI decisions</CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          <ToggleRow label="Morning digest email" description="Summary of new recommendations sent at 6:15 AM daily" />
          <ToggleRow label="Critical alerts" description="Immediate notification for critical-severity recommendations" />
          <ToggleRow label="Weekly vendor scorecard" description="Vendor performance summary every Monday" defaultChecked={false} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team & Access</CardTitle>
          <CardDescription>Who can review and approve AI recommendations</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col divide-y divide-border">
          {team.map((member) => (
            <div key={member.name} className="flex items-center justify-between gap-3 py-3">
              <div>
                <div className="text-sm font-medium">{member.name}</div>
                <div className="text-xs text-muted-foreground">{member.role} · {member.store}</div>
              </div>
              <Badge variant="outline" className="font-normal">{member.access}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
