import projectsData from "@/data/projects.json"

export interface Project {
  id: string
  slug: string
  title: string
  subtitle: string
  description: string
  category: string
  status: string
  image: string
  coverImage: string
  tags: string[]
  date: string
  content: string
}

export function getAllProjects(): Project[] {
  return projectsData as Project[]
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projectsData.find((project) => project.slug === slug) as Project | undefined
}

export function getProjectSlugs(): string[] {
  return projectsData.map((project) => project.slug)
}

export function getStatusColor(status: string): string {
  const statusColors = {
    "in progress": "bg-pastel-sky text-vision-charcoal",
    "planning": "bg-pastel-peach text-vision-charcoal",
    "research": "bg-pastel-lavender text-vision-charcoal",
    "completed": "bg-pastel-mint text-vision-charcoal",
  }
  
  return statusColors[status as keyof typeof statusColors] || "bg-pastel-cream text-vision-charcoal"
} 