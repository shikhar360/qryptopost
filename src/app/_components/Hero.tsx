
import Link from "next/link"

const Hero = () => {
  return (
    <div 
     
    className=" w-[100vw] h-[100vh] flex items-center justify-center overflow-hidden relative ">
       <video
         className={`w-[100vw] h-[100vh] hue-rotate-30  `}
         autoPlay
         loop
         muted
       >
         <source
           src={"/img/hole.mp4"}
           type="video/mp4"
           className={``}
           height={100}
         />
       </video>
       <div  className={`w-[100vw] h-[100vh]   absolute top-32 left-20 `}>
        {/* <p></p> */}
        <p className="text-white/70 text-sm" >One of the first</p>
        <div className={`bg-gradient-to-br from-[#b294ff] via-[#c3c7ff] to-[#eadeff]  md:text-8xl text-4xl inline-block font-mooli text-transparent bg-clip-text`}>
          Web3 <br/> Emailing <br/>Solution
          </div>
          <div className={`flex gap-6 items-center justify-start mt-7`}> 
            <Link href={"/Login"}>
              <p className="   bg-[#8338EC] px-4 py-2 rounded-xl transition-all duration-200 ease-linear  cursor-pointer    text-center   ">
               Continue With WALLET
              </p>
            </Link>
            <Link href={"/Login/Gmail"}>
              <p className=" border border-[#b294ff] px-4 py-2 rounded-xl transition-all duration-200 ease-linear  cursor-pointer bg-transparent   text-center   ">
               Continue With Email
              </p>
            </Link>
            </div>
       </div>
     </div>
  )
}

export default Hero
{/* <div></div> */}