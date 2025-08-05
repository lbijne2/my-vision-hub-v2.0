# GitHub Integration Setup

This document explains how to set up GitHub integration for the Vision Hub project pages.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# GitHub Integration
# Get your GitHub token from: https://github.com/settings/tokens
# Required scopes: public_repo (for public repositories)
GITHUB_TOKEN=your_github_token_here
```

## Getting a GitHub Token

1. Go to [GitHub Settings > Tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Give it a descriptive name like "Vision Hub Integration"
4. Select the `public_repo` scope (for public repositories)
5. Click "Generate token"
6. Copy the token and add it to your `.env.local` file

## Vercel Deployment

If deploying to Vercel, add the `GITHUB_TOKEN` environment variable in your Vercel project settings:

1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add `GITHUB_TOKEN` with your GitHub token value
4. Deploy your project

## Testing the Integration

1. Add a `github_repo` field to your projects in `/src/data/projects.json`
2. Use the format: `"username/repository-name"`
3. Example: `"lbijne2/my-vision-hub-v2.0"`

## Features

The GitHub integration provides:

- Repository name and description
- Star and fork counts
- Last commit date
- Primary programming language
- Repository topics/tags
- Open issues count
- Direct link to GitHub repository

## Error Handling

The integration includes graceful error handling:

- Falls back to a simple "View on GitHub" link if API fails
- Handles rate limiting and authentication errors
- Logs errors for debugging

## Rate Limiting

GitHub's API has rate limits:
- Authenticated requests: 5,000 requests per hour
- Unauthenticated requests: 60 requests per hour

The integration uses authenticated requests when `GITHUB_TOKEN` is provided. 