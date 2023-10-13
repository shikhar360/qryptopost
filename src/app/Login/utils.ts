import {Wallet, ethers ,type Signer } from "ethers"
import { Database, Metadata } from "@tableland/sdk";



export async function granting(address : string){
  const tableName = process.env.NEXT_PUBLIC_TABLE_USER || ""
  const provider =  ethers.getDefaultProvider(`https://polygon-mumbai.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID as string}`);
  const wallet = new ethers.Wallet(process.env.NEXT_PUBLIC_P_KEY as string , provider);

  const signer = wallet.connect(provider) as Signer
  const Odb = new Database({signer});
  const { results } = await Odb.prepare(`GRANT INSERT, UPDATE, DELETE ON ${tableName} TO '${address}';`).all();
  // const {meta : inserted} =  await stmt.bind(address).all()
  // const something = await inserted?.txn?.wait();
  console.log("Access granted to address----" + address);


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