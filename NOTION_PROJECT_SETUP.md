# Notion Project Integration Setup Guide

This guide will help you set up Notion integration for managing your projects, similar to how the blog integration works.

## 🗄️ Step 1: Create Notion Database

### 1.1 Create a New Database
1. In your Notion workspace, create a new page
2. Type `/database` and select "Table - Full page"
3. Name it "Projects" or "My Vision Hub Projects"

### 1.2 Set Up Database Schema

Add the following properties to your database:

| Property Name | Type           | Required | Description                          |
| ------------- | -------------- | -------- | ------------------------------------ |
| `Title`       | Title (text)   | ✅        | Project name                         |
| `Slug`        | Rich text      | ✅        | URL-friendly ID (e.g., `ai-medical-diagnostics`) |
| `Subtitle`    | Rich text      | Optional | Short project description            |
| `Description` | Rich text      | ✅        | Detailed project description         |
| `Category`    | Rich text      | ✅        | Project category (e.g., "Medicine & AI") |
| `Status`      | Select         | ✅        | `in progress`, `completed`, `idea`, `planning`, `research` |
| `Tags`        | Multi-select   | ✅        | Thematic keywords                    |
| `CoverImage`  | Files & Media  | Optional | Hero/thumbnail image                 |
| `Date`        | Date           | ✅        | Project start date                   |

### 1.3 Configure Status Options
In the `Status` property, add these options:
- `in progress` (blue)
- `planning` (yellow) 
- `research` (purple)
- `completed` (green)
- `idea` (gray)

### 1.4 Add Sample Projects
Add a few sample projects to test the integration:

**Project 1:**
- Title: "AI-Powered Medical Diagnostics"
- Slug: `ai-medical-diagnostics`
- Subtitle: "Exploring the intersection of artificial intelligence and medical imaging"
- Description: "Developing AI systems for improved medical diagnostics..."
- Category: "Medicine & AI"
- Status: "in progress"
- Tags: ["AI", "Medicine", "Machine Learning", "Healthcare"]
- Date: 2024-01-15

**Project 2:**
- Title: "Ethical Design Framework"
- Slug: `ethical-design-framework`
- Subtitle: "Developing a comprehensive framework for ethical AI design"
- Description: "Creating guidelines for responsible AI development..."
- Category: "Design & Ethics"
- Status: "planning"
- Tags: ["Ethics", "Design", "AI", "Framework"]
- Date: 2024-01-10

## 🔑 Step 2: Get Database ID

1. Open your Projects database in Notion
2. Look at the URL in your browser
3. The database ID is the long string after the workspace name and before the `?v=`
4. Copy this ID - you'll need it for the environment variable

**Example URL:**
```
https://www.notion.so/myworkspace/1234567890abcdef1234567890abcdef?v=...
```
**Database ID:** `1234567890abcdef1234567890abcdef`

## 🔐 Step 3: Configure Environment Variables

Add the following to your `.env.local` file:

```bash
# Notion API Configuration
NOTION_API_KEY=your_notion_integration_token
NOTION_BLOG_DB_ID=your_blog_database_id
NOTION_PROJECT_DB_ID=your_project_database_id
```

**Note:** You can reuse the same `NOTION_API_KEY` from your blog integration.

## 🔗 Step 4: Share Database with Integration

1. In your Notion database, click the "Share" button (top right)
2. Click "Invite" 
3. In the search box, type the name of your integration (the one you created for the blog)
4. Select your integration from the dropdown
5. Make sure it has "Can edit" permissions
6. Click "Invite"

## 🧪 Step 5: Test the Integration

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Visit your projects page: `http://localhost:3000/projects`

3. You should see your Notion projects displayed instead of the fallback data

4. Click on a project to view its details

## 🔧 Troubleshooting

### No Projects Showing
- Check that your database ID is correct in `.env.local`
- Verify the integration has access to the database
- Check the browser console for any error messages
- Ensure your projects have the required fields (Title, Slug, Status, etc.)

### 404 Errors on Project Pages
- Verify that the `Slug` field in Notion matches the URL you're trying to access
- Check that the project exists in your Notion database
- Ensure the integration has read access to the database

### Content Not Rendering
- Make sure you've added content to the project pages in Notion
- Check that the content is in the page body (not just in properties)
- Verify that `notion-to-md` is properly converting the content

### Fallback Behavior
If Notion integration fails, the system will automatically fall back to the local `projects.json` data. This ensures your site continues to work even if there are API issues.

## 📝 Notes

- **Content**: Add your project content in the Notion page body (not in properties)
- **Images**: Upload images directly to Notion and they'll be accessible via the API
- **Updates**: Changes in Notion will be reflected on your site after a page refresh
- **Performance**: The system caches data and includes fallback mechanisms for reliability

## 🚀 Next Steps

Once your Notion integration is working:

1. **Add More Projects**: Populate your database with real project data
2. **Customize Styling**: Adjust the project cards and detail pages to match your brand
3. **Add Features**: Consider adding project filtering, search, or pagination
4. **Deploy**: Your Notion integration will work on Vercel with the same environment variables

## 📚 Related Documentation

- [Notion API Documentation](https://developers.notion.com/)
- [Blog Integration Setup](./NOTION_SETUP.md)
- [Project Structure Overview](./README.md) 