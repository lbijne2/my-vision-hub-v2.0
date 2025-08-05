import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function BlogPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-vision-charcoal mb-4">
            Blog
          </h1>
          <p className="text-xl text-vision-charcoal/70 max-w-3xl mx-auto">
            Reflective, opinionated, and analytical writing on AI, medicine, 
            design, ethics, and the future of human-technology collaboration.
          </p>
        </div>

        {/* Coming Soon Card */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-vision-charcoal">
              📝 Coming Soon
            </CardTitle>
            <CardDescription className="text-lg">
              The blog section is currently under development
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-vision-charcoal/70">
              This section will feature:
            </p>
            <ul className="text-left space-y-2 text-vision-charcoal/70">
              <li>• Public and private blog posts</li>
              <li>• Integration with Notion for drafting</li>
              <li>• Tag-based organization and filtering</li>
              <li>• Rich text editing and multimedia support</li>
              <li>• Comment system and social sharing</li>
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