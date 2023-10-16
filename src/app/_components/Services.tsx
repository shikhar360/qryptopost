"use client";

import Link from "next/link";
import { useStore } from "@/store/Store";
import { useState } from "react";

const Services = () => {
  const [seeServices, setSeeServices] = useState<boolean>(true);
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
                <Link
                href={`/mail?service=dsfjshd`}
                  className={` text-white py-2 px-4 w-[70%] text-sm text-center   hover:bg-white/5 my-2  rounded-xl mx-auto transition-all duration-150 ease-linear  `}
                >
                  Service dsfjshd
                </Link>
              </div>
            </div>
   </>
  )
}

export default Services