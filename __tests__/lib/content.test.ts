/**
 * @jest-environment node
 */
import { getContent, updateContent } from '@/lib/content'

jest.mock('fs', () => ({
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
}))

jest.mock('path', () => ({
  join: jest.fn((...args: string[]) => args.join('/')),
}))

const fs = require('fs') as jest.Mocked<typeof import('fs')>
const mockedRead = fs.readFileSync as jest.Mock
const mockedWrite = fs.writeFileSync as jest.Mock

const mockContent = {
  homepage: {
    hero: {
      heading: 'Test Heading',
      backgroundImage: '/images/test.jpg',
      missionHeading: 'Our Mission',
      missionText: 'Test mission text.',
    },
    featureCards: [
      { icon: '🌱', title: 'Card 1', description: 'Desc 1' },
    ],
    newsletter: { heading: 'Stay Updated', description: 'Subscribe here.' },
  },
  about: {
    pageTitle: 'About',
    mission: { heading: 'Mission', text: 'Text', image: '/img.jpg' },
    vision: { heading: 'Vision', text: 'Vision text' },
    values: { heading: 'Values', image: '', cards: [] },
    contact: { heading: 'Contact', text: 'Hello', email: 'a@b.com' },
  },
  team: {
    pageTitle: 'Team',
    quote: { text: 'Quote', attribution: 'Author' },
    galleryImages: ['/a.jpg', '/b.jpg'],
    joinOurTeam: { heading: 'Join', text: 'Join us', contactEmail: 'x@y.com' },
  },
  volunteer: {
    pageTitle: 'Volunteer',
    subtitle: 'Sub',
    description: 'Desc',
    backgroundImage: '/bg.jpg',
    waysToVolunteer: { heading: 'Ways', cards: [] },
    contactCoordinator: { heading: 'Contact', text: 'T', name: 'N', email: 'e@e.com' },
    applySection: { heading: 'Apply', description: 'Fill form' },
  },
  donate: {
    pageTitle: 'Donate',
    heroImage: '/hero.jpg',
    howDonationHelps: { heading: 'Helps', description: 'Help text' },
    benefitCards: [],
    donationSection: { heading: 'Give', description: 'Donate here' },
  },
}

describe('Content utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockedRead.mockReturnValue(JSON.stringify(mockContent))
    mockedWrite.mockImplementation(() => {})
  })

  describe('getContent', () => {
    it('should read and parse content from file', () => {
      const content = getContent()
      expect(content.homepage.hero.heading).toBe('Test Heading')
      expect(content.about.pageTitle).toBe('About')
      expect(mockedRead).toHaveBeenCalled()
    })

    it('should return default content when file does not exist', () => {
      mockedRead.mockImplementation(() => {
        throw new Error('File not found')
      })
      const content = getContent()
      expect(content.homepage.hero.heading).toBe('Growing Gardens Growing Communities')
      expect(content.homepage.featureCards).toEqual([])
    })

    it('should return default content when file is invalid JSON', () => {
      mockedRead.mockReturnValue('invalid json')
      const content = getContent()
      expect(content.homepage.hero.heading).toBe('Growing Gardens Growing Communities')
    })

    it('should normalize partial content with defaults', () => {
      mockedRead.mockReturnValue(JSON.stringify({ homepage: { hero: { heading: 'Only' } } }))
      const content = getContent()
      expect(content.homepage.hero.heading).toBe('Only')
      expect(content.homepage.hero.missionHeading).toBe('Our Mission')
      expect(content.about.pageTitle).toBe('About ReGarden')
    })
  })

  describe('updateContent', () => {
    it('should merge partial update and write to file', () => {
      const update = {
        homepage: {
          hero: { heading: 'Updated Heading' },
        },
      }
      const result = updateContent(update)
      expect(result.homepage.hero.heading).toBe('Updated Heading')
      expect(result.homepage.hero.missionText).toBe('Test mission text.')
      expect(mockedWrite).toHaveBeenCalled()
      const written = JSON.parse(mockedWrite.mock.calls[0][1])
      expect(written.homepage.hero.heading).toBe('Updated Heading')
    })

    it('should replace arrays when provided', () => {
      const update = {
        team: {
          galleryImages: ['/new1.jpg', '/new2.jpg'],
        },
      }
      const result = updateContent(update)
      expect(result.team.galleryImages).toEqual(['/new1.jpg', '/new2.jpg'])
    })

  })
})
