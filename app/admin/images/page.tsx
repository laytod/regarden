import { auth } from '@/lib/auth-setup'
import { redirect } from 'next/navigation'
import ImageManager from '@/components/Admin/ImageManager'

export default async function AdminImagesPage() {
  const session = await auth()
  if (!session) {
    redirect('/admin/login')
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary-400 mb-2">
          Image Management
        </h1>
        <p className="text-slate-300">
          Upload, preview, and delete images. Use the content editor to assign
          images to pages.
        </p>
      </div>
      <ImageManager />
    </div>
  )
}
