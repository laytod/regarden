import { useState } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ImagePicker from '@/components/Admin/ImagePicker'

const mockFetch = jest.fn()

describe('ImagePicker', () => {
  const defaultProps = {
    value: '',
    onChange: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = mockFetch
    mockFetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          images: ['/images/a.jpg', '/images/b.png', '/images/c.gif'],
        }),
    })
  })

  it('should render label, input, and choose button', () => {
    render(<ImagePicker {...defaultProps} label="Background image" />)
    expect(screen.getByText('Background image')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/\/images\/\.\.\./)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /choose image/i })).toBeInTheDocument()
  })

  it('should update value via input', async () => {
    function ControlledWrapper() {
      const [v, setV] = useState('/img.jpg')
      return <ImagePicker value={v} onChange={setV} label="Image" />
    }
    const { useState } = await import('react')
    function Wrapper() {
      const [v, setV] = useState('/img.jpg')
      return <ImagePicker value={v} onChange={setV} label="Image" />
    }
    render(<Wrapper />)
    const input = screen.getByPlaceholderText(/\/images\/\.\.\./)
    await userEvent.clear(input)
    await userEvent.type(input, '/images/new.jpg')
    await waitFor(() => {
      expect(screen.getByDisplayValue('/images/new.jpg')).toBeInTheDocument()
    })
  })

  it('should open modal and fetch images when Choose image is clicked', async () => {
    render(<ImagePicker {...defaultProps} />)
    await userEvent.click(screen.getByRole('button', { name: /choose image/i }))
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /select image/i })).toBeInTheDocument()
    })
    expect(mockFetch).toHaveBeenCalledWith('/api/admin/images')
  })

  it('should call onChange and close modal when image is selected', async () => {
    const onChange = jest.fn()
    render(<ImagePicker {...defaultProps} onChange={onChange} />)
    await userEvent.click(screen.getByRole('button', { name: /choose image/i }))
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /select image/i })).toBeInTheDocument()
    })
    const img = screen.getByAltText('/images/a.jpg')
    const btn = img.closest('button')
    expect(btn).toBeTruthy()
    await userEvent.click(btn!)
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith('/images/a.jpg')
    })
    expect(screen.queryByRole('heading', { name: /select image/i })).not.toBeInTheDocument()
  })

  it('should close modal when Close is clicked', async () => {
    render(<ImagePicker {...defaultProps} />)
    await userEvent.click(screen.getByRole('button', { name: /choose image/i }))
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /select image/i })).toBeInTheDocument()
    })
    const closeButtons = screen.getAllByRole('button', { name: /close/i })
    const modalClose = closeButtons.find((b) => b.textContent === 'Close')
    await userEvent.click(modalClose!)
    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: /select image/i })).not.toBeInTheDocument()
    })
  })
})
