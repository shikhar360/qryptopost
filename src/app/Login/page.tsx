"use client";
import React from "react";
import { Database, Metadata } from "@tableland/sdk";
import {  useAccount } from "wagmi";
import {ethers ,type Signer } from "ethers"

import {granting } from "./utils";

const Login = () => {
  const { address, isConnected } = useAccount()
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

  

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white text-black p-24">
      Login
      <button onClick={()=>addUser()}>Insert</button>
      <button onClick={()=>getAll()}>read</button>
      <button onClick={()=>granting(address as string)}>GRANt</button>
      </div>
  )
}

export default Login
/**
 a wallet continuting option to with the options to fill extradetails like name phone and eth  this will have ooption to make a gaseless emailing feature
 if continuting with email then the email along with generated wallet and 

 contract 0x013209c6d46954765995238cafE11eabe3b34AD2
 hash 0xf5a1fc3c28e4c78c1af30b8af099f2f8f347262f39b7b89bddfe0b1bf00bd7b9
 */