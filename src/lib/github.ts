export interface GitHubRepoData {
  name: string
  description: string | null
  stars: number
  forks: number
  watchers: number
  lastCommit: string
  url: string
  language: string | null
  topics: string[]
  openIssues: number
  defaultBranch: string
}

export interface GitHubUserData {
  login: string
  name: string | null
  bio: string | null
  avatar_url: string
  html_url: string
  followers: number
  following: number
  public_repos: number
  public_gists: number
  created_at: string
  updated_at: string
  location: string | null
  company: string | null
  blog: string | null
  twitter_username: string | null
  popularLanguages: { [key: string]: number }
}

export interface GitHubUserRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  stargazers_count: number
  forks_count: number
  language: string | null
  updated_at: string
  created_at: string
  topics: string[]
  private: boolean
  fork: boolean
  archived: boolean
  disabled: boolean
}

export async function getRepoInfo(repo: string): Promise<GitHubRepoData | null> {
  try {
    const token = process.env.GITHUB_TOKEN
    if (!token) {
      console.warn('GitHub token not configured')
      return null
    }

    const [owner, repoName] = repo.split('/')
    if (!owner || !repoName) {
      console.error('Invalid repository format. Expected "owner/repo"')
      return null
    }

    const headers: HeadersInit = {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'MyVisionHub/1.0'
    }

    // Fetch repository data
    const repoResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repoName}`,
      { headers }
    )

    if (!repoResponse.ok) {
      if (repoResponse.status === 404) {
        console.error(`Repository ${repo} not found`)
        return null
      }
      if (repoResponse.status === 403) {
        console.error('GitHub API rate limit exceeded')
        return null
      }
      throw new Error(`GitHub API error: ${repoResponse.status}`)
    }

    const repoData = await repoResponse.json()

    // Fetch latest commit
    const commitsResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repoName}/commits?per_page=1`,
      { headers }
    )

    let lastCommit = 'Unknown'
    if (commitsResponse.ok) {
      const commits = await commitsResponse.json()
      if (commits.length > 0) {
        const commit = commits[0]
        lastCommit = new Date(commit.commit.author.date).toLocaleDateString()
      }
    }

    // Fetch topics
    const topicsResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repoName}/topics`,
      { 
        headers: {
          ...headers,
          'Accept': 'application/vnd.github.mercy-preview+json'
        }
      }
    )

    let topics: string[] = []
    if (topicsResponse.ok) {
      const topicsData = await topicsResponse.json()
      topics = topicsData.names || []
    }

    return {
      name: repoData.name,
      description: repoData.description,
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      watchers: repoData.watchers_count,
      lastCommit,
      url: repoData.html_url,
      language: repoData.language,
      topics,
      openIssues: repoData.open_issues_count,
      defaultBranch: repoData.default_branch
    }
  } catch (error) {
    console.error('Error fetching GitHub repository data:', error)
    return null
  }
}

export function formatGitHubUrl(repo: string): string {
  return `https://github.com/${repo}`
}

export interface GitHubFileContent {
  content: string
  encoding: string
  size: number
  name: string
  path: string
  sha: string
}

export interface GitHubFileItem {
  name: string
  path: string
  sha: string
  size: number
  url: string
  html_url: string
  git_url: string
  download_url: string | null
  type: 'file' | 'dir'
  content?: string
  encoding?: string
}

export async function getRepoContents(repo: string, path: string = ''): Promise<GitHubFileItem[]> {
  try {
    const token = process.env.GITHUB_TOKEN
    if (!token) {
      console.warn('GitHub token not configured')
      return []
    }

    const [owner, repoName] = repo.split('/')
    if (!owner || !repoName) {
      console.error('Invalid repository format. Expected "owner/repo"')
      return []
    }

    const headers: HeadersInit = {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'MyVisionHub/1.0'
    }

    // Fetch repository contents
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repoName}/contents/${encodeURIComponent(path)}`,
      { headers }
    )

    if (!response.ok) {
      if (response.status === 404) {
        console.error(`Path ${path} not found in repository ${repo}`)
        return []
      }
      if (response.status === 403) {
        console.error('GitHub API rate limit exceeded')
        return []
      }
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const contents: GitHubFileItem[] = await response.json()
    return contents
  } catch (error) {
    console.error('Error fetching GitHub repository contents:', error)
    return []
  }
}

export async function getRepoFileContent(repo: string, path: string): Promise<string | null> {
  try {
    const token = process.env.GITHUB_TOKEN
    if (!token) {
      console.warn('GitHub token not configured')
      return null
    }

    const [owner, repoName] = repo.split('/')
    if (!owner || !repoName) {
      console.error('Invalid repository format. Expected "owner/repo"')
      return null
    }

    const headers: HeadersInit = {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'MyVisionHub/1.0'
    }

    // Fetch file content
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repoName}/contents/${encodeURIComponent(path)}`,
      { headers }
    )

    if (!response.ok) {
      if (response.status === 404) {
        console.error(`File ${path} not found in repository ${repo}`)
        return null
      }
      if (response.status === 403) {
        console.error('GitHub API rate limit exceeded')
        return null
      }
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const fileData: GitHubFileContent = await response.json()

    // Decode base64 content
    if (fileData.encoding === 'base64') {
      const decodedContent = Buffer.from(fileData.content, 'base64').toString('utf-8')
      return decodedContent
    } else {
      console.error('Unexpected encoding:', fileData.encoding)
      return null
    }
  } catch (error) {
    console.error('Error fetching GitHub file content:', error)
    return null
  }
} 

