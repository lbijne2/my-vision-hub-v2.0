# Database Schema

## Overview

This document describes the complete database schema for My Vision Hub v2.0, including table structures, relationships, indexes, and data types.

## 🗄️ Database: Supabase (PostgreSQL)

### Connection Details
- **Host**: `your-project-id.supabase.co`
- **Database**: `postgres`
- **Schema**: `public`
- **SSL**: Required

## 📋 Table Schemas

### Projects Table

**Table Name**: `projects`

**Description**: Stores project information including metadata, content, and relationships.

```sql
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
```

**Columns**:
- `id`: Unique identifier (UUID)
- `title`: Project title (required)
- `slug`: URL-friendly identifier (unique, required)
- `subtitle`: Project subtitle
- `description`: Project description
- `cover_image_url`: Cover image URL
- `tags`: Array of tags
- `status`: Project status (active/prototype/archived)
- `github_url`: GitHub repository URL
- `notion_url`: Notion page URL
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

**Indexes**:
```sql
-- Performance indexes
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX idx_projects_tags ON projects USING GIN(tags);

-- Search indexes
CREATE INDEX idx_projects_title ON projects USING gin(to_tsvector('english', title));
CREATE INDEX idx_projects_description ON projects USING gin(to_tsvector('english', description));
```

### Blog Posts Table

**Table Name**: `blog_posts`

**Description**: Stores blog post content and metadata.

```sql
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
```

**Columns**:
- `id`: Unique identifier (UUID)
- `title`: Post title (required)
- `slug`: URL-friendly identifier (unique, required)
- `content`: Post content in markdown
- `author`: Author name
- `published`: Publication status
- `tags`: Array of tags
- `published_at`: Publication timestamp
- `notion_url`: Notion page URL
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

**Indexes**:
```sql
-- Performance indexes
CREATE INDEX idx_blog_posts_published ON blog_posts(published);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX idx_blog_posts_tags ON blog_posts USING GIN(tags);

-- Search indexes
CREATE INDEX idx_blog_posts_title ON blog_posts USING gin(to_tsvector('english', title));
CREATE INDEX idx_blog_posts_content ON blog_posts USING gin(to_tsvector('english', content));
```

### Agents Table

**Table Name**: `agents`

**Description**: Stores AI agent information and configurations.

```sql
CREATE TABLE agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  status text CHECK (status IN ('active', 'prototype', 'idea')),
  category text NOT NULL,
  description text,
  inputs jsonb,
  tags text[],
  example_uses text[],
  trigger_type text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

**Columns**:
- `id`: Unique identifier (UUID)
- `name`: Agent name (required)
- `slug`: URL-friendly identifier (unique, required)
- `status`: Agent status (active/prototype/idea)
- `category`: Agent category (required)
- `description`: Agent description
- `inputs`: JSON object with input specifications
- `tags`: Array of tags
- `example_uses`: Array of example use cases
- `trigger_type`: Trigger mechanism type
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

**Indexes**:
```sql
-- Performance indexes
CREATE INDEX idx_agents_status ON agents(status);
CREATE INDEX idx_agents_category ON agents(category);
CREATE INDEX idx_agents_tags ON agents USING GIN(tags);

-- Search indexes
CREATE INDEX idx_agents_name ON agents USING gin(to_tsvector('english', name));
CREATE INDEX idx_agents_description ON agents USING gin(to_tsvector('english', description));
```

## 🔗 Relationships

### Current Relationships
- **Projects**: Self-contained, no foreign key relationships
- **Blog Posts**: Self-contained, no foreign key relationships  
- **Agents**: Self-contained, no foreign key relationships

### Future Relationships (Planned)
```sql
-- User relationships (future)
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text,
  created_at timestamp with time zone DEFAULT now()
);

-- User-project relationships
CREATE TABLE user_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  project_id uuid REFERENCES projects(id),
  role text CHECK (role IN ('owner', 'collaborator', 'viewer')),
  created_at timestamp with time zone DEFAULT now()
);

-- Resource relationships (future)
CREATE TABLE resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  category text NOT NULL,
  type text NOT NULL,
  url text,
  file_url text,
  tags text[],
  author text,
  published boolean DEFAULT false,
  downloads_count integer DEFAULT 0,
  rating numeric(3,2),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

## 📊 Data Types

### PostgreSQL Types Used
- `uuid`: Unique identifiers
- `text`: Variable-length strings
- `text[]`: Arrays of strings
- `jsonb`: JSON objects (for flexible data)
- `boolean`: True/false values
- `timestamp with time zone`: Timestamps with timezone
- `integer`: Whole numbers
- `numeric`: Decimal numbers

