# Notion Agents Database Setup Guide

This guide will help you set up the "Agents" database in Notion for the MyVisionHub application.

## 🗃️ Database Configuration

### 1. Create the Database

1. In your Notion workspace, create a new database
2. Name it **"Agents"**
3. Set the database type to **"Table"**

### 2. Configure Properties

Add the following properties to your database:

| Property Name  | Type                  | Required | Description                                                 |
| -------------- | --------------------- | -------- | ----------------------------------------------------------- |
| `Name`         | Title                 | ✅        | Agent name (this will be the page title)                   |
| `Slug`         | Text                  | ✅        | Unique URL identifier (e.g. `clinical-summarizer`)          |
| `Description`  | Rich text             | ✅        | Short overview (shown in cards and previews)                |
| `Trigger Type` | Select                | ✅        | Type of invocation (`openai`, `manual`, etc.)               |
| `Status`       | Select                | ✅        | One of: `active`, `prototype`, `idea`                       |
| `Category`     | Text                  | ✅        | Domain context (e.g. `Healthcare`, `Research`)              |
| `Inputs`       | Multi-select          | ✅        | Required input fields (e.g. `free text`, `output format`)   |
| `Example Uses` | Text                  | ✅        | A concrete scenario for how this agent is used              |
| `Tags`         | Multi-select          | ✅        | Thematic tags for categorization                            |
| `Published`    | Checkbox              | ✅        | Whether this agent should appear on the site                |
| `Created At`   | Date                  | ✅        | Date of creation                                            |
| `Projects`     | Relation → Projects   | optional | Links to related project pages                              |
| `BlogPosts`    | Relation → Blog Posts | optional | Links to related blog entries                               |
| `Milestones`   | Relation → Milestones | optional | Links to relevant milestones                                |

### 3. Select Options Configuration

#### Trigger Type Options:
- `openai`
- `manual`
- `scheduled`
- `webhook`
- `api`

#### Status Options:
- `active`
- `prototype`
- `idea`

### 4. Environment Variables

Add the following environment variables to your `.env.local` file:

```env
NOTION_API_KEY=your_notion_api_key_here
NOTION_AGENTS_DB_ID=your_agents_database_id_here
```

### 5. Getting the Database ID

1. Open your Agents database in Notion
2. Click the "Share" button in the top right
3. Click "Copy link"
4. The database ID is the part after the last `/` and before the `?` in the URL
5. Example: `https://notion.so/workspace/1234567890abcdef` → `1234567890abcdef`

### 6. Content Structure

For each agent page:

1. **Page Title**: The agent name (e.g., "Clinical Note Summarizer")
2. **Page Body**: Write the full markdown content here - this will be converted to HTML and displayed on the agent detail page
3. **Properties**: Fill in all the required properties listed above

### 7. Example Agent Entry

**Page Title**: "Clinical Note Summarizer"

**Properties**:
- Name: "Clinical Note Summarizer"
- Slug: "clinical-summarizer"
- Description: "Summarizes long patient notes into concise bullet points using GPT-4."
- Trigger Type: "openai"
- Status: "prototype"
- Category: "Healthcare"
- Inputs: ["free text", "target style"]
- Example Uses: "Summarize a SOAP note for radiology workflow triage."
- Tags: ["Medical", "AI", "Summarization", "Clinical"]
- Published: ✅ (checked)
- Created At: 2024-01-15

**Page Body** (markdown content):
```markdown
The Clinical Note Summarizer is designed to help healthcare professionals quickly extract key information from lengthy patient notes and medical records. Using advanced natural language processing, it identifies critical clinical information and presents it in a structured, easy-to-read format.

## Key Features

### Intelligent Summarization
- Extracts key clinical findings and observations
- Identifies critical patient information
- Highlights important trends and changes
- Maintains medical terminology accuracy

### Customizable Output
- **SOAP Format**: Structured Subjective, Objective, Assessment, Plan
- **Bullet Points**: Concise key findings
- **Timeline View**: Chronological clinical events
- **Risk Assessment**: Highlighted potential issues

### Privacy & Security
- HIPAA-compliant processing
- Local data processing options
- Encrypted data transmission
- Audit trail maintenance

## Clinical Applications

### Emergency Medicine
Rapid triage and decision support in emergency situations.

### Primary Care
Efficient review of patient history and current complaints.

### Specialized Care
Specialized summaries for cardiology, oncology, and other specialties.

## Technical Implementation

- **Model**: GPT-4 with medical fine-tuning
- **Processing**: Real-time text analysis
- **Output**: Structured clinical summaries
- **Integration**: EHR system compatibility

## Future Development

- Multi-language support
- Specialty-specific templates
- Real-time collaboration features
- Advanced clinical decision support
```

### 8. Testing the Integration

1. Start your development server: `npm run dev`
2. Navigate to `/agents` to see the agents list
3. Click on an agent to view its detail page
4. Verify that the markdown content is properly rendered
5. Check that related content (projects, blog posts, milestones) appears in the sidebar

### 9. Troubleshooting

**No agents showing up?**
- Check that the `Published` checkbox is checked for your agents
- Verify your `NOTION_API_KEY` and `NOTION_AGENTS_DB_ID` are correct
- Check the browser console for any error messages

**Content not rendering?**
- Make sure you have content in the page body (not just in the Description property)
- Verify the `notion-to-md` package is installed: `npm install notion-to-md`

**Related content not showing?**
- Ensure your other databases (Projects, Blog Posts, Milestones) are properly configured
- Check that the relation properties are correctly set up

### 10. Migration from JSON

If you're migrating from the existing `agents.json` file:

1. Create a new page in your Agents database for each agent in the JSON file
2. Copy the content from the `content` field to the page body
3. Fill in all the properties based on the JSON data
4. Set `Published` to true for agents you want to display
5. Update any related content links as needed

The application will automatically fall back to the JSON data if Notion is not configured or if there are any errors. 