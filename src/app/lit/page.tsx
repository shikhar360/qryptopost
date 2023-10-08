"use client"
import React from 'react'
import * as LitJsSdk from '@lit-protocol/lit-node-client';
import { AccsDefaultParams, AuthSig, AuthCallback } from "@lit-protocol/types";
const Lit = () => {

    // const client = new LitJsSdk.LitNodeClient({
    //     litNetwork: "cayenne",
    //     debug: false
    // });



    // console.log(litNodeClient);




  //   async function claimkeys(){
  //     await client.connect();

  
  // const authMethod = await session.authenticate({ 
  // //   accessToken: "" //generate rand token
  // // });

  // // // async function handleRedirect() {
  // // //   // Check if app has been redirected from Lit login server
  // // //   if (isSignInRedirect(redirectUri)) {
  // // //     // Get the provider that was used to sign in
  // // //     const provider =  litAuthClient.getProvider(
  // // //       ProviderType.Google,
  // // //     );
  // // //     // Get auth method object that has the OAuth token from redirect callback
  // // //     const authMethod: AuthMethod = await provider.authenticate();
  // // //     return authMethod;‹
  // // //   }
  // // // }

  // //   let res = await client?.claimKeyId({
  // //         authMethod, // provide an auth method to claim a key Identifier mapped to the given auth method
  // //   });
  
  //   }



  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white text-black p-24" >Lit</div>
  )
}

export default Lit