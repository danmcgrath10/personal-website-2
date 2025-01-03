import React from 'react'
import { Spotlight } from './ui/Spotlight'
import { TextGenerateEffect } from './ui/text-generate-effect'
import MagicButton from './MagicButton'
import { FaLocationArrow } from 'react-icons/fa'

const Hero = () => {
  return (
    <div className='pb-20 pt-36'>
      <div>
        <Spotlight className='-top-40 -left-10 
        md:-left-32 md:-top-20 h-screen' fill='white'/>
        <Spotlight className='-top-10 -left-full h-[80vh] v-[50vw]' fill='purple'/>
        <Spotlight className='-top-28 -left-80 h-[80vh] v-[50vw]' fill='blue'/>
      </div>
      <div className="h-screen w-full dark:bg-black-100 bg-white  dark:bg-grid-white/[0.03] bg-grid-black/[0.2] flex items-center justify-center absolute top-0 left-0">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black-100 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <p className="text-4xl sm:text-7xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8">
        </p>
      </div>

      <div className='flex justify-center relative my-20 z-10'>
        <div className='max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center justify-center'> 
            <h2 className='uppercase tracking-widest text-xs text-center text-blue-100 max-w-80'>
                Welcome to my portfolio!
            </h2>
            <TextGenerateEffect
                className='text-center text-[40px] md:text-5xl lg:text-6xl'
                words='Creating Software Solutions That Make an Impact'
            />
            <p className='text-center'>
                Hi, I&apos;m a software engineer based in Boston, MA.
            </p>
            <a href='#about' >
                <MagicButton
                    title = 'Check out my work'
                    icon = {<FaLocationArrow />}
                    position='right'
                />
            </a>
        </div>
      </div>
    </div>
  )
}

export default Hero
