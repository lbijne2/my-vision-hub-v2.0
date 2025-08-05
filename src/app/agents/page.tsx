import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllAgents } from "@/lib/agents"
import { AgentCard } from "@/components/AgentCard"
import type { Agent } from "@/types"

export default async function AgentsPage() {
  const agents = await getAllAgents()

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-vision-charcoal mb-4">
            Agentic Workflows
          </h1>
          <p className="text-xl text-vision-charcoal/70 max-w-3xl mx-auto">
            Intelligent tools and automated workflows that enhance productivity, 
            creativity, and decision-making across various domains.
          </p>
        </div>

        {/* Agents Grid */}
        {agents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {agents.map((agent: Agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        ) : (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-vision-charcoal">
                🚧 No Agents Available
              </CardTitle>
              <CardDescription className="text-lg">
                No agents are currently available
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-vision-charcoal/70">
                Check back soon for new AI agents and automated workflows.
              </p>
              <div className="pt-4">
                <Button variant="vision" asChild>
                  <Link href="/">
                    Back to Home
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Coming Soon Notice */}
        <div className="mt-16">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-vision-charcoal">
                🚧 More Agents Coming Soon
              </CardTitle>
              <CardDescription className="text-lg">
                Additional AI agents and workflows are under development
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-vision-charcoal/70">
                Future enhancements will include:
              </p>
              <ul className="text-left space-y-2 text-vision-charcoal/70">
                <li>• Interactive agent demos and testing</li>
                <li>• Custom agent creation and training</li>
                <li>• Agent performance analytics and metrics</li>
                <li>• Integration with external APIs and services</li>
                <li>• Collaborative agent development workflows</li>
              </ul>
              <div className="pt-4">
                <Button variant="vision" asChild>
                  <Link href="/">
                    Back to Home
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 