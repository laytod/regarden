/**
 * Append build ID to asset URLs so browsers fetch fresh content after each deploy.
 * Next.js already hashes JS/CSS filenames; this handles images and other static paths.
 */
const BUILD_ID =
  typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_BUILD_ID : undefined

export function assetUrl(path: string): string {
  if (!path || !BUILD_ID) return path
  const separator = path.includes('?') ? '&' : '?'
  return `${path}${separator}v=${BUILD_ID}`
}
