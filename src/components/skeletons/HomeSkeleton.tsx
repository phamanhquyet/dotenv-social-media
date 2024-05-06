import { PostStatsSkeleton } from "@/components/skeletons/SharedSkeletons";
import { Skeleton } from "../ui/skeleton";

const HomeSkeleton = () => {
  return (
    <div className="flex flex-col flex-1 gap-9 w-full">
      {Array.from(Array(2).keys()).map((key) => (
        <div key={`home-feed-skeleton-key-${key}`} className="post-card">
          <div className="flex-between">
            <div className="flex items-center gap-3">
              <div>
                <Skeleton className="w-12 h-12 rounded-full object-cover bg-zinc-600" />
              </div>
              <div className="flex flex-col">
                <Skeleton className="h-5 w-20 mb-2 bg-zinc-600" />
                <div className="flex-center gap-2 text-light-3 ">
                  <Skeleton className="h-5 w-12 bg-zinc-600" />
                  <Skeleton className="h-5 w-12 bg-zinc-600" />
                </div>
              </div>
            </div>

            <div>
              <Skeleton className="w-6 h-6 bg-zinc-600" />
            </div>
          </div>

          <div>
            <Skeleton className="post-card_img mt-2 bg-zinc-600" />

            <div className="small-medium lg:base-medium py-5">
              <Skeleton className="mb-2 h-5 w-full bg-zinc-600" />
              <Skeleton className="mb-2 h-5 w-full bg-zinc-600" />
              <Skeleton className="mb-2 h-5 w-1/2 bg-zinc-600" />
              <ul className="flex gap-1 mt-2">
                {Array.from(Array(3).keys()).map((tag: number) => (
                  <Skeleton key={tag} className="h-5 w-10 bg-zinc-600" />
                ))}
              </ul>
            </div>
          </div>

          {/* Post Stats */}
          <PostStatsSkeleton />
        </div>
      ))}
    </div>
  );
};

export default HomeSkeleton;
