/**
 * @jest-environment node
 */
import { GET, POST, DELETE } from '@/app/api/admin/images/route'

const mockAuth = jest.fn()
jest.mock('@/lib/auth-setup', () => ({
  auth: (...args: unknown[]) => mockAuth(...args),
}))

const mockListImages = jest.fn()
const mockSaveImage = jest.fn()
const mockDeleteImage = jest.fn()
const mockValidateImageFile = jest.fn()
const mockIsAllowedImagePath = jest.fn()

jest.mock('@/lib/images', () => ({
  listImages: () => mockListImages(),
  saveImage: (...args: unknown[]) => mockSaveImage(...args),
  deleteImage: (p: string) => mockDeleteImage(p),
  validateImageFile: (f: { type: string; size: number }) => mockValidateImageFile(f),
  isAllowedImagePath: (p: string) => mockIsAllowedImagePath(p),
}))

describe('GET /api/admin/images', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockListImages.mockReturnValue(['/images/a.jpg', '/images/b.png'])
  })

  it('should return 401 when unauthenticated', async () => {
    mockAuth.mockResolvedValue(null)
    const res = await GET()
    expect(res.status).toBe(401)
    const data = await res.json()
    expect(data.error).toMatch(/unauthorized/i)
    expect(mockListImages).not.toHaveBeenCalled()
  })

  it('should return images when authenticated', async () => {
    mockAuth.mockResolvedValue({ user: { email: 'admin@test.com' } })
    const res = await GET()
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.images).toEqual(['/images/a.jpg', '/images/b.png'])
    expect(mockListImages).toHaveBeenCalled()
  })
})

describe('POST /api/admin/images', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockValidateImageFile.mockReturnValue({ ok: true })
    mockSaveImage.mockReturnValue('/images/uploads/abc123.jpg')
  })

  it('should return 401 when unauthenticated', async () => {
    mockAuth.mockResolvedValue(null)
    const form = new FormData()
    form.append('file', new File(['x'], 'test.jpg', { type: 'image/jpeg' }))
    const req = new Request('http://localhost/api/admin/images', {
      method: 'POST',
      body: form,
    })
    const res = await POST(req)
    expect(res.status).toBe(401)
    expect(mockSaveImage).not.toHaveBeenCalled()
  })

  it('should return 400 when no file provided', async () => {
    mockAuth.mockResolvedValue({ user: {} })
    const form = new FormData()
    const req = new Request('http://localhost/api/admin/images', {
      method: 'POST',
      body: form,
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toMatch(/no file|file/i)
    expect(mockSaveImage).not.toHaveBeenCalled()
  })

  it('should return 400 when validation fails', async () => {
    mockAuth.mockResolvedValue({ user: {} })
    mockValidateImageFile.mockReturnValue({ ok: false, error: 'File too large' })
    const form = new FormData()
    form.append('file', new File(['x'], 'big.jpg', { type: 'image/jpeg' }))
    const req = new Request('http://localhost/api/admin/images', {
      method: 'POST',
      body: form,
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('File too large')
    expect(mockSaveImage).not.toHaveBeenCalled()
  })

  it('should upload and return path when authenticated with valid file', async () => {
    mockAuth.mockResolvedValue({ user: {} })
    const form = new FormData()
    form.append('file', new File(['fake'], 'pic.jpg', { type: 'image/jpeg' }))
    const req = new Request('http://localhost/api/admin/images', {
      method: 'POST',
      body: form,
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.path).toBe('/images/uploads/abc123.jpg')
    expect(mockValidateImageFile).toHaveBeenCalled()
    expect(mockSaveImage).toHaveBeenCalled()
  })
})

describe('DELETE /api/admin/images', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockIsAllowedImagePath.mockReturnValue(true)
    mockDeleteImage.mockImplementation(() => {})
  })

  it('should return 401 when unauthenticated', async () => {
    mockAuth.mockResolvedValue(null)
    const req = new Request('http://localhost/api/admin/images', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: '/images/foo.jpg' }),
    })
    const res = await DELETE(req)
    expect(res.status).toBe(401)
    expect(mockDeleteImage).not.toHaveBeenCalled()
  })

  it('should return 400 when path missing', async () => {
    mockAuth.mockResolvedValue({ user: {} })
    const req = new Request('http://localhost/api/admin/images', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
    const res = await DELETE(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toMatch(/path/i)
    expect(mockDeleteImage).not.toHaveBeenCalled()
  })

  it('should return 400 when path not allowed', async () => {
    mockAuth.mockResolvedValue({ user: {} })
    mockIsAllowedImagePath.mockReturnValue(false)
    const req = new Request('http://localhost/api/admin/images', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: '/etc/passwd' }),
    })
    const res = await DELETE(req)
    expect(res.status).toBe(400)
    expect(mockDeleteImage).not.toHaveBeenCalled()
  })

  it('should delete and return success when authenticated with valid path', async () => {
    mockAuth.mockResolvedValue({ user: {} })
    const req = new Request('http://localhost/api/admin/images', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: '/images/foo.jpg' }),
    })
    const res = await DELETE(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.success).toBe(true)
    expect(mockDeleteImage).toHaveBeenCalledWith('/images/foo.jpg')
  })

  it('should return 404 when image not found', async () => {
    mockAuth.mockResolvedValue({ user: {} })
    mockDeleteImage.mockImplementation(() => {
      throw new Error('Image not found')
    })
    const req = new Request('http://localhost/api/admin/images', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: '/images/missing.jpg' }),
    })
    const res = await DELETE(req)
    expect(res.status).toBe(404)
    const data = await res.json()
    expect(data.error).toMatch(/not found/i)
  })
})
