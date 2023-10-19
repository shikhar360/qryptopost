"use client";
import React, { useState  , useEffect} from "react";
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { AccsDefaultParams, AuthSig, AuthCallback } from "@lit-protocol/types";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/store/Store"
import { Database, Metadata } from "@tableland/sdk";
import { ToastContainer, toast, Flip } from 'react-toastify';
import {  useAccount } from "wagmi";
interface IMail {
  sender: string;
  receiver: string;
  // time : string
  subject: string;
  content: string;
}

const Sendbox = ({ params }: { params: { address: string } }) => {
  const litNodeClient = new LitJsSdk.LitNodeClient({
      litNetwork: "cayenne"
  });
  const searchParams = useSearchParams();
  const receiver = searchParams.get("receiver");

  // const address = useStore((state)=> state.ethAddr)
  const usersTable = process.env.NEXT_PUBLIC_TABLE_USER || "";
  const [address , setAddress] = useState<string>('')
  const {address :addr , isConnected} = useAccount()

  useEffect(()=>{
    if(!addr)return
    setAddress(addr as string)
  },[])

  const db = new Database();
  const inbox= process.env.NEXT_PUBLIC_TABLE_INBOX || ""
  const [data, setData] = useState<IMail>({
    sender: params.address || "",
    receiver: receiver || "",
    subject: "",
    content: "",
  });
  // {params.address}  needd to check the user maybe set the global state with zustand


  const condition = (  receiverwallet: string) =>{
    if(!receiverwallet ){
      console.log("provide what wallets can see that message");
      return
    }
    return  [
      {
        contractAddress: '',
        standardContractType: '',
        chain: 'mumbai',
        method: '',
        parameters: [':userAddress'],
        returnValueTest: {
          comparator: '=',
          value: receiverwallet ,
        },
      }
    ];

    // return [
    //   {
    //     contractAddress: "",
    //     standardContractType: "",
    //     chain: 'mumbai',
    //     method: "",
    //     parameters: [":userAddress"],
    //     returnValueTest: {
    //       comparator: "=",
    //       value: senderwallet,
    //     },
    //   },
    //   { operator: "or" },
    //   {
    //     contractAddress: "",
    //     standardContractType: "",
    //     chain: 'mumbai',
    //     method: "",
    //     parameters: [":userAddress"],
    //     returnValueTest: {
    //       comparator: ">=",
    //       value: receiverwallet,
    //     },
    //   },
    // ];
  
  }

  const encryption =async ( receiveraddr : string  , mail : string)=>{
    await litNodeClient.connect();

    const authSig = await LitJsSdk.checkAndSignAuthMessage({
      chain: 'mumbai'
    });
  // console.log( "this is the auth sig----------------" ,authSig);
  console.log("starting the ecryption");
  const accs = condition(receiveraddr ) // the onw who will receive
  
  const { ciphertext, dataToEncryptHash }  = await LitJsSdk.encryptString({
    //@ts-ignore
    accessControlConditions: accs,
    authSig,
    chain: 'mumbai',
    dataToEncrypt: mail,
    // @ts-ignore 
  }, litNodeClient);
  
  // const { ciphertext, dataToEncryptHash } : any = await LitJsSdk.encryptString("this is going to be a secret");
  
  // { Loading... } 
  
  console.log("done ecryption" , {ciphertext , dataToEncryptHash});
    
    return {ciphertext , dataToEncryptHash}; // will get posted to tableland

  }
  // "hfF/6X+7Gqu3xc2mSMADO59DRXIZUPOfss/qDU0eBO1f2Oa6zSe16YMpsvL7hxjvj1OhGF6YZCRSmhZUaKlXOilfSWgyewB3ezhqfMysxxYgE26TGBYJDfpcMkizlMAn8ti6ABaA6i45grtCaLFbIfUD"

  // "368a693d784c7d1957ec748148a5de1e1f2e97f1f6360c69b0cfcf6471bbbf07"

  // const somedata = 

async function test (){
  try{
    // const date = new Date()
    // const caldate = new Date().toLocaleDateString();
    // const time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    // console.log(caldate+" "+time);
    // console.log(address);
    // const { results } = await db.prepare(`SELECT * FROM ${inbox} WHERE receiver = ?;`).bind(address).all();
    // console.log(results[0]);


    const data =  encryption( "0x3aD7CBc5927a40ab90c2cEAEdD8Bf2489B2659C4" , "the secret tst") 
    console.log(data)


  }catch(err){console.log(err)}
}


  async function test2 (){
   try{
   
    const data2 = decrypt( "jrJOMN1/PFNFk29Dr2Sbzy9qM1l+mQnuwuNWrUMeh74X3OSmR5teIfp6QycVvl8OREoawnmrxeaYzQhF2l9tHbGre2Cybe3AMPCyHIXuHVIgxr+jYZUvZaGQBj7ewtcdTk3eYrMRKNVrr8ZUeYkdI7cD" , "7927a2582b34e24f51f8e4cbc43f4ccb04522215449ecd8609b699d4d1d582b9" )
    console.log(data2) //receiver while 

   }catch(err){console.log(err)}
  }



  const decrypt = async( ciphertext : string , dataToEncryptHash : string )=>{
    // console.log(obj);
    await litNodeClient.connect();
    const authSig = await LitJsSdk.checkAndSignAuthMessage({
      chain: 'mumbai'
    });
    console.log( "startind decryption" );
    // const ciphertext = obj.ciphertext;
    const accs = condition(address ) // this need to get changed should be receivers (the current user if he is the receiver)
    
    // const dataToEncryptHash = obj.dataToEncryptHash;
    
    const decryptedString = await LitJsSdk.decryptToString({
      accessControlConditions: accs,
      ciphertext,
      dataToEncryptHash,
      authSig: authSig,
      chain: 'mumbai',
    },
    litNodeClient,
    );
    // console.log( "startind decryption" );
    
    console.log("decryptedString:",  decryptedString);
    return decryptedString
  }
  
  
  // console.log(data)
  async function sendMail(mail: IMail , isEncrypted : boolean = false) {
    // check if the usr is on the table if not then create one or if yes then send the messge
    //  need to check if the user is you before sending

    try{


      if (mail.sender !== address){
        toast.error("Enter your connected Wallet Address")
        return
      }

      if(!mail.sender || !mail.receiver || !mail.subject || !mail.content){
        toast.error("Please fill all details 😅")
        return
      }

       const  check : {ethAddress? : string , xmtped? : string} = await db.prepare(
        `SELECT * FROM ${usersTable} WHERE ethAddress = ? ;`
       )
      .bind(address)
      .first();
      
      console.log(check);

      if(!check || !check?.ethAddress){
       toast.error("Login as a user first 🤖")
       return
      }
      //  if yesthen send him the inbox
      const date = new Date()
      const caldate = new Date().toLocaleDateString();
      const time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
      const sendedAt = caldate+" "+time



       if(isEncrypted){
        const data = await encryption( mail.receiver , "the secret tst") 
        if(!mail.receiver)toast.error("Atleast tell whome to send message")
         console.log(data)
         const stmt =  db.prepare(
           `INSERT INTO ${inbox} (sender, receiver, time, subject, cipher, datahash, random) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)`
           )
           await stmt.bind(mail.sender , mail.receiver , sendedAt, mail.subject, data.ciphertext , data.dataToEncryptHash , "" ).all()
           toast.success("Mail sent Successfully  🎉 ")
        }
      
       if(!isEncrypted){
         
         const stmt =  db.prepare(
          `INSERT INTO ${inbox} (sender, receiver, time, subject, cipher, datahash, random) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)`
           )
           await stmt.bind(mail.sender , mail.receiver , sendedAt, mail.subject, "notEncrypted" , "notEncrypted", mail.content ).all()
           console.log(stmt)
           toast.success("Mail sent Successfully  🎉 ")
          }
      


      

      }catch(err){console.log(err)}
  }



  async function replying (){

  }
  // sender TEXT NOT NULL,
  // receiver TEXT NOT NULL,
  // time TEXT NOT NULL,
  // subject TEXT NOT NULL,
  // content TEXT NOT NULL,
  // replies TEXT
  // 0x3aD7CBc5927a40ab90c2cEAEdD8Bf2489B2659C4




  function handledata(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setData((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  }
  

  //
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">

      <div onClick={()=>test()}>test</div>
      <div onClick={()=>test2()}>test2</div>
      {/* <div onClick={()=>test2("hfF/6X+7Gqu3xc2mSMADO59DRXIZUPOfss/qDU0eBO1f2Oa6zSe16YMpsvL7hxjvj1OhGF6YZCRSmhZUaKlXOilfSWgyewB3ezhqfMysxxYgE26TGBYJDfpcMkizlMAn8ti6ABaA6i45grtCaLFbIfUD" , "368a693d784c7d1957ec748148a5de1e1f2e97f1f6360c69b0cfcf6471bbbf07")}>test2</div> */}
      <div
        className={`flex flex-col items-start justify-startpy-10  bg-white/10 px-4 py-10 rounded-xl md:w-[50%] w-[90%]`}
      >
        <div className={`flex items-center gap-4 justify-center w-full `}>
          <img className={`w-5`} src="/img/sender.png" alt="img" />
          <input
            onChange={handledata}
            type="text"
            placeholder="From...0xsender "
            name="sender"
            value={data.sender}
            className="text-white bg-transparent border-b mb-4 border-white/20 focus:outline-none  text-start text-sm  w-[80%]  px-2  rounded-sm h-8 "
          />
        </div>
        <div className={`flex items-center gap-4 justify-center w-full `}>
          <img className={`w-5 `} src="/img/receiver.png" alt="img" />
          <input
            onChange={handledata}
            type="text"
            placeholder="To...0xreceiver"
            name="receiver"
            value={data.receiver}
            className="text-white bg-transparent border-b mb-4 border-white/20 focus:outline-none  text-start text-sm  w-[80%]  px-2  rounded-sm h-8 "
          />
        </div>
        <div className={`flex items-center gap-4 justify-center w-full `}>
          <img className={`w-5`} src="/img/sub.png" alt="img" />
          <input
            onChange={handledata}
            type="text"
            placeholder="Subject : Attending my dogs marriage"
            name="subject"
            value={data.subject}
            className="text-white bg-transparent border-b mb-4 border-white/20 focus:outline-none  text-start text-sm  w-[80%]  px-2  rounded-sm h-8 "
          />
        </div>
        <div className={`flex items-start  gap-4 justify-center w-full `}>
          <img className={`w-5`} src="/img/content.png" alt="img" />
          <textarea
            onChange={handledata}
            placeholder="Content : Will be out for some work ........ Reguards"
            name="content"
            value={data.content}
            className="text-white bg-transparent  mb-4 focus:outline-none  text-start resize-none text-sm  w-[80%]   px-2  rounded-sm h-[30vh] "
          />
        </div>
        <div  className={`flex items-start  gap-4 justify-start w-full mx-8 `}>

        <button
      onClick={()=>sendMail(data , true)}
        className="bg-[#8338ec] text-white py-2 px-4   my-3 hover:-translate-y-1 hover:shadow-xl hover:shadow-black rounded-r-full transition-all duration-150 ease-linear"
        >
       Send Encrypted 🔥
      </button>
        <button
          onClick={()=>sendMail(data )}
        className="border-[#8338ec] border text-white py-2 px-4   my-3 hover:-translate-y-1 hover:shadow-xl hover:shadow-black rounded-r-full transition-all duration-150 ease-linear"
        >
       Send 
      </button>
          </div>
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

export default Sendbox;

// export default dynamic (() => Promise.resolve(App), {ssr: false})