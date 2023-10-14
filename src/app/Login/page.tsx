"use client";
import React, { useEffect, useState }  from "react";
import { Database, Metadata } from "@tableland/sdk";
import {  useAccount } from "wagmi";
import Link from "next/link";



interface IData {
  name : string
  email : string
  phone : string
}
const Login = () => {
  const [eth , setEth]= useState<string>('')
  const { address, isConnected } = useAccount()

  useEffect(()=>{
   if(isConnected){
    setEth(address as string)
   }
  },[])
  // const publicClient = usePublicClient();
  // const { data: walletclient } = useWalletClient();  //so called signer of the user currently using

  
//  const signer = wallet.connect(provider) as Partial<ReadConfig & SignerConfig> & Partial<AutoWaitConfig>
 

  const db = new Database();

  
  
  const tableName = process.env.NEXT_PUBLIC_TABLE_USER || ""
  

  
  async function getAll (){
    const { results } = await db.prepare(`SELECT * FROM ${tableName};`).all();
    console.log(results);
  }


  async function addUser(){
    console.log(address);
    //Now need to give access to all the other wallets
    
    const stmt =  db.prepare(
   `INSERT INTO ${tableName} (ethAddress, name, email, phone, xmtped) VALUES (?1, ?2, ?3, ?4, ?5)`
   )
    const {meta : inserted} =  await stmt.bind(address , "gassing" , "456@gmail.com", "983745873" , "false").all()
        const something = await inserted?.txn?.wait();
        console.log(something);


  //  console.log(results);
  }

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
     
      {/* <button onClick={()=>addUser()}>Insert</button>
      <button onClick={()=>getAll()}>read</button>
      <button onClick={()=>granting(address as string)}>GRANt</button> */}
  <p> </p>
   <div className="md:w-[60%] w-[95%] bg-stone-800 flex flex-col items-center justify-start px-4 py-8 rounded-xl shadow-lg shadow-black/120"> 

      <p className="text-white mb-8 text-start text-2xl  w-[80%]  px-4  rounded-sm h-8 "> Signup</p>
      {eth ? <p className="text-white mb-2 text-start text-sm  w-[80%]  px-4 truncate rounded-sm h-8 "> Eth Address : {eth}</p> : <p>Connect your wallet </p>}
      <input onChange={handledata} type="text" placeholder="name   (optional)" name="name" className="text-white mb-2 bg-stone-800 focus:outline-none text-start text-sm  w-[80%]  px-4  rounded-sm h-8 "/>
      <input onChange={handledata} type="text" placeholder="tom@gmail.com  (optional)" name="email" className="text-white bg-stone-800 focus:outline-none mb-2 text-start text-sm  w-[80%]  px-4  rounded-sm h-8 "/>
      <input onChange={handledata} type="text" placeholder="+62-2121-306-919  (optional)" name="phone" className="text-white bg-stone-800 mb-2 focus:outline-none text-start text-sm  w-[80%]  px-4  rounded-sm h-8 "/>
      <button
        // onClick={() => }
        className="bg-[#8338ec] text-white py-1 px-4 w-[50%] mx-auto my-3 mt-6 hover:-translate-y-2 hover:shadow-xl hover:shadow-violet-800 rounded-xl transition-all duration-150 ease-linear"
        >
       Continue With Wallet
      </button>
      <span> OR</span>
      <Link href={`/Login/Gmail`}
        // onClick={() => }
        className="border-[#661EFE] border-2  py-1 px-4 w-[50%] mx-auto my-3 hover:-translate-y-2 hover:shadow-xl hover:shadow-violet-800 rounded-xl text-center transition-all duration-150 ease-linear"
        >
       Continue With Gmail
      </Link >
        </div>
      </div>
  )
}

export default Login
/**
 a wallet continuting option to with the options to fill extradetails like name phone and eth  this will have 
 ooption to make a gaseless emailing feature
 if continuting with email then the email along with generated wallet and 

 contract 0x013209c6d46954765995238cafE11eabe3b34AD2
 hash 0xf5a1fc3c28e4c78c1af30b8af099f2f8f347262f39b7b89bddfe0b1bf00bd7b9
 */