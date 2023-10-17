"use client";
import React, { useState } from "react";
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { AccsDefaultParams, AuthSig, AuthCallback } from "@lit-protocol/types";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/store/Store"
import { Database, Metadata } from "@tableland/sdk";
import { ToastContainer, toast, Flip } from 'react-toastify';

interface IMail {
  sender: string;
  receiver: string;
  // time : string
  subject: string;
  content: string;
}

const Sendbox = ({ params }: { params: { address: string } }) => {
  // const client = new LitJsSdk.LitNodeClient({
  //     litNetwork: "cayenne"
  // });
  const searchParams = useSearchParams();
  const receiver = searchParams.get("receiver");
  const address = useStore((state)=> state.ethAddr)
  const db = new Database();
  const inbox= process.env.NEXT_PUBLIC_TABLE_INBOX || ""
  
  // {params.address}  needd to check the user maybe set the global state with zustand

  async function sendMail(mail: IMail) {
    // check if the usr is on the table if not then create one or if yes then send the messge

  //  need to check if the user is you before sending
    try{

      if (mail.sender !== address){
        toast.error("Enter your connected Wallet Address")
        return
      }
      //  if yesthen send him the inbox
      const date = new Date()
      const caldate = new Date().toLocaleDateString();
      const time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
      const sendedAt = caldate+" "+time
      const stmt =  db.prepare(
        `INSERT INTO ${inbox} (sender, receiver, time, subject, content, replies) VALUES (?1, ?2, ?3, ?4, ?5, ?6)`
        )
        await stmt.bind(mail.sender , mail.receiver , sendedAt, mail.subject, mail.content , "" ).all()
        //  const something = await inserted?.txn?.wait();
        // console.log({something , inserted});
        toast.success("Mail sent Successfully  🎉 ")
      }catch(err){console.log(err)}
  }



  async function replying (){

  }
  // sender TEXT NOT NULL,
  // receiver TEXT NOT NULL,
  // time TEXT NOT NULL,
  // subject TEXT NOT NULL,
  // content TEXT NOT NULL,
  // replies TEXT
// 0x3aD7CBc5927a40ab90c2cEAEdD8Bf2489B2659C4

async function test (){
  try{
    // const date = new Date()
    // const caldate = new Date().toLocaleDateString();
    // const time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    // console.log(caldate+" "+time);
    console.log(address);
    const { results } = await db.prepare(`SELECT * FROM ${inbox} WHERE receiver = ?;`).bind(address).all();
    console.log(results[0]);
  }catch(err){console.log(err)}
}

  const [data, setData] = useState<IMail>({
    sender: params.address || "",
    receiver: receiver || "",
    subject: "",
    content: "",
  });

  function handledata(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setData((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  }
  

  //
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div
        className={`flex flex-col items-start justify-startpy-10  bg-white/10 px-4 py-10 rounded-xl md:w-[50%] w-[90%]`}
      >
        <div className={`flex items-center gap-4 justify-center w-full `}>
          <img className={`w-5`} src="/img/sender.png" alt="img" />
          <input
            onChange={handledata}
            type="text"
            placeholder="From...0xsender "
            name="sender"
            value={data.sender}
            className="text-white bg-transparent border-b mb-4 border-white/20 focus:outline-none  text-start text-sm  w-[80%]  px-2  rounded-sm h-8 "
          />
        </div>
        <div className={`flex items-center gap-4 justify-center w-full `}>
          <img className={`w-5 `} src="/img/receiver.png" alt="img" />
          <input
            onChange={handledata}
            type="text"
            placeholder="To...0xreceiver"
            name="receiver"
            value={data.receiver}
            className="text-white bg-transparent border-b mb-4 border-white/20 focus:outline-none  text-start text-sm  w-[80%]  px-2  rounded-sm h-8 "
          />
        </div>
        <div className={`flex items-center gap-4 justify-center w-full `}>
          <img className={`w-5`} src="/img/sub.png" alt="img" />
          <input
            onChange={handledata}
            type="text"
            placeholder="Subject : Attending my dogs marriage"
            name="subject"
            value={data.subject}
            className="text-white bg-transparent border-b mb-4 border-white/20 focus:outline-none  text-start text-sm  w-[80%]  px-2  rounded-sm h-8 "
          />
        </div>
        <div className={`flex items-start  gap-4 justify-center w-full `}>
          <img className={`w-5`} src="/img/content.png" alt="img" />
          <textarea
            onChange={handledata}
            placeholder="Content : Will be out for some work ........ Reguards"
            name="content"
            value={data.content}
            className="text-white bg-transparent  mb-4 focus:outline-none  text-start resize-none text-sm  w-[80%]   px-2  rounded-sm h-[30vh] "
          />
        </div>
        <div  className={`flex items-start  gap-4 justify-start w-full mx-8 `}>

        <button
      onClick={()=>sendMail(data)}
        className="bg-[#8338ec] text-white py-2 px-4   my-3 hover:-translate-y-1 hover:shadow-xl hover:shadow-black rounded-r-full transition-all duration-150 ease-linear"
        >
       Send Encrypted 🔥
      </button>
        <button
         onClick={()=>test()}
        className="border-[#8338ec] border text-white py-2 px-4   my-3 hover:-translate-y-1 hover:shadow-xl hover:shadow-black rounded-r-full transition-all duration-150 ease-linear"
        >
       Send 
      </button>
          </div>
      </div>
      <ToastContainer
        position="bottom-right"
        theme="dark"
        autoClose={3000}
        hideProgressBar={true}
        transition={Flip}
        />
    </div>
  );
};

export default Sendbox;

// export default dynamic (() => Promise.resolve(App), {ssr: false})