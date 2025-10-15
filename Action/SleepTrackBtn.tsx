"use client"


import { useRouter } from 'next/navigation'
import React from 'react'

export const SleepTrackBtn = () => {
    const router = useRouter()
  return (
    <div>

         <button onClick={()=>router.push('/dashboard/sleepTracking')} className="btn   bg-gradient-to-l from-secondary to-primary rounded-full">
           Start Tracking Sleep
          </button>
    </div>
  )
}
