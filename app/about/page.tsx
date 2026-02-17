import Image from 'next/image'
import { getContent } from '@/lib/content'
import { assetUrl } from '@/lib/assetUrl'

export default function About() {
  const content = getContent()
  const { pageTitle, mission, vision, values, contact } = content.about

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-bold text-primary-400 mb-6">{pageTitle}</h1>
      </div>

      <section className="mb-12 relative h-72 sm:h-80 md:h-96 rounded-lg overflow-hidden">
        {mission.image && (
          <>
            <Image
              src={assetUrl(mission.image)}
              alt="ReGarden community members at the garden"
              fill
              className="object-cover object-[center_75%] md:object-center scale-[1.6] md:scale-100 origin-[center_75%] md:origin-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />
          </>
        )}
        <div className="absolute top-1/3 md:top-auto bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 flex flex-col justify-end">
          <h2 className="text-2xl sm:text-3xl font-semibold text-primary-400 mb-2 sm:mb-4">
            {mission.heading}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-slate-200 leading-relaxed">
            {mission.text}
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold text-primary-400 mb-4">
          {vision.heading}
        </h2>
        <p className="text-lg text-slate-200 mb-4 leading-relaxed">
          {vision.text}
        </p>
      </section>

      <section className="mb-12 relative rounded-lg overflow-hidden">
        {values.image && (
          <>
            <Image
              src={assetUrl(values.image)}
              alt="Sunflower from ReGarden"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-slate-900/40"></div>
          </>
        )}
        <div className="relative p-8">
          <h2 className="text-3xl font-semibold text-primary-400 mb-4">
            {values.heading}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {values.cards.map((card, i) => (
              <div
                key={i}
                className="p-6 bg-slate-900/40 border-l-4 border-primary-500 rounded shadow-sm border border-purple-500/30 backdrop-blur-sm"
              >
                <h3 className="text-xl font-semibold text-primary-400 mb-2">
                  {card.title}
                </h3>
                <p className="text-slate-200">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-700/60 p-8 rounded-lg border border-purple-500/30">
        <h2 className="text-3xl font-semibold text-primary-400 mb-4">
          {contact.heading}
        </h2>
        <p className="text-lg text-slate-200 mb-4">{contact.text}</p>
        {contact.email && (
          <div className="space-y-2 text-slate-200">
            <p>
              <strong>Email:</strong>{' '}
              <a
                href={`mailto:${contact.email}`}
                className="text-primary-400 hover:text-primary-300"
              >
                {contact.email}
              </a>
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
