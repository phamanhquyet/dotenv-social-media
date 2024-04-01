import UserCard from "@/components/shared/UserCard";
import { AllUsersSkeleton } from "@/components/skeletons";
import { useToast } from "@/components/ui/use-toast";
import { useGetUsers } from "@/lib/react-query/queriesAndMutations";

const AllUsers = () => {
  const { toast } = useToast();

  const { data: creators, isLoading, isError: isErrorCreators } = useGetUsers();

  if (isErrorCreators) {
    toast({ title: "Something went wrong." });

    return;
  }

  return (
    <div className="common-container">
      <div className="user-container">
        <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
        {isLoading && !creators ? (
          <AllUsersSkeleton />
        ) : (
          <ul className="user-grid">
            {creators?.documents.map((creators) => (
              <li key={creators?.$id} className="flex-1 min-w-[200px] w-full  ">
                <UserCard user={creators} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
