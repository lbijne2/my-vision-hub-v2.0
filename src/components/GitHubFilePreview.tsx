'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { FileText, ExternalLink, AlertCircle } from "lucide-react"
// Using API route instead of direct GitHub call
import { Highlight, themes } from "prism-react-renderer"
import { GitHubFilePreviewSkeleton } from "@/components/ui/loading-skeletons"

interface GitHubFilePreviewProps {
  repo: string
  path: string
}

export function GitHubFilePreview({ repo, path }: GitHubFilePreviewProps) {
  const [content, setContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout

    const fetchFileContent = async () => {
      try {
        const response = await fetch(`/api/github?action=file&repo=${encodeURIComponent(repo)}&path=${encodeURIComponent(path)}`, {
          signal: controller.signal
        })
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        if (data.content) {
          setContent(data.content)
          setError(null)
        } else {
          setError('file_not_found')
        }
      } catch (err) {
        if ((err as any)?.name === 'AbortError') {
          console.warn('GitHub file fetch aborted due to timeout')
          setError('timeout')
        } else {
          console.error('Error fetching GitHub file content:', err)
          setError('fetch_error')
        }
      } finally {
        clearTimeout(timeoutId)
        setLoading(false)
      }
    }

    fetchFileContent()
    return () => {
      clearTimeout(timeoutId)
      controller.abort()
    }
  }, [repo, path])

  // Determine file extension for syntax highlighting
  const getFileExtension = (filePath: string): string => {
    const parts = filePath.split('.')
    return parts.length > 1 ? parts[parts.length - 1] : ''
  }

  const getLanguage = (filePath: string): string => {
    const ext = getFileExtension(filePath).toLowerCase()
    const languageMap: { [key: string]: string } = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'json': 'json',
      'md': 'markdown',
      'mdx': 'markdown',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'cs': 'csharp',
      'php': 'php',
      'rb': 'ruby',
      'go': 'go',
      'rs': 'rust',
      'swift': 'swift',
      'kt': 'kotlin',
      'scala': 'scala',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'sass': 'sass',
      'less': 'less',
      'xml': 'xml',
      'yaml': 'yaml',
      'yml': 'yaml',
      'toml': 'toml',
      'ini': 'ini',
      'sh': 'bash',
      'bash': 'bash',
      'zsh': 'bash',
      'sql': 'sql',
      'r': 'r',
      'm': 'matlab',
      'tex': 'latex',
      'vue': 'vue',
      'svelte': 'svelte',
      'astro': 'astro'
    }
    return languageMap[ext] || 'text'
  }

  const language = getLanguage(path)

  if (loading) {
    return <GitHubFilePreviewSkeleton />
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-vision-charcoal flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Preview: /{path}
          </CardTitle>
          <CardDescription>
            File preview from GitHub repository
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <AlertCircle className="h-8 w-8 text-vision-charcoal/40 mx-auto mb-3" />
            <p className="text-vision-charcoal/60 mb-4 text-sm">
              {error === 'timeout' 
                ? 'File preview is taking longer than expected to load'
                : error === 'file_not_found'
                ? 'Could not load file preview. The file may not exist or the repository may be private.'
                : 'Could not load file preview.'
              }
            </p>
            <Button
              variant="outline"
              size="sm"
              className="text-vision-ochre border-vision-ochre hover:bg-vision-ochre/10"
              asChild
            >
              <a 
                href={`https://github.com/${repo}/blob/main/${path}`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View on GitHub
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!content) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-vision-charcoal flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Preview: /{path}
        </CardTitle>
        <CardDescription>
          File content from GitHub repository
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-vision-charcoal/60">
            <span className="font-medium">Language:</span>
            <span className="capitalize">{language}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-vision-ochre border-vision-ochre hover:bg-vision-ochre/10"
            asChild
          >
            <a 
              href={`https://github.com/${repo}/blob/main/${path}`} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View on GitHub
            </a>
          </Button>
        </div>
        <Separator className="mb-4" />
        <div className="relative">
          <Highlight
            theme={themes.github}
            code={content}
            language={language}
          >
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre 
                className={`${className} rounded-lg p-4 overflow-x-auto text-sm`} 
                style={style}
              >
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line })}>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </div>
                ))}
              </pre>
            )}
          </Highlight>
        </div>
      </CardContent>
    </Card>
  )
}
