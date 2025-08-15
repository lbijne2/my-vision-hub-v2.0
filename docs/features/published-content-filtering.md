# Published Content Filtering

## Overview

My Vision Hub automatically filters content to only display published/visible items in public-facing areas like the timeline, ensuring that draft or unpublished content remains private while published content is visible to users.

## 🔒 Filtering Behavior

### Timeline Display
- **Only published content** appears in the timeline
- Draft, unpublished, or hidden content is automatically filtered out
- This applies to all content types: projects, agents, blog posts, and milestones

### Content Types and Filtering

#### 1. **Projects** (`/timeline`, `/projects`)
- **Notion**: Filtered by `published` checkbox = `true`
- **Local fallback**: Filtered by `visible` field = `true`
- **Result**: Only visible projects appear in timeline

#### 2. **Blog Posts** (`/timeline`, `/blog`)
- **Notion**: Filtered by `published` checkbox = `true`
- **Local fallback**: Filtered by `status` field = `"published"`
- **Result**: Only published posts appear in timeline

#### 3. **Agents** (`/timeline`, `/agents`)
- **Notion**: Filtered by `published` checkbox = `true`
- **Local fallback**: All agents shown (no published field in local data)
- **Result**: Only published agents appear in timeline

#### 4. **Milestones** (`/timeline`)
- **Notion**: Filtered by `Published` checkbox = `true`
- **Local fallback**: All milestones shown (no published field in local data)
- **Result**: Only published milestones appear in timeline

## 🗄️ Database Schema Requirements

### Notion Database Properties

To enable proper filtering, ensure your Notion databases have these properties:

#### Projects Database
```typescript
{
  published: { checkbox: boolean }  // Required for filtering
  title: { title: Array<{ plain_text: string }> }
  slug: { rich_text: Array<{ plain_text: string }> }
  // ... other properties
}
```

#### Blog Posts Database
```typescript
{
  published: { checkbox: boolean }  // Required for filtering
  title: { title: Array<{ plain_text: string }> }
  slug: { rich_text: Array<{ plain_text: string }> }
  // ... other properties
}
```

#### Agents Database
```typescript
{
  published: { checkbox: boolean }  // Required for filtering
  name: { title: Array<{ plain_text: string }> }
  slug: { rich_text: Array<{ plain_text: string }> }
  // ... other properties
}
```

#### Milestones Database
```typescript
{
  Published: { checkbox: boolean }  // Required for filtering
  Name: { title: Array<{ plain_text: string }> }
  Slug: { rich_text: Array<{ plain_text: string }> }
  // ... other properties
}
```

### Local JSON Fallback

Local fallback data uses these fields for filtering:

#### Projects (`src/data/projects.json`)
```json
{
  "visible": true,  // Controls timeline visibility
  "title": "Project Title",
  "slug": "project-slug"
}
```

#### Blog Posts (`src/data/posts.json`)
```json
{
  "status": "published",  // Controls timeline visibility
  "title": "Post Title",
  "slug": "post-slug"
}
```

#### Agents (`src/data/agents.json`)
```json
{
  // No published field - all agents shown in fallback
  "name": "Agent Name",
  "slug": "agent-slug"
}
```

## 🔍 Implementation Details

### Timeline Filtering Logic

```typescript
// Projects: Filter by visible status
const visibleProjects = projects.filter(project => project.visible !== false)

// Blog Posts: Filter by published status
const publishedPosts = posts.filter(post => post.status === 'published')

// Agents: No filtering in fallback (Notion handles this)
const allAgents = agents

// Milestones: No filtering in fallback (Notion handles this)
const allMilestones = milestones
```

### Notion API Queries

```typescript
// Example: Fetching only published projects
const response = await notion.databases.query({
  database_id: process.env.NOTION_PROJECT_DB_ID,
  filter: {
    property: 'published',
    checkbox: {
      equals: true,
    },
  },
  // ... other options
})
```

## 🚀 Benefits

### 1. **Content Control**
- Easy to manage what's visible to users
- Draft content remains private during development
- Gradual content publishing workflow

### 2. **User Experience**
- Timeline shows only relevant, finished content
- No confusion from incomplete or draft items
- Professional appearance with curated content

### 3. **Workflow Management**
- Content creators can work on drafts privately
- Review and approval process before publishing
- Version control for content development

## 🔧 Configuration

### Environment Variables

Ensure these are set for Notion filtering to work:

```bash
NOTION_API_KEY=your_integration_token
NOTION_PROJECT_DB_ID=your_projects_database_id
NOTION_BLOG_DB_ID=your_blog_database_id
NOTION_AGENTS_DB_ID=your_agents_database_id
NOTION_MILESTONES_DB_ID=your_milestones_database_id
```

### Database Setup

1. **Create databases** with required properties
2. **Set published checkbox** to `false` for drafts
3. **Set published checkbox** to `true` for published content
4. **Share databases** with your Notion integration

## 📊 Monitoring and Debugging

### Console Logs

The timeline provides detailed logging about filtering:

```
📊 Timeline loaded with X total entries:
  - Milestones: X entries
  - Projects: X entries
  - Agents: X entries
  - Posts: X entries
  - Data source: ✅ Notion
  - Content filter: 📝 Only published/visible content is displayed
```

### API Endpoints

Check filtering status via:

```bash
# Check Notion configuration
curl http://localhost:3000/api/notion-status

# Check timeline data
curl http://localhost:3000/api/timeline
```

## 🚨 Common Issues

### 1. **No Content Appearing**
- Check if `published` properties exist in Notion databases
- Verify `published` checkboxes are set to `true`
- Check console logs for filtering information

### 2. **Draft Content Visible**
- Ensure `published` property is `false` for drafts
- Check property names match exactly (`published` vs `Published`)
- Verify Notion integration has proper permissions

### 3. **Local Fallback Not Filtering**
- Check local JSON files have correct field names
- Verify `visible` field for projects
- Verify `status` field for blog posts

## 🔄 Future Enhancements

### Planned Features
- **Advanced filtering**: Multiple published states (draft, review, published)
- **Scheduled publishing**: Auto-publish content at specific dates
- **Role-based access**: Different visibility for different user roles
- **Content preview**: Preview mode for draft content

### Customization Options
- **Filter overrides**: Admin controls to show/hide specific content
- **Category filtering**: Show only certain content categories
- **Date range filtering**: Show content within specific time periods

---

**Last Updated**: December 2024  
**Version**: v2.0  
**Status**: ✅ Implemented
