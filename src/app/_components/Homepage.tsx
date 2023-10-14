import React from 'react'
import Powered from './Powered'
import Feature from './Feature';
import FAQ from './FAQ';
import Hero from './Hero';

const Homepage = () => {
  return (
    <div className={`w-full min-h-screen flex flex-col items-center justify-start `}>
      <Hero/>
      <Powered/>
      <section className={`w-[96%] md:w-[90%] z-30 min-h-[85vh] flex flex-col items-start justify-start px-20  bg-[#8338ec] text-white mt-40 pt-20 pb-10 rounded-[4rem] font-mooli relative`}>
       <p className={`text-5xl w-[70%] tracking-wider font-bold leading-normal`}>Elevate Your Emailing Experience with Web3 Magic</p>
       <p className={`mt-7  w-[40%] text-white/70 text-xl`}>Web3-powered email for tomorrow&apos;s seamless communication experience, generating sales, closing clients and many more </p>
       <button className={`bg-[#64FCDA] rounded-full px-8 py-3  mt-6 text-white font-semibold `}>TRY OUT NOW</button>
       <p className={`text-6xl w-full  text-[#64FCDA] tracking-wide font-extrabold leading-normal mt-auto text-center`}>Powerfull Mailing </p>
       <img src="/img/mail.png" alt="mailbox" className={`float-right  w-[40%] absolute right-3 bottom-12   select-none`} draggable='false' />
       <img src="/img/post1.png" alt="mailbox" className={`  w-[4rem] absolute mix-blend-screen invert right-10 top-20 animate-bounce   select-none`} draggable='false' />
       <img src="/img/post2.png" alt="mailbox" className={`  w-[4.5rem] absolute mix-blend-screen invert right-72 top-32 animate-bounce2   select-none`} draggable='false' />
       <img src="/img/post3.png" alt="mailbox" className={`  w-[3rem] absolute mix-blend-screen invert right-32 top-40 animate-bounce3   select-none`} draggable='false' />
      </section>
      <Feature/>
      <section className={`w-[96%] md:w-[90%] min-h-[45vh] grid md:grid-cols-[1fr_3fr] grid-cols-1 px-20  bg-[#8338ec] text-white py-24  mt-20 rounded-[4rem] font-mooli relative`}>
      <img src="/img/mail2.png" alt="mailbox" className={`float-right mix-blend-screen  w-full select-none`} draggable='false' />
       <div className={`px-20`}>
        <h1 className={`text-4xl text-[#64FCDA] font-bold mb-5`}>Embark on a Web3 Odyssey with Qryptopost</h1>
        <p className={`text-white/80 text-sm`}>Our Web3-powered platform brings unparalleled security and innovation to your inbox. Say goodbye to outdated communication methods and embrace a seamless, next-generation emailing experience. Join us and be at the forefront of the digital communication revolution. Get started now!</p>
        <button className={`bg-[#64FCDA] rounded-full px-8 py-3  mt-6 text-white font-semibold `}>IT&apos;S FREE</button>
       </div>
      </section>
     <FAQ/>
    </div>
  )
}

export default Homepage