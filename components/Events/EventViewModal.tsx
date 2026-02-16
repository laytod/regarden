'use client'

import LocationLink from './LocationLink'
import { formatTime12h } from '@/lib/formatTime'
import { sanitizeEventDescription } from '@/lib/sanitizeHtml'

interface Event {
  id: string
  title: string
  date: string
  startTime: string
  endTime: string
  location: string
  description: string
  type: string
  contactPerson: string
  contactEmail: string
}

interface EventViewModalProps {
  event: Event
  onClose: () => void
}

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const formatType = (type: string) => {
  return type.charAt(0).toUpperCase() + type.slice(1)
}

export default function EventViewModal({ event, onClose }: EventViewModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/30">
        <div className="sticky top-0 bg-slate-800 border-b border-purple-500/30 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-primary-400">{event.title}</h2>
          <button
            onClick={onClose}
            className="text-slate-200 hover:text-white text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <p className="text-sm font-semibold text-primary-400 mb-1">Date</p>
            <p className="text-slate-200">{formatDate(event.date)}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-semibold text-primary-400 mb-1">Time</p>
              <p className="text-slate-200">
                {formatTime12h(event.startTime)} – {formatTime12h(event.endTime)}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-primary-400 mb-1">Type</p>
              <p className="text-slate-200">{formatType(event.type)}</p>
            </div>
          </div>

          {event.location && (
            <div>
              <p className="text-sm font-semibold text-primary-400 mb-1">Location</p>
              <p className="text-slate-200">
                <LocationLink
                  location={event.location}
                  className="text-primary-400 hover:text-primary-300 hover:underline"
                />
              </p>
            </div>
          )}

          {event.description && (
            <div>
              <p className="text-sm font-semibold text-primary-400 mb-1">Description</p>
              <div
                className="text-slate-200 whitespace-pre-wrap [&_strong]:text-purple-300 [&_b]:text-purple-300 [&_a]:text-primary-400 [&_a]:hover:underline [&_a]:underline-offset-1"
                dangerouslySetInnerHTML={{
                  __html: sanitizeEventDescription(event.description),
                }}
              />
            </div>
          )}

          {(event.contactPerson || event.contactEmail) && (
            <div className="pt-2 border-t border-purple-500/30">
              <p className="text-sm font-semibold text-primary-400 mb-2">Contact</p>
              <div className="space-y-1 text-slate-200">
                {event.contactPerson && <p>{event.contactPerson}</p>}
                {event.contactEmail && <p>{event.contactEmail}</p>}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-purple-500/30 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
