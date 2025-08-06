# Environment Setup

## Overview

This guide covers the complete environment setup for My Vision Hub v2.0, including all required environment variables, configuration files, and external service integrations.

## 🚀 Quick Setup

### 1. Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Notion Configuration (Optional - for fallback)
NOTION_API_KEY=your_notion_integration_token
NOTION_BLOG_DB_ID=your_blog_database_id
NOTION_PROJECT_DB_ID=your_project_database_id

# GitHub Configuration (Optional - for enhanced features)
GITHUB_TOKEN=your_github_personal_access_token

# OpenAI Configuration (Future - for AI features)
OPENAI_API_KEY=your_openai_api_key

# Vercel Configuration (Deployment)
VERCEL_URL=your-vercel-deployment-url
```

### 2. Environment Validation

The application validates required environment variables at startup:

```typescript
// src/lib/env.ts
const requiredEnvVars = {
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
}

// Validate at startup
Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
})
```

## 🗄️ Supabase Configuration

### 1. Create Supabase Project

1. **Sign up** at [supabase.com](https://supabase.com)
2. **Create a new project**
3. **Note your project URL and anon key**

### 2. Database Setup

Follow the [Database Setup Guide](./database-setup.md) to create tables and add sample data.

### 3. Environment Variables

```bash
# Required for database connection
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional for enhanced features
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. Test Connection

```bash
# Test Supabase connection
curl http://localhost:3000/api/projects
```

## 📝 Notion Configuration

### 1. Create Notion Integration

1. **Go to** [notion.so/my-integrations](https://notion.so/my-integrations)
2. **Create a new integration**
3. **Get your integration token**

### 2. Set Up Databases

1. **Create databases** for blog posts and projects
2. **Share databases** with your integration
3. **Note the database IDs**

### 3. Environment Variables

```bash
# Required for Notion integration
NOTION_API_KEY=your_notion_integration_token
NOTION_BLOG_DB_ID=your_blog_database_id
NOTION_PROJECT_DB_ID=your_project_database_id
```

### 4. Test Connection

```bash
# Test Notion connection
curl http://localhost:3000/api/notion-status
```

## 🔗 GitHub Configuration

### 1. Create GitHub Token

1. **Go to** [github.com/settings/tokens](https://github.com/settings/tokens)
2. **Generate new token** with appropriate permissions
3. **Copy the token**

### 2. Environment Variables

```bash
# Optional for enhanced GitHub features
GITHUB_TOKEN=your_github_personal_access_token
```

### 3. Test Connection

```bash
# Test GitHub API connection
curl http://localhost:3000/api/test-github
```

## 🤖 OpenAI Configuration (Future)

### 1. Create OpenAI Account

1. **Sign up** at [openai.com](https://openai.com)
2. **Get your API key**
3. **Set up billing** (required for API usage)

### 2. Environment Variables

```bash
# Future: OpenAI integration
OPENAI_API_KEY=your_openai_api_key
```

## 🚀 Deployment Configuration

### Vercel Deployment

1. **Connect repository** to Vercel
2. **Add environment variables** in Vercel dashboard
3. **Deploy automatically** on push to main branch

### Environment Variables for Production

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

## 🔧 Development Configuration

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

### TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Tailwind Configuration

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

## 🔒 Security Configuration

### Environment Variable Security

- **Never commit** `.env.local` to version control
- **Use different keys** for development and production
- **Rotate keys regularly** for security
- **Limit permissions** to minimum required

### API Key Management

```bash
# Development: Use .env.local
# Production: Use Vercel environment variables
# Never expose keys in client-side code
```

### CORS Configuration

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
```

## 🧪 Testing Configuration

### Environment Variables for Testing

```bash
# Test environment variables
NEXT_PUBLIC_SUPABASE_URL=https://test-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=test_anon_key
NOTION_API_KEY=test_notion_key
```

### Test Database Setup

```bash
# Use separate test database
# Reset data between tests
# Mock external APIs
```

## 🔄 Environment Management

### Development vs Production

| Environment | Database | API Keys | Caching |
|-------------|----------|----------|---------|
| Development | Local/Dev | Dev keys | Disabled |
| Staging | Staging DB | Staging keys | Enabled |
| Production | Production DB | Production keys | Enabled |

### Environment-Specific Configurations

```typescript
// src/lib/config.ts
const config = {
  development: {
    database: process.env.NEXT_PUBLIC_SUPABASE_URL,
    caching: false,
    logging: 'debug'
  },
  production: {
    database: process.env.NEXT_PUBLIC_SUPABASE_URL,
    caching: true,
    logging: 'error'
  }
}
```

## 🐛 Troubleshooting

### Common Issues

**Database Connection Errors**
```bash
# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# Verify Supabase project is active
# Check network connectivity
```

**Notion API Errors**
```bash
# Verify API key is correct
# Check database permissions
# Ensure databases are shared with integration
```

**GitHub API Errors**
```bash
# Check token permissions
# Verify rate limits
# Test API connectivity
```

### Debugging Tools

```bash
# Check environment variables
npm run env:check

# Test API connections
npm run test:apis

# Validate configuration
npm run validate:config
```

## 📚 Additional Resources

### Documentation
- [Supabase Documentation](https://supabase.com/docs)
- [Notion API Documentation](https://developers.notion.com)
- [GitHub API Documentation](https://docs.github.com/en/rest)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

### Tools
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Supabase Dashboard](https://supabase.com/dashboard)
- [Notion Integrations](https://notion.so/my-integrations)
- [GitHub Settings](https://github.com/settings)

---

**Last Updated**: December 2024  
**Configuration Version**: v1.0  
**Next Review**: v0.5 Release 