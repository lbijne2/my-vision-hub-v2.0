import { NextResponse } from 'next/server'
import { getAllAgents } from '@/lib/agents'

export async function GET() {
  try {
    const agents = await getAllAgents()
    
    return NextResponse.json({
      success: true,
      agents: agents
    })
  } catch (error) {
    console.error('Error fetching agents:', error)
    
    // Return empty array on error to trigger fallback
    return NextResponse.json({
      success: false,
      agents: []
    })
  }
}
