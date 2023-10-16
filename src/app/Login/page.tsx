"use client";
import React, { useEffect, useState }  from "react";
import { Database, Metadata } from "@tableland/sdk";
import {  useAccount } from "wagmi";
import Link from "next/link";
import { ToastContainer, toast, Flip } from 'react-toastify';
import { createUserInbox , createReplybox, grantInsert , createsubscribe } from "./utilities";
import { useStore } from "@/store/Store"
interface IData {
  name : string
  email : string
  phone : string
}



const Login = () => {

  const address = useStore((state)=> state.ethAddr)

 
  // const publicClient = usePublicClient();
  // const { data: walletclient } = useWalletClient();  //so called signer of the user currently using

  
//  const signer = wallet.connect(provider) as Partial<ReadConfig & SignerConfig> & Partial<AutoWaitConfig>
 

  const db = new Database();

  
  
  const usersTable = process.env.NEXT_PUBLIC_TABLE_USER || ""
  

  
  async function getAll (){
    // const max = await db.prepare(`SELECT MAX(id) FROM ${usersTable};`).first();
    // const res  = await db.prepare(`SELECT * FROM ${usersTable} WHERE ethAddress = ?;`).bind(address).all();
    // console.log(user);
    const { results } = await db.prepare(`SELECT * FROM ${usersTable};`).all();
    console.log(results);
  }
  


  /**
   * first time
   * login again 
   * didnt login but g
   * 
   * .all to get all the 
   * .first to gett the first
   * .,raw
   * .run to jstget the metadata
   * 
   *  */
  
  

  async function register(data : IData){
    console.log(address);
    //Now need to give access to all the other wallets
    
    if (!address){
      toast.error("Please connect your Wallet 😅")
      return
    }
    //check if the user is on the usertable or not
    // const { results } = await db.prepare(`SELECT * FROM ${usersTable} WHERE ethAddress = ?;`).bind(address).all(); //this need somewhere else
    // console.log(results); 
    // if the user is present we need to give all access  to create the inbox 
    

    //if not 
    //need to ceate a inbox with user and reply for the user
    
    //

   await grantInsert(address)
  //  const inbox = process.env.NEXT_PUBLIC_TABLE_INBOX as string
  //  const replybox = process.env.NEXT_PUBLIC_TABLE_REPLYBOX as string
  //  console.log({inbox , replybox})
  
     const stmt =  db.prepare(
   `INSERT INTO ${usersTable} (ethAddress, name, email, phone, inbox, xmtped, services) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)`
   )
    const {meta : inserted} =  await stmt.bind(address , data.name , data.email, data.phone, 'undefined' , "false" , "undefined" ).all()
        const something = await inserted?.txn?.wait();
        // console.log({something , inserted});
        toast.success("Inserted Successfully  🎉 ")


  //  console.log(results);
  }


  

  // async function insertfake (data : IData){
  //     const stmt =  db.prepare(
  //  `INSERT INTO ${usersTable} (ethAddress, name, email, phone, xmtped) VALUES (?1, ?2, ?3, ?4, ?5)`
  //  )
  //   const {meta : inserted} =  await stmt.bind(address , data.name , data.email, data.phone , "false").all()
  //       const something = await inserted?.txn?.wait();
  //       console.log(something);
  // }

 const [data , setData] = useState<IData>({
  name : "",
  email : "",
  phone : ""
 })  
 
 function handledata(e : React.ChangeEvent<HTMLInputElement>){
   setData(prev =>{
    return {
      ...prev ,
      [e.target.name] : e.target.value
    }
   })
 }


  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-24">
     
      <button onClick={()=>createUserInbox()}>Insert</button>
      <button onClick={()=>createReplybox()}>reolybox</button>
      <button onClick={()=>createsubscribe()}>subscribe</button>
      {/* <button onClick={()=>getAll()}>read</button> */}
      {/* <button onClick={()=>granting(address as string)}>GRANt</button> */}
  <p> </p>
   <div className="md:w-[60%] w-[95%] bg-stone-800 flex flex-col items-center justify-start px-4 py-8 rounded-xl shadow-lg shadow-black/120"> 

      <p onClick={()=>getAll()} className="text-white mb-8 text-start text-2xl  w-[80%]  px-4  rounded-sm h-8 "> Signup</p>
      {address ? <p className="text-white mb-2 text-start text-sm  w-[80%]  px-4 truncate rounded-sm h-8 "> Eth Address : {address}</p> : <p>Connect your wallet </p>}
      <input onChange={handledata} type="text" placeholder="name   (optional)" name="name" className="text-white mb-2 bg-stone-800 focus:outline-none text-start text-sm  w-[80%]  px-4  rounded-sm h-8 "/>
      <input onChange={handledata} type="text" placeholder="tom@gmail.com  (optional)" name="email" className="text-white bg-stone-800 focus:outline-none mb-2 text-start text-sm  w-[80%]  px-4  rounded-sm h-8 "/>
      <input onChange={handledata} type="text" placeholder="+62-2121-306-919  (optional)" name="phone" className="text-white bg-stone-800 mb-2 focus:outline-none text-start text-sm  w-[80%]  px-4  rounded-sm h-8 "/>
      <button
        // onClick={() => insertfake(data)}
        onClick={() => register(data)}
        className="bg-[#8338ec] text-white py-1 px-4 w-[50%] mx-auto my-3 mt-6 hover:-translate-y-2 hover:shadow-xl hover:shadow-violet-800 rounded-xl transition-all duration-150 ease-linear"
        >
       Continue With Wallet
      </button>
      <span> OR</span>
      <Link href={`/login/gmail`}
        // onClick={() => }
        className="border-[#661EFE] border-2  py-1 px-4 w-[50%] mx-auto my-3 hover:-translate-y-2 hover:shadow-xl hover:shadow-violet-800 rounded-xl text-center transition-all duration-150 ease-linear"
        >
       Continue With Gmail
      </Link >
        </div>
        <ToastContainer
        position="bottom-right"
        theme="dark"
        autoClose={3000}
        hideProgressBar={true}
        transition={Flip}
        />
      </div>
  )
}

export default Login
/**
 now they have filled the details they will have to get the grant by the owner and nedd to insert the detials if they want 
 if they have continued with email they will have to mint a pkp to get the wallet and then they will get registered (need to reduce clicks )
 */

