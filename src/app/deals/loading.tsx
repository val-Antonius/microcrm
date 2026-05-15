import { Skeleton } from "@/components/ui/skeleton"

export default function DealsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <Skeleton className="h-9 w-[150px] mb-2" />
          <Skeleton className="h-5 w-[300px]" />
        </div>
        <Skeleton className="h-10 w-[120px]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 pb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col min-h-[500px]">
            <div className="rounded-t-xl border border-b-0 px-4 py-3 bg-muted/30">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-[100px]" />
                <Skeleton className="h-6 w-6 rounded-md" />
              </div>
              <Skeleton className="h-4 w-[60px] mt-2" />
            </div>
            <div className="flex-1 rounded-b-xl border border-t-0 p-2 space-y-2 bg-muted/30">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="bg-white rounded-xl border p-3.5 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/3 mt-2" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
