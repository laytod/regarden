'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

interface ImagePickerProps {
  value: string
  onChange: (path: string) => void
  label?: string
}

export default function ImagePicker({
  value,
  onChange,
  label = 'Image',
}: ImagePickerProps) {
  const [images, setImages] = useState<string[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchImages = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/images')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setImages(data.images ?? [])
    } catch {
      setImages([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (open) fetchImages()
  }, [open, fetchImages])

  const handleSelect = useCallback(
    (path: string) => {
      onChange(path)
      setOpen(false)
    },
    [onChange]
  )

  const labelClass = 'block text-sm font-medium text-slate-200 mb-1'
  const inputClass =
    'w-full px-4 py-2 rounded-lg border border-purple-600/30 bg-slate-700/60 focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-100 placeholder-slate-400'

  return (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/images/..."
          className={inputClass}
        />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors"
        >
          Choose image
        </button>
      </div>
      {value && (
        <div className="mt-2 relative w-24 h-24 rounded overflow-hidden bg-slate-700/40 border border-purple-500/20">
          <Image
            src={value}
            alt="Selected"
            fill
            className="object-cover"
            sizes="96px"
            unoptimized
          />
        </div>
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setOpen(false)}
          onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
          role="button"
          tabIndex={0}
          aria-label="Close picker"
        >
          <div
            className="bg-slate-800 rounded-lg border border-purple-500/30 max-w-4xl w-full max-h-[90vh] overflow-auto p-6"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-primary-400">
                Select image
              </h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
            {loading ? (
              <p className="text-slate-400">Loading…</p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {images.map((path) => (
                  <button
                    key={path}
                    type="button"
                    onClick={() => handleSelect(path)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      value === path
                        ? 'border-primary-500 ring-2 ring-primary-500/50'
                        : 'border-transparent hover:border-primary-500/50'
                    }`}
                  >
                    <Image
                      src={path}
                      alt={path}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 33vw, 20vw"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
