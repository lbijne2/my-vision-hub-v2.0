import { NextRequest, NextResponse } from 'next/server'
import { performTwoWaySync, syncAllFromNotionToSupabase, syncAllFromSupabaseToNotion } from '@/lib/sync'

export async function POST(request: NextRequest) {
  try {
    const { direction } = await request.json()
    
    let result: string
    
    switch (direction) {
      case 'notion-to-supabase':
        await syncAllFromNotionToSupabase()
        result = 'Sync from Notion to Supabase completed'
        break
      case 'supabase-to-notion':
        await syncAllFromSupabaseToNotion()
        result = 'Sync from Supabase to Notion completed'
        break
      case 'two-way':
        await performTwoWaySync()
        result = 'Two-way sync completed'
        break
      default:
        return NextResponse.json(
          { error: 'Invalid direction. Use "notion-to-supabase", "supabase-to-notion", or "two-way"' },
          { status: 400 }
        )
    }
    
    return NextResponse.json({ success: true, message: result })
  } catch (error) {
    console.error('Sync API error:', error)
    return NextResponse.json(
      { error: 'Sync failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Sync API endpoint',
    usage: {
      POST: {
        body: {
          direction: '"notion-to-supabase" | "supabase-to-notion" | "two-way"'
        }
      }
    }
  })
} 