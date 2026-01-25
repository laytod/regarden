import Image from 'next/image'
import DonateForm from '@/components/Forms/DonateForm'

export default function Donate() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-5xl font-bold text-primary-400 mb-6">Support ReGarden</h1>
      </div>

      <section className="mb-12 relative rounded-lg overflow-hidden">
        <Image
          src="/images/IMG_2592.jpeg"
          alt="ReGarden community garden"
          width={896}
          height={504}
          className="w-full h-auto object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30 flex flex-col justify-start items-center text-center p-6">
          <h2 className="text-3xl font-semibold text-purple-300 mb-4">How Your Donation Helps</h2>
          <div className="bg-black/30 backdrop-blur-sm p-6 rounded-lg border border-white/10 max-w-2xl mb-6">
            <p className="text-white/90">
              Your donation helps us maintain community gardens, provide educational workshops, 
              and create accessible green spaces for everyone. Every contribution makes a difference 
              in growing a stronger, greener community.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4 max-w-3xl">
            <div className="bg-black/30 backdrop-blur-sm p-4 rounded-lg border border-white/10">
              <div className="text-3xl mb-2">🌱</div>
              <h3 className="text-lg font-semibold text-primary-400 mb-1">Garden Maintenance</h3>
              <p className="text-white/90 text-sm">
                Tools, seeds, soil, compost, and infrastructure for our 15+ community gardens
              </p>
            </div>
            <div className="bg-black/30 backdrop-blur-sm p-4 rounded-lg border border-white/10">
              <div className="text-3xl mb-2">🎓</div>
              <h3 className="text-lg font-semibold text-primary-400 mb-1">Education Programs</h3>
              <p className="text-white/90 text-sm">
                Workshops, classes, and resources to teach sustainable gardening practices
              </p>
            </div>
            <div className="bg-black/30 backdrop-blur-sm p-4 rounded-lg border border-white/10">
              <div className="text-3xl mb-2">👥</div>
              <h3 className="text-lg font-semibold text-primary-400 mb-1">Community Events</h3>
              <p className="text-white/90 text-sm">
                Community gatherings, celebrations, and neighborhood-building activities
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-700/60 p-8 rounded-lg shadow-lg border border-purple-500/30">
        <h2 className="text-3xl font-semibold text-primary-400 mb-4">Make a Donation</h2>
        <p className="text-slate-200 mb-6">
          We accept donations through Cash App. Simply send your contribution using the button below 
          and help us grow a greener community. Any amount makes a difference! After donating, you can 
          optionally fill out the form to receive a tax receipt.
        </p>
        <DonateForm />
      </section>
    </div>
  )
}
