"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, Loader2, FileText, Brain, PenTool, Flag } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
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

  // Load timeline entries on component mount
  useEffect(() => {
    const loadTimelineEntries = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Check Notion configuration status
        try {
          const statusResponse = await fetch('/api/notion-status')
          const status = await statusResponse.json()
          console.log('Notion configuration status:', status)
        } catch (error) {
          console.log('Could not check Notion status:', error)
        }
        
        // Fetch timeline entries from API
        const response = await fetch('/api/timeline')
        if (!response.ok) {
          throw new Error('Failed to fetch timeline data')
        }
        const data = await response.json()
        const entries = data.entries
        setAllEntries(entries)
        
        // Check if we're using fallback data
        const milestoneEntries = entries.filter((entry: TimelineEntry) => entry.type === 'milestone')
        if (milestoneEntries.length > 0) {
          // Check if we have actual Notion IDs (long UUIDs) vs local IDs (short like "milestone-1")
          const hasNotionIds = milestoneEntries.some((entry: TimelineEntry) => 
            entry.id.startsWith('milestone-') && entry.id.length > 20 // Notion IDs are much longer
          )
          if (hasNotionIds) {
            console.log('✅ Timeline loaded with Notion milestones')
          } else {
            console.log('📝 Timeline loaded with local fallback milestones')
          }
        }
        
        // Debug: Log the actual milestone IDs to see what we're getting
        console.log('Milestone IDs:', milestoneEntries.map((entry: TimelineEntry) => entry.id))
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

  return (
    <div className="min-h-screen pastel-cream">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-vision-charcoal mb-4">
            Vision Hub Timeline
          </h1>
          <p className="text-lg text-vision-charcoal/70 max-w-2xl mx-auto">
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
                className="text-center py-12"
              >
                <div className="flex items-center justify-center gap-3">
                  <Loader2 className="h-6 w-6 animate-spin text-vision-ochre" />
                  <span className="text-vision-charcoal">Loading timeline...</span>
                </div>
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
                className="space-y-8"
              >
                {filteredEntries.map((entry, index) => (
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
                ))}
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
                <p className="text-vision-charcoal/60">
                  No entries match the current filter. Try selecting a different category.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
} 