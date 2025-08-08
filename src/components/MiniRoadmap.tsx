'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, ArrowRight } from 'lucide-react'
import type { Milestone } from '@/types'

interface MiniRoadmapProps {
  maxItems?: number
}

export function MiniRoadmap({ maxItems = 5 }: MiniRoadmapProps) {
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        const response = await fetch(`/api/milestones?maxItems=${maxItems}`)
        const data = await response.json()
        
        if (data.success) {
          setMilestones(data.milestones)
        } else {
          console.error('Error fetching milestones:', data.error)
          setMilestones([])
        }
      } catch (error) {
        console.error('Error fetching milestones:', error)
        setMilestones([])
      } finally {
        setLoading(false)
      }
    }

    fetchMilestones()
  }, [maxItems])

  const displayMilestones = milestones

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  const getTypeIcon = (type: string) => {
    const iconMap: { [key: string]: string } = {
      'milestone': '🎯',
      'launch': '🚀',
      'research': '🔬',
      'development': '⚙️',
      'release': '📦',
      'default': '📅'
    }
    return iconMap[type] || iconMap.default
  }

  if (loading) {
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
                {[...Array(3)].map((_, i) => (
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

  if (displayMilestones.length === 0) {
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
                No upcoming milestones — you're caught up!
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="text-center py-8">
                <p className="text-vision-charcoal/60 mb-4">
                  All planned milestones have been completed. Great work!
                </p>
                <Button asChild variant="outline" className="border-vision-border text-vision-charcoal hover:bg-vision-ochre/10">
                  <Link href="/timeline">
                    View Full Timeline
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

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
              Upcoming milestones and planned work
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="space-y-4">
              {displayMilestones.slice(0, maxItems).map((milestone) => (
                <div key={milestone.id} className="flex items-start gap-3 p-3 rounded-lg bg-white/50 border border-vision-border/20">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-vision-ochre/20 flex items-center justify-center text-sm">
                    {milestone.icon || getTypeIcon(milestone.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-vision-charcoal truncate">
                          {milestone.title}
                        </h4>
                        {milestone.description && (
                          <p className="text-sm text-vision-charcoal/70 mt-1 line-clamp-2">
                            {milestone.description}
                          </p>
                        )}
                      </div>
                      <div className="flex-shrink-0 text-xs text-vision-charcoal/60 font-medium">
                        {formatDate(milestone.date)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-vision-border/20">
              <Button asChild variant="outline" className="w-full border-vision-border text-vision-charcoal hover:bg-vision-ochre/10">
                <Link href="/timeline">
                  View Full Timeline
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
} 