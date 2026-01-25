'use client'

import { useState, useEffect, useCallback } from 'react'
import ContentSection from './ContentSection'
import type { SiteContent } from '@/lib/types'

type PageKey = 'homepage' | 'about' | 'team' | 'volunteer' | 'donate'

const PAGE_LABELS: Record<PageKey, string> = {
  homepage: 'Homepage',
  about: 'About',
  team: 'Team',
  volunteer: 'Volunteer',
  donate: 'Donate',
}

const inputClass =
  'w-full px-4 py-2 rounded-lg border border-purple-600/30 bg-slate-700/60 focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-100 placeholder-slate-400'
const labelClass = 'block text-sm font-medium text-slate-200 mb-1'

function Field({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  multiline?: boolean
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className={inputClass}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        />
      )}
    </div>
  )
}

export default function ContentEditor() {
  const [content, setContent] = useState<SiteContent | null>(null)
  const [status, setStatus] = useState<'loading' | 'idle' | 'saving' | 'error'>('loading')
  const [message, setMessage] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null)
  const [activePage, setActivePage] = useState<PageKey>('homepage')

  const fetchContent = useCallback(async () => {
    setStatus('loading')
    setMessage(null)
    setMessageType(null)
    try {
      const res = await fetch('/api/admin/content')
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to fetch')
      }
      const data = await res.json()
      setContent(data)
      setStatus('idle')
    } catch (e) {
      setStatus('error')
      setMessage(e instanceof Error ? e.message : 'Failed to load content')
      setMessageType('error')
    }
  }, [])

  useEffect(() => {
    fetchContent()
  }, [fetchContent])

  const update = useCallback(
    <K extends keyof SiteContent>(page: K, updater: (prev: SiteContent[K]) => SiteContent[K]) => {
      setContent((prev) => {
        if (!prev) return prev
        return { ...prev, [page]: updater(prev[page]) }
      })
    },
    []
  )

  const save = async () => {
    if (!content) return
    setStatus('saving')
    setMessage(null)
    setMessageType(null)
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Failed to save')
      setContent(data)
      setStatus('idle')
      setMessage('Content saved successfully.')
      setMessageType('success')
      setTimeout(() => {
        setMessage(null)
        setMessageType(null)
      }, 3000)
    } catch (e) {
      setStatus('idle')
      setMessage(e instanceof Error ? e.message : 'Failed to save')
      setMessageType('error')
    }
  }

  if (status === 'loading' && !content) {
    return (
      <div className="text-slate-300 py-8">Loading content…</div>
    )
  }

  if (status === 'error' && !content) {
    return (
      <div>
        <div className="mb-6 px-4 py-3 rounded-lg bg-red-900/50 border border-red-700 text-red-200">
          {message}
        </div>
        <button
          type="button"
          onClick={fetchContent}
          className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-6 py-2 rounded-lg font-medium border border-purple-500/30 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!content) {
    return null
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {(Object.keys(PAGE_LABELS) as PageKey[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setActivePage(key)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activePage === key
                ? 'bg-primary-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-purple-500/30'
            }`}
          >
            {PAGE_LABELS[key]}
          </button>
        ))}
      </div>

      {message && (
        <div
          className={`mb-6 px-4 py-3 rounded-lg ${
            messageType === 'error' || status === 'error'
              ? 'bg-red-900/50 border border-red-700 text-red-200'
              : 'bg-green-900/50 border border-green-700 text-green-200'
          }`}
        >
          {message}
        </div>
      )}

      {activePage === 'homepage' && (
        <>
          <ContentSection title="Hero" description="Main hero section on the homepage">
            <Field
              label="Heading"
              value={content.homepage.hero.heading}
              onChange={(v) =>
                update('homepage', (p) => ({
                  ...p,
                  hero: { ...p.hero, heading: v },
                }))
              }
            />
            <Field
              label="Background image path"
              value={content.homepage.hero.backgroundImage}
              onChange={(v) =>
                update('homepage', (p) => ({
                  ...p,
                  hero: { ...p.hero, backgroundImage: v },
                }))
              }
            />
            <Field
              label="Mission heading"
              value={content.homepage.hero.missionHeading}
              onChange={(v) =>
                update('homepage', (p) => ({
                  ...p,
                  hero: { ...p.hero, missionHeading: v },
                }))
              }
            />
            <Field
              label="Mission text"
              value={content.homepage.hero.missionText}
              onChange={(v) =>
                update('homepage', (p) => ({
                  ...p,
                  hero: { ...p.hero, missionText: v },
                }))
              }
              multiline
            />
          </ContentSection>
          <ContentSection title="Feature cards" description="Three cards below the hero">
            {content.homepage.featureCards.map((card, i) => (
              <div key={i} className="p-4 rounded-lg bg-slate-700/40 border border-purple-500/20">
                <Field
                  label={`Card ${i + 1} icon`}
                  value={card.icon}
                  onChange={(v) =>
                    update('homepage', (p) => {
                      const next = [...p.featureCards]
                      next[i] = { ...next[i], icon: v }
                      return { ...p, featureCards: next }
                    })
                  }
                />
                <Field
                  label={`Card ${i + 1} title`}
                  value={card.title}
                  onChange={(v) =>
                    update('homepage', (p) => {
                      const next = [...p.featureCards]
                      next[i] = { ...next[i], title: v }
                      return { ...p, featureCards: next }
                    })
                  }
                />
                <Field
                  label={`Card ${i + 1} description`}
                  value={card.description}
                  onChange={(v) =>
                    update('homepage', (p) => {
                      const next = [...p.featureCards]
                      next[i] = { ...next[i], description: v }
                      return { ...p, featureCards: next }
                    })
                  }
                  multiline
                />
              </div>
            ))}
          </ContentSection>
          <ContentSection title="Newsletter" description="Newsletter signup section">
            <Field
              label="Heading"
              value={content.homepage.newsletter.heading}
              onChange={(v) =>
                update('homepage', (p) => ({
                  ...p,
                  newsletter: { ...p.newsletter, heading: v },
                }))
              }
            />
            <Field
              label="Description"
              value={content.homepage.newsletter.description}
              onChange={(v) =>
                update('homepage', (p) => ({
                  ...p,
                  newsletter: { ...p.newsletter, description: v },
                }))
              }
              multiline
            />
          </ContentSection>
        </>
      )}

      {activePage === 'about' && (
        <>
          <ContentSection title="Page title">
            <Field
              label="Title"
              value={content.about.pageTitle}
              onChange={(v) => update('about', (p) => ({ ...p, pageTitle: v }))}
            />
          </ContentSection>
          <ContentSection title="Mission">
            <Field
              label="Heading"
              value={content.about.mission.heading}
              onChange={(v) =>
                update('about', (p) => ({
                  ...p,
                  mission: { ...p.mission, heading: v },
                }))
              }
            />
            <Field
              label="Text"
              value={content.about.mission.text}
              onChange={(v) =>
                update('about', (p) => ({
                  ...p,
                  mission: { ...p.mission, text: v },
                }))
              }
              multiline
            />
            <Field
              label="Image path"
              value={content.about.mission.image}
              onChange={(v) =>
                update('about', (p) => ({
                  ...p,
                  mission: { ...p.mission, image: v },
                }))
              }
            />
          </ContentSection>
          <ContentSection title="Vision">
            <Field
              label="Heading"
              value={content.about.vision.heading}
              onChange={(v) =>
                update('about', (p) => ({
                  ...p,
                  vision: { ...p.vision, heading: v },
                }))
              }
            />
            <Field
              label="Text"
              value={content.about.vision.text}
              onChange={(v) =>
                update('about', (p) => ({
                  ...p,
                  vision: { ...p.vision, text: v },
                }))
              }
              multiline
            />
          </ContentSection>
          <ContentSection title="Values">
            <Field
              label="Heading"
              value={content.about.values.heading}
              onChange={(v) =>
                update('about', (p) => ({
                  ...p,
                  values: { ...p.values, heading: v },
                }))
              }
            />
            <Field
              label="Image path"
              value={content.about.values.image}
              onChange={(v) =>
                update('about', (p) => ({
                  ...p,
                  values: { ...p.values, image: v },
                }))
              }
            />
            {content.about.values.cards.map((card, i) => (
              <div key={i} className="p-4 rounded-lg bg-slate-700/40 border border-purple-500/20">
                <Field
                  label={`Value ${i + 1} title`}
                  value={card.title}
                  onChange={(v) =>
                    update('about', (p) => {
                      const next = [...p.values.cards]
                      next[i] = { ...next[i], title: v }
                      return { ...p, values: { ...p.values, cards: next } }
                    })
                  }
                />
                <Field
                  label={`Value ${i + 1} description`}
                  value={card.description}
                  onChange={(v) =>
                    update('about', (p) => {
                      const next = [...p.values.cards]
                      next[i] = { ...next[i], description: v }
                      return { ...p, values: { ...p.values, cards: next } }
                    })
                  }
                  multiline
                />
              </div>
            ))}
          </ContentSection>
          <ContentSection title="Contact">
            <Field
              label="Heading"
              value={content.about.contact.heading}
              onChange={(v) =>
                update('about', (p) => ({
                  ...p,
                  contact: { ...p.contact, heading: v },
                }))
              }
            />
            <Field
              label="Text"
              value={content.about.contact.text}
              onChange={(v) =>
                update('about', (p) => ({
                  ...p,
                  contact: { ...p.contact, text: v },
                }))
              }
              multiline
            />
            <Field
              label="Email"
              value={content.about.contact.email}
              onChange={(v) =>
                update('about', (p) => ({
                  ...p,
                  contact: { ...p.contact, email: v },
                }))
              }
            />
          </ContentSection>
        </>
      )}

      {activePage === 'team' && (
        <>
          <ContentSection title="Page title">
            <Field
              label="Title"
              value={content.team.pageTitle}
              onChange={(v) => update('team', (p) => ({ ...p, pageTitle: v }))}
            />
          </ContentSection>
          <ContentSection title="Quote">
            <Field
              label="Quote text"
              value={content.team.quote.text}
              onChange={(v) =>
                update('team', (p) => ({
                  ...p,
                  quote: { ...p.quote, text: v },
                }))
              }
              multiline
            />
            <Field
              label="Attribution"
              value={content.team.quote.attribution}
              onChange={(v) =>
                update('team', (p) => ({
                  ...p,
                  quote: { ...p.quote, attribution: v },
                }))
              }
            />
          </ContentSection>
          <ContentSection title="Gallery images" description="Three image paths">
            {content.team.galleryImages.map((img, i) => (
              <Field
                key={i}
                label={`Image ${i + 1} path`}
                value={img}
                onChange={(v) =>
                  update('team', (p) => {
                    const next = [...p.galleryImages]
                    next[i] = v
                    return { ...p, galleryImages: next }
                  })
                }
              />
            ))}
          </ContentSection>
          <ContentSection title="Join our team">
            <Field
              label="Heading"
              value={content.team.joinOurTeam.heading}
              onChange={(v) =>
                update('team', (p) => ({
                  ...p,
                  joinOurTeam: { ...p.joinOurTeam, heading: v },
                }))
              }
            />
            <Field
              label="Text"
              value={content.team.joinOurTeam.text}
              onChange={(v) =>
                update('team', (p) => ({
                  ...p,
                  joinOurTeam: { ...p.joinOurTeam, text: v },
                }))
              }
              multiline
            />
            <Field
              label="Contact email"
              value={content.team.joinOurTeam.contactEmail}
              onChange={(v) =>
                update('team', (p) => ({
                  ...p,
                  joinOurTeam: { ...p.joinOurTeam, contactEmail: v },
                }))
              }
            />
          </ContentSection>
        </>
      )}

      {activePage === 'volunteer' && (
        <>
          <ContentSection title="Header">
            <Field
              label="Page title"
              value={content.volunteer.pageTitle}
              onChange={(v) => update('volunteer', (p) => ({ ...p, pageTitle: v }))}
            />
            <Field
              label="Subtitle"
              value={content.volunteer.subtitle}
              onChange={(v) => update('volunteer', (p) => ({ ...p, subtitle: v }))}
            />
            <Field
              label="Description"
              value={content.volunteer.description}
              onChange={(v) => update('volunteer', (p) => ({ ...p, description: v }))}
              multiline
            />
            <Field
              label="Background image path"
              value={content.volunteer.backgroundImage}
              onChange={(v) => update('volunteer', (p) => ({ ...p, backgroundImage: v }))}
            />
          </ContentSection>
          <ContentSection title="Ways to volunteer">
            <Field
              label="Heading"
              value={content.volunteer.waysToVolunteer.heading}
              onChange={(v) =>
                update('volunteer', (p) => ({
                  ...p,
                  waysToVolunteer: { ...p.waysToVolunteer, heading: v },
                }))
              }
            />
            {content.volunteer.waysToVolunteer.cards.map((card, i) => (
              <div key={i} className="p-4 rounded-lg bg-slate-700/40 border border-purple-500/20">
                <Field
                  label={`Card ${i + 1} title`}
                  value={card.title}
                  onChange={(v) =>
                    update('volunteer', (p) => {
                      const next = [...p.waysToVolunteer.cards]
                      next[i] = { ...next[i], title: v }
                      return { ...p, waysToVolunteer: { ...p.waysToVolunteer, cards: next } }
                    })
                  }
                />
                <Field
                  label={`Card ${i + 1} description`}
                  value={card.description}
                  onChange={(v) =>
                    update('volunteer', (p) => {
                      const next = [...p.waysToVolunteer.cards]
                      next[i] = { ...next[i], description: v }
                      return { ...p, waysToVolunteer: { ...p.waysToVolunteer, cards: next } }
                    })
                  }
                />
              </div>
            ))}
          </ContentSection>
          <ContentSection title="Contact coordinator">
            <Field
              label="Heading"
              value={content.volunteer.contactCoordinator.heading}
              onChange={(v) =>
                update('volunteer', (p) => ({
                  ...p,
                  contactCoordinator: { ...p.contactCoordinator, heading: v },
                }))
              }
            />
            <Field
              label="Text"
              value={content.volunteer.contactCoordinator.text}
              onChange={(v) =>
                update('volunteer', (p) => ({
                  ...p,
                  contactCoordinator: { ...p.contactCoordinator, text: v },
                }))
              }
              multiline
            />
            <Field
              label="Name"
              value={content.volunteer.contactCoordinator.name}
              onChange={(v) =>
                update('volunteer', (p) => ({
                  ...p,
                  contactCoordinator: { ...p.contactCoordinator, name: v },
                }))
              }
            />
            <Field
              label="Email"
              value={content.volunteer.contactCoordinator.email}
              onChange={(v) =>
                update('volunteer', (p) => ({
                  ...p,
                  contactCoordinator: { ...p.contactCoordinator, email: v },
                }))
              }
            />
          </ContentSection>
          <ContentSection title="Apply section">
            <Field
              label="Heading"
              value={content.volunteer.applySection.heading}
              onChange={(v) =>
                update('volunteer', (p) => ({
                  ...p,
                  applySection: { ...p.applySection, heading: v },
                }))
              }
            />
            <Field
              label="Description"
              value={content.volunteer.applySection.description}
              onChange={(v) =>
                update('volunteer', (p) => ({
                  ...p,
                  applySection: { ...p.applySection, description: v },
                }))
              }
              multiline
            />
          </ContentSection>
        </>
      )}

      {activePage === 'donate' && (
        <>
          <ContentSection title="Header">
            <Field
              label="Page title"
              value={content.donate.pageTitle}
              onChange={(v) => update('donate', (p) => ({ ...p, pageTitle: v }))}
            />
            <Field
              label="Hero image path"
              value={content.donate.heroImage}
              onChange={(v) => update('donate', (p) => ({ ...p, heroImage: v }))}
            />
          </ContentSection>
          <ContentSection title="How your donation helps">
            <Field
              label="Heading"
              value={content.donate.howDonationHelps.heading}
              onChange={(v) =>
                update('donate', (p) => ({
                  ...p,
                  howDonationHelps: { ...p.howDonationHelps, heading: v },
                }))
              }
            />
            <Field
              label="Description"
              value={content.donate.howDonationHelps.description}
              onChange={(v) =>
                update('donate', (p) => ({
                  ...p,
                  howDonationHelps: { ...p.howDonationHelps, description: v },
                }))
              }
              multiline
            />
          </ContentSection>
          <ContentSection title="Benefit cards">
            {content.donate.benefitCards.map((card, i) => (
              <div key={i} className="p-4 rounded-lg bg-slate-700/40 border border-purple-500/20">
                <Field
                  label={`Card ${i + 1} icon`}
                  value={card.icon}
                  onChange={(v) =>
                    update('donate', (p) => {
                      const next = [...p.benefitCards]
                      next[i] = { ...next[i], icon: v }
                      return { ...p, benefitCards: next }
                    })
                  }
                />
                <Field
                  label={`Card ${i + 1} title`}
                  value={card.title}
                  onChange={(v) =>
                    update('donate', (p) => {
                      const next = [...p.benefitCards]
                      next[i] = { ...next[i], title: v }
                      return { ...p, benefitCards: next }
                    })
                  }
                />
                <Field
                  label={`Card ${i + 1} description`}
                  value={card.description}
                  onChange={(v) =>
                    update('donate', (p) => {
                      const next = [...p.benefitCards]
                      next[i] = { ...next[i], description: v }
                      return { ...p, benefitCards: next }
                    })
                  }
                  multiline
                />
              </div>
            ))}
          </ContentSection>
          <ContentSection title="Donation section">
            <Field
              label="Heading"
              value={content.donate.donationSection.heading}
              onChange={(v) =>
                update('donate', (p) => ({
                  ...p,
                  donationSection: { ...p.donationSection, heading: v },
                }))
              }
            />
            <Field
              label="Description"
              value={content.donate.donationSection.description}
              onChange={(v) =>
                update('donate', (p) => ({
                  ...p,
                  donationSection: { ...p.donationSection, description: v },
                }))
              }
              multiline
            />
          </ContentSection>
        </>
      )}

      <div className="mt-8 flex gap-4">
        <button
          type="button"
          onClick={save}
          disabled={status === 'saving'}
          className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          {status === 'saving' ? 'Saving…' : 'Save changes'}
        </button>
        <button
          type="button"
          onClick={fetchContent}
          disabled={status === 'saving'}
          className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-slate-200 px-6 py-2 rounded-lg font-medium border border-purple-500/30 transition-colors"
        >
          Reload
        </button>
      </div>
    </div>
  )
}
