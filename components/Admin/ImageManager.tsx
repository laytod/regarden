'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import ImageUploader from './ImageUploader'

export default function ImageManager() {
  const [images, setImages] = useState<string[]>([])
  const [status, setStatus] = useState<'loading' | 'idle' | 'error'>('loading')
  const [message, setMessage] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const fetchImages = useCallback(async () => {
    setStatus('loading')
    setMessage(null)
    try {
      const res = await fetch('/api/admin/images')
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to fetch images')
      }
      const data = await res.json()
      setImages(data.images ?? [])
      setStatus('idle')
    } catch (e) {
      setStatus('error')
      setMessage(e instanceof Error ? e.message : 'Failed to load images')
    }
  }, [])

  useEffect(() => {
    fetchImages()
  }, [fetchImages])

  const handleDelete = useCallback(
    async (path: string) => {
      if (!confirm(`Delete ${path}?`)) return
      try {
        const res = await fetch('/api/admin/images', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path }),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data.error || 'Delete failed')
        setImages((prev) => prev.filter((p) => p !== path))
        if (preview === path) setPreview(null)
      } catch (e) {
        setMessage(e instanceof Error ? e.message : 'Delete failed')
      }
    },
    [preview]
  )

  const handleUploadSuccess = useCallback(() => {
    setMessage(null)
    fetchImages()
  }, [fetchImages])

  if (status === 'loading' && images.length === 0) {
    return (
      <div className="text-slate-300 py-8">Loading images…</div>
    )
  }

  return (
    <div>
      <ImageUploader
        onUploadSuccess={handleUploadSuccess}
        onUploadError={setMessage}
      />
      {message && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-red-900/50 border border-red-700 text-red-200">
          {message}
        </div>
      )}
      <section className="bg-slate-800 p-6 rounded-lg border border-purple-500/30">
        <h3 className="text-xl font-semibold text-primary-400 mb-4">
          Image gallery
        </h3>
        {status === 'error' && images.length === 0 ? (
          <div className="flex flex-col gap-4">
            <p className="text-red-300">{message}</p>
            <button
              type="button"
              onClick={fetchImages}
              className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-6 py-2 rounded-lg font-medium border border-purple-500/30 transition-colors w-fit"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((path) => (
              <div
                key={path}
                className="relative group rounded-lg overflow-hidden bg-slate-700/40 border border-purple-500/20"
              >
                <button
                  type="button"
                  onClick={() => setPreview(path)}
                  className="block w-full aspect-square relative"
                >
                  <Image
                    src={path}
                    alt={path}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    unoptimized
                  />
                </button>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPreview(path)}
                    className="bg-primary-600 hover:bg-primary-500 text-white px-3 py-1.5 rounded text-sm"
                  >
                    Preview
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(path)}
                    className="bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
                <p className="text-xs text-slate-400 truncate px-2 py-1" title={path}>
                  {path.split('/').pop()}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setPreview(null)}
          onKeyDown={(e) => e.key === 'Escape' && setPreview(null)}
          role="button"
          tabIndex={0}
          aria-label="Close preview"
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <Image
              src={preview}
              alt="Preview"
              width={1200}
              height={800}
              className="object-contain max-h-[85vh] w-auto mx-auto rounded"
              unoptimized
            />
            <p className="text-slate-300 text-sm mt-2 text-center break-all">
              {preview}
            </p>
            <button
              type="button"
              onClick={() => setPreview(null)}
              className="absolute -top-10 right-0 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
