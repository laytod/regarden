import LoginForm from '@/components/Auth/LoginForm'

export const metadata = {
  title: 'Admin Login - ReGarden',
  description: 'Admin login page for ReGarden',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 px-4">
      <div className="max-w-md w-full">
        <div className="bg-slate-800 rounded-lg shadow-xl p-8 border border-purple-500/30">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary-400 mb-2">
              Admin Login
            </h1>
            <p className="text-slate-300">
              Sign in to manage ReGarden content
            </p>
          </div>
          <LoginForm />
        </div>
        <p className="text-center text-slate-400 text-sm mt-6">
          ReGarden Admin Panel
        </p>
      </div>
    </div>
  )
}
