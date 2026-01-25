import VolunteerForm from '@/components/Forms/VolunteerForm'

export default function Volunteer() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <h1 className="text-5xl font-bold text-primary-400 mb-2 text-center">Volunteer with ReGarden</h1>
        <p className="text-xl text-slate-300 mb-6 text-center">No experience necessary—we&apos;ll teach you everything you need to know!</p>
        <p className="text-slate-200 text-lg">
          Volunteers are the heart of ReGarden. Join us in creating and maintaining community 
          gardens, organizing events, and growing a stronger community together.
        </p>
      </div>

      <section className="mb-12 relative rounded-lg overflow-hidden">
        <img
          src="/images/IMG_5804.jpg"
          alt="Sunflowers in the ReGarden community garden"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-slate-900/50"></div>
        <div className="relative p-8">
          <h2 className="text-3xl font-semibold text-green-400 mb-4">Ways to Volunteer</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-4 bg-black/30 rounded-lg border border-white/10 backdrop-blur-sm">
              <h3 className="text-purple-300 font-semibold text-lg mb-1">Garden Work</h3>
              <p className="text-white/90 text-sm">Planting, weeding, watering, and harvesting</p>
            </div>
            <div className="p-4 bg-black/30 rounded-lg border border-white/10 backdrop-blur-sm">
              <h3 className="text-purple-300 font-semibold text-lg mb-1">Education & Events</h3>
              <p className="text-white/90 text-sm">Lead workshops or help organize events</p>
            </div>
            <div className="p-4 bg-black/30 rounded-lg border border-white/10 backdrop-blur-sm">
              <h3 className="text-purple-300 font-semibold text-lg mb-1">Community Leadership</h3>
              <p className="text-white/90 text-sm">Coordinate a garden site or become a neighborhood ambassador</p>
            </div>
            <div className="p-4 bg-black/30 rounded-lg border border-white/10 backdrop-blur-sm">
              <h3 className="text-purple-300 font-semibold text-lg mb-1">Administration</h3>
              <p className="text-white/90 text-sm">Communications, social media, and fundraising</p>
            </div>
          </div>
          <div className="p-6 bg-black/30 rounded-lg border border-white/10 backdrop-blur-sm mt-6">
            <h2 className="text-2xl font-semibold text-green-400 mb-2">Contact Our Volunteer Coordinator</h2>
            <p className="text-white/90 mb-2">
              Questions about volunteering? Want to schedule a group volunteer day?
            </p>
            <p className="text-white/90">
              <strong>Katie</strong> — <a href="mailto:katieomartinek@gmail.com" className="text-primary-400 hover:text-primary-300">katieomartinek@gmail.com</a>
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-700/60 p-8 rounded-lg shadow-lg border border-purple-500/30">
        <h2 className="text-3xl font-semibold text-primary-400 mb-4">Apply to Volunteer</h2>
        <p className="text-slate-200 mb-4">
          Fill out the form below to get started.
        </p>
        <VolunteerForm />
      </section>
    </div>
  )
}
