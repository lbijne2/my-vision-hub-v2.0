# My Vision Hub

A personal and evolving digital platform that brings together creative, scientific, and visionary work across multiple domains. It serves as a central command center—both public and private—where projects, tools, agents, and reflections are integrated into a cohesive workspace.

## 🎯 Vision

My Vision Hub aims to present and structure ambitious ideas at the intersection of medicine, AI, design, ethics, and the future—offering a space for exploration, collaboration, and inspiration.

## 🚀 Features

### Current (v0.1)
- **Homepage** with hero section and featured projects
- **Responsive Navigation** with mobile hamburger menu
- **Modular Architecture** with clean component structure
- **Custom Design System** with Vision Hub color palette
- **Placeholder Pages** for all major sections

### Planned Features
- **Project Pages** with detailed narratives and progress tracking
- **Blog System** with Notion integration
- **Resource Library** with searchable tools and frameworks
- **Agentic Workflows** with AI-powered tools
- **Private Dashboard** with personal workspace
- **Future Scenarios** with speculative content

## 🛠 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui component library
- **TypeScript**: Full type safety
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
│   └── [sections]/     # Route pages (projects, blog, etc.)
├── components/         # Reusable components
│   ├── ui/            # shadcn/ui components
│   ├── Navigation.tsx # Main navigation component
│   └── ProjectCard.tsx # Project display component
├── lib/               # Utility functions
│   └── utils.ts       # Class name utilities
└── data/              # Static data files
    ├── projects.json  # Dummy project data
    └── posts.json     # Dummy blog post data
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

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

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 📋 Development Guidelines

- **Modular Architecture**: Each section/component lives in its own folder
- **TypeScript**: Full type safety throughout the codebase
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Component Isolation**: Each component should be previewable in isolation
- **Clean Commits**: Well-documented commit messages for version control

## 🎯 Versioning Plan

- **v0.1**: Basic architecture with homepage and navigation ✅
- **v0.2**: Add static project pages and blog routing
- **v0.3**: Implement Notion integration for blog drafts
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
# Add environment variables as needed for future integrations
```

### Tailwind Configuration
The project uses a custom Tailwind configuration with Vision Hub colors and extended theme options.

## 📝 Contributing

This is a personal project, but contributions and suggestions are welcome. Please ensure all code follows the established patterns and includes proper TypeScript types.

## 📄 License

This project is for personal use and development.

---

**My Vision Hub** - Where Vision Becomes Reality 