# Notion Milestones Integration Setup

This document explains how to set up the Notion integration for milestones in the Vision Hub timeline.

## 🗄️ Notion Database Setup

### 1. Create Milestones Database

Create a new database in Notion with the following properties:

| Property Name | Type | Required | Description |
|---------------|------|----------|-------------|
| `Name` | Title | ✅ | Milestone title |
| `Slug` | Text | ✅ | Optional (for direct linking if needed) |
| `Date` | Date | ✅ | Date of milestone |
| `Description` | Rich text | ✅ | Short explanation |
| `Status` | Select | ✅ | `planned`, `active`, `completed` |
| `Type` | Select | ✅ | `fellowship`, `launch`, `research`, `custom` |
| `Icon` | Text (emoji) | ✅ | e.g. `🚀`, `🔬`, `📚` |
| `Color` | Text (Tailwind class) | ✅ | e.g. `bg-pastel-mint`, `bg-pastel-sky` |
| `Published` | Checkbox | ✅ | Whether this should appear on timeline |
| `Projects` | Relation → Projects | optional | Related project entries |
| `BlogPosts` | Relation → Blog Posts | optional | Related blog entries |
| `Agents` | Relation → Agents | optional | Related agents |

### 2. Example Database Entry

| Name | Slug | Date | Description | Status | Type | Icon | Color | Published |
|------|------|------|-------------|--------|------|------|-------|-----------|
| "Vision Hub v2.0 Launch" | "v2-launch" | 2024-01-30 | "Official launch of the redesigned platform" | completed | launch | 🚀 | bg-pastel-blue | ✅ |

## 🔧 Environment Variables

Add these to your `.env.local` file:

```bash
# Notion API Key
NOTION_API_KEY=your_notion_api_key_here

# Notion Database IDs
NOTION_BLOG_DB_ID=your_blog_database_id
NOTION_PROJECT_DB_ID=your_projects_database_id
NOTION_MILESTONES_DB_ID=your_milestones_database_id
```

## 🎨 Milestone Types & Default Icons

The system automatically assigns icons and colors based on the Type field if not specified:

| Type | Default Icon | Default Color |
|------|--------------|---------------|
| fellowship | 🎓 | bg-pastel-sage |
| launch | 🚀 | bg-pastel-blue |
| research | 🔬 | bg-pastel-lavender |
| custom | 📌 | bg-pastel-purple |

## 🔄 Fallback Behavior

If Notion is not configured or fails to load:
1. Falls back to local `milestones.json` data
2. Shows appropriate loading and error states
3. Logs errors to console for debugging

## 📝 Usage

1. Add milestones to your Notion database
2. Set `Published` to true for timeline visibility
3. Add related items using the relation properties (Projects, BlogPosts, Agents)
4. The timeline will automatically load and display them

## 🐛 Troubleshooting

- Check console logs for API errors
- Verify environment variables are set correctly
- Ensure database permissions allow API access
- Test with local data first before Notion integration 