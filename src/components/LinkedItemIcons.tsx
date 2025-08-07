"use client"

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, FileText, Brain, Calendar, PenTool } from 'lucide-react'
import { LinkedItem } from '@/lib/timeline'

interface LinkedItemIconsProps {
  linkedItems: LinkedItem[]
}

// Helper function to get icon for each type
function getTypeIcon(type: string) {
  switch (type) {
    case 'project':
      return <FileText className="w-4 h-4" />
    case 'agent':
      return <Brain className="w-4 h-4" />
    case 'post':
      return <PenTool className="w-4 h-4" />
    default:
      return <FileText className="w-4 h-4" />
  }
}

// Helper function to group linked items by type
function groupLinkedItems(linkedItems: LinkedItem[]) {
  const grouped = linkedItems.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = []
    }
    acc[item.type].push(item)
    return acc
  }, {} as Record<string, LinkedItem[]>)
  
  return grouped
}

export default function LinkedItemIcons({ linkedItems }: LinkedItemIconsProps) {
  const groupedItems = groupLinkedItems(linkedItems)

  if (linkedItems.length === 0) return null

  return (
    <div className="flex items-center gap-2 ml-3">
      {Object.entries(groupedItems).map(([type, items]) => {
        const icon = getTypeIcon(type)
        
        if (items.length === 1) {
          // Single item - show as tooltip
          const item = items[0]
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group relative"
              title={item.label}
            >
              <span className="text-vision-charcoal hover:text-vision-ochre hover:scale-110 transition-all duration-200 cursor-pointer">
                {icon}
              </span>
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-vision-charcoal text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                {item.label}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-vision-charcoal"></div>
              </div>
            </Link>
          )
        } else {
          // Multiple items - show as dropdown
          return (
            <div key={type} className="relative group pb-2 -mb-2">
              <div className="flex items-center gap-1 hover:scale-110 transition-all duration-200 cursor-pointer">
                <span className="text-vision-charcoal hover:text-vision-ochre">{icon}</span>
                <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform duration-200" />
              </div>
              
              {/* Dropdown */}
              <div className="absolute top-full left-0 mt-0 bg-white border border-vision-border rounded-lg shadow-lg py-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto z-50 min-w-48">
                {items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-3 py-2 text-sm text-vision-charcoal hover:bg-pastel-cream transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          )
        }
      })}
    </div>
  )
} 