import { NextResponse } from 'next/server'

export async function GET() {
  const notionApiKey = process.env.NOTION_API_KEY
  const notionMilestonesDbId = process.env.NOTION_MILESTONES_DB_ID
  const notionProjectsDbId = process.env.NOTION_PROJECT_DB_ID
  const notionBlogDbId = process.env.NOTION_BLOG_DB_ID
  const notionAgentsDbId = process.env.NOTION_AGENTS_DB_ID
  
  const hasRequiredConfig = !!(notionApiKey && notionMilestonesDbId)
  const hasFullConfig = !!(notionApiKey && notionMilestonesDbId && notionProjectsDbId && notionBlogDbId && notionAgentsDbId)
  
  return NextResponse.json({
    notionApiKeyConfigured: !!notionApiKey,
    notionApiKeyLength: notionApiKey?.length || 0,
    
    // Database configurations
    notionMilestonesDbIdConfigured: !!notionMilestonesDbId,
    notionProjectsDbIdConfigured: !!notionProjectsDbId,
    notionBlogDbIdConfigured: !!notionBlogDbId,
    notionAgentsDbIdConfigured: !!notionAgentsDbId,
    
    // Database IDs (for debugging)
    notionMilestonesDbId: notionMilestonesDbId || null,
    notionProjectsDbId: notionProjectsDbId || null,
    notionBlogDbId: notionBlogDbId || null,
    notionAgentsDbId: notionAgentsDbId || null,
    
    // Configuration status
    hasRequiredConfig, // At minimum, needs API key and milestones DB
    hasFullConfig,     // Has all databases configured
    fullyConfigured: hasFullConfig
  })
} 