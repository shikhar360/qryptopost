"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Database, Metadata } from "@tableland/sdk";
import { useAccount } from "wagmi";
import Loading from "../_components/Loading";
import { ToastContainer, toast, Flip } from "react-toastify";
import { useStore } from "@/store/Store";

interface IMailer {
  id: number;
  ethAddress: string;
  email: string;
  inbox: string;
  xmtped: string;
  services: string;
  name: string;
  phone: string;
}

const Channel = () => {
  const usersTable = process.env.NEXT_PUBLIC_TABLE_USER || "";
  const channel = process.env.NEXT_PUBLIC_TABLE_CHANNEL || "";
  const subscribe = process.env.NEXT_PUBLIC_TABLE_SUBSCRIBE || "";
  const db = new Database();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);
  const [mailers, setMailers] = useState<IMailer[]>([
    {
      id: 0,
      ethAddress: "",
      email: "",
      inbox: "",
      xmtped: "",
      services: "",
      name: "",
      phone: "",
    },
  ]);
  const { address: addr, isConnected } = useAccount();
  const [address, setAddress] = useState<string>("");
  useEffect(() => {
    if (!addr) return;
    setAddress(addr as string);
  }, []);
  const allSubs = useStore((state) => state.subs);
  async function getAllMassMailers() {
    try {
      if (!address) return;
      const distinctusers: { results?: any } = await db
        .prepare(
          `SELECT * FROM ${usersTable} WHERE id IN (SELECT DISTINCT user_id FROM ${channel});`
        )
        // .bind(address)
        .all();
      const alldistinct = distinctusers?.results;
      // console.log(alldistinct);
      setMailers(alldistinct);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getAllMassMailers();
    getCount();
  }, [address]);

  async function subscribeTo(idto: number) {
    try {
      if (!address) {
        toast.error("Connect wallet");
        return;
      }
      setIsLoading(true);
      const stmt = db.prepare(
        `INSERT INTO ${subscribe} (subscriber , services) VALUES (?1, ?2)`
      );
      await stmt.bind(address, idto).all();
      toast.success("Subscribed Successfully  🎉 ");
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  }

  async function getCount() {
    try {
      if (!address) return;
      const count: { count?: number } = await db
        .prepare(
          `SELECT COUNT(*) AS count FROM ${subscribe} WHERE services IN (SELECT id FROM ${usersTable} WHERE ethAddress = ?);`
        )
        .bind(address)
        .first();
      // return count.count
      // console.log(allsubscription);
      if (!count?.count) return;
      setCount(count?.count);
    } catch (err) {
      console.log(err);
    }
  }
  // const subcount = allSubs.some((val : any) => val.sub_id == 7)
  // console.log(subcount)
  return (
    <div className="pt-24 bg-[#240046] min-h-screen overflow-hidden ">
      {/* <button onClick={()=>getCount()}>test</button> */}
      <div className="grid grid-cols-4 max-h-[90%] w-[80%] mx-auto overflow-y-scroll gap-y-5 scrollbar-hide">
        {mailers.map((mailer: IMailer, idx: number) => (
          <div
            key={idx}
            className={`col-span-4 md:col-span-1 min-h-[10rem]  w-[90%] mx-auto rounded-xl py-3 px-2 ${
              idx % 2 === 0 ? "border border-violet-400" : " bg-white/20"
            } `}
          >
            <div className="flex flex-col items-center ">
              {/* {mailer.services == 'undefined' ? null : <img src={mailer.services} className={`w-16 rounded-full `} alt={'user'}/>} */}
              <span>
                {mailer.name ? mailer.name.toUpperCase() : mailer.ethAddress}
              </span>
              <span className={`w-full truncate text-center mt-2`}>
                {count} Subscriber
              </span>
              <button
                disabled={
                  isLoading ||
                  allSubs.some((val: any) => val.sub_id == mailer.id)
                }
                onClick={() => subscribeTo(mailer.id)}
                className={`mt-8 py-1 px-3  rounded-xl ${
                  allSubs.some((val: any) => val.sub_id == mailer.id)
                    ? "bg-lime-400 text-black"
                    : "bg-violet-500"
                }`}
              >
                {isLoading ? (
                  <Loading w={"w-10"} simple={true} />
                ) : (
                  "Subscribed"
                )}
              </button>
            </div>
          </div>
        ))}
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

export default Channel;
