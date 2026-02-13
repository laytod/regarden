'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import EventModal from '@/components/Events/EventModal'
import { EventInput } from '@fullcalendar/core'
import Link from 'next/link'

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

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isLoading, setIsLoading] = useState(true)
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

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events')
      const data = await response.json()
      setEvents(data)
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    if (showMonthPicker) {
      const [y] = displayMonth.split('-').map(Number)
      setPickerYear(Math.max(2026, y))
    }
  }, [showMonthPicker, displayMonth])

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

  const handleEventClick = (clickInfo: any) => {
    const eventData = clickInfo.event
    const event = events.find((e) => e.id === eventData.id)
    if (event) {
      setSelectedEvent(event)
      setIsModalOpen(true)
    }
  }

  const handleDateClick = (arg: any) => {
    const newEvent: Event = {
      id: '',
      title: '',
      date: arg.dateStr.split('T')[0],
      startTime: '09:00',
      endTime: '17:00',
      location: '',
      description: '',
      type: 'event',
      contactPerson: '',
      contactEmail: '',
    }
    setSelectedEvent(newEvent)
    setIsModalOpen(true)
  }

  const handleSaveEvent = async (eventData: Event) => {
    try {
      const method = eventData.id ? 'PUT' : 'POST'
      const response = await fetch('/api/events', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      })

      if (response.ok) {
        await fetchEvents()
        setIsModalOpen(false)
        setSelectedEvent(null)
      } else {
        console.error('Failed to save event')
      }
    } catch (error) {
      console.error('Error saving event:', error)
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) {
      return
    }

    try {
      const response = await fetch(`/api/events?id=${eventId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchEvents()
        setIsModalOpen(false)
        setSelectedEvent(null)
      } else {
        console.error('Failed to delete event')
      }
    } catch (error) {
      console.error('Error deleting event:', error)
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
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary-400 mb-2">
          Manage Events
        </h1>
        <p className="text-slate-300 mb-2">
          Click a date to add an event. Click an existing event to edit or delete.
        </p>
        <Link
          href="/events"
          className="text-primary-400 hover:text-primary-300 text-sm"
        >
          View public calendar →
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center">
          <span className="w-4 h-4 bg-purple-600 rounded mr-2" />
          <span className="text-slate-200">Workshop</span>
        </div>
        <div className="flex items-center">
          <span className="w-4 h-4 bg-primary-600 rounded mr-2" />
          <span className="text-slate-200">Event</span>
        </div>
        <div className="flex items-center">
          <span className="w-4 h-4 bg-purple-500 rounded mr-2" />
          <span className="text-slate-200">Meeting</span>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-earth-600">
          Loading events...
        </div>
      ) : (
        <div className="bg-slate-800 rounded-lg shadow-lg p-4 border border-purple-500/30">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            {...(initialCalendarDate && { initialDate: initialCalendarDate })}
            validRange={{ start: '2026-01-01' }}
            customButtons={{
              selectMonth: {
                text: 'Select month',
                click: () => setShowMonthPicker(true),
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
            dateClick={handleDateClick}
            editable={false}
            selectable={true}
            height="auto"
            eventClassNames="cursor-pointer"
          />
        </div>
      )}

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

      {isModalOpen && selectedEvent && (
        <EventModal
          event={selectedEvent}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}
