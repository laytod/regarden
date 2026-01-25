import Link from 'next/link'
import NewsletterSignup from '@/components/Forms/NewsletterSignup'

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 border-b border-purple-800/30 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/background/page1-003.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        {/* Light overlay for text readability */}
        <div className="absolute inset-0 z-0 bg-slate-900/50"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-primary-400 mb-6 drop-shadow-lg">
              Growing Gardens Growing Communities
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
            <h2 className="text-4xl font-bold text-purple-300 mb-4 drop-shadow-lg">Our Mission</h2>
            <p className="text-xl text-slate-200 max-w-3xl mx-auto drop-shadow-md">
              To provide opportunities for local residents to garden, grow, and harvest produce, 
              to promote education about sustainable local food production and gardening techniques 
              as well as offer educational workshops for all ages on topics such as nutrition and 
              healthy food preparation.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="text-center p-6 bg-slate-700/60 rounded-lg border border-purple-500/30">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-xl font-semibold text-primary-400 mb-2">Community Gardens</h3>
              <p className="text-slate-200">
                From saved seeds to community harvests, building food security together—from the ground up.
              </p>
            </div>
            <div className="text-center p-6 bg-slate-700/60 rounded-lg border border-purple-500/30">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-semibold text-purple-300 mb-2">Education</h3>
              <p className="text-slate-200">
                Our workshops and programs teach sustainable gardening practices to people 
                of all ages and skill levels.
              </p>
            </div>
            <div className="text-center p-6 bg-slate-700/60 rounded-lg border border-purple-500/30">
              <div className="text-4xl mb-4">❤️</div>
              <h3 className="text-xl font-semibold text-primary-400 mb-2">Community</h3>
              <p className="text-slate-200">
                We bring neighbors together, building stronger communities through shared 
                experiences in the garden.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-700/60 p-8 rounded-lg shadow-lg border border-purple-500/30">
            <h2 className="text-3xl font-bold text-purple-300 mb-4 text-center">
              Stay Updated
            </h2>
            <p className="text-slate-200 text-center mb-6">
              Subscribe to our newsletter to receive updates about events, workshops, and 
              ways to get involved.
            </p>
            <NewsletterSignup />
          </div>
        </div>
      </section>
    </div>
  )
}
