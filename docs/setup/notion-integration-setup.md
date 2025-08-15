# Notion Integration Setup

## Overview

This guide covers the complete setup for integrating My Vision Hub with Notion databases to enable real-time data synchronization for projects, blog posts, agents, and milestones in the timeline.

## 🚀 Quick Setup

### 1. Required Environment Variables

Create or update your `.env.local` file with the following variables:

```bash
# Notion API Configuration
NOTION_API_KEY=your_notion_integration_token

# Database IDs (all required for full timeline integration)
NOTION_MILESTONES_DB_ID=your_milestones_database_id
NOTION_PROJECT_DB_ID=your_projects_database_id
NOTION_BLOG_DB_ID=your_blog_posts_database_id
NOTION_AGENTS_DB_ID=your_agents_database_id
```

### 2. Environment Variable Details

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `NOTION_API_KEY` | Your Notion integration token | ✅ | `secret_abc123...` |
| `NOTION_MILESTONES_DB_ID` | Milestones database ID | ✅ | `a1b2c3d4-e5f6-7890-abcd-ef1234567890` |
| `NOTION_PROJECT_DB_ID` | Projects database ID | ✅ | `b2c3d4e5-f6g7-8901-bcde-f23456789012` |
| `NOTION_BLOG_DB_ID` | Blog posts database ID | ✅ | `c3d4e5f6-g7h8-9012-cdef-345678901234` |
| `NOTION_AGENTS_DB_ID` | Agents database ID | ✅ | `d4e5f6g7-h8i9-0123-defg-456789012345` |

## 📝 Step-by-Step Setup

### 1. Create Notion Integration

