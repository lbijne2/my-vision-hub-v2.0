# Supabase Integration Setup Guide

This guide will help you set up Supabase integration for your My Vision Hub platform, enabling real-time database functionality with graceful fallbacks to local data.

## 🗄️ Step 1: Create Supabase Project

### 1.1 Create a New Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `my-vision-hub`
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"

### 1.2 Get Project Credentials
1. In your Supabase dashboard, go to Settings → API
2. Copy the following values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 🗄️ Step 2: Create Database Tables

### 2.1 SQL Editor Setup
1. In your Supabase dashboard, go to SQL Editor
2. Create a new query and paste the following SQL:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- TABLE: agents
CREATE TABLE agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  status text CHECK (status IN ('active', 'prototype', 'idea')) NOT NULL,
  category text NOT NULL,
  description text,
  inputs jsonb,
  tags text[],
  example_uses text[],
  trigger_type text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- TABLE: projects
CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  subtitle text,
  description text,
  cover_image_url text,
  tags text[],
  status text CHECK (status IN ('active', 'prototype', 'archived')),
  github_url text,
  notion_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- TABLE: blog_posts
CREATE TABLE blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text,
  author text,
  published boolean DEFAULT false,
  tags text[],
  published_at timestamp with time zone,
  notion_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_agents_slug ON agents(slug);
CREATE INDEX idx_agents_status ON agents(status);
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON blog_posts(published);
```

### 2.2 Execute the SQL
1. Click "Run" to create all tables
2. Verify tables are created in the Table Editor

## 📝 Step 3: Add Sample Data

### 3.1 Insert Sample Agents
```sql
INSERT INTO agents (name, slug, status, category, description, inputs, tags, example_uses, trigger_type) VALUES
(
  'Notion Template Generator',
  'template-generator',
  'active',
  'Productivity',
  'Creates custom Notion templates for projects, sprints, or research logs.',
  '["project type", "structure preference", "output format"]',
  '["Notion", "Templates", "Workflow", "AI"]',
  '["Generate a sprint planning board for a medical AI start-up."]',
  'openai'
),
(
  'Clinical Note Summarizer',
  'clinical-summarizer',
  'prototype',
  'Healthcare',
  'Summarizes long patient notes into concise bullet points using GPT-4.',
  '["free text", "target style"]',
  '["Medical", "AI", "Summarization", "Clinical"]',
  '["Summarize a SOAP note for radiology workflow triage."]',
  'openai'
);
```

### 3.2 Insert Sample Projects
```sql
INSERT INTO projects (title, slug, subtitle, description, status, tags) VALUES
(
  'AI-Powered Medical Diagnostics',
  'ai-medical-diagnostics',
  'Exploring the intersection of artificial intelligence and medical imaging',
  'This project explores the transformative potential of artificial intelligence in medical diagnostics...',
  'active',
  '["AI", "Medicine", "Machine Learning", "Healthcare", "Diagnostics"]'
),
(
  'Ethical Design Framework',
  'ethical-design-framework',
  'Developing a comprehensive framework for ethical AI design',
  'As AI systems become increasingly integrated into our daily lives...',
  'prototype',
  '["Ethics", "Design", "AI", "Framework", "Responsible AI"]'
);
```

### 3.3 Insert Sample Blog Posts
```sql
INSERT INTO blog_posts (title, slug, content, author, published, tags, published_at) VALUES
(
  'The Future of AI in Healthcare',
  'future-of-ai-in-healthcare',
  'Artificial intelligence is transforming healthcare in unprecedented ways...',
  'Lucas Bijnens',
  true,
  '["AI", "Healthcare", "Technology", "Future"]',
  now()
),
(
  'Building Ethical AI Systems',
  'building-ethical-ai-systems',
  'As AI becomes more integrated into our lives, ethical considerations become paramount...',
  'Lucas Bijnens',
  true,
  '["AI", "Ethics", "Design", "Responsibility"]',
  now()
);
```

## 🔐 Step 4: Configure Environment Variables

### 4.1 Local Development
Create or update your `.env.local` file:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Notion Configuration (optional - for fallback)
NOTION_API_KEY=your_notion_integration_token
NOTION_BLOG_DB_ID=your_blog_database_id
NOTION_PROJECT_DB_ID=your_project_database_id
```

### 4.2 Production Deployment
Add the same environment variables to your production environment (Vercel, etc.)

## 🔧 Step 5: Test the Integration

### 5.1 Restart Development Server
```bash
npm run dev
```

### 5.2 Test Data Fetching
1. Visit `http://localhost:3000/projects` - should show Supabase data
2. Visit `http://localhost:3000/blog` - should show Supabase data
3. Visit `http://localhost:3000/agents` - should show Supabase data

### 5.3 Check Console Logs
- Look for "Using Supabase data" messages
- If Supabase fails, you should see "Using fallback data" messages

## 🔍 Step 6: Row Level Security (Optional)

### 6.1 Enable RLS
```sql
-- Enable RLS on all tables
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access" ON agents FOR SELECT USING (true);
CREATE POLICY "Public read access" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read access" ON blog_posts FOR SELECT USING (published = true);
```

## 🚀 Step 7: Advanced Features

### 7.1 Real-time Subscriptions
The Supabase client is configured to support real-time subscriptions. You can enable them in the future:

```typescript
// Example real-time subscription
const subscription = supabase
  .from('blog_posts')
  .on('INSERT', payload => {
    console.log('New post:', payload.new)
  })
  .subscribe()
```

### 7.2 Database Functions
Create custom functions for complex queries:

```sql
-- Example function to get recent posts
CREATE OR REPLACE FUNCTION get_recent_posts(limit_count integer DEFAULT 10)
RETURNS TABLE (
  id uuid,
  title text,
  slug text,
  published_at timestamp with time zone
) AS $$
BEGIN
  RETURN QUERY
  SELECT bp.id, bp.title, bp.slug, bp.published_at
  FROM blog_posts bp
  WHERE bp.published = true
  ORDER BY bp.published_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;
```

## 🔧 Troubleshooting

### No Data Showing
- Check that Supabase URL and key are correct
- Verify tables exist and have data
- Check browser console for errors
- Ensure RLS policies allow read access

### Fallback to Local Data
- Check Supabase connection in browser console
- Verify environment variables are set
- Check network connectivity to Supabase

### TypeScript Errors
- Ensure `@supabase/supabase-js` is installed
- Check that types are properly imported
- Verify database schema matches TypeScript interfaces

## 📊 Monitoring

### 7.1 Database Logs
- Go to Supabase Dashboard → Logs
- Monitor query performance and errors

### 7.2 Application Logs
- Check browser console for client-side errors
- Monitor server logs for API errors

## 🎯 Next Steps

### Immediate
1. **Add more sample data** to test all features
2. **Configure RLS policies** for security
3. **Set up monitoring** for production use

### Future Enhancements
1. **Real-time updates** for live content changes
2. **User authentication** for admin features
3. **File uploads** for images and documents
4. **Search functionality** with full-text search
5. **Analytics tracking** for content performance

## 📚 Related Documentation

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [TypeScript Database Types](https://supabase.com/docs/guides/api/generating-types)

---

**Your My Vision Hub now has full Supabase integration with graceful fallbacks!** 🎉 