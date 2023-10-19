import React from 'react'

const Feature = () => {
  return (
    <div className={`w-[90%] min-h-screen pt-40 mx-auto  bg-black`}>
      <p className={` text-4xl font-bold text-center`}>Meet the Future of Emailing</p>
      <div className={`grid grid-cols-3 mt-20`}>
        <div className={`w-[80%] h mx-auto shadow-lg shadow-black/10 rounded-xl flex flex-col items-center justify-start px-8 py-10 `}> 
          <img src="https://img.icons8.com/external-smashingstocks-isometric-smashing-stocks/150/000000/external-Secure-fintech-smashingstocks-isometric-smashing-stocks.png" alt="secure" className={` `} />
          <h1 className={`text-2xl font-semibold pt-5`}>Cutting Edge Security</h1>
          <p className={`text-sm text-white/50 pt-5 text-center`}>The Qryptopost is completely secure with the the cutting edge tecnology of blockchain </p>
        </div>
        <div className={`w-[80%] h mx-auto shadow-lg shadow-black/10 rounded-xl flex flex-col items-center justify-start px-8 py-10 `}> 
          <img src="https://img.icons8.com/ios/150/64FCDA/relax.png" alt="secure" className={` `} />
          <h1 className={`text-2xl font-semibold pt-5`}>Easy to Use</h1>
          <p className={`text-sm text-white/50 pt-5 text-center`}>The Qryptopost is built keeping in mind that a 5 year old can also use that with super ease </p>
        </div>
        <div className={`w-[80%] h mx-auto shadow-lg shadow-black/10 rounded-xl flex flex-col items-center justify-start px-8 py-10 `}> 
          <img src="https://img.icons8.com/external-flatart-icons-flat-flatarticons/150/000000/external-rocket-strategy-flatart-icons-flat-flatarticons-1.png" alt="secure" className={` `} />
          <h1 className={`text-2xl font-semibold pt-5`}>Quick as Rocket</h1>
          <p className={`text-sm text-white/50 pt-5 text-center`}>Qryptopost mainly focus on how fast we can execute a operation. This is mainly done to improve the user experience</p>
        </div>
      </div>
    </div>
  )
}

export default Feature