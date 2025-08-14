import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import { Info, AlertTriangle, XCircle, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MarkdownRendererProps {
  content: string
  className?: string
}

// Preprocess content to handle callouts
function preprocessCallouts(content: string): string {
  // Replace callout syntax with HTML
  return content
    .replace(/:::info\s*(.*?)\n([\s\S]*?):::/g, '<div class="callout callout-info" data-callout-type="info" data-callout-title="$1">$2</div>')
    .replace(/:::warning\s*(.*?)\n([\s\S]*?):::/g, '<div class="callout callout-warning" data-callout-type="warning" data-callout-title="$1">$2</div>')
    .replace(/:::error\s*(.*?)\n([\s\S]*?):::/g, '<div class="callout callout-error" data-callout-type="error" data-callout-title="$1">$2</div>')
    .replace(/:::success\s*(.*?)\n([\s\S]*?):::/g, '<div class="callout callout-success" data-callout-type="success" data-callout-title="$1">$2</div>')
}

// Callout component for special notice boxes
function Callout({ type = 'info', title, children }: { 
  type?: 'info' | 'warning' | 'error' | 'success'; 
  title?: string; 
  children: React.ReactNode 
}) {
  const styles = {
    info: 'border-vision-navy/30 bg-vision-navy/5 text-vision-charcoal',
    warning: 'border-vision-ochre/40 bg-vision-ochre/10 text-vision-charcoal',
    error: 'border-rose-300/40 bg-rose-50/50 text-vision-charcoal',
    success: 'border-emerald-300/40 bg-emerald-50/50 text-vision-charcoal'
  }
  
  const iconColors = {
    info: 'text-vision-navy',
    warning: 'text-vision-ochre',
    error: 'text-rose-500',
    success: 'text-emerald-500'
  }
  
  const icons = {
    info: <Info className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    success: <CheckCircle className="w-5 h-5" />
  }
  
  return (
    <div className={cn(
      "border-l-4 pl-4 pr-4 pb-4 pt-0 mb-6 rounded-r-lg",
      styles[type]
    )}>
      <div className="flex items-start gap-3 -mt-1">
        <span className={cn("flex-shrink-0 mt-5", iconColors[type])}>{icons[type]}</span>
        <div className="flex-1 -mt-1">
          {title && <h4 className="font-semibold mb-2 leading-tight">{title}</h4>}
          <div className="leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  )
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  // Preprocess content to handle callouts
  const processedContent = preprocessCallouts(content)
  
  return (
    <div className={cn("prose prose-base max-w-none prose-headings:text-vision-charcoal prose-p:text-vision-charcoal/80 prose-strong:text-vision-charcoal prose-a:text-vision-ochre hover:prose-a:text-vision-ochre/80 prose-code:text-vision-charcoal prose-code:bg-vision-beige prose-pre:bg-gray-100", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeHighlight, rehypeRaw]}
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

          ul: ({ children }) => (
            <ul className="list-disc list-outside ml-6 mb-4">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside ml-6 mb-4">
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
          // Handle details/summary elements from Notion toggle lists
          details: ({ children, ...props }) => (
            <details 
              {...props}
              className="mb-4 border border-vision-border rounded-lg overflow-hidden"
            >
              {children}
            </details>
          ),
          // Add padding wrapper for details content
          p: ({ children, ...props }: any) => (
            <p className="text-vision-charcoal/80 mb-4 leading-relaxed" {...props}>
              {children}
            </p>
          ),
          summary: ({ children, ...props }) => (
            <summary 
              {...props}
              className="px-4 py-3 bg-vision-beige cursor-pointer hover:bg-vision-beige/80 transition-colors font-medium text-vision-charcoal flex items-center justify-between"
            >
              <span>{children}</span>
              <svg 
                className="w-4 h-4 transition-transform group-open:rotate-180"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
          ),
          // Handle callouts and details content
          div: ({ className, children, ...props }: any) => {
            // Handle callouts
            if (className && className.includes('callout')) {
              const calloutType = props['data-callout-type'] || 'info'
              const calloutTitle = props['data-callout-title'] || ''
              
              return (
                <Callout type={calloutType} title={calloutTitle}>
                  {children}
                </Callout>
              )
            }
            
            return <div className={className} {...props}>{children}</div>
          },
          // Enhanced table styling
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border border-vision-border rounded-lg">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-vision-beige">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2 text-left font-semibold text-vision-charcoal border-b border-vision-border">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2 text-vision-charcoal/80 border-b border-vision-border">
              {children}
            </td>
          ),
          // Math equation styling - handled by rehype-katex
          // The rehype-katex plugin automatically handles math equations
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  )
} 