/**
 * @jest-environment node
 */
import { GET, PUT } from '@/app/api/admin/content/route'

const mockAuth = jest.fn()
jest.mock('@/lib/auth-setup', () => ({
  auth: (...args: unknown[]) => mockAuth(...args),
}))

const mockGetContent = jest.fn()
const mockUpdateContent = jest.fn()
jest.mock('@/lib/content', () => ({
  getContent: () => mockGetContent(),
  updateContent: (u: unknown) => mockUpdateContent(u),
}))

describe('GET /api/admin/content', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetContent.mockReturnValue({ homepage: { hero: { heading: 'Test' } } })
  })

  it('should return 401 when unauthenticated', async () => {
    mockAuth.mockResolvedValue(null)
    const res = await GET()
    expect(res.status).toBe(401)
    const data = await res.json()
    expect(data.error).toMatch(/unauthorized/i)
    expect(mockGetContent).not.toHaveBeenCalled()
  })

  it('should return content when authenticated', async () => {
    mockAuth.mockResolvedValue({ user: { email: 'admin@test.com', name: 'Admin' } })
    const res = await GET()
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.homepage.hero.heading).toBe('Test')
    expect(mockGetContent).toHaveBeenCalled()
  })
})

describe('PUT /api/admin/content', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUpdateContent.mockReturnValue({ homepage: { hero: { heading: 'Updated' } } })
  })

  it('should return 401 when unauthenticated', async () => {
    mockAuth.mockResolvedValue(null)
    const req = new Request('http://localhost/api/admin/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ homepage: { hero: { heading: 'X' } } }),
    })
    const res = await PUT(req)
    expect(res.status).toBe(401)
    expect(mockUpdateContent).not.toHaveBeenCalled()
  })

  it('should return 400 for invalid body', async () => {
    mockAuth.mockResolvedValue({ user: {} })
    const req = new Request('http://localhost/api/admin/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
    const res = await PUT(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toMatch(/validation/i)
    expect(mockUpdateContent).not.toHaveBeenCalled()
  })

  it('should update and return content when authenticated with valid body', async () => {
    mockAuth.mockResolvedValue({ user: {} })
    const payload = { homepage: { hero: { heading: 'New Heading' } } }
    const req = new Request('http://localhost/api/admin/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const res = await PUT(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.homepage.hero.heading).toBe('Updated')
    expect(mockUpdateContent).toHaveBeenCalledWith(payload)
  })
})
