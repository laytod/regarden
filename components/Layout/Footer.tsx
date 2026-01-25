import Link from 'next/link'
import Image from 'next/image'
import NewsletterSignup from '@/components/Forms/NewsletterSignup'

export default function Footer() {
  return (
    <footer className="bg-slate-800 text-white mt-16 border-t border-purple-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center mb-4">
              <div className="relative h-20 w-20 mr-3 bg-white rounded-lg overflow-hidden">
                <Image
                  src="/images/logo/87B90DB6-993E-4834-A266-4D5A127B6B9E.png"
                  alt="ReGarden Logo"
                  fill
                  className="object-contain rounded-md scale-125"
                  sizes="80px"
                />
              </div>
            </div>
            <p className="text-slate-300 text-sm">
              Connecting communities through sustainable gardening and green spaces. 
              Join us in growing a greener future.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-slate-300 hover:text-primary-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-slate-300 hover:text-white transition-colors">
                  Our Team
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-slate-300 hover:text-white transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/volunteer" className="text-slate-300 hover:text-white transition-colors">
                  Volunteer
                </Link>
              </li>
              <li>
                <Link href="/donate" className="text-slate-300 hover:text-white transition-colors">
                  Donate
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Connected</h3>
            <NewsletterSignup />
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-purple-800/30">
          <p className="text-slate-400 text-sm text-center">
            © {new Date().getFullYear()} ReGarden. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
