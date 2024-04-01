import { AppwriteException, Query } from "appwrite";
import { Spinner, Card, CardBody, Button } from "@nextui-org/react";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { communityStore } from "@/state/communityStore";
import { appwriteConfig, databases } from "@/lib/appwrite/config";
import { useToast } from "@/components/ui/use-toast";

const CommunitiesList = () => {
  const [loading, setLoading] = useState(false);
  const isDataFetched = useRef(false);
  const communityState = communityStore();
  const { toast } = useToast();
  useEffect(() => {
    if (!isDataFetched.current) {
      setLoading(true);
      databases
        .listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.communityCollectionId,
          [Query.select(["$id", "name"])]
        )
        .then((res) => {
          console.log("The response is", res.documents);
          setLoading(false);
          communityState.addCommunities(res.documents);
        })
        .catch((err: AppwriteException) => {
          toast({
            title: err.message,
          });
          setLoading(false);
        });

      isDataFetched.current = true;
    }
  }, []);

  return (
    <div>
      <div className="text-center">
        {" "}
        {loading && <Spinner color="danger" />}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {communityState.communities.length > 0 &&
          communityState.communities.map((item) => (
            <Card key={item.$id}>
              <CardBody>
                <h1 className="text-xl font-bold">{item["name"]}</h1>
                <p className="py-2">Found more people in this community</p>
                <Link to={`/chats/${item.$id}`}>
                  <Button color="danger" className="w-full">
                    Chat
                  </Button>
                </Link>
              </CardBody>
            </Card>
          ))}
      </div>

      {/* If no communuty found */}
      {communityState.communities.length <= 0 && loading == false && (
        <div className="text-center">
          <h1 className="text-danger-400 font-bold text-2xl">
            No Community Found
          </h1>
          <p>Be the first one to create unique community</p>
        </div>
      )}
    </div>
  );
};

export default CommunitiesList;
