'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'

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

interface EventModalProps {
  event: Event
  onSave: (event: Event) => void
  onDelete: (eventId: string) => void
  onClose: () => void
}

export default function EventModal({ event, onSave, onDelete, onClose }: EventModalProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<Event>({
    defaultValues: event,
  })

  useEffect(() => {
    reset(event)
  }, [event, reset])

  const onSubmit = (data: Event) => {
    const eventData: Event = {
      ...data,
      id: event.id || Date.now().toString(),
    }
    onSave(eventData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/30">
        <div className="sticky top-0 bg-slate-800 border-b border-purple-500/30 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-primary-400">
            {event.id ? 'Edit Event' : 'Create New Event'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-200 hover:text-white text-2xl"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-primary-400 mb-2">
              Event Title *
            </label>
            <input
              type="text"
              id="title"
              {...register('title', { required: 'Title is required' })}
              className="w-full px-4 py-2 border border-purple-600/30 bg-slate-700/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-100 placeholder-slate-400"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-semibold text-primary-400 mb-2">
                Date *
              </label>
              <input
                type="date"
                id="date"
                {...register('date', { required: 'Date is required' })}
                className="w-full px-4 py-2 border border-purple-600/30 bg-slate-700/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-100"
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-semibold text-primary-400 mb-2">
                Event Type *
              </label>
              <select
                id="type"
                {...register('type', { required: 'Type is required' })}
                className="w-full px-4 py-2 border border-purple-600/30 bg-slate-700/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-100"
              >
                <option value="event">Event</option>
                <option value="workshop">Workshop</option>
                <option value="meeting">Meeting</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startTime" className="block text-sm font-semibold text-primary-400 mb-2">
                Start Time *
              </label>
              <input
                type="time"
                id="startTime"
                {...register('startTime', { required: 'Start time is required' })}
                className="w-full px-4 py-2 border border-purple-600/30 bg-slate-700/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-100"
              />
              {errors.startTime && (
                <p className="mt-1 text-sm text-red-600">{errors.startTime.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="endTime" className="block text-sm font-semibold text-primary-400 mb-2">
                End Time *
              </label>
              <input
                type="time"
                id="endTime"
                {...register('endTime', { required: 'End time is required' })}
                className="w-full px-4 py-2 border border-purple-600/30 bg-slate-700/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-100"
              />
              {errors.endTime && (
                <p className="mt-1 text-sm text-red-600">{errors.endTime.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-semibold text-primary-400 mb-2">
              Location *
            </label>
            <input
              type="text"
              id="location"
              {...register('location', { required: 'Location is required' })}
              className="w-full px-4 py-2 border border-purple-600/30 bg-slate-700/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-100 placeholder-slate-400"
              placeholder="e.g., Main Community Garden, 123 Green Street"
            />
            {errors.location && (
              <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-primary-400 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              rows={4}
              {...register('description', { required: 'Description is required' })}
              className="w-full px-4 py-2 border border-purple-600/30 bg-slate-700/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-100 placeholder-slate-400"
              placeholder="Describe the event..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contactPerson" className="block text-sm font-semibold text-primary-400 mb-2">
                Contact Person *
              </label>
              <input
                type="text"
                id="contactPerson"
                {...register('contactPerson', { required: 'Contact person is required' })}
                className="w-full px-4 py-2 border border-purple-600/30 bg-slate-700/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-100 placeholder-slate-400"
              />
              {errors.contactPerson && (
                <p className="mt-1 text-sm text-red-600">{errors.contactPerson.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="contactEmail" className="block text-sm font-semibold text-primary-400 mb-2">
                Contact Email *
              </label>
              <input
                type="email"
                id="contactEmail"
                {...register('contactEmail', {
                  required: 'Contact email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                className="w-full px-4 py-2 border border-purple-600/30 bg-slate-700/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-100 placeholder-slate-400"
              />
              {errors.contactEmail && (
                <p className="mt-1 text-sm text-red-600">{errors.contactEmail.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-purple-500/30">
            {event.id && (
              <button
                type="button"
                onClick={() => onDelete(event.id)}
                className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Delete Event
              </button>
            )}
            <div className="ml-auto flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-slate-700/60 text-slate-100 rounded-lg font-semibold hover:bg-earth-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                {event.id ? 'Update Event' : 'Create Event'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
