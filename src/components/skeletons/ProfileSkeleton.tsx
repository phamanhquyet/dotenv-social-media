import { GridPostsSkeleton } from "@/components/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export const ProfileDetailSkeleton = () => {
  return (
    <>
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
        <div>
          <Skeleton className="w-12 h-12 rounded-full lg:w-24 lg:h-24 bg-zinc-600" />
        </div>

        <div className="flex justify-between flex-1 max-w-lg ">
          <div className="space-y-3">
            <Skeleton className="h-10 w-40 bg-zinc-600" />
            <Skeleton className="h-6 w-40 bg-zinc-600" />
          </div>

          <div>
            {/* Edit Profile Button */}
            <Skeleton className="h-10 w-40 bg-zinc-600" />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Skeleton className="h-8 w-2/3 bg-zinc-600" />
        <Skeleton className="h-8 w-2/3 bg-zinc-600" />
        <Skeleton className="h-8 w-1/2 bg-zinc-600" />
      </div>
    </>
  );
};

export const ProfilePostsSkeleton = () => {
  return <GridPostsSkeleton />;
};
