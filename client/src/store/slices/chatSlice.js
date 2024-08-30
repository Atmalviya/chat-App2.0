
export const createChatSlice = (set, get) => ({
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessages: [],
  directMessagesContacts: [],
  isUploading : false,
  isDownloding : false,
  fileUploadingProgess : 0,
  fileDownloadingProgess : 0,
  channels:[],
  setChannels : (channels) => set({channels}),
  addChannel : (channel) => {const channels = get().channels; set({channels:[...channels, channel]})},
  setIsUploading : (isUploading) => set({isUploading}),
  setIsDownloding : (isDownloding) => set({isDownloding}),
  setFileUploadingProgess : (fileUploadingProgess) => set({fileUploadingProgess}),
  setFileDownloadingProgess : (fileDownloadingProgess) => set({fileDownloadingProgess}),
  setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
  setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
  setSelectedChatMessages: (selectedChatMessages) => set({ selectedChatMessages }),
  setDirectMessagesContacts: (directMessagesContacts) => set({ directMessagesContacts }),
  closeChat: () => {
    set({
      selectedChatType: undefined,
      selectedChatData: undefined,
      selectedChatMessages: [],
    });
  },
  addMessage: (message) => {
    const selectedChatMessages = get().selectedChatMessages;
    const selectedChatType = get().selectedChatType;

    set({
      selectedChatMessages: [
        ...selectedChatMessages,
        {
          ...message,
          recipient:
            selectedChatType === "channel"
              ? message.recipient
              : message.recipient._id,
          sender:
            selectedChatType === "channel"
              ? message.sender
              : message.sender._id,
        },
      ],
    });
  },
  addChannelInChannelList:(message)=>{
    const channels = get().channels
    const data = channels.find(channel=> channel._id === message.channelId)
    const index = channels.findIndex((channel)=> channel._id === message.channelId);
    if(index !== -1 && index !== undefined){
      channels.splice(index, 1)
      channels.unshift(data)
    }
  }, 

  addContactsinDmContact:(message)=> {
    console.log("from addContactsinDmContact", message)
    const userId = get().userInfo._id
    const fromId = message.sender._id === userId ? message.recipient._id : message.sender._id;
    const fromData = message.sender._id === userId ? message.recipient : message.sender
    const dmContacts = get().directMessagesContacts;
    const data = dmContacts.find((contact)=> contact._id === fromId)
    const index = dmContacts.findIndex((contact)=> contact._id === fromId);
    console.log({data, index, dmContacts, userId, message, fromData})
    if(index !== -1 && index !== undefined){
      dmContacts.splice(index, 1)
      dmContacts.unshift(data)
    }else {
      dmContacts.unshift(fromData)
    }set({ directMessagesContacts: dmContacts })
  }
});
