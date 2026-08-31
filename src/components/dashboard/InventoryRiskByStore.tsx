import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { inventoryRiskByStore } from '@/data/analytics'

export function InventoryRiskByStore() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Risk by Store</CardTitle>
        <CardDescription>Open AI decisions grouped by severity, per location</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={inventoryRiskByStore} margin={{ top: 4, right: 8, left: -20, bottom: 0 }} barCategoryGap={32}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="storeName" tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} width={28} allowDecimals={false} />
            <Tooltip
              cursor={{ fill: 'var(--color-secondary)' }}
              contentStyle={{ background: 'var(--color-popover)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12 }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="critical" name="Critical" stackId="risk" fill="var(--color-destructive)" radius={[0, 0, 0, 0]} maxBarSize={44} />
            <Bar dataKey="warning" name="Warning" stackId="risk" fill="var(--color-warning)" maxBarSize={44} />
            <Bar dataKey="info" name="Info" stackId="risk" fill="var(--color-primary)" radius={[4, 4, 0, 0]} maxBarSize={44} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
