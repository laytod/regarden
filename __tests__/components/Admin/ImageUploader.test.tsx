import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ImageUploader from '@/components/Admin/ImageUploader'

const mockFetch = jest.fn()

describe('ImageUploader', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = mockFetch
  })

  it('should render upload section with drop zone and optional subfolder', () => {
    render(<ImageUploader />)
    expect(screen.getByRole('heading', { name: /upload image/i })).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/e\.g\. uploads/i)).toBeInTheDocument()
    expect(screen.getByText(/drag and drop|click to select/i)).toBeInTheDocument()
  })

  it('should show uploading state when file is selected', async () => {
    mockFetch.mockImplementation(() => new Promise(() => {}))
    render(<ImageUploader />)
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['x'], 'test.jpg', { type: 'image/jpeg' })
    const user = userEvent.setup()
    await user.upload(input, file)
    await waitFor(() => {
      expect(screen.getByText(/uploading/i)).toBeInTheDocument()
    })
  })

  it('should call onUploadSuccess when upload succeeds', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ path: '/images/uploads/abc.jpg' }),
    })
    const onSuccess = jest.fn()
    render(<ImageUploader onUploadSuccess={onSuccess} />)
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['x'], 'test.jpg', { type: 'image/jpeg' })
    const user = userEvent.setup()
    await user.upload(input, file)
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/admin/images', expect.any(Object))
      expect(mockFetch.mock.calls[0][1].method).toBe('POST')
    })
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith('/images/uploads/abc.jpg')
    })
  })

  it('should call onUploadError when upload fails', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: 'File too large' }),
    })
    const onError = jest.fn()
    render(<ImageUploader onUploadError={onError} />)
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['x'], 'test.jpg', { type: 'image/jpeg' })
    const user = userEvent.setup()
    await user.upload(input, file)
    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith('File too large')
    })
  })
})
