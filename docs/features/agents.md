# Agents Module

## Overview

The Agents module showcases AI-powered workflows and intelligent tools that can be triggered and managed through the platform. It provides a centralized hub for agentic workflows with detailed descriptions, input/output specifications, and example use cases.

## 🎯 Features

### Core Functionality
- **Agent Showcase**: Detailed descriptions of AI agents and workflows
- **Status Management**: Active, Prototype, and Idea statuses
- **Category Organization**: Grouped by agent type and purpose
- **Input/Output Specifications**: Clear documentation of agent capabilities
- **Example Use Cases**: Practical applications and workflows
- **Trigger System**: Interface for activating agents (future)

### Advanced Features
- **Interactive Demos**: Live testing of agent capabilities (future)
- **Performance Analytics**: Agent usage and effectiveness metrics (future)
- **Custom Agent Creation**: User-defined agent workflows (future)
- **OpenAI Integration**: Direct API integration for agent execution (future)

## 🏗️ Architecture

### Data Structure

**Database Schema** (Supabase)
```sql
CREATE TABLE agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  status text CHECK (status IN ('active', 'prototype', 'idea')),
  category text NOT NULL,
  description text,
  inputs jsonb,
  tags text[],
  example_uses text[],
  trigger_type text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

**TypeScript Interface**
```typescript
interface Agent {
  id: string
  name: string
  slug: string
  status: 'active' | 'prototype' | 'idea'
  category: string
  description?: string
  inputs?: Record<string, any>
  tags: string[]
  example_uses: string[]
  trigger_type?: string
  created_at: string
  updated_at: string
}
```

### Component Structure

```
Agents Module
├── AgentGrid (Main container)
│   ├── AgentCard[] (Agent display)
│   │   ├── AgentHeader (Name, status, category)
│   │   ├── AgentDescription (Detailed description)
│   │   ├── AgentInputs (Input specifications)
│   │   ├── AgentExamples (Use cases)
│   │   └── AgentTrigger (Activation interface)
│   └── AgentFilters (Category and status filtering)
└── AgentDetail (Individual agent page)
    ├── AgentOverview (Complete description)
    ├── AgentSpecifications (Input/output details)
    ├── AgentExamples (Detailed use cases)
    └── AgentTesting (Interactive demo)
```

## 🔧 Implementation

### Data Fetching

**Primary Data Source** (Supabase)
```typescript
// src/lib/agents.ts
export async function getAgents(): Promise<Agent[]> {
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching agents:', error)
    return []
  }

  return data || []
}
```

**Category Filtering**
```typescript
// Filter agents by category
export async function getAgentsByCategory(category: string): Promise<Agent[]> {
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .eq('category', category)
    .order('name')

  if (error) {
    console.error('Error fetching agents by category:', error)
    return []
  }

  return data || []
}
```

### Agent Status Management

**Status Variants**
```typescript
// src/lib/utils.ts
export function getAgentStatusVariant(status: Agent['status']) {
  switch (status) {
    case 'active':
      return 'default'
    case 'prototype':
      return 'secondary'
    case 'idea':
      return 'outline'
    default:
      return 'default'
  }
}
```

## 🎨 UI Components

### AgentCard Component
```typescript
// src/components/AgentCard.tsx
interface AgentCardProps {
  agent: Agent
  showDetails?: boolean
}

