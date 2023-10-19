import {create} from "zustand"

interface IStore {
  ethAddr: string
  xmtpclient: any
  setEthAddr : (addr: string) => void
  setXMTP : (data: any) => void
}


export const useStore = create<IStore>((set)=>(
  {
    ethAddr : "",
    xmtpclient : "",
    setEthAddr : (addr : string)=>set((state) => ({ ...state , ethAddr : addr})),
    setXMTP : (data : any)=>set((state) => ({ ...state , xmtpclient : data})),
  }
))

