# My Vision Hub v2.0

A personal digital platform showcasing projects, thoughts, and resources at the intersection of technology, medicine, design, and human potential.

## 🚀 Current Version: v0.5a

**Latest Features:**
- ✅ **v0.1**: Basic architecture with homepage and navigation
- ✅ **v0.2**: Dynamic project pages with markdown support
- ✅ **v0.3**: Notion integration for blog content management
- ✅ **v0.4a**: Notion integration for project content management
- ✅ **v0.4c**: Agentic workflows module with AI agents showcase
- ✅ **v0.4b**: Full Supabase integration with graceful fallbacks
- ✅ **v0.4d**: GitHub Integration for Project
- ✅ **v0.4e**: Interactive Project Filtering & Search System

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS with custom Vision Hub color palette
- **UI Components**: shadcn/ui component system
- **Database**: Supabase (PostgreSQL) with real-time capabilities
- **Content Management**: Notion API integration (fallback)
- **Markdown Rendering**: react-markdown with custom styling
- **Deployment**: Vercel (with preview builds)

## 🎨 Design System

**Color Palette:**
- Light beige: `#f9f5ef`
- Muted ochre: `#e6c28b`
- Soft charcoal: `#333333`
- Muted navy: `#445566`
- Pastel accents for badges and highlights

**Typography:**
- Headings: IBM Plex Serif / Inter
- Body: Inter (clean sans-serif)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── blog/              # Blog section with Supabase integration
│   ├── projects/          # Projects section with filtering & search
│   ├── agents/            # AI agents section with Supabase integration
│   ├── resources/         # Resources section (coming soon)
│   └── dashboard/        # Private dashboard (coming soon)
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── Navigation.tsx    # Main navigation
│   ├── ProjectCard.tsx   # Project display component
│   ├── ProjectFilters.tsx # Project filtering & search system
│   ├── BlogPostCard.tsx  # Blog post display component
│   └── MarkdownRenderer.tsx # Enhanced markdown rendering
├── lib/                  # Utility functions and API clients
│   ├── supabase.ts       # Supabase client configuration
│   ├── notion.ts         # Notion API integration (fallback)
│   ├── agents.ts         # Agent data management
│   ├── projects.ts       # Project data management
│   └── utils.ts          # Helper functions
├── types/                # TypeScript type definitions
│   └── index.ts          # Database and API interfaces
└── data/                 # Fallback data (JSON files)
    ├── projects.json     # Project fallback data
    ├── posts.json        # Blog post fallback data
    └── agents.json       # Agent fallback data
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (for database)
- Notion account (optional, for fallback)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd my-vision-hub-v2.0
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file with:
   ```bash
   # Supabase Configuration (required)
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Notion Configuration (optional - for fallback)
   NOTION_API_KEY=your_notion_integration_token
   NOTION_BLOG_DB_ID=your_blog_database_id
   NOTION_PROJECT_DB_ID=your_project_database_id
   ```

4. **Set up Supabase database:**
   Follow the [Supabase Setup Guide](./SUPABASE_SETUP.md) to create tables and add sample data.

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to `http://localhost:3000`

## 📝 Content Management

### Supabase Database (Primary)
- **Setup Guide**: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- **Features**: Real-time database with PostgreSQL
- **Tables**: `agents`, `projects`, `blog_posts`
- **Fallback**: Local JSON data if Supabase is unavailable

### Notion Integration (Fallback)
- **Setup Guide**: [NOTION_SETUP.md](./NOTION_SETUP.md)
- **Features**: Content management via Notion
- **Fallback**: Local JSON data if Notion is unavailable

## 🎯 Key Features

### ✅ Completed Features

**v0.1 - Foundation**
- Responsive homepage with hero section
- Navigation with active link styling
- Mobile hamburger menu
- Modular component architecture
- Vision Hub design system

**v0.2 - Project Pages**
- Dynamic project detail pages (`/projects/[slug]`)
- Markdown content rendering
- Project status badges and tags
- Responsive project cards
- Fallback error handling

**v0.3 - Blog Integration**
- Notion-powered blog content management
- Dynamic blog post rendering
- Rich markdown support with custom styling
- Blog post cards with metadata
- Loading states and error handling

**v0.4a - Project Integration**
- Notion-powered project content management
- Enhanced project detail pages
- Project status management
- Cover image support
- Comprehensive fallback system

**v0.4c - Agentic Workflows**
- AI agent showcase with detailed descriptions
- Agent status management (active, prototype, idea)
- Input/output specification display
- Example use cases and workflows
- Category-based organization

**v0.4b - Supabase Integration**
- Full Supabase database integration
- Real-time data capabilities
- Graceful fallback system
- Type-safe database operations
- Performance optimized queries

