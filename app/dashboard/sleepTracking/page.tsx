import React from 'react'
import { SleepTrackForm } from './SleepTrackForm'
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function SleepTrackingPage() {
    const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/dashboard/sleep");
  }
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
