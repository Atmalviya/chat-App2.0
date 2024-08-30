import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/store/";
import { apiClient } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import MultipleSelector from "@/components/ui/MultipleSelector";

const CreateChannel = () => {
  const [newChannelModal, setNewChannelModal] = useState(false);
  const { setSelectedChatType, setSelectedChatData, addChannel } =
    useAppStore();
  const [allContacts, setAllContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [channelName, setChannelName] = useState("");
  useEffect(() => {
    const getData = async () => {
      const res = await apiClient.get("/contacts/get-all-contacts");
      if (res.status === 200 && res.data.contacts) {
        setAllContacts(res.data.contacts);
      }
    };
    getData();
  }, []);

  const createChannel = async () => {
    try {
      console.log(selectedContacts);
      if (channelName.length > 0 && selectedContacts.length > 0) {
        const res = await apiClient.post("/channel/create-channel", {
          name: channelName,
          members: selectedContacts.map((contact) => contact.value),
        });
        if (res.status === 201) {
          setChannelName("");
          setSelectedContacts([]);
          setNewChannelModal(false);
          addChannel(res.data.channel);
        }
      }
    } catch (error) {
      return Promise.reject(error.response.data);
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 font-light text-opacity-90 text-sm hover:text-neutral-100 cursor-pointer transition-all duration-300"
              onClick={() => setNewChannelModal(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            <p>Creaete New Channel</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={newChannelModal} onOpenChange={setNewChannelModal}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Please select members for new channel</DialogTitle>
            <DialogDescription>Please select a contact</DialogDescription>
          </DialogHeader>
          <div className="">
            <Input
              placeholder="Channel Name"
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              onChange={(e) => setChannelName(e.target.value)}
              value={channelName}
            />
          </div>
          <div>
            <MultipleSelector
              className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white"
              defaultOptions={allContacts}
              placeholder="Select Contacts"
              value={selectedContacts}
              onChange={setSelectedContacts}
              emptyIndicator={
                <p className="text-center text-lg leading-10 text-gray-600">
                  No contacts found
                </p>
              }
            />
          </div>
          <div>
            <Button
              className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
              onClick={createChannel}
            >
              Create Channel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateChannel;
