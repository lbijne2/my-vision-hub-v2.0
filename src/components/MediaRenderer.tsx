import React from 'react'
import { Download, File, FileText, FileSpreadsheet, Presentation, FileArchive, Image, Video, Radio, FileImage, FileVideo, FileAudio, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn, formatFileSize } from '@/lib/utils'
import type { BlogPostAttachment, BlogPostMedia } from '@/types'

interface MediaRendererProps {
  attachments?: BlogPostAttachment[]
  mediaFiles?: BlogPostMedia[]
  className?: string
}

// Helper function to detect file type from URL and MIME type
function detectFileType(url: string, mimeType?: string, declaredType?: string): string {
  console.log('detectFileType called with:', { url, mimeType, declaredType })
  
  // Early return for empty URLs
  if (!url || url.trim() === '') {
    console.log('Empty URL provided, returning default type')
    return 'other'
  }
  
  // Try to detect from MIME type first (highest priority)
  if (mimeType) {
    if (mimeType.startsWith('image/')) {
      console.log('Detected image from MIME type:', mimeType)
      return 'image'
    }
    if (mimeType.startsWith('video/')) {
      console.log('Detected video from MIME type:', mimeType)
      return 'video'
    }
    if (mimeType.startsWith('audio/')) {
      console.log('Detected audio from MIME type:', mimeType)
      return 'audio'
    }
    if (mimeType === 'application/pdf') {
      console.log('Detected PDF from MIME type:', mimeType)
      return 'pdf'
    }
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel') || mimeType.includes('vnd.ms-excel') || mimeType.includes('vnd.openxmlformats-officedocument.spreadsheetml')) {
      console.log('Detected spreadsheet from MIME type:', mimeType)
      return 'spreadsheet'
    }
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint') || mimeType.includes('vnd.ms-powerpoint') || mimeType.includes('vnd.openxmlformats-officedocument.presentationml')) {
      console.log('Detected presentation from MIME type:', mimeType)
      return 'presentation'
    }
    if (mimeType.includes('word') || mimeType.includes('document') || mimeType.includes('vnd.ms-word') || mimeType.includes('vnd.openxmlformats-officedocument.wordprocessingml') || mimeType.includes('text/')) {
      console.log('Detected document from MIME type:', mimeType)
      return 'document'
    }
    if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('7z') || mimeType.includes('compressed') || mimeType.includes('archive')) {
      console.log('Detected archive from MIME type:', mimeType)
      return 'archive'
    }
  }

  // Fallback to URL extension detection (second priority)
  // Extract the pathname from URL to avoid query parameters and fragments
  let urlPath: string
  try {
    // Handle both relative and absolute URLs
    if (url.startsWith('http://') || url.startsWith('https://')) {
      const urlObj = new URL(url)
      urlPath = urlObj.pathname
    } else {
      // For relative URLs, remove query parameters and fragments
      urlPath = url.split('?')[0].split('#')[0]
    }
  } catch (error) {
    // Fallback: just remove query parameters and fragments
    urlPath = url.split('?')[0].split('#')[0]
  }
  
  const urlLower = urlPath.toLowerCase()
  console.log('Extracted URL path for extension detection:', urlPath)
  
  if (urlLower.match(/\.(jpg|jpeg|png|gif|webp|svg|bmp|ico|tiff|tif|heic|heif)$/)) {
    console.log('Detected image from URL extension:', urlLower)
    return 'image'
  }
  if (urlLower.match(/\.(mp4|webm|mov|avi|mkv|wmv|flv|m4v|3gp|ogv|ts|mts)$/)) {
    console.log('Detected video from URL extension:', urlLower)
    return 'video'
  }
  if (urlLower.match(/\.(mp3|wav|ogg|aac|flac|wma|m4a|opus|webm)$/)) {
    console.log('Detected audio from URL extension:', urlLower)
    return 'audio'
  }
  if (urlLower.match(/\.(pdf)$/)) {
    console.log('Detected PDF from URL extension:', urlLower)
    return 'pdf'
  }
  if (urlLower.match(/\.(xlsx|xls|csv|ods|numbers)$/)) {
    console.log('Detected spreadsheet from URL extension:', urlLower)
    return 'spreadsheet'
  }
  if (urlLower.match(/\.(pptx|ppt|key|odp|pages)$/)) {
    console.log('Detected presentation from URL extension:', urlLower)
    return 'presentation'
  }
  if (urlLower.match(/\.(docx|doc|txt|rtf|odt|pages|md|markdown)$/)) {
    console.log('Detected document from URL extension:', urlLower)
    return 'document'
  }
  if (urlLower.match(/\.(zip|rar|7z|tar|gz|bz2|xz|dmg|iso)$/)) {
    console.log('Detected archive from URL extension:', urlLower)
    return 'archive'
  }

  // If we have a specific declared type that's not generic, use it (third priority)
  if (declaredType && declaredType !== 'file' && declaredType !== 'other') {
    console.log('Using declared type:', declaredType)
    return declaredType
  }

  // Final fallback: try to extract filename from URL and detect from that
  try {
    const filename = urlPath.split('/').pop() || ''
    if (filename) {
      const filenameLower = filename.toLowerCase()
      console.log('Trying filename-based detection:', filenameLower)
      
      if (filenameLower.match(/\.(jpg|jpeg|png|gif|webp|svg|bmp|ico|tiff|tif|heic|heif)$/)) {
        console.log('Detected image from filename:', filenameLower)
        return 'image'
      }
      if (filenameLower.match(/\.(mp4|webm|mov|avi|mkv|wmv|flv|m4v|3gp|ogv|ts|mts)$/)) {
        console.log('Detected video from filename:', filenameLower)
        return 'video'
      }
      if (filenameLower.match(/\.(mp3|wav|ogg|aac|flac|wma|m4a|opus|webm)$/)) {
        console.log('Detected audio from filename:', filenameLower)
        return 'audio'
      }
      if (filenameLower.match(/\.(pdf)$/)) {
        console.log('Detected PDF from filename:', filenameLower)
        return 'pdf'
      }
      if (filenameLower.match(/\.(xlsx|xls|csv|ods|numbers)$/)) {
        console.log('Detected spreadsheet from filename:', filenameLower)
        return 'spreadsheet'
      }
      if (filenameLower.match(/\.(pptx|ppt|key|odp|pages)$/)) {
        console.log('Detected presentation from filename:', filenameLower)
        return 'presentation'
      }
      if (filenameLower.match(/\.(docx|doc|txt|rtf|odt|pages|md|markdown)$/)) {
        console.log('Detected document from filename:', filenameLower)
        return 'document'
      }
      if (filenameLower.match(/\.(zip|rar|7z|tar|gz|bz2|xz|dmg|iso)$/)) {
        console.log('Detected archive from filename:', filenameLower)
        return 'archive'
      }
    }
  } catch (error) {
    console.log('Filename-based detection failed:', error)
  }

  // Default to 'other' for unrecognized types
  console.log('No type detected, using default: other')
  return 'other'
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

