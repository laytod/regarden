'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-800">
      <div className="text-center p-8 bg-slate-700/60 border border-purple-500/30 rounded-lg max-w-md">
        <h2 className="text-2xl font-bold text-primary-400 mb-4">Something went wrong!</h2>
        <p className="text-slate-200 mb-6">{error.message}</p>
        <button
          onClick={() => reset()}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
