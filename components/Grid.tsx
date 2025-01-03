import React from 'react'
import { BentoGrid, BentoGridItem } from './ui/bento-grid'
import { FaLocationArrow } from 'react-icons/fa'

const Grid = () => {
  return (
    <section id='about'>
      <BentoGrid>
        {
            [
                {id: 1, title: 'Title1', description: 'Description1'}, 
                {id: 2, title: 'Title2', description: 'Description2'}, 
                {id: 3, title: 'Title3', description: 'Description3'}
            ].map((item, index) => (
                <BentoGridItem
                    key={item.id}
                    id = {item.id}
                    title={item.title}
                    description={item.description}
                    icon={<FaLocationArrow />}
                />
            ), [])
        }
      </BentoGrid>
    </section>
  )
}

export default Grid
