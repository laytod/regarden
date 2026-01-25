'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    // If not on login page and not authenticated, redirect to login
    if (!isLoginPage && status === 'unauthenticated') {
      router.push('/admin/login')
    }
    // If on login page and authenticated, redirect to dashboard
    if (isLoginPage && status === 'authenticated') {
      router.push('/admin')
    }
  }, [status, router, isLoginPage])

  // Show loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-slate-200">Loading...</div>
      </div>
    )
  }

  // If on login page, show without admin header
  if (isLoginPage) {
    return <div className="min-h-screen bg-slate-900">{children}</div>
  }

  // If not authenticated and not on login page, show nothing (redirecting)
  if (status === 'unauthenticated') {
    return null
  }

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/admin/login' })
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/admin" className="text-2xl font-bold text-primary-400">
                ReGarden Admin
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-slate-300">
                {session?.user?.name || session?.user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  )
}
