import { formatTime12h } from '@/lib/formatTime'

describe('formatTime12h', () => {
  it('formats 24h time as 12h with AM/PM', () => {
    expect(formatTime12h('09:30')).toBe('9:30 AM')
    expect(formatTime12h('12:00')).toBe('12:00 PM')
    expect(formatTime12h('13:45')).toBe('1:45 PM')
    expect(formatTime12h('00:00')).toBe('12:00 AM')
    expect(formatTime12h('23:59')).toBe('11:59 PM')
  })

  it('pads minutes with zero', () => {
    expect(formatTime12h('14:5')).toBe('2:05 PM')
  })

  it('returns input unchanged when missing or invalid', () => {
    expect(formatTime12h('')).toBe('')
    expect(formatTime12h('no-colon')).toBe('no-colon')
  })
})
