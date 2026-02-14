'use client'

import { useMemo, useRef, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import EventViewModal from '@/components/Events/EventViewModal'
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
  const [events] = useState<Event[]>(initialEvents)
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

  // Sync picker year to current calendar month when opening modal (2025 excluded)
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        {/* Event Type Legend */}
        <div className="flex flex-wrap gap-4 mb-6 text-sm">
          <div className="flex items-center">
            <span className="w-4 h-4 bg-purple-600 rounded mr-2"></span>
            <span className="text-slate-200">Workshop</span>
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 bg-primary-600 rounded mr-2"></span>
            <span className="text-slate-200">Event</span>
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 bg-purple-500 rounded mr-2"></span>
            <span className="text-slate-200">Meeting</span>
          </div>
        </div>
      </div>

      <div className="bg-[rgb(220,240,225)] rounded-lg shadow-lg p-4 border border-primary-500/30">
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
