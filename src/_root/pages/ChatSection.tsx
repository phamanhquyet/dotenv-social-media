import { Input } from "@/components/ui/input";
import React, { useState, useEffect, useRef } from "react";
import { AppwriteException, ID, Models, Query } from "appwrite";
import { appwriteConfig, client, databases } from "@/lib/appwrite/config";
import { chatStore } from "@/state/chatsStore";
import { userStore } from "@/state/userStore";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";

const ChatSection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  const [message, setMessage] = useState("");
  const user = userStore(
    (state) => state.user
  ) as Models.User<Models.Preferences>;
  const [loading, setLoading] = useState(false);
  const isFetched = useRef(false);
  const chatState = chatStore();
  const [communityName, setCommunityName] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (id) {
      databases
        .getDocument(
          appwriteConfig.databaseId,
          appwriteConfig.communityCollectionId,
          id
        )
        .then((res) => {
          setCommunityName(res.name);
        })
        .catch((err: AppwriteException) => {
          toast({
            title: err.message,
          });
        });
    }
    console.log(communityName);
  }, [id]);

  useEffect(() => {
    if (!isFetched.current) {
      fetchMessage();

      //   * For Realtime Things
      client.subscribe(
        `databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.chatCollectionId}.documents`,
        (response) => {
          console.log("The realtime response is ", response);
          const payload = response.payload as Models.Document;

          //   * If It's new message
          if (
            response.events.includes(
              "databases.*.collections.*.documents.*.create"
            )
          ) {
            if (user.$id !== payload["user_id"]) {
              chatState.addChat(payload);
            }
          } else if (
            response.events.includes(
              "databases.*.collections.*.documents.*.delete"
            )
          ) {
            chatState.deleteChat(payload.$id);
          }
        }
      );

      isFetched.current = true;
    }
  }, []);
  useEffect(() => {
    // Scroll to the bottom of the chat messages
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatState.chats]);

  // * To handle submit
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    databases
      .createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.chatCollectionId,
        ID.unique(),
        {
          message: message,
          user_id: user.$id,
          community_id: id,
          name: user.name,
        }
      )
      .then((res) => {
        chatState.addChat(res);
        setMessage("");
      })
      .catch((err: AppwriteException) => {
        toast({
          title: err.message,
        });
      });
  };
  //   * Fetch all messages
  // const fetchMessage = () => {
  //   setLoading(true);
  //   databases
  //     .listDocuments(appwriteConfig.databaseId, appwriteConfig.chatCollectionId)
  //     .then((res) => {
  //       setLoading(false);
  //       chatState.addChats(res.documents);
  //     })
  //     .catch((err: AppwriteException) => {
  //       setLoading(false);
  //       toast({
  //         title: err.message,
  //       });
  //     });
  // };
  const fetchMessage = () => {
    console.log(typeof id);
    setLoading(true);
    databases
      .listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.chatCollectionId,
        id ? [Query.equal("community_id", id)] : []
      )
      .then((res) => {
        setLoading(false);
        chatState.addChats(res.documents);
      })
      .catch((err: AppwriteException) => {
        setLoading(false);
        toast({
          title: err.message,
        });
      });
  };

  //   * Delete message
  const deleteMessage = (id: string) => {
    databases
      .deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.chatCollectionId,
        id
      )
      .then(() => {
        chatState.deleteChat(id);
      })
      .catch((err: AppwriteException) => {
        toast({
          title: err.message,
        });
      });
  };
  return (
    <div className="w-full overflow-hidden">
      <div className="h-full w-full">
        <div className="text-center"> {loading && <Loader />}</div>
        <div className="flex flex-col w-full h-full">
          {/* Display community name */}
          <div className="flex flex-row p-4 text-center text-xl font-semibold">
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
            <div className="pl-4">
              <p className="text-2xl">{communityName}</p>
            </div>
          </div>
          {/* Chat Messages */}
          <div className="flex-1 p-4 mb-20 overflow-y-auto custom-scrollbar">
            {chatState.chats.length > 0 ? (
              chatState.chats.map((item) => (
                <div
                  className={`flex mb-2 ${
                    item["user_id"] === user.$id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                  key={item.$id}>
                  <div
                    className={`${
                      item["user_id"] === user.$id
                        ? "bg-gray-800 ml-auto"
                        : "bg-gray-600 mr-auto"
                    } px-4 py-2 max-w-lg rounded-xl flex items-center relative`}>
                    <div className="flex-1">
                      <h1 className="font-bold">{item["name"]}</h1>
                      <div className="break-all">{item["message"]}</div>
                    </div>
                    {item["user_id"] === user.$id && (
                      <div className="ml-2 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-trash-2 text-red-500 cursor-pointer"
                          onClick={() => deleteMessage(item.$id)}>
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                          <line x1="10" x2="10" y1="11" y2="17" />
                          <line x1="14" x2="14" y1="11" y2="17" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500">
                Let's say hello to everyone here!
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          {/* Input Box */}
          <div className=" fixed bottom-0  w-3/4">
            <form onSubmit={handleSubmit} className="flex justify-center">
              <div className="flex items-center space-x-2 w-3/4 mb-3">
                <Input
                  type="text"
                  placeholder="Type message..."
                  onChange={(e) => setMessage(e.target.value)}
                  value={message}
                  className="shad-input w-full"></Input>
                <button
                  type="submit"
                  className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded">
                  <img
                    src="/assets/icons/send-message.svg"
                    alt="Send"
                    className="h-6 w-6 invert-white"
                  />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSection;
