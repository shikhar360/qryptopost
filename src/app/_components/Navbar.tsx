'use client'
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {  useAccount } from "wagmi";
import { useStore } from "@/store/Store";

export default function Navbar() {
  const [isActive, setIsActive] = useState(false);

  const { address, isConnected } = useAccount()
  
  const avatar = useStore(state => state.avatar)  
  const name = useStore(state => state.username)  
  //  useEffect(()=>{

    //  if(isConnected){
    //   // setEth(address as string)
    //   setAddr(address as string);
    //   // console.log("Wallet connected");
    //  }

  //  },[])


  return (
    <nav className=" z-50 w-[96%]  md:w-[80%] bg-transparent backdrop-blur-md  font-jakarta    p-2  text-lg flex items-center justify-between transition-all duration-300 ease-linear fixed top-2 left-1/2 -translate-x-1/2 rounded-xl text-[#c497ff] ">

      <div className=" md:w-60  cursor-pointer flex  self-start items-center  px-2 justify-center rounded-md ">
          <Link href={"/"} className={`flex items-center   `}>
           {/* <img src="/img/logo.png" alt="logo" className={`w-12`}  /> */}
            <p className=" cursor-pointer transition-all duration-200 ease-linear  bg-transparent  py-1.5 px-4 rounded-md text-center   ">
            Qryptopost
            </p>
          </Link>
      </div>

      <div
        className={`    flex items-end  justify-end md:justify-between md:w-full flex-col md:flex-row `}
      >
        <div
          className=" px-6 flex items-center justify-center cursor-pointer transition-all duration-300 ease-linear p-1 rounded-full md:hidden "
          onClick={() => setIsActive((prev: boolean) => !prev)}
        >
          {!isActive ? (
            <img
              src="/img/menu.png"
              alt="menu"
              width={"38"}
              className={` duration-100 transition-all ease-linear`}
            />
          ) : (
            <img
              src="/img/plus.png"
              alt="menu"
              width={"38"}
              className={` duration-100 transition-all ease-linear rotate-45`}
            />
          )}
        </div>

        <div
          className={` ${
            isActive
              ? "flex flex-col  md:flex-row my-auto gap-2 items-center justify-center "
              : " hidden md:flex md:items-center md:justify-center my-auto   gap-2  text-base"
          }`}
        >


          <Link
            href={`/mail`}
          >
            <p className=" cursor-pointer transition-all duration-200 ease-linear    px-4  rounded-md text-center ">
            Mails
            </p>
          </Link>
          <Link
            href={`/`}
          >
            <p className=" cursor-pointer transition-all duration-200 ease-linear    px-4  rounded-md text-center ">
            Marketers
            </p>
          </Link>
          <Link href={"/invite"}>
            <p className=" cursor-pointer transition-all duration-200 ease-linear    px-4 rounded-md text-center   ">
             Invite
            </p>
          </Link>
        </div>

         <div
          className={` md:pr-5 ${
            isActive
            ? "flex flex-col  my-2 mx-auto  "
            : " hidden md:flex md:items-center md:justify-center md:gap-4 my-auto "
          }`}
          >
          <ConnectButton/>
            <Link href={"/login"}>
              <p className="  transition-all duration-200 ease-linear  cursor-pointer bg-transparent  rounded-md text-center   ">
               {avatar? <img src={avatar} alt="userimg" className=' w-8 rounded-full '/> :"Login"}
              </p>
            </Link>
        </div> 
      </div>
    </nav>
  );
}
