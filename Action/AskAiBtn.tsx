"use client"


import { useRouter } from 'next/navigation'
import React from 'react'
import { FaRobot } from 'react-icons/fa'

export const AskAiBtn = () => {
    const router = useRouter()
  return (
    <div>

            <button onClick={()=>router.push('/AiCoach')} className="px-6 py-3 text-black bg-gradient-to-l from-secondary to-primary rounded-full hover:scale-105 transition">
                    <FaRobot className="inline-block mr-2" />
                    Ask AI
                  </button>
    </div>
  )
}
