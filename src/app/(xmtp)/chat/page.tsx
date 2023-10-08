"use client"
import React from 'react'
import {
  Client,
  useStreamMessages,
  useClient,
  useMessages,
  useConversations,
  useCanMessage,
  useStartConversation,
} from "@xmtp/react-sdk";


const Chat = () => {
  const { client, initialize } = useClient();
  const { conversations } = useConversations();
  const { startConversation } = useStartConversation();
  const { canMessage } = useCanMessage();
  
  const initXmtp = async () => {
    // const options = {
      //   persistConversations: false,
      //   env: "dev",
      // };
      // //@ts-ignore
      // await initialize({ keys, options, signer });
      const add = "0x3F11b27F323b62B159D2642964fa27C46C841897";
      if (await canMessage(add)) {
       console.log("this addres can work" + add);
      }
  };

  return (
    <div>
      <button onClick={()=>initXmtp()}>Connect to XMTP</button>
    </div>
  )
}

export default Chat