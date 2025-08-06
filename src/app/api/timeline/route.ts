import { NextResponse } from 'next/server'
import { getAllTimelineEntries } from '@/lib/timeline'

export async function GET() {
  try {
    const entries = await getAllTimelineEntries()
    return NextResponse.json({ entries })
  } catch (error) {
    console.error('Error fetching timeline entries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch timeline entries' },
      { status: 500 }
    )
  }
} 