import Image from 'next/image'
import VolunteerForm from '@/components/Forms/VolunteerForm'
import { getContent } from '@/lib/content'

export default function Volunteer() {
  const content = getContent()
  const {
    pageTitle,
    subtitle,
    description,
    backgroundImage,
    waysToVolunteer,
    contactCoordinator,
    applySection,
  } = content.volunteer

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <h1 className="text-5xl font-bold text-primary-400 mb-2 text-center">
          {pageTitle}
        </h1>
        {subtitle && (
          <p className="text-xl text-slate-300 mb-6 text-center">{subtitle}</p>
        )}
        <p className="text-slate-200 text-lg">{description}</p>
      </div>

      <section className="mb-12 relative rounded-lg overflow-hidden">
        {backgroundImage && (
          <>
            <Image
              src={backgroundImage}
              alt="Sunflowers in the ReGarden community garden"
              fill
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-slate-900/50"></div>
          </>
        )}
        <div className="relative p-8">
          <h2 className="text-3xl font-semibold text-green-400 mb-4">
            {waysToVolunteer.heading}
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {waysToVolunteer.cards.map((card, i) => (
              <div
                key={i}
                className="p-4 bg-black/30 rounded-lg border border-white/10 backdrop-blur-sm"
              >
                <h3 className="text-purple-300 font-semibold text-lg mb-1">
                  {card.title}
                </h3>
                <p className="text-white/90 text-sm">{card.description}</p>
              </div>
            ))}
          </div>
          <div className="p-6 bg-black/30 rounded-lg border border-white/10 backdrop-blur-sm mt-6">
            <h2 className="text-2xl font-semibold text-green-400 mb-2">
              {contactCoordinator.heading}
            </h2>
            <p className="text-white/90 mb-2">{contactCoordinator.text}</p>
            {contactCoordinator.name && contactCoordinator.email && (
              <p className="text-white/90">
                <strong>{contactCoordinator.name}</strong> —{' '}
                <a
                  href={`mailto:${contactCoordinator.email}`}
                  className="text-primary-400 hover:text-primary-300"
                >
                  {contactCoordinator.email}
                </a>
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="bg-slate-700/60 p-8 rounded-lg shadow-lg border border-purple-500/30">
        <h2 className="text-3xl font-semibold text-primary-400 mb-4">
          {applySection.heading}
        </h2>
        <p className="text-slate-200 mb-4">{applySection.description}</p>
        <VolunteerForm />
      </section>
    </div>
  )
}