export async function getUserInfo(username: string): Promise<GitHubUserData | null> {
  try {
    const token = process.env.GITHUB_TOKEN
    if (!token) {
      console.warn('GitHub token not configured')
      return null
    }

    const headers: HeadersInit = {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'MyVisionHub/1.0'
    }

    // Fetch user data
    const userResponse = await fetch(
      `https://api.github.com/users/${username}`,
      { headers }
    )

    if (!userResponse.ok) {
      if (userResponse.status === 404) {
        console.error(`User ${username} not found`)
        return null
      }
      if (userResponse.status === 403) {
        console.error('GitHub API rate limit exceeded')
        return null
      }
      throw new Error(`GitHub API error: ${userResponse.status}`)
    }

    const userData = await userResponse.json()

    // Fetch user's repositories to get popular languages
    const reposResponse = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
      { headers }
    )

    let popularLanguages: { [key: string]: number } = {}
    if (reposResponse.ok) {
      const repos = await reposResponse.json()
      repos.forEach((repo: any) => {
        if (repo.language) {
          popularLanguages[repo.language] = (popularLanguages[repo.language] || 0) + 1
        }
      })
    }

    return {
      login: userData.login,
      name: userData.name,
      bio: userData.bio,
      avatar_url: userData.avatar_url,
      html_url: userData.html_url,
      followers: userData.followers,
      following: userData.following,
      public_repos: userData.public_repos,
      public_gists: userData.public_gists,
      created_at: userData.created_at,
      updated_at: userData.updated_at,
      location: userData.location,
      company: userData.company,
      blog: userData.blog,
      twitter_username: userData.twitter_username,
      popularLanguages
    }
  } catch (error) {
    console.error('Error fetching GitHub user data:', error)
    return null
  }
}

export async function getUserRepos(username: string): Promise<GitHubUserRepo[]> {
  try {
    const token = process.env.GITHUB_TOKEN
    if (!token) {
      console.warn('GitHub token not configured')
      return []
    }

    const headers: HeadersInit = {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'MyVisionHub/1.0'
    }

    // Fetch user's repositories
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
      { headers }
    )

    if (!response.ok) {
      if (response.status === 404) {
        console.error(`User ${username} not found`)
        return []
      }
      if (response.status === 403) {
        console.error('GitHub API rate limit exceeded')
        return []
      }
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const repos: any[] = await response.json()

    // Fetch topics for each repository
    const reposWithTopics = await Promise.all(
      repos.map(async (repo) => {
        let topics: string[] = []
        try {
          const topicsResponse = await fetch(
            `https://api.github.com/repos/${repo.full_name}/topics`,
            { 
              headers: {
                ...headers,
                'Accept': 'application/vnd.github.mercy-preview+json'
              }
            }
          )
          if (topicsResponse.ok) {
            const topicsData = await topicsResponse.json()
            topics = topicsData.names || []
          }
        } catch (error) {
          console.warn(`Could not fetch topics for ${repo.full_name}:`, error)
        }

        return {
          id: repo.id,
          name: repo.name,
          full_name: repo.full_name,
          description: repo.description,
          html_url: repo.html_url,
          stargazers_count: repo.stargazers_count,
          forks_count: repo.forks_count,
          language: repo.language,
          updated_at: repo.updated_at,
          created_at: repo.created_at,
          topics,
          private: repo.private,
          fork: repo.fork,
          archived: repo.archived,
          disabled: repo.disabled
        }
      })
    )

    return reposWithTopics
  } catch (error) {
    console.error('Error fetching GitHub user repositories:', error)
    return []
  }
}

export function isGitHubUser(githubField: string): boolean {
  // Check if the field contains just a username (no slash) or if it's a user URL
  // A repository should have owner/repo format or be a full GitHub URL with /blob/ or /tree/
  if (!githubField.includes('/')) {
    return true // Just a username
  }
  
  if (githubField.startsWith('https://github.com/')) {
    const path = githubField.replace('https://github.com/', '')
    const parts = path.split('/')
    
    // If it's just a username (one part) or has no /blob/ or /tree/, it's likely a user
    if (parts.length === 1 || (!path.includes('/blob/') && !path.includes('/tree/'))) {
      return true
    }
  }
  
  // If it contains a slash but doesn't look like a repository path, it might be a user
  // This is a fallback - repositories should have owner/repo format
  const parts = githubField.split('/')
  
  if (parts.length === 1) {
    return true
  }
  
  // If it has exactly 2 parts and looks like owner/repo, it's a repository
  if (parts.length === 2) {
    return false // This is a repository (owner/repo format)
  }
  
  return false
}

export function extractGitHubUsername(githubField: string): string {
  if (githubField.startsWith('https://github.com/')) {
    const path = githubField.replace('https://github.com/', '')
    return path.split('/')[0]
  }
  return githubField
} 