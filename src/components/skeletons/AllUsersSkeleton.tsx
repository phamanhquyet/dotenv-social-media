import { Skeleton } from "@/components/ui/skeleton";

const AllUsersSkeleton = () => {
  return (
    <div className="grid-container">
      {Array.from(Array(9).keys()).map((key) => (
        <div key={`user-skeleton-key-${key}`} className="user-card ">
          <Skeleton className="h-20 w-20 rounded-full bg-zinc-600" />
          <Skeleton className="h-8 w-40 bg-zinc-600" />
          <Skeleton className="h-6 w-40 bg-zinc-600" />
        </div>
      ))}
    </div>
  );
};

export default AllUsersSkeleton;
