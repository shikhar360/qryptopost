"use client";

import Link from "next/link";
import { useStore } from "@/store/Store";
import { useEffect, useMemo, useState , useRef } from "react";
import Services from "../_components/Services";
import { useSearchParams } from "next/navigation";
import { Database, Metadata } from "@tableland/sdk";
import Loading from "../_components/Loading";
import dynamic from "next/dynamic";
import useDebounce from './useDebounce';
interface IMail {
  id: number;
  content: string;
  sender: string;
  receiver: string;
  subject: string;
  time: string;
  replies: string;
}
import {  useAccount } from "wagmi";
import { ToastContainer, toast, Flip } from 'react-toastify';

const Mail = () => {
  const address = useStore((state) => state.ethAddr);
  const searchParams = useSearchParams();
  const service = searchParams.get("service");
  const read = searchParams.get("read");
  const filter = searchParams.get("filter");
  const [inputValue, setInputValue] = useState<string>('');
  // console.log(read);
  // console.log(service)
  // const [seeServices, setSeeServices] = useState<boolean>(true);
  const db = new Database();
  const inbox = process.env.NEXT_PUBLIC_TABLE_INBOX || "";

  // if (mail.sender !== address){
  //   toast.error("Enter your connected Wallet Address")
  //   return
  // }


  const setAddress = useStore(state => state.setEthAddr)  
  const { address : addr, isConnected } = useAccount()
  // const [address , setAddress] = useState<string>('')
  
   useEffect(()=>{
    
    if(isConnected === true){
      setAddress(addr as string);
    }
    
    if(!isConnected){
      setAddress('');
      if(!address)toast.warn("Connect wallet");
    }
    
    path.current = address === '' ? '' : `/${address}` 

   },[address, isConnected])

  // console.log(address)
  const [allMails, setAllMails] = useState<IMail[]>([
    {
      id: 0,
      content: "",
      sender: "",
      receiver: "",
      subject: "",
      time: "",
      replies: "",
    },
  ]);
  
  const path = useRef<string>('')


  const [maskData , setMaskData] = useState<any>("")

  // let path = ``
  useEffect(() => {
   

    async function getallMails() {
      //check if the user is on the userlist or not and then retrive all the things from the inbox tabel
      // SELECT * FROM messages WHERE sender = 'given_address' OR receiver = 'given_address';
      // console.log(address)
      // if(!address)toast.warn("Connect wallet");
      if (!address)return 
      const { results } = await db
        .prepare(
          `SELECT * FROM ${inbox} WHERE receiver = ? OR sender = ? ORDER BY time DESC;`
        )
        .bind(address, address)
        .all();

      if (results) {
        const data: unknown[] = results;
        setAllMails(data as IMail[]);
      }

      // console.log(results);
    }

    

   

    getallMails();
  }, [address ]);

  const theMail = useMemo(() => {
    if (read) {
      const mail = allMails.find((mail) => mail.id === +read);
      // console.log("read" , read);
      return mail;
    }
    // const istrue = mail?.sender === address || mail?.receiver === address;
  }, [read , allMails ]);


  

  const filteredUser = useMemo(() => {

    if(filter === "inbox" && isConnected){
      const mail = allMails.filter((mail) => mail.receiver === address);
      
      // console.log("inbox" , mail);
      return mail
    }

    if(filter === "outbox" && isConnected){
      const mail = allMails.filter((mail) => mail.sender === address);
      // console.log("outbox" ,  mail);
      return mail
    }
    
    if(!filter && isConnected )return allMails

    if(!isConnected){
      return [
        {
          id: 0,
          content: "",
          sender: "",
          receiver: "",
          subject: "",
          time: "",
          replies: "",
        },
      ]
    }
  }, [filter , allMails , isConnected]);

  // console.log(filteredUser);
  
  const color = {
    ENS : "",
    farcaster : "bg-[#e0aaff]",
    lens : '',
    dotbit : "bg-[#44355b]",
    rand : "bg-[#f8edeb]",
    twitter : "bg-[#20a4f3]",
    github : "bg-[#011627]",
    discord : "bg-[#2541b2]",
    website : "bg-[#9fffcb]",
  }
  
  const debouncedValue = useDebounce(inputValue, 2000);
  console.log(inputValue);

  useEffect( () => {
      if (!debouncedValue)return
      // console.log(`Searching for ${debouncedValue}`);
      // Add your code here to be executed after 2 seconds of inactivity
      
      async function getMaskData(){
        try{
           if(!address)console.log("Connect your Wallet");
           if(!address)return

            const response  = await fetch(`https://api.web3.bio/profile/${debouncedValue}`)
            //  const response = await fetch("http://example.com/movies.json");
            const data = await response.json();
            console.log(data)
            setMaskData(data)
          }catch(err){
            console.log(err)
            
            setMaskData('')
          }
        }
         getMaskData()
      
  }, [debouncedValue]);

  // console.log(maillink)
  console.log(maskData)
  
 
  return (
    <main className="flex w-full max-h-screen flex-col items-center justify-center overflow-hidden  bg-[#2400469e] scrollbar-hide relative">
      <div className="flex w-[100vw] h-[100vh] items-end   overflow-hidden justify-center">
        <div className="flex w-[25vw] h-[100vh] flex-col overflow-hidden items-center justify-center">
          <div
            className={`min-h-full w-full pt-20 pr-10 scrollbar-hide flex flex-col items-start justify-start overflow-y-scroll`}
          >
            <Link
            //  href={maillink}
            //  href={}
             href={`/mail/${path.current}`}
            //  prefetch={false}
            //  href={ {pathname :`/mail/[address]` , query : {address : address} }}
             
              className="bg-[#8338ec] text-white py-2 px-4 w-full text-xl my-3 hover:-translate-y-1 hover:shadow-xl
               hover:shadow-black rounded-r-full transition-all duration-150 ease-linear"
            >
              Send Mail 📮
            </Link>
            <Link
            href={`/mail`}
              className=" text-white py-2 px-4 w-full text-sm hover:ring-[2px] hover:ring-[#8338ec] my-3  rounded-r-full transition-all
               duration-150 ease-linear"
            >
              All Mails 📬
            </Link>
            <Link
            href={`/mail?filter=inbox`}
              className=" text-white py-2 px-4 w-full text-sm hover:ring-[2px] hover:ring-[#8338ec] my-3  rounded-r-full transition-all 
              duration-150 ease-linear"
            >
              Inbox 📩
            </Link>
            <Link
            href={`/mail?filter=outbox`}
              className=" text-white py-2 px-4 w-full text-sm hover:ring-[2px] hover:ring-[#8338ec] my-3  rounded-r-full transition-all 
              duration-150 ease-linear"
            >
              Outbox 📤
            </Link>
            <Services />
          </div>
        </div>

        <div className="flex w-full flex-col h-[100vh] pt-20 overflow-hidden ">
          <input
           onChange={(e) => setInputValue(e.target.value)}
            type="text"
            className="w-[70%] bg-white/5  px-4 mb-2 rounded-2xl py-4 outline-none placeholder:text-white/50 "
            placeholder="🔍 Search Sender eg- 0x..Vitalik Buterin || Vitalik.eth || Vitalik.lens || NEXT.ID "
          />

          <div className="flex w-full flex-1  flex-col bg-[#240046] overflow-hidden rounded-t-2xl items-center justify-start max-h-full">
            <div className={`w-full flex  items start`}>
              <span
                className={`flex-1  text-center py-2 bg-black cursor-pointer  text-xs text-white hover:text-white  border-r border-white/50 border-dashed`}
              >
                TableBox
              </span>
              <span
                className={`flex-1  text-center py-2 bg-black cursor-pointer  text-xs text-white hover:text-white`}
              >
                Gaseless Mails - XMTP
              </span>
            </div>

            {read && theMail?.sender === address || theMail?.receiver === address ? (
              <div className={` w-full min-h-full flex-1 flex-col flex gap-y-7 items-start justify-start px-4 py-8 `}>
                {/* {theMail?.content} */}
               <span className={`text-sm text-white/70 `}>{theMail.receiver === address ? `From : ${theMail.sender}` : `To : ${theMail.receiver}`} </span>
               <span  className={`text-xl`}>Subject : {theMail.subject}</span>
               <span  className={`text-base max-h-[50vh] overflow-scroll scrollbar-hide m`}>
                <span className={` w-full h-full font-jakarta leading-wider tracking-wide  `}>
                  {theMail.content} 
                </span>
                </span>
               <span  className={`text-xs text-white/70 font-bold`} >{theMail.time}</span>
              </div>
            ) : read === null ? null : (
              <Loading />
            )}


            {allMails[0]?.sender && read === null && isConnected ? (
              <div
                className={`w-full min-h-full flex-1   select-none flex items-center overflow-hidden flex-col ${
                  read === null ? "flex" : "hidden"
                } `}
              >
                <div
                  className={`flex flex-col  flex-0 w-full items-start  justify-start overflow-y-scroll  scrollbar-hide pb-[50vh]  `}
                >
                  {filteredUser?.map((mail, idx) => (
                    <Link
                      href={`/mail?read=${mail.id}`}
                      key={idx}
                      className={`w-full flex items-center ${
                        idx % 2 === 0 ? "" : " bg-white/20"
                      } shrink-0  h-12   border-black`}
                    >
                      {/* <div className={`w-full flex jus`}>
                   
                   </div> */}
                      <span className={`w-[50%] pl-5 truncate`}>
                        {mail.subject}
                      </span>
                      <span
                        className={`w-[30%] text-sm text-white/80 truncate`}
                      >
                        {mail.sender == address
                          ? `TO : ${mail.receiver}`
                          : mail.sender}
                      </span>
                      <span
                        className={`w-[20%] font-semibold text-xs pr-5 text-end truncate`}
                      >
                        {mail.time}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : read ? null : (
              <Loading />
            )}
          </div>
        </div>
      </div>

      <div className={`absolute  bottom-0 ml-[20vw] z-30 w-[60%] rounded-t-3xl overflow-hidden  ${debouncedValue ? 'translate-y-0' : 'translate-y-[110%] '}  transition-all duration-500 ease-[cubic-bezier(0.5, 0.5, 0.4, 1.2)] bg-white/80 h-[60vh] `}> 
       {(debouncedValue === ""  || maskData?.address === null || !maskData[0]?.address ) ? <span className="flex  items-center gap-2 justify-center w-full text-center mt-10 mx-auto" ><Loading simple={true} w={"w-6"}/> Getting Your data...</span> : 
       
       <div className="flex  w-full  flex-col items-start justify-center py-8 px-4" >
        
        <p className="text-violet-900  text-3xl truncate mb-0.5">{maskData[0]?.displayName}</p>
        <p className="text-black text-black/80 text-sm ml-1 truncate w-full mb-2">{maskData[0]?.address}</p>
        <p className="flex  w-full  gap-2 items-center " > <span className="text-black ml-1 text-xs">Powered by</span><img src="/img/mask.png" alt="mask" className="w-5 rounded-md select-none"/></p>

        <Link  className="bg-[#8338ec] text-white py-1 px-4  mr-auto mt-8  hover:-translate-y-1 hover:shadow-md hover:shadow-black/30 rounded-md transition-all duration-150 ease-linear select-none cursor-pointer"
         href={`/mail/${address}?receiver=${maskData[0]?.address}`}
         >
         Send Mail
        </Link>

        <p className="text-black  text-xs mt-4 ml-2 font-bold">{`Found ${maskData.length} IDs :`}</p>

        <div className="grid grid-cols-3 auto-rows-auto w-full  max-h-[30vh] gap-y-4 scrollbar-hide py-4 overflow-scroll">
         { maskData?.map((mask : any, idx : number) => {         
          return <div key={idx} className={`w-[90%] min-h-[9rem] ${mask.platform === "dotbit" && 'bg-[#44355b]'} ${mask.platform === "farcaster" && 'bg-[#e0aaff]'}   ${mask.platform === "lens" && 'bg-[#aacc00]'}  ${mask.platform === "ENS" && 'bg-[#bde0fe]'} bg-white/50 hover:-translate-y-1 hover:shadow-md shadow-sm hover:shadow-black/20 rounded-md mx-auto transition-all duration-150 ease-linear p-2`} >
            
            <img src={mask?.avatar} alt="mask" className="w-10 rounded-full mb-2   select-none"/> <span className="text-black ml-1 text-md mt-8 truncate w-full">{mask.identity}</span>
            
            <p className="text-black ml-1 text-xs mt-4 truncate w-full"> {"---"} {mask.platform}</p>
            
             
            </div>
         })}
         

            

            
        </div>

        
       </div>
       
       
       }
      
      </div>

    <ToastContainer
        position="bottom-right"
        theme="dark"
        autoClose={3000}
        hideProgressBar={true}
        transition={Flip}
        />
    </main>
  );
};

export default Mail;
// export default dynamic (() => Promise.resolve(Mail), {ssr: false})


//invites // 1 hr work
//maarketing   --- to publish emails
// subscribe -- page to see all the services to subscribe 
//send encrypted if they are xmtped 
//else just send disable button while login ------ done
// able tto login with email... add better ux   
//