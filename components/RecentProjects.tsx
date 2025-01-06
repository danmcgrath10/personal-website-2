import { projects } from '@/data'
import React from 'react'
import { CardBody, CardContainer, CardItem } from './ui/3d-card'
import Image from 'next/image'

const RecentProjects = () => {
  return (
    <div className='py-10' id={'projects'}>
        <h1 className="heading">
            Some of My <br />
            <span className='text-purple'>Recent Projects</span>
        </h1>
        <div className='flex flex-wrap items-center justify-center p-4 mt-10 gap-16'>
            {projects.map((project) => (
                <CardContainer className="inter-var">
                    <CardBody className="relative group/card  dark:hover:shadow-2xl bg-black-100 w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
                        <CardItem translateZ="100" className="w-full mt-4">
                            <Image
                                src={project.img}
                                height="1000"
                                width="1000"
                                className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                                alt="thumbnail"
                            />
                        </CardItem>
                        <CardItem
                            translateZ="50"
                            className="text-xl font-bold text-neutral-600 dark:text-white"
                        >
                            {project.title}
                        </CardItem>
                        <CardItem
                            as="p"
                            translateZ="60"
                            className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                        >
                            {project.des}
                        </CardItem>
                        <div className="flex justify-between items-center mt-20">
                            <CardItem
                                translateZ={20}
                                target="__blank"
                                className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
                            >
                                <div className="flex items-center">
                                    {project.iconLists.map((icon, index) => (
                                        <div
                                            key={index}
                                            className="border border-white/[.2] rounded-full bg-black lg:w-10 lg:h-10 w-8 h-8 flex justify-center items-center"
                                            style={{
                                                transform: `translateX(-${5 * index + 2}px)`,
                                            }}
                                        >
                                            <img src={icon} alt="icon5" className="p-2" />
                                        </div>
                                    ))}
                                </div>
                            </CardItem>
                        </div>
                    </CardBody>
                </CardContainer>
            ))}
        </div>
    </div>
  )
}

export default RecentProjects
