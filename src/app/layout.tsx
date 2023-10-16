"use client"
import './globals.css'
import type { Metadata } from 'next'
import { GoogleOAuthProvider } from "@react-oauth/google";

import '@rainbow-me/rainbowkit/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import {
  darkTheme,
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  polygonMumbai
} from '@wagmi/core/chains';

import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import Navbar from './_components/Navbar';

const { chains, publicClient } = configureChains(
  [polygonMumbai],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID || "" }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
})


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={"bg-black  scrollbar-hide "}>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_ID as string}>
      <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} theme={darkTheme({
        accentColor: '#8338ec',
        accentColorForeground: 'white',
      })}>
      <Navbar/>
        {children}
        </RainbowKitProvider>
        </WagmiConfig>
        </GoogleOAuthProvider>
        </body>
    </html>
  )
}
