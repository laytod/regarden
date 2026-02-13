import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ContentEditor from '@/components/Admin/ContentEditor'

const mockFetch = jest.fn()

describe('ContentEditor', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = mockFetch
  })

  it('should show loading state initially', () => {
    mockFetch.mockImplementation(() => new Promise(() => {}))
    render(<ContentEditor />)
    expect(screen.getByText(/loading content/i)).toBeInTheDocument()
  })

  it('should render form after fetching content', async () => {
    const content = {
      homepage: {
        hero: {
          heading: 'Hero',
          backgroundImage: '/img.jpg',
          missionHeading: 'Mission',
          missionText: 'Mission text',
        },
        featureCards: [
          { icon: '🌱', title: 'C1', description: 'D1' },
          { icon: '👥', title: 'C2', description: 'D2' },
          { icon: '❤️', title: 'C3', description: 'D3' },
        ],
        newsletter: { heading: 'News', description: 'News desc' },
      },
      about: {
        pageTitle: 'About',
        mission: { heading: 'M', text: 'T', image: '' },
        vision: { heading: 'V', text: 'VT' },
        values: { heading: 'Vals', image: '', cards: [{ title: 'X', description: 'Y' }, { title: 'A', description: 'B' }, { title: 'C', description: 'D' }, { title: 'E', description: 'F' }] },
        contact: { heading: 'C', text: 'T', email: 'e@e.com' },
      },
      team: {
        pageTitle: 'Team',
        quote: { text: 'Q', attribution: 'A' },
        galleryImages: ['/a.jpg', '/b.jpg', '/c.jpg'],
        joinOurTeam: { heading: 'J', text: 'T', contactEmail: 'j@j.com' },
      },
      volunteer: {
        pageTitle: 'Vol',
        subtitle: 'Sub',
        description: 'Desc',
        backgroundImage: '/bg.jpg',
        waysToVolunteer: { heading: 'W', cards: [{ title: 'T1', description: 'D1' }, { title: 'T2', description: 'D2' }, { title: 'T3', description: 'D3' }, { title: 'T4', description: 'D4' }] },
        contactCoordinator: { heading: 'H', text: 'T', name: 'N', email: 'e@e.com' },
        applySection: { heading: 'A', description: 'D' },
      },
      donate: {
        pageTitle: 'Donate',
        heroImage: '/h.jpg',
        howDonationHelps: { heading: 'H', description: 'D' },
        benefitCards: [
          { icon: '🌱', title: 'B1', description: 'D1' },
          { icon: '🎓', title: 'B2', description: 'D2' },
          { icon: '👥', title: 'B3', description: 'D3' },
        ],
        donationSection: { heading: 'S', description: 'D' },
      },
    }
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(content) })
    render(<ContentEditor />)
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /homepage/i })).toBeInTheDocument()
    })
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /reload/i })).toBeInTheDocument()
  })

  it('should show error when fetch fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: 'Failed to fetch' }),
    })
    render(<ContentEditor />)
    await waitFor(() => {
      expect(screen.getByText(/failed to fetch/i)).toBeInTheDocument()
    })
  })

  it('should call PUT on save and show success', async () => {
    const content = {
      homepage: {
        hero: { heading: 'H', backgroundImage: '', missionHeading: 'M', missionText: 'T' },
        featureCards: [{ icon: '🌱', title: 'C', description: 'D' }, { icon: '👥', title: 'C2', description: 'D2' }, { icon: '❤️', title: 'C3', description: 'D3' }],
        newsletter: { heading: 'N', description: 'D' },
      },
      about: {
        pageTitle: 'A',
        mission: { heading: 'M', text: 'T', image: '' },
        vision: { heading: 'V', text: 'VT' },
        values: { heading: 'V', image: '', cards: [{ title: 'X', description: 'Y' }, { title: 'A', description: 'B' }, { title: 'C', description: 'D' }, { title: 'E', description: 'F' }] },
        contact: { heading: 'C', text: 'T', email: 'e@e.com' },
      },
      team: {
        pageTitle: 'T',
        quote: { text: 'Q', attribution: 'A' },
        galleryImages: ['/a.jpg', '/b.jpg', '/c.jpg'],
        joinOurTeam: { heading: 'J', text: 'T', contactEmail: 'j@j.com' },
      },
      volunteer: {
        pageTitle: 'V',
        subtitle: 'S',
        description: 'D',
        backgroundImage: '',
        waysToVolunteer: { heading: 'W', cards: [{ title: 'T1', description: 'D1' }, { title: 'T2', description: 'D2' }, { title: 'T3', description: 'D3' }, { title: 'T4', description: 'D4' }] },
        contactCoordinator: { heading: 'H', text: 'T', name: 'N', email: 'e@e.com' },
        applySection: { heading: 'A', description: 'D' },
      },
      donate: {
        pageTitle: 'D',
        heroImage: '',
        howDonationHelps: { heading: 'H', description: 'D' },
        benefitCards: [{ icon: '🌱', title: 'B1', description: 'D1' }, { icon: '🎓', title: 'B2', description: 'D2' }, { icon: '👥', title: 'B3', description: 'D3' }],
        donationSection: { heading: 'S', description: 'D' },
      },
    }
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(content) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ ...content, homepage: { ...content.homepage, hero: { ...content.homepage.hero, heading: 'Updated' } } }) })
    const user = userEvent.setup()
    render(<ContentEditor />)
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument()
    })
    const saveBtn = screen.getByRole('button', { name: /save changes/i })
    await user.click(saveBtn)
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: expect.any(String),
      })
    })
    await waitFor(() => {
      expect(screen.getByText(/content saved successfully/i)).toBeInTheDocument()
    })
  })
})
