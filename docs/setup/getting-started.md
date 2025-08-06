# My Vision Hub v2.0 - Getting Started

Welcome to My Vision Hub v2.0! This guide will help you set up the development environment and get started with the project.

## 🚀 Quick Start

### Prerequisites
- **Node.js**: 18+ (recommended: latest LTS)
- **npm**: 8+ or **yarn**: 1.22+
- **Git**: For version control
- **Code Editor**: VS Code with recommended extensions

### Recommended VS Code Extensions
- **TypeScript**: Built-in support
- **Tailwind CSS IntelliSense**: For Tailwind classes
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **GitLens**: Enhanced Git integration

## 📦 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd my-vision-hub-v2.0
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:

```bash
# Supabase Configuration (required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Notion Configuration (optional - for fallback)
NOTION_API_KEY=your_notion_integration_token
NOTION_BLOG_DB_ID=your_blog_database_id
NOTION_PROJECT_DB_ID=your_project_database_id
```

### 4. Start Development Server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗄️ Database Setup

### Supabase Setup (Required)

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Run Database Migrations**
   Follow the [Database Setup Guide](./database-setup.md) to create tables and add sample data.

3. **Verify Connection**
   - Check the `/api/projects` endpoint
   - Verify data appears in the projects page

### Notion Setup (Optional)

1. **Create Notion Integration**
   - Go to [notion.so/my-integrations](https://notion.so/my-integrations)
   - Create a new integration
   - Get your integration token

2. **Set Up Databases**
   - Create databases for blog posts and projects
   - Share databases with your integration
   - Note the database IDs

3. **Test Integration**
   - Check the `/api/notion-status` endpoint
   - Verify fallback data works

## 🏗️ Project Structure

### Key Directories
```
src/
├── app/                    # Next.js App Router pages
│   ├── blog/              # Blog section
│   ├── projects/          # Projects section
│   ├── agents/            # AI agents section
│   └── api/              # API routes
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   └── [custom components]
├── lib/                  # Utility functions
├── types/                # TypeScript definitions
└── data/                 # Fallback JSON data
```

### Key Files
- `src/app/layout.tsx` - Root layout component
- `src/app/page.tsx` - Homepage
- `src/components/Navigation.tsx` - Main navigation
- `src/lib/supabase.ts` - Supabase client
- `src/lib/notion.ts` - Notion API client

## 🎨 Development Workflow

### 1. Understanding the Architecture
- **Read the [Architecture Guide](./architecture.md)** for system design
- **Review [Cursor Guidelines](./cursor-guidelines.md)** for development practices
- **Check [Project Overview](./overview.md)** for vision and roadmap

### 2. Making Changes
```bash
# Create a feature branch
git checkout -b feat/your-feature-name

# Make your changes
# Follow the established patterns in cursor-guidelines.md

# Test your changes
npm run dev

# Commit with clear messages
git commit -m "feat: add new feature description"

# Push and create PR
git push origin feat/your-feature-name
```

### 3. Code Standards
- **TypeScript**: All code must be properly typed
- **ESLint**: Run `npm run lint` before committing
- **Prettier**: Code formatting is automatic
- **Documentation**: Update docs alongside code changes

## 🔧 Development Commands

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Type Checking
```bash
# Check TypeScript types
npx tsc --noEmit

# Check for type errors
npx tsc --noEmit --strict
```

### Database Operations
```bash
# Test Supabase connection
curl http://localhost:3000/api/projects

# Test Notion connection
curl http://localhost:3000/api/notion-status
```

## 🧪 Testing Your Setup

### 1. Verify Database Connection
- Visit `/projects` - should show project data
- Visit `/blog` - should show blog posts
- Visit `/agents` - should show AI agents

### 2. Test Fallback System
- Temporarily disable Supabase in `.env.local`
- Verify fallback data appears
- Re-enable Supabase

### 3. Test API Endpoints
```bash
# Test projects API
curl http://localhost:3000/api/projects

# Test blog API
curl http://localhost:3000/api/blog

# Test agents API
curl http://localhost:3000/api/agents
```

## 🐛 Troubleshooting

### Common Issues

**Database Connection Errors**
```bash
# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# Verify Supabase project is active
# Check network connectivity
```

**Build Errors**
```bash
# Clear Next.js cache
rm -rf .next
npm run dev

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**TypeScript Errors**
```bash
# Check for type errors
npx tsc --noEmit

# Update types if needed
npm install @types/node @types/react
```

### Getting Help
1. **Check Documentation**: Review relevant docs in `/docs`
2. **Search Issues**: Look for similar issues in the repository
3. **Create Issue**: Provide detailed error information
4. **Ask Questions**: Use the project discussion board

## 📚 Next Steps

### For New Developers
1. **Read the Documentation**: Start with [Project Overview](./overview.md)
2. **Explore the Codebase**: Understand the component structure
3. **Make Small Changes**: Start with UI improvements
4. **Add Features**: Follow the roadmap in overview.md

### For Contributors
1. **Review Roadmap**: Check upcoming features in overview.md
2. **Pick an Issue**: Start with good first issues
3. **Follow Guidelines**: Use cursor-guidelines.md for development
4. **Update Documentation**: Keep docs current with changes

### For Maintainers
1. **Review Architecture**: Ensure changes align with system design
2. **Update Roadmap**: Keep overview.md current
3. **Maintain Quality**: Enforce coding standards
4. **Plan Releases**: Coordinate feature releases

## 🔗 Useful Resources

### Documentation
- [Project Overview](./overview.md) - Vision and objectives
- [Architecture Guide](./architecture.md) - System design
- [Cursor Guidelines](./cursor-guidelines.md) - Development practices
- [Database Setup](./database-setup.md) - Database configuration

### External Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Notion API Documentation](https://developers.notion.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Development Tools
- [Vercel Dashboard](https://vercel.com) - Deployment
- [Supabase Dashboard](https://supabase.com/dashboard) - Database
- [Notion Integrations](https://notion.so/my-integrations) - API setup

---

**Need Help?** Check the documentation or create an issue in the repository.

**Last Updated**: December 2024  
**Version**: v0.4e 