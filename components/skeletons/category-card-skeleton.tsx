import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function CategoryCardSkeleton() {
  return (
    <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-card/80 backdrop-blur-xl">
      <CardContent className="p-6">
        {/* Category Header Skeleton */}
        <div className="flex items-center space-x-4 mb-6">
          <Skeleton className="w-16 h-16 rounded-2xl" />
          <div className="flex-1">
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>

        {/* Subcategories Skeleton */}
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between p-3">
              <Skeleton className="h-5 w-32" />
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
            </div>
          ))}
        </div>

        {/* View All Link Skeleton */}
        <div className="mt-6 pt-4 border-t border-border">
          <Skeleton className="h-6 w-40 mx-auto" />
        </div>
      </CardContent>
    </Card>
  )
}
