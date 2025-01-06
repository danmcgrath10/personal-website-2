"use client";

import React from 'react'
import { TextGenerateEffect } from './ui/text-generate-effect'
import MagicButton from './MagicButton'
import { FaLocationArrow } from 'react-icons/fa'
import { AuroraBackground } from './ui/aurora-background'
import { motion } from "framer-motion";

const Hero = () => {
  return (
     <AuroraBackground
      className='h-screen w-screen relative flex flex-col items-center justify-center'
      showRadialGradient={true}
     >
       <motion.div
          initial={{ opacity: 0.0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="h-full w-full relative flex flex-col gap-4 items-center justify-center px-4"
        >

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
      </motion.div>
     </AuroraBackground>
  )
}

export default Hero
