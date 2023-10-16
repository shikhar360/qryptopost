import {create} from "zustand"

interface IStore {
  ethAddr: string
  setEthAddr : (addr: string) => void
}


export const useStore = create<IStore>((set)=>(
  {
    ethAddr : "",
    setEthAddr : (addr : string)=>set((state) => ({ ...state , ethAddr : addr}))
  }
))