export function MediaRenderer({ attachments, mediaFiles, className }: MediaRendererProps) {
  const hasAttachments = attachments && attachments.length > 0
  const hasMediaFiles = mediaFiles && mediaFiles.length > 0

  if (!hasAttachments && !hasMediaFiles) {
    return null
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Media Files Section */}
      {hasMediaFiles && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-vision-charcoal flex items-center gap-2">
              <Image className="w-5 h-5" />
              Media Files
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 media-grid">
              {mediaFiles.map((media) => {
                // Detect the actual file type for proper preview rendering
                const actualType = detectFileType(media.url, media.mime_type, media.type)
                
                // Debug logging
                console.log('Media file:', {
                  name: media.name,
                  url: media.url,
                  declaredType: media.type,
                  mimeType: media.mime_type,
                  actualType: actualType,
                  width: media.width,
                  height: media.height,
                  duration: media.duration
                })
                
                return (
                  <Card key={media.id} className="overflow-hidden hover:shadow-md transition-shadow card">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          {getMediaTypeIcon(actualType, "text-vision-ochre flex-shrink-0")}
                          <div className="min-w-0 flex-1 overflow-hidden">
                            <CardTitle className="text-sm font-medium text-vision-charcoal truncate">
                              {media.name}
                            </CardTitle>
                            <Badge 
                              className={cn("text-xs mt-1", getMediaTypeColor(actualType))}
                            >
                              {actualType}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {/* Media Preview */}
                      {actualType === 'image' && (
                        <div className="mb-3">
                          <img
                            src={media.url}
                            alt={media.alt_text || media.name}
                            className="w-full h-32 object-cover rounded-lg border border-vision-border"
                            loading="lazy"
                          />
                        </div>
                      )}
                      
                      {actualType === 'video' && (
                        <div className="mb-3">
                          <video
                            src={media.url}
                            controls
                            className="w-full h-32 object-cover rounded-lg border border-vision-border"
                            preload="metadata"
                          >
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      )}
                      
                      {actualType === 'audio' && (
                        <div className="mb-3">
                          <audio
                            src={media.url}
                            controls
                            className="w-full"
                            preload="metadata"
                          >
                            Your browser does not support the audio tag.
                          </audio>
                        </div>
                      )}
                      
                      {actualType === 'gif' && (
                        <div className="mb-3">
                          <img
                            src={media.url}
                            alt={media.alt_text || media.name}
                            className="w-full h-32 object-cover rounded-lg border border-vision-border"
                            loading="lazy"
                          />
                        </div>
                      )}
                      
                      {/* Media Info */}
                      <div className="space-y-2 text-sm text-vision-charcoal/70">
                        {media.caption && (
                          <p className="text-vision-charcoal/80 italic">{media.caption}</p>
                        )}
                        {media.width && media.height && (
                          <p className="text-xs">
                            {media.width} × {media.height}px
                          </p>
                        )}
                        {media.duration && (
                          <p className="text-xs">
                            Duration: {Math.floor(media.duration / 60)}:{(media.duration % 60).toString().padStart(2, '0')}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-vision-ochre hover:text-vision-ochre"
                          asChild
                        >
                          <a href={media.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-1" />
                            View
                          </a>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-vision-ochre hover:text-vision-ochre"
                          asChild
                        >
                          <a href={media.url} download={media.name}>
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Attachments Section */}
      {hasAttachments && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-vision-charcoal flex items-center gap-2">
              <File className="w-5 h-5" />
              Attachments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 attachments-grid">
              {attachments.map((attachment) => {
                // Detect the actual file type for proper preview rendering
                const actualType = detectFileType(attachment.url, attachment.mime_type, attachment.type)
                
                return (
                  <Card key={attachment.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          {getFileTypeIcon(actualType, "text-vision-ochre flex-shrink-0")}
                          <div className="min-w-0 flex-1 overflow-hidden">
                            <h4 className="font-medium text-vision-charcoal truncate">
                              {attachment.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                                                          <Badge 
                              className={cn("text-xs", getFileTypeColor(actualType))}
                            >
                              {actualType}
                            </Badge>
                              {attachment.size && (
                                <span className="text-xs text-vision-charcoal/60">
                                  {formatFileSize(attachment.size)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-vision-ochre hover:text-vision-ochre"
                            asChild
                          >
                            <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4 mr-1" />
                              View
                            </a>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-vision-ochre hover:text-vision-ochre"
                            asChild
                          >
                            <a href={attachment.url} download={attachment.name}>
                              <Download className="w-4 h-4 mr-1" />
                              Download
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
