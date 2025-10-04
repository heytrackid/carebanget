import { Skeleton } from '@/components/ui/skeleton';

export function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
      {/* Header Skeleton */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </div>

      {/* Child Selector Skeleton */}
      <div className="mb-6 sm:mb-8">
        <div className="pt-4 sm:pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Skeleton className="h-12 w-12 sm:h-16 sm:w-16 rounded-full mx-auto sm:mx-0" />
            <div className="flex-1 text-center sm:text-left">
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-24 mb-3" />
              <div className="flex gap-2 justify-center sm:justify-start">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-20" />
              </div>
            </div>
            <div className="text-center sm:text-right">
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="pt-4 sm:pt-6">
            <div className="flex items-center justify-between mb-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <Skeleton className="h-6 w-16 mb-2" />
            <Skeleton className="h-2 w-full" />
          </div>
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-6 sm:mb-8">
        {/* Chart Skeleton */}
        <div className="lg:col-span-2">
          <div className="pb-3 sm:pb-6">
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-64 w-full rounded-lg" />
          <div className="flex justify-center gap-6 mt-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </div>

        {/* Goals Skeleton */}
        <div>
          <div className="pb-3">
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <div className="flex justify-between mb-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Meal Schedule Skeleton */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-6 w-40" />
          </div>
          <Skeleton className="h-4 w-48 mb-4" />
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg border">
                <div className="text-center">
                  <Skeleton className="h-4 w-12 mb-1" />
                  <Skeleton className="h-3 w-8" />
                </div>
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-4 w-4" />
                  </div>
                </div>
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities Skeleton */}
        <div>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-48 mb-4" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
