"use client";

import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { AuthSig } from "@lit-protocol/types";
import { GoogleLogin } from "@react-oauth/google";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { insertEmail , findEmail } from "../utilities";
import { useStore } from "@/store/Store";
import { ToastContainer, toast, Flip } from 'react-toastify';
// import {insertEmail} from
type CredentialResponse = any;

declare global {
  interface Window {
    cbor: any;
  }
}

const RELAY_API_URL =
  process.env.REACT_APP_RELAY_API_URL ||
  "https://relay-server-staging.herokuapp.com";

const REACT_APP_RPC_URL = "https://chain-rpc.litprotcol.com/http";

interface IProfile {
  name: string;
  email: string;
  img: string;
}
const Gmail = () => {
  const [registeredPkpEthAddress, setRegisteredPkpEthAddress] =
    useState<string>("");
  const [googleCredentialResponse, setGoogleCredentialResponse] =
    useState<CredentialResponse | null>(null);
  const [registeredPkpPublicKey, setRegisteredPkpPublicKey] =
    useState<string>("");
  const [alreadyregistered, setalreadyregistered] =
    useState<boolean>(false);

    const avatar = useStore(state => state.avatar)  
    const username = useStore(state => state.username)  
    const Uemail = useStore(state => state.userEmail)  

  // const [ user, setUser ] = useState<any>(undefined);
  const [profile, setProfile] = useState<IProfile>({
    name: "",
    email: "",
    img: "",
  });
  const [status, setStatus] = useState("");
  const setAvatar = useStore(state => state.setavatar)
  const setName = useStore(state => state.setusername)
  const setemail = useStore(state => state.setuserEmail)
  const handleLoggedInToGoogle = async (
    credentialResponse: CredentialResponse
  ) => {
    setStatus("Logged in to Google");
    // login();
    // setUser(credentialResponse)
    console.log("Got response from google sign in: ", credentialResponse);
    const res : any = jwt_decode(credentialResponse.credential)
    // console.log(res)
    if (res?.name){

      setProfile({
        name : res?.name ,
        email : res?.email,
        img : res?.picture
      });
      setAvatar(res?.picture)
      setName(res?.name)
      setemail(res?.email)
     
      if ( await findEmail(res?.email)){
        setalreadyregistered(true)
      }
    }
   
   
   

    setGoogleCredentialResponse(credentialResponse);
  };

  const handleMintPkpUsingGoogleAuth = async (
    credentialResponse: CredentialResponse,
    setStatusFn: (status: string) => void,
    onSuccess: ({
      pkpEthAddress,
      pkpPublicKey,
    }: {
      pkpEthAddress: string;
      pkpPublicKey: string;
    }) => void
  ) => {
    setStatusFn("Minting PKP...");
    toast("Minting PKP 🔥")
    const requestId = await mintPkpUsingRelayerGoogleAuthVerificationEndpoint(
      credentialResponse,
      setStatusFn
    );
    return pollRequestUntilTerminalState(requestId, setStatusFn, onSuccess);
  };

  async function pollRequestUntilTerminalState(
    requestId: string,
    setStatusFn: (status: string) => void,
    onSuccess: ({
      pkpEthAddress,
      pkpPublicKey,
    }: {
      pkpEthAddress: string;
      pkpPublicKey: string;
    }) => void
  ) {
    if (!requestId) {
      return;
    }

    const maxPollCount = 20;
    for (let i = 0; i < maxPollCount; i++) {
      setStatusFn(`Waiting for auth completion (poll #${i + 1})`);
      toast(`Waiting for auth completion (poll #${i + 1})`)
      const getAuthStatusRes = await fetch(
        `${RELAY_API_URL}/auth/status/${requestId}`,
        {
          headers: {
            "api-key": "1234567890",
          },
        }
      );

      if (getAuthStatusRes.status < 200 || getAuthStatusRes.status >= 400) {
        console.warn(
          "Something wrong with the API call",
          await getAuthStatusRes.json()
        );
        setStatusFn("Uh oh, something's not quite right.");
        toast.error("Something went wrong")
        return;
      }

      const resBody = await getAuthStatusRes.json();
      console.log("Response OK", { body: resBody });

      if (resBody.error) {
        // exit loop since error
        console.warn("Something wrong with the API call", {
          error: resBody.error,
        });
        setStatusFn("Uh oh, something's not quite right.");
        toast.error("Uh oh, something's not quite right.")
        return;
      } else if (resBody.status === "Succeeded") {
        // exit loop since success
        console.info("Successfully authed", { ...resBody });
        setStatusFn("Successfully authed and minted PKP!");
        toast.success("Successfully authed and minted PKP ✅")
        onSuccess({
          pkpEthAddress: resBody.pkpEthAddress,
          pkpPublicKey: resBody.pkpPublicKey,
        });
        await insertEmail(profile?.name , profile?.email , resBody.pkpEthAddress )
        return;
      }

      await new Promise((r) => setTimeout(r, 15000));
    }

    // at this point, polling ended and still no success, set failure status
    setStatusFn(`Hmm this is taking longer than expected...`);
  }

  async function mintPkpUsingRelayerGoogleAuthVerificationEndpoint(
    credentialResponse: any,
    setStatusFn: (status: string) => void
  ) {
    setStatusFn("Minting PKP with relayer...");
    toast("Minting PKP with relayer...")

    const mintRes = await fetch(`${RELAY_API_URL}/auth/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": "1234567890",
      },
      body: JSON.stringify({
        idToken: credentialResponse.credential,
      }),
    });

    if (mintRes.status < 200 || mintRes.status >= 400) {
      console.warn("Something wrong with the API call", await mintRes.json());
      setStatusFn("Uh oh, something's not quite right.");
      toast.error("Uh oh, something's not quite right.")
      return null;
    } else {
      const resBody = await mintRes.json();
      console.log("Response OK", { body: resBody });
      setStatusFn("Successfully initiated minting PKP with relayer.");
      toast("Successfully initiated minting PKP with relayer.")
      return resBody.requestId;
    }
  }

  useEffect(() => {
    // async function getLitNodeClient(): Promise<LitJsSdk.LitNodeClient> {
    //   const litNodeClient = new LitJsSdk.LitNodeClient({
    //     litNetwork: "serrano",
    //   });
    //   await litNodeClient.connect();
    //   return litNodeClient;
    // }
  }, []);

  // const litNodeClient = new LitJsSdk.LitNodeClient({
  //   litNetwork: "cayenne",
  // });

  const logOut = () => {
    googleLogout();
    setProfile({
      name: "",
      email: "",
      img: "",
    });
  };

  // const login = useGoogleLogin({
  //   onSuccess: (cred) => {
  //     axios
  //       .get(
  //         `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${cred?.access_token}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${cred?.access_token}`,
  //             Accept: "application/json",
  //           },
  //         }
  //       )
  //       .then((res) => {
  //         setProfile({
  //           name: res.data.name,
  //           email: res.data.email,
  //           img: res.data.picture,
  //         });
  //       })
  //       .catch((err) => console.log(err));
  //   },
  //   onError: (error) => console.log("Login Failed:", error),
  // });

  return (
    // <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_ID as string}>
    <div className="w-full relative overflow-hidden min-h-screen flex flex-col items-center justify-center bg-black">
      {/* <h1 className={`w-[80%]`}>{status}</h1> */}

      <div>
        {profile.img && profile.email ? (
          <div className={`flex flex-col items-center justify-center py-4 px-8 rounded-xl bg-black border-2 border-violet-500 gap-4`}>
            <img src={profile?.img && avatar} alt="user image" className=" rounded-full  w-20 "/>
            {/* <h3>User Logged in</h3> */}
            <p className=" text-3xl  ">{profile?.name && username}</p>
            <p className=" text-base  "> {`Email Address: ${profile?.email}` && Uemail}</p>
            <button className=" text-base border-2 border-violet-500 rounded-xl py-2 px-4 " onClick={logOut}>Log out</button>
          </div>
        ) : (
          
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  handleLoggedInToGoogle(credentialResponse);
                }}
                onError={() => {
                  console.log("Login Failed");
                }}
                type="icon"
                shape="circle"
                useOneTap
              />

          
        )}
      </div>
      <img src={"https://img.icons8.com/external-vectorslab-outline-color-vectorslab/800/external-47-space-and-planets-vectorslab-outline-color-vectorslab.png"} alt="user image"  className="absolute  top-1/2 left-[60%] z-0"/>

      <div
       className={` ${alreadyregistered ? "hidden" : " block"} bg-violet-500 py-2 px-5 rounded-md hover:-translate-y-1 hover:shadow-xl hover:shadow-black mt-20 transition-all duration-200 ease cursor-pointer`}
        onClick={() =>
          handleMintPkpUsingGoogleAuth(
            googleCredentialResponse,
            setStatus,
            ({ pkpEthAddress, pkpPublicKey }) => {
              setRegisteredPkpEthAddress(pkpEthAddress);
              setRegisteredPkpPublicKey(pkpPublicKey);
            }
          )
        }
      >
        Mint PKP 🔥 and Register
      </div>
   
      <ToastContainer
        position="bottom-right"
        theme="dark"
        autoClose={3000}
        hideProgressBar={true}
        transition={Flip}
        />
    
    </div>
  );
};

export default Gmail

// </GoogleOAuthProvider>
