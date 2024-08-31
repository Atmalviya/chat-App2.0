import { Input } from "@/components/ui/input";
import { GrAttachment } from "react-icons/gr";
import { useEffect, useRef, useState } from "react";
import { RiEmojiStickerLine } from "react-icons/ri";
import { IoSend } from "react-icons/io5";
import EmojiPicker from "emoji-picker-react";
import { useAppStore } from "@/store";
import { useSocket } from "@/context/SocketContext";
import { HOST } from "@/utils/constant";
import { apiClient } from "@/lib/apiClient";

const MessageBar = () => {
  const emojiRef = useRef();
  const fileInputRef = useRef();
  const [message, setMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const { selectedChatType, selectedChatData, userInfo, setIsUploading, setIsDownloding, setFileUploadingProgess  } = useAppStore();
  const Socket = useSocket();

  useEffect(() => {
    function clickedOutside(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", clickedOutside);

    return () => {
      document.removeEventListener("mousedown", clickedOutside);
    };
  }, [emojiRef]);

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  const handleSendMessage = async () => {
    if(message.length>0){
      if (selectedChatType === "contact") {
      Socket.emit("sendMessage", {
        sender: userInfo._id,
        recipient: selectedChatData._id,
        content: message,
        messageType: "text",
        fileUrl: null,
      });
    }
    else if(selectedChatType === "channel"){
      Socket.emit("sendChannelMessage", {
        sender: userInfo._id,
        content: message,
        messageType: "text",
        fileUrl: null,
        channelId: selectedChatData._id
      })
    }
    setMessage("");}
  };

  const handleAddAttchement = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleChangeAddAttchement = async (e) => {    
    try {
      const file = e.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        setIsUploading(true);
        const res = await apiClient.post("/messages/uploadFile", formData, {
          onUploadProgress:data=> {
            setFileUploadingProgess(Math.round((100 * data.loaded) / data.total));
          }
        });
       
        if (res.status === 200 && res.data) {
          setIsUploading(false);
          if (selectedChatType === "contact") {
            Socket.emit("sendMessage", {
              sender: userInfo._id,
              recipient: selectedChatData._id,
              content: undefined,
              messageType: "file",
              fileUrl: res.data.filePath,
            });
          } else if(selectedChatType === "channel"){
            Socket.emit("sendChannelMessage", {
              sender: userInfo._id,
              content: undefined,
              messageType: "file",
              fileUrl: res.data.filePath,
              channelId: selectedChatData._id
            })
          }
        }
      }
    } catch (error) {
      setIsUploading(false);
      console.error(error);
    }
  };
  return (
    <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-5 gap-6">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
        <Input
          className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
          type="text"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all">
          <GrAttachment className="text-2xl" onClick={handleAddAttchement} />
        </button>
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleChangeAddAttchement}
          accept=".png, .jpg, .jpeg, .svg, .webp"
        />
        <div className="relative">
          <button
            onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
          >
            <RiEmojiStickerLine className="text-2xl" />
          </button>
          <div className="absolute bottom-16 right-0" ref={emojiRef}>
            <EmojiPicker
              theme="dark"
              open={emojiPickerOpen}
              onEmojiClick={handleAddEmoji}
              autoFocusSearch={false}
            />
          </div>
        </div>
      </div>
      <button
        onClick={handleSendMessage}
        className={`bg-[#8417ff] rounded-md flex items-center justify-center p-5 hover:bg-[#741bda] focus:bg-[#741bda] focus:border-none focus:outline-none focus:text-white duration-300 transition-all`}
      >
        <IoSend className="text-2xl" />
      </button>
    </div>
  );
};

export default MessageBar;
