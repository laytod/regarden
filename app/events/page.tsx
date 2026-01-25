'use client'

import { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import EventModal from '@/components/Events/EventModal'
import { EventInput } from '@fullcalendar/core'

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

export default function Events() {
  const [events, setEvents] = useState<Event[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch events
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

  // Handle event click
  const handleEventClick = (clickInfo: any) => {
    const eventData = clickInfo.event
    const event = events.find((e) => e.id === eventData.id)
    if (event) {
      setSelectedEvent(event)
      setIsModalOpen(true)
    }
  }

  // Handle date click (create new event)
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

  // Handle save event (create or update)
  const handleSaveEvent = async (eventData: Event) => {
    try {
      const url = eventData.id ? '/api/events' : '/api/events'
      const method = eventData.id ? 'PUT' : 'POST'

      const response = await fetch(url, {
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

  // Handle delete event
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

      {isLoading ? (
        <div className="text-center py-12">
          <div className="text-earth-600">Loading events...</div>
        </div>
      ) : (
        <div className="bg-[rgb(220,240,225)] rounded-lg shadow-lg p-4 border border-primary-500/30">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
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

      {/* Event Modal */}
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
