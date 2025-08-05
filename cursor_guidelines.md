**MY VISION HUB – CURSOR IMPLEMENTATION GUIDELINES**

---

**1. General Goals**
- Build an extensible and scalable personal workspace platform that serves as both a public-facing hub and private control center.
- Ensure seamless integration with core back-end services:
  - **Notion** for content management, research, and blog drafting.
  - **Supabase** for structured databases, permission layers, and agent schemas.
  - **GitHub** for live previews of code-related projects and embedded version control.
  - **OpenAI API** for triggering intelligent workflows and assistants.
- Support a modular, component-based architecture for flexibility and reuse.

---

**2. Development Principles**
- **DRY (Don't Repeat Yourself)**: Favor reusable components, shared logic, and dynamic layouts.
- **KISS (Keep It Simple, Scalable)**: Avoid over-engineering. Solutions should be extensible but minimal at first implementation.
- **Progressive Enhancement**: Start with functional placeholders and replace with integrations step-by-step.
- **Isolated Testing**: Every UI component should be previewable in isolation and testable without external dependencies.
- **Explicit Fallbacks**: For all integrations, include placeholder components and loading states to avoid UI failures.
- **Consistent Data Flow**: Centralize state management and ensure clean separation between content, layout, and logic.

---

**3. Visual & UX Style Guide**
- **Design Aesthetic:**
  - Inspired by Anthropic: clean, calm, modern minimalism with retro undertones.
  - Use warm neutrals, soft gradients, and simple microinteractions.
- **Typography:**
  - Headers: IBM Plex Serif or Inter (serif for editorial feel)
  - Body: Sans-serif with high legibility
- **Layout Guidelines:**
  - Plenty of white space
  - Soft box shadows and rounded corners (`rounded-2xl` preferred)
  - Grid or card-based UI for content previews
- **Dark Mode Support:**
  - Use Tailwind's `dark:` utilities
  - Ensure good contrast and accessible colors

---

**4. File & Folder Structure**
- `/components`: All UI components, organized by type or page.
- `/data`: Static or placeholder data in JSON format.
- `/app`: Route-based pages using Next.js App Router.
- `/lib`: Utilities (API clients, fetchers, helpers).
- `/styles`: Global styles (Tailwind, fonts, tokens).

---

**5. Notion Integration Guidelines**
- Notion is the central source of truth for internal documentation, resource tracking, blog drafts, and project notes.
- Any page or module that involves content creation or knowledge management should, by default, pull from or sync with Notion.
- Structure blog posts, project notes, and resource libraries as Notion databases.
- Each database entry should include at minimum: `title`, `slug`, `published`, `content`, `tags`, and `type` (if multi-type content is stored).
- Prioritize robust and reliable server-side caching or ISR (Incremental Static Regeneration) strategies to ensure performance.
- Ensure graceful fallback to local dummy data or default state if Notion content cannot load.
- Prefer Markdown rendering or portable Notion-compatible components for displaying Notion content.
- Notion integration is considered a core functionality and must be supported at both the back-end and front-end level in early development phases.

---

**6. Version Control and Collaboration**
- Use feature branches with clear naming: `feat/blog-preview`, `fix/navbar-mobile`, etc.
- Keep commits atomic and well-commented.
- Enable Vercel previews per branch to test in production-like environments.

---

This file should be reviewed and updated at every major project milestone. Cursor-generated code must comply with these practices unless explicitly instructed otherwise.

