import Image from 'next/image'

interface TeamMemberProps {
  member: {
    id: string
    name: string
    role: string
    email: string
    phone: string
    bio: string
    image: string
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
      <div className="relative h-64 w-full bg-purple-900/40 border-y border-purple-500/30 overflow-hidden">
        <Image
          src={member.image}
          alt={`${member.name} - ${member.role}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-6">
        <p className="text-slate-200 mb-6 leading-relaxed">{member.bio}</p>
        
        <div className="border-t border-purple-500/30 pt-4">
          <h4 className="text-sm font-semibold text-purple-300 mb-3">Contact Information</h4>
          <div className="space-y-2 text-sm text-slate-200">
            <div className="flex items-center">
              <span className="mr-2">📧</span>
              <a 
                href={`mailto:${member.email}`}
                className="hover:text-primary-400 transition-colors text-primary-400"
              >
                {member.email}
              </a>
            </div>
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
      </div>
    </div>
  )
}
