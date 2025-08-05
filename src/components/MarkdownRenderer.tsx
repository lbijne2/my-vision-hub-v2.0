import React from 'react'
import { cn } from '@/lib/utils'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  // Simple markdown parser for basic formatting
  const parseMarkdown = (text: string): React.ReactNode[] => {
    const lines = text.split('\n')
    const elements: React.ReactNode[] = []
    let currentList: string[] = []
    let currentOrderedList: string[] = []
    let inCodeBlock = false
    let codeBlockContent: string[] = []

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={`ul-${elements.length}`} className="list-disc list-inside space-y-1 ml-4 mb-4">
            {currentList.map((item, index) => (
              <li key={index} className="text-vision-charcoal/80">
                {item.replace(/^[-*]\s*/, '')}
              </li>
            ))}
          </ul>
        )
        currentList = []
      }
    }

    const flushOrderedList = () => {
      if (currentOrderedList.length > 0) {
        elements.push(
          <ol key={`ol-${elements.length}`} className="list-decimal list-inside space-y-1 ml-4 mb-4">
            {currentOrderedList.map((item, index) => (
              <li key={index} className="text-vision-charcoal/80">
                {item.replace(/^\d+\.\s*/, '')}
              </li>
            ))}
          </ol>
        )
        currentOrderedList = []
      }
    }

    const flushCodeBlock = () => {
      if (codeBlockContent.length > 0) {
        elements.push(
          <pre key={`pre-${elements.length}`} className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
            <code className="text-sm text-gray-800">
              {codeBlockContent.join('\n')}
            </code>
          </pre>
        )
        codeBlockContent = []
      }
    }

    lines.forEach((line, index) => {
      // Handle code blocks
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          flushCodeBlock()
          inCodeBlock = false
        } else {
          flushList()
          flushOrderedList()
          inCodeBlock = true
        }
        return
      }

      if (inCodeBlock) {
        codeBlockContent.push(line)
        return
      }

      // Handle headers
      if (line.startsWith('# ')) {
        flushList()
        flushOrderedList()
        elements.push(
          <h1 key={`h1-${index}`} className="text-3xl font-bold text-vision-charcoal mt-8 mb-4">
            {line.replace('# ', '')}
          </h1>
        )
        return
      }

      if (line.startsWith('## ')) {
        flushList()
        flushOrderedList()
        elements.push(
          <h2 key={`h2-${index}`} className="text-2xl font-semibold text-vision-charcoal mt-6 mb-3">
            {line.replace('## ', '')}
          </h2>
        )
        return
      }

      if (line.startsWith('### ')) {
        flushList()
        flushOrderedList()
        elements.push(
          <h3 key={`h3-${index}`} className="text-xl font-semibold text-vision-charcoal mt-4 mb-2">
            {line.replace('### ', '')}
          </h3>
        )
        return
      }

      // Handle lists
      if (line.match(/^[-*]\s/)) {
        flushOrderedList()
        currentList.push(line)
        return
      }

      if (line.match(/^\d+\.\s/)) {
        flushList()
        currentOrderedList.push(line)
        return
      }

      // Handle empty lines
      if (line.trim() === '') {
        flushList()
        flushOrderedList()
        return
      }

      // Handle regular paragraphs with bold text
      flushList()
      flushOrderedList()
      
      const parts = line.split('**')
      const paragraphContent = parts.map((part, partIndex) => 
        partIndex % 2 === 1 ? (
          <strong key={partIndex} className="font-semibold text-vision-charcoal">
            {part}
          </strong>
        ) : (
          part
        )
      )

      elements.push(
        <p key={`p-${index}`} className="text-vision-charcoal/80 mb-4 leading-relaxed">
          {paragraphContent}
        </p>
      )
    })

    // Flush any remaining lists
    flushList()
    flushOrderedList()
    flushCodeBlock()

    return elements
  }

  return (
    <div className={cn("prose prose-lg max-w-none", className)}>
      {parseMarkdown(content)}
    </div>
  )
} 