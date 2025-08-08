'use client'

import { useState, useEffect } from 'react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AgentCard } from "@/components/AgentCard"
import { AgentCardSkeleton } from "@/components/ui/loading-skeletons"
import type { Agent } from "@/types"

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        // Try to fetch from API first
        const response = await fetch('/api/agents')
        const data = await response.json()
        
        if (data.success && data.agents.length > 0) {
          setAgents(data.agents)
        } else {
          setAgents([])
        }
      } catch (error) {
        console.error('Error fetching agents:', error)
        setAgents([])
      } finally {
        setLoading(false)
      }
    }

    fetchAgents()
  }, [])

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
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <AgentCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {agents.map((agent: Agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
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