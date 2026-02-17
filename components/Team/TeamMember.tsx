import Image from 'next/image'
import { assetUrl } from '@/lib/assetUrl'

interface TeamMemberProps {
  member: {
    id: string
    name: string
    role: string
    email: string
    phone: string
    bio: string
    image: string
    imagePosition?: 'top' | 'center' | 'bottom' | string
    socialLinks?: {
      linkedin?: string
      twitter?: string
      instagram?: string
      email?: string
    }
  }
}

export default function TeamMember({ member }: TeamMemberProps) {
  return (
    <div className="bg-slate-700/60 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-purple-500/30">
      <div className="p-4 pb-2">
        <h3 className="text-2xl font-bold text-primary-400 mb-1">{member.name}</h3>
        <p className="text-purple-300 font-semibold">{member.role}</p>
      </div>
      <div className="relative h-80 w-full bg-purple-900/40 border-y border-purple-500/30 overflow-hidden">
        <Image
          src={assetUrl(member.image)}
          alt={`${member.name} - ${member.role}`}
          fill
          className={`object-cover ${member.imagePosition === 'top' ? 'object-top' : member.imagePosition === 'bottom' ? 'object-bottom' : ''}`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-6">
        <details className="group mb-6">
          <summary className="list-none cursor-pointer flex items-center justify-between gap-2 text-primary-400 hover:text-primary-300 font-semibold transition-colors py-1 -mx-1 px-1 rounded focus:outline-none focus:ring-2 focus:ring-primary-400/50">
            <span>Read bio</span>
            <svg className="w-4 h-4 shrink-0 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <p className="text-slate-200 mt-3 leading-relaxed pl-0">{member.bio}</p>
        </details>

        {member.name !== 'Tricia' && (
        <div className="border-t border-purple-500/30 pt-4">
          <h4 className="text-sm font-semibold text-purple-300 mb-3">Contact Information</h4>
          <div className="space-y-2 text-sm text-slate-200">
            {member.email && (
              <div className="flex items-center">
                <span className="mr-2">📧</span>
                <a
                  href={`mailto:${member.email}`}
                  className="text-primary-400 hover:text-primary-300 transition-colors"
                >
                  {member.email}
                </a>
              </div>
            )}
            {member.phone && (
              <div className="flex items-center">
                <span className="mr-2">📞</span>
                <a 
                  href={`tel:${member.phone}`}
                  className="hover:text-primary-400 transition-colors text-primary-400"
                >
                  {member.phone}
                </a>
              </div>
            )}
          </div>

          {member.socialLinks && (
            <div className="mt-4 flex space-x-4">
              {member.socialLinks.linkedin && (
                <a
                  href={member.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-400 hover:text-primary-400 transition-colors"
                  aria-label="LinkedIn"
                >
                  <span className="text-sm font-semibold">LinkedIn</span>
                </a>
              )}
              {member.socialLinks.twitter && (
                <a
                  href={`https://twitter.com/${member.socialLinks.twitter.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-400 hover:text-primary-400 transition-colors"
                  aria-label="Twitter"
                >
                  <span className="text-sm font-semibold">Twitter</span>
                </a>
              )}
              {member.socialLinks.instagram && (
                <a
                  href={`https://instagram.com/${member.socialLinks.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-400 hover:text-primary-400 transition-colors"
                  aria-label="Instagram"
                >
                  <span className="text-sm font-semibold">Instagram</span>
                </a>
              )}
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  )
}
