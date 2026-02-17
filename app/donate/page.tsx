import Image from 'next/image'
import DonateForm from '@/components/Forms/DonateForm'
import { getContent } from '@/lib/content'
import { assetUrl } from '@/lib/assetUrl'

export default function Donate() {
  const content = getContent()
  const {
    pageTitle,
    heroImage,
    howDonationHelps,
    benefitCards,
    donationSection,
  } = content.donate

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-5xl font-bold text-primary-400 mb-6">{pageTitle}</h1>
      </div>

      <section className="mb-12 relative rounded-lg overflow-hidden">
        {heroImage && (
          <div className="relative min-h-[34vh] w-full md:min-h-0 md:aspect-video overflow-hidden">
            <Image
              src={assetUrl(heroImage)}
              alt="ReGarden community garden"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 896px"
            />
            {/* Mobile: overlay with heading + description only */}
            <div className="md:hidden absolute inset-0 bg-black/30 flex flex-col justify-center items-center text-center p-4 overflow-hidden min-h-0 overscroll-none">
              <h2 className="text-xl font-semibold text-purple-300 mb-1 flex-shrink-0">
                {howDonationHelps.heading}
              </h2>
              <div className="bg-black/30 backdrop-blur-sm p-3 rounded-lg border border-white/10 max-w-2xl min-h-0 overflow-hidden flex-shrink min-w-0">
                <p className="text-white/90 text-sm">{howDonationHelps.description}</p>
              </div>
            </div>
            {/* Desktop: full overlay with heading + description + cards */}
            <div className="hidden md:flex absolute inset-0 bg-black/30 flex-col justify-start items-center text-center p-6 overflow-y-auto">
              <h2 className="text-3xl font-semibold text-purple-300 mb-4">
                {howDonationHelps.heading}
              </h2>
              <div className="bg-black/30 backdrop-blur-sm p-4 rounded-lg border border-white/10 max-w-2xl mb-4">
                <p className="text-white/90">{howDonationHelps.description}</p>
              </div>
              <div className="grid md:grid-cols-3 gap-4 max-w-3xl">
                {benefitCards.map((card, i) => (
                  <div
                    key={i}
                    className="bg-black/30 backdrop-blur-sm p-4 rounded-lg border border-white/10"
                  >
                    <div className="text-3xl mb-2">{card.icon}</div>
                    <h3 className="text-lg font-semibold text-primary-400 mb-1">
                      {card.title}
                    </h3>
                    <p className="text-white/90 text-sm">{card.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {heroImage && (
        <div className="md:hidden mt-4 mb-12">
          <div className="grid grid-cols-1 gap-4 px-4">
            {benefitCards.map((card, i) => (
              <div
                key={i}
                className="bg-black/30 backdrop-blur-sm p-4 rounded-lg border border-white/10 text-center"
              >
                <div className="text-3xl mb-2 flex justify-center">{card.icon}</div>
                <h3 className="text-lg font-semibold text-primary-400 mb-1">
                  {card.title}
                </h3>
                <p className="text-white/90 text-sm">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <section className="bg-slate-700/60 p-8 rounded-lg shadow-lg border border-purple-500/30">
        <h2 className="text-3xl font-semibold text-primary-400 mb-4">
          {donationSection.heading}
        </h2>
        <p className="text-slate-200 mb-6">{donationSection.description}</p>
        <DonateForm />
      </section>
    </div>
  )
}
