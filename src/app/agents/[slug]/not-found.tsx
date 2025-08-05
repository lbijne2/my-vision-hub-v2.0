import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AgentNotFound() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-vision-charcoal">
              🤖 Agent Not Found
            </CardTitle>
            <CardDescription className="text-lg">
              The agent you're looking for doesn't exist
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-vision-charcoal/70">
              The agent you're trying to access may have been removed, renamed, or is still under development.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="vision" asChild>
                <Link href="/agents">
                  Browse All Agents
                </Link>
              </Button>
              <Button variant="outline" asChild>
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