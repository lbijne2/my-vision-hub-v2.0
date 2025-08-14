'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import { Download, File, FileText, FileSpreadsheet, Presentation, FileArchive, Image, Video, Radio, FileImage, FileVideo, FileAudio, ExternalLink, Info, AlertTriangle, XCircle, CheckCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn, formatFileSize } from '@/lib/utils'
import type { BlogPostAttachment, BlogPostMedia } from '@/types'

interface MarkdownRendererProps {
  content: string
  className?: string
  attachments?: BlogPostAttachment[]
  mediaFiles?: BlogPostMedia[]
}

// Helper function to get file type icon
function getFileTypeIcon(type: string, className?: string) {
  const iconClass = cn("w-5 h-5", className)
  
  switch (type) {
    case 'document':
      return <FileText className={iconClass} />
    case 'spreadsheet':
      return <FileSpreadsheet className={iconClass} />
    case 'presentation':
      return <Presentation className={iconClass} />
    case 'pdf':
      return <FileText className={iconClass} />
    case 'archive':
      return <FileArchive className={iconClass} />
    case 'image':
      return <Image className={iconClass} />
    case 'video':
      return <Video className={iconClass} />
    case 'audio':
      return <Radio className={iconClass} />
    case 'gif':
      return <FileImage className={iconClass} />
    default:
      return <File className={iconClass} />
  }
}

// Helper function to get media type icon
function getMediaTypeIcon(type: string, className?: string) {
  const iconClass = cn("w-5 h-5", className)
  
  switch (type) {
    case 'image':
      return <Image className={iconClass} />
    case 'video':
      return <Video className={iconClass} />
    case 'audio':
      return <Radio className={iconClass} />
    case 'gif':
      return <FileImage className={iconClass} />
    default:
      return <FileImage className={iconClass} />
  }
}

// Helper function to get file type color
function getFileTypeColor(type: string): string {
  switch (type) {
    case 'document':
      return 'bg-vision-navy/20 text-vision-navy'
    case 'spreadsheet':
      return 'bg-pastel-mint text-vision-charcoal'
    case 'presentation':
      return 'bg-amber-200/60 text-amber-800'
    case 'pdf':
      return 'bg-red-200/60 text-red-800'
    case 'archive':
      return 'bg-violet-200/60 text-violet-800'
    case 'image':
      return 'bg-vision-ochre/20 text-vision-ochre'
    case 'video':
      return 'bg-blue-200/60 text-blue-800'
    case 'audio':
      return 'bg-emerald-200/60 text-emerald-800'
    default:
      return 'bg-slate-200/60 text-slate-800'
  }
}

// Helper function to get media type color
function getMediaTypeColor(type: string): string {
  switch (type) {
    case 'image':
      return 'bg-vision-ochre/20 text-vision-ochre'
    case 'video':
      return 'bg-blue-200/60 text-blue-800'
    case 'audio':
      return 'bg-emerald-200/60 text-emerald-800'
    case 'gif':
      return 'bg-violet-200/60 text-violet-800'
    default:
      return 'bg-slate-200/60 text-slate-800'
  }
}

