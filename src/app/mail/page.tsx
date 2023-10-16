"use client"

import Link from "next/link"

export default function Mail() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center overflow-x-hidden  scrollbar-hide">
    
      < Link href={`/mail/${"address"}?receiver=${"thereceiveraddress"}`}>trying the dynamcs</Link>
    </main>
  )
}
