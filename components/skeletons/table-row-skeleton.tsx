import { Skeleton } from "@/components/ui/skeleton"

interface TableRowSkeletonProps {
  columns: number
}

export function TableRowSkeleton({ columns }: TableRowSkeletonProps) {
  return (
    <tr className="border-b">
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index} className="px-4 py-3">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  )
}
