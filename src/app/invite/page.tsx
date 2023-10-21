"use client"
import React, { useRef, useState } from 'react';
import emailjs from "@emailjs/browser"
import axios from 'axios';
const ContactForm = () => {
  const [mailto , setMailTo] = useState<string>('')
  const service = process.env.NEXT_PUBLIC_EMAIL as string
  const template = process.env.NEXT_PUBLIC_TEMPLATE as string
  const publicK = process.env.NEXT_PUBLIC_EKEY as string
  const data = {
    to : mailto
};
  
 async function send (){
   if(!mailto)return
  emailjs.send(service , template, data , publicK)
  .then((result) => {
      console.log(result);
      alert("Invitation sent")
  }, (error) => {
      console.log(error.text);
  });

 }

  return (
    <div className="flex h-screen items-center justify-center bg-[#17002B]">
      <div className="bg-violet-900 p-8 rounded-lg w-[30%] shadow-lg">
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Email</label>
          <input
            className="shadow appearance-none border text-white bg-transparent rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="email"
            placeholder="jhon@gmail.com"
            onChange={(e)=>setMailTo(e.target.value)}
          />
        </div>
        <button onClick={()=>send()} className="bg-violet-500 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline">
          Send Invite
        </button>
      </div>
      
    </div>
  );
};

export default ContactForm;
