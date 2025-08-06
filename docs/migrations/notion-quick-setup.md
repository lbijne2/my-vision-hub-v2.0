# Quick Notion Milestones Setup

## Current Status
The timeline is currently using local fallback data because Notion integration isn't configured yet.

## To Enable Notion Integration:

### 1. Create Notion Database
Create a new database in Notion with these properties:
- `Title` (Title)
- `Date` (Date) 
- `Type` (Select: milestone, launch, research, etc.)
- `Status` (Select: active, completed, etc.)
- `Description` (Rich Text)
- `Published` (Checkbox)
- `Linked Items` (Multi-select)

### 2. Get Database ID
1. Open your Notion database
2. Click "Share" → "Copy link"
3. Extract the database ID from the URL:
   ```
   https://notion.so/workspace/DATABASE_ID?v=...
   ```

### 3. Get API Key
1. Go to https://www.notion.so/my-integrations
2. Create new integration
3. Copy the "Internal Integration Token"

### 4. Add Environment Variables
Create `.env.local` file in your project root:

```bash
NOTION_API_KEY=your_integration_token_here
NOTION_MILESTONES_DB_ID=your_database_id_here
```

### 5. Share Database with Integration
1. In your Notion database, click "Share"
2. Click "Invite" → "Add people, emails, groups, or integrations"
3. Search for your integration name and add it

### 6. Test
Restart your dev server and check the console logs. You should see:
```
Notion integration configured, fetching milestones from Notion...
Loaded X milestones from Notion
```

## Example Milestone Entry
Add a test milestone to your Notion database:
- **Title**: "Vision Hub v2.0 Launch"
- **Date**: 2024-01-30
- **Type**: launch
- **Status**: completed
- **Description**: "Official launch of the redesigned Vision Hub platform"
- **Published**: ✅ (checked)
- **Linked Items**: `project:ethical-design-framework`, `agent:template-generator`

## Troubleshooting
- Check browser console for error messages
- Verify environment variables are loaded (restart dev server)
- Ensure database is shared with your integration
- Test with a simple milestone first 