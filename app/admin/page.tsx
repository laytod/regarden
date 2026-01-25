import { auth } from '@/lib/auth-setup'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminDashboard() {
  const session = await auth()

  if (!session) {
    redirect('/admin/login')
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary-400 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-slate-300">
          Welcome back, {session.user?.name || session.user?.email}!
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/admin/content"
          className="bg-slate-800 p-6 rounded-lg border border-purple-500/30 hover:border-primary-500 transition-colors"
        >
          <h2 className="text-xl font-semibold text-primary-400 mb-2">
            Content Management
          </h2>
          <p className="text-slate-300">
            Edit headings, text blocks, and page content
          </p>
        </Link>

        <Link
          href="/admin/images"
          className="bg-slate-800 p-6 rounded-lg border border-purple-500/30 hover:border-primary-500 transition-colors"
        >
          <h2 className="text-xl font-semibold text-primary-400 mb-2">
            Image Manager
          </h2>
          <p className="text-slate-300">
            Upload, replace, and manage images
          </p>
        </Link>

        <Link
          href="/admin/users"
          className="bg-slate-800 p-6 rounded-lg border border-purple-500/30 hover:border-primary-500 transition-colors"
        >
          <h2 className="text-xl font-semibold text-primary-400 mb-2">
            User Management
          </h2>
          <p className="text-slate-300">
            Manage admin users and permissions
          </p>
        </Link>

        <Link
          href="/events"
          className="bg-slate-800 p-6 rounded-lg border border-purple-500/30 hover:border-primary-500 transition-colors"
        >
          <h2 className="text-xl font-semibold text-primary-400 mb-2">
            Events Calendar
          </h2>
          <p className="text-slate-300">
            Manage events and calendar
          </p>
        </Link>
      </div>

      <div className="mt-8 bg-slate-800 p-6 rounded-lg border border-purple-500/30">
        <h2 className="text-xl font-semibold text-primary-400 mb-4">
          Quick Stats
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <p className="text-slate-400 text-sm">Role</p>
            <p className="text-slate-200 text-lg font-semibold">
              {session.user?.role || 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">Email</p>
            <p className="text-slate-200 text-lg font-semibold">
              {session.user?.email || 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">Status</p>
            <p className="text-green-400 text-lg font-semibold">
              Active
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