1. **Go to** [notion.so/my-integrations](https://notion.so/my-integrations)
2. **Click "New integration"**
3. **Fill in the details:**
   - Name: `My Vision Hub Integration`
   - Associated workspace: Select your workspace
   - Capabilities: Select "Read content" and "Update content"
4. **Click "Submit"**
5. **Copy the "Internal Integration Token"** (starts with `secret_`)

### 2. Create Required Databases

#### Milestones Database
1. **Create a new page** in your Notion workspace
2. **Add a database** (type `/database` and select "Table")
3. **Set up the following properties:**
   - `Name` (Title) - Required
   - `Slug` (Text) - Required
   - `Date` (Date) - Required
   - `Description` (Text) - Optional
   - `Status` (Select) - Optional
   - `Type` (Select) - Optional
   - `Icon` (Text) - Optional
   - `Color` (Text) - Optional
   - `Published` (Checkbox) - Required
   - `Projects` (Relation) - Link to projects database
   - `BlogPosts` (Relation) - Link to blog posts database
   - `Agents` (Relation) - Link to agents database

#### Projects Database
1. **Create a new page** in your Notion workspace
2. **Add a database** (type `/database` and select "Table")
3. **Set up the following properties:**
   - `title` (Title) - Required
   - `slug` (Text) - Required
   - `subtitle` (Text) - Optional
   - `description` (Text) - Required
   - `category` (Select) - Optional
   - `status` (Select) - Optional
   - `tags` (Multi-select) - Optional
   - `published` (Checkbox) - Required
   - `date` (Date) - Required
   - `coverImage` (Files) - Optional
   - `parentProject` (Relation) - Self-relation for parent projects
   - `childProjects` (Relation) - Self-relation for child projects

#### Blog Posts Database
1. **Create a new page** in your Notion workspace
2. **Add a database** (type `/database` and select "Table")
3. **Set up the following properties:**
   - `title` (Title) - Required
   - `slug` (Text) - Required
   - `excerpt` (Text) - Required
   - `author` (Text) - Required
   - `date` (Date) - Required
   - `tags` (Multi-select) - Optional
   - `published` (Checkbox) - Required
   - `projects` (Relation) - Link to projects database
   - `blogPosts` (Relation) - Link to other blog posts

#### Agents Database
1. **Create a new page** in your Notion workspace
2. **Add a database** (type `/database` and select "Table")
3. **Set up the following properties:**
   - `name` (Title) - Required
   - `slug` (Text) - Required
   - `description` (Text) - Required
   - `status` (Select) - Optional
   - `category` (Select) - Optional
   - `inputs` (Multi-select) - Optional
   - `tags` (Multi-select) - Optional
   - `exampleUses` (Text) - Optional
   - `triggerType` (Select) - Optional
   - `published` (Checkbox) - Required
   - `Projects` (Relation) - Link to projects database
   - `BlogPosts` (Relation) - Link to blog posts database
   - `Milestones` (Relation) - Link to milestones database

### 3. Share Databases with Integration

1. **Open each database** you created
2. **Click the "Share" button** in the top right
3. **Click "Invite"**
4. **Search for your integration name** (`My Vision Hub Integration`)
5. **Select it and click "Invite"**
6. **Set permissions to "Can edit"**

### 4. Get Database IDs

1. **Open each database** in Notion
2. **Copy the URL** from your browser
3. **Extract the database ID** from the URL:
   - URL format: `https://notion.so/workspace-name/database-id?v=...`
   - The database ID is the long string after `/workspace-name/` and before `?v=`

### 5. Update Environment Variables

1. **Open your `.env.local` file**
2. **Add or update the Notion variables:**

```bash
# Notion Integration
NOTION_API_KEY=secret_your_actual_token_here
NOTION_MILESTONES_DB_ID=your_milestones_db_id_here
NOTION_PROJECT_DB_ID=your_projects_db_id_here
NOTION_BLOG_DB_ID=your_blog_db_id_here
NOTION_AGENTS_DB_ID=your_agents_db_id_here
```

### 6. Restart Your Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

## 🧪 Testing the Integration

### 1. Check Notion Status

Visit `/api/notion-status` to verify your configuration:

```bash
curl http://localhost:3000/api/notion-status
```

Expected response:
```json
{
  "notionApiKeyConfigured": true,
  "notionApiKeyLength": 43,
  "notionMilestonesDbIdConfigured": true,
  "notionProjectsDbIdConfigured": true,
  "notionBlogDbIdConfigured": true,
  "notionAgentsDbIdConfigured": true,
  "hasRequiredConfig": true,
  "hasFullConfig": true,
  "fullyConfigured": true
}
```

### 2. Test Timeline

1. **Visit the timeline page** (`/timeline`)
2. **Check the browser console** for logs indicating Notion data usage:
   - ✅ `Using X projects from Notion`
   - ✅ `Using X agents from Notion`
   - ✅ `Using X blog posts from Notion`
   - ✅ `Using X milestones from Notion`

### 3. Test Individual APIs

```bash
# Test projects
curl http://localhost:3000/api/projects

# Test blog posts
curl http://localhost:3000/api/blog-posts

# Test agents
curl http://localhost:3000/api/agents

# Test milestones
curl http://localhost:3000/api/milestones
```

## 🔧 Troubleshooting

### Common Issues

#### 1. "Notion integration not configured" errors

**Problem**: Functions are falling back to local data
**Solution**: Check your environment variables are set correctly

```bash
# Verify in your .env.local file
cat .env.local | grep NOTION
```

#### 2. "Database not found" errors

**Problem**: Database ID is incorrect or database isn't shared
**Solution**: 
- Verify database ID from URL
- Ensure database is shared with your integration
- Check integration has "Can edit" permissions

#### 3. "Unauthorized" errors

**Problem**: API key is invalid or expired
**Solution**:
- Regenerate your integration token
- Update `.env.local` with new token
- Restart development server

#### 4. Empty results from Notion

**Problem**: Database properties don't match expected names
**Solution**: Ensure property names exactly match the setup guide above

### Debug Steps

1. **Check environment variables:**
```bash
echo $NOTION_API_KEY
echo $NOTION_MILESTONES_DB_ID
```

2. **Verify database sharing:**
   - Open each database
   - Check "Share" button shows your integration

3. **Test API directly:**
```bash
curl -H "Authorization: Bearer $NOTION_API_KEY" \
     "https://api.notion.com/v1/databases/$NOTION_MILESTONES_DB_ID/query"
```

4. **Check browser console:**
   - Open timeline page
   - Look for Notion-related logs
   - Check for error messages

## 📊 Data Flow

### Timeline Data Sources

```
Timeline Page
    ↓
Timeline API (/api/timeline)
    ↓
getAllTimelineEntries()
    ↓
├── processProjects() → getAllProjects() → Notion Projects DB
├── processAgents() → getAllAgentsFromNotion() → Notion Agents DB  
├── processPosts() → getBlogPosts() → Notion Blog Posts DB
└── processMilestones() → getMilestonesFromNotion() → Notion Milestones DB
```

### Fallback Behavior

- **Primary**: Notion databases (when configured)
- **Fallback**: Local JSON files (when Notion unavailable)
- **Error Handling**: Graceful degradation with console logging

## 🔄 Data Synchronization

### Real-time Updates

- **Notion changes** are reflected immediately in the timeline
- **No manual sync** required - data is fetched on each page load
- **Caching**: Minimal in-memory caching for performance

### Data Consistency

- **Timeline entries** are sorted by date (newest first)
- **Linked items** are resolved from Notion relations
- **Published status** filters ensure only public content appears

## 🚀 Next Steps

### 1. Add Sample Data

- **Create test entries** in each Notion database
- **Verify they appear** in the timeline
- **Test filtering** by type (projects, agents, posts, milestones)

### 2. Customize Properties

- **Add custom fields** to your databases
- **Modify the timeline** to display additional information
- **Create custom views** for different use cases

### 3. Advanced Features

- **Set up webhooks** for real-time Notion updates
- **Implement caching** for better performance
- **Add search functionality** across all content types

## 📚 Additional Resources

- [Notion API Documentation](https://developers.notion.com)
- [Notion Database Properties](https://developers.notion.com/reference/property-object)
- [Notion Relations](https://developers.notion.com/reference/property-object#relation)
- [My Vision Hub Architecture](./../core/architecture.md)

---

**Last Updated**: December 2024  
**Setup Version**: v2.0  
**Next Review**: v0.5 Release