### Custom Types
```sql
-- Status enums
CREATE TYPE project_status AS ENUM ('active', 'prototype', 'archived');
CREATE TYPE agent_status AS ENUM ('active', 'prototype', 'idea');
CREATE TYPE resource_type AS ENUM ('tool', 'framework', 'reference', 'template', 'tutorial');
```

## 🔍 Query Examples

### Basic Queries
```sql
-- Get all active projects
SELECT * FROM projects WHERE status = 'active' ORDER BY created_at DESC;

-- Get published blog posts
SELECT * FROM blog_posts WHERE published = true ORDER BY published_at DESC;

-- Get agents by category
SELECT * FROM agents WHERE category = 'Content Processing' ORDER BY name;
```

### Search Queries
```sql
-- Search projects by title or description
SELECT * FROM projects 
WHERE to_tsvector('english', title || ' ' || COALESCE(description, '')) @@ plainto_tsquery('search term');

-- Search blog posts by content
SELECT * FROM blog_posts 
WHERE to_tsvector('english', title || ' ' || COALESCE(content, '')) @@ plainto_tsquery('search term');
```

### Tag Queries
```sql
-- Get projects with specific tags
SELECT * FROM projects WHERE 'react' = ANY(tags);

-- Get all unique tags
SELECT DISTINCT unnest(tags) as tag FROM projects;
```

### Complex Queries
```sql
-- Get projects with GitHub integration
SELECT * FROM projects 
WHERE github_url IS NOT NULL 
AND status = 'active' 
ORDER BY created_at DESC;

-- Get recent blog posts with tags
SELECT title, slug, published_at, tags 
FROM blog_posts 
WHERE published = true 
ORDER BY published_at DESC 
LIMIT 10;
```

## 🔧 Database Management

### Backup and Restore
```bash
# Backup database
pg_dump -h your-project-id.supabase.co -U postgres -d postgres > backup.sql

# Restore database
psql -h your-project-id.supabase.co -U postgres -d postgres < backup.sql
```

### Migration Scripts
```sql
-- Add new column to existing table
ALTER TABLE projects ADD COLUMN featured boolean DEFAULT false;

-- Create new index
CREATE INDEX idx_projects_featured ON projects(featured);

-- Update existing data
UPDATE projects SET featured = true WHERE status = 'active' AND created_at > '2024-01-01';
```

### Performance Optimization
```sql
-- Analyze table statistics
ANALYZE projects;
ANALYZE blog_posts;
ANALYZE agents;

-- Vacuum tables
VACUUM projects;
VACUUM blog_posts;
VACUUM agents;
```

## 🔒 Security

### Row Level Security (RLS)
```sql
-- Enable RLS on tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

-- Create policies (future implementation)
CREATE POLICY "Public read access" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read access" ON blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Public read access" ON agents FOR SELECT USING (true);
```

### Data Validation
```sql
-- Check constraints
ALTER TABLE projects ADD CONSTRAINT check_slug_format CHECK (slug ~ '^[a-z0-9-]+$');
ALTER TABLE blog_posts ADD CONSTRAINT check_slug_format CHECK (slug ~ '^[a-z0-9-]+$');
ALTER TABLE agents ADD CONSTRAINT check_slug_format CHECK (slug ~ '^[a-z0-9-]+$');
```

## 📈 Monitoring

### Performance Queries
```sql
-- Check table sizes
SELECT 
  schemaname,
  tablename,
  attname,
  n_distinct,
  correlation
FROM pg_stats 
WHERE tablename IN ('projects', 'blog_posts', 'agents');

-- Check index usage
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes 
WHERE tablename IN ('projects', 'blog_posts', 'agents');
```

### Health Checks
```sql
-- Check for orphaned records
SELECT COUNT(*) FROM projects WHERE slug IS NULL;
SELECT COUNT(*) FROM blog_posts WHERE slug IS NULL;
SELECT COUNT(*) FROM agents WHERE slug IS NULL;

-- Check data integrity
SELECT COUNT(*) FROM projects WHERE status NOT IN ('active', 'prototype', 'archived');
SELECT COUNT(*) FROM agents WHERE status NOT IN ('active', 'prototype', 'idea');
```

## 🔄 Schema Evolution

### Version History
- **v0.1**: Initial schema with basic tables
- **v0.2**: Added tags and status fields
- **v0.3**: Added GitHub and Notion integration fields
- **v0.4**: Added agents table and enhanced indexes
- **v0.5**: Planned: User management and relationships

### Migration Strategy
1. **Backward Compatibility**: Maintain existing API contracts
2. **Gradual Migration**: Add new fields without breaking existing functionality
3. **Data Validation**: Ensure data integrity during migrations
4. **Rollback Plan**: Ability to revert schema changes if needed

---

**Last Updated**: December 2024  
**Schema Version**: v1.0  
**Next Update**: v0.5 - User Management 