import Image from 'next/image'
import Link from 'next/link'
import { getContent } from '@/lib/content'
import { assetUrl } from '@/lib/assetUrl'

export default function Home() {
  const content = getContent()
  const { hero, featureCards } = content.homepage

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 border-b border-purple-800/30 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={assetUrl(hero.backgroundImage)}
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 z-0 bg-slate-900/50"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-primary-400 mb-6 drop-shadow-lg">
              {hero.heading}
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Link
                href="/volunteer"
                className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-lg"
              >
                Get Involved
              </Link>
              <Link
                href="/donate"
                className="bg-purple-900/60 text-purple-200 px-8 py-3 rounded-lg font-semibold hover:bg-purple-800/60 transition-colors border-2 border-purple-400"
              >
                Support Our Mission
              </Link>
            </div>
            <h2 className="text-4xl font-bold text-purple-300 mb-4 drop-shadow-lg">
              {hero.missionHeading}
            </h2>
            <p className="text-xl text-slate-200 max-w-3xl mx-auto drop-shadow-md">
              {hero.missionText}
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {featureCards.map((card, i) => (
              <div
                key={i}
                className="text-center p-6 bg-slate-700/60 rounded-lg border border-purple-500/30"
              >
                <div className="text-4xl mb-4">{card.icon}</div>
                <h3 className="text-xl font-semibold text-primary-400 mb-2">
                  {card.title}
                </h3>
                <p className="text-slate-200">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
