import { sanitizeEventDescription } from '@/lib/sanitizeHtml'

describe('sanitizeEventDescription', () => {
  it('returns empty string for empty or non-string input', () => {
    expect(sanitizeEventDescription('')).toBe('')
    expect(sanitizeEventDescription(null as unknown as string)).toBe('')
    expect(sanitizeEventDescription(undefined as unknown as string)).toBe('')
  })

  it('allows safe tags (bold, italic, links, breaks)', () => {
    const html = '<p>Hello <b>world</b> and <a href="https://example.com">link</a>.</p>'
    expect(sanitizeEventDescription(html)).toContain('Hello')
    expect(sanitizeEventDescription(html)).toContain('world')
    expect(sanitizeEventDescription(html)).toContain('link')
    expect(sanitizeEventDescription(html)).toContain('href="https://example.com"')
  })

  it('strips script and style tags', () => {
    const html = 'Safe <script>alert(1)</script> text'
    expect(sanitizeEventDescription(html)).not.toContain('script')
    expect(sanitizeEventDescription(html)).not.toContain('alert')
    const withStyle = 'Text <style>.x{color:red}</style> here'
    expect(sanitizeEventDescription(withStyle)).not.toContain('style')
    expect(sanitizeEventDescription(withStyle)).not.toContain('color:red')
  })

  it('strips dangerous attributes (e.g. onclick)', () => {
    const html = '<a href="https://ok.com" onclick="evil()">Click</a>'
    const out = sanitizeEventDescription(html)
    expect(out).toContain('href=')
    expect(out).not.toContain('onclick')
  })
})
