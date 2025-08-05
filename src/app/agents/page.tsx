import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function AgentsPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-vision-charcoal mb-4">
            Agents
          </h1>
          <p className="text-xl text-vision-charcoal/70 max-w-3xl mx-auto">
            Intelligent workflows and AI-powered tools designed to enhance 
            your creative and analytical processes.
          </p>
        </div>

        {/* Coming Soon Card */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-vision-charcoal">
              🤖 Coming Soon
            </CardTitle>
            <CardDescription className="text-lg">
              The agents module is currently under development
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-vision-charcoal/70">
              This section will feature:
            </p>
            <ul className="text-left space-y-2 text-vision-charcoal/70">
              <li>• Centralized list of intelligent agents</li>
              <li>• Interactive trigger interfaces</li>
              <li>• OpenAI API integration</li>
              <li>• Metadata and documentation for each agent</li>
              <li>• Workflow automation and orchestration</li>
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
  )
} 