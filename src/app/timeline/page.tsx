"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, Loader2, FileText, Brain, PenTool } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { TimelineSkeleton } from "@/components/ui/loading-skeletons"
import LinkedItemIcons from "@/components/LinkedItemIcons"
import { 
  formatDate, 
  getTypeLabel,
  type TimelineEntry 
} from "@/lib/timeline"

// Helper function to get minimalistic icon for each type
const getTimelineIcon = (type: string) => {
  switch (type) {
    case 'project':
      return <FileText className="w-6 h-6 text-vision-charcoal" />
    case 'agent':
      return <Brain className="w-6 h-6 text-vision-charcoal" />
    case 'post':
      return <PenTool className="w-6 h-6 text-vision-charcoal" />
    case 'milestone':
      return <Calendar className="w-6 h-6 text-vision-charcoal" />
    default:
      return <FileText className="w-6 h-6 text-vision-charcoal" />
  }
}

// Filter options
const filterOptions = [
  { value: 'all', label: 'All' },
  { value: 'project', label: 'Projects' },
  { value: 'agent', label: 'Agents' },
  { value: 'post', label: 'Posts' },
  { value: 'milestone', label: 'Milestones' }
]

export default function TimelinePage() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [allEntries, setAllEntries] = useState<TimelineEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dataSource, setDataSource] = useState<'notion' | 'fallback' | 'mixed' | null>(null)

  // Load timeline entries on component mount
  useEffect(() => {
    const loadTimelineEntries = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Check Notion configuration status
        let notionStatus = null
        try {
          const statusResponse = await fetch('/api/notion-status')
          notionStatus = await statusResponse.json()
        } catch (error) {
          // Silently handle notion status check failure
        }
        
        // Fetch timeline entries from API
        const response = await fetch('/api/timeline')
        if (!response.ok) {
          throw new Error('Failed to fetch timeline data')
        }
        const data = await response.json()
        const entries = data.entries
        setAllEntries(entries)
        
        // Determine data source based on entry IDs
        const determineDataSource = (entries: TimelineEntry[]) => {
          const hasNotionIds = entries.some(entry => {
            // Notion page IDs are 36-char UUID-like; local fallback ids are like "project-1", "agent-1", etc.
            const looksLikeNotionId = (id: string) => id.length >= 30 && !id.match(/^(project|agent|post|milestone)-\d+$/)
            return looksLikeNotionId(entry.id)
          })
          
          const hasLocalIds = entries.some(entry => {
            const looksLikeLocalId = (id: string) => id.match(/^(project|agent|post|milestone)-\d+$/)
            return looksLikeLocalId(entry.id)
          })
          
          if (hasNotionIds && hasLocalIds) return 'mixed'
          if (hasNotionIds) return 'notion'
          if (hasLocalIds) return 'fallback'
          return 'fallback'
        }
        
        const source = determineDataSource(entries)
        setDataSource(source)
        
      } catch (err) {
        console.error('Error loading timeline entries:', err)
        setError('Failed to load timeline entries')
      } finally {
        setIsLoading(false)
      }
    }

    loadTimelineEntries()
  }, [])

  // Filter entries based on active filter
  const filteredEntries = useMemo(() => {
    if (activeFilter === 'all') return allEntries
    return allEntries.filter(entry => entry.type === activeFilter)
  }, [allEntries, activeFilter])

  // Group entries by future/past and sort them
  const organizedEntries = useMemo(() => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    const futureEntries = filteredEntries
      .filter(entry => {
        const entryDate = new Date(entry.date)
        return entryDate >= today
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // Future: ascending (earliest first)
    
    const pastEntries = filteredEntries
      .filter(entry => {
        const entryDate = new Date(entry.date)
        return entryDate < today
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Past: descending (most recent first)
    
    return { futureEntries, pastEntries }
  }, [filteredEntries])

  // Render timeline entry component
  const renderTimelineEntry = (entry: TimelineEntry, index: number) => (
    <motion.div
      key={entry.id}
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative"
    >
      {/* Timeline dot */}
      <div className="absolute left-6 top-6 w-4 h-4 rounded-full border-4 border-white shadow-md z-10">
        <div className={`w-full h-full rounded-full ${entry.color}`}></div>
      </div>

      {/* Content */}
      <div className="ml-16">
        <Card className="p-6 bg-white/90 backdrop-blur-sm border-vision-border shadow-md hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {getTimelineIcon(entry.type)}
              <div>
                <Badge 
                  variant="secondary" 
                  className={`${entry.color} text-vision-charcoal border-0`}
                >
                  {getTypeLabel(entry.type)}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-vision-charcoal/60">
              <Calendar className="w-4 h-4" />
              {formatDate(entry.date)}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center">
              <h3 className="text-xl font-semibold text-vision-charcoal">
                {entry.slug ? (
                  <Link 
                    href={entry.type === 'milestone' ? `/${entry.slug}` : `/${entry.type === 'post' ? 'blog' : entry.type}s/${entry.slug}`}
                    className="hover:text-vision-ochre transition-colors duration-200"
                  >
                    {entry.title}
                  </Link>
                ) : (
                  entry.title
                )}
              </h3>
              {/* Linked Item Icons */}
              {entry.linked_items && entry.linked_items.length > 0 && (
                <LinkedItemIcons linkedItems={entry.linked_items} />
              )}
            </div>
            
            {entry.description && (
              <p className="text-vision-charcoal/70 leading-relaxed">
                {entry.description}
              </p>
            )}
          </div>
        </Card>
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen pastel-cream">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-vision-charcoal mb-4">
            Vision Hub Timeline
          </h1>
          <p className="text-lg text-vision-charcoal/70 max-w-2xl mx-auto mb-4">
            Explore the journey of ideas, projects, and milestones that shape the Vision Hub ecosystem.
          </p>
          

        </div>

        {/* Filter Controls */}
        <div className="flex justify-center mb-8">
          <div className="flex flex-wrap gap-2 bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-md">
            {filterOptions.map((option) => (
              <Button
                key={option.value}
                variant={activeFilter === option.value ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveFilter(option.value)}
                className={activeFilter === option.value 
                  ? "bg-vision-ochre text-white hover:bg-vision-ochre/90" 
                  : "text-vision-charcoal hover:text-vision-ochre"
                }
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-vision-border"></div>

          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <TimelineSkeleton />
              </motion.div>
            ) : error ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-xl font-semibold text-vision-charcoal mb-2">
                  Error loading timeline
                </h3>
                <p className="text-vision-charcoal/60 mb-4">
                  {error}
                </p>
                <Button 
                  onClick={() => window.location.reload()}
                  className="bg-vision-ochre text-white hover:bg-vision-ochre/90"
                >
                  Try Again
                </Button>
              </motion.div>
            ) : filteredEntries.length > 0 ? (
              <motion.div
                key={activeFilter}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Future Entries */}
                {organizedEntries.futureEntries.length > 0 ? (
                  <>
                    {organizedEntries.futureEntries.map((entry, index) => (
                      <div key={entry.id} className="relative">
                        {renderTimelineEntry(entry, index)}
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="text-center py-8 text-vision-charcoal/40">
                    <p>No upcoming events scheduled</p>
                  </div>
                )}

                {/* Divider with Future/Past Labels */}
                {organizedEntries.futureEntries.length > 0 && organizedEntries.pastEntries.length > 0 && (
                  <div className="relative py-0">
                    {/* Timeline line continues through divider */}
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-vision-border"></div>
                    
                    {/* Past label below divider */}
                    <div className="absolute left-0 top-1 text-sm font-medium text-vision-charcoal/60">
                      Past
                    </div>
                    
                    {/* Horizontal divider line - thinner and closer spacing */}
                    <div className="ml-0">
                      <div className="h-px bg-vision-charcoal/30 w-full border-t border-vision-charcoal/10"></div>
                    </div>
                    
                    {/* Future label above divider */}
                    <div className="absolute left-0 bottom-1 text-sm font-medium text-vision-charcoal/60">
                      Future
                    </div>
                  </div>
                )}

                {/* Past Entries */}
                {organizedEntries.pastEntries.length > 0 ? (
                  <>
                    {organizedEntries.pastEntries.map((entry, index) => (
                      <div key={entry.id} className="relative">
                        {renderTimelineEntry(entry, index)}
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="text-center py-8 text-vision-charcoal/40">
                    <p>No recent activity to display</p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-xl font-semibold text-vision-charcoal mb-2">
                  Nothing to display yet
                </h3>
                <p className="text-vision-charcoal/60 mb-4">
                  No entries match the current filter or there are no published entries available.
                </p>
                <div className="space-y-2 text-sm text-vision-charcoal/40">
                  <p>• Check if content is marked as published in Notion</p>
                  <p>• Verify your Notion integration is configured</p>
                  <p>• Try selecting a different filter category</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
} 