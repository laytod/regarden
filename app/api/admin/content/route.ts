import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth-setup'
import { getContent, updateContent } from '@/lib/content'
import { contentUpdateSchema } from '@/lib/validation'
import type { ContentUpdate } from '@/lib/types'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const content = getContent()
    return NextResponse.json(content)
  } catch (error) {
    console.error('GET /api/admin/content error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = contentUpdateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const update = parsed.data as ContentUpdate
    const content = updateContent(update)
    return NextResponse.json(content)
  } catch (error) {
    if (error instanceof Error && error.message.includes('File system access')) {
      return NextResponse.json(
        { error: 'Content updates not available in this environment' },
        { status: 503 }
      )
    }
    console.error('PUT /api/admin/content error:', error)
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    )
  }
}
