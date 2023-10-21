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
import useDebounce from '@/app/mail/useDebounce';
import Link from "next/link";
import { useSearchParams } from "next/navigation";
 
import { ToastContainer, toast, Flip } from 'react-toastify';

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
  const [inputValue, setInputValue] = useState<string>('');
  const [ xmtpClient, setXmtpClient] = useState<any>();
  const [ converse, setConverse] = useState<any>("");
  // const [isOnNetwork, setIsOnNetwork] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [canMess, setCanMess] = useState<boolean>(false);
  const [streamedMessages, setStreamedMessages] = useState<DecodedMessage[]>(
    [],
    );
    const [streamedConversations, setStreamedConversations] = useState<
    Conversation[]
  >([]);
  
  const searchParams = useSearchParams();
  const chatTo = searchParams.get("to");
  const [history, setHistory] = useState();
  const [chatUser, setChatUser] = useState<any>();
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


        //

        const [selectedContact, setSelectedContact] = useState(chatTo || null);
        const [messages, setMessages] = useState([]);
        const [inputMessage, setInputMessage] = useState('');
      
        const handleContactClick = (contact : any) => {
          setSelectedContact(contact);
        };
      
        const handleSendMessage = async () => {
          if(!xmtpClient){
            initXmtp()
            toast("Try sending nessage again")
            return
          }
          if (inputMessage.trim() !== '') {
            const newMessage = {
              sender: 'You',
              content: inputMessage.trim(),
            };
            console.log(newMessage.content);
            const conversation = await xmtpClient.conversations.newConversation(selectedContact);
            const message = await conversation.send(newMessage.content); 
            // setMessages([...messages, newMessage]);
            toast.success("Message sent successfully!!")
            setInputMessage('');
          }
        };


        const debouncedValue = useDebounce(inputValue, 2000);
  
  async function getCheckData(){
    if (!debouncedValue)return
    try{
      console.log("the deb",debouncedValue);
      if(!xmtpClient){
        initXmtp()
        return
      }
      const add = debouncedValue;  
      const canornot = await xmtpClient.canMessage(add)
      console.log("Can message this addr", canornot);
      setCanMess(canornot)
    }catch(err){
      console.log(err)
      
    
    }
  }

  async function getConverseList(){
  try{
    if(!xmtpClient){
      initXmtp()
      
      return
    }
    // const conversation = await xmtpClient.conversations.newConversation(selectedContact);
    const allConversations = await xmtpClient.conversations.list();
    // console.log(`${allConversations[0].client.knownPublicKeyBundles.valueOf()}`);
    setChatUser(allConversations);
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
  }catch(err){console.log(err)}
  }

  useEffect( () => {
    getCheckData()
  getConverseList()
      
  }, [debouncedValue , inputValue , xmtpClient]);
  return (
    <XMTPProvider>
     {/* <div className="flex min-h-screen flex-col items-center justify-center bg-[#240046] text-white ">
      <div  onClick={()=>getConverseList()}>{xmtpClient ? "connected to xmtp" : "Connect to XMTP"}</div>
      <button onClick={()=>check()}>check if can message or not</button>
      <button onClick={()=>seeMess()}>seemess</button>
     </div>  */}
    
    <div className="flex min-h-screen pt-28 px-10 bg-[#240046] overflow-hidden">
      <div className="w-1/4 bg-[#17002B] min-h-full rounded-xl p-4">
          
      {/* <p onClick={() => handleContactClick('')} className="text-white truncate  cursor-pointer my-2 text-end text-base py-1.5 px-3 rounded transition-all duration-300 ease hover:bg-white/20">Back</p> */}
        <h2 className="text-white flex w-full justify-between items-center mb-4">Chat Contacts </h2>
        <div>
         { chatUser &&  chatUser?.map((user : any , idx : number )=><div key={idx}  className="text-white truncate w-full cursor-pointer mb-2">{user.client.knownPublicKeyBundles[0]}Chat {idx + 1}</div>) }
         
        </div>
      </div>
      <div className="w-3/4 p-4">
        {selectedContact ? (
          <div className={`bg-white/5 p-2`}>
            <h2 className="text-white mb-4">Chatting with {selectedContact }</h2>
            <div className="h-[70vh] overflow-y-scroll scrollbar-hide border-2 bg-transparent p-4 rounded">
              {messages.map((message, index) => (
                <div key={index} className="mb-2">
                  {/* <strong>{message.sender}: </strong>{message.content} */}
                  jlksahdfk
                </div>
              ))}
            </div>
            <div className="mt-4 flex">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 p-2 border border-gray-400 rounded bg-transparent"
                placeholder="Type a message..."
              />
              <button onClick={handleSendMessage} className="ml-2 bg-violet-500 text-white p-2 rounded">Send</button>
            </div>
          </div>
        ) : (
          <div className="text-white flex flex-col  bg-white/5 w-full min-h-full  rounded-xl p-4 ">
             <input
           onChange={(e) => setInputValue(e.target.value)}
            type="text"
            className="w-full bg-white/5  px-4 mb-2 rounded-2xl py-4 outline-none placeholder:text-white/50 "
            placeholder="🔍 Search Sender eg- 0x..Vitalik Buterin || Vitalik.eth || Vitalik.lens || NEXT.ID "
          />
           <span className={`${debouncedValue ? "block" : " hidden "} my-2 ${canMess ? "text-lime-400" : " text-rose-500 "}`}> {canMess ? "You can message this Address" : "This user didnt registered on XMTP"}</span>
           {/* href={`/chat?to=${debouncedValue}`} */}
           <div  onClick={()=>setSelectedContact(debouncedValue)} className={` ${canMess ? "block" : " hidden "} bg-violet-500 py-2 px-4 rounded-xl cursor-pointer w-[10rem] mt-4 `}> Send Chat</div>
           <br/>
           <span> OR </span>
           <br/>
           <span> Select a contact to start chatting</span>
           </div>
        )}
      </div>
      <ToastContainer
        position="bottom-right"
        theme="dark"
        autoClose={3000}
        hideProgressBar={true}
        transition={Flip}
        />
    </div>

    </XMTPProvider>
  )
}

export default Chat