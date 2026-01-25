/**
 * Image management utilities for admin upload, delete, and listing.
 * All functions expect Node.js runtime (fs/path).
 */

import { createHash } from 'crypto'

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
] as const

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 // 5MB

export interface ValidateImageResult {
  ok: true
}

export interface ValidateImageError {
  ok: false
  error: string
}

export function validateImageFile(file: {
  type: string
  size: number
}): ValidateImageResult | ValidateImageError {
  if (!ALLOWED_MIME_TYPES.includes(file.type as (typeof ALLOWED_MIME_TYPES)[number])) {
    return {
      ok: false,
      error: `Invalid file type. Allowed: ${ALLOWED_MIME_TYPES.join(', ')}`,
    }
  }
  if (file.size <= 0) {
    return { ok: false, error: 'File is empty' }
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      ok: false,
      error: `File too large. Maximum size: ${MAX_FILE_SIZE_BYTES / 1024 / 1024}MB`,
    }
  }
  return { ok: true }
}

function getImagesDir(): string {
  if (typeof window !== 'undefined' || typeof process === 'undefined') {
    throw new Error('File system access not available in browser')
  }
  const path = require('path') as typeof import('path')
  return path.join(process.cwd(), 'public', 'images')
}

/**
 * Check that a web path (e.g. /images/foo.jpg) is under /images/ and has no path traversal.
 */
export function isAllowedImagePath(webPath: string): boolean {
  const normalized = webPath.replace(/\\/g, '/').trim()
  if (!normalized.startsWith('/images/')) return false
  if (normalized.includes('..')) return false
  if (normalized === '/images' || normalized === '/images/') return false
  return true
}

/**
 * List all image paths under /public/images/ as web paths (e.g. /images/foo.jpg).
 * Recursively scans subdirectories.
 */
export function listImages(): string[] {
  if (typeof window !== 'undefined' || typeof process === 'undefined') {
    throw new Error('File system access not available in browser')
  }
  const fs = require('fs') as typeof import('fs')
  const path = require('path') as typeof import('path')
  const base = getImagesDir()
  const result: string[] = []

  function walk(dir: string, prefix: string) {
    if (!fs.existsSync(dir)) return
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const e of entries) {
      const full = path.join(dir, e.name)
      const rel = prefix ? `${prefix}/${e.name}` : e.name
      if (e.isDirectory()) {
        walk(full, rel)
      } else if (e.isFile()) {
        const ext = path.extname(e.name).toLowerCase()
        if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.heic'].includes(ext)) {
          result.push(`/images/${rel}`)
        }
      }
    }
  }

  walk(base, '')
  return result.sort()
}

/**
 * Save an uploaded image. Buffer is written to public/images[/subfolder]/<sanitized-name>.
 * Returns the web path (e.g. /images/uploads/abc123.jpg).
 */
export function saveImage(
  buffer: Buffer,
  mimeType: string,
  subfolder?: string
): string {
  if (typeof window !== 'undefined' || typeof process === 'undefined') {
    throw new Error('File system access not available in browser')
  }
  const fs = require('fs') as typeof import('fs')
  const path = require('path') as typeof import('path')
  const base = getImagesDir()
  const ext = mimeToExt(mimeType)
  const hash = createHash('sha256').update(buffer).digest('hex').slice(0, 12)
  const filename = `${hash}${ext}`
  const dir = subfolder
    ? path.join(base, subfolder.replace(/[^a-zA-Z0-9_-]/g, ''))
    : base
  const fullPath = path.join(dir, filename)

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(fullPath, buffer)

  const rel = subfolder ? `${subfolder}/${filename}` : filename
  return `/images/${rel}`
}

function mimeToExt(mime: string): string {
  const map: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
  }
  return map[mime] ?? '.jpg'
}

/**
 * Delete an image by web path (e.g. /images/uploads/abc.jpg).
 * Throws if path is not allowed or file cannot be deleted.
 */
export function deleteImage(webPath: string): void {
  if (!isAllowedImagePath(webPath)) {
    throw new Error('Invalid or disallowed image path')
  }
  if (typeof window !== 'undefined' || typeof process === 'undefined') {
    throw new Error('File system access not available in browser')
  }
  const fs = require('fs') as typeof import('fs')
  const path = require('path') as typeof import('path')
  // webPath is like /images/foo/bar.jpg -> relative to public
  const relative = webPath.slice(1) // images/foo/bar.jpg
  const fullPath = path.join(process.cwd(), 'public', relative)
  if (!fs.existsSync(fullPath)) {
    throw new Error('Image not found')
  }
  fs.unlinkSync(fullPath)
}
