'use client'

interface ContentSectionProps {
  title: string
  description?: string
  children: React.ReactNode
}

export default function ContentSection({
  title,
  description,
  children,
}: ContentSectionProps) {
  return (
    <section className="bg-slate-800 p-6 rounded-lg border border-purple-500/30 mb-6">
      <h3 className="text-xl font-semibold text-primary-400 mb-2">{title}</h3>
      {description && (
        <p className="text-slate-400 text-sm mb-4">{description}</p>
      )}
      <div className="space-y-4">{children}</div>
    </section>
  )
}
