/**
 * Format a 24-hour time string (HH:MM or H:MM) as 12-hour with AM/PM.
 * Used for display only; data remains in 24h for parsing.
 */
export function formatTime12h(time: string): string {
  if (!time || !time.includes(':')) return time
  const [hStr, mStr] = time.split(':')
  const h = parseInt(hStr ?? '0', 10)
  const m = parseInt(mStr ?? '0', 10)
  const hour = h % 12 || 12
  const ampm = h < 12 ? 'AM' : 'PM'
  const min = String(m).padStart(2, '0')
  return `${hour}:${min} ${ampm}`
}
