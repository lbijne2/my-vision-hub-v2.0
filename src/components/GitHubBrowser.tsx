'use client'

import { useState, useEffect } from 'react'
import { GitHubRepoBrowser } from './GitHubRepoBrowser'
import { GitHubUserBrowser } from './GitHubUserBrowser'
import { isGitHubUser, extractGitHubUsername } from '@/lib/github'

interface GitHubBrowserProps {
  githubField: string
}

export function GitHubBrowser({ githubField }: GitHubBrowserProps) {
  const [isUser, setIsUser] = useState(false)
  const [username, setUsername] = useState('')
  const [repo, setRepo] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Validate input
    if (!githubField || githubField.trim() === '') {
      console.warn('GitHubBrowser: Empty githubField provided')
      setIsLoading(false)
      return
    }

    const user = isGitHubUser(githubField)
    setIsUser(user)
    
    if (user) {
      const extractedUsername = extractGitHubUsername(githubField)
      setUsername(extractedUsername)
    } else {
      setRepo(githubField)
    }
    
    setIsLoading(false)
  }, [githubField])

  // Show loading state
  if (isLoading) {
    return (
      <div className="p-4 text-center text-vision-charcoal/60">
        Loading GitHub information...
      </div>
    )
  }

  // Show error if no githubField provided
  if (!githubField || githubField.trim() === '') {
    return (
      <div className="p-4 text-center text-vision-charcoal/60">
        No GitHub information available
      </div>
    )
  }

  // Safety check - if we think it's a user but we're about to call GitHubRepoBrowser, log an error
  if (!isUser && !repo.includes('/')) {
    console.error('GitHubBrowser: Warning - calling GitHubRepoBrowser with what appears to be a username:', repo)
  }

  if (isUser) {
    return <GitHubUserBrowser username={username} />
  } else {
    return <GitHubRepoBrowser repo={repo} />
  }
}
