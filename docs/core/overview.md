**MY VISION HUB**

---

**1. Vision**
My Vision Hub is a personal and evolving digital platform that brings together the user's creative, scientific, and visionary work across multiple domains. It serves as a central command center—both public and private—where projects, tools, agents, and reflections are integrated into a cohesive workspace. It aims to present and structure ambitious ideas at the intersection of medicine, AI, design, ethics, and the future—offering a space for exploration, collaboration, and inspiration.

**2. Objectives**

- Centralize all personal and professional workflows.
- Showcase ongoing and past projects in a narrative-driven format.
- Provide a playground for speculative ideas and future scenarios.
- Host a personal blog for reflective, opinionated, and analytical writing.
- Enable the use and triggering of intelligent tools and agentic workflows.
- Act as a prototype space for creative research, development, and collaboration.

**3. Platform Architecture**

**Core Sections:**

- **Homepage:**

  - Hero section with tagline and mission.
  - Featured projects or ideas.
  - Navigation to Blog, Projects, Resources, Agents.

- **Project Pages:**

  - Each project has its own URL and modular layout.
  - Includes narrative arc, images, embedded tools, progress updates.

- **Blog:**

  - Supports public and private posts.
  - Organized by tags/themes.
  - Integrates with Notion for drafting and publishing workflows.

- **Future Scenarios:**

  - Speculative ideas, visual metaphors, conceptual experiments.
  - Could evolve into a story-driven or multimedia section.

- **Collaborative Zone:**

  - Embedded tools like Cursor, GitHub links, Notion comments.
  - Optional user roles and permissions.

- **Resource Library:**

  - Curated list of tools, references, frameworks.
  - Searchable, filterable, and taggable.

- **Agentic Workflows Module:**

  - Centralized list of intelligent agents or workflow tools.
  - Each agent has metadata, documentation, and a trigger UI.
  - Supports integration with OpenAI API and external workflows.

- **Personal Dashboard (Private):**

  - Quick launch panel for agents and tools.
  - Feed of recent blog drafts, notes, or tasks.
  - Integration with Notion (resources, trackers).
  - Workspace overview with search across projects, references, GitHub.

**Integrations:**

- Notion API: Sync internal content, blog drafts, and resource libraries.
- GitHub API: Version-controlled code snippets and project displays.
- Supabase: Structured backend for content, metadata, permissions, and agent workflows.
- OpenAI API: Interactive tools, agents, summaries.
- VEO3 or other AI generation APIs: Visuals, summaries, speculative media.

**4. Technical Stack**

- **Frontend:** React + Tailwind CSS (clean aesthetic, component-based UI).
- **Backend:** Node.js with Supabase (PostgreSQL-based, scalable).
- **Integrations:**
  - Notion SDK for content retrieval.
  - GitHub REST API for project/code previews.
  - OpenAI API for intelligent interactions.
- **Deployment:** Vercel (for live preview, versioned deployments).

**5. Development Guidelines**

- Modular codebase: Each section/component lives in its own folder.
- Version control via GitHub with well-documented commits.
- Each feature starts from a clearly defined Cursor prompt.
- Use dummy/test data where integrations aren’t yet active.
- Each front-end component should be previewable in isolation.
- Ensure the main layout is mobile-responsive and visually cohesive.

**6. Preview & Testing Setup**

- Host on Vercel with preview branches enabled.
- Dev build should include:
  - Simulated blog post feed.
  - Dummy project pages.
  - Working navigation.
  - Placeholder Notion and GitHub blocks.
- Use Tailwind UI and ShadCN components for rapid prototyping.

**7. Versioning Plan**

- **v0.0:** Basic architecture with previews and basic integrations.
  - **v0.1:** Static homepage with top navigation and simple layout.
  - **v0.2:** Add one static project page and dummy blog feed with routing.
  - **v0.3:** Implement Notion integration for blog drafts and project notes.
  - **v0.4a:** Notion-powered content management with enhanced content detail pages.
  - **v0.4b:** Full Supabase database integration with type-safe operations.
  - **v0.4c:** Agentic Workflows Module with AI agent showcase and management.
  - **v0.4d:** GitHub integration with repository linking and code previews.
  - **v0.4e:** Interactive project filtering and search system.
  - **v0.5:** Enhanced project features with advanced GitHub integration and timelines.
  - **v0.6:** Resource Library with search, filtering, and download capabilities.
  - **v0.7:** Enhanced agents with interactive demos and OpenAI API integration.
  - **v0.8:** Personal Dashboard with analytics and private workspace features.
  - **v0.9:** Advanced AI integrations and collaborative zone features.
- **v1.0:** Complete role-based permission system and finalize Collaborative Zone with Notion/GitHub live syncing.

---

This file should be updated as new elements emerge during development and concept refinement.

