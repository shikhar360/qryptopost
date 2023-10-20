import {create} from "zustand"

interface IStore {
  ethAddr: string
  xmtpclient: any
  username: string
  userEmail : string
  avatar : string
  subs : any
  setEthAddr : (addr: string) => void
  setSubs : (data : string) => void
  setusername : (name : string) => void
  setuserEmail : (email : string) => void
  setavatar : (img: string) => void
  setXMTP : (data: any) => void
}


export const useStore = create<IStore>((set)=>(
  {
    ethAddr : "",
    xmtpclient : "",
    username : "",
    userEmail : "",
    avatar : "",
    subs : [],
    setEthAddr : (addr : string)=>set((state) => ({ ...state , ethAddr : addr})),
    setusername : (name : string)=>set((state) => ({ ...state , username : name})),
    setuserEmail : (email : string)=>set((state) => ({ ...state , userEmail : email})),
    setavatar : (img : string)=>set((state) => ({ ...state , avatar : img})),
    setSubs : (data : any)=>set((state) => ({ ...state , subs : data})),
    setXMTP : (data : any)=>set((state) => ({ ...state , xmtpclient : data})),
  }
))

