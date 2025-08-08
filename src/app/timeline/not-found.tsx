import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function TimelineNotFound() {
  return (
    <div className="min-h-screen pastel-cream flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">📅</div>
        <h1 className="text-2xl font-bold text-vision-charcoal mb-4">
          Timeline Not Found
        </h1>
        <p className="text-vision-charcoal/70 mb-8 max-w-md">
          The timeline you're looking for doesn't exist. Please check the URL or return to the main timeline.
        </p>
        <Button asChild>
          <Link href="/timeline">
            Back to Timeline
          </Link>
        </Button>
      </div>
    </div>
  )
} 