/* eslint-disable */
import CommunitiesList from "@/components/shared/CommunitiesList";
import { useToast } from "@/components/ui/use-toast";
import { account } from "@/lib/appwrite/config";
import { userStore } from "@/state/userStore";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const ChatHome = () => {
  const isRendered = useRef<boolean>(false);
  const userState = userStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  useEffect(() => {
    if (!isRendered.current) {
      account
        .get()
        .then((res) => {
          userState.updateUser(res);
        })
        .catch(() => {
          userState.resetState();
          navigate("/sign-in");
          toast({ title: "Your session got expired.please login again" });
        });
      isRendered.current = true;
    }
  }, []);
  return (
    <>
      <div className="p-10 w-full h-full">
        <CommunitiesList />
      </div>
    </>
  );
};

export default ChatHome;
