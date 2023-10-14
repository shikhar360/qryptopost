import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        slide: 'slide 20s linear infinite',
        bounce: "bounceA 5s infinite",
        bounce2: "bounceA 7s infinite",
        bounce3: "bounceA 10s infinite",
      },
      keyframes: {
        slide: {
          '0%': {
            transform: 'translateX(0px)',
          },
          '100%': {
            transform: 'translateX(-100%)',
          },
        },
        bounceA: {
          "0%": {
            transform: "translate(0px , 10px) ",
          },
          "30%": {
            transform: "translate(15px , 10px) ",
          },
          "70%": {
            transform: "translate(10px , -15px) ",
          },
         
          "100%": {
            transform: " translate(0px , 10px)",
          },
        },
      },
      fontFamily :{
        jakarta : ['Plus Jakarta Sans', "sans-serif"],
        mooli : ['Mooli', "sans-serif"]
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}
export default config
