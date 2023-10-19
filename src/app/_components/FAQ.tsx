"use client"
import React, { useState } from 'react'

const FAQ = () => {
  const faqData = [
    { question: 'Is it Free?', answer: 'Yes' },
    {
      question: 'Will I able to get with send email to anyone ?',
      answer: 'Yes , everyone who has registered their email with us can recieve emails',
    },
    { question: 'Is it free for Marketers', answer: 'Yes , For early users it is free but will charge based on usage' },
    {
      question: 'Any prerequsite ?',
      answer:
        'A metamask , wallectConnect or any hot or cold wallet is required',
    },
    {
      question: 'Will I get paid using it ?',
      answer: 'Indirectly Yes , you can sell your products and also airdrop which will convert user into a paying one',
    },
  ]

  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const toggleAnswer = (index: number) => {
    if (activeIndex === index) {
      setActiveIndex(null)
    } else {
      setActiveIndex(index)
    }
  }

  return (
    <div
      className={`min-h-[80vh] w-[90%] mx-auto flex flex-col text-white py-20 items-center justify-center bg-black pt-40`}
    >
    
      <p className="text-4xl text-white w-full text-center pb-10">Still Have Questions ?</p>
      <div className=" mx-auto  text-white md:w-[40%] w-[80%]  overflow-hidden py-4 rounded-xl   ">
        {faqData.map((item, index) => (
          <div
            key={index}
            className=" rounded-3xl my-4 bg-[#8338ec] select-none py-2 px-4 "
          >
            <div
              className="cursor-pointer flex items-center justify-between"
              onClick={() => toggleAnswer(index)}
            >
              <h3 className="text-base font-semibold  ">{item.question}</h3>

              <img
                src={'/img/plus.png'}
                alt="icon"
                className={` transition-all ${
                  activeIndex === index ? '-rotate-45' : 'rotate-90'
                } duration-200 ease-linear w-10 rounded-full cursor-pointer `}
                draggable="false"
              />
            </div>
            {activeIndex === index && (
              <p className="my-2 text-xs ">{item.answer}</p>
            )}
           
          </div>
        ))}
      </div>
    </div>
  )
}

export default FAQ
