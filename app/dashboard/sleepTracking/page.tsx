import React from 'react'
import { SleepTrackForm } from './SleepTrackForm'

export default function SleepTrackingPage() {
  return (
    <div >
      <div className='text-center py-6'>
        <h1 className="text-5xl font-extrabold">The Chrono-Tracker</h1>
        <p>Log Your Environment, Optimize Your Performance.</p>
      </div>
      <SleepTrackForm />
    </div>
  )
}
