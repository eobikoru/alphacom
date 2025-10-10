import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ProductCardSkeleton() {
  return (
    <Card className="group hover:shadow-2xl transition-all duration-500 border-0 backdrop-blur-sm">
      <CardContent className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <Skeleton className="w-full h-64" />
        </div>

        <div className="p-6">
          <div className="mb-2">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-6 w-full" />
          </div>

          <div className="flex items-center gap-2 mb-3">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
