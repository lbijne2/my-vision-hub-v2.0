import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const repo = searchParams.get('repo')
    const username = searchParams.get('username')
    const path = searchParams.get('path') || ''

    if (!action) {
      return NextResponse.json(
        { error: 'Missing required parameter: action' },
        { status: 400 }
      )
    }

    const token = process.env.GITHUB_TOKEN
    if (!token) {
      console.warn('GitHub token not configured')
      return NextResponse.json(
        { error: 'GitHub token not configured' },
        { status: 500 }
      )
    }

    const headers: HeadersInit = {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'MyVisionHub/1.0'
    }

    switch (action) {
      case 'repo':
        if (!repo) {
          return NextResponse.json(
            { error: 'Missing required parameter: repo' },
            { status: 400 }
          )
        }

        const [owner, repoName] = repo.split('/')
        if (!owner || !repoName) {
          return NextResponse.json(
            { error: 'Invalid repository format. Expected "owner/repo"' },
            { status: 400 }
          )
        }

        // Fetch repository info
        const repoResponse = await fetch(
          `https://api.github.com/repos/${owner}/${repoName}`,
          { headers }
        )

        if (!repoResponse.ok) {
          if (repoResponse.status === 404) {
            return NextResponse.json(
              { error: `Repository ${repo} not found` },
              { status: 404 }
            )
          }
          if (repoResponse.status === 403) {
            return NextResponse.json(
              { error: 'GitHub API rate limit exceeded' },
              { status: 403 }
            )
          }
          return NextResponse.json(
            { error: `GitHub API error: ${repoResponse.status}` },
            { status: repoResponse.status }
          )
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

        return NextResponse.json({
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
        })

      case 'user':
        if (!username) {
          return NextResponse.json(
            { error: 'Missing required parameter: username' },
            { status: 400 }
          )
        }

        // Fetch user data
        const userResponse = await fetch(
          `https://api.github.com/users/${username}`,
          { headers }
        )

        if (!userResponse.ok) {
          if (userResponse.status === 404) {
            return NextResponse.json(
              { error: `User ${username} not found` },
              { status: 404 }
            )
          }
          if (userResponse.status === 403) {
            return NextResponse.json(
              { error: 'GitHub API rate limit exceeded' },
              { status: 403 }
            )
          }
          return NextResponse.json(
            { error: `GitHub API error: ${userResponse.status}` },
            { status: userResponse.status }
          )
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

        return NextResponse.json({
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
        })

      case 'user-repos':
        if (!username) {
          return NextResponse.json(
            { error: 'Missing required parameter: username' },
            { status: 400 }
          )
        }

        // Fetch user's repositories
        const userReposResponse = await fetch(
          `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
          { headers }
        )

        if (!userReposResponse.ok) {
          if (userReposResponse.status === 404) {
            return NextResponse.json(
              { error: `User ${username} not found` },
              { status: 404 }
            )
          }
          if (userReposResponse.status === 403) {
            return NextResponse.json(
              { error: 'GitHub API rate limit exceeded' },
              { status: 403 }
            )
          }
          return NextResponse.json(
            { error: `GitHub API error: ${userReposResponse.status}` },
            { status: userReposResponse.status }
          )
        }

        const repos = await userReposResponse.json()

        // Fetch topics for each repository
        const reposWithTopics = await Promise.all(
          repos.map(async (repo: any) => {
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

        return NextResponse.json(reposWithTopics)

      case 'contents':
        if (!repo) {
          return NextResponse.json(
            { error: 'Missing required parameter: repo' },
            { status: 400 }
          )
        }

        const [owner2, repoName2] = repo.split('/')
        if (!owner2 || !repoName2) {
          return NextResponse.json(
            { error: 'Invalid repository format. Expected "owner/repo"' },
            { status: 400 }
          )
        }

        // Fetch repository contents
        const contentsResponse = await fetch(
          `https://api.github.com/repos/${owner2}/${repoName2}/contents/${encodeURIComponent(path)}`,
          { headers }
        )

        if (!contentsResponse.ok) {
          if (contentsResponse.status === 404) {
            return NextResponse.json(
              { error: `Path ${path} not found in repository ${repo}` },
              { status: 404 }
            )
          }
          if (contentsResponse.status === 403) {
            return NextResponse.json(
              { error: 'GitHub API rate limit exceeded' },
              { status: 403 }
            )
          }
          return NextResponse.json(
            { error: `GitHub API error: ${contentsResponse.status}` },
            { status: contentsResponse.status }
          )
        }

        const contents = await contentsResponse.json()
        return NextResponse.json(contents)

      case 'file':
        if (!repo) {
          return NextResponse.json(
            { error: 'Missing required parameter: repo' },
            { status: 400 }
          )
        }

        if (!path) {
          return NextResponse.json(
            { error: 'Missing required parameter: path' },
            { status: 400 }
          )
        }

        const [owner3, repoName3] = repo.split('/')
        if (!owner3 || !repoName3) {
          return NextResponse.json(
            { error: 'Invalid repository format. Expected "owner/repo"' },
            { status: 400 }
          )
        }

        // Fetch file content
        const fileResponse = await fetch(
          `https://api.github.com/repos/${owner3}/${repoName3}/contents/${encodeURIComponent(path)}`,
          { headers }
        )

        if (!fileResponse.ok) {
          if (fileResponse.status === 404) {
            return NextResponse.json(
              { error: `File ${path} not found in repository ${repo}` },
              { status: 404 }
            )
          }
          if (fileResponse.status === 403) {
            return NextResponse.json(
              { error: 'GitHub API rate limit exceeded' },
              { status: 403 }
            )
          }
          return NextResponse.json(
            { error: `GitHub API error: ${fileResponse.status}` },
            { status: fileResponse.status }
          )
        }

        const fileData = await fileResponse.json()

        // Decode base64 content
        if (fileData.encoding === 'base64') {
          const decodedContent = Buffer.from(fileData.content, 'base64').toString('utf-8')
          return NextResponse.json({ content: decodedContent })
        } else {
          return NextResponse.json(
            { error: 'Unexpected encoding: ' + fileData.encoding },
            { status: 500 }
          )
        }

      default:
        return NextResponse.json(
          { error: 'Invalid action. Supported actions: repo, user, user-repos, contents, file' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error in GitHub API route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
