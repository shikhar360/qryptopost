# Qryptopost

One of the first web3 emailing and marketing solution where any user in the world with just a Metamask Wallet or Gmail can SEND and RECEIVE mails (encrypted || non-encrypted)

Users also can subscribe to the various SERVICES or people who are doing newsletter or something similiar thing in order to get updated about any event, airdrop etc thats happening around the corner. 

Marketeers can also leverage this app to send mails to users who have subscribed him in bulk without any limit.


### Problem Statement

As the web3 era is evolving the existence of "advertisements" is now comming to an end. Since the "advertisements" was the major reason to boost up the sales , people will eventually move to emailing solutions.

In  order to solve this issue I have built this app QRYPTOPOST.

Qryptopost is the first mailing solution that lets you read the mails by just connecting your wallet OR GMAIL 

#### Features 
- Send/Receive Encrypted or Normal Mails to any ETHEREUM ADDRESS
- Generate programable wallets based on Gmail address
- Send Mails to any GMAIL ACCOUNT
- Can Reply to Mails
- Data getting stored totally decentralized
- Can Invite non-users
- Reterive wallet address of all subscribers
- Can Mass-Mail to subscribers

### Tech Stack

#### -------------- TABLELAND -----------------

> STUDIO Team Name :
>
> shikkhar  -->     [https://studio.tableland.xyz/shikkhar](https://studio.tableland.xyz/shikkhar)
>
> Dev Address :
>
> 0x26f52740670Ef678b254aa3559d823C29122E9c2
>
> STUDIO PROJECT Name :
>
> Qryptopost  -->     [https://studio.tableland.xyz/shikkhar/qryptopost](https://studio.tableland.xyz/shikkhar/qryptopost)

**How is is getting used ?**

This app was not possible without tableland

I am using tableland for creating 5 tables (users , inbox , reply , subscribe , channel )

**Login** --> When the user is getting logged in all the necessary data is getting stored in the users table , this is later getting used to perform checks and later in other tables for getting data. 

Not only in "Login with wallet" page but in "Login with Gmail" page as well

Login Page :  [https://github.com/shikhar360/qryptopost/blob/main/src/app/Login/page.tsx](https://github.com/shikhar360/qryptopost/blob/main/src/app/Login/page.tsx)

Gmail Login : [https://github.com/shikhar360/qryptopost/blob/main/src/app/Login/Gmail/page.tsx](https://github.com/shikhar360/qryptopost/blob/main/src/app/Login/Gmail/page.tsx)


**Mail** --> All the mails are getting fetched in the mail section using tableland sdk and I am also using the same to send mails as well

Mail Page (Line : 125-205) --> [https://github.com/shikhar360/qryptopost/blob/main/src/app/mail/page.tsx](https://github.com/shikhar360/qryptopost/blob/main/src/app/mail/page.tsx)

Sending Mail --> [https://github.com/shikhar360/qryptopost/blob/main/src/app/mail/%5Baddress%5D/page.tsx](https://github.com/shikhar360/qryptopost/blob/main/src/app/mail/%5Baddress%5D/page.tsx)

Other --> Other pages like the channel , marketers are using tableland sdk to do the inserting operations , Services is reading all the data from the services 's table and also letting user to subscribe to the othe user or (newsletter). Marketers page is inserting in the channel's table 

Marketer Page --> [https://github.com/shikhar360/qryptopost/blob/main/src/app/marketers/page.tsx](https://github.com/shikhar360/qryptopost/blob/main/src/app/marketers/page.tsx)

Services Page --> [https://github.com/shikhar360/qryptopost/blob/main/src/app/channels/page.tsx](https://github.com/shikhar360/qryptopost/blob/main/src/app/channels/page.tsx)



---
#### --------------- LIT PROTOCOL ---------------------


**LIT PROGRAMABLE KEY PAIRS PKP WITH JS SDK V3**

PKP plays an important role in onboarding WEB2 people to this WEB3 app. After Login in with email user will be prompt with an option to mint PKP. The PKP will then generate a publickey and a address which our app will use to receive mails 

PKP (Line : 20 - 230)--> [https://github.com/shikhar360/qryptopost/blob/main/src/app/Login/Gmail/page.tsx](https://github.com/shikhar360/qryptopost/blob/main/src/app/Login/Gmail/page.tsx)



**LIT JS SDK V3**

Lit plays an important role in encrypting and decrypting the data . All the mails that are getting send have an option to either encrypt it or not it will depend on user to whatever he choose 

Encryption (Line : 47 - 92 ) --> [https://github.com/shikhar360/qryptopost/blob/main/src/app/mail/%5Baddress%5D/page.tsx](https://github.com/shikhar360/qryptopost/blob/main/src/app/mail/%5Baddress%5D/page.tsx)

Decryption (Line : 328 - 384 ) --> [https://github.com/shikhar360/qryptopost/blob/main/src/app/mail/page.tsx](https://github.com/shikhar360/qryptopost/blob/main/src/app/mail/page.tsx)

---

#### ------------------- MASK NETWORK ----------------------

Mask Network's api really completes this app like cherry on top of the cake. 

Mask's api enables this app to send mails to people globally. We all have at some point of time got worried about wether the ethereum address that we copied is the real one or not , Mask have made our life easier 

Using it to reterive the ethereum address of people that is getting used to send mails.

Mask Api (Line : 300  - 321 & 608 - 672) --> [https://github.com/shikhar360/qryptopost/blob/main/src/app/mail/page.tsx](https://github.com/shikhar360/qryptopost/blob/main/src/app/mail/page.tsx)

---

#### ---------------- XMTP  NETWORK --------------

People can't miss xmtp when it comes to messaging so us.

All the people that are getting onboarded to this app , while login in I am also making them authenticated to **XMTP**, means if user now wants to carry onn the gaseless conversation with the client they can use this app as well **ANY OTHER APP** that is using XMTP under the hood. Due to time constraint we can only send the message over this app but in future version it will be up and running.

Isn't this sounds cool ? 

Onboarding i.e Authenticating via XMTP (Line : 40 , 79 , 140) --> [https://github.com/shikhar360/qryptopost/blob/main/src/app/Login/page.tsx](https://github.com/shikhar360/qryptopost/blob/main/src/app/Login/page.tsx)


Chat via XMTP (Line : 26 - 196) --> [https://github.com/shikhar360/qryptopost/blob/main/src/app/(xmtp)/chat/page.tsx](https://github.com/shikhar360/qryptopost/blob/main/src/app/(xmtp)/chat/page.tsx)

---

### Bird-eye-View

<img width="1291" alt="Screenshot 2023-10-22 at 1 55 56 AM" src="https://github.com/shikhar360/qryptopost/assets/98407930/7913b1ea-40cf-4ffd-a7fc-9a291ef4d83e">
