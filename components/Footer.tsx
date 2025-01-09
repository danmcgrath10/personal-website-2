import React from 'react'
import MagicButton from './MagicButton'
import { FaLocationArrow } from 'react-icons/fa'
import { socialMedia } from '@/data'
import { LinkPreview } from './ui/link-preview'

const Footer = () => {
  return (
    <footer className='w-full mb-[100px] pb-10 flex items-center flex-col md:mb-5 mt-20' id='contact'>
        <div className="w-full absolute left-0 -bottom-72 min-h-96 overflow-clip">
            <img
            src="/footer-grid.svg"
            alt="grid"
            className="w-full h-full opacity-50 "
            />
        </div>
        <div className='flex flex-col items-center '>
            <h1 className='heading lg:max-w-[45vw]'>
                Let&apos;s <span className='text-purple'> Get In Touch</span>
            </h1>
            <p className='text-white-200 md:mt-10 my-5 text-center'>
                I am always open to new opportunities and collaborations.
            </p>
            <a href='mailto:danmcgrath1035@gmail.com'>
                <MagicButton
                    title='Contact Me'
                    icon={<FaLocationArrow />}
                    position='right'
                />
            </a>
        </div>
        <div className='w-[90vw] flex mt-16 md:flex-row flex-col justify-between items-center'>
            <p className='md:text-base test-sm md:font-normal font-light'>
                Copyright © 2025 Daniel McGrath
            </p>
            <div className='flex items-center md:gap-3 gap-6'>
                {socialMedia.map((profile) => (
                    <div key={profile.id} className='w-10 h-10 cursor-pointer flex items-center justify-center backdrop-filter backdrop-blur-lg saturate-180 saturate-180 bg-opacity-75 bg-black-200 rounded-lg border border-black-300'>
                        <LinkPreview url={profile.url}>
                            <img src={profile.img} alt={profile.id} width={20} height={20} />
                        </LinkPreview>
                    </div>
                ))}
            </div>
        </div>
    </footer>
  )
}

export default Footer
