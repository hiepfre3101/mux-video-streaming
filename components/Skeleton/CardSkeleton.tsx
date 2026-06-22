export function VideoCardSkeleton() {
  return (
    <div className="w-full animate-pulse">
      <div className="relative aspect-video overflow-hidden rounded-xl bg-neutral-800" />
      <div className="mt-2 space-y-1.5">
        <div className="h-3.5 w-3/4 rounded bg-neutral-800" />
        <div className="h-3.5 w-1/2 rounded bg-neutral-800" />
      </div>
    </div>
  );
}

interface VideoGridSkeletonProps {
  count?: number;
}

export function VideoGridSkeleton({ count = 8 }: VideoGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <VideoCardSkeleton key={i} />
      ))}
    </div>
  );
}
