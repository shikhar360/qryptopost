"use client";

import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { AuthSig } from "@lit-protocol/types";
import { GoogleLogin } from "@react-oauth/google";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
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

  // const [ user, setUser ] = useState<any>(undefined);
  const [profile, setProfile] = useState<IProfile>({
    name: "",
    email: "",
    img: "",
  });
  const [status, setStatus] = useState("");

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
        return;
      } else if (resBody.status === "Succeeded") {
        // exit loop since success
        console.info("Successfully authed", { ...resBody });
        setStatusFn("Successfully authed and minted PKP!");
        onSuccess({
          pkpEthAddress: resBody.pkpEthAddress,
          pkpPublicKey: resBody.pkpPublicKey,
        });
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
      return null;
    } else {
      const resBody = await mintRes.json();
      console.log("Response OK", { body: resBody });
      setStatusFn("Successfully initiated minting PKP with relayer.");
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
    <div className="w-full overflow-hidden min-h-screen flex flex-col items-center justify-center bg-black">
      <h1 className={`w-[80%]`}>{status}</h1>

      <div>
        {profile.img && profile.email ? (
          <div>
            <img src={profile?.img} alt="user image" />
            <h3>User Logged in</h3>
            <p>Name: {profile?.name}</p>
            <p>Email Address: {profile?.email}</p>
            <br />
            <br />
            <button onClick={logOut}>Log out</button>
          </div>
        ) : (
          // <button onClick={() => login()}>Sign in with Google 🚀 </button>
          <>
            {/* <div id="logg" className={"bg-black p-4"}> */}
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
            {/* </div> */}
          </>
        )}
      </div>

      <div
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
        Mint PKP
      </div>
      {registeredPkpEthAddress && (
        <div>Registered PKP Eth Address: {registeredPkpEthAddress}</div>
      )}
    </div>
  );
};

export default Gmail

// </GoogleOAuthProvider>
