'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { submitForm } from '@/lib/submitForm'
import { assetUrl } from '@/lib/assetUrl'

interface DonateFormData {
  firstName: string
  lastName: string
  email: string
  donationAmount: string
  message: string
}

const CASHAPP_HANDLE = '$RegardenUS'

export default function DonateForm() {
  const [submitted, setSubmitted] = useState(false)
  const [receiptOpen, setReceiptOpen] = useState(false)
  const { register, handleSubmit, formState: { errors }, reset } = useForm<DonateFormData>()

  const onSubmit = (data: DonateFormData) => {
    submitForm('Donation Tax Receipt Request – ReGarden', data)
    setSubmitted(true)
    reset()
    setReceiptOpen(false)
    setTimeout(() => setSubmitted(false), 5000)
  }

  if (submitted) {
    return (
      <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg">
        <h3 className="font-semibold mb-2">Thank you!</h3>
        <p>
          We&apos;ve received your information and will send a tax receipt to your email 
          once we confirm your Cash App donation. Thank you for supporting ReGarden!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Cash App Donation Section */}
      <div className="text-center p-6 bg-slate-800/50 rounded-lg border border-purple-500/30">
        <div className="mb-4">
          <span className="text-4xl font-bold text-primary-400">{CASHAPP_HANDLE}</span>
        </div>
        <div className="mb-4">
          <Image
            src={assetUrl('/images/cash-app-qr-code.png')}
            alt="Cash App QR Code for RegardenUS"
            width={192}
            height={192}
            className="mx-auto w-48 h-48 rounded-lg"
          />
        </div>
        <p className="text-slate-300 mb-4">
          Scan the QR code or tap the button below to donate
        </p>
        <a
          href={`https://cash.app/${CASHAPP_HANDLE}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-[#00D632] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#00B82B] transition-colors text-lg"
        >
          Open Cash App
        </a>
        <p className="text-slate-400 text-sm mt-3">
          You&apos;ll be redirected to Cash App to complete your donation
        </p>
      </div>

      {/* Tax-Deductible Information */}
      <div className="bg-slate-800/50 p-6 rounded-lg border border-purple-500/30">
        <h3 className="text-lg font-semibold text-primary-400 mb-2">Tax-Deductible Information</h3>
        <p className="text-slate-300 text-sm mb-2">
          ReGarden is a registered 501(c)(3) nonprofit organization. All donations are 
          tax-deductible to the extent allowed by law. You will receive a receipt for 
          your donation that can be used for tax purposes.
        </p>
        <p className="text-slate-300 text-sm">
          <strong>Tax ID (EIN):</strong> 12-3456789
        </p>
      </div>

      {/* Optional Receipt Form Accordion */}
      <div className="border-t border-purple-500/30 pt-6">
        <button
          type="button"
          onClick={() => setReceiptOpen(!receiptOpen)}
          className="w-full flex items-center justify-between text-left"
        >
          <h3 className="text-lg font-semibold text-primary-400">Request a Tax Receipt <span className="text-purple-400">(Optional)</span></h3>
          <span className={`text-primary-400 transition-transform ${receiptOpen ? 'rotate-180' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </span>
        </button>
        
        {receiptOpen && (
          <div className="mt-4">
            <p className="text-slate-300 text-sm mb-4">
              If you&apos;d like a tax receipt for your donation, please fill out the form below 
              after completing your Cash App payment.
            </p>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-semibold text-primary-400 mb-2">
                    First Name
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
                    Last Name
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

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-primary-400 mb-2">
                  Email
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
                <label htmlFor="donationAmount" className="block text-sm font-semibold text-primary-400 mb-2">
                  Donation Amount
                </label>
                <input
                  type="text"
                  id="donationAmount"
                  placeholder="e.g., $50"
                  {...register('donationAmount', { required: 'Please enter the amount you donated' })}
                  className="w-full px-4 py-2 border border-purple-600/30 bg-slate-700/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-100 placeholder-slate-400"
                />
                {errors.donationAmount && (
                  <p className="mt-1 text-sm text-red-600">{errors.donationAmount.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-primary-400 mb-2">
                  Message (optional)
                </label>
                <textarea
                  id="message"
                  rows={3}
                  {...register('message')}
                  className="w-full px-4 py-2 border border-purple-600/30 bg-slate-700/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-100 placeholder-slate-400"
                  placeholder="Leave a message with your donation..."
                />
              </div>

              <div className="bg-slate-800/50 p-4 rounded-lg border border-purple-500/30">
                <p className="text-sm text-slate-300">
                  ReGarden is a registered 501(c)(3) nonprofit. All donations are tax-deductible.
                  We&apos;ll verify your donation in Cash App and send your receipt via email.
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Request Tax Receipt
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
