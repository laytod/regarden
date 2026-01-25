export interface User {
  id: string
  email: string
  passwordHash: string
  name: string
  role: 'admin' | 'editor'
  createdAt: string
  updatedAt: string
}

export interface PasswordResetToken {
  token: string
  userId: string
  email: string
  expiresAt: string
  used: boolean
}

/** Editable site content (data/content.json) */
export interface SiteContent {
  homepage: HomepageContent
  about: AboutContent
  team: TeamContent
  volunteer: VolunteerContent
  donate: DonateContent
}

export interface HomepageContent {
  hero: {
    heading: string
    backgroundImage: string
    missionHeading: string
    missionText: string
  }
  featureCards: Array<{ icon: string; title: string; description: string }>
  newsletter: { heading: string; description: string }
}

export interface AboutContent {
  pageTitle: string
  mission: { heading: string; text: string; image: string }
  vision: { heading: string; text: string }
  values: {
    heading: string
    image: string
    cards: Array<{ title: string; description: string }>
  }
  contact: { heading: string; text: string; email: string }
}

export interface TeamContent {
  pageTitle: string
  quote: { text: string; attribution: string }
  galleryImages: string[]
  joinOurTeam: { heading: string; text: string; contactEmail: string }
}

export interface VolunteerContent {
  pageTitle: string
  subtitle: string
  description: string
  backgroundImage: string
  waysToVolunteer: {
    heading: string
    cards: Array<{ title: string; description: string }>
  }
  contactCoordinator: {
    heading: string
    text: string
    name: string
    email: string
  }
  applySection: { heading: string; description: string }
}

export interface DonateContent {
  pageTitle: string
  heroImage: string
  howDonationHelps: { heading: string; description: string }
  benefitCards: Array<{ icon: string; title: string; description: string }>
  donationSection: { heading: string; description: string }
}

/** Partial update for content (all keys optional, deep partial) */
export type ContentUpdate = Partial<SiteContent>
