'use client'

import { useMemo, useRef, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import EventViewModal from '@/components/Events/EventViewModal'
import LocationLink from '@/components/Events/LocationLink'
import { formatTime12h } from '@/lib/formatTime'
import { sanitizeEventDescription } from '@/lib/sanitizeHtml'
import { EventInput } from '@fullcalendar/core'

export interface Event {
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

interface EventsClientProps {
  initialEvents: Event[]
}

export default function EventsClient({ initialEvents }: EventsClientProps) {
  const [events, setEvents] = useState<Event[]>(initialEvents)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [displayMonth, setDisplayMonth] = useState(() =>
    new Date().toISOString().slice(0, 7)
  )
  const [showMonthPicker, setShowMonthPicker] = useState(false)
  const [pickerYear, setPickerYear] = useState(() =>
    Math.max(2026, new Date().getFullYear())
  )
  const calendarRef = useRef<InstanceType<typeof FullCalendar> | null>(null)

  const MONTHS = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ]

  const initialCalendarDate = useMemo(
    () => (new Date().getFullYear() < 2026 ? '2026-01-01' : null),
    []
  )

  const handleMonthPickerOpen = () => {
    setShowMonthPicker(true)
    const [y] = displayMonth.split('-').map(Number)
    setPickerYear(Math.max(2026, y))
  }

  // Convert events to FullCalendar format
  const calendarEvents: EventInput[] = events.map((event) => ({
    id: event.id,
    title: event.title,
    start: `${event.date}T${event.startTime}`,
    end: `${event.date}T${event.endTime}`,
    extendedProps: {
      location: event.location,
      description: event.description,
      type: event.type,
      contactPerson: event.contactPerson,
      contactEmail: event.contactEmail,
      startTime: event.startTime,
      endTime: event.endTime,
    },
    className: `event-type-${event.type}`,
  }))

  const handleEventClick = (clickInfo: { event: { id: string } }) => {
    const event = events.find((e) => e.id === clickInfo.event.id)
    if (event) {
      setSelectedEvent(event)
      setIsModalOpen(true)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedEvent(null)
  }

  const handleDatesSet = (arg: { start: Date }) => {
    setDisplayMonth(
      `${arg.start.getFullYear()}-${String(arg.start.getMonth() + 1).padStart(2, '0')}`
    )
  }

  const handlePickMonth = (monthIndex: number) => {
    calendarRef.current?.getApi().gotoDate(new Date(pickerYear, monthIndex, 1))
    setShowMonthPicker(false)
  }

  const today = useMemo(() => new Date().toISOString().slice(0, 10), [])
  const upcomingEvents = useMemo(() => {
    return events
      .filter((e) => e.date >= today)
      .sort(
        (a, b) =>
          new Date(`${a.date}T${a.startTime}`).getTime() -
          new Date(`${b.date}T${b.startTime}`).getTime()
      )
      .slice(0, 3)
  }, [events, today])

  const formatEventDateLong = (dateStr: string) => {
    const d = new Date(dateStr + 'T12:00:00')
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {upcomingEvents.length > 0 && (
        <section className="mb-10" aria-labelledby="upcoming-events-heading">
          <h2 id="upcoming-events-heading" className="text-xl font-semibold text-slate-100 mb-4">
            Upcoming events
          </h2>
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <article
                key={event.id}
                className="rounded-lg border border-primary-500/30 bg-slate-800/50 overflow-hidden"
              >
                <div className="px-4 py-3 space-y-1.5">
                  <h3 className="text-base font-bold text-primary-400">{event.title}</h3>
                  <p className="text-slate-400 text-sm">
                    {formatEventDateLong(event.date)}
                    {' · '}
                    {formatTime12h(event.startTime)}
                    {event.endTime && event.endTime !== event.startTime
                      ? ` – ${formatTime12h(event.endTime)}`
                      : ''}
                  </p>
                  {event.location && (
                    <p className="text-slate-300 text-sm">
                      <LocationLink
                        location={event.location}
                        className="text-primary-400 hover:underline"
                      />
                    </p>
                  )}
                  {event.description && (
                    <div
                      className="text-slate-200 text-sm whitespace-pre-wrap pt-1 [&_strong]:text-purple-300 [&_b]:text-purple-300 [&_a]:text-primary-400 [&_a]:hover:underline [&_a]:underline-offset-1"
                      dangerouslySetInnerHTML={{
                        __html: sanitizeEventDescription(event.description),
                      }}
                    />
                  )}
                  {(event.contactPerson || event.contactEmail) && (
                    <p className="text-slate-300 text-sm">
                      Contact:{' '}
                      {event.contactPerson && <span>{event.contactPerson}</span>}
                      {event.contactPerson && event.contactEmail && ' · '}
                      {event.contactEmail && <span>{event.contactEmail}</span>}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <div className="mb-8 bg-[rgb(220,240,225)] rounded-lg shadow-lg p-4 border border-primary-500/30">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          {...(initialCalendarDate && { initialDate: initialCalendarDate })}
          validRange={{ start: '2026-01-01' }}
          customButtons={{
            selectMonth: {
              text: 'Select month',
              click: handleMonthPickerOpen,
            },
          }}
          headerToolbar={{
            left: 'selectMonth,prev,next today',
            center: 'title',
            right: '',
          }}
          datesSet={handleDatesSet}
          events={calendarEvents}
          eventClick={handleEventClick}
          editable={false}
          selectable={false}
          height="auto"
          eventClassNames="cursor-pointer"
          eventTimeFormat={{
            hour: 'numeric',
            minute: '2-digit',
            meridiem: 'short',
          }}
        />
      </div>

      {/* Month picker modal: custom year + month grid */}
      {showMonthPicker && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowMonthPicker(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="month-picker-title"
        >
          <div
            className="bg-slate-800 rounded-lg shadow-xl max-w-sm w-full border border-purple-500/30 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2
                id="month-picker-title"
                className="text-xl font-bold text-primary-400"
              >
                Pick a month
              </h2>
              <button
                type="button"
                onClick={() => setShowMonthPicker(false)}
                className="text-slate-200 hover:text-white text-2xl leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="flex items-center justify-center gap-2 mb-4">
              <button
                type="button"
                onClick={() => setPickerYear((y) => Math.max(2026, y - 1))}
                disabled={pickerYear <= 2026}
                className="fc-button fc-button-primary rounded px-3 py-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous year"
              >
                ←
              </button>
              <span className="text-slate-200 font-semibold min-w-[4rem] text-center">
                {pickerYear}
              </span>
              <button
                type="button"
                onClick={() => setPickerYear((y) => y + 1)}
                className="fc-button fc-button-primary rounded px-3 py-1.5 text-sm"
                aria-label="Next year"
              >
                →
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {MONTHS.map((label, i) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => handlePickMonth(i)}
                  className="rounded px-3 py-2 text-sm font-medium bg-slate-700/60 text-slate-200 hover:bg-primary-600 hover:text-white transition-colors"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Event detail modal (view only) */}
      {isModalOpen && selectedEvent && (
        <EventViewModal event={selectedEvent} onClose={handleCloseModal} />
      )}
    </div>
  )
}
