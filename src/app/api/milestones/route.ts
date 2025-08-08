import { NextResponse } from 'next/server'
import { getFutureMilestonesFromNotion } from '@/lib/notion'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const maxItems = parseInt(searchParams.get('maxItems') || '5')
    
    const milestones = await getFutureMilestonesFromNotion(maxItems)
    
    return NextResponse.json({
      success: true,
      milestones,
      count: milestones.length
    })
  } catch (error) {
    console.error('Error fetching future milestones:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch future milestones',
        milestones: []
      },
      { status: 500 }
    )
  }
}
