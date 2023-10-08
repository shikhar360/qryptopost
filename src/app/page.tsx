import Image from 'next/image'
import Chat from './(xmtp)/chat/page'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Homepage from './_components/Homepage'
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white text-black p-24">
     {/* <Homepage/> */}
     <ConnectButton/>
     <Chat/>
    </main>
  )
}
