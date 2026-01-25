import Image from 'next/image'
import TeamMember from '@/components/Team/TeamMember'
import teamData from '@/data/team.json'
import { getContent } from '@/lib/content'

export default function Team() {
  const content = getContent()
  const { pageTitle, quote, galleryImages, joinOurTeam } = content.team

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-bold text-primary-400 mb-6">{pageTitle}</h1>
      </div>

      <div className="mb-6 max-w-4xl mx-auto relative">
        {galleryImages.length > 0 ? (
          <>
            <div className="grid grid-cols-3 gap-2 h-64">
              {galleryImages.map((src, i) => (
                <div
                  key={i}
                  className="relative overflow-hidden rounded-lg border border-purple-500/30 shadow-lg"
                >
                  <Image
                    src={src}
                    alt="ReGarden community"
                    fill
                    className="object-cover"
                    priority={i === 1}
                  />
                  {i === 0 && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-900/40"></div>
                  )}
                  {i === 2 && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-l from-transparent to-slate-900/40"></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </>
                  )}
                </div>
              ))}
            </div>
            {(quote.text || quote.attribution) && (
              <div className="absolute bottom-0 left-0 right-0 flex justify-center max-md:pb-1 md:pb-2 px-2">
                <div className="max-w-xl">
                  {quote.text && (
                    <p className="text-white/90 max-md:text-base md:text-xl italic text-center leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                      &ldquo;{quote.text}&rdquo;
                    </p>
                  )}
                  {quote.attribution && (
                    <p className="text-purple-300 max-md:mt-0 max-md:text-sm md:mt-0.5 md:text-base text-right font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                      {quote.attribution}
                    </p>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          (quote.text || quote.attribution) && (
            <div className="bg-slate-700/60 p-6 rounded-lg border border-purple-500/30">
              {quote.text && (
                <p className="text-white/90 text-lg italic text-center">
                  &ldquo;{quote.text}&rdquo;
                </p>
              )}
              {quote.attribution && (
                <p className="text-purple-300 mt-2 text-sm text-right font-semibold">
                  {quote.attribution}
                </p>
              )}
            </div>
          )
        )}
      </div>

      <hr className="border-purple-500/30 my-6" />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teamData.map((member) => (
          <TeamMember key={member.id} member={member} />
        ))}
      </div>

      <section className="mt-16 bg-slate-700/60 p-8 rounded-lg text-center border border-purple-500/30">
        <h2 className="text-3xl font-semibold text-primary-400 mb-4">
          {joinOurTeam.heading}
        </h2>
        <p className="text-lg text-slate-200 mb-6">{joinOurTeam.text}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/volunteer"
            className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Volunteer
          </a>
          <a
            href={`mailto:${joinOurTeam.contactEmail}`}
            className="bg-slate-800 text-primary-400 px-8 py-3 rounded-lg font-semibold hover:bg-slate-700/60 transition-colors border-2 border-primary-500"
          >
            Contact Us
          </a>
        </div>
      </section>
    </div>
  )
}
