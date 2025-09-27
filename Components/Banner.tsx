import Image from 'next/image'
import React from 'react'
import Container from './Container'

export const Banner = () => {
  return (
    <Container >
        <section className='flex flex-col lg:flex-row justify-between items-center'>
            <div className='space-y-4'>
                <h1 className='text-accent font-bold text-2xl lg:text-5xl'>SleepSync- 
                    builds <br /> healthy 
                    sleep habits
                </h1>
                <p className='text-accent'>Track your sleep 
                stay consistent and 
                get AI <br /> powered Tips 
                for better rest
                </p>
                <button className='btn  text-accent bg-gradient-to-l from-secondary to-primary rounded-full'>Get Started</button>
            </div>
            <div>
                <Image src="/images/heroBg.png" alt="girl sleeping in bed" width={500} height={500} ></Image>
            </div>
        </section>
    </Container>
  )
}
