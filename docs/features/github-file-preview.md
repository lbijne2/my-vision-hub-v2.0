# GitHub File Preview Integration

## Overview

The GitHub File Preview feature provides two ways to explore GitHub repository content on project pages:

1. **Single File Preview**: Display a specific file with syntax highlighting
2. **Repository Browser**: Interactive file browser to explore and preview any file in the repository

This provides users with immediate access to relevant code, documentation, or configuration files without leaving the project page.

## Features

### Single File Preview
- **Syntax Highlighting**: Supports 40+ programming languages with proper syntax highlighting
- **File Type Detection**: Automatically detects file type based on extension
- **Error Handling**: Graceful fallback for private repos, missing files, or API errors
- **Loading States**: Skeleton loading UI for better user experience

### Repository Browser
- **Interactive File Tree**: Browse directories and files with folder/file icons
- **Search Functionality**: Search for files by name
- **Breadcrumb Navigation**: Easy navigation through directory structure
- **File Preview**: Click any file to preview with syntax highlighting
- **Back Navigation**: Seamless switching between browser and preview modes
- **Responsive Design**: Works on all screen sizes

## Setup

### 1. Notion Database Configuration

In your **Projects** database in Notion, add a new property:

- **Name:** `GitHub Preview Path`
- **Type:** Text (optional)
- **Example values:** `README.md`, `src/index.tsx`, `package.json`

### 2. Environment Variables

Ensure your `.env.local` file includes:

```bash
GITHUB_TOKEN=your_github_personal_access_token
```

### 3. Usage

#### Single File Preview
The file preview will automatically appear on project pages that have:
- A valid `github_repo` field (format: `owner/repo`)
- A non-empty `github_preview_path` field

#### Repository Browser
The repository browser will automatically appear on project pages that have:
- A valid `github_repo` field (format: `owner/repo`)
- An empty or missing `github_preview_path` field

## Supported File Types

The component automatically detects and highlights syntax for:

| Extension | Language | Extension | Language |
|-----------|----------|-----------|----------|
| `.js` | JavaScript | `.ts` | TypeScript |
| `.jsx` | JavaScript | `.tsx` | TypeScript |
| `.json` | JSON | `.md` | Markdown |
| `.py` | Python | `.java` | Java |
| `.cpp` | C++ | `.c` | C |
| `.cs` | C# | `.php` | PHP |
| `.rb` | Ruby | `.go` | Go |
| `.rs` | Rust | `.swift` | Swift |
| `.kt` | Kotlin | `.scala` | Scala |
| `.html` | HTML | `.css` | CSS |
| `.scss` | SCSS | `.sass` | Sass |
| `.less` | Less | `.xml` | XML |
| `.yaml` | YAML | `.yml` | YAML |
| `.toml` | TOML | `.ini` | INI |
| `.sh` | Bash | `.sql` | SQL |
| `.r` | R | `.m` | MATLAB |
| `.tex` | LaTeX | `.vue` | Vue |
| `.svelte` | Svelte | `.astro` | Astro |

## Error Handling

The component handles various error scenarios:

- **File Not Found**: Shows error message with link to GitHub
- **Private Repository**: Displays appropriate error message
- **Rate Limit Exceeded**: Shows timeout message
- **Network Errors**: Graceful fallback with retry option

## API Endpoints

### Test Endpoint

`GET /api/test-github-file?repo=owner/repo&path=filepath`

Returns file content for testing purposes.

## Component Structure

### Single File Preview
```tsx
<GitHubFilePreview 
  repo="owner/repo" 
  path="src/index.tsx" 
/>
```

### Repository Browser
```tsx
<GitHubRepoBrowser 
  repo="owner/repo" 
  initialPath="src" // optional
/>
```

## Styling

The component uses the existing design system:
- **Card Layout**: Consistent with other project page components
- **Color Scheme**: Uses vision color palette
- **Typography**: Matches project page styling
- **Icons**: Lucide React icons for consistency

## Performance Considerations

- **Timeout**: 10-second timeout for GitHub API calls
- **Caching**: No client-side caching (GitHub handles caching)
- **Bundle Size**: Minimal impact with tree-shaking
- **Lazy Loading**: Component only loads when needed

## Future Enhancements

- [ ] Support for private repositories
- [ ] File tree navigation
- [ ] Multiple file previews
- [ ] Diff viewing capabilities
- [ ] Branch selection
- [ ] Commit history integration

## Troubleshooting

### Common Issues

1. **File not loading**
   - Check if the file exists in the repository
   - Verify the path is correct (case-sensitive)
   - Ensure the repository is public

2. **Syntax highlighting not working**
   - Check if the file extension is supported
   - Verify the language detection logic

3. **GitHub API errors**
   - Check your GitHub token permissions
   - Verify rate limits haven't been exceeded
   - Ensure the repository is accessible

### Debug Mode

Enable debug logging by checking browser console for detailed error messages.
