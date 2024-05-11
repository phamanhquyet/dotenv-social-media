import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import FileUploader from "../shared/FileUploader";
import { PostValidation } from "@/lib/validation";
import {
  useCreatePost,
  useUpdatePost,
} from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
import { useToast } from "../ui/use-toast";
import { useNavigate } from "react-router-dom";
import { AppwriteException, ID, Models } from "appwrite";
import { appwriteConfig, databases } from "@/lib/appwrite/config";
import { communityStore } from "@/state/communityStore";
import axios from "axios";

type PostFormProps = {
  post?: Models.Document;
  action: "Create" | "Update";
};

const PostForm = ({ post, action }: PostFormProps) => {
  const { mutateAsync: createPost, isPending: isLoadingCreate } =
    useCreatePost();
  const { mutateAsync: updatePost, isPending: isLoadingUpdate } =
    useUpdatePost();
  const { user } = useUserContext();
  const { toast } = useToast();
  const navigate = useNavigate();
  const communityState = communityStore();

  // 1. Define your form.
  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      title: post ? post?.title : "",
      caption: post ? post?.caption : "",
      file: [],
      location: post ? post?.location : "",
      tags: post ? post?.tags.join(",") : "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof PostValidation>) {
    const response = await axios.post(
      "https://dotenv-api-lilac.vercel.app/api/check-caption",
      {
        caption: form.getValues().caption,
      }
    );

    // Check if the caption is valid
    if (!response.data.validCaption) {
      console.log(
        `Contains invalid words: ${response.data.invalidWords.join(", ")}`
      );
      return toast({
        title: "Invalid caption",
        description: `Contains invalid words: ${response.data.invalidWords
          //@ts-expect-error tam thoi bo qua loi nay
          .map((word) => word[1].join(", "))
          .join(", ")}`,
      });
    }

    if (post && action === "Update") {
      const updatedPost = await updatePost({
        ...values,
        postId: post.$id,
        imageId: post?.imageId,
        imageUrl: post?.imageUrl,
      });
      if (!updatedPost) {
        toast({ title: "please try again" });
      }
      return navigate(`/post/${post.$id}`);
    }
    const newPost = await createPost({
      ...values,
      userId: user.id,
    });

    if (!newPost) {
      toast({
        title: "Please try again",
      });
    }
    console.log(newPost);
    databases
      .createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.communityCollectionId,
        ID.unique(),
        {
          name: values.title,
          participants: [newPost?.creators.$id],
          post: newPost?.$id,
        }
      )
      .then((res) => {
        communityState.addCommunity(res);
        toast({
          title: "Community added successfully",
        });
      })
      .catch((err: AppwriteException) => {
        toast({
          title: err.message,
        });
      });

    navigate("/");
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-9 w-full max-w-5xl">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Title</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>

              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar"
                  {...field}
                />
              </FormControl>

              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={post?.imageUrl}
                />
              </FormControl>

              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>

              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                Add Tags (separated by comma " , ")
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="shad-input"
                  placeholder="donrac, thugomrac,... "
                  {...field}
                />
              </FormControl>

              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center justify-end">
          <Button type="button" className="shad-button_dark_4">
            Cancel
          </Button>
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap"
            disabled={isLoadingCreate || isLoadingUpdate}>
            {isLoadingCreate || (isLoadingUpdate && "Loading...")}
            {action} Post
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
