/**
 * Sanitize HTML for safe display of rich text (e.g. from Google Calendar descriptions).
 * Allowlist: only tags that typical calendar WYSIWYG editors allow (bold, italic,
 * strikethrough, underline, links, line/paragraph breaks). Script, style, and
 * other dangerous tags/attributes are stripped.
 * Color and other inline styling from the calendar (style, class, font tag, etc.)
 * are never allowed—only the tag set below; href on <a> is the only attribute.
 * Uses sanitize-html (pure JS, no jsdom) so it works during Next.js static export.
 */

import sanitizeHtml from 'sanitize-html'

/** Tags we allow for calendar-style formatting (Google Calendar WYSIWYG–style). */
const ALLOWED_TAGS = [
  'b',
  'strong',
  'i',
  'em',
  's',
  'strike',
  'u',
  'a',
  'br',
  'p',
  'div',
  'span',
]

/** Only href on <a>. No style, class, or color-related attributes—calendar colors are ignored. */
const ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  a: ['href'],
}

/**
 * Returns sanitized HTML safe to render with dangerouslySetInnerHTML.
 * Use for event descriptions and other user/calendar-origin HTML.
 */
export function sanitizeEventDescription(html: string): string {
  if (!html || typeof html !== 'string') return ''
  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
  })
}
