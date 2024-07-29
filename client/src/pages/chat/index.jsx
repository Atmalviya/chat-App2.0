import { useAppStore } from "@/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Chat = () => {
  const {userInfo} = useAppStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast.error("Please setup your profile first");
      navigate("/profile");
    }
  }, [userInfo, navigate]);
  return (
    <div>
      Email : {userInfo.email}
    </div>
  )
}

export default Chat
