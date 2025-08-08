import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, Github, FileText, PenTool, Brain } from "lucide-react"

// GitHub Repository Card Skeleton
export function GitHubRepoSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-vision-charcoal flex items-center gap-2">
          <Github className="w-5 h-5" />
          <Skeleton className="h-5 w-32" />
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          <Skeleton className="h-4 w-48" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-8" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-12" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-18" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-9 w-full" />
      </CardContent>
    </Card>
  )
}

// Related Content Skeleton
export function RelatedContentSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-vision-charcoal">
          Related Content
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Projects Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-7 w-20" />
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-7 w-18" />
          </div>
        </div>

        {/* Blog Posts Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <PenTool className="w-4 h-4" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-7 w-28" />
            <Skeleton className="h-7 w-22" />
          </div>
        </div>

        {/* Milestones Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <Skeleton className="h-4 w-18" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-7 w-26" />
          </div>
        </div>

        {/* Agents Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            <Skeleton className="h-4 w-14" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-7 w-20" />
            <Skeleton className="h-7 w-18" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Mini Roadmap Skeleton
export function MiniRoadmapSkeleton() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card className="rounded-xl shadow-sm p-4">
          <CardHeader className="flex flex-col space-y-1.5 p-6 pb-4">
            <CardTitle className="text-2xl font-semibold leading-none tracking-tight text-vision-charcoal flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Mini Roadmap
            </CardTitle>
            <CardDescription className="text-sm text-vision-charcoal/70">
              Loading upcoming milestones...
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-vision-charcoal/20 rounded mb-2"></div>
                  <div className="h-3 bg-vision-charcoal/10 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

// Project Card Skeleton
export function ProjectCardSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex gap-2 flex-wrap">
          <Skeleton className="h-6 w-12" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-14" />
        </div>
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardContent>
    </Card>
  )
}

// Featured Projects Skeleton (for home page)
export function FeaturedProjectsSkeleton() {
  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-vision-charcoal mb-4">
            Featured Projects
          </h2>
          <p className="text-lg text-vision-charcoal/70 max-w-2xl mx-auto">
            Current explorations and ongoing work at the intersection of technology, 
            medicine, and human potential.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, index) => (
            <ProjectCardSkeleton key={index} />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Skeleton className="h-10 w-32 mx-auto" />
        </div>
      </div>
    </section>
  )
}

// Project Status Card Skeleton
export function ProjectStatusSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-vision-charcoal">
          Project Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-6 w-16" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardContent>
    </Card>
  )
}

// Timeline Skeleton
export function TimelineSkeleton() {
  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-vision-border"></div>
      
      <div className="space-y-8">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="relative">
            {/* Timeline dot */}
            <div className="absolute left-6 top-6 w-4 h-4 rounded-full border-4 border-white shadow-md z-10">
              <Skeleton className="w-full h-full rounded-full" />
            </div>

            {/* Timeline card */}
            <div className="ml-16">
              <Card className="p-6 bg-white/90 backdrop-blur-sm border-vision-border shadow-md">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-6 h-6" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-vision-charcoal/40" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-3/4" />
                    <div className="flex gap-1">
                      <Skeleton className="w-4 h-4 rounded-full" />
                      <Skeleton className="w-4 h-4 rounded-full" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </Card>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Blog Post Card Skeleton
export function BlogPostCardSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-2 flex-wrap">
          <Skeleton className="h-6 w-12" />
          <Skeleton className="h-6 w-16" />
        </div>
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardContent>
    </Card>
  )
}

// Agent Card Skeleton
export function AgentCardSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex gap-2 flex-wrap">
          <Skeleton className="h-6 w-12" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-14" />
        </div>
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardContent>
    </Card>
  )
}

// GitHub File Preview Skeleton
export function GitHubFilePreviewSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-vision-charcoal flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <Skeleton className="h-5 w-32" />
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          <Skeleton className="h-4 w-48" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-vision-charcoal/60">
            <span className="font-medium">Language:</span>
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </CardContent>
    </Card>
  )
}
