import Image from 'next/image'
import TeamMember from '@/components/Team/TeamMember'
import teamData from '@/data/team.json'

export default function Team() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-bold text-primary-400 mb-6">Our Team</h1>
      </div>

      <div className="mb-6 max-w-4xl mx-auto relative">
        <div className="grid grid-cols-3 gap-2 h-64">
          <div className="relative overflow-hidden rounded-lg border border-purple-500/30 shadow-lg">
            <Image
              src="/images/IMG_5675.jpg"
              alt="ReGarden community"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-900/40"></div>
          </div>
          <div className="relative overflow-hidden rounded-lg border border-purple-500/30 shadow-lg">
            <Image
              src="/images/IMG_2359.jpg"
              alt="ReGarden team"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="relative overflow-hidden rounded-lg border border-purple-500/30 shadow-lg">
            <Image
              src="/images/IMG_3671.heic"
              alt="ReGarden garden"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-slate-900/40"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex justify-center">
          <div className="bg-black/40 backdrop-blur-sm p-2 rounded-lg border border-white/10 max-w-xl">
            <p className="text-white/90 text-lg italic text-center">
              &ldquo;Alone we can do so little; together we can do so much.&rdquo;
            </p>
            <p className="text-purple-300 mt-1 text-sm text-right font-semibold">— Helen Keller</p>
          </div>
        </div>
      </div>

      <hr className="border-purple-500/30 my-6" />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teamData.map((member) => (
          <TeamMember key={member.id} member={member} />
        ))}
      </div>

      <section className="mt-16 bg-slate-700/60 p-8 rounded-lg text-center border border-purple-500/30">
        <h2 className="text-3xl font-semibold text-primary-400 mb-4">Join Our Team</h2>
        <p className="text-lg text-slate-200 mb-6">
          Interested in joining ReGarden? We&apos;re always looking for passionate individuals 
          to help us grow our impact. Check out our volunteer opportunities or contact us 
          about employment opportunities.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/volunteer"
            className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Volunteer
          </a>
          <a
            href="mailto:info@regarden.org"
            className="bg-slate-800 text-primary-400 px-8 py-3 rounded-lg font-semibold hover:bg-slate-700/60 transition-colors border-2 border-primary-500"
          >
            Contact Us
          </a>
        </div>
      </section>
    </div>
  )
}
