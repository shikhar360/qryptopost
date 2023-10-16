"use client";

import Link from "next/link";
import { useStore } from "@/store/Store";
import { useEffect, useMemo, useState } from "react";
import Services from "../_components/Services";
import { useSearchParams } from "next/navigation";
import { Database, Metadata } from "@tableland/sdk";
import Loading from "../_components/Loading";

interface IMail {
  id: number;
  content: string;
  sender: string;
  receiver: string;
  subject: string;
  time: string;
  replies: string;
}
export default function Mail() {
  const address = useStore((state) => state.ethAddr);
  const searchParams = useSearchParams();
  const service = searchParams.get("service");
  // console.log(service)
  // const [seeServices, setSeeServices] = useState<boolean>(true);
  const db = new Database();
  const inbox = process.env.NEXT_PUBLIC_TABLE_INBOX || "";

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

  useEffect(() => {
    async function getallMails() {
      //check if the user is on the userlist or not and then retrive all the things from the inbox tabel
      // SELECT * FROM messages WHERE sender = 'given_address' OR receiver = 'given_address';
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
  }, []);

  console.log(allMails);

  return (
    <main className="flex w-full max-h-screen flex-col items-center justify-center overflow-hidden  bg-[#2400469e] scrollbar-hide">


      <div className="flex w-[100vw] h-[100vh] items-end   overflow-hidden justify-center">
        <div className="flex w-[25vw] h-[100vh] flex-col overflow-hidden items-center justify-center">
          <div
            className={`min-h-full w-full pt-20 pr-10 scrollbar-hide flex flex-col items-start justify-start overflow-y-scroll`}
          >
            <button
              className="bg-[#8338ec] text-white py-2 px-4 w-full text-xl my-3 hover:-translate-y-1 hover:shadow-xl
               hover:shadow-black rounded-r-full transition-all duration-150 ease-linear"
            >
              Send Mail 📮
            </button>
            <button
              className=" text-white py-2 px-4 w-full text-sm hover:ring-[2px] hover:ring-[#8338ec] my-3  rounded-r-full transition-all
               duration-150 ease-linear"
            >
              All Mails 📬
            </button>
            <button
              className=" text-white py-2 px-4 w-full text-sm hover:ring-[2px] hover:ring-[#8338ec] my-3  rounded-r-full transition-all 
              duration-150 ease-linear"
            >
              Inbox 📩
            </button>
            <button
              className=" text-white py-2 px-4 w-full text-sm hover:ring-[2px] hover:ring-[#8338ec] my-3  rounded-r-full transition-all 
              duration-150 ease-linear"
            >
              Outbox 📤
            </button>
            <Services />
          </div>
        </div>

        <div className="flex w-full flex-col h-[100vh] pt-20 overflow-hidden ">
          <input
            type="text"
            className="w-[70%] bg-white/5  px-4 mb-2 rounded-2xl py-4 outline-none placeholder:text-white/50 "
            placeholder="🔍 Search Sender eg- Vitalik Buterin"
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

            {allMails[0].sender ? (
              <div className="w-full min-h-full flex-1   select-none flex items-center overflow-hidden flex-col  ">
                <div
                  className={`flex flex-col  flex-0 w-full items-start  justify-start overflow-y-scroll  scrollbar-hide pb-[50vh]  `}
                >
                 { allMails.map( (mail , idx) => <div
                 key={idx}
                    className={`w-full  ${(idx % 2) === 0 ? "" : " bg-white/20"} shrink-0  h-12   border-black`}
                  >
                  {mail.sender}
                  </div>)}
                 
                  

                  
                </div>
              </div>
            ) : (
              <Loading />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

{
  /* < Link href={`/mail/${address}?receiver=${"thereceiveraddress"}`}>trying the dynamcs</Link> */
}
