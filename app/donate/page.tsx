import Image from 'next/image'
import DonateForm from '@/components/Forms/DonateForm'
import { getContent } from '@/lib/content'

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
          <>
            <Image
              src={heroImage}
              alt="ReGarden community garden"
              width={896}
              height={504}
              className="w-full h-auto object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/30 flex flex-col justify-start items-center text-center p-6">
              <h2 className="text-3xl font-semibold text-purple-300 mb-4">
                {howDonationHelps.heading}
              </h2>
              <div className="bg-black/30 backdrop-blur-sm p-6 rounded-lg border border-white/10 max-w-2xl mb-6">
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
          </>
        )}
      </section>

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
