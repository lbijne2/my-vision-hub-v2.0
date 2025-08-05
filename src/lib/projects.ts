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
    "in progress": "bg-blue-100 text-blue-800",
    "planning": "bg-yellow-100 text-yellow-800",
    "research": "bg-purple-100 text-purple-800",
    "completed": "bg-green-100 text-green-800",
  }
  
  return statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"
} 