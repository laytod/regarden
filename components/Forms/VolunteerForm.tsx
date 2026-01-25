'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'

interface VolunteerFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  interests: string[]
  availability: string
  experience: string
  message: string
}

export default function VolunteerForm() {
  const [submitted, setSubmitted] = useState(false)
  const { register, handleSubmit, formState: { errors }, reset } = useForm<VolunteerFormData>()

  const onSubmit = async (data: VolunteerFormData) => {
    // In a real application, this would send data to an API
    console.log('Volunteer application:', data)
    
    // For demo purposes, we'll just log and show success message
    setSubmitted(true)
    reset()
    
    // Reset success message after 5 seconds
    setTimeout(() => setSubmitted(false), 5000)
  }

  const interestOptions = [
    'Garden Work',
    'Education & Events',
    'Administration',
    'Community Leadership',
  ]

  if (submitted) {
    return (
      <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg">
        <h3 className="font-semibold mb-2">Thank you for your interest in volunteering!</h3>
        <p>
          We&apos;ve received your application and will contact you within 1-2 business days 
          to discuss volunteer opportunities that match your interests.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-semibold text-primary-400 mb-2">
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            {...register('firstName', { required: 'First name is required' })}
            className="w-full px-4 py-2 border border-purple-600/30 bg-slate-700/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-100 placeholder-slate-400"
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-semibold text-primary-400 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            id="lastName"
            {...register('lastName', { required: 'Last name is required' })}
            className="w-full px-4 py-2 border border-purple-600/30 bg-slate-700/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-100 placeholder-slate-400"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-primary-400 mb-2">
            Email *
          </label>
          <input
            type="email"
            id="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            className="w-full px-4 py-2 border border-purple-600/30 bg-slate-700/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-100 placeholder-slate-400"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-primary-400 mb-2">
            Phone *
          </label>
          <input
            type="tel"
            id="phone"
            {...register('phone', { required: 'Phone is required' })}
            className="w-full px-4 py-2 border border-purple-600/30 bg-slate-700/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-100 placeholder-slate-400"
            placeholder="(555) 123-4567"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-primary-400 mb-2">
          Volunteer Interests * (select all that apply)
        </label>
        <div className="grid grid-cols-2 gap-2">
          {interestOptions.map((option) => (
            <label key={option} className="flex items-center space-x-2">
              <input
                type="checkbox"
                value={option}
                {...register('interests', { required: 'Please select at least one interest' })}
                className="rounded border-purple-600/30 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-slate-200">{option}</span>
            </label>
          ))}
        </div>
        {errors.interests && (
          <p className="mt-1 text-sm text-red-600">{errors.interests.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="availability" className="block text-sm font-semibold text-primary-400 mb-2">
          Availability *
        </label>
        <select
          id="availability"
          {...register('availability', { required: 'Availability is required' })}
          className="w-full px-4 py-2 border border-purple-600/30 bg-slate-700/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-100"
        >
          <option value="">Select availability</option>
          <option value="flexible">Flexible - anytime</option>
          <option value="weekdays">Weekdays</option>
          <option value="weekends">Weekends</option>
          <option value="mornings">Mornings</option>
          <option value="afternoons">Afternoons</option>
          <option value="evenings">Evenings</option>
        </select>
        {errors.availability && (
          <p className="mt-1 text-sm text-red-600">{errors.availability.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="experience" className="block text-sm font-semibold text-primary-400 mb-2">
          Gardening Experience *
        </label>
        <select
          id="experience"
          {...register('experience', { required: 'Experience level is required' })}
          className="w-full px-4 py-2 border border-purple-600/30 bg-slate-700/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-100"
        >
          <option value="">Select experience level</option>
          <option value="none">No experience - ready to learn!</option>
          <option value="beginner">Beginner - some basic experience</option>
          <option value="intermediate">Intermediate - comfortable with gardening</option>
          <option value="advanced">Advanced - experienced gardener</option>
          <option value="expert">Expert - professional or master gardener</option>
        </select>
        {errors.experience && (
          <p className="mt-1 text-sm text-red-600">{errors.experience.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-primary-400 mb-2">
          Message (optional)
        </label>
        <textarea
          id="message"
          rows={4}
          {...register('message')}
          className="w-full px-4 py-2 border border-purple-600/30 bg-slate-700/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-100"
          placeholder="Tell us more about yourself, why you want to volunteer, or any questions you have..."
        />
      </div>

      <button
        type="submit"
        className="w-full bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
      >
        Submit Application
      </button>
    </form>
  )
}
