import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PreloadStatus } from "@/components/PreloadStatus"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

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

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="max-w-2xl">
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

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Preload Status */}
            <PreloadStatus showDetails={true} />
            
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-vision-charcoal">
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-vision-charcoal/60">Background Preloading:</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-vision-charcoal/60">Cache Status:</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    Optimized
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-vision-charcoal/60">Performance:</span>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                    Enhanced
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-vision-charcoal">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <Link href="/projects">
                    View Projects
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <Link href="/blog">
                    Read Blog
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <Link href="/timeline">
                    View Timeline
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 