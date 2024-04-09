import { AppwriteException, Query } from "appwrite";
import { Spinner } from "@nextui-org/react";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { communityStore } from "@/state/communityStore";
import { appwriteConfig, databases } from "@/lib/appwrite/config";
import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";

const CommunitiesList = () => {
  const [loading, setLoading] = useState(false);
  const isDataFetched = useRef(false);
  const communityState = communityStore();
  const { toast } = useToast();
  const { user } = useUserContext();
  useEffect(() => {
    if (!isDataFetched.current) {
      setLoading(true);
      databases
        .listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.communityCollectionId,
          [Query.select(["$id", "name", "participants"])]
        )
        .then((res) => {
          console.log("The response is", res.documents);
          console.log(user.id);
          setLoading(false);
          const filteredDocuments = res.documents.filter((doc) =>
            doc.participants.includes(user.id)
          );
          console.log(filteredDocuments);
          communityState.addCommunities(filteredDocuments);
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
      <div className="flex flex-col">
        {communityState.communities.length > 0 &&
          communityState.communities.map((item) => (
            <Card key={item.$id} className="w-2/4 mt-10">
              <CardHeader>
                <CardTitle>{item["name"]}</CardTitle>
                <CardDescription>
                  Found more people in this community
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between">
                <Link to={`/chats/${item.$id}`}>
                  <Button className="shad-button_primary whitespace-nowrap">
                    Chat
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
      </div>

      {/* If no communuty found */}
      {communityState.communities.length <= 0 && loading == false && (
        <div className="text-center">
          <h1 className="text-danger-400 font-bold text-2xl">
            No Community Found
          </h1>
          <p>Please join the event to connect together.</p>
        </div>
      )}
    </div>
  );
};

export default CommunitiesList;
