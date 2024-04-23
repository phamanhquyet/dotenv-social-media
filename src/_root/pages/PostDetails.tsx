import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import PostStats from "@/components/shared/PostStats";
import { PostDetailsSkeleton } from "@/components/skeletons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserContext } from "@/context/AuthContext";
import {
  useDeletePost,
  useGetPostById,
  useGetUserPosts,
} from "@/lib/react-query/queriesAndMutations";
import { multiFormatDateString } from "@/lib/utils";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const PostDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: post, isPending } = useGetPostById(id || "");
  const { data: userPosts, isPending: isUserPostLoading } = useGetUserPosts(
    post?.creators.$id
  );
  const { user } = useUserContext();
  const { mutate: deletePost } = useDeletePost();
  const [expanded, setExpanded] = useState(false);

  const relatedPosts = userPosts?.documents.filter(
    (userPost) => userPost.$id !== id
  );

  const renderCaption = () => {
    if (!post?.caption) return null;

    const maxLength = 51;
    const shouldExpand = post.caption.length > maxLength;

    return (
      <div>
        {shouldExpand ? (
          <>
            {expanded ? (
              <p>{post.caption}</p>
            ) : (
              <p>{post.caption.slice(0, maxLength)}...</p>
            )}
            <Button
              onClick={() => setExpanded(!expanded)}
              className="hover:shad-button_primary my-3">
              {expanded ? "Show less" : "Show more"}
            </Button>
          </>
        ) : (
          <p>{post.caption}</p>
        )}
      </div>
    );
  };

  const handleDeletePost = () => {
    deletePost({ postId: id, imageId: post?.imageId });
    navigate(-1);
  };
  return (
    <div className="post_details-container">
      <div className="hidden md:flex max-w-5xl w-full">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="shad-button_ghost">
          <img
            src={"/assets/icons/back.svg"}
            alt="back"
            width={24}
            height={24}
          />
          <p className="small-medium lg:base-medium">Back</p>
        </Button>
      </div>
      {isPending ? (
        <PostDetailsSkeleton />
      ) : (
        <div className="post_details-card">
          <img
            src={post?.imageUrl}
            alt="creator"
            className="post_details-img"
          />
          <div className="post_details-info">
            <div className="flex-between w-full">
              <Link
                to={`/profile/${post?.creators.$id}`}
                className="flex items-center gap-3">
                <img
                  src={
                    post?.creators?.imageUrl ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt="creator"
                  className="rounded-full w-8 h-8 lg:w-12 lg:h-12"
                />

                <div className="flex flex-col">
                  <p className="base-medium lg:body-bold text-light-1">
                    {post?.creators.name}
                  </p>
                  <div className="flex-center gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular">
                      {multiFormatDateString(post?.$createdAt)}
                    </p>
                    -
                    <p className="subtle-semibold lg:small-regular">
                      {post?.location}
                    </p>
                  </div>
                </div>
              </Link>

              <div className="flex-center gap-4">
                <Link
                  to={`/update-post/${post?.$id}`}
                  className={`${user.id !== post?.creators.$id && "hidden"}`}>
                  <img
                    src="/assets/icons/edit.svg"
                    alt="edit"
                    width={24}
                    height={24}
                  />
                </Link>
                <Button
                  onClick={handleDeletePost}
                  variant="ghost"
                  className={`ghost_details-delete_btn ${
                    user.id !== post?.creators.$id && "hidden"
                  }`}>
                  <img
                    src="/assets/icons/delete.svg"
                    alt="delete"
                    width={24}
                    height={24}
                  />
                </Button>
              </div>
            </div>
            <hr className="border w-full border-dark-4/80" />
            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular border-b border-dark-4/80">
              <p className="font-extrabold leading-10">{post?.title}</p>
              {renderCaption()}
              <ul className="flex gap-1 mt-2">
                {post?.tags.map((tag: string, index: string) => (
                  <li
                    key={`${tag}${index}`}
                    className="text-light-3 small-regular">
                    #{tag}
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-full">
              <PostStats post={post} userId={user.id} />
            </div>
            <div className="w-full flex flex-row gap-2">
              <Link
                to={`/profile/${user.id}`}
                className="flex gap-3 items-center h-full w-12">
                <img
                  src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
                  alt="profile"
                  className=" rounded-full"
                />
              </Link>
              <Input
                type="text"
                placeholder="Write your comment..."
                // onChange={(e) => setMessage(e.target.value)}
                // value={message}
                className="shad-input w-full"></Input>
              <button type="submit">
                <img
                  src="/assets/icons/send-message.svg"
                  alt="Send"
                  className="h-5 w-5 invert-white"
                />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-5xl">
        <hr className="border w-full border-dark-4/80" />

        <h3 className="body-bold md:h3-bold w-full my-10">
          More Related Posts
        </h3>
        {isUserPostLoading || !relatedPosts ? (
          <Loader />
        ) : (
          <GridPostList posts={relatedPosts} />
        )}
      </div>
    </div>
  );
};

export default PostDetails;