// Preprocess content to handle callouts, file/media references, and columns
function preprocessContent(content: string, attachments?: BlogPostAttachment[], mediaFiles?: BlogPostMedia[]): string {
  let processedContent = content
  
  // Replace callout syntax with HTML
  processedContent = processedContent
    .replace(/:::info\s*(.*?)\n([\s\S]*?):::/g, '<div class="callout callout-info" data-callout-type="info" data-callout-title="$1">$2</div>')
    .replace(/:::warning\s*(.*?)\n([\s\S]*?):::/g, '<div class="callout callout-warning" data-callout-type="warning" data-callout-title="$1">$2</div>')
    .replace(/:::error\s*(.*?)\n([\s\S]*?):::/g, '<div class="callout callout-error" data-callout-type="error" data-callout-title="$1">$2</div>')
    .replace(/:::success\s*(.*?)\n([\s\S]*?):::/g, '<div class="callout callout-success" data-callout-type="success" data-callout-title="$1">$2</div>')
  
  // Replace column syntax with HTML
  // 2-column layout: :::columns-2\ncol1\n---\ncol2\n:::
  processedContent = processedContent
    .replace(/:::columns-2\s*\n([\s\S]*?)---\s*\n([\s\S]*?):::/g, '<div class="columns-container columns-2" data-columns="2"><div class="column" data-column="1">$1</div><div class="column" data-column="2">$2</div></div>')
  
  // 3-column layout: :::columns-3\ncol1\n---\ncol2\n---\ncol3\n:::
  processedContent = processedContent
    .replace(/:::columns-3\s*\n([\s\S]*?)---\s*\n([\s\S]*?)---\s*\n([\s\S]*?):::/g, '<div class="columns-container columns-3" data-columns="3"><div class="column" data-column="1">$1</div><div class="column" data-column="2">$2</div><div class="column" data-column="3">$3</div></div>')
  
  // 4-column layout: :::columns-4\ncol1\n---\ncol2\n---\ncol3\n---\ncol4\n:::
  processedContent = processedContent
    .replace(/:::columns-4\s*\n([\s\S]*?)---\s*\n([\s\S]*?)---\s*\n([\s\S]*?)---\s*\n([\s\S]*?):::/g, '<div class="columns-container columns-4" data-columns="4"><div class="column" data-column="1">$1</div><div class="column" data-column="2">$2</div><div class="column" data-column="3">$3</div><div class="column" data-column="4">$4</div></div>')
  
  // 5-column layout: :::columns-5\ncol1\n---\ncol2\n---\ncol3\n---\ncol4\n---\ncol5\n:::
  processedContent = processedContent
    .replace(/:::columns-5\s*\n([\s\S]*?)---\s*\n([\s\S]*?)---\s*\n([\s\S]*?)---\s*\n([\s\S]*?)---\s*\n([\s\S]*?):::/g, '<div class="columns-container columns-5" data-columns="5"><div class="column" data-column="1">$1</div><div class="column" data-column="2">$2</div><div class="column" data-column="3">$3</div><div class="column" data-column="4">$4</div><div class="column" data-column="5">$5</div></div>')
  
  // Handle manual column markers for Notion content
  // Format: <!-- 2-columns --> content <!-- column-break --> content <!-- /2-columns -->
  processedContent = processedContent
    .replace(/<!--\s*2-columns\s*-->([\s\S]*?)<!--\s*column-break\s*-->([\s\S]*?)<!--\s*\/2-columns\s*-->/g, (match, col1, col2) => {
      // Ensure proper spacing for markdown processing while preserving HTML comments
      return `<div class="columns-container columns-2" data-columns="2"><div class="column" data-column="1">\n\n${col1.trim()}\n\n</div><div class="column" data-column="2">\n\n${col2.trim()}\n\n</div></div>`
    })
  
  // Format: <!-- 3-columns --> content <!-- column-break --> content <!-- column-break --> content <!-- /3-columns -->
  processedContent = processedContent
    .replace(/<!--\s*3-columns\s*-->([\s\S]*?)<!--\s*column-break\s*-->([\s\S]*?)<!--\s*column-break\s*-->([\s\S]*?)<!--\s*\/3-columns\s*-->/g, (match, col1, col2, col3) => {
      // Ensure proper spacing for markdown processing while preserving HTML comments
      return `<div class="columns-container columns-3" data-columns="3"><div class="column" data-column="1">\n\n${col1.trim()}\n\n</div><div class="column" data-column="2">\n\n${col2.trim()}\n\n</div><div class="column" data-column="3">\n\n${col3.trim()}\n\n</div></div>`
    })
  
  // Format: <!-- 4-columns --> content <!-- column-break --> content <!-- column-break --> content <!-- column-break --> content <!-- /4-columns -->
  processedContent = processedContent
    .replace(/<!--\s*4-columns\s*-->([\s\S]*?)<!--\s*column-break\s*-->([\s\S]*?)<!--\s*column-break\s*-->([\s\S]*?)<!--\s*column-break\s*-->([\s\S]*?)<!--\s*\/4-columns\s*-->/g, (match, col1, col2, col3, col4) => {
      // Ensure proper spacing for markdown processing while preserving HTML comments
      return `<div class="columns-container columns-4" data-columns="4"><div class="column" data-column="1">\n\n${col1.trim()}\n\n</div><div class="column" data-column="2">\n\n${col2.trim()}\n\n</div><div class="column" data-column="3">\n\n${col3.trim()}\n\n</div><div class="column" data-column="4">\n\n${col4.trim()}\n\n</div></div>`
    })
  
  // Format: <!-- 5-columns --> content <!-- column-break --> content <!-- column-break --> content <!-- column-break --> content <!-- column-break --> content <!-- /5-columns -->
  processedContent = processedContent
    .replace(/<!--\s*5-columns\s*-->([\s\S]*?)<!--\s*column-break\s*-->([\s\S]*?)<!--\s*column-break\s*-->([\s\S]*?)<!--\s*column-break\s*-->([\s\S]*?)<!--\s*column-break\s*-->([\s\S]*?)<!--\s*\/5-columns\s*-->/g, (match, col1, col2, col3, col4, col5) => {
      // Ensure proper spacing for markdown processing while preserving HTML comments
      return `<div class="columns-container columns-5" data-columns="5"><div class="column" data-column="1">\n\n${col1.trim()}\n\n</div><div class="column" data-column="2">\n\n${col2.trim()}\n\n</div><div class="column" data-column="3">\n\n${col3.trim()}\n\n</div><div class="column" data-column="4">\n\n${col4.trim()}\n\n</div><div class="column" data-column="5">\n\n${col5.trim()}\n\n</div></div>`
    })
  
  // Alternative format: <!-- columns:2 --> content <!-- break --> content <!-- /columns -->
  processedContent = processedContent
    .replace(/<!--\s*columns:2\s*-->([\s\S]*?)<!--\s*break\s*-->([\s\S]*?)<!--\s*\/columns\s*-->/g, (match, col1, col2) => {
      // Ensure proper spacing for markdown processing while preserving HTML comments
      return `<div class="columns-container columns-2" data-columns="2"><div class="column" data-column="1">\n\n${col1.trim()}\n\n</div><div class="column" data-column="2">\n\n${col2.trim()}\n\n</div></div>`
    })
  
  // Alternative format: <!-- columns:3 --> content <!-- break --> content <!-- break --> content <!-- /columns -->
  processedContent = processedContent
    .replace(/<!--\s*columns:3\s*-->([\s\S]*?)<!--\s*break\s*-->([\s\S]*?)<!--\s*break\s*-->([\s\S]*?)<!--\s*\/columns\s*-->/g, (match, col1, col2, col3) => {
      // Ensure proper spacing for markdown processing while preserving HTML comments
      return `<div class="columns-container columns-3" data-columns="3"><div class="column" data-column="1">\n\n${col1.trim()}\n\n</div><div class="column" data-column="2">\n\n${col2.trim()}\n\n</div><div class="column" data-column="3">\n\n${col3.trim()}\n\n</div></div>`
    })
  
  // Alternative format: <!-- columns:4 --> content <!-- break --> content <!-- break --> content <!-- break --> content <!-- /columns -->
  processedContent = processedContent
    .replace(/<!--\s*columns:4\s*-->([\s\S]*?)<!--\s*break\s*-->([\s\S]*?)<!--\s*break\s*-->([\s\S]*?)<!--\s*break\s*-->([\s\S]*?)<!--\s*\/columns\s*-->/g, (match, col1, col2, col3, col4) => {
      // Ensure proper spacing for markdown processing while preserving HTML comments
      return `<div class="columns-container columns-4" data-columns="4"><div class="column" data-column="1">\n\n${col1.trim()}\n\n</div><div class="column" data-column="2">\n\n${col2.trim()}\n\n</div><div class="column" data-column="3">\n\n${col3.trim()}\n\n</div><div class="column" data-column="4">\n\n${col4.trim()}\n\n</div></div>`
    })
  
  // Alternative format: <!-- columns:5 --> content <!-- break --> content <!-- break --> content <!-- break --> content <!-- break --> content <!-- /columns -->
  processedContent = processedContent
    .replace(/<!--\s*columns:5\s*-->([\s\S]*?)<!--\s*break\s*-->([\s\S]*?)<!--\s*break\s*-->([\s\S]*?)<!--\s*break\s*-->([\s\S]*?)<!--\s*break\s*-->([\s\S]*?)<!--\s*\/columns\s*-->/g, (match, col1, col2, col3, col4, col5) => {
      // Ensure proper spacing for markdown processing while preserving HTML comments
      return `<div class="columns-container columns-5" data-columns="5"><div class="column" data-column="1">\n\n${col1.trim()}\n\n</div><div class="column" data-column="2">\n\n${col2.trim()}\n\n</div><div class="column" data-column="3">\n\n${col3.trim()}\n\n</div><div class="column" data-column="4">\n\n${col4.trim()}\n\n</div><div class="column" data-column="5">\n\n${col5.trim()}\n\n</div></div>`
    })
  
  // Replace file references with custom HTML
  if (attachments) {
    attachments.forEach(attachment => {
      const fileRef = `file:${attachment.name}`
      const fileHtml = `<div class="file-reference" data-file-name="${attachment.name}" data-file-type="${attachment.type}" data-file-url="${attachment.url}" data-file-size="${attachment.size || ''}" data-file-mime="${attachment.mime_type || ''}"></div>`
      processedContent = processedContent.replace(new RegExp(`\\[([^\\]]*?)\\]\\(${fileRef.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)`, 'g'), fileHtml)
    })
  }
  
  // Replace media references with custom HTML
  if (mediaFiles) {
    mediaFiles.forEach(media => {
      const mediaRef = `media:${media.name}`
      // Extract the link text as the description and capture any text that follows
      const regex = new RegExp(`\\[([^\\]]*?)\\]\\(${mediaRef.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)\\s*([^\\n]*)`, 'g')
      processedContent = processedContent.replace(regex, (match, linkText, followingText) => {
        const mediaHtml = `<div class="media-reference" data-media-name="${media.name}" data-media-type="${media.type}" data-media-url="${media.url}" data-media-caption="${media.caption || ''}" data-media-alt="${media.alt_text || ''}" data-media-width="${media.width || ''}" data-media-height="${media.height || ''}" data-media-duration="${media.duration || ''}" data-media-mime="${media.mime_type || ''}" data-description="${linkText}" data-following-text="${followingText.trim()}"></div>`
        return mediaHtml
      })
    })
  }
  
  return processedContent
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

// Column container component for multi-column layouts
function ColumnContainer({ columns, children }: { 
  columns: number; 
  children: React.ReactNode 
}) {
  const baseClasses = "grid gap-6 mb-6"
  
  // Responsive grid classes for different column counts
  let responsiveClasses = ""
  
  switch (columns) {
    case 2:
      responsiveClasses = "grid-cols-1 md:grid-cols-2"
      break
    case 3:
      responsiveClasses = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      break
    case 4:
      responsiveClasses = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      break
    case 5:
      // For 5 columns, ensure they display properly on large screens
      responsiveClasses = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
      break
    default:
      responsiveClasses = "grid-cols-1"
  }
  
  // Add custom styles for 5 columns to ensure proper distribution
  const customStyles = columns === 5 ? {
    '--tw-grid-cols-5': 'repeat(5, minmax(0, 1fr))',
    gridTemplateColumns: 'var(--tw-grid-cols-5)'
  } : {}
  
  return (
    <div 
      className={`${baseClasses} ${responsiveClasses}`}
      style={customStyles}
    >
      {children}
    </div>
  )
}

// Individual column component
function Column({ columnNumber, children }: { 
  columnNumber: number; 
  children: React.ReactNode 
}) {
  return (
    <div className="column-content">
      {children}
    </div>
  )
}

export function MarkdownRenderer({ content, className, attachments, mediaFiles }: MarkdownRendererProps) {
  // Debug logging
  console.log('MarkdownRenderer props:', {
    contentLength: content?.length,
    attachmentsCount: attachments?.length,
    mediaFilesCount: mediaFiles?.length,
    attachments: attachments,
    mediaFiles: mediaFiles
  })
  
  // Preprocess content to handle callouts and file/media references
  const processedContent = preprocessContent(content, attachments, mediaFiles)
  
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
          a: ({ href, children }) => {
            // Check if this is a file or media reference
            if (href && href.startsWith('file:')) {
              const fileName = href.replace('file:', '')
              console.log('Looking for file attachment:', fileName, 'Available attachments:', attachments)
              const attachment = attachments?.find(a => a.name === fileName)
              if (attachment) {
                return (
                  <div className="mb-4">
                    <Card className="border border-vision-border bg-vision-beige/50 hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3 mb-3">
                          {getFileTypeIcon(attachment.type, "text-vision-ochre mt-1")}
                          <div className="flex-1">
                            <h4 className="font-medium text-vision-charcoal">{attachment.name}</h4>
                            <Badge className={cn("text-xs mt-1", getFileTypeColor(attachment.type))}>
                              {attachment.type}
                            </Badge>
                            {attachment.size && (
                              <span className="text-xs text-vision-charcoal/60 ml-2">
                                {formatFileSize(attachment.size)}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* File Preview - PDF preview removed to avoid errors */}
                        
                        {/* Check if attachment is actually an image/video/audio based on MIME type or URL */}
                        {(attachment.mime_type?.startsWith('image/') || attachment.url.match(/\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)$/i)) && (
                          <div className="mb-3">
                            <img
                              src={attachment.url}
                              alt={attachment.name}
                              className="w-full max-h-64 object-contain border border-vision-border rounded-lg"
                              loading="lazy"
                            />
                          </div>
                        )}
                        
                        {(attachment.mime_type?.startsWith('video/') || attachment.url.match(/\.(mp4|webm|mov|avi|mkv|wmv|flv|m4v)$/i)) && (
                          <div className="mb-3">
                            <video
                              src={attachment.url}
                              controls
                              className="w-full max-h-64 border border-vision-border rounded-lg"
                              preload="metadata"
                            >
                              Your browser does not support the video tag.
                            </video>
                          </div>
                        )}
                        
                        {(attachment.mime_type?.startsWith('audio/') || attachment.url.match(/\.(mp3|wav|ogg|aac|flac|wma)$/i)) && (
                          <div className="mb-3">
                            <audio
                              src={attachment.url}
                              controls
                              className="w-full"
                              preload="metadata"
                            >
                              Your browser does not support the audio tag.
                            </audio>
                          </div>
                        )}
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="no-underline">
                              <ExternalLink className="w-4 h-4 mr-1" />
                              View
                            </a>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <a href={attachment.url} download={attachment.name} className="no-underline">
                              <Download className="w-4 h-4 mr-1" />
                              Download
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )
              }
            }
            
            if (href && href.startsWith('media:')) {
              const mediaName = href.replace('media:', '')
              console.log('Looking for media file:', mediaName, 'Available media files:', mediaFiles)
              const media = mediaFiles?.find(m => m.name === mediaName)
              if (media) {
                return (
                  <div className="block mb-4">
                    {/* Following text appears first */}
                    <p className="text-vision-charcoal/80 mb-2">- {media.name}</p>
                    
                    {/* Media Preview */}
                    {media.type === 'image' && (
                      <img
                        src={media.url}
                        alt={media.alt_text || media.name}
                        className="max-w-full h-auto border border-vision-border rounded-lg"
                        loading="lazy"
                      />
                    )}
                    
                    {media.type === 'video' && (
                      <video
                        src={media.url}
                        controls
                        className="max-w-full h-auto border border-vision-border rounded-lg"
                        preload="metadata"
                      >
                        Your browser does not support the video tag.
                      </video>
                    )}
                    
                    {media.type === 'audio' && (
                      <audio
                        src={media.url}
                        controls
                        className="w-full"
                        preload="metadata"
                      >
                        Your browser does not support the audio tag.
                      </audio>
                    )}
                    
                    {media.type === 'gif' && (
                      <img
                        src={media.url}
                        alt={media.alt_text || media.name}
                        className="max-w-full h-auto border border-vision-border rounded-lg"
                        loading="lazy"
                      />
                    )}
                    
                    {/* Caption appears below media in italic with reduced spacing */}
                    {media.caption && (
                      <p className="text-vision-charcoal/60 italic text-sm mt-1">{media.caption}</p>
                    )}
                  </div>
                )
              }
            }
            
            // Regular link
            return (
              <a 
                href={href} 
                className="text-vision-ochre hover:text-vision-ochre/80 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            )
          },
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
          // Handle callouts, file references, media references, and details content
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
            
            // Handle column containers
            if (className && className.includes('columns-container')) {
              const columns = parseInt(props['data-columns'] || '1')
              return (
                <ColumnContainer columns={columns}>
                  {children}
                </ColumnContainer>
              )
            }

            // Handle individual columns
            if (className && className.includes('column')) {
              const columnNumber = parseInt(props['data-column'] || '1')
              return (
                <Column columnNumber={columnNumber}>
                  {children}
                </Column>
              )
            }
            
            // Handle file references
            if (className && className.includes('file-reference')) {
              const fileName = props['data-file-name']
              const fileType = props['data-file-type']
              const fileUrl = props['data-file-url']
              const fileSize = props['data-file-size']
              const fileMime = props['data-file-mime']
              
              return (
                <div className="mb-4">
                  <Card className="border border-vision-border bg-white hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        {getFileTypeIcon(fileType, "text-vision-ochre flex-shrink-0")}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-vision-charcoal text-m -mt-1">{fileName}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={cn("text-xs", getFileTypeColor(fileType))}>
                              {fileType}
                            </Badge>
                            {fileSize && (
                              <span className="text-xs text-vision-charcoal/60">
                                {formatFileSize(parseInt(fileSize))}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <Button variant="outline" size="sm" asChild>
                            <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="no-underline">
                              <ExternalLink className="w-4 h-4 mr-1" />
                              View
                            </a>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <a href={fileUrl} download={fileName} className="no-underline">
                              <Download className="w-4 h-4 mr-1" />
                              Download
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )
            }
            
            // Handle media references
            if (className && className.includes('media-reference')) {
              const mediaName = props['data-media-name']
              const mediaType = props['data-media-type']
              const mediaUrl = props['data-media-url']
              const mediaAlt = props['data-media-alt']
              const mediaCaption = props['data-media-caption']
              const mediaDescription = props['data-description']
              const mediaFollowingText = props['data-following-text']
              
              return (
                <div className="block mb-4">
                  {/* Following text appears first */}
                  {mediaFollowingText && (
                    <p className="text-vision-charcoal/80 mb-2">{mediaFollowingText}</p>
                  )}
                  
                  {/* Media Preview */}
                  {mediaType === 'image' && (
                    <img
                      src={mediaUrl}
                      alt={mediaAlt || mediaName}
                      className="max-w-full h-auto border border-vision-border rounded-lg"
                      loading="lazy"
                    />
                  )}
                  
                  {mediaType === 'video' && (
                    <video
                      src={mediaUrl}
                      controls
                      className="max-w-full h-auto border border-vision-border rounded-lg"
                      preload="metadata"
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}
                  
                  {mediaType === 'audio' && (
                    <audio
                      src={mediaUrl}
                      controls
                      className="w-full"
                      preload="metadata"
                    >
                      Your browser does not support the audio tag.
                    </audio>
                  )}
                  
                  {mediaType === 'gif' && (
                    <img
                      src={mediaUrl}
                      alt={mediaAlt || mediaName}
                      className="max-w-full h-auto border border-vision-border rounded-lg"
                      loading="lazy"
                    />
                  )}
                  
                  {/* Caption appears below media in italic with reduced spacing */}
                  {mediaCaption && (
                    <p className="text-vision-charcoal/60 italic text-sm mt-1">{mediaCaption}</p>
                  )}
                </div>
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