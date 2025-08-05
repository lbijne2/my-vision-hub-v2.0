export interface GitHubRepoData {
  name: string
  description: string | null
  stars: number
  forks: number
  lastCommit: string
  url: string
  language: string | null
  topics: string[]
  openIssues: number
  defaultBranch: string
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