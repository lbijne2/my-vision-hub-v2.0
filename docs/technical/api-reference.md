# API Reference

## Overview

This document provides a comprehensive reference for all API endpoints in My Vision Hub v2.0, including request/response formats, authentication, and error handling.

## 🔗 Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://your-domain.vercel.app/api`

## 📋 API Endpoints

### Projects API

#### GET `/api/projects`
Retrieve all projects with optional filtering.

**Query Parameters:**
- `status` (optional): Filter by status (`active`, `prototype`, `archived`)
- `tag` (optional): Filter by tag
- `search` (optional): Search in title, subtitle, description

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Project Title",
      "slug": "project-slug",
      "subtitle": "Project Subtitle",
      "description": "Project description",
      "cover_image_url": "https://example.com/image.jpg",
      "tags": ["react", "typescript"],
      "status": "active",
      "github_url": "https://github.com/user/repo",
      "notion_url": "https://notion.so/page",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "error": null
}
```

#### GET `/api/projects/[slug]`
Retrieve a specific project by slug.

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "title": "Project Title",
    "slug": "project-slug",
    "subtitle": "Project Subtitle",
    "description": "Project description",
    "cover_image_url": "https://example.com/image.jpg",
    "tags": ["react", "typescript"],
    "status": "active",
    "github_url": "https://github.com/user/repo",
    "notion_url": "https://notion.so/page",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  "error": null
}
```

### Blog API

#### GET `/api/blog`
Retrieve all published blog posts.

**Query Parameters:**
- `tag` (optional): Filter by tag
- `search` (optional): Search in title and content
- `limit` (optional): Number of posts to return (default: 10)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Blog Post Title",
      "slug": "blog-post-slug",
      "content": "Blog post content in markdown",
      "author": "Author Name",
      "published": true,
      "tags": ["technology", "ai"],
      "published_at": "2024-01-01T00:00:00Z",
      "notion_url": "https://notion.so/page",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "error": null
}
```

#### GET `/api/blog/[slug]`
Retrieve a specific blog post by slug.

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "title": "Blog Post Title",
    "slug": "blog-post-slug",
    "content": "Blog post content in markdown",
    "author": "Author Name",
    "published": true,
    "tags": ["technology", "ai"],
    "published_at": "2024-01-01T00:00:00Z",
    "notion_url": "https://notion.so/page",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  "error": null
}
```

### Agents API

#### GET `/api/agents`
Retrieve all agents.

**Query Parameters:**
- `status` (optional): Filter by status (`active`, `prototype`, `idea`)
- `category` (optional): Filter by category
- `tag` (optional): Filter by tag

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Agent Name",
      "slug": "agent-slug",
      "status": "active",
      "category": "Content Processing",
      "description": "Agent description",
      "inputs": {
        "content": "string",
        "max_length": "number"
      },
      "tags": ["ai", "content"],
      "example_uses": [
        "Summarize blog posts",
        "Generate content"
      ],
      "trigger_type": "api",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "error": null
}
```

#### GET `/api/agents/[slug]`
Retrieve a specific agent by slug.

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "name": "Agent Name",
    "slug": "agent-slug",
    "status": "active",
    "category": "Content Processing",
    "description": "Agent description",
    "inputs": {
      "content": "string",
      "max_length": "number"
    },
    "tags": ["ai", "content"],
    "example_uses": [
      "Summarize blog posts",
      "Generate content"
    ],
    "trigger_type": "api",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  "error": null
}
```

### GitHub Integration API

#### GET `/api/github/status`
Check GitHub API connectivity and rate limits.

**Response:**
```json
{
  "status": "connected",
  "rateLimit": {
    "limit": 5000,
    "remaining": 4999,
    "reset": 1640995200
  },
  "error": null
}
```

#### GET `/api/github/repo`
Retrieve GitHub repository data.

**Query Parameters:**
- `url` (required): GitHub repository URL

**Response:**
```json
{
  "data": {
    "id": 123456789,
    "name": "repository-name",
    "full_name": "username/repository-name",
    "description": "Repository description",
    "html_url": "https://github.com/username/repository-name",
    "stargazers_count": 42,
    "forks_count": 10,
    "language": "TypeScript",
    "updated_at": "2024-01-01T00:00:00Z",
    "default_branch": "main",
    "open_issues_count": 5,
    "archived": false,
    "disabled": false
  },
  "error": null
}
```

### Notion Integration API

#### GET `/api/notion-status`
Check Notion API connectivity.

**Response:**
```json
{
  "status": "connected",
  "databases": {
    "blog": "available",
    "projects": "available"
  },
  "error": null
}
```

## 🔒 Error Handling

### Standard Error Response
```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": "Additional error details"
  },
  "data": null
}
```

### Common Error Codes
- `400`: Bad Request - Invalid parameters
- `404`: Not Found - Resource not found
- `500`: Internal Server Error - Server error
- `503`: Service Unavailable - External service unavailable

### Error Examples

**Resource Not Found:**
```json
{
  "error": {
    "message": "Project not found",
    "code": "NOT_FOUND",
    "details": "No project found with slug 'non-existent-slug'"
  },
  "data": null
}
```

**External Service Error:**
```json
{
  "error": {
    "message": "GitHub API unavailable",
    "code": "EXTERNAL_SERVICE_ERROR",
    "details": "Rate limit exceeded or service down"
  },
  "data": null
}
```

## 🔄 Rate Limiting

### GitHub API
- **Rate Limit**: 5,000 requests per hour (unauthenticated)
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

### Notion API
- **Rate Limit**: 3 requests per second
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`

## 📊 Response Headers

### Standard Headers
```
Content-Type: application/json
Cache-Control: public, max-age=300
X-Request-ID: uuid
```

### CORS Headers
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

## 🧪 Testing

### Health Check
```bash
curl http://localhost:3000/api/health
```

### Test Endpoints
```bash
# Test projects API
curl http://localhost:3000/api/projects

# Test blog API
curl http://localhost:3000/api/blog

# Test agents API
curl http://localhost:3000/api/agents

# Test GitHub integration
curl "http://localhost:3000/api/github/repo?url=https://github.com/user/repo"

# Test Notion integration
curl http://localhost:3000/api/notion-status
```

## 🔧 Development

### Local Development
```bash
# Start development server
npm run dev

# Test API endpoints
curl http://localhost:3000/api/projects
```

### Environment Variables
```bash
# Required for API functionality
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
NOTION_API_KEY=your_notion_key
NOTION_BLOG_DB_ID=your_blog_db_id
NOTION_PROJECT_DB_ID=your_project_db_id
```

## 📚 Additional Resources

- [Supabase API Documentation](https://supabase.com/docs/reference/javascript)
- [Notion API Documentation](https://developers.notion.com)
- [GitHub REST API Documentation](https://docs.github.com/en/rest)

---

**Last Updated**: December 2024  
**API Version**: v1.0  
**Next Update**: v0.5 Release 