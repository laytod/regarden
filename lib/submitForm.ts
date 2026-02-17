/**
 * Open the user's email client with form data pre-filled via mailto.
 */

const RECIPIENT_EMAIL = 'katie@regardenus.org'

/** Optional: pass to override navigation (e.g. in tests). Otherwise sets window.location.href. */
export function submitForm(
  subject: string,
  data: object,
  assignUrl?: (url: string) => void
): void {
  const body = formatBody(data as Record<string, unknown>)
  const mailtoUrl = `mailto:${RECIPIENT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  if (assignUrl) {
    assignUrl(mailtoUrl)
  } else {
    window.location.href = mailtoUrl
  }
}

function formatBody(data: Record<string, unknown>): string {
  return Object.entries(data)
    .map(([key, value]) => {
      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())
      if (Array.isArray(value)) {
        return `${label}: ${value.join(', ')}`
      }
      return `${label}: ${value ?? ''}`
    })
    .join('\n')
}
