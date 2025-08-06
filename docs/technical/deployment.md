# Deployment Guide

## Overview

This guide covers the complete deployment process for My Vision Hub v2.0, including environment setup, build configuration, and production deployment strategies.

## 🚀 Deployment Platforms

### Primary: Vercel (Recommended)

**Why Vercel?**
- **Next.js Optimization**: Built-in Next.js support and optimization
- **Preview Deployments**: Automatic preview builds for pull requests
- **Edge Functions**: Serverless functions with global edge network
- **Analytics**: Built-in performance and analytics
- **Git Integration**: Automatic deployments from Git

### Alternative: Netlify

**Features:**
- **Static Site Generation**: Excellent for static content
- **Form Handling**: Built-in form processing
- **Functions**: Serverless functions support
- **CDN**: Global content delivery network

## 🔧 Environment Setup

### Production Environment Variables

**Required Variables:**
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Notion Configuration (optional)
NOTION_API_KEY=your_notion_integration_token
NOTION_BLOG_DB_ID=your_blog_database_id
NOTION_PROJECT_DB_ID=your_project_database_id

# GitHub Configuration (optional)
GITHUB_TOKEN=your_github_personal_access_token

# OpenAI Configuration (future)
OPENAI_API_KEY=your_openai_api_key
```

**Optional Variables:**
```bash
# Analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key

# Social Media
NEXT_PUBLIC_TWITTER_HANDLE=your_twitter_handle
NEXT_PUBLIC_GITHUB_HANDLE=your_github_handle

# SEO
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SITE_NAME=My Vision Hub
```

### Environment Validation

**Production Checklist:**
- [ ] All required environment variables are set
- [ ] Database connections are working
- [ ] External API integrations are configured
- [ ] SSL certificates are valid
- [ ] Domain is properly configured

## 🏗️ Build Configuration

### Next.js Configuration

**`next.config.js`:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static exports for certain pages
  trailingSlash: true,
  
  // Image optimization
  images: {
    domains: ['images.unsplash.com', 'github.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type',
          },
        ],
      },
    ]
  },
  
  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/blog',
        destination: '/blog/',
        permanent: true,
      },
      {
        source: '/projects',
        destination: '/projects/',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
```

### Package.json Scripts

**`package.json`:**
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "build:analyze": "ANALYZE=true next build",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

## 🚀 Vercel Deployment

### 1. Connect Repository

1. **Sign up** at [vercel.com](https://vercel.com)
2. **Import your repository** from GitHub
3. **Configure project settings**:
   - Framework Preset: Next.js
   - Root Directory: `./` (default)
   - Build Command: `npm run build`
   - Output Directory: `.next` (default)

### 2. Environment Variables

**In Vercel Dashboard:**
1. Go to **Project Settings** → **Environment Variables**
2. Add all required environment variables
3. Set **Production**, **Preview**, and **Development** environments

### 3. Domain Configuration

**Custom Domain Setup:**
1. Go to **Project Settings** → **Domains**
2. Add your custom domain
3. Configure DNS records as instructed
4. Enable **HTTPS** automatically

### 4. Preview Deployments

**Automatic Previews:**
- Every pull request gets a preview URL
- Preview deployments use preview environment variables
- Automatic testing and validation

## 🔧 Build Optimization

### Performance Optimization

**Bundle Analysis:**
```bash
# Install bundle analyzer
npm install --save-dev @next/bundle-analyzer

# Analyze bundle
npm run build:analyze
```

**Code Splitting:**
```typescript
// Dynamic imports for heavy components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false
})
```

**Image Optimization:**
```typescript
import Image from 'next/image'

// Optimized images
<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  priority={true}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

### SEO Optimization

**Meta Tags:**
```typescript
// pages/_app.tsx
import Head from 'next/head'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>My Vision Hub</title>
        <meta name="description" content="Personal digital platform showcasing projects and thoughts" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
```

**Structured Data:**
```typescript
// Add structured data for projects
const structuredData = {
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": project.title,
  "description": project.description,
  "author": {
    "@type": "Person",
    "name": "Your Name"
  }
}
```

## 📊 Monitoring & Analytics

### Vercel Analytics

**Enable Analytics:**
1. Go to **Project Settings** → **Analytics**
2. Enable **Web Analytics**
3. View performance metrics and user behavior

### Performance Monitoring

**Core Web Vitals:**
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

**Monitoring Tools:**
- **Vercel Analytics**: Built-in performance monitoring
- **Google PageSpeed Insights**: External performance testing
- **Lighthouse**: Automated performance audits

### Error Monitoring

**Error Tracking:**
```typescript
// Error boundary for React components
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log error to monitoring service
    console.error('Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />
    }

    return this.props.children
  }
}
```

## 🔒 Security

### Security Headers

**Content Security Policy:**
```javascript
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
  }
]
```

**HTTPS Enforcement:**
```javascript
// Force HTTPS in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`)
    } else {
      next()
    }
  })
}
```

### Environment Variable Security

**Best Practices:**
- Never commit sensitive environment variables
- Use different keys for development and production
- Rotate keys regularly
- Use Vercel's encrypted environment variables

## 🔄 CI/CD Pipeline

### GitHub Actions

**`.github/workflows/deploy.yml`:**
```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Type check
        run: npm run type-check
      
      - name: Lint
        run: npm run lint
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### Automated Testing

**Pre-deployment Tests:**
```bash
# Run all tests before deployment
npm run test
npm run type-check
npm run lint
npm run build
```

## 📈 Performance Optimization

### Caching Strategy

**Static Generation:**
```typescript
// Generate static pages for projects
export async function generateStaticParams() {
  const projects = await getProjects()
  
  return projects.map((project) => ({
    slug: project.slug,
  }))
}
```

**Incremental Static Regeneration:**
```typescript
// Revalidate pages every hour
export const revalidate = 3600

// Or revalidate on demand
export async function generateStaticParams() {
  const projects = await getProjects()
  
  return projects.map((project) => ({
    slug: project.slug,
  }))
}
```

### CDN Configuration

**Vercel Edge Network:**
- Automatic global CDN distribution
- Edge functions for dynamic content
- Image optimization and delivery
- Automatic compression and caching

## 🚨 Troubleshooting

### Common Issues

**Build Failures:**
```bash
# Check build logs
vercel logs

# Debug build issues
npm run build --debug

# Check environment variables
vercel env ls
```

**Performance Issues:**
```bash
# Analyze bundle size
npm run build:analyze

# Check Core Web Vitals
npx lighthouse https://your-domain.com

# Monitor performance
vercel analytics
```

**Database Connection Issues:**
```bash
# Test database connection
curl https://your-domain.com/api/projects

# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
```

### Rollback Strategy

**Emergency Rollback:**
1. **Revert to previous deployment** in Vercel dashboard
2. **Rollback database changes** if needed
3. **Update environment variables** if required
4. **Test functionality** after rollback

## 📚 Additional Resources

### Documentation
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel CLI](https://vercel.com/docs/cli)

### Tools
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel CLI](https://vercel.com/docs/cli)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

---

**Last Updated**: December 2024  
**Deployment Version**: v1.0  
**Next Update**: v0.5 Release 