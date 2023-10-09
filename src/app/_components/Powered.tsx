import React from 'react'

const Powered = () => {
  const val = [
    '/img/polygon.jpg',
    '/img/wagmi.png',
    '/img/rainbow.png',
    '/img/tableland.png',
  ]

  function marq(data: string[]) {
    return (
      <div
        className={`thread min-w-max  md:h-[7rem] h-[5rem]  text-center animate-slide group-hover:pause flex-shrink-0 text-[#000] overflow-x-hidden  `}
      >
        {data.map((el, index) => (
          <span key={index} className={`  items-center justify-center`}>
            <img
              src={el}
              alt="testi"
              draggable={false}
              loading="lazy"
              className={` w-max mr-10 inline-block h-full  rounded-xl     `}
            />
          </span>
        ))}
      </div>
    )
  }
  return (
    <>
      <h1
        className={`  text-3xl text-center  pb-14 font-jakarta pt-32 font-bold `}
      >
        Powered By
      </h1>
      <div
        className={` md:w-[60%] w-[80%] overflow-hidden mx-auto bg-white md:rounded-3xl rounded-3xl    `}
      >
        <div
          className={`h-max overflow-x-hidden w-max flex group font-mono text-sm  group z-20 mx-auto select-none   `}
        >
          {marq(val)}

          {marq(val)}
        </div>
      </div>
    </>
  )
}

export default Powered
