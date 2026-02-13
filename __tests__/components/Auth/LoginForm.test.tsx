import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginForm from '@/components/Auth/LoginForm'
import { signIn } from 'next-auth/react'
import * as nextNavigation from 'next/navigation'

jest.mock('next-auth/react')
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(() => '/'),
}))

const mockSignIn = signIn as jest.MockedFunction<typeof signIn>
const mockPush = jest.fn()
const mockRefresh = jest.fn()
const mockReplace = jest.fn()

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(nextNavigation.useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
      replace: mockReplace,
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
    })
  })

  it('should render login form', () => {
    render(<LoginForm />)
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('should show validation errors for empty fields', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    const submitButton = screen.getByRole('button', { name: /sign in/i })
    await user.click(submitButton)

    await waitFor(() => {
      // loginSchema: empty email -> "Invalid email address", empty password -> "Password is required"
      const errors = screen.getAllByText(/invalid email address|password is required/i)
      expect(errors.length).toBeGreaterThanOrEqual(1)
    })
  })

  it('should show error for invalid email', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    const emailInput = screen.getByLabelText(/email address/i)
    await user.type(emailInput, 'invalid-email')

    const submitButton = screen.getByRole('button', { name: /sign in/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument()
    })
  })

  it('should call signIn on form submission', async () => {
    const user = userEvent.setup()
    mockSignIn.mockResolvedValue({ ok: true, error: null } as any)

    render(<LoginForm />)

    const emailInput = screen.getByLabelText(/email address/i)
    const passwordInput = screen.getByLabelText(/password/i)

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')

    const submitButton = screen.getByRole('button', { name: /sign in/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('credentials', {
        email: 'test@example.com',
        password: 'password123',
        redirect: false,
      })
    })
  })

  it('should show error message on login failure', async () => {
    const user = userEvent.setup()
    mockSignIn.mockResolvedValue({
      ok: false,
      error: 'Invalid credentials',
    } as any)

    render(<LoginForm />)

    const emailInput = screen.getByLabelText(/email address/i)
    const passwordInput = screen.getByLabelText(/password/i)

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'wrongpassword')

    const submitButton = screen.getByRole('button', { name: /sign in/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument()
    })
  })

  it('should redirect to admin on successful login', async () => {
    const user = userEvent.setup()
    mockSignIn.mockResolvedValue({ ok: true, error: null } as any)

    render(<LoginForm />)

    const emailInput = screen.getByLabelText(/email address/i)
    const passwordInput = screen.getByLabelText(/password/i)

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')

    const submitButton = screen.getByRole('button', { name: /sign in/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/admin')
    })
  })

  it('should disable submit button while loading', async () => {
    const user = userEvent.setup()
    mockSignIn.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve({ ok: true, error: null } as any), 100)
        })
    )

    render(<LoginForm />)

    const emailInput = screen.getByLabelText(/email address/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    expect(submitButton).toBeDisabled()
    expect(screen.getByText(/signing in/i)).toBeInTheDocument()
  })
})
