import { Skeleton } from "@/components/ui/skeleton"

export default function TimelineLoading() {
  return (
    <div className="min-h-screen pastel-cream">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Skeleton className="h-10 w-80 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        {/* Filter Controls */}
        <div className="flex justify-center mb-8">
          <div className="flex flex-wrap gap-2 bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-md">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-8 w-16" />
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-vision-border"></div>

          <div className="space-y-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="relative">
                {/* Timeline dot */}
                <div className="absolute left-6 top-6 w-4 h-4 rounded-full border-4 border-white shadow-md z-10">
                  <Skeleton className="w-full h-full rounded-full" />
                </div>

                {/* Content */}
                <div className="ml-16">
                  <div className="p-6 bg-white/90 backdrop-blur-sm border-vision-border shadow-md rounded-lg">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-8 h-8 rounded" />
                        <Skeleton className="h-6 w-20" />
                      </div>
                      <Skeleton className="h-4 w-24" />
                    </div>

                    <div className="space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 