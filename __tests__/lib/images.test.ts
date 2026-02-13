/**
 * @jest-environment node
 */
import {
  validateImageFile,
  isAllowedImagePath,
  listImages,
  saveImage,
  deleteImage,
} from '@/lib/images'

const mockReadDirSync = jest.fn()
const mockExistsSync = jest.fn()
const mockMkdirSync = jest.fn()
const mockWriteFileSync = jest.fn()
const mockUnlinkSync = jest.fn()

jest.mock('fs', () => ({
  readdirSync: (...args: unknown[]) => mockReadDirSync(...args),
  existsSync: (...args: unknown[]) => mockExistsSync(...args),
  mkdirSync: (...args: unknown[]) => mockMkdirSync(...args),
  writeFileSync: (...args: unknown[]) => mockWriteFileSync(...args),
  unlinkSync: (...args: unknown[]) => mockUnlinkSync(...args),
}))

jest.mock('path', () => ({
  join: jest.fn((...args: string[]) => args.join('/')),
  extname: jest.fn((p: string) => {
    const i = p.lastIndexOf('.')
    return i >= 0 ? p.slice(i).toLowerCase() : ''
  }),
}))

describe('validateImageFile', () => {
  it('should accept valid JPEG', () => {
    expect(validateImageFile({ type: 'image/jpeg', size: 1000 })).toEqual({
      ok: true,
    })
  })

  it('should accept valid PNG, GIF, WebP', () => {
    expect(validateImageFile({ type: 'image/png', size: 500 })).toEqual({
      ok: true,
    })
    expect(validateImageFile({ type: 'image/gif', size: 500 })).toEqual({
      ok: true,
    })
    expect(validateImageFile({ type: 'image/webp', size: 500 })).toEqual({
      ok: true,
    })
  })

  it('should reject invalid file type', () => {
    const result = validateImageFile({
      type: 'application/pdf',
      size: 1000,
    }) as { ok: false; error: string }
    expect(result.ok).toBe(false)
    expect(result.error).toMatch(/invalid file type/i)
  })

  it('should reject empty file', () => {
    const result = validateImageFile({ type: 'image/jpeg', size: 0 }) as {
      ok: false
      error: string
    }
    expect(result.ok).toBe(false)
    expect(result.error).toMatch(/empty/i)
  })

  it('should reject file over 5MB', () => {
    const result = validateImageFile({
      type: 'image/jpeg',
      size: 6 * 1024 * 1024,
    }) as { ok: false; error: string }
    expect(result.ok).toBe(false)
    expect(result.error).toMatch(/too large/i)
  })
})

describe('isAllowedImagePath', () => {
  it('should allow /images/foo.jpg', () => {
    expect(isAllowedImagePath('/images/foo.jpg')).toBe(true)
  })

  it('should allow /images/subdir/bar.png', () => {
    expect(isAllowedImagePath('/images/subdir/bar.png')).toBe(true)
  })

  it('should reject path without /images/ prefix', () => {
    expect(isAllowedImagePath('/other/foo.jpg')).toBe(false)
    expect(isAllowedImagePath('images/foo.jpg')).toBe(false)
  })

  it('should reject path traversal', () => {
    expect(isAllowedImagePath('/images/../etc/passwd')).toBe(false)
    expect(isAllowedImagePath('/images/foo/../../bar.jpg')).toBe(false)
  })

  it('should reject /images or /images/', () => {
    expect(isAllowedImagePath('/images')).toBe(false)
    expect(isAllowedImagePath('/images/')).toBe(false)
  })
})

describe('listImages', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockExistsSync.mockReturnValue(true)
  })

  it('should return image paths from flat dir', () => {
    mockReadDirSync.mockReturnValue([
      { name: 'a.jpg', isFile: () => true, isDirectory: () => false },
      { name: 'b.png', isFile: () => true, isDirectory: () => false },
      { name: 'ignore.txt', isFile: () => true, isDirectory: () => false },
    ])
    const result = listImages()
    expect(result).toContain('/images/a.jpg')
    expect(result).toContain('/images/b.png')
    expect(result).not.toContain('/images/ignore.txt')
    expect(result).toHaveLength(2)
  })

  it('should scan subdirectories', () => {
    mockReadDirSync
      .mockImplementationOnce(() => [
        {
          name: 'uploads',
          isFile: () => false,
          isDirectory: () => true,
        },
      ])
      .mockImplementationOnce(() => [
        { name: 'x.webp', isFile: () => true, isDirectory: () => false },
      ])
    const result = listImages()
    expect(result).toContain('/images/uploads/x.webp')
  })

  it('should include .heic', () => {
    mockReadDirSync.mockReturnValue([
      { name: 'photo.heic', isFile: () => true, isDirectory: () => false },
    ])
    const result = listImages()
    expect(result).toContain('/images/photo.heic')
  })

  it('should return empty array when dir does not exist', () => {
    mockExistsSync.mockReturnValue(false)
    const result = listImages()
    expect(result).toEqual([])
  })
})

describe('saveImage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockExistsSync.mockReturnValue(true)
  })

  it('should write buffer and return web path', () => {
    const buf = Buffer.from('fake-image')
    const path = saveImage(buf, 'image/jpeg')
    expect(path).toMatch(/^\/images\/[a-f0-9]+\.jpg$/)
    expect(mockWriteFileSync).toHaveBeenCalled()
  })

  it('should create subfolder when provided', () => {
    mockExistsSync.mockReturnValue(false)
    const buf = Buffer.from('x')
    const path = saveImage(buf, 'image/png', 'uploads')
    expect(path).toMatch(/^\/images\/uploads\/[a-f0-9]+\.png$/)
    expect(mockMkdirSync).toHaveBeenCalled()
    expect(mockWriteFileSync).toHaveBeenCalled()
  })

  it('should sanitize subfolder name', () => {
    mockExistsSync.mockReturnValue(false)
    saveImage(Buffer.from('x'), 'image/jpeg', 'foo/bar..baz')
    expect(mockMkdirSync).toHaveBeenCalledWith(
      expect.stringContaining('foobarbaz'),
      { recursive: true }
    )
  })
})

describe('deleteImage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockExistsSync.mockReturnValue(true)
  })

  it('should unlink file for allowed path', () => {
    deleteImage('/images/test.jpg')
    expect(mockUnlinkSync).toHaveBeenCalledWith(
      expect.stringContaining('public/images/test.jpg')
    )
  })

  it('should throw for disallowed path', () => {
    expect(() => deleteImage('/other/x.jpg')).toThrow(/invalid|disallowed/i)
    expect(mockUnlinkSync).not.toHaveBeenCalled()
  })

  it('should throw for path traversal', () => {
    expect(() => deleteImage('/images/../etc/passwd')).toThrow()
    expect(mockUnlinkSync).not.toHaveBeenCalled()
  })

  it('should throw when file not found', () => {
    mockExistsSync.mockReturnValue(false)
    expect(() => deleteImage('/images/missing.jpg')).toThrow(/not found/i)
    expect(mockUnlinkSync).not.toHaveBeenCalled()
  })
})
