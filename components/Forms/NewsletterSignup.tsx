'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'

interface NewsletterFormData {
  email: string
  name?: string
}

export default function NewsletterSignup() {
  const [submitted, setSubmitted] = useState(false)
  const { register, handleSubmit, formState: { errors }, reset } = useForm<NewsletterFormData>()

  const onSubmit = async (data: NewsletterFormData) => {
    // In a real application, this would send data to an API
    console.log('Newsletter signup:', data)
    
    // For demo purposes, we'll just log and show success message
    setSubmitted(true)
    reset()
    
    // Reset success message after 5 seconds
    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <input
          type="email"
          placeholder="Your email address"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
          className="w-full px-4 py-2 rounded-lg border border-purple-600/30 bg-slate-700/60 focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-100 placeholder-slate-400"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>
      
      {submitted ? (
        <div className="bg-green-900 border border-green-700 text-green-200 px-4 py-3 rounded-lg">
          Thank you for subscribing! Check your email for confirmation.
        </div>
      ) : (
        <button
          type="submit"
          className="w-full bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
        >
          Subscribe
        </button>
      )}
    </form>
  )
}
