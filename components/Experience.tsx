import { companies, workExperience } from '@/data'
import React from 'react'
import { InfiniteMovingCards } from './ui/infinite-moving-cards'

const Experience = () => {
  return (
    <div className='py-10' id={'experience'}>
        <h1 className="heading">
            My {' '}
            <span className='text-purple'>Experience</span>
        </h1>
        <div className='w-full mt-12'>
            <div className='h-[40vh] md:h-[25vh] rounded-md flex flex-col antialiased items-center relative overflow-hidden'>
                <InfiniteMovingCards
                    items={workExperience}
                    speed='slow'
                    direction='right'
                    pauseOnHover={true} 
                />
            </div>
            <div className='flex flex-wrap items-center justify-center gap-4 md:gap-16 max-lg:mt-10'>
                {companies.map(({id, img, name, nameImg}) => (
                    <div key={id} className='flex md:max-w-60 max-w-32 gap-2'>
                        <img src={img} alt={name} className='md:w-10 w-5' />
                        <img src={nameImg} alt={name} className='md:w-24 w-20' />
                    </div>
                ),)}
            </div>
        </div>
    </div>
  )
}

export default Experience
