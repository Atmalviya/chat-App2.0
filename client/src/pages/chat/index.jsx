import { useAppStore } from "@/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ContactsContainer from "./components/ContactsContainer/ContactsContainer";
import ChatContainer from "./components/chatContainer/ChatContainer";
import EmptyChatContainer from "./components/EmptyChatContainer/EmptyChatContainer";

const Chat = () => {
  const {userInfo, selectedChatType} = useAppStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast.error("Please setup your profile first");
      navigate("/profile");
    }
  }, [userInfo, navigate]);
  return (
    <div className="flex h-[100vh] text-white overflow-hidden">
      <ContactsContainer />
      {
        selectedChatType === undefined ? <EmptyChatContainer /> : <ChatContainer />
      }

      
    </div>
  )
}

export default Chat
