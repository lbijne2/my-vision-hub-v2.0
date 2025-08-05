# My Vision Hub v2.0

A personal digital platform showcasing projects, thoughts, and resources at the intersection of technology, medicine, design, and human potential.

## 🚀 Current Version: v0.4a

**Latest Features:**
- ✅ **v0.1**: Basic architecture with homepage and navigation
- ✅ **v0.2**: Dynamic project pages with markdown support
- ✅ **v0.3**: Notion integration for blog content management
- ✅ **v0.4a**: Notion integration for project content management

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS with custom Vision Hub color palette
- **UI Components**: shadcn/ui component system
- **Content Management**: Notion API integration
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
│   ├── blog/              # Blog section with Notion integration
│   ├── projects/          # Projects section with Notion integration
│   ├── resources/         # Resources section (coming soon)
│   ├── agents/           # AI agents section (coming soon)
│   └── dashboard/        # Private dashboard (coming soon)
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── Navigation.tsx    # Main navigation
│   ├── ProjectCard.tsx   # Project display component
│   ├── BlogPostCard.tsx  # Blog post display component
│   └── MarkdownRenderer.tsx # Enhanced markdown rendering
├── lib/                  # Utility functions and API clients
│   ├── notion.ts         # Notion API integration
│   └── utils.ts          # Helper functions
└── data/                 # Fallback data (JSON files)
    ├── projects.json     # Project fallback data
    └── posts.json        # Blog post fallback data
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Notion account (for content management)

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
   # Notion API Configuration
   NOTION_API_KEY=your_notion_integration_token
   NOTION_BLOG_DB_ID=your_blog_database_id
   NOTION_PROJECT_DB_ID=your_project_database_id
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:3000`

## 📝 Content Management

### Blog Content (Notion Integration)
- **Setup Guide**: [NOTION_SETUP.md](./NOTION_SETUP.md)
- **Features**: Dynamic blog posts with markdown rendering
- **Fallback**: Local `posts.json` if Notion is unavailable

### Project Content (Notion Integration)
- **Setup Guide**: [NOTION_PROJECT_SETUP.md](./NOTION_PROJECT_SETUP.md)
- **Features**: Dynamic project pages with rich content
- **Fallback**: Local `projects.json` if Notion is unavailable

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

### 🚧 Upcoming Features

**v0.4b - Enhanced Project Features**
- GitHub integration for code previews
- Project filtering and search
- Interactive project timelines
- Related projects suggestions

**v0.5 - Resources Section**
- Resource library with categorization
- Download and sharing capabilities
- Search and filtering
- User interaction tracking

**v0.6 - AI Agents**
- Interactive AI agent demos
- Agent comparison tools
- Custom agent creation interface
- Performance analytics

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
NOTION_API_KEY=your_notion_integration_token
NOTION_BLOG_DB_ID=your_blog_database_id
NOTION_PROJECT_DB_ID=your_project_database_id
```

## 📚 Documentation

- [Notion Blog Setup](./NOTION_SETUP.md) - Complete guide for blog integration
- [Notion Project Setup](./NOTION_PROJECT_SETUP.md) - Complete guide for project integration
- [Overview](./overview.md) - Project vision and architecture

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🎯 Roadmap

- **v0.4b**: Enhanced project features (GitHub integration, filtering)
- **v0.5**: Resources section with library management
- **v0.6**: AI agents showcase and tools
- **v0.7**: Dashboard with analytics and management
- **v1.0**: Full feature set with advanced integrations

---

**Built with ❤️ using Next.js, Tailwind CSS, and Notion API** 