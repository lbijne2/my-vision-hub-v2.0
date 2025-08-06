'use client'

import { useState, useMemo, useEffect } from 'react'
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Project } from '@/types'

interface ProjectFiltersProps {
  projects: Project[]
  onFiltersChange: (filteredProjects: Project[]) => void
  filteredCount?: number
}

export function ProjectFilters({ projects, onFiltersChange, filteredCount }: ProjectFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [tagLogic, setTagLogic] = useState<'AND' | 'OR'>('AND')
  const [statusLogic, setStatusLogic] = useState<'AND' | 'OR'>('OR')
  const [showFilters, setShowFilters] = useState(false)

  // Extract unique tags from all projects
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    projects.forEach(project => {
      project.tags?.forEach(tag => tags.add(tag))
    })
    return Array.from(tags).sort()
  }, [projects])

  // Extract unique statuses from all projects
  const allStatuses = useMemo(() => {
    const statuses = new Set<string>()
    projects.forEach(project => {
      if (project.status) statuses.add(project.status)
    })
    return Array.from(statuses).sort()
  }, [projects])

  // Map status to display name
  const getStatusDisplayName = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active'
      case 'prototype':
        return 'Prototype'
      case 'archived':
        return 'Archived'
      default:
        return status
    }
  }

  // Filter projects based on search and filters
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      // Search filter - improved fuzzy matching
      const searchLower = searchQuery.toLowerCase().trim()
      const matchesSearch = !searchQuery || 
        project.title?.toLowerCase().includes(searchLower) ||
        project.subtitle?.toLowerCase().includes(searchLower) ||
        project.description?.toLowerCase().includes(searchLower) ||
        project.tags?.some(tag => tag.toLowerCase().includes(searchLower))

      // Tag filter - projects must have ALL selected tags (AND) or ANY selected tags (OR)
      const matchesTags = selectedTags.length === 0 || 
        (tagLogic === 'AND' 
          ? selectedTags.every(tag => project.tags?.includes(tag))
          : selectedTags.some(tag => project.tags?.includes(tag))
        )

      // Status filter - projects must have ANY of the selected statuses (OR) or ALL selected statuses (AND)
      const matchesStatus = selectedStatuses.length === 0 || 
        (statusLogic === 'OR'
          ? selectedStatuses.includes(project.status)
          : selectedStatuses.every(status => project.status === status)
        )

      return matchesSearch && matchesTags && matchesStatus
    })
  }, [projects, searchQuery, selectedTags, selectedStatuses, tagLogic, statusLogic])

  // Update parent component when filters change
  useEffect(() => {
    onFiltersChange(filteredProjects)
  }, [filteredProjects, onFiltersChange])

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const handleStatusToggle = (status: string) => {
    setSelectedStatuses(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    )
  }

  const toggleTagLogic = () => {
    setTagLogic(prev => prev === 'AND' ? 'OR' : 'AND')
  }

  const toggleStatusLogic = () => {
    setStatusLogic(prev => prev === 'AND' ? 'OR' : 'AND')
  }

  const clearAllFilters = () => {
    setSearchQuery('')
    setSelectedTags([])
    setSelectedStatuses([])
    setTagLogic('AND')
    setStatusLogic('OR')
  }

  const hasActiveFilters = searchQuery || selectedTags.length > 0 || selectedStatuses.length > 0

  return (
    <div className="space-y-6 mb-8">
      {/* Search Bar and Filter Toggle */}
      <div className="flex gap-3 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-vision-charcoal/50 w-5 h-5" />
          <input
            type="text"
            placeholder="Search projects by title, subtitle, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-pastel-sky/30 rounded-xl text-vision-charcoal placeholder-vision-charcoal/50 focus:outline-none focus:ring-2 focus:ring-pastel-sky focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-vision-charcoal/50 hover:text-vision-charcoal"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        
        {/* Filter Toggle Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 whitespace-nowrap transition-all duration-200 hover:scale-105 ${
            hasActiveFilters && !showFilters 
              ? 'bg-pastel-sky text-vision-charcoal border-pastel-sky shadow-sm hover:bg-pastel-sky/80' 
              : 'text-vision-charcoal border-pastel-sky/30 hover:bg-pastel-sky/10 hover:border-pastel-sky/50'
          }`}
        >
          <Filter className="w-4 h-4" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
          {hasActiveFilters && !showFilters && (
            <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs bg-white text-vision-charcoal">
              {selectedTags.length + selectedStatuses.length}
            </Badge>
          )}
          {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>
      </div>

      {/* Filters Section - Only show when toggled */}
      {showFilters && (
        <div className="space-y-6">
          {/* Status Filters */}
          {allStatuses.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-vision-charcoal">
                <Filter className="w-4 h-4" />
                Status
                <Badge
                  variant="outline"
                  className="cursor-pointer text-xs bg-white text-vision-charcoal border-pastel-sky/30 hover:bg-pastel-sky/10 hover:border-pastel-sky/50 transition-all duration-200 hover:scale-105"
                  onClick={toggleStatusLogic}
                >
                  {statusLogic}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {allStatuses.map(status => (
                  <Button
                    key={status}
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusToggle(status)}
                    className={`transition-all duration-200 hover:scale-105 rounded-lg ${
                      selectedStatuses.includes(status) 
                        ? 'bg-pastel-sky text-vision-charcoal border-pastel-sky shadow-sm hover:bg-pastel-sky/80' 
                        : 'bg-white text-vision-charcoal border-pastel-sky/30 hover:bg-pastel-sky/10 hover:border-pastel-sky/50'
                    }`}
                  >
                    {getStatusDisplayName(status)}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Tag Filters */}
          {allTags.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-vision-charcoal">
                <Filter className="w-4 h-4" />
                Tags
                <Badge
                  variant="outline"
                  className="cursor-pointer text-xs bg-white text-vision-charcoal border-pastel-sky/30 hover:bg-pastel-sky/10 hover:border-pastel-sky/50 transition-all duration-200 hover:scale-105"
                  onClick={toggleTagLogic}
                >
                  {tagLogic}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "secondary"}
                    className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                      selectedTags.includes(tag)
                        ? 'bg-pastel-sky text-vision-charcoal hover:bg-pastel-sky/80 shadow-sm'
                        : 'bg-white text-vision-charcoal border-pastel-sky/30 hover:bg-pastel-sky/10 hover:border-pastel-sky/50'
                    }`}
                    onClick={() => handleTagToggle(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="flex justify-center pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="text-vision-charcoal border-pastel-sky/30 hover:bg-pastel-sky/10"
              >
                <X className="w-4 h-4 mr-2" />
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Results Counter - Appears underneath filters */}
      {hasActiveFilters && (
        <div className="text-sm text-vision-charcoal/70 text-center">
          Showing {filteredCount || 0} of {projects.length} projects
        </div>
      )}
    </div>
  )
} 