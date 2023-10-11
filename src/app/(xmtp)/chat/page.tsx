"use client"
import React, { useCallback, useEffect, useState } from 'react'
import {
  Client,
  useStreamMessages,
  useClient,
  useMessages,
  useConversations,
  useCanMessage,
  useStartConversation,
  useStreamAllMessages,
  DecodedMessage,
  useStreamConversations,
  Conversation,
} from "@xmtp/react-sdk";

import { useWalletClient } from 'wagmi';
import { XMTPProvider } from "@xmtp/react-sdk";



// type InitClientArgs = {
//   keys?: Uint8Array;
//   options?: Partial<ClientOptions>;
//   signer?: Signer | null;
// };


const Chat =  () => {
  const { initialize } = useClient();
  // const { canMessage } = useCanMessage();
  const { data: walletclient } = useWalletClient();  //so called signer
  const signer  = walletclient
  // const { startConversation } = useStartConversation();
  const { conversations, } = useConversations();

  const [ xmtpClient, setXmtpClient] = useState<any>();
  const [ converse, setConverse] = useState<any>("");
  // const [isOnNetwork, setIsOnNetwork] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [streamedMessages, setStreamedMessages] = useState<DecodedMessage[]>(
    [],
    );
    const [streamedConversations, setStreamedConversations] = useState<
    Conversation[]
  >([]);

  const [history, setHistory] = useState();
  // useEffect(()=>{
    
    const initXmtp = async () => {
      const xmtpclient =  await initialize({ signer });
      
      setXmtpClient(xmtpclient)
    };
    //  initXmtp()
    // },[])
    
    
    async function check ( ){
      if(!xmtpClient)console.log("clinet not set");
      const add = "0x0a8A2f2ec93F8C513C83DDc6DC91d59DBe61364B";  //dynamic
      const canornot = await xmtpClient.canMessage(add)
      console.log("Can message this addr", canornot);
      if (!canornot)return
      const conversation = await xmtpClient.conversations.newConversation(add);
      const message = await conversation.send("gm againnnn");  //dynamic
      
      console.log({conversation , message});
      setConverse(conversation)
      for await (const message of await conversation.streamMessages()) {
          if (message.senderAddress === xmtpClient.address) {
              // This message was sent from me
              console.log(message);
              continue;
            }
            console.log(`New message from ${message.senderAddress}: ${message.content}`);
          }
          
         
        }

       

      
      
        // useStreamMessages(conversation);
        // const his  = await conversation.streamMessages()
        // setHistory(his)
        // const abc = useStreamAllMessages({xmtpClient}, converse)
        // console.log(abc);
        
        //   // callback to handle incoming messages
          // const onMessage = useCallback(
          //     (message: DecodedMessage) => {
                  
          //       // setStreamedMessages((prev) => [...prev, message]);
          //   },
          //   [streamedMessages],
          //   );
        
          // const onConversation = useCallback(
          //   (conversation: Conversation) => {
          //     setStreamedConversations((prev) => [...prev, conversation]);
          //   },
          //   [],
          // );
          //@ts-ignore
          // const { error } = useStreamConversations(onConversation);
        
          // if (error) {
          //   return "An error occurred while streaming conversations";
          // }
          // console.log(streamedConversations);
          async function seeMess(){
            const allConversations = await xmtpClient.conversations.list();
            console.log(allConversations);
            // const data = useMessages(converse);
            // console.log(data);
          //         const { messages } = useMessages(converse);
              // console.log({streamedMessages , conversations});
              for (const conversation of await xmtpClient.conversations.list()) {
                // All parameters are optional and can be omitted
                const opts = {
                  // Only show messages from last 24 hours
                  startTime: new Date(new Date().setDate(new Date().getDate() - 365)),
                  endTime: new Date(),
                };
                const messagesInConversation = await conversation.messages(opts);
                console.log(messagesInConversation);
                
              }
        }

  return (
    <XMTPProvider>
    <div className="flex min-h-screen flex-col items-center justify-center bg-white text-black p-24">
      <div  onClick={()=>initXmtp()}>{xmtpClient ? "connected to xmtp" : "Connect to XMTP"}</div>
      <button onClick={()=>check()}>check if can message or not</button>
      <button onClick={()=>seeMess()}>seemess</button>
     {/* <ListConversations/> */}

    </div>
    </XMTPProvider>
  )
}

export default Chat