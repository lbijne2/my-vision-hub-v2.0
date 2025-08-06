import Link from 'next/link'
import { FileText, Calendar, Brain, ExternalLink } from 'lucide-react'

interface RelatedContentProps {
  relatedProjects?: string[]
  relatedBlogPosts?: string[]
  relatedMilestones?: string[]
  relatedAgents?: string[]
  className?: string
}

const RelatedContent = ({ 
  relatedProjects, 
  relatedBlogPosts, 
  relatedMilestones, 
  relatedAgents,
  className = ""
}: RelatedContentProps) => {
  const hasRelatedContent = relatedProjects?.length || relatedBlogPosts?.length || relatedMilestones?.length || relatedAgents?.length

  console.log('RelatedContent component props:', {
    relatedProjects,
    relatedBlogPosts,
    relatedMilestones,
    relatedAgents,
    hasRelatedContent
  })

  if (!hasRelatedContent) {
    console.log('RelatedContent: No related content found, returning null')
    return null
  }

  const renderRelatedSection = (items: string[], title: string, icon: React.ReactNode, hrefPrefix: string) => {
    if (!items?.length) return null

    return (
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-vision-charcoal mb-2 flex items-center gap-2">
          {icon}
          {title}
        </h3>
        <div className="flex flex-wrap gap-2">
          {items.map((slug) => (
            <Link
              key={slug}
              href={`${hrefPrefix}/${slug}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-pastel-sky text-vision-charcoal rounded-xl hover:bg-pastel-mint transition-colors duration-200"
            >
              <ExternalLink className="w-3 h-3" />
              {slug}
            </Link>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`rounded-lg border bg-card text-card-foreground shadow-sm p-6 ${className}`}>
      <h2 className="text-lg font-semibold text-vision-charcoal mb-4">Related Content</h2>
      
      {renderRelatedSection(relatedProjects || [], 'Projects', <FileText className="w-4 h-4" />, '/projects')}
      {renderRelatedSection(relatedBlogPosts || [], 'Blog Posts', <FileText className="w-4 h-4" />, '/blog')}
      {renderRelatedSection(relatedMilestones || [], 'Milestones', <Calendar className="w-4 h-4" />, '/timeline')}
      {renderRelatedSection(relatedAgents || [], 'Agents', <Brain className="w-4 h-4" />, '/agents')}
    </div>
  )
}

export default RelatedContent 