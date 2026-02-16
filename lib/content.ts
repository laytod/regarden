import type { SiteContent, ContentUpdate } from './types'

function getContentFilePath(): string {
  if (typeof window === 'undefined' && typeof process !== 'undefined') {
    const path = require('path')
    return path.join(process.cwd(), 'data', 'content.json')
  }
  throw new Error('File system access not available')
}

/**
 * Deep merge source into target. Returns new object. Arrays are replaced, not merged.
 */
function deepMerge<T extends object>(target: T, source: Partial<T>): T {
  const result = { ...target } as T
  for (const key of Object.keys(source) as (keyof T)[]) {
    const src = source[key]
    if (src === undefined) continue
    const tgt = result[key]
    if (
      typeof src === 'object' &&
      src !== null &&
      !Array.isArray(src) &&
      typeof tgt === 'object' &&
      tgt !== null &&
      !Array.isArray(tgt)
    ) {
      ;(result as Record<string, unknown>)[key as string] = deepMerge(
        tgt as object,
        src as object
      )
    } else {
      result[key] = src as T[keyof T]
    }
  }
  return result
}

/**
 * Read all content from data/content.json.
 * Returns empty structure if file missing or invalid.
 */
export function getContent(): SiteContent {
  try {
    if (typeof window !== 'undefined' || typeof process === 'undefined') {
      return getDefaultContent()
    }
    const fs = require('fs')
    const filePath = getContentFilePath()
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const parsed = JSON.parse(fileContents) as unknown
    return validateAndNormalizeContent(parsed)
  } catch {
    return getDefaultContent()
  }
}

/**
 * Update content with a partial update. Merges into existing content and writes to file.
 * Throws if not in Node.js runtime or write fails.
 */
export function updateContent(update: ContentUpdate): SiteContent {
  if (typeof window !== 'undefined' || typeof process === 'undefined') {
    throw new Error('File system access not available in browser/Edge Runtime')
  }
  const fs = require('fs')
  const filePath = getContentFilePath()
  const current = getContent()
  const merged = deepMerge(current, update)
  fs.writeFileSync(filePath, JSON.stringify(merged, null, 2))
  return merged
}

/**
 * Default content structure when file is missing.
 */
function getDefaultContent(): SiteContent {
  return {
    homepage: {
      hero: {
        heading: 'Growing Gardens Growing Communities',
        backgroundImage: '/images/homepage-hero.jpg',
        missionHeading: 'Our Mission',
        missionText: '',
      },
      featureCards: [],
      newsletter: { heading: 'Stay Updated', description: '' },
    },
    about: {
      pageTitle: 'About ReGarden',
      mission: { heading: 'Our Mission', text: '', image: '' },
      vision: { heading: 'Our Vision', text: '' },
      values: { heading: 'Our Values', image: '', cards: [] },
      contact: { heading: 'Contact Us', text: '', email: '' },
    },
    team: {
      pageTitle: 'Our Team',
      quote: { text: '', attribution: '' },
      galleryImages: [],
      joinOurTeam: { heading: 'Join Our Team', text: '', contactEmail: '' },
    },
    volunteer: {
      pageTitle: 'Volunteer with ReGarden',
      subtitle: '',
      description: '',
      backgroundImage: '',
      waysToVolunteer: { heading: 'Ways to Volunteer', cards: [] },
      contactCoordinator: { heading: '', text: '', name: '', email: '' },
      applySection: { heading: 'Apply to Volunteer', description: '' },
    },
    donate: {
      pageTitle: 'Support ReGarden',
      heroImage: '',
      howDonationHelps: { heading: 'How Your Donation Helps', description: '' },
      benefitCards: [],
      donationSection: { heading: 'Make a Donation', description: '' },
    },
  }
}

/**
 * Validate parsed JSON has expected shape; fill missing required keys with defaults.
 */
function validateAndNormalizeContent(parsed: unknown): SiteContent {
  const defaultContent = getDefaultContent()
  if (typeof parsed !== 'object' || parsed === null) {
    return defaultContent
  }
  const obj = parsed as Record<string, unknown>
  const result = { ...defaultContent }

  if (obj.homepage && typeof obj.homepage === 'object') {
    result.homepage = deepMerge(
      defaultContent.homepage,
      obj.homepage as Partial<typeof defaultContent.homepage>
    )
  }
  if (obj.about && typeof obj.about === 'object') {
    result.about = deepMerge(
      defaultContent.about,
      obj.about as Partial<typeof defaultContent.about>
    )
  }
  if (obj.team && typeof obj.team === 'object') {
    result.team = deepMerge(
      defaultContent.team,
      obj.team as Partial<typeof defaultContent.team>
    )
  }
  if (obj.volunteer && typeof obj.volunteer === 'object') {
    result.volunteer = deepMerge(
      defaultContent.volunteer,
      obj.volunteer as Partial<typeof defaultContent.volunteer>
    )
  }
  if (obj.donate && typeof obj.donate === 'object') {
    result.donate = deepMerge(
      defaultContent.donate,
      obj.donate as Partial<typeof defaultContent.donate>
    )
  }

  return result
}
