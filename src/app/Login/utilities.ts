import {Wallet, ethers ,type Signer } from "ethers"
import { Database, Metadata } from "@tableland/sdk";
import {  toast } from 'react-toastify';

const provider =  ethers.getDefaultProvider(`https://polygon-mumbai.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID as string}`);
const wallet = new ethers.Wallet(process.env.NEXT_PUBLIC_P_KEY as string , provider);

const signer = wallet.connect(provider) as Signer
const Odb = new Database({signer});



export async function grantAll(address : string){
  const tableName = process.env.NEXT_PUBLIC_TABLE_USER || ""
  const { results } = await Odb.prepare(`GRANT INSERT, UPDATE, DELETE ON ${tableName} TO '${address}';`).all();
  // const {meta : inserted} =  await stmt.bind(address).all()
  // const something = await inserted?.txn?.wait();
  console.log("Access granted to address----" + address);
}

export async function clearall(){
  const tableName = process.env.NEXT_PUBLIC_TABLE_USER || ""
  const { results } = await Odb.prepare(`DELETE FROM ${tableName};`).all();
  // const {meta : inserted} =  await stmt.bind(address).all()
  // const something = await inserted?.txn?.wait();
  console.log("deleted everything from usertable----" );
}

export async function grantInsert(address : string){
  const tableName = process.env.NEXT_PUBLIC_TABLE_USER || ""
  const inbox= process.env.NEXT_PUBLIC_TABLE_INBOX || ""
  const reply = process.env.NEXT_PUBLIC_TABLE_REPLYBOX || ""
  const subscribe = process.env.NEXT_PUBLIC_TABLE_SUBSCRIBE || ""
  const { results } = await Odb.prepare(`GRANT INSERT ON ${tableName} TO '${address}';`).all();
  console.log("Insert Access granted to User Table----" );
  toast("Granted you User Table (1/4)" );
  const { results : ib } = await Odb.prepare(`GRANT INSERT ON ${inbox} TO '${address}';`).all();
  console.log("Insert Access granted to INBOX----" );
  toast("Granted you Inox (2/4)" );
  const { results : rp} = await Odb.prepare(`GRANT INSERT ON ${reply} TO '${address}';`).all();
  console.log("Insert Access granted to REPLY----" );
  toast("Granted you Replybox (3/4)" );
  const { results : sub } = await Odb.prepare(`GRANT INSERT ON ${subscribe} TO '${address}';`).all();
  console.log("Insert Access granted to Subscribe----" );
  toast("Granted you Subscribe (4/4)" );
  // const {meta : inserted} =  await stmt.bind(address).all()
  // const something = await inserted?.txn?.wait();
  // toast.success("Granted Insert  🌝")
}




export async function createUserInbox(){
  try{
    

    const { meta: create } = await Odb
    .prepare( `CREATE TABLE testinbox (
      id INTEGER PRIMARY KEY,
      sender TEXT NOT NULL,
      receiver TEXT NOT NULL,
      time TEXT NOT NULL,
      subject TEXT NOT NULL,
      content TEXT NOT NULL,
      replies TEXT
      );`)
      .run();
      const inbox =  create.txn?.name    //thename of the table 
      toast.success("Inbox created 🎉 ")
      console.log(inbox)
      
      if(!inbox){
        toast.error("ERROR creating Inbox")
        console.log("Error while creating the inbox table");
      }
      
      // // insert this into the existing usertable inbox feild
      // const usersTable = process.env.NEXT_PUBLIC_TABLE_USER || ""
      // const { meta: insert } = await Odb
      // .prepare(`INSERT INTO ${usersTable} (inbox) VALUES (?1);`).bind(inbox).run()
      // await insert.txn?.wait();
      // console.log(insert);
      

      // //now need to create 
      // toast.success("Ready to Recieve messages 📩")


    }catch(err){console.log(err)}
}

export async function createsubscribe(){
  try{
    

    const { meta: create } = await Odb
    .prepare( `CREATE TABLE testsubscribe (
      id INTEGER PRIMARY KEY,
      subscriber TEXT NOT NULL,
      service TEXT NOT NULL
      );`)
      .run();
      const subscibe =  create.txn?.name    //thename of the table 
      toast.success("Subscibe created 🎉 ")
      console.log(subscibe)
      
      if(!subscibe){
        toast.error("ERROR creating Subscribe")
        console.log("Error while creating the Subscribe table");
      }
      

    }catch(err){console.log(err)}
}


export async function createReplybox(){
  try{
    

    const { meta: create } = await Odb
    .prepare( `CREATE TABLE testreplies (
      id INTEGER PRIMARY KEY,
      mail_id INTEGER NOT NULL,
      reply TEXT
      );`)
      .run();
      const reply =  create.txn?.name    //thename of the table 
      toast.success("ReplyBOX created 🎉 ")
      console.log(reply)
      
      if(!reply){
        toast.error("ERROR creating Inbox")
        console.log("Error while creating the inbox table");
      }
     

    }catch(err){console.log(err)}
}










// import {Wallet, ethers , type Signer} from "ethers"
// import { Database, Metadata } from "@tableland/sdk";
// export function getProvider(){
//   return ethers.getDefaultProvider(`https://polygon-mumbai.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID || ""}`);
// }
// export function getWallet(){
//   return new Wallet(process.env.NEXT_PUBLIC_P_KEY || "");
// }

// const wallet = new Wallet(process.env.NEXT_PUBLIC_P_KEY as string);
// const provider = ethers.getDefaultProvider(`https://polygon-mumbai.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID as string}`);
// console.log({wallet , provider}); 
// const ownerSigner = wallet.connect(provider) as Signer
// const wallet = new ethers.Wallet(process.env.NEXT_PUBLIC_P_KEY as string);
// const provider = new ethers.providers.UrlJsonRpcProvider(`https://polygon-mumbai.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID as string}`);
// console.log({wallet , provider}); 
// const ownerSigner = wallet.connect(provider) 

// const dbOwner = new Database({ ownerSigner });
// const tableName = process.env.NEXT_PUBLIC_TABLE_USER || ""

// export  async function granting(address : string){
//   const { results } = await dbOwner.prepare(`GRANT INSERT, UPDATE, DELETE ON ${tableName} TO '${address}';`).all();
//   // const {meta : inserted} =  await stmt.bind(address).all()
//   // const something = await inserted?.txn?.wait();
//   console.log(results);

// }