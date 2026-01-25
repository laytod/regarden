import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const dataFilePath = path.join(process.cwd(), 'data', 'events.json')

export const runtime = 'nodejs'

// Helper function to read events from file
function readEvents() {
  try {
    const fileContents = fs.readFileSync(dataFilePath, 'utf8')
    return JSON.parse(fileContents)
  } catch (error) {
    return []
  }
}

// Helper function to write events to file
function writeEvents(events: any[]) {
  fs.writeFileSync(dataFilePath, JSON.stringify(events, null, 2))
}

// GET all events
export async function GET() {
  try {
    const events = readEvents()
    return NextResponse.json(events)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}

// POST create new event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const events = readEvents()
    
    const newEvent = {
      id: Date.now().toString(),
      ...body,
    }
    
    events.push(newEvent)
    writeEvents(events)
    
    return NextResponse.json(newEvent, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}

// PUT update event
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const events = readEvents()
    
    const index = events.findIndex((e: any) => e.id === body.id)
    if (index === -1) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }
    
    events[index] = body
    writeEvents(events)
    
    return NextResponse.json(events[index])
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 })
  }
}

// DELETE event
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Event ID required' }, { status: 400 })
    }
    
    const events = readEvents()
    const filteredEvents = events.filter((e: any) => e.id !== id)
    
    if (events.length === filteredEvents.length) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }
    
    writeEvents(filteredEvents)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 })
  }
}
