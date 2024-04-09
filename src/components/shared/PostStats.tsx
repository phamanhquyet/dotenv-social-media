import {
  useDeleteSavedPost,
  useGetCurrentUser,
  useLikePost,
  useSavePost,
} from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked } from "@/lib/utils";
import { AppwriteException, Models, Query } from "appwrite";
import React, { useEffect, useState } from "react";
import Loader from "./Loader";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { appwriteConfig, databases } from "@/lib/appwrite/config";
import { useToast } from "../ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";

type PostStatsProps = {
  post?: Models.Document;
  userId: string;
};

const PostStats = ({ post, userId }: PostStatsProps) => {
  const likesList = post?.likes.map((user: Models.Document) => user.$id);

  const [likes, setLikes] = useState(likesList);
  const [isSaved, setIsSaved] = useState(false);

  const { mutate: likePost } = useLikePost();
  const { mutate: savePost, isPending: isSavingPost } = useSavePost();
  const { mutate: deleteSavedPost, isPending: isDeletingSaved } =
    useDeleteSavedPost();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useUserContext();
  const [isCreator, setIsCreator] = useState(user.id === post?.creators.$id);

  const { data: currentUser } = useGetCurrentUser();

  const savedPostRecord = currentUser?.save.find(
    (record: Models.Document) => record.post.$id === post?.$id
  );

  useEffect(() => {
    setIsSaved(!!savedPostRecord); //automatic boolean assignment
  }, [currentUser]);
  const handleLikePost = (e: React.MouseEvent) => {
    e.stopPropagation();
    let newLikes = [...likes];

    const hasLiked = newLikes.includes(userId);
    if (hasLiked) {
      newLikes = newLikes.filter((id) => id !== userId);
    } else {
      newLikes.push(userId);
    }

    setLikes(newLikes);
    likePost({ postId: post?.$id || "", likesArray: newLikes });
  };
  const handleSavePost = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (savedPostRecord) {
      setIsSaved(false);
      deleteSavedPost(savedPostRecord.$id);
    } else {
      savePost({ postId: post?.$id || "", userId });
      setIsSaved(true);
    }
  };

  const handleJoinEvent = async () => {
    // Xử lý khi người dùng xác nhận tham gia sự kiện ở đây

    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.communityCollectionId,
      post?.$id ? [Query.equal("post", post?.$id)] : []
    );
    const postDocument = posts.documents[0];
    const participants: string[] = postDocument.participants || [];
    const updatedParticipants = [...participants, userId];
    databases
      .updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.communityCollectionId,
        posts.documents[0].$id,
        {
          participants: updatedParticipants,
        }
      )
      .then((res) => {
        console.log("the response is ", res.documents);
        toast({
          title: "Joined successfully",
        });
      })
      .catch((err: AppwriteException) => {
        toast({
          title: err.message,
        });
      });
    navigate("/chats");
  };

  return (
    <div className="flex justify-between items-center z-20">
      <div className="flex gap-2 mr-5">
        <img
          src={
            checkIsLiked(likes, userId)
              ? "/assets/icons/liked.svg"
              : "/assets/icons/like.svg"
          }
          alt="like"
          width={20}
          height={20}
          onClick={handleLikePost}
          className="cursor-pointer"
        />

        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>
      <div className="flex gap-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              className="shad-button_primary whitespace-nowrap"
              disabled={isCreator}>
              {isCreator ? "Joined" : "Join the event"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to participate in this event?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Please ensure that you have carefully read the information of
                this event and agree to participate in this event.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="shad-button_primary whitespace-nowrap"
                onClick={handleJoinEvent}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        {isSavingPost || isDeletingSaved ? (
          <Loader />
        ) : (
          <img
            src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
            alt="save"
            width={20}
            height={20}
            onClick={handleSavePost}
            className="cursor-pointer"
          />
        )}
      </div>
    </div>
  );
};

export default PostStats;
