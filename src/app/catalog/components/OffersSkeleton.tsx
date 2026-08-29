import { Skeleton } from "@/components/ui/skeleton";

export function OffersSkeleton() {
  return (
    <div
      className="flex flex-col gap-4"
      aria-label="Загрузка каталога"
      aria-busy="true"
    >
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-48 flex-1" />
        <Skeleton className="h-7 w-40" />
      </div>

      <div className="mt-6 flex flex-col gap-10">
        {Array.from({ length: 2 }).map((_, groupIndex) => (
          <div key={groupIndex} className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Skeleton className="size-10 rounded-lg" />
              <Skeleton className="h-6 w-40" />
              <Skeleton className="ml-auto h-6 w-24" />
            </div>
            <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, cardIndex) => (
                <Skeleton key={cardIndex} className="h-[382px] rounded-2xl" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