export function AgentCard({ agent, showDetails = false }: AgentCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-bold">
              {agent.name}
            </CardTitle>
            <CardDescription className="text-sm text-gray-600">
              {agent.category}
            </CardDescription>
          </div>
          <Badge variant={getAgentStatusVariant(agent.status)}>
            {agent.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        {agent.description && (
          <p className="text-sm text-gray-700 mb-4">
            {agent.description}
          </p>
        )}
        
        {showDetails && agent.inputs && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-2">Inputs:</h4>
            <div className="text-xs text-gray-600">
              {Object.entries(agent.inputs).map(([key, value]) => (
                <div key={key} className="mb-1">
                  <strong>{key}:</strong> {typeof value === 'string' ? value : JSON.stringify(value)}
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex flex-wrap gap-1 mb-3">
          {agent.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        {agent.example_uses.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2">Example Uses:</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              {agent.example_uses.slice(0, 2).map((use, index) => (
                <li key={index} className="list-disc list-inside">
                  {use}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
```

### Agent Detail Page
```typescript
// src/app/agents/[slug]/page.tsx
interface AgentDetailPageProps {
  params: { slug: string }
}

export default async function AgentDetailPage({ params }: AgentDetailPageProps) {
  const agent = await getAgentBySlug(params.slug)
  
  if (!agent) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {agent.name}
            </h1>
            <p className="text-xl text-gray-600">{agent.category}</p>
          </div>
          <Badge variant={getAgentStatusVariant(agent.status)} className="text-lg">
            {agent.status}
          </Badge>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {agent.tags.map(tag => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
        
        {agent.description && (
          <p className="text-lg text-gray-700 leading-relaxed">
            {agent.description}
          </p>
        )}
      </header>
      
      <div className="grid gap-8">
        {agent.inputs && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Input Specifications</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              {Object.entries(agent.inputs).map(([key, value]) => (
                <div key={key} className="mb-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{key}</h3>
                  <p className="text-sm text-gray-600">
                    {typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {agent.example_uses.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Example Use Cases</h2>
            <ul className="space-y-3">
              {agent.example_uses.map((use, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">{use}</p>
                </li>
              ))}
            </ul>
          </section>
        )}
        
        {agent.trigger_type && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Trigger Interface</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-sm text-gray-600 mb-4">
                Trigger Type: <strong>{agent.trigger_type}</strong>
              </p>
              {/* Future: Interactive trigger interface */}
              <Button disabled>
                Trigger Agent (Coming Soon)
              </Button>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
```

## 📊 Performance Optimization

### Agent Management
- **Lazy Loading**: Load agent details on demand
- **Caching**: Cache agent specifications for faster access
- **Search Optimization**: Efficient agent discovery
- **Category Filtering**: Quick access to agent types

### Future Optimizations
- **Real-time Updates**: Live agent status updates
- **Performance Monitoring**: Track agent execution metrics
- **Resource Management**: Optimize agent resource usage
- **Scalability**: Support for large numbers of agents

## 🔗 API Endpoints

### Agents API
```typescript
// src/app/api/agents/route.ts
export async function GET() {
  try {
    const agents = await getAgents()
    return NextResponse.json(agents)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch agents' },
      { status: 500 }
    )
  }
}
```

### Individual Agent API
```typescript
// src/app/api/agents/[slug]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const agent = await getAgentBySlug(params.slug)
    
    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(agent)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch agent' },
      { status: 500 }
    )
  }
}
```

### Agent Trigger API (Future)
```typescript
// src/app/api/agents/[slug]/trigger/route.ts
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const agent = await getAgentBySlug(params.slug)
    const { inputs } = await request.json()
    
    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      )
    }
    
    // Future: Execute agent with OpenAI API
    const result = await executeAgent(agent, inputs)
    
    return NextResponse.json({ result })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to execute agent' },
      { status: 500 }
    )
  }
}
```

## 🧪 Testing

### Component Testing
```typescript
// Future testing structure
describe('AgentCard', () => {
  it('should render agent information correctly', () => {
    // Test agent display
  })
  
  it('should show status badge correctly', () => {
    // Test status display
  })
  
  it('should handle missing data gracefully', () => {
    // Test error states
  })
})
```

### Integration Testing
```typescript
// Agent execution testing (future)
describe('Agent Execution', () => {
  it('should execute agent with valid inputs', async () => {
    // Test agent execution
  })
  
  it('should handle execution errors gracefully', async () => {
    // Test error handling
  })
})
```

## 🚀 Future Enhancements

### Planned Features (v0.7)
- **Interactive Demos**: Live testing of agent capabilities
- **Custom Agent Creation**: User-defined agent workflows
- **Agent Performance Analytics**: Usage and effectiveness metrics
- **OpenAI API Integration**: Direct agent execution
- **Agent Marketplace**: Share and discover new agents

### Advanced Features
- **Multi-agent Workflows**: Chain multiple agents together
- **Agent Scheduling**: Automated agent execution
- **Agent Versioning**: Track agent improvements
- **Agent Collaboration**: Multi-user agent development
- **Agent Security**: Secure agent execution environment

## 📚 Usage Examples

### Creating a New Agent
```typescript
// Database insertion
const newAgent = {
  name: 'Content Summarizer',
  slug: 'content-summarizer',
  status: 'active',
  category: 'Content Processing',
  description: 'Summarizes long-form content into concise summaries',
  inputs: {
    content: 'string',
    max_length: 'number',
    style: 'string'
  },
  tags: ['ai', 'content', 'summarization'],
  example_uses: [
    'Summarize blog posts for social media',
    'Create executive summaries from reports',
    'Generate meeting notes from transcripts'
  ],
  trigger_type: 'api'
}

const { data, error } = await supabase
  .from('agents')
  .insert(newAgent)
```

### Filtering Agents
```typescript
// Filter by status
const activeAgents = agents.filter(agent => agent.status === 'active')

// Filter by category
const contentAgents = agents.filter(agent => 
  agent.category === 'Content Processing'
)

// Filter by tag
const aiAgents = agents.filter(agent => 
  agent.tags.includes('ai')
)
```

### Agent Execution (Future)
```typescript
// Execute agent with inputs
const result = await fetch(`/api/agents/${agent.slug}/trigger`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    inputs: {
      content: 'Long article content...',
      max_length: 200,
      style: 'concise'
    }
  })
})

const { result: agentOutput } = await result.json()
```

---

**Last Updated**: December 2024  
**Module Version**: v0.4e  
**Next Update**: v0.7 - Interactive Demos and OpenAI Integration 