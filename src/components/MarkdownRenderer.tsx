import React from 'react'
import ReactMarkdown from 'react-markdown'
import { cn } from '@/lib/utils'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={cn("prose prose-base max-w-none prose-headings:text-vision-charcoal prose-p:text-vision-charcoal/80 prose-strong:text-vision-charcoal prose-a:text-vision-ochre hover:prose-a:text-vision-ochre/80 prose-code:text-vision-charcoal prose-code:bg-vision-beige prose-pre:bg-gray-100", className)}>
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold text-vision-charcoal mt-8 mb-4">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold text-vision-charcoal mt-6 mb-3">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold text-vision-charcoal mt-4 mb-2">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-vision-charcoal/80 mb-4 leading-relaxed">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside ml-4 mb-4">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside ml-4 mb-4">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-vision-charcoal/80 mb-1">
              {children}
            </li>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-vision-charcoal">
              {children}
            </strong>
          ),
          code: ({ children, className }) => {
            const isInline = !className
            if (isInline) {
              return (
                <code className="bg-vision-beige px-1 py-0.5 rounded text-sm text-vision-charcoal">
                  {children}
                </code>
              )
            }
            return (
              <code className="block bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm text-vision-charcoal">
                {children}
              </code>
            )
          },
          pre: ({ children }) => (
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-vision-ochre pl-4 italic text-vision-charcoal/70 mb-4">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a 
              href={href} 
              className="text-vision-ochre hover:text-vision-ochre/80 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
} 