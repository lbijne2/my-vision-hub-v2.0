"use client"

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown, FileText, Brain, Calendar, PenTool } from 'lucide-react'
import { LinkedItem } from '@/lib/timeline'
import { createPortal } from 'react-dom'

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
  const [hoveredDropdown, setHoveredDropdown] = useState<string | null>(null)
  const [dropdownPosition, setDropdownPosition] = useState<{ x: number; y: number } | null>(null)
  const triggerRefs = useRef<Record<string, HTMLDivElement | null>>({})

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
            <div 
              key={type} 
              className="relative group pb-2 -mb-2"
              ref={(el) => {
                triggerRefs.current[type] = el
              }}
              onMouseEnter={() => {
                const element = triggerRefs.current[type]
                if (element) {
                  const rect = element.getBoundingClientRect()
                  setDropdownPosition({ x: rect.left, y: rect.bottom })
                  setHoveredDropdown(type)
                }
              }}
              onMouseLeave={() => {
                setHoveredDropdown(null)
              }}
            >
              <div className="flex items-center gap-1 hover:scale-110 transition-all duration-200 cursor-pointer">
                <span className="text-vision-charcoal hover:text-vision-ochre">{icon}</span>
                <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform duration-200" />
              </div>
            </div>
          )
        }
      })}
      
      {/* Portal-based dropdown */}
      {hoveredDropdown && dropdownPosition && (() => {
        const items = groupedItems[hoveredDropdown]
        return createPortal(
          <div 
            className="fixed bg-white border border-vision-border rounded-lg shadow-lg py-0.5 z-50 min-w-48"
            style={{
              left: dropdownPosition.x,
              top: dropdownPosition.y,
            }}
            onMouseEnter={() => setHoveredDropdown(hoveredDropdown)}
            onMouseLeave={() => setHoveredDropdown(null)}
          >
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-2 text-sm text-vision-charcoal hover:bg-pastel-cream transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </div>,
          document.body
        )
      })()}
    </div>
  )
} 