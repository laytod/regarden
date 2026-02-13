import { auth } from '@/lib/auth-setup'
import { redirect } from 'next/navigation'
import ContentEditor from '@/components/Admin/ContentEditor'

export default async function AdminContentPage() {
  const session = await auth()
  if (!session) {
    redirect('/admin/login')
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary-400 mb-2">
          Content Management
        </h1>
        <p className="text-slate-300">
          Edit headings, text blocks, and page content. Changes appear on the
          site immediately after saving.
        </p>
      </div>
      <ContentEditor />
    </div>
  )
}
