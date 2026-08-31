export function formatCurrency(value: number, opts?: { compact?: boolean }) {
  if (opts?.compact) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value)
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US').format(value)
}

export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value)
}

export function formatPercent(value: number, opts?: { showSign?: boolean }) {
  const sign = opts?.showSign && value > 0 ? '+' : ''
  return `${sign}${value.toFixed(0)}%`
}
