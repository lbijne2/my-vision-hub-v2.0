import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-vision-charcoal mb-4">
            Dashboard
          </h1>
          <p className="text-xl text-vision-charcoal/70 max-w-3xl mx-auto">
            Private workspace for personal tools, quick access, and 
            integrated workflow management.
          </p>
        </div>

        {/* Coming Soon Card */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-vision-charcoal">
              🔒 Coming Soon
            </CardTitle>
            <CardDescription className="text-lg">
              The private dashboard is currently under development
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-vision-charcoal/70">
              This section will include:
            </p>
            <ul className="text-left space-y-2 text-vision-charcoal/70">
              <li>• Quick launch panel for agents and tools</li>
              <li>• Recent blog drafts and notes feed</li>
              <li>• Notion integration for resources and trackers</li>
              <li>• Workspace overview with search functionality</li>
              <li>• Private-only access with authentication</li>
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