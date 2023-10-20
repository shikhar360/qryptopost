"use client";
import React, { useState, useEffect, useMemo } from "react";
import { channelpublish , grantChannel } from "../login/utilities";
import { ToastContainer, toast, Flip } from "react-toastify";
import { Database, Metadata } from "@tableland/sdk";
import { useAccount } from "wagmi";
import Loading from "../_components/Loading";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
interface IData {
  topic: string;
  description: string;
}
interface IMass {
  id: number
  user_id : number
  topic: string;
  description: string;
}

const InputForm = () => {
  const [formData, setFormData] = useState<IData>({
    topic: "",
    description: "",
  });

  const [myMassMails, setMyMassMails] = useState<IMass[]>([{
    id: 0,
    user_id : 0,
    topic: "",
    description: "",
  }]);
  const [address, setAddress] = useState<string>("");
  const searchParams = useSearchParams();
  const subs = searchParams.get("subscribers");
  console.log(subs)
  // const service = searchParams.get("My");


  const [isPublish, setIsPublish] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
   
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
  };
  const usersTable = process.env.NEXT_PUBLIC_TABLE_USER || "";
  const channel = process.env.NEXT_PUBLIC_TABLE_CHANNEL || "";
  const db = new Database();

  const { address: addr, isConnected } = useAccount();

  useEffect(() => {
    if (!addr) return;
    setAddress(addr as string);
  }, []);

  const handleSubmit = async (data: IData) => {
    try {
      if (!(data.topic && data.description)) {
        toast.error("Fill both the inputs");
        return;
      }

      //find the userid from the usertable
      const extract: { id?: any } = await db
        .prepare(`SELECT id FROM ${usersTable} WHERE ethAddress = ?;`)
        .bind(address)
        .first();
      console.log(extract?.id);
       if(!extract?.id)return
       setIsLoading(true)
      //if present then insert into db
      const stmt = db.prepare(
        `INSERT INTO ${channel} (user_id , topic, description) VALUES (?1, ?2, ?3)`
      );
      await stmt.bind(extract?.id, data.topic, data.description).all();
      toast.success("Published into Channel Successfully  🎉 ");
      setIsLoading(false)
      // console.log(check.results);
    } catch (err) {
      toast.error("Something went wrong while publishing");
      console.log(err);
      setIsLoading(false)
    }
    // Add your form submission logic here
  };
   
  // const myData = useMemo(async()=>{
    
  // },[isConnected , myMassMails])
  // console.log(myData);
  async function getMyData (){
    try{
      if(!address)return
      const extract: { id?: any } = await db
        .prepare(`SELECT id FROM ${usersTable} WHERE ethAddress = ?;`)
        .bind(address)
        .first();
      // console.log(extract?.id);
     if(!extract?.id){
      console.log("didnt got your id from usertable")
      return
     }
      const owned : {results? : any} = await db
      // .prepare(`SELECT * FROM ${channel};`) // for everything from the table
      .prepare(`SELECT * FROM ${channel} WHERE user_id = ?;`)
      .bind(extract?.id)
      .all();
    // console.log(owned?.results);
     setMyMassMails(owned?.results)
    }catch(err){console.log(err)}
  }
  
  useEffect(()=>{
    getMyData()
  },[ address])
  return (
    <div
      className={` p-6 w-full min-h-screen bg-[#240046] relative flex flex-col items-center justify-start pt-24 px-20 overflow-hidden`}
    >
      {/* <div onClick={()=>test()}>test</div> */}
      {/* <div onClick={()=>grantChannel(address)}>Grant</div> */}
      <div className={`flex w-full items-center justify-start gap-5 mr-auto `} >

      <button
        onClick={() => setIsPublish(true)}
        className={` border-lime-500 mb-5 flex gap-4 items-center justify-center text-lime-500 hover:bg-lime-500 hover:text-black border py-2 px-4 transition-all duration-200 ease   rounded-xl`}
        >
        Publish On Channel{" "}
        <img
          src={"/img/plus.png"}
          alt="icon"
          className={` transition-all   duration-200 ease-linear w-8 h-8 rounded-full cursor-pointer `}
          draggable="false"
          />{" "}
      </button>
      <Link
        href={`/marketers?subscribers=true`}
        className={`  mb-5 flex gap-4 items-center justify-center hover:bg-violet-400 hover:text-black  text-violet-300  py-2 px-4 transition-all duration-200 ease   rounded-xl`}
        >
       See All Subscriber
        
      </Link>
          </div>

     {myMassMails[0]?.topic ? 
       <div className={`w-full py-4 max-h-[70vh] overflow-y-scroll  pb-[20vh] scrollbar-hide`}>
       
       { myMassMails.map((mail : IMass , idx : number)=>{
        return (
          <div key={idx} className={`${
            idx % 2 === 0 ? "" : " bg-white/20"
          } mb-4 py-1 pb-2 px-2 rounded-md `}>
            <p className={`text-base font-semibold `}>{mail.topic.toUpperCase()}</p>
            <p className={`text-xs text-white/70 `}>{mail.description}</p>
          </div>
        )
       })}
      </div> : <Loading/>}



      <div
        className={` ${
          isPublish ? "absolute top-0 z-40 " : "hidden"
        }  px-[25vw] py-[25vh] z-20 w-full h-screen  backdrop-blur-sm  flex flex-col items-center justify-start rounded-xl`}
      >
        <div className={` p-6 bg-[#17002B] w-full my-[20vh]flex flex-col items-center justify-start rounded-xl`}>

        <div
         
         className={`mb-4 flex justify-between pr-8 w-full  `}
         >
          <span className="text-white/90 mb-8 text-2xl font-light pl-1">
            Publish Mass Mails
          </span>
          <img
            onClick={() => {
              setIsPublish(false)
              setFormData({
                topic: "",
                description: "",
              })
            }}
            src={"/img/plus.png"}
            alt="icon"
            className={` transition-all  -rotate-45 duration-200 ease-linear w-8 h-8 rounded-full cursor-pointer `}
            draggable="false"
            />
        </div>

        <div className="mb-4 flex flex-col w-full">
          <span className="text-white/70 text-sm font-light pl-1">Subject</span>
          <input
            type="text"
            
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            className=" border-b border-stone-700 placeholder:text-sm rounded focus:outline-none placeholder:text-white/80 bg-transparent outline-none  p-2"
            placeholder="A crazy Newsketter"
            />
        </div>
        <div className="mb-4 flex flex-col w-full">
          <span className="text-white/70 text-sm font-light pl-1">Content</span>
          <textarea
            value={formData.description}
            name="description"
            
            onChange={handleChange}
            className=" border-b border-stone-700 placeholder:text-sm resize-none rounded focus:outline-none placeholder:text-white/80 bg-transparent outline-none  p-2"
            placeholder="A crazy amazing deal fora "
            rows={5}
            />
        </div>
        <button
          onClick={() => handleSubmit(formData) }
          className="bg-violet-800  text-white py-2 px-4  rounded"
          disabled={isLoading}
          >
          {isLoading ? <Loading w={"w-8"} simple={true}/>: "Publish"}
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

export default InputForm;
