import Image from 'next/image'
import Chat from './(xmtp)/chat/page'
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white text-black p-24">
     hello world
     <Chat/>
    </main>
  )
}
