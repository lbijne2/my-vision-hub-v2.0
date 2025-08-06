import { NextResponse } from 'next/server'

export async function GET() {
  const notionApiKey = process.env.NOTION_API_KEY
  const notionMilestonesDbId = process.env.NOTION_MILESTONES_DB_ID
  
  return NextResponse.json({
    notionApiKeyConfigured: !!notionApiKey,
    notionMilestonesDbIdConfigured: !!notionMilestonesDbId,
    notionApiKeyLength: notionApiKey?.length || 0,
    notionMilestonesDbId: notionMilestonesDbId || null,
    fullyConfigured: !!(notionApiKey && notionMilestonesDbId)
  })
} 