**v0.4d - GitHub Integration**
- GitHub repository linking and display
- Repository metadata integration (stars, forks, language)
- Code preview capabilities with syntax highlighting
- GitHub API integration for real-time repository data
- Repository status indicators and badges
- Direct links to GitHub repositories from project cards

**v0.4e - Project Filtering & Search** 🆕
- **Interactive Search Bar**: Real-time search across titles, subtitles, descriptions, and tags
- **Tag-Based Filtering**: Multi-select tag filtering with visual feedback
- **Status Filters**: Filter by Active, Prototype, or Archived status
- **Results Counter**: Shows filtered vs total project count
- **Clear All Filters**: One-click reset functionality
- **Responsive Design**: Smooth animations and Vision Hub design language
- **Performance Optimized**: Efficient filtering with useMemo hooks

**v0.5a - GitHub File Preview Integration** 🆕
- **Single File Preview**: Preview specific files from GitHub repositories with syntax highlighting
- **Repository Browser**: Interactive file browser to explore and preview any file in the repository
- **Syntax Highlighting**: Support for 40+ programming languages with proper highlighting
- **File Search**: Search functionality to quickly find files in repositories
- **Breadcrumb Navigation**: Easy navigation through directory structure
- **Automatic Language Detection**: File type detection based on extension
- **Error Handling**: Graceful fallback for private repos, missing files, or API errors
- **Loading States**: Skeleton loading UI for better user experience
- **Notion Integration**: New `GitHub Preview Path` field in Projects database

### 🚧 Upcoming Features

**v0.5 - Enhanced Project Features**
- ✅ GitHub file preview integration with syntax highlighting
- Interactive project timelines
- Related projects suggestions
- Advanced sorting options
- Project analytics and insights

**v0.6 - Resources Section**
- Resource library with categorization
- Download and sharing capabilities
- Search and filtering
- User interaction tracking

**v0.7 - Enhanced Agents**
- Interactive agent demos and testing
- Custom agent creation interface
- Agent performance analytics
- OpenAI API integration

## 🗄️ Database Schema

### Agents Table
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

### Projects Table
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

### Blog Posts Table
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

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### TypeScript
The project uses TypeScript for type safety. Run type checking with:
```bash
npx tsc --noEmit
```

### Styling
- Tailwind CSS for utility-first styling
- Custom Vision Hub color palette
- shadcn/ui components for consistency
- Responsive design throughout

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Notion Configuration (optional)
NOTION_API_KEY=your_notion_integration_token
NOTION_BLOG_DB_ID=your_blog_database_id
NOTION_PROJECT_DB_ID=your_project_database_id
```

## 📚 Documentation

Comprehensive documentation is available in the [`docs/`](./docs/) directory:

### 🎯 Core Documentation
- **[Project Overview](./docs/core/overview.md)** - Vision, objectives, and platform architecture
- **[Architecture Guide](./docs/core/architecture.md)** - Technical architecture and system design
- **[Cursor Guidelines](./docs/core/cursor-guidelines.md)** - AI-assisted development principles
- **[AI Development Guide](./docs/core/ai-development-guide.md)** - Using documentation with AI tools

### 🛠️ Setup & Configuration
- **[Getting Started](./docs/setup/getting-started.md)** - Quick start guide for developers
- **[Environment Setup](./docs/setup/environment-setup.md)** - Environment variables and configuration
- **[Database Setup](./docs/setup/database-setup.md)** - Supabase database configuration
- **[Notion Integration](./docs/setup/notion-integration.md)** - Notion API setup and usage

### 📋 Feature Documentation
- **[Projects Module](./docs/features/projects.md)** - Project management and display
- **[Blog Module](./docs/features/blog.md)** - Blog content management
- **[Agents Module](./docs/features/agents.md)** - AI agents and workflows
- **[Resources Module](./docs/features/resources.md)** - Resource library management
- **[GitHub Integration](./docs/features/github-integration.md)** - GitHub repository integration

### 🔧 Technical Reference
- **[API Reference](./docs/technical/api-reference.md)** - API endpoints and data structures
- **[Database Schema](./docs/technical/database-schema.md)** - Database tables and relationships
- **[Deployment Guide](./docs/technical/deployment.md)** - Production deployment instructions

### 📖 History & Migration
- **[Version History](./docs/history/version-history.md)** - Release notes and changelog
- **[Migration Guides](./docs/migrations/)** - Database and feature migrations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🎯 Roadmap

- **v0.5**: Enhanced project features (advanced GitHub integration, timelines, analytics)
- **v0.6**: Resources section with library management
- **v0.7**: Enhanced agents with OpenAI integration
- **v0.8**: Dashboard with analytics and management
- **v1.0**: Full feature set with advanced integrations

---

**Built with ❤️ using Next.js, Tailwind CSS, Supabase, and Notion API** 