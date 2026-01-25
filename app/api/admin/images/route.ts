import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth-setup'
import {
  listImages,
  saveImage,
  deleteImage,
  validateImageFile,
  isAllowedImagePath,
} from '@/lib/images'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const images = listImages()
    return NextResponse.json({ images })
  } catch (error) {
    if (error instanceof Error && error.message.includes('File system access')) {
      return NextResponse.json(
        { error: 'Image listing not available in this environment' },
        { status: 503 }
      )
    }
    console.error('GET /api/admin/images error:', error)
    return NextResponse.json(
      { error: 'Failed to list images' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file')
    const subfolder = (formData.get('subfolder') as string) || undefined

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'No file provided. Use form field "file".' },
        { status: 400 }
      )
    }

    const validation = validateImageFile({ type: file.type, size: file.size })
    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const path = saveImage(buffer, file.type, subfolder)
    return NextResponse.json({ path })
  } catch (error) {
    if (error instanceof Error && error.message.includes('File system access')) {
      return NextResponse.json(
        { error: 'Image upload not available in this environment' },
        { status: 503 }
      )
    }
    console.error('POST /api/admin/images error:', error)
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const { path: webPath } = body as { path?: string }

    if (!webPath || typeof webPath !== 'string') {
      return NextResponse.json(
        { error: 'Missing "path" in request body' },
        { status: 400 }
      )
    }

    if (!isAllowedImagePath(webPath)) {
      return NextResponse.json(
        { error: 'Invalid or disallowed image path' },
        { status: 400 }
      )
    }

    deleteImage(webPath)
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('File system access')) {
        return NextResponse.json(
          { error: 'Image delete not available in this environment' },
          { status: 503 }
        )
      }
      if (error.message === 'Image not found') {
        return NextResponse.json({ error: 'Image not found' }, { status: 404 })
      }
      if (error.message.includes('Invalid or disallowed')) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        )
      }
    }
    console.error('DELETE /api/admin/images error:', error)
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    )
  }
}
