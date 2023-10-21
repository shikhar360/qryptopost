"use client";
import React, { useEffect, useState } from "react";
import { Database, Metadata } from "@tableland/sdk";
import { useAccount, useWalletClient } from "wagmi";
import Link from "next/link";
import { ToastContainer, toast, Flip } from "react-toastify";
import {
  createUserInbox,
  createReplybox,
  grantInsert,
  createsubscribe,
  clearall,
} from "./utilities";
import { useStore } from "@/store/Store";
import Loading from "../_components/Loading";
import { ethers } from "ethers";
interface IData {
  name: string;
  email: string;
  phone: string;
}
import { XMTPProvider } from "@xmtp/react-sdk";
import { useClient } from "@xmtp/react-sdk";

const Login = () => {
 
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [address, setAddress] = useState<string>("");
  const { address: addr, isConnected } = useAccount();
  const { data: walletclient } = useWalletClient(); 
  const signer = walletclient;

  const setclient = useStore((state) => state.setXMTP);

  useEffect(() => {
    if (!addr) return;
    setAddress(addr as string);
  }, []);
 
  const { initialize } = useClient();

  const db = new Database();

  const usersTable = process.env.NEXT_PUBLIC_TABLE_USER || "";

  async function getAll() {
    const { results } = await db.prepare(`SELECT * FROM ${usersTable};`).all();
    // console.log(results);
  }


  async function register(data: IData) {
    console.log(address);
   
    try {
      if (!address) {
        toast.error("Please connect your Wallet 😅");
        return;
      }

      setIsDisabled(true);
      //check if the user is on the usertable or not
      const isalready: { ethAddress?: string } = await db
        .prepare(`SELECT ethAddress FROM ${usersTable} WHERE ethAddress = ?;`)
        .bind(address)
        .first(); //this need somewhere else
      // console.log(results);

      // console.log(isalready);

      if (isalready?.ethAddress) {
        toast("User with this Address already present 🤝");
        setIsDisabled(false);

        return;
      }

      toast("Registering to XMTP ✧");
      initXmtp();
      // if the user is present we need to give all access  to create the inbox

      //if not
      //need to ceate a inbox with user and reply for the user

      

      await grantInsert(address);
      const inbox = process.env.NEXT_PUBLIC_TABLE_INBOX as string;
      const replybox = process.env.NEXT_PUBLIC_TABLE_REPLYBOX as string;
      // console.log({inbox , replybox})

      const stmt = db.prepare(
        `INSERT INTO ${usersTable} (ethAddress, name, email, phone, inbox, xmtped, services) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)`
      );
      const { meta: inserted } = await stmt
        .bind(
          address,
          data.name,
          data.email,
          data.phone,
          "undefined",
          "true",
          "undefined"
        )
        .all();
      const something = await inserted?.txn?.wait();
      toast.success("Inserted Successfully  🎉 ");
      setIsDisabled(false);

      // console.log(results);
    } catch (err) {
      console.log(err);
    }
  }

  // async function insertfake (data : IData){
  //     const stmt =  db.prepare(
  //  `INSERT INTO ${usersTable} (ethAddress, name, email, phone, xmtped) VALUES (?1, ?2, ?3, ?4, ?5)`
  //  )
  //   const {meta : inserted} =  await stmt.bind(address , data.name , data.email, data.phone , "false").all()
  //       const something = await inserted?.txn?.wait();
  //       console.log(something);
  // }

  const [data, setData] = useState<IData>({
    name: "",
    email: "",
    phone: "",
  });

  function handledata(e: React.ChangeEvent<HTMLInputElement>) {
    setData((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  }

  const initXmtp = async () => {
    const xmtpclient = await initialize({ signer });
    setclient(xmtpclient);
    // setXmtp(xmtpclient)
  };

  return (
    <XMTPProvider>
      <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-24">

        <div className="md:w-[60%] w-[95%] bg-stone-800 flex flex-col items-center justify-start px-4 py-8 rounded-xl shadow-lg shadow-black/120">
          <p
            className="text-white mb-8 text-start text-2xl  w-[80%]  px-4  rounded-sm h-8 "
          >
            Signup
          </p>
          {address ? (
            <p className="text-white mb-2 text-start text-sm  w-[80%]  px-4 truncate rounded-sm h-8 ">
              Eth Address : {address}
            </p>
          ) : (
            <p>Connect your wallet </p>
          )}
          <input
            onChange={handledata}
            type="text"
            placeholder="name   (optional)"
            name="name"
            className="text-white mb-2 bg-stone-800 focus:outline-none text-start text-sm  w-[80%]  px-4  rounded-sm h-8 "
          />
          <input
            onChange={handledata}
            type="text"
            placeholder="tom@gmail.com  (optional)"
            name="email"
            className="text-white bg-stone-800 focus:outline-none mb-2 text-start text-sm  w-[80%]  px-4  rounded-sm h-8 "
          />
          <input
            onChange={handledata}
            type="text"
            placeholder="+62-2121-306-919  (optional)"
            name="phone"
            className="text-white bg-stone-800 mb-2 focus:outline-none text-start text-sm  w-[80%]  px-4  rounded-sm h-8 "
          />
          <button
            // onClick={() => insertfake(data)}
            disabled={isDisabled}
            onClick={() => register(data)}
            className="bg-[#8338ec] text-white py-1 px-4 w-[50%] mx-auto my-3 mt-6 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 rounded-xl transition-all duration-150 ease-linear"
          >
            {isDisabled ? (
              <div className={"flex items-center justify-center"}>
                <Loading simple={true} w={"w-5"} /> {"Wait for a bit .."}{" "}
              </div>
            ) : (
              "Continue With Wallet"
            )}
          </button>
          <span> OR</span>
          <Link
            href={`/login/gmail`}
            // onClick={() => }
            className="border-[#661EFE] border-2  py-1 px-4 w-[50%] mx-auto my-3 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 rounded-xl text-center transition-all duration-150 ease-linear"
          >
            Continue With Gmail
          </Link>
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
  );
};

export default Login;
/**
 now they have filled the details they will have to get the grant by the owner and nedd to insert the detials if they want 
 if they have continued with email they will have to mint a pkp to get the wallet and then they will get registered (need to reduce clicks )
 */
