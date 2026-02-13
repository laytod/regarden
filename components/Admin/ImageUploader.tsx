'use client'

import { useState, useRef, useCallback } from 'react'

const inputClass =
  'w-full px-4 py-2 rounded-lg border border-purple-600/30 bg-slate-700/60 focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-100 placeholder-slate-400'
const labelClass = 'block text-sm font-medium text-slate-200 mb-1'

interface ImageUploaderProps {
  onUploadSuccess?: (path: string) => void
  onUploadError?: (message: string) => void
}

export default function ImageUploader({
  onUploadSuccess,
  onUploadError,
}: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [subfolder, setSubfolder] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const upload = useCallback(
    async (file: File) => {
      setUploading(true)
      try {
        const form = new FormData()
        form.append('file', file)
        if (subfolder.trim()) form.append('subfolder', subfolder.trim())
        const res = await fetch('/api/admin/images', {
          method: 'POST',
          body: form,
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          throw new Error(data.error || 'Upload failed')
        }
        onUploadSuccess?.(data.path)
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Upload failed'
        onUploadError?.(msg)
      } finally {
        setUploading(false)
      }
    },
    [subfolder, onUploadSuccess, onUploadError]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragActive(false)
      const file = e.dataTransfer.files[0]
      if (file?.type.startsWith('image/')) upload(file)
    },
    [upload]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }, [])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) upload(file)
      e.target.value = ''
    },
    [upload]
  )

  return (
    <section className="bg-slate-800 p-6 rounded-lg border border-purple-500/30 mb-6">
      <h3 className="text-xl font-semibold text-primary-400 mb-4">
        Upload image
      </h3>
      <div className="space-y-4">
        <div>
          <label className={labelClass}>Subfolder (optional)</label>
          <input
            type="text"
            value={subfolder}
            onChange={(e) => setSubfolder(e.target.value)}
            placeholder="e.g. uploads"
            className={inputClass}
          />
        </div>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            dragActive
              ? 'border-primary-500 bg-primary-500/10'
              : 'border-purple-500/40 hover:border-primary-500/60 bg-slate-700/40'
          } ${uploading ? 'pointer-events-none opacity-60' : ''}`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleChange}
            className="hidden"
          />
          {uploading ? (
            <p className="text-slate-300">Uploading…</p>
          ) : (
            <p className="text-slate-300">
              Drag and drop an image here, or click to select. JPEG, PNG, GIF,
              WebP up to 5MB.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
