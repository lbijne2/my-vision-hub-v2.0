# Notion Milestones Integration Setup

This document explains how to set up the Notion integration for milestones in the Vision Hub timeline.

## 🗄️ Notion Database Setup

### 1. Create Milestones Database

Create a new database in Notion with the following properties:

| Property Name | Type | Description |
|---------------|------|-------------|
| `Title` | Title | The milestone title |
| `Date` | Date | When the milestone occurred |
| `Type` | Select | milestone, launch, research, development, integration, release, update |
| `Status` | Select | active, completed, planned, etc. |
| `Description` | Rich Text | Detailed description of the milestone |
| `Published` | Checkbox | Whether to show on timeline (true = visible) |
| `Linked Items` | Multi-select | Format: `project:slug`, `agent:slug`, `post:slug` |

### 2. Example Linked Items

- `project:ai-medical-diagnostics`
- `agent:template-generator`
- `post:future-of-ai-in-healthcare`

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

## 🎨 Milestone Types & Icons

The system automatically assigns icons and colors based on the Type field:

| Type | Icon | Color |
|------|------|-------|
| milestone | 📌 | bg-pastel-purple |
| launch | 🚀 | bg-pastel-blue |
| research | 🔬 | bg-pastel-sage |
| development | ⚙️ | bg-pastel-orange |
| integration | 🔗 | bg-pastel-pink |
| release | 🎉 | bg-pastel-green |
| update | 🔄 | bg-pastel-lavender |

## 🔄 Fallback Behavior

If Notion is not configured or fails to load:
1. Falls back to local `milestones.json` data
2. Shows appropriate loading and error states
3. Logs errors to console for debugging

## 📝 Usage

1. Add milestones to your Notion database
2. Set `Published` to true for timeline visibility
3. Add linked items in the format `type:slug`
4. The timeline will automatically load and display them

## 🐛 Troubleshooting

- Check console logs for API errors
- Verify environment variables are set correctly
- Ensure database permissions allow API access
- Test with local data first before Notion integration 