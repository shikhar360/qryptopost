"use client";

import Link from "next/link";
import React, { useState, useEffect, useMemo } from "react";
import { Database, Metadata } from "@tableland/sdk";
import { useAccount } from "wagmi";
import Loading from "../_components/Loading";
import { grantsubscribe } from "../login/utilities";
import { useStore } from "@/store/Store";
interface ISubs{
  sub_id : number,
  name : string
  ethaddress : string
}
const Services = () => {
  const [seeServices, setSeeServices] = useState<boolean>(true);
  const { address: addr, isConnected } = useAccount();
  const [address, setAddress] = useState<string>("");
  const [allsubs, setAllSubs] = useState<ISubs[]>([{
    sub_id : 0,
    name : "",
    ethaddress : "",
  }]);
  useEffect(() => {
    if (!addr) return;
    setAddress(addr as string);

  }, []);
  const subscribe = process.env.NEXT_PUBLIC_TABLE_SUBSCRIBE || "";
  const usersTable = process.env.NEXT_PUBLIC_TABLE_USER || "";
  const db = new Database();
  const setGsubs = useStore(state => state.setSubs)

  async function getsubscription() {
    try {
      if (!address) return;
      const distinctsubs: { results?: any } = await db
        .prepare(
          `SELECT * FROM ${usersTable} WHERE id IN (SELECT DISTINCT services FROM ${subscribe} WHERE subscriber = ?);`
        )
        .bind(address)
        .all();
      const allsubscription = distinctsubs?.results;
      let data : ISubs[] = []
      allsubscription.forEach((val : any) => {
       data.push({
        sub_id : val.id,
        name : val.name,
        ethaddress : val.ethAddress
       })
      })
      setAllSubs(data)
      setGsubs(data as any)
      
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(()=>{
    getsubscription()
  },[address])

  return (
   <>
      <div
              onClick={() => setSeeServices((prev) => !prev)}
              className={`w-full  mt-7  bg-[#2F1A41] rounded-r-full flex justify-between z-20 py-2 px-4 `}
            >
              <span className={`text-xs text-white/70`}>Services</span>
              <img
                src="https://img.icons8.com/ios/50/f3e5ff/expand-arrow--v2.png"
                alt="arrow"
                className={`w-4 ${
                  !seeServices ? "rotate-180" : "rotate-0"
                } transition-all select-none duration-300 ease-linear`}
              />
            </div>

            <div
              className={`w-full  max-h-full select-none flex items-center overflow-y-scroll flex-col scrollbar-hide  `}
            >
              <div
                className={`flex flex-col w-full items-start  justify-center origin-top ${
                  seeServices ? "translate-y-0 " : "-translate-y-[110%] "
                } z-10   transition-all duration-300 ease-linear`}
              >
               {allsubs[0]?.ethaddress && allsubs?.map((val: ISubs , idx : number) =>
               <Link
               key={idx}
                href={`/mail?service=${val.sub_id}`}
                  className={` text-white py-2 px-4 w-[70%] text-sm text-center   hover:bg-white/5 my-2  rounded-xl mx-auto transition-all duration-150 ease-linear overflow-hidden truncate `}
                >
                 <span className={`w-full`}> {val.name ? val.name : val.ethaddress}</span>
                </Link>)}
              </div>
            </div>
   </>
  )
}

export default Services