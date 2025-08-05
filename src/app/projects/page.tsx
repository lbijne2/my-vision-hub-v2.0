import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function ProjectsPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-vision-charcoal mb-4">
            Projects
          </h1>
          <p className="text-xl text-vision-charcoal/70 max-w-3xl mx-auto">
            A collection of ongoing and completed projects exploring the intersection 
            of technology, medicine, design, and human potential.
          </p>
        </div>

        {/* Coming Soon Card */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-vision-charcoal">
              🚧 Coming Soon
            </CardTitle>
            <CardDescription className="text-lg">
              The projects section is currently under development
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-vision-charcoal/70">
              This section will showcase detailed project pages with:
            </p>
            <ul className="text-left space-y-2 text-vision-charcoal/70">
              <li>• Individual project narratives and progress updates</li>
              <li>• Embedded tools and interactive elements</li>
              <li>• Integration with GitHub for code previews</li>
              <li>• Notion integration for project documentation</li>
              <li>• Visual progress tracking and milestones</li>
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