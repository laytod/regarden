export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-bold text-primary-400 mb-6">About ReGarden</h1>
      </div>

      <section className="mb-12 relative rounded-lg overflow-hidden">
        <img
          src="/images/IMG_0857.jpg"
          alt="ReGarden community members at the garden"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent"></div>
        <div className="relative flex flex-col justify-end min-h-80 p-8">
          <h2 className="text-3xl font-semibold text-primary-400 mb-4">Our Mission</h2>
          <p className="text-lg text-slate-200 leading-relaxed">
            To provide opportunities for local residents to garden, grow, and harvest produce, 
            to promote education about sustainable local food production and gardening techniques 
            as well as offer educational workshops for all ages on topics such as nutrition and 
            healthy food preparation.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold text-primary-400 mb-4">Our Vision</h2>
        <p className="text-lg text-slate-200 mb-4 leading-relaxed">
          We envision a city where every neighborhood has access to community gardens, 
          where sustainable gardening practices are widely understood and practiced, and 
          where communities are strengthened through shared experiences of growing food together.
        </p>
      </section>

      <section className="mb-12 relative rounded-lg overflow-hidden">
        <img
          src="/images/IMG_5563.jpg"
          alt="Sunflower from ReGarden"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/40"></div>
        <div className="relative p-8">
          <h2 className="text-3xl font-semibold text-primary-400 mb-4">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-slate-900/40 border-l-4 border-primary-500 rounded shadow-sm border border-purple-500/30 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-primary-400 mb-2">Community First</h3>
              <p className="text-slate-200">
                We believe that strong communities are built through shared experiences and 
                mutual support. Our gardens are spaces where neighbors become friends.
              </p>
            </div>
            <div className="p-6 bg-slate-900/40 border-l-4 border-primary-500 rounded shadow-sm border border-purple-500/30 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-primary-400 mb-2">Sustainability</h3>
              <p className="text-slate-200">
                We practice and teach environmentally responsible gardening methods that 
                protect our soil, water, and ecosystems for future generations.
              </p>
            </div>
            <div className="p-6 bg-slate-900/40 border-l-4 border-primary-500 rounded shadow-sm border border-purple-500/30 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-primary-400 mb-2">Accessibility</h3>
              <p className="text-slate-200">
                Everyone should have access to fresh produce and green spaces. We work to 
                remove barriers and create inclusive garden communities.
              </p>
            </div>
            <div className="p-6 bg-slate-900/40 border-l-4 border-primary-500 rounded shadow-sm border border-purple-500/30 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-primary-400 mb-2">Education</h3>
              <p className="text-slate-200">
                We believe in lifelong learning and sharing knowledge. Our workshops and 
                programs welcome gardeners of all skill levels.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-700/60 p-8 rounded-lg border border-purple-500/30">
        <h2 className="text-3xl font-semibold text-primary-400 mb-4">Contact Us</h2>
        <p className="text-lg text-slate-200 mb-4">
          Have questions about ReGarden or want to get involved? We&apos;d love to hear from you!
        </p>
        <div className="space-y-2 text-slate-200">
          <p><strong>Email:</strong> <a href="mailto:katieomartinek@gmail.com" className="text-primary-400 hover:text-primary-300">katieomartinek@gmail.com</a></p>
        </div>
      </section>
    </div>
  )
}
