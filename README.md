# My Vision Hub

A personal and evolving digital platform that brings together creative, scientific, and visionary work across multiple domains. It serves as a central command center—both public and private—where projects, tools, agents, and reflections are integrated into a cohesive workspace.

## 🎯 Vision

My Vision Hub aims to present and structure ambitious ideas at the intersection of medicine, AI, design, ethics, and the future—offering a space for exploration, collaboration, and inspiration.

## 🚀 Features

### Current (v0.3)
- **Homepage** with hero section and featured projects
- **Responsive Navigation** with mobile hamburger menu
- **Dynamic Project Pages** with detailed content and markdown support
- **Blog System** with Notion integration for content management
- **Modular Architecture** with clean component structure
- **Custom Design System** with Vision Hub color palette
- **Placeholder Pages** for all major sections

### Planned Features
- **Resource Library** with searchable tools and frameworks
- **Agentic Workflows** with AI-powered tools
- **Private Dashboard** with personal workspace
- **Future Scenarios** with speculative content

## 🛠 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui component library
- **TypeScript**: Full type safety
- **Content Management**: Notion API integration
- **Markdown**: Custom markdown renderer
- **Deployment**: Vercel with preview builds

## 🎨 Design System

### Colors
- **Background**: Light beige (`#f9f5ef`)
- **Primary**: Muted ochre (`#e6c28b`)
- **Text**: Soft charcoal (`#333`)
- **Accent**: Muted navy (`#445566`)

### Typography
- **Headings**: IBM Plex Serif / Inter
- **Body**: Inter (clean sans-serif)

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── globals.css     # Global styles and CSS variables
│   ├── layout.tsx      # Root layout with navigation
│   ├── page.tsx        # Homepage
│   ├── projects/       # Project pages
│   │   ├── page.tsx    # Projects list
│   │   └── [slug]/     # Individual project pages
│   └── blog/           # Blog pages
│       ├── page.tsx    # Blog list
│       └── [slug]/     # Individual blog posts
├── components/         # Reusable components
│   ├── ui/            # shadcn/ui components
│   ├── Navigation.tsx # Main navigation component
│   ├── ProjectCard.tsx # Project display component
│   └── MarkdownRenderer.tsx # Markdown content renderer
├── lib/               # Utility functions
│   ├── utils.ts       # Class name utilities
│   ├── projects.ts    # Project data management
│   └── notion.ts      # Notion API integration
└── data/              # Static data files
    ├── projects.json  # Project data
    └── posts.json     # Blog post fallback data
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Notion account (for blog content management)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd my-vision-hub-v2.0
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (optional for blog):
```bash
cp NOTION_SETUP.md .env.local
# Edit .env.local with your Notion API credentials
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 📝 Blog Content Management

The blog system integrates with Notion for content management:

### Setup Notion Integration

1. Follow the setup guide in `NOTION_SETUP.md`
2. Create a Notion database with the required schema
3. Configure environment variables
4. Start publishing blog posts through Notion

### Features

- **Dynamic Content**: Blog posts pulled from Notion database
- **Fallback System**: Uses local JSON if Notion is unavailable
- **Markdown Support**: Rich text rendering with custom parser
- **SEO Friendly**: Proper meta tags and structured data
- **Responsive Design**: Works on all devices

### Blog Post Schema

Required Notion database properties:
- `title` (Title)
- `slug` (Text)
- `published` (Checkbox)
- `tags` (Multi-select)
- `date` (Date)
- `excerpt` (Text)
- `author` (Text)

## 📋 Development Guidelines

- **Modular Architecture**: Each section/component lives in its own folder
- **TypeScript**: Full type safety throughout the codebase
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Component Isolation**: Each component should be previewable in isolation
- **Clean Commits**: Well-documented commit messages for version control

## 🎯 Versioning Plan

- **v0.1**: Basic architecture with homepage and navigation ✅
- **v0.2**: Dynamic project pages with markdown support ✅
- **v0.3**: Notion integration for blog content management ✅
- **v0.4**: Add GitHub project previews and Supabase setup
- **v0.5**: Build Resource Library with search features
- **v0.6**: Introduce Future Scenarios with visuals
- **v0.7**: Scaffold Agentic Workflows Module
- **v0.8**: Add OpenAI-powered tool integration
- **v0.9**: Build Personal Dashboard UI
- **v1.0**: Complete role-based permissions and live integrations

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for local development:
```env
# Notion API Configuration (optional)
NOTION_API_KEY=your_notion_api_key_here
NOTION_BLOG_DB_ID=your_notion_database_id_here
NOTION_DEBUG=false
```

### Tailwind Configuration
The project uses a custom Tailwind configuration with Vision Hub colors and extended theme options.

## 📝 Contributing

This is a personal project, but contributions and suggestions are welcome. Please ensure all code follows the established patterns and includes proper TypeScript types.

## 📄 License

This project is for personal use and development.

---

**My Vision Hub** - Where Vision Becomes Reality 