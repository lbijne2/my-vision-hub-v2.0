# Notion Integration Setup Guide

This guide will help you set up the Notion integration for the blog content management system.

## Prerequisites

1. A Notion account
2. A Notion database for blog posts
3. Notion API access

## Step 1: Create a Notion Integration

1. Go to [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click "New integration"
3. Give it a name (e.g., "Vision Hub Blog")
4. Select the workspace where your blog database is located
5. Set capabilities:
   - Read content
   - Read user information without email
6. Click "Submit"
7. Copy the **Internal Integration Token** (this is your `NOTION_API_KEY`)

## Step 2: Create a Blog Database

Create a new database in Notion with the following properties:

### Required Properties

| Property Name | Type | Description |
|---------------|------|-------------|
| `title` | Title | The blog post title |
| `slug` | Text | URL-friendly identifier (e.g., "my-blog-post") |
| `published` | Checkbox | Whether the post is published |
| `tags` | Multi-select | Categories/tags for the post |
| `date` | Date | Publication date |
| `excerpt` | Text | Short description/excerpt |
| `author` | Text | Author name |

### Optional Properties

| Property Name | Type | Description |
|---------------|------|-------------|
| `content` | Page content | The main blog post content |
| `lastEdited` | Last edited time | Automatically updated by Notion |

## Step 3: Get Database ID

1. Open your blog database in Notion
2. Look at the URL: `https://www.notion.so/workspace/DATABASE_ID?v=...`
3. Copy the `DATABASE_ID` (32 characters, alphanumeric)
4. This is your `NOTION_BLOG_DB_ID`

## Step 4: Share Database with Integration

1. Open your blog database
2. Click the "Share" button in the top right
3. Click "Invite" and search for your integration name
4. Select your integration and click "Invite"

## Step 5: Environment Configuration

Create a `.env.local` file in your project root:

```env
# Notion API Configuration
NOTION_API_KEY=your_notion_api_key_here
NOTION_BLOG_DB_ID=your_notion_database_id_here

# Optional: Enable debug logging
NOTION_DEBUG=false
```

## Step 6: Test the Integration

1. Create a test blog post in your Notion database
2. Set `published` to true
3. Fill in all required fields
4. Run your development server
5. Visit `/blog` to see your posts

## Database Schema Example

Here's an example of how your Notion database should be structured:

| title | slug | published | tags | date | excerpt | author |
|-------|------|-----------|------|------|---------|--------|
| "My First Blog Post" | "my-first-blog-post" | ✅ | AI, Technology | 2024-01-20 | "An introduction to..." | "Vision Hub" |

## Troubleshooting

### Common Issues

1. **"Notion API not configured" message**
   - Check that your environment variables are set correctly
   - Restart your development server after adding environment variables

2. **"Database not found" error**
   - Verify your database ID is correct
   - Ensure the integration has access to the database

3. **Posts not showing up**
   - Check that posts have `published` set to true
   - Verify all required fields are filled in

### Debug Mode

Enable debug logging by setting `NOTION_DEBUG=true` in your environment variables. This will show detailed logs about API calls and responses.

## Fallback Behavior

If the Notion integration fails or isn't configured, the system will automatically fall back to the local `posts.json` file. This ensures the blog always works, even without Notion.

## Next Steps

Once the basic integration is working, you can:

1. Add more blog posts through Notion
2. Customize the markdown rendering
3. Add image support
4. Implement caching for better performance
5. Add search and filtering capabilities